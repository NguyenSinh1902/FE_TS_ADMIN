import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import styles from './Sidebar.styles';
import safeAsyncStorage from '../../utils/storage';
import ProfileModal from './ProfileModal';
import staffApi from '../../api/staffApi';

// Dùng Dimensions.get (static, không subscribe event) thay vì useWindowDimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Pixel tuyệt đối — học từ Cashier (dùng 240/100px)
// Manager dùng tỉ lệ thích ứng theo màn hình
const SIDEBAR_EXPANDED_W = Math.round(SCREEN_WIDTH * 0.18);  // ~190px — gọn hơn (từ 20%)
const SIDEBAR_COLLAPSED_W = Math.round(SCREEN_WIDTH * 0.055); // ~58px — nhỏ hơn (từ 7%)

const Sidebar = ({
  activeTab,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  // Track collapse state nội bộ để start animation NGAY, không chờ prop cycle từ parent
  const isCollapsedRef = useRef(isCollapsed);
  // Track idNhanVien đã fetch để không gọi API avatar nhiều lần
  const fetchedIdRef = useRef(null);

  // Chỉ load user 1 lần khi mount
  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUser = useCallback(async () => {
    const userStr = await safeAsyncStorage.getItem('user');
    if (!userStr) return;
    const parsedUser = JSON.parse(userStr);
    setCurrentUser(parsedUser);

    // Track idNhanVien đã fetch để không gọi API lại khi re-render
    const id = parsedUser.idNhanVien;
    if (id && fetchedIdRef.current !== id) {
      fetchedIdRef.current = id;
      try {
        const freshData = await staffApi.getById(id);
        const freshAvatar = freshData?.hinhAnh || freshData?.avatar;
        if (freshAvatar && freshAvatar !== parsedUser.hinhAnh && freshAvatar !== parsedUser.avatar) {
          const updatedUser = { ...parsedUser, hinhAnh: freshAvatar, avatar: freshAvatar };
          setCurrentUser(updatedUser);
          await safeAsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (_) {
        // Silent fallback to cached data
      }
    }
  }, []);

  // ─── Animation tự quản lý — KHÔNG phụ thuộc vào prop cycle ───────────────────
  // Dùng pixel tuyệt đối thay vì '7%'/'20%' — tránh RN parse string mỗi frame
  const animValue = useRef(new Animated.Value(isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W)).current;

  /**
   * handleToggle: bắt đầu animation NGAY KHI BẤM, không chờ prop từ parent truyền về.
   * Flow cũ: press → onToggleCollapse → setState(parent) → re-render → prop mới → useEffect → animate
   * Flow mới: press → animate ngay → onToggleCollapse (parent cập nhật label visibility)
   */
  const handleToggle = useCallback(() => {
    const nextCollapsed = !isCollapsedRef.current;
    isCollapsedRef.current = nextCollapsed;
    Animated.timing(animValue, {
      toValue: nextCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
      duration: 250,
      useNativeDriver: false,
    }).start();
    // Notify parent để cập nhật label visibility (isCollapsed prop)
    onToggleCollapse?.();
  }, [animValue, onToggleCollapse]);

  // Sidebar width = animValue (pixel) — không cần interpolate
  const sidebarWidth = animValue;

  const handleLogout = async () => {
    setIsProfileVisible(false);
    await safeAsyncStorage.removeItem('token');
    await safeAsyncStorage.removeItem('user');
    if (onNavigate) {
      onNavigate('Start', { reset: true });
    }
  };
  const renderNavItem = (route, label, icon, navParams) => {
    const isActive = activeTab === route && (!navParams || activeTab === 'Dashboard');
    return (
      // TouchableOpacity + delayPressIn={0}: phản hồi ngay khi chạm, không có delay như Pressable
      <TouchableOpacity
        key={route}
        activeOpacity={0.7}
        delayPressIn={0}
        style={[
          styles.tabletNavItem,
          isActive && !navParams && styles.tabletNavItemActive,
          isCollapsed && styles.tabletNavItemCollapsed
        ]}
        onPress={() => onNavigate(route, navParams)}
      >
        <View style={styles.tabletNavIconWrap}>
          <Text style={styles.tabletNavIcon}>{icon}</Text>
        </View>
        {!isCollapsed && (
          <Text style={isActive && !navParams ? styles.tabletNavLabelActive : styles.tabletNavLabel}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Bỏ useEffect([isCollapsed]) cũ — animation không còn chờ prop cycle nữa

  return (
    <Animated.View style={[styles.tabletSidebar, { width: sidebarWidth, flex: undefined }]}>
      {/* 1. Header Card — bấm để toggle sidebar */}
      <TouchableOpacity
        activeOpacity={0.8}
        delayPressIn={0}
        style={[styles.sidebarHeader, isCollapsed && styles.sidebarHeaderCollapsed]}
        onPress={handleToggle}
      >
        <View style={styles.brandGroup}>
          <View style={styles.brandLogo}><Text style={styles.brandLogoText}>🍃</Text></View>
          {!isCollapsed && (
            <View style={styles.brandTitleGroup}>
              <Text style={styles.brandTitle}>MatchTea</Text>
              <Text style={styles.brandSubtitle}>App Quản lý</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 2. Main Navigation Card */}
      <View style={[styles.tabletNavContainer, isCollapsed && styles.tabletNavContainerCollapsed]}>
        {renderNavItem('Dashboard', 'Tổng quan', '🏠')}
        {renderNavItem('AIHistory', 'Lịch sử AI', '✨')}
        {renderNavItem('StaffManagement', 'Nhân viên', '👥')}
        {renderNavItem('Menu', 'Thực đơn', '🍵')}
        {renderNavItem('Facility', 'Cơ sở vật chất', '🏢')}
        {renderNavItem('Finance', 'Tài chính', '💰')}
      </View>

      {/* 3. Footer Profile Card */}
      <View style={[styles.sidebarFooter, isCollapsed && styles.sidebarFooterCollapsed]}>
        <TouchableOpacity
          activeOpacity={0.7}
          delayPressIn={0}
          style={styles.userProfileGroup}
          onPress={() => setIsProfileVisible(true)}
        >
          <View style={styles.avatarWrap}>
            {(currentUser?.hinhAnh || currentUser?.avatar) ? (
              <Image source={{ uri: currentUser.hinhAnh || currentUser.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
            ) : (
              <Text style={styles.avatarInitials}>
                {currentUser?.hoTen ? currentUser.hoTen.split(' ').pop().substring(0, 2).toUpperCase() : 'AD'}
              </Text>
            )}
          </View>
          {!isCollapsed && (
            <View style={styles.userInfoText}>
              <Text style={styles.userName} numberOfLines={1}>{currentUser?.hoTen || 'Quản trị viên'}</Text>
              <Text style={styles.userRole}>Nhân viên quản lý</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ProfileModal
        visible={isProfileVisible}
        onClose={() => {
          setIsProfileVisible(false);
          // Reload user data sau khi đóng modal (có thể đã đổi avatar)
          // Reset fetchedIdRef để cho phép fetch lại
          fetchedIdRef.current = null;
          loadUser();
        }}
        onLogout={handleLogout}
      />
    </Animated.View>
  );
};

export default Sidebar;
