import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, 
  Alert, Dimensions, RefreshControl, LayoutAnimation, UIManager, Platform, StatusBar 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Polyline, Circle, Line } from 'react-native-svg';

import refundApi from '../../api/refundApi';
import invoiceApi from '../../api/invoiceApi';
import safeAsyncStorage from '../../utils/storage';

import Header from '../../components/Header';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';
import { useNotifications } from '../../context/NotificationContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Icons
const Check = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ color = "#64748B" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 20L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FilterIcon = ({ color = "#1B2A15" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AbstractShapes = () => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    {/* Vòng tròn mờ ảo trang trí */}
    <Circle cx="5%" cy="-10" r="80" fill="rgba(16, 185, 129, 0.04)" />
    <Circle cx="80%" cy="100" r="120" fill="rgba(16, 185, 129, 0.03)" />
    {/* Dải sóng gợn nhẹ */}
    <Path d="M0,60 Q150,0 400,50 T1000,40 L1000,0 L0,0 Z" fill="rgba(255, 255, 255, 0.4)" />
    <Path d="M0,0 L0,80 Q250,140 600,60 T1200,80 L1200,0 Z" fill="rgba(16, 185, 129, 0.02)" />
  </Svg>
);

const X = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDown = ({ size = 20, color = "#64748B", expanded }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ReceiptIcon = ({ size = 20, color = "#8BA367" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V4M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4M4 4L20 4M9 9H15M9 13H15M9 17H11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RefundApproval = ({ onNavigate }) => {
  const [userName, setUserName] = useState('Quản trị viên');
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  // Modals state
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { showToast } = useNotifications();

  // Expandable invoice details
  const [expandedId, setExpandedId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [loadingInvoice, setLoadingInvoice] = useState({});

  useEffect(() => {
    loadUser();
    fetchRefunds();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await safeAsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.hoTen || 'Quản trị viên');
      }
    } catch (e) {}
  };

  const fetchRefunds = async () => {
    try {
      const data = await refundApi.getAll();
      if (Array.isArray(data)) {
        const pending = data.filter(r => r.trangThai === 'CHO_DUYET');
        // Sắp xếp mới nhất lên đầu
        pending.sort((a, b) => new Date(b.thoiGianTao) - new Date(a.thoiGianTao));
        setRefunds(pending);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hoàn trả:', error);
      showToast('Lỗi', 'Không thể lấy dữ liệu phiếu hoàn trả.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRefunds();
  };

  const handleApprove = async (idPhieu) => {
    try {
      setProcessingId(idPhieu);
      await refundApi.approveRefund(idPhieu, true);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRefunds(prev => prev.filter(r => (r.idPhieuHoanTra || r.idPhieu || r.id) !== idPhieu));
      showToast('Thành công', 'Đã duyệt yêu cầu hoàn tiền!', 'success');
    } catch (error) {
      console.error('Lỗi khi duyệt:', error);
      showToast('Lỗi', 'Không thể duyệt yêu cầu hoàn tiền.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (idPhieu) => {
    try {
      setProcessingId(idPhieu);
      await refundApi.approveRefund(idPhieu, false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRefunds(prev => prev.filter(r => (r.idPhieuHoanTra || r.idPhieu || r.id) !== idPhieu));
      showToast('Thành công', 'Đã từ chối yêu cầu hoàn tiền.', 'success');
    } catch (error) {
      console.error('Lỗi khi từ chối:', error);
      showToast('Lỗi', 'Không thể từ chối yêu cầu hoàn tiền.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = async (item) => {
    const idPhieu = item.idPhieuHoanTra || item.idPhieu || item.id;
    const isExpanding = expandedId !== idPhieu;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(isExpanding ? idPhieu : null);

    if (isExpanding && !invoiceDetails[idPhieu]) {
      const invoiceId = item.idHoaDon || item.hoaDon?.idHoaDon;
      if (invoiceId) {
        try {
          setLoadingInvoice(prev => ({ ...prev, [idPhieu]: true }));
          const res = await invoiceApi.getById(invoiceId);
          setInvoiceDetails(prev => ({ ...prev, [idPhieu]: res }));
        } catch (error) {
          console.error('Lỗi lấy chi tiết HD:', error);
        } finally {
          setLoadingInvoice(prev => ({ ...prev, [idPhieu]: false }));
        }
      }
    }
  };

  const renderItem = ({ item }) => {
    const idPhieu = item.idPhieuHoanTra || item.idPhieu || item.id;
    const invoiceId = item.idHoaDon || item.hoaDon?.idHoaDon;
    const isExpanded = expandedId === idPhieu;
    const details = invoiceDetails[idPhieu];
    const isLoadingDetail = loadingInvoice[idPhieu];

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardHeader} 
          activeOpacity={0.7} 
          onPress={() => toggleExpand(item)}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={styles.iconBox}>
                <ReceiptIcon size={18} color="#059669" />
              </View>
              <Text style={styles.invoiceId}>Hóa đơn #{invoiceId}</Text>
            </View>
            <Text style={styles.time}>{new Date(item.thoiGianTao).toLocaleString('vi-VN')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={styles.amount}>{item.soTienHoan?.toLocaleString()}đ</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.expandText}>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</Text>
              <ChevronDown expanded={isExpanded} size={16} color="#8BA367" />
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Lý do khách hàng / thu ngân yêu cầu hoàn:</Text>
              <Text style={styles.reasonText}>{item.lyDo}</Text>
            </View>

            {isLoadingDetail ? (
              <ActivityIndicator color="#8BA367" style={{ marginVertical: 20 }} />
            ) : details ? (
              <View style={styles.invoiceDetailBox}>
                <Text style={styles.invoiceDetailTitle}>Chi tiết đơn hàng</Text>
                {details.danhSachChiTiet?.map((mon, idx) => {
                  let optionsText = mon.tenKichCo || '';
                  try {
                    if (mon.tuyChonJson) {
                      const opts = JSON.parse(mon.tuyChonJson);
                      if (opts.da) optionsText += ` • Đá: ${opts.da}`;
                      if (opts.duong) optionsText += ` • Đường: ${opts.duong}`;
                    }
                  } catch (e) {}
                  
                  const toppingNames = (mon.danhSachTopping || []).map(t => t.tenTopping).join(', ');
                  if (toppingNames) {
                    optionsText += optionsText ? `\n+ Topping: ${toppingNames}` : `+ Topping: ${toppingNames}`;
                  }

                  return (
                  <View key={idx} style={styles.invoiceItemRow}>
                    <Text style={styles.invoiceItemQty}>{mon.soLuong}x</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invoiceItemName}>{mon.tenSanPham || mon.monHinhAnh}</Text>
                      {optionsText ? (
                        <Text style={styles.invoiceItemNote}>{optionsText}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.invoiceItemPrice}>{(mon.thanhTien || (mon.giaBan * mon.soLuong))?.toLocaleString()}đ</Text>
                  </View>
                )})}
                
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính</Text>
                  <Text style={styles.summaryValue}>{(details.tongTienHang || 0).toLocaleString()}đ</Text>
                </View>
                {(details.giamGiaKhuyenMai || 0) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Khuyến mãi / Giảm giá</Text>
                    <Text style={[styles.summaryValue, { color: '#10B981' }]}>-{(details.giamGiaKhuyenMai).toLocaleString()}đ</Text>
                  </View>
                )}
                {(details.tongTienThue || 0) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Thuế & Phụ phí</Text>
                    <Text style={styles.summaryValue}>+{(details.tongTienThue).toLocaleString()}đ</Text>
                  </View>
                )}
                <View style={styles.summaryRowTotal}>
                  <Text style={styles.summaryTotalLabel}>TỔNG THANH TOÁN</Text>
                  <Text style={styles.summaryTotalValue}>{(details.tongThanhToan || 0).toLocaleString()}đ</Text>
                </View>
              </View>
            ) : (
              <Text style={{ fontStyle: 'italic', color: '#94A3B8', textAlign: 'center', marginTop: 10 }}>Không tải được chi tiết đơn hàng</Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.rejectBtn]} 
            activeOpacity={0.8}
            onPress={() => handleReject(idPhieu)}
            disabled={processingId === idPhieu}
          >
            {processingId === idPhieu ? <ActivityIndicator color="#EF4444" /> : (
              <>
                <X size={18} color="#EF4444" />
                <Text style={styles.rejectBtnText}>Từ chối</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.approveBtn]} 
            activeOpacity={0.8}
            onPress={() => handleApprove(idPhieu)}
            disabled={processingId === idPhieu}
          >
            <LinearGradient 
              colors={['#10B981', '#059669']} 
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
              style={styles.gradientBtn}
            >
              {processingId === idPhieu ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Check size={18} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>Phê duyệt ngay</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isTablet ? (
        <View style={styles.tabletHeaderWrapper}>
          <LinearGradient 
            colors={['#E6F4EA', '#FFFFFF']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill} 
          />
          <AbstractShapes />
          
          <View style={styles.tabletHeader}>
            <View>
              <Text style={styles.tabletHeaderTitle}>Duyệt hoàn tiền</Text>
              <Text style={styles.tabletHeaderSubtitle}>Quản lý và xét duyệt các yêu cầu hoàn trả</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            
            {/* Search Bar */}
            <View style={styles.searchBox}>
              <SearchIcon />
              <Text style={{ color: '#94A3B8', marginLeft: 8, fontSize: 14 }}>Tìm hóa đơn...</Text>
            </View>

            {/* Filter Button */}
            <TouchableOpacity style={styles.iconBtn}>
              <FilterIcon />
            </TouchableOpacity>

            {/* Noti & Settings */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotiModal(true)}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <View style={{ position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFF' }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettingsModal(true)} activeOpacity={0.7}>
                <SettingsIcon />
            </TouchableOpacity>
          </View>
          </View>
        </View>
      ) : (
        <Header 
          userName={userName}
          title="Duyệt hoàn tiền" 
          unreadCount={0}
          onNotificationPress={() => setShowNotiModal(true)}
          onAvatarPress={() => setShowSettingsModal(true)}
        />
      )}
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : refunds.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🍃</Text>
          <Text style={styles.emptyTitle}>Tất cả đã được giải quyết!</Text>
          <Text style={styles.emptyText}>Hiện không có phiếu yêu cầu hoàn tiền nào đang chờ duyệt.</Text>
          
          <TouchableOpacity 
            style={styles.refreshBtn}
            onPress={fetchRefunds}
          >
            <Text style={styles.refreshBtnText}>Làm mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={refunds}
          keyExtractor={(item, index) => (item.idPhieuHoanTra || item.idPhieu || item.id || index).toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
        />
      )}

      <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} onLogout={() => onNavigate('Start', { reset: true })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Màu nền body xám sáng
  },
  tabletHeaderWrapper: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 10,
    marginBottom: 8,
  },
  tabletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tabletHeaderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: -0.5,
  },
  tabletHeaderSubtitle: {
    fontSize: 14,
    color: '#059669',
    marginTop: 4,
    fontWeight: '500',
    opacity: 0.8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    width: 240,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  refreshBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  refreshBtnText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
  },
  listContainer: {
    padding: 24,
    paddingBottom: 120, // Chừa không gian cho bottom nav
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invoiceId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  time: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  amount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#10B981',
  },
  expandText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8BA367',
    marginRight: 4,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  reasonContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 15,
    color: '#450A0A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  invoiceDetailBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  invoiceDetailTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  invoiceItemRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  invoiceItemQty: {
    fontSize: 15,
    fontWeight: '800',
    color: '#10B981',
    width: 32,
  },
  invoiceItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  invoiceItemNote: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  invoiceItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'dashed',
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rejectBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
  },
  approveBtn: {
    borderWidth: 0,
  },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default RefundApproval;
