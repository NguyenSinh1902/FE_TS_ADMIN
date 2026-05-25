import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../Facility.styles';
import tableApi from '../../../../api/tableApi';
import invoiceApi from '../../../../api/invoiceApi';
import reservationApi from '../../../../api/reservationApi';
import { RefreshControl, ActivityIndicator } from 'react-native';
import { useRealtime } from '../../../../context/RealtimeContext';
import { useNotifications } from '../../../../context/NotificationContext';
import ConfirmModal from '../../../../components/ConfirmModal';

// --- ICONS (TableMap Specific) ---
const ChairIcon = ({ color }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M7 13V21M17 13V21M3 13H21M5 13V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V13" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
);

const ClockIcon = ({ color = "white", stroke = "white" }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2.5" />
        <Path d="M12 7V12L15 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const CalendarIcon = ({ color = "white", stroke = "white" }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="2" />
        <Path d="M16 2V6M8 2V6M3 10H21" stroke={stroke} strokeWidth="2" />
    </Svg>
);

const ReceiptIcon = ({ color = "#6B7280" }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <Path d="M9 14H15M9 10H15M4 21V5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21071 5.46957 3 6 3H18C18.5304 3 19.0391 3.21071 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5V21L16 19L12 21L8 19L4 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const SearchIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
        <Path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const FilterIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const MoreIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="5" r="2" fill="#9CA3AF" />
        <Circle cx="12" cy="12" r="2" fill="#9CA3AF" />
        <Circle cx="12" cy="19" r="2" fill="#9CA3AF" />
    </Svg>
);

const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const EditIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const TrashIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PlusIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19M5 12H19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const RadioItem = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.filterOption} onPress={onPress}>
        <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
        <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
            {selected && <View style={styles.filterInnerCircle} />}
        </View>
    </TouchableOpacity>
);

const AREAS = ['Tất cả', 'Tầng 1', 'Tầng 2', 'Sân vườn', 'Phòng VIP'];


/**
 * Parse thời gian từ server sang epoch ms
 * Xử lý 3 format Java có thể trả về:
 * 1. Epoch ms (number)  → do Firebase push
 * 2. String ISO-8601    → "2026-05-24T00:51:00" hoặc có timezone
 * 3. Array              → [2026, 5, 24, 0, 51, 0, 0] (default Jackson LocalDateTime)
 */
const parseServerTime = (val) => {
    if (val == null) return NaN;
    // 1. Số (epoch ms từ Firebase)
    if (typeof val === 'number') return val;
    // 2. Array [year, month, day, hour, min, sec, nano?]
    if (Array.isArray(val)) {
        const [year, month, day, hour = 0, min = 0, sec = 0] = val;
        // new Date(year, month-1, day, h, m, s) → local device time
        // Emulator chạy UTC+7 giống server → kết quả chính xác
        return new Date(year, month - 1, day, hour, min, sec).getTime();
    }
    // 3. String
    const s = String(val).trim();
    if (!s) return NaN;
    // Đã có timezone info → parse trực tiếp
    if (s.includes('Z') || s.match(/[+-]\d{2}:\d{2}$/)) return new Date(s).getTime();
    // Không có timezone → LocalDateTime server VN → thêm +07:00
    return new Date(s + '+07:00').getTime();
};

const LiveTimer = ({ startTime, textStyle }) => {
    const [elapsed, setElapsed] = useState('00:00:00');

    React.useEffect(() => {
        if (startTime == null) return;
        const start = parseServerTime(startTime);
        if (isNaN(start)) return;

        const updateTimer = () => {
            const diffMs = Date.now() - start;
            if (diffMs <= 0) { setElapsed('00:00:00'); return; }
            const hrs = Math.floor(diffMs / 3600000);
            const mins = Math.floor((diffMs % 3600000) / 60000);
            const secs = Math.floor((diffMs % 60000) / 1000);
            setElapsed(`${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return <Text style={textStyle}>{elapsed}</Text>;
};

export default function TableMapTab({ setIsAnyModalOpen }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const { showToast } = useNotifications();

    // ─── Realtime Firebase ───────────────────────────────
    const { realtimeTables, realtimeOrders, lastTableUpdate } = useRealtime();


    const [localTables, setLocalTables] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Gộp dữ liệu bàn từ API + realtime Firebase
    // Firebase luôn thắng về tinhTrangBan để đảm bảo sync ngay lập tức
    const tables = useMemo(() => {
        if (!localTables.length) return localTables;
        return localTables.map(t => {
            const fbTable = realtimeTables[t.id];
            if (!fbTable) return t;
            let newStatus = t.tinhTrangBan;
            if (fbTable.tinhTrang === 'TRONG') newStatus = 'TRONG';
            else if (fbTable.tinhTrang === 'CO_KHACH') newStatus = 'CO_KHACH';
            else if (fbTable.tinhTrang === 'DA_DAT') newStatus = 'DA_DAT';
            return newStatus === t.tinhTrangBan ? t : { ...t, tinhTrangBan: newStatus };
        });
    }, [localTables, realtimeTables]);

    // Lấy tongThanhToan + thoiGianTao realtime từ Firebase (ưu tiên Firebase > REST API)
    const getRealtimeTongThanhToan = (invoice) => {
        if (!invoice?.idHoaDon) return invoice?.tongThanhToan;
        const fbOrder = realtimeOrders[invoice.idHoaDon];
        return fbOrder?.tongThanhToan ?? invoice?.tongThanhToan;
    };

    // Lấy thoiGianTao: ưu tiên Firebase epoch ms, fallback sang REST API field
    const getTimerStart = (invoice, reservation) => {
        if (invoice?.idHoaDon) {
            const fbOrder = realtimeOrders[invoice.idHoaDon];
            if (fbOrder?.thoiGianTao) return fbOrder.thoiGianTao; // epoch ms từ Firebase (sau khi BE được update)
        }
        // Fallback: lấy từ REST API (LocalDateTime array hoặc string)
        return invoice?.thoiGianTao || reservation?.thoiGianDat;
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCapacity, setFilterCapacity] = useState('ALL');
    const [selectedArea, setSelectedArea] = useState('Tất cả');
    
    const [selectedTable, setSelectedTable] = useState(null);
    const [actionMenu, setActionMenu] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, tenBan: '', sucChua: '', tinhTrangBan: 'TRONG' });
    const [confirmAction, setConfirmAction] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            const tablesRes = await tableApi.getAll().catch(e => {
                console.log('Fetch tables error:', e.message);
                return [];
            });
            const resvRes = await reservationApi.getAll().catch(e => {
                console.log('Fetch reservations error:', e.message);
                return [];
            });
            const invoicesRes = await invoiceApi.getAll().catch(e => {
                console.log('Fetch invoices error:', e.message);
                return [];
            });
            
            const mappedTables = (tablesRes || []).map(t => ({
                id: t.idBan,
                tenBan: t.tenBan,
                sucChua: t.sucChua,
                tinhTrangBan: t.tinhTrangBan
            })).sort((a, b) => a.id - b.id);
            
            setLocalTables(mappedTables);
            setReservations(resvRes || []);
            setInvoices(invoicesRes || []);
        } catch (error) {
            console.error('Fetch facility data error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchAllData();
    }, []);

    // Khi Firebase báo bàn đổi trạng thái → fetch lại invoice + reservation để đồng hồ và tiền hiện ngay
    const fetchSoftRef = React.useRef(null);
    React.useEffect(() => {
        if (!lastTableUpdate) return;
        // Debounce 1s để tránh gọ API quá nhiều
        if (fetchSoftRef.current) clearTimeout(fetchSoftRef.current);
        fetchSoftRef.current = setTimeout(async () => {
            try {
                const [resvRes, invoicesRes] = await Promise.all([
                    reservationApi.getAll().catch(() => null),
                    invoiceApi.getAll().catch(() => null),
                ]);
                if (resvRes) setReservations(resvRes);
                if (invoicesRes) setInvoices(invoicesRes);
            } catch (e) {
                // silent
            }
        }, 1000);
        return () => { if (fetchSoftRef.current) clearTimeout(fetchSoftRef.current); };
    }, [lastTableUpdate]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllData();
    };

    const getTableReservation = (banId) => {
        return reservations.find(r => 
            (r.trangThaiDat === 'DA_DEN' || r.trangThaiDat === 'CHO_DEN') && 
            r.danhSachBan?.some(b => b.idBan === banId)
        );
    };

    const getTableInvoice = (banId, tenBan) => {
        const res = getTableReservation(banId);
        
        // 1. Tìm theo reservation trước (chính xác nhất)
        if (res) {
            const resInv = invoices.find(inv => 
                inv.idPhieuDat === res.idPhieuDat &&
                inv.trangThai !== 'DA_THANH_TOAN' &&
                inv.trangThai !== 'DA_HUY' &&
                inv.trangThai !== 'HOAN_TAT'
            );
            if (resInv) return resInv;
        }

        // 2. Fallback tìm theo tên bàn
        return invoices.find(inv => 
            inv.loaiDonHang === 'TAI_BAN' &&
            inv.trangThai !== 'DA_THANH_TOAN' &&
            inv.trangThai !== 'DA_HUY' &&
            inv.trangThai !== 'HOAN_TAT' &&
            inv.danhSachTenBan?.includes(tenBan)
        );
    };

    const isLocalModalOpen = !!selectedTable || !!actionMenu || !!filterAnchor || showFormModal;
    React.useEffect(() => {
        setIsAnyModalOpen(isLocalModalOpen);
    }, [isLocalModalOpen]);

    const filteredTables = tables.filter(t => {
        const matchSearch = t.tenBan.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || t.tinhTrangBan === filterStatus;
        const matchCapacity = filterCapacity === 'ALL' || t.sucChua.toString() === filterCapacity;
        // In a real app, table would have an 'area' property. We mock it for the UI demo.
        // For now, if 'Tất cả' is selected, show all.
        const matchArea = selectedArea === 'Tất cả' || true; 
        return matchSearch && matchStatus && matchCapacity && matchArea;
    });

    const onMorePress = (e, table) => {
        const { pageY, pageX } = e.nativeEvent;
        setActionMenu({ y: pageY - 20, x: pageX - 100, data: table });
    };

    const onOpenAdd = () => {
        setFormData({ id: null, tenBan: '', sucChua: '4', tinhTrangBan: 'TRONG' });
        setIsEditMode(false);
        setShowFormModal(true);
    };

    const onOpenEdit = (table) => {
        setFormData({ ...table, sucChua: table.sucChua.toString() });
        setIsEditMode(true);
        setActionMenu(null);
        setShowFormModal(true);
    };

    const handleSaveTable = async () => {
        try {
            if (!formData.tenBan || !formData.sucChua) {
                showToast('Lỗi', 'Vui lòng nhập tên bàn và sức chứa', 'error');
                return;
            }

            const payload = {
                tenBan: formData.tenBan,
                sucChua: parseInt(formData.sucChua, 10),
                tinhTrangBan: formData.tinhTrangBan || 'TRONG'
            };

            if (isEditMode) {
                await tableApi.update(formData.id, payload);
                showToast('Thành công', 'Đã cập nhật thông tin bàn', 'success');
            } else {
                await tableApi.create(payload);
                showToast('Thành công', 'Đã thêm bàn mới', 'success');
            }
            setShowFormModal(false);
            fetchAllData();
        } catch (error) {
            console.error('Save table error:', error);
            showToast('Lỗi', 'Có lỗi xảy ra khi lưu thông tin bàn', 'error');
        }
    };

    const handleDeleteTable = (id) => {
        setActionMenu(null);
        setTimeout(() => {
            setConfirmAction({
                message: 'Bạn có chắc chắn muốn xóa bàn này?',
                onConfirm: async () => {
                    try {
                        await tableApi.delete(id);
                        showToast('Thành công', 'Đã xóa bàn', 'success');
                        fetchAllData();
                    } catch (error) {
                        console.error('Delete table error:', error);
                        showToast('Lỗi', 'Có lỗi xảy ra khi xóa bàn', 'error');
                    }
                }
            });
        }, 150);
    };

    // Tablet specific inline styles
    const tabletStyles = StyleSheet.create({
        toolbarRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        searchWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            width: '40%',
        },
        searchInputWrap: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            paddingHorizontal: 16,
            height: 48,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
        },
        filterBtn: {
            width: 48, height: 48, borderRadius: 16,
            backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
            justifyContent: 'center', alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
        },
        addBtnWrap: {
            height: 48,
        },
        addBtnGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
            height: 48,
            borderRadius: 24, // Capsule shape
        },
        addBtnText: {
            color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8,
        },
        categoryTabRow: {
            flexDirection: 'row',
            marginBottom: 24,
            gap: 12,
        },
        categoryBtn: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: '#FFFFFF', // Changed to solid white for better visibility
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            flexShrink: 0, // Prevent shrinking
        },
        categoryBtnActive: {
            backgroundColor: '#8BA367',
            borderColor: '#8BA367',
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
        },
        categoryText: {
            fontSize: 14, fontWeight: '600', color: '#6B7280',
        },
        categoryTextActive: {
            color: '#FFFFFF',
        },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -8,
        },
        tabletCard: {
            width: '25%', // 4 columns
            paddingHorizontal: 8,
            marginBottom: 16,
        },
        cardInner: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
            shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3,
            position: 'relative',
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        statusIndicator: {
            width: 12, height: 12, borderRadius: 6,
        },
        tableName: {
            fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 4,
        },
        tableSeats: {
            fontSize: 13, color: '#6B7280', fontWeight: '500',
        },
        cardFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 12, fontWeight: '800',
        }
    });

    // ─── Live Sync Badge removed ─────────────────────────

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <>
                    <View style={tabletStyles.toolbarRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={tabletStyles.searchWrap}>
                                <View style={tabletStyles.searchInputWrap}>
                                    <SearchIcon />
                                    <TextInput
                                        style={[styles.searchInput, { flex: 1, marginLeft: 10 }]}
                                        placeholder="Tìm kiếm bàn..."
                                        placeholderTextColor="#9CA3AF"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                                <TouchableOpacity style={tabletStyles.filterBtn} onPress={(e) => { const { pageY, pageX } = e.nativeEvent; setFilterAnchor({ y: pageY + 30, x: pageX - 200 }); }}>
                                    <FilterIcon />
                                </TouchableOpacity>
                            </View>


                            {/* Legend Row next to Search */}
                            <View style={[styles.legendRow, { marginBottom: 0, paddingHorizontal: 0, marginLeft: 32 }]}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                                    <Text style={styles.legendText}>Trống</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                                    <Text style={styles.legendText}>Có khách</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                                    <Text style={styles.legendText}>Đặt trước</Text>
                                </View>
                            </View>
                        </View>
                        
                        <TouchableOpacity style={tabletStyles.addBtnWrap} activeOpacity={0.9} onPress={onOpenAdd}>
                            <LinearGradient colors={['#8BA367', '#6B8743']} style={tabletStyles.addBtnGradient}>
                                <PlusIcon />
                                <Text style={tabletStyles.addBtnText}>Thêm bàn mới</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: 100 }} 
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                    >
                        {loading && localTables.length === 0 && <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />}
                        <View style={tabletStyles.gridContainer}>
                            {filteredTables.map(table => {
                                let dotColor = '#10B981'; // Green
                                let statusLabel = 'Trống';
                                let textColor = '#10B981';
                                let lightBgColor = 'rgba(16, 185, 129, 0.05)';
                                let badgeBgColor = 'rgba(16, 185, 129, 0.15)';
                                const resv = getTableReservation(table.id);
                                
                                if (table.tinhTrangBan === 'CO_KHACH') {
                                    dotColor = '#EF4444'; // Red
                                    statusLabel = 'Có khách';
                                    textColor = '#EF4444';
                                    lightBgColor = 'rgba(239, 68, 68, 0.05)';
                                    badgeBgColor = 'rgba(239, 68, 68, 0.15)';
                                } else if (table.tinhTrangBan === 'DA_DAT') {
                                    dotColor = '#F59E0B'; // Yellow
                                    statusLabel = 'Đã đặt';
                                    textColor = '#F59E0B';
                                    lightBgColor = 'rgba(245, 158, 11, 0.05)';
                                    badgeBgColor = 'rgba(245, 158, 11, 0.15)';
                                }

                                return (
                                    <View key={table.id} style={tabletStyles.tabletCard}>
                                        <TouchableOpacity 
                                            style={[tabletStyles.cardInner, { overflow: 'hidden' }]}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedTable(table)}
                                        >
                                            {/* Status Strip on the left */}
                                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: dotColor }} />
                                            
                                            {/* Decorative Background Pattern */}
                                            <View style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: lightBgColor, opacity: 0.8 }} />
                                            <View style={{ position: 'absolute', right: -10, top: -10, opacity: 0.3, transform: [{ scale: 0.6 }] }}>
                                                <Svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                                                    <Path d="M50 10 Q90 40 70 80 Q50 95 30 80 Q10 40 50 10Z" fill={dotColor} />
                                                </Svg>
                                            </View>

                                            <View style={tabletStyles.cardHeader}>
                                                <View style={[tabletStyles.statusIndicator, { backgroundColor: dotColor, marginLeft: 10 }]} />
                                                <TouchableOpacity style={{ padding: 4, marginRight: -8, marginTop: -8 }} onPress={(e) => onMorePress(e, table)}>
                                                    <MoreIcon />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={tabletStyles.tableName}>{table.tenBan}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                    <ChairIcon color="#9CA3AF" />
                                                    <Text style={tabletStyles.tableSeats}>{table.sucChua} ghế</Text>
                                                </View>
                                            </View>
                                            <View style={[tabletStyles.cardFooter, { marginLeft: 10 }]}>
                                                <View style={[tabletStyles.statusBadge, { backgroundColor: badgeBgColor, flexDirection: 'row', alignItems: 'center' }]}>
                                                    <Text style={[tabletStyles.statusText, { color: textColor }]}>{statusLabel}</Text>
                                                    {table.tinhTrangBan === 'CO_KHACH' && (() => {
                                                        const inv = getTableInvoice(table.id, table.tenBan);
                                                        const resv = getTableReservation(table.id);
                                                        const timerStart = getTimerStart(inv, resv);
                                                        return timerStart != null ? (
                                                            <>
                                                                <Text style={{ color: textColor, marginHorizontal: 4 }}>•</Text>
                                                                <LiveTimer startTime={timerStart} textStyle={{ fontSize: 12, fontWeight: '700', color: textColor }} />
                                                            </>
                                                        ) : null;
                                                    })()}
                                                </View>
                                                {table.tinhTrangBan === 'CO_KHACH' && (() => {
                                                    const inv = getTableInvoice(table.id, table.tenBan);
                                                    const amount = getRealtimeTongThanhToan(inv);
                                                    return amount != null ? (
                                                        <View style={{ alignItems: 'flex-end' }}>
                                                            <Text style={{ fontSize: 9, color: textColor, fontWeight: '600', opacity: 0.7 }}>Tạm tính</Text>
                                                            <Text style={{ fontSize: 14, fontWeight: '800', color: textColor }}>
                                                                {Number(amount).toLocaleString()}₫
                                                            </Text>
                                                        </View>
                                                    ) : <ReceiptIcon color="#9CA3AF" />;
                                                })()}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </>
            ) : (
                /* Mobile Layout */
                <>
                    <View style={styles.searchRow}>
                        <View style={styles.searchInputWrapper}>
                            <SearchIcon />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm kiếm tên bàn..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <TouchableOpacity style={styles.filterBtn} onPress={(e) => { const { pageY, pageX } = e.nativeEvent; setFilterAnchor({ y: pageY + 30, x: pageX - 200 }); }}>
                            <FilterIcon />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.legendText}>Trống</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.legendText}>Có khách</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.legendText}>Đặt trước</Text>
                        </View>
                    </View>

                    <ScrollView 
                        contentContainerStyle={styles.bodyScroll} 
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                    >
                        {/* Mobile card render here... skipped for brevity as tablet is main focus */}
                    </ScrollView>
                    
                    {!isLocalModalOpen && (
                        <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8} onPress={onOpenAdd}>
                            <PlusIcon />
                            <Text style={styles.fabText}>Thêm bàn</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {/* Modal: Table Detail */}
            <Modal visible={!!selectedTable} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.detailOverlay} activeOpacity={1} onPress={() => setSelectedTable(null)}>
                    <TouchableOpacity activeOpacity={1} style={[styles.detailCard, isTablet && { width: '60%', maxWidth: 500, alignSelf: 'center', padding: 24, borderRadius: 24 }]}>
                        {selectedTable && (
                            <>
                                <View style={[styles.modalHeader, { marginBottom: 20 }]}>
                                    <Text style={[styles.modalTitle, isTablet && { fontSize: 24 }]}>{selectedTable.tenBan}</Text>
                                    <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedTable(null)}>
                                        <CloseIcon />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
                                    <View style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16 }}>
                                        <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Sức chứa bàn</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <ChairIcon color="#64748B" />
                                            <Text style={[styles.infoValue, { fontSize: 18 }]}>{selectedTable.sucChua} người</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, alignItems: 'flex-start' }}>
                                        <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Trạng thái</Text>
                                        <View style={[
                                            styles.badge,
                                            selectedTable.tinhTrangBan === 'TRONG' ? { backgroundColor: '#DCFCE7' } :
                                                (selectedTable.tinhTrangBan === 'CO_KHACH' ? { backgroundColor: '#FEF2F2' } : { backgroundColor: '#FFFBEB' })
                                        ]}>
                                            <Text style={[
                                                styles.badgeText,
                                                selectedTable.tinhTrangBan === 'TRONG' ? { color: '#10B981' } :
                                                    (selectedTable.tinhTrangBan === 'CO_KHACH' ? { color: '#EF4444' } : { color: '#F59E0B' })
                                            ]}>
                                                {selectedTable.tinhTrangBan === 'TRONG' ? 'ĐANG TRỐNG' :
                                                    (selectedTable.tinhTrangBan === 'CO_KHACH' ? 'CÓ KHÁCH' : 'ĐÃ ĐẶT TRƯỚC')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {selectedTable.tinhTrangBan !== 'TRONG' && getTableReservation(selectedTable.id) ? (
                                    <View style={[styles.reservationSection, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginTop: 0 }]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <Text style={[styles.resTitle, { marginBottom: 0 }]}>
                                                {selectedTable.tinhTrangBan === 'CO_KHACH' ? 'Thông tin khách ngồi' : 'Thông tin đặt bàn'}
                                            </Text>
                                            {selectedTable.tinhTrangBan === 'CO_KHACH' && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 }}>
                                                    <ClockIcon color="#EF4444" stroke="#EF4444" />
                                                    <LiveTimer startTime={getTableInvoice(selectedTable.tenBan)?.thoiGianTao || getTableReservation(selectedTable.id)?.thoiGianDat} textStyle={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }} />
                                                </View>
                                            )}
                                        </View>
                                        <View style={[styles.resGrid, { gridTemplateColumns: '1fr 1fr' }]}>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Khách hàng</Text>
                                                <Text style={[styles.infoValue, { fontSize: 16 }]}>{getTableReservation(selectedTable.id).tenKhachHang}</Text>
                                            </View>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Điện thoại</Text>
                                                <Text style={[styles.infoValue, { fontSize: 16 }]}>{getTableReservation(selectedTable.id).sdtKhachHang}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.emptyState, { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 24, justifyContent: 'center', alignItems: 'center', marginTop: 0 }]}>
                                        <Text style={[styles.emptyText, { marginBottom: 0, textAlign: 'center' }]}>Hiện chưa có lịch đặt chỗ cho bàn này.</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Modal: Action Popover */}
            <Modal visible={!!actionMenu} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenu(null)}>
                    {actionMenu && (
                        <View style={[styles.anchorBox, { top: actionMenu.y, left: actionMenu.x }]}>
                            <TouchableOpacity style={styles.anchorItem} onPress={() => onOpenEdit(actionMenu.data)}>
                                <EditIcon />
                                <Text style={styles.anchorText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.anchorItem, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}
                                onPress={() => handleDeleteTable(actionMenu.data.id)}
                            >
                                <TrashIcon />
                                <Text style={[styles.anchorText, { color: '#EF4444' }]}>Xóa bàn</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Modal: Filter */}
            <Modal visible={!!filterAnchor} transparent animationType="none" statusBarTranslucent>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setFilterAnchor(null)}>
                    {filterAnchor && (
                        <TouchableOpacity activeOpacity={1} style={[styles.filterPopupBox, { top: filterAnchor.y, left: Math.max(10, filterAnchor.x), position: 'absolute' }]}>
                            <Text style={styles.filterGroupTitle}>Trạng thái bàn hiện tại</Text>
                            <RadioItem label="Tất cả" selected={filterStatus === 'ALL'} onPress={() => { setFilterStatus('ALL'); setFilterAnchor(null); }} />
                            <RadioItem label="Bàn trống" selected={filterStatus === 'TRONG'} onPress={() => { setFilterStatus('TRONG'); setFilterAnchor(null); }} />
                            <RadioItem label="Có khách" selected={filterStatus === 'CO_KHACH'} onPress={() => { setFilterStatus('CO_KHACH'); setFilterAnchor(null); }} />
                            <RadioItem label="Đặt trước" selected={filterStatus === 'DA_DAT'} onPress={() => { setFilterStatus('DA_DAT'); setFilterAnchor(null); }} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Modal: Form */}
            <Modal visible={showFormModal} transparent animationType="slide" statusBarTranslucent={true}>
                <View style={styles.detailOverlay}>
                    <View style={[styles.formCard, isTablet && { width: '60%', maxWidth: 600, alignSelf: 'center', padding: 32, borderRadius: 28 }]}>
                        <View style={[styles.modalHeader, { marginBottom: 30 }]}>
                            <Text style={[styles.modalTitle, isTablet && { fontSize: 26 }]}>{isEditMode ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}</Text>
                            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowFormModal(false)}>
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: isTablet ? 'row' : 'column', gap: isTablet ? 20 : 0 }}>
                            <View style={[styles.inputGroup, { flex: 1, marginBottom: isTablet ? 0 : 20 }]}>
                                <Text style={styles.inputTitle}>TÊN BÀN</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                                    <TextInput
                                        style={[styles.textInput, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0, height: 56, fontSize: 16 }]}
                                        placeholder="VD: Bàn VIP 01"
                                        placeholderTextColor="#CBD5E1"
                                        value={formData.tenBan}
                                        onChangeText={(val) => setFormData({ ...formData, tenBan: val })}
                                    />
                                </View>
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputTitle}>SỨC CHỨA (GHẾ)</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                                    <ChairIcon color="#94A3B8" />
                                    <TextInput
                                        style={[styles.textInput, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 12, paddingVertical: 0, height: 56, fontSize: 16 }]}
                                        placeholder="VD: 4"
                                        placeholderTextColor="#CBD5E1"
                                        keyboardType="numeric"
                                        value={formData.sucChua}
                                        onChangeText={(val) => setFormData({ ...formData, sucChua: val })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.actionBtnRow, { marginTop: 30, gap: 16 }]}>
                            <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: '#F1F5F9', borderRadius: 16, height: 56, borderWidth: 0, flex: 1 }]} onPress={() => setShowFormModal(false)}>
                                <Text style={[styles.cancelBtnText, { color: '#64748B', fontSize: 16, fontWeight: '700' }]}>Hủy bỏ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.saveBtn, { borderRadius: 16, height: 56, flex: 1 }]} onPress={handleSaveTable}>
                                <Text style={[styles.saveBtnText, { fontSize: 16 }]}>{isEditMode ? 'Lưu thay đổi' : 'Thêm bàn mới'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirm Modal */}
            <ConfirmModal 
                visible={!!confirmAction} 
                title="Xác nhận xóa" 
                message={confirmAction?.message || ''} 
                onConfirm={() => {
                    if (confirmAction?.onConfirm) confirmAction.onConfirm();
                    setConfirmAction(null);
                }} 
                onCancel={() => {
                    if (confirmAction?.onCancel) confirmAction.onCancel();
                    setConfirmAction(null);
                }} 
            />
        </View>
    );
}
