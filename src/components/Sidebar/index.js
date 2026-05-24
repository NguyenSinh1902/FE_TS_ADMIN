import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, Animated, Image } from 'react-native';
import styles from './Sidebar.styles';
import safeAsyncStorage from '../../utils/storage';
import ProfileModal from './ProfileModal';
import staffApi from '../../api/staffApi';

const Sidebar = ({
  activeTab,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    loadUser();
  }, [isProfileVisible]); // Reload user after profile is closed to get updates

  const loadUser = async () => {
    const userStr = await safeAsyncStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setCurrentUser(parsedUser);

      // Fetch fresh data to ensure we have the Firebase avatar URL right after login
      if (parsedUser.idNhanVien) {
        try {
          const freshData = await staffApi.getById(parsedUser.idNhanVien);
          const freshAvatar = freshData?.hinhAnh || freshData?.avatar;
          if (freshAvatar && freshAvatar !== parsedUser.hinhAnh && freshAvatar !== parsedUser.avatar) {
            const updatedUser = { ...parsedUser, hinhAnh: freshAvatar, avatar: freshAvatar };
            setCurrentUser(updatedUser);
            await safeAsyncStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          // Silent fallback to cached data
        }
      }
    }
  };

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
      <Pressable
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
      </Pressable>
    );
  };

  const animValue = useRef(new Animated.Value(isCollapsed ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isCollapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isCollapsed]);

  const sidebarWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['7%', '20%'] // 7% when collapsed, 20% when expanded
  });

  return (
    <Animated.View style={[styles.tabletSidebar, { width: sidebarWidth }]}>
      {/* 1. Header Card */}
      <Pressable
        style={[styles.sidebarHeader, isCollapsed && styles.sidebarHeaderCollapsed]}
        onPress={onToggleCollapse}
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
      </Pressable>

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
        <Pressable
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
        </Pressable>
      </View>

      <ProfileModal
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
        onLogout={handleLogout}
      />
    </Animated.View>
  );
};

export default Sidebar;
