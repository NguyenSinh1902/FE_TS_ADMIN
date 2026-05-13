import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, useWindowDimensions, StyleSheet, FlatList, Animated, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './InvoicesTab.styles';
import DatePicker from 'react-native-date-picker';
import invoiceApi from '../../../api/invoiceApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';
import {
    SearchIcon, FilterIcon, ChevronIcon, TableTypeIcon, BagIcon,
    CashIcon, BankIcon, CloseIcon, DownloadIcon, ChartBarIcon, ChartPieIcon, CheckCircleIcon,
    TeaLeafIcon, MatchaCupIcon, PearlIcon, TeapotIcon,
    PremiumCupIcon, PremiumNoteIcon, PremiumReceiptIcon
} from '../FinanceIcons';

const InvoicesTab = ({ onModalStateChange }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [activeDate, setActiveDate] = useState('Hôm nay');
    const [showFilter, setShowFilter] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ 'Hôm nay': true });

    // Filter States
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPayment, setFilterPayment] = useState('ALL');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    const [openStartPicker, setOpenStartPicker] = useState(false);
    const [openEndPicker, setOpenEndPicker] = useState(false);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        onModalStateChange(!!selectedInvoice || showFilter);
    }, [selectedInvoice, showFilter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            let res;
            if (filterStartDate && filterEndDate) {
                const formatDate = (str) => str.split('/').reverse().join('-');
                res = await invoiceApi.getByDates(formatDate(filterStartDate), formatDate(filterEndDate));
            } else {
                res = await invoiceApi.getAll();
            }

            const now = new Date();
            const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

            const mapped = (res || []).map(inv => {
                const invDate = new Date(inv.thoiGianTao);
                const invDayStr = `${String(invDate.getDate()).padStart(2, '0')}/${String(invDate.getMonth() + 1).padStart(2, '0')}/${invDate.getFullYear()}`;
                return {
                    ...inv,
                    section: invDayStr === todayStr ? 'Hôm nay' : invDayStr,
                    maHoaDon: inv.idHoaDon,
                    tinhTrangThanhToan: inv.trangThai,
                    tongTien: inv.tongThanhToan,
                    hinhThucThanhToan: inv.phuongThucThanhToan,
                    chiTietDonHang: inv.danhSachChiTiet?.map(d => ({
                        tenMon: d.tenSanPham,
                        soLuong: d.soLuong,
                        giaBan: d.thanhTien / d.soLuong,
                        ghiChu: d.tenKichCo
                    })) || []
                };
            });

            setInvoices(mapped);
        } catch (error) {
            console.log('Fetch invoices error:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchInvoices(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchInvoices(); };
    const handleApplyFilter = () => { setShowFilter(false); fetchInvoices(); };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CHO_XAC_NHAN':
            case 'DANG_PHA_CHE':
            case 'CHO_LAY_MON':
            case 'DANG_PHUC_VU':
                return { box: styles.statusProcessing, text: styles.statusProcessingText, label: 'Đang xử lý', color: '#C2410C' };
            case 'CHO_THANH_TOAN':
                return { box: styles.statusWarning, text: styles.statusWarningText, label: 'Chờ thanh toán', color: '#991B1B' };
            case 'DA_THANH_TOAN':
            case 'HOAN_TAT':
                return { box: styles.statusSuccess, text: styles.statusSuccessText, label: 'Thành công', color: '#166534' };
            case 'DA_HUY':
                return { box: styles.statusNeutral, text: styles.statusNeutralText, label: 'Đã hủy', color: '#64748B' };
            default:
                return { box: styles.statusNeutral, text: styles.statusNeutralText, label: status, color: '#64748B' };
        }
    };

    const sections = useMemo(() => {
        const groups = {};
        invoices.forEach(inv => {
            if (!groups[inv.section]) groups[inv.section] = [];
            groups[inv.section].push(inv);
        });
        return Object.keys(groups).map(key => ({ title: key, data: groups[key] })).sort((a, b) => {
            if (a.title === 'Hôm nay') return -1;
            if (b.title === 'Hôm nay') return 1;
            return b.title.localeCompare(a.title);
        });
    }, [invoices]);

    const activeInvoices = useMemo(() => {
        const section = sections.find(s => s.title === activeDate);
        return section ? section.data.filter(i =>
            i.maHoaDon.toString().includes(searchQuery) ||
            i.tenNhanVien?.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];
    }, [sections, activeDate, searchQuery]);

    const dayStats = useMemo(() => ({
        revenue: activeInvoices.filter(i => i.tinhTrangThanhToan === 'DA_THANH_TOAN' || i.tinhTrangThanhToan === 'HOAN_TAT').reduce((sum, i) => sum + i.tongTien, 0),
        count: activeInvoices.length,
        success: activeInvoices.filter(i => i.tinhTrangThanhToan === 'DA_THANH_TOAN' || i.tinhTrangThanhToan === 'HOAN_TAT').length
    }), [activeInvoices]);

    const tabletStyles = StyleSheet.create({
        splitWrapper: { flex: 1, flexDirection: 'row', padding: 20, gap: 24 },
        leftPane: {
            flex: 0.3,
            backgroundColor: 'transparent',
            borderRadius: 28,
            overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 6
        },
        rightPane: {
            flex: 0.7,
            backgroundColor: 'transparent',
            borderRadius: 28,
            padding: 32,
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 6,
            overflow: 'hidden'
        },

        paneHeader: { padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
        dateCard: {
            backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, padding: 18, borderRadius: 20,
            flexDirection: 'row', alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
            borderWidth: 1, borderColor: '#F1F5F9'
        },
        dateCardActive: { borderColor: 'rgba(139, 163, 103, 0.4)', borderWidth: 2, backgroundColor: '#FFFFFF', shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 },
        dateTitle: { fontSize: 16, fontWeight: '800', color: '#475569' },
        dateCount: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '700' },

        dotIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', marginLeft: 15 },
        dotActive: { backgroundColor: '#8BA367' },

        statsRow: { 
            flexDirection: 'row', 
            gap: 20, 
            marginBottom: 32, 
            paddingHorizontal: 12, // Đẩy các nút vào trong để hiện viền/bóng
            paddingTop: 8 // Không gian cho bóng đổ phía trên
        },
        statCard: {
            flex: 1, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24,
            shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5,
            borderWidth: 1, borderColor: '#F1F5F9'
        },
        statValue: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginTop: 12 },
        statLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },

        exportBtnGradient: { borderRadius: 14, overflow: 'hidden' },
        exportBtnInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
        exportText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },

        // Premium Receipt Styles
        premiumReceiptCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 28,
            padding: 32,
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 12,
            borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        premiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
        premiumTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', letterSpacing: 0.5 },
        premiumDivider: { height: 1, backgroundColor: 'rgba(71, 85, 105, 0.15)', marginVertical: 20 },
        premiumItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
        premiumItemName: { fontSize: 16, fontWeight: '700', color: '#1E293B', flex: 1 },
        premiumItemQty: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 20 },
        premiumItemQtyText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
        premiumItemPrice: { fontSize: 16, fontWeight: '900', color: '#8BA367' },
        premiumFooter: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(139, 163, 103, 0.2)' },
        premiumTotalLabel: { fontSize: 14, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
        premiumTotalValue: { fontSize: 32, fontWeight: '900', color: '#1E293B' },

        buttonRow: { flexDirection: 'row', gap: 16, marginTop: 32 },
        actionBtn: { flex: 1, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
        actionBtnInner: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
        actionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' }
    });

    const DotIndicator = ({ active }) => {
        const glowAnim = useRef(new Animated.Value(0)).current;
        useEffect(() => {
            Animated.timing(glowAnim, { toValue: active ? 1 : 0, duration: 300, useNativeDriver: false }).start();
        }, [active]);
        const backgroundColor = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#8BA367'] });
        const scale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
        const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });
        return (
            <Animated.View style={[
                tabletStyles.dotIndicator,
                { backgroundColor, transform: [{ scale }], shadowColor: '#8BA367', shadowOffset: { width: 0, height: 0 }, shadowRadius: 8, shadowOpacity }
            ]} />
        );
    };

    const renderInvoiceCard = (item) => {
        const status = getStatusStyle(item.tinhTrangThanhToan);
        const isActive = selectedInvoice?.idHoaDon === item.idHoaDon;
        return (
            <TouchableOpacity
                key={item.idHoaDon}
                style={[
                    styles.invoiceCard,
                    isTablet && { width: '48%', marginHorizontal: '1%', marginBottom: 16, borderWidth: 0 },
                    isActive && { borderColor: '#8BA367', borderWidth: 2, shadowOpacity: 0.2 }
                ]}
                onPress={() => setSelectedInvoice(item)}
            >
                <View style={[styles.cardAccent, { backgroundColor: status.color }]} />
                <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                        <View style={styles.idRow}>
                            <Text style={styles.idText}>#</Text>
                            <Text style={styles.idValue}>{item.maHoaDon}</Text>
                        </View>
                        <View style={[styles.statusTag, status.box]}>
                            <Text style={[styles.statusTagText, status.text]}>{status.label}</Text>
                        </View>
                    </View>
                    <View style={styles.cardBottom}>
                        <View style={styles.paymentInfo}>
                            {item.hinhThucThanhToan === 'TIEN_MAT' ? <CashIcon /> : <BankIcon />}
                            <Text style={styles.paymentText}>{item.hinhThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : 'Bank'}</Text>
                        </View>
                        <Text style={styles.totalAmount}>{item.tongTien.toLocaleString()}đ</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderTabletView = () => (
        <View style={tabletStyles.splitWrapper}>
            {/* Left Pane: Selection List (30%) */}
            <View style={tabletStyles.leftPane}>
                <LinearGradient
                    colors={['#F0F4EF', '#FFFFFF']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                />
                <View style={StyleSheet.absoluteFill}>
                    <View style={{ position: 'absolute', top: -20, right: -20 }}><TeaLeafIcon size={120} opacity={0.04} /></View>
                    <View style={{ position: 'absolute', bottom: 40, left: -20 }}><PearlIcon size={40} opacity={0.03} /></View>
                </View>
                <View style={[tabletStyles.paneHeader, { borderBottomWidth: 0 }]}>
                    <View style={[styles.searchRow, { paddingHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
                        <View style={[styles.searchInputWrapper, { backgroundColor: 'rgba(248, 249, 250, 0.8)', borderRadius: 16, marginHorizontal: 0, height: 48 }]}>
                            <SearchIcon />
                            <TextInput style={styles.searchInput} placeholder="Tìm kiếm..." placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery} />
                        </View>
                        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: 'rgba(248, 249, 250, 0.8)', borderRadius: 16, height: 48, width: 48 }]} onPress={() => setShowFilter(true)}>
                            <FilterIcon />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={sections}
                    keyExtractor={item => item.title}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isActive = activeDate === item.title;
                        return (
                            <TouchableOpacity 
                                style={[tabletStyles.dateCard, isActive && { borderWidth: 0, elevation: 4 }]} 
                                onPress={() => { setActiveDate(item.title); setSelectedInvoice(null); }}
                            >
                                {isActive && (
                                    <LinearGradient
                                        colors={['#F0FDF4', '#DCFCE7']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                                    />
                                )}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[tabletStyles.dateTitle, isActive && { color: '#14532D' }]}>{item.title}</Text>
                                        <Text style={[tabletStyles.dateCount, isActive && { color: '#15803D' }]}>{item.data.length} đơn</Text>
                                    </View>
                                    <DotIndicator active={isActive} />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Right Pane: Detail & Stats (70%) */}
            <View style={tabletStyles.rightPane}>
                <LinearGradient
                    colors={['#F0F4EF', '#FFFFFF']}
                    start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                />
                <View style={StyleSheet.absoluteFill}>
                    <View style={{ position: 'absolute', top: '20%', right: -30 }}><MatchaCupIcon size={200} opacity={0.03} /></View>
                    <View style={{ position: 'absolute', bottom: -40, left: 20 }}><TeapotIcon size={150} opacity={0.03} /></View>
                    <View style={{ position: 'absolute', top: 50, left: '40%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(139, 163, 103, 0.02)' }} />
                </View>

                {!selectedInvoice ? (
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <Text style={{ fontSize: 28, fontWeight: '900', color: '#1E293B' }}>Tổng quan {activeDate}</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            <View style={tabletStyles.statsRow}>
                                <View style={[tabletStyles.statCard, { padding: 0 }]}>
                                    <LinearGradient 
                                        colors={['#F0FDF4', '#DCFCE7']} 
                                        style={{ flex: 1, padding: 24, borderRadius: 24 }}
                                    >
                                        <ChartBarIcon color="#166534" />
                                        <Text style={[tabletStyles.statValue, { color: '#14532D' }]}>{dayStats.revenue.toLocaleString()}đ</Text>
                                        <Text style={[tabletStyles.statLabel, { color: '#15803D' }]}>Doanh thu</Text>
                                    </LinearGradient>
                                </View>
                                <View style={[tabletStyles.statCard, { padding: 0 }]}>
                                    <LinearGradient 
                                        colors={['#F0FDF4', '#DCFCE7']} 
                                        style={{ flex: 1, padding: 24, borderRadius: 24 }}
                                    >
                                        <ChartPieIcon color="#166534" />
                                        <Text style={[tabletStyles.statValue, { color: '#14532D' }]}>{dayStats.count}</Text>
                                        <Text style={[tabletStyles.statLabel, { color: '#15803D' }]}>Tổng đơn</Text>
                                    </LinearGradient>
                                </View>
                                <View style={[tabletStyles.statCard, { padding: 0 }]}>
                                    <LinearGradient 
                                        colors={['#F0FDF4', '#DCFCE7']} 
                                        style={{ flex: 1, padding: 24, borderRadius: 24 }}
                                    >
                                        <CheckCircleIcon color="#166534" />
                                        <Text style={[tabletStyles.statValue, { color: '#14532D' }]}>{dayStats.success}</Text>
                                        <Text style={[tabletStyles.statLabel, { color: '#15803D' }]}>Hoàn tất</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 20, marginLeft: 4 }}>DANH SÁCH GIAO DỊCH</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                {activeInvoices.length > 0 ? activeInvoices.map(renderInvoiceCard) : <View style={{ flex: 1, padding: 60, alignItems: 'center' }}><Text style={{ color: '#94A3B8', fontWeight: '600' }}>Không tìm thấy giao dịch nào</Text></View>}
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={tabletStyles.premiumReceiptCard}>
                            <View style={tabletStyles.premiumHeader}>
                                <View>
                                    <Text style={tabletStyles.premiumTitle}>#HD-{selectedInvoice.maHoaDon}</Text>
                                    <Text style={{ color: '#64748B', fontWeight: '600', marginTop: 4 }}>{new Date(selectedInvoice.thoiGianTao).toLocaleString()}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setSelectedInvoice(null)} style={{ padding: 12, backgroundColor: 'rgba(139, 163, 103, 0.1)', borderRadius: 16 }}>
                                    <CloseIcon />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 20 }}>
                                <View style={{ flex: 1, padding: 16, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 6 }}>THU NGÂN</Text>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{selectedInvoice.tenNhanVien || 'Admin'}</Text>
                                </View>
                                <View style={{ flex: 1, padding: 16, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 6 }}>THANH TOÁN</Text>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{selectedInvoice.hinhThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : 'Chuyển khoản'}</Text>
                                </View>
                            </View>

                            <View style={tabletStyles.premiumDivider} />

                            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350 }}>
                                {selectedInvoice.chiTietDonHang.map((item, idx) => (
                                    <View key={idx}>
                                        <View style={tabletStyles.premiumItemRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={tabletStyles.premiumItemName}>{item.tenMon}</Text>
                                                {item.ghiChu && (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
                                                        <PremiumNoteIcon size={14} color="#94A3B8" />
                                                        <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{item.ghiChu}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={tabletStyles.premiumItemQty}>
                                                <PremiumCupIcon size={16} color="#8BA367" />
                                                <Text style={tabletStyles.premiumItemQtyText}>x{item.soLuong}</Text>
                                            </View>
                                            <Text style={tabletStyles.premiumItemPrice}>{(item.giaBan * item.soLuong).toLocaleString()}đ</Text>
                                        </View>
                                        {idx < selectedInvoice.chiTietDonHang.length - 1 && <View style={{ height: 1, backgroundColor: 'rgba(71, 85, 105, 0.05)', marginHorizontal: 0 }} />}
                                    </View>
                                ))}
                            </ScrollView>

                            <View style={tabletStyles.premiumFooter}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <View>
                                        <Text style={tabletStyles.premiumTotalLabel}>Tổng thanh toán</Text>
                                        <Text style={tabletStyles.premiumTotalValue}>{selectedInvoice.tongTien.toLocaleString()}đ</Text>
                                    </View>
                                    <View style={[getStatusStyle(selectedInvoice.tinhTrangThanhToan).box, { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }]}>
                                        <Text style={[getStatusStyle(selectedInvoice.tinhTrangThanhToan).text, { fontWeight: '900' }]}>{getStatusStyle(selectedInvoice.tinhTrangThanhToan).label}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={tabletStyles.buttonRow}>
                            <TouchableOpacity style={[tabletStyles.actionBtn, { flex: 1 }]} activeOpacity={0.8}>
                                <LinearGradient colors={['#FCA5A5', '#EF4444']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={tabletStyles.actionBtnInner}>
                                    <CloseIcon color="#FFFFFF" />
                                    <Text style={tabletStyles.actionBtnText}>Hủy đơn hàng</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    const RadioItem = ({ label, selected, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={onPress}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
            <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
                {selected && <View style={styles.filterInnerCircle} />}
            </View>
        </TouchableOpacity>
    );

    const renderMobileView = () => (
        <>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput style={styles.searchInput} placeholder="Tìm mã HD, nhân viên..." placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery} />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.bodyScroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}>
                {loading && invoices.length === 0 && <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />}
                {sections.map(section => {
                    const filteredData = section.data.filter(inv => inv.maHoaDon.toString().includes(searchQuery) || inv.tenNhanVien?.toLowerCase().includes(searchQuery.toLowerCase()));
                    if (filteredData.length === 0) return null;
                    return (
                        <View key={section.title} style={styles.sectionContainer}>
                            <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpandedSections({ ...expandedSections, [section.title]: !expandedSections[section.title] })}>
                                <View style={styles.sectionLeft}><Text style={[styles.sectionTitle, section.title === 'Hôm nay' && { color: '#8BA367' }]}>{section.title}</Text><View style={styles.badgeCount}><Text style={styles.badgeCountText}>{filteredData.length}</Text></View></View>
                                <ChevronIcon isOpen={expandedSections[section.title]} />
                            </TouchableOpacity>
                            {expandedSections[section.title] && filteredData.map(renderInvoiceCard)}
                        </View>
                    );
                })}
            </ScrollView>
            <Modal visible={!!selectedInvoice} transparent animationType="slide">
                <View style={styles.modalOverlay}><View style={styles.modalContent}><View style={styles.modalHandle} />{selectedInvoice && (<><View style={styles.modalHeader}><Text style={styles.modalTitle}>Chi tiết {selectedInvoice.maHoaDon}</Text><TouchableOpacity onPress={() => setSelectedInvoice(null)}><CloseIcon /></TouchableOpacity></View><ScrollView showsVerticalScrollIndicator={false}><View style={styles.billPaper}><View style={styles.billHeader}><View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Thời gian</Text><Text style={styles.billInfoValue}>{new Date(selectedInvoice.thoiGianTao).toLocaleString()}</Text></View><View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Thu ngân</Text><Text style={styles.billInfoValue}>{selectedInvoice.tenNhanVien || 'Admin'}</Text></View></View><Text style={styles.itemListTitle}>Danh sách món</Text>{selectedInvoice.chiTietDonHang.map((item, idx) => (<View key={idx} style={styles.itemRow}><View style={{ flex: 1 }}><Text style={styles.itemName}>{item.tenMon}</Text>{item.ghiChu && <Text style={styles.itemToppings}>Size: {item.ghiChu}</Text>}</View><Text style={styles.itemQty}>x{item.soLuong}</Text><Text style={styles.itemPrice}>{(item.giaBan * item.soLuong).toLocaleString()}đ</Text></View>))}<View style={styles.summarySection}><View style={styles.mainTotalRow}><Text style={styles.mainTotalLabel}>THANH TOÁN</Text><Text style={styles.mainTotalValue}>{selectedInvoice.tongTien.toLocaleString()}đ</Text></View></View></View></ScrollView></>)}</View></View>
            </Modal>
        </>
    );

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? renderTabletView() : renderMobileView()}
            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}><View style={[styles.filterPopupBox, { top: isTablet ? 150 : 220, right: isTablet ? 40 : 20, width: 280 }]}><Text style={styles.filterGroupTitle}>Trạng thái</Text><RadioItem label="Tất cả" selected={filterStatus === 'ALL'} onPress={() => setFilterStatus('ALL')} /><RadioItem label="Thành công" selected={filterStatus === 'SUCCESS'} onPress={() => setFilterStatus('SUCCESS')} /><RadioItem label="Đã hủy" selected={filterStatus === 'CANCELLED'} onPress={() => setFilterStatus('CANCELLED')} /><View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 }} /><Text style={styles.filterGroupTitle}>Thanh toán</Text><RadioItem label="Tất cả" selected={filterPayment === 'ALL'} onPress={() => setFilterPayment('ALL')} /><RadioItem label="Tiền mặt" selected={filterPayment === 'CASH'} onPress={() => setFilterPayment('CASH')} /><RadioItem label="Chuyển khoản" selected={filterPayment === 'BANK'} onPress={() => setFilterPayment('BANK')} /><TouchableOpacity style={{ backgroundColor: '#8BA367', margin: 16, paddingVertical: 12, borderRadius: 14, alignItems: 'center' }} onPress={handleApplyFilter}><Text style={{ color: '#FFFFFF', fontWeight: '900' }}>Áp dụng</Text></TouchableOpacity></View></TouchableOpacity>
            </Modal>
            <DatePicker modal mode="date" title="Chọn ngày bắt đầu" open={openStartPicker} date={new Date()} onConfirm={(date) => { setFilterStartDate(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`); setOpenStartPicker(false); }} onCancel={() => setOpenStartPicker(false)} />
            <DatePicker modal mode="date" title="Chọn ngày kết thúc" open={openEndPicker} date={new Date()} onConfirm={(date) => { setFilterEndDate(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`); setOpenEndPicker(false); }} onCancel={() => setOpenEndPicker(false)} />
        </View>
    );
};

export default InvoicesTab;
