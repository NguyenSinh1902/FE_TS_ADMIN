import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    TextInput, StyleSheet, RefreshControl, ActivityIndicator,
    useWindowDimensions, FlatList, Animated, Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import invoiceApi from '../../../../api/invoiceApi';
import InvoiceDetailModal from './InvoiceDetailModal';
import {
    SearchIcon, FilterIcon, ChartBarIcon, ChartPieIcon, CheckCircleIcon,
    CashIcon, BankIcon, TeaLeafIcon, PearlIcon, MatchaCupIcon, TeapotIcon
} from '../../FinanceIcons';
import { useRealtime } from '../../../../context/RealtimeContext';



const ChevronIcon = ({ isOpen }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d={isOpen ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const STATUS_STYLE = {
    CHO_XAC_NHAN: { box: '#FFF7ED', text: '#C2410C', label: 'Chờ xác nhận', color: '#C2410C' },
    DANG_PHA_CHE: { box: '#FFF7ED', text: '#C2410C', label: 'Pha chế', color: '#C2410C' },
    CHO_LAY_MON: { box: '#FFF7ED', text: '#C2410C', label: 'Chờ lấy', color: '#C2410C' },
    DANG_PHUC_VU: { box: '#FFF7ED', text: '#C2410C', label: 'Phục vụ', color: '#C2410C' },
    CHO_THANH_TOAN: { box: '#FEF2F2', text: '#991B1B', label: 'Chờ thanh toán', color: '#991B1B' },
    DA_THANH_TOAN: { box: '#F0FDF4', text: '#166534', label: 'Đã thanh toán', color: '#166534' },
    HOAN_TAT: { box: '#F0FDF4', text: '#166534', label: 'Hoàn tất', color: '#166534' },
    DA_HUY: { box: '#F8FAFC', text: '#64748B', label: 'Đã hủy', color: '#64748B' },
};

const fmtDay = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const buildMonthsAndDays = (invoices) => {
    const now = new Date();
    const todayKey = fmtDay(now);
    const months = {};

    // Ensure the current month and today exist even if there are no invoices yet
    const currentMKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMLabel = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

    months[currentMKey] = {
        key: currentMKey,
        label: currentMLabel,
        days: {
            [todayKey]: { key: todayKey, label: 'Hôm nay', items: [] }
        }
    };

    invoices.forEach(inv => {
        const d = new Date(inv.thoiGianTao);
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const mLabel = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
        const dKey = fmtDay(d);
        const dLabel = dKey === todayKey ? `Hôm nay` : dKey;

        if (!months[mKey]) months[mKey] = { key: mKey, label: mLabel, days: {} };
        if (!months[mKey].days[dKey]) months[mKey].days[dKey] = { key: dKey, label: dLabel, items: [] };
        months[mKey].days[dKey].items.push(inv);
    });

    return Object.values(months)
        .sort((a, b) => b.key.localeCompare(a.key))
        .map(m => ({
            ...m,
            total: Object.values(m.days).reduce((s, d) => s + d.items.length, 0),
            days: Object.values(m.days).sort((a, b) => {
                if (a.label === 'Hôm nay') return -1;
                if (b.label === 'Hôm nay') return 1;
                // Parse date for proper sorting
                const dateA = a.key.split('/').reverse().join('');
                const dateB = b.key.split('/').reverse().join('');
                return dateB.localeCompare(dateA);
            }),
        }));
};

const DotIndicator = ({ active, activeColor = '#8BA367' }) => {
    const glowAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(glowAnim, { toValue: active ? 1 : 0, duration: 300, useNativeDriver: false }).start();
    }, [active]);
    const backgroundColor = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', activeColor] });
    const scale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
    const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });
    return (
        <Animated.View style={[
            styles.dotIndicator,
            { backgroundColor, transform: [{ scale }], shadowColor: activeColor, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8, shadowOpacity }
        ]} />
    );
};

const InvoiceTimeline = ({ onModalStateChange, viewMode, onChangeView }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    // ─── Firebase Realtime ─────────────────────────────────
    const { lastTableUpdate, lastOrderUpdate } = useRealtime();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPayment, setFilterPayment] = useState('ALL');

    const [expandedMonths, setExpandedMonths] = useState({});
    const [activeDate, setActiveDate] = useState('Hôm nay');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        onModalStateChange(!!selectedInvoice);
    }, [selectedInvoice]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await invoiceApi.getAll();
            setInvoices(res || []);
        } catch (e) {
            console.log('InvoiceTimeline fetch error:', e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Soft-refetch khi Firebase báo có thay đổi (table or order)
    // Dùng API trực tiếp → luôn đúng, không bị ghi đè bởi Firebase cũ
    const softRefTimer = useRef(null);
    const softFetch = () => {
        if (softRefTimer.current) clearTimeout(softRefTimer.current);
        softRefTimer.current = setTimeout(async () => {
            try {
                const res = await invoiceApi.getAll();
                if (res) setInvoices(res);
            } catch (_) {}
        }, 1500);
    };
    useEffect(() => { if (lastOrderUpdate) softFetch(); }, [lastOrderUpdate]);
    useEffect(() => { if (lastTableUpdate) softFetch(); }, [lastTableUpdate]);

    // Auto-poll mỗi 15s (backup cho trường hợp BE không push Firebase)
    useEffect(() => {
        const poll = setInterval(() => fetchData(), 15000);
        return () => { clearInterval(poll); if (softRefTimer.current) clearTimeout(softRefTimer.current); };
    }, []);

    const groupedData = useMemo(() => buildMonthsAndDays(invoices), [invoices]);

    // Auto-expand newest month
    useEffect(() => {
        if (groupedData.length > 0) {
            const firstMonth = groupedData[0];
            setExpandedMonths(prev => ({ ...prev, [firstMonth.key]: true }));
        }
    }, [groupedData.length]);

    const toggleMonth = (key) => setExpandedMonths(p => ({ ...p, [key]: !p[key] }));

    // For Right Pane
    const activeInvoices = useMemo(() => {
        let items = [];
        groupedData.forEach(m => {
            m.days.forEach(d => {
                if (d.label === activeDate || d.key === activeDate) {
                    items = d.items;
                }
            });
        });

        const lowerSearch = search.toLowerCase();
        return items.filter(inv => {
            const matchesSearch = String(inv.idHoaDon).includes(lowerSearch) ||
                (inv.tenKhachHang || '').toLowerCase().includes(lowerSearch) ||
                (inv.tenNhanVien || inv.tenThuNgan || '').toLowerCase().includes(lowerSearch);
            const matchesStatus = filterStatus === 'ALL' || inv.trangThai === filterStatus;
            const matchesPayment = filterPayment === 'ALL' || inv.phuongThucThanhToan === filterPayment;
            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [groupedData, activeDate, search, filterStatus, filterPayment]);

    const dayStats = useMemo(() => ({
        revenue: activeInvoices.filter(i => i.trangThai === 'DA_THANH_TOAN' || i.trangThai === 'HOAN_TAT').reduce((sum, i) => sum + i.tongThanhToan, 0),
        count: activeInvoices.length,
        success: activeInvoices.filter(i => i.trangThai === 'DA_THANH_TOAN' || i.trangThai === 'HOAN_TAT').length
    }), [activeInvoices]);


    // Live badge removed

    const renderInvoiceCard = (item) => {
        const s = STATUS_STYLE[item.trangThai] || { box: '#F8FAFC', text: '#64748B', label: item.trangThai, color: '#64748B' };
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
                <View style={[styles.cardAccent, { backgroundColor: s.color }]} />
                <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                        <View style={styles.idRow}>
                            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: s.box, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: '900', color: s.color }}>#</Text>
                            </View>
                            <Text style={styles.idValue}>{item.idHoaDon}</Text>
                        </View>
                        <View style={[styles.statusTag, { backgroundColor: s.box }]}>
                            <Text style={[styles.statusTagText, { color: s.text }]}>{s.label}</Text>
                        </View>
                    </View>
                    <View style={styles.cardBottom}>
                        <View style={styles.paymentInfo}>
                            {item.phuongThucThanhToan === 'TIEN_MAT' ? <CashIcon /> : <BankIcon />}
                            <Text style={styles.paymentText}>{item.phuongThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : 'Bank'}</Text>
                        </View>
                        <Text style={styles.totalAmount}>{(item.tongThanhToan || 0).toLocaleString()}đ</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderLeftPane = () => (
        <View style={styles.leftPane}>
            <LinearGradient
                colors={['#F0F4EF', '#FFFFFF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
            />
            <View style={StyleSheet.absoluteFill}>
                <View style={{ position: 'absolute', top: -20, right: -20 }}><TeaLeafIcon size={120} opacity={0.04} /></View>
                <View style={{ position: 'absolute', bottom: 40, left: -20 }}><PearlIcon size={40} opacity={0.03} /></View>
            </View>
            <View style={[styles.paneHeader, { borderBottomWidth: 0, paddingBottom: 12, paddingHorizontal: 20, zIndex: 10, backgroundColor: 'rgba(244, 247, 242, 0.95)' }]}>
                <View style={[styles.searchRow, { paddingHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
                    <View style={[styles.searchInputWrapper, { backgroundColor: 'rgba(248, 249, 250, 0.8)', borderRadius: 16, marginHorizontal: 0, height: 48, flex: 1 }]}>
                        <SearchIcon />
                        <TextInput style={styles.searchInput} placeholder="Tìm kiếm..." placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} />
                    </View>
                    <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: (filterStatus !== 'ALL' || filterPayment !== 'ALL') ? '#8BA367' : 'rgba(248, 249, 250, 0.8)', borderWidth: 1, borderColor: '#E5E7EB', marginLeft: 10, height: 48, width: 48, borderRadius: 16 }]} activeOpacity={0.7} onPress={(e) => { const { pageY, pageX } = e.nativeEvent; setFilterAnchor({ y: pageY + 30, x: pageX - 220 }); }}>
                        <FilterIcon color={(filterStatus !== 'ALL' || filterPayment !== 'ALL') ? '#FFFFFF' : '#4B5563'} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={['#8BA367']} />}
            >
                {groupedData.map(month => (
                    <View key={month.key} style={{ marginBottom: 16 }}>
                        <TouchableOpacity
                            style={styles.monthHeader}
                            onPress={() => toggleMonth(month.key)}
                            activeOpacity={0.7}
                        >
                            <View>
                                <Text style={styles.monthTitle}>{month.label}</Text>
                                <Text style={styles.monthCount}>{month.total} đơn</Text>
                            </View>
                            <ChevronIcon isOpen={!!expandedMonths[month.key]} />
                        </TouchableOpacity>

                        {expandedMonths[month.key] && month.days.map(day => {
                            const isActive = activeDate === day.label || activeDate === day.key;
                            return (
                                <TouchableOpacity
                                    key={day.key}
                                    style={[styles.dateCard, isActive && styles.dateCardActive]}
                                    onPress={() => { setActiveDate(day.label); setSelectedInvoice(null); }}
                                >
                                    {isActive && (
                                        <LinearGradient
                                            colors={['#F2F7ED', '#E3ECD6']}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                                        />
                                    )}
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.dateTitle, isActive && { color: '#2A3F1D' }]}>{day.label}</Text>
                                            <Text style={[styles.dateCountText, isActive && { color: '#667C54' }]}>{day.items.length} đơn</Text>
                                        </View>
                                        <DotIndicator active={isActive} activeColor="#8BA367" />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    const renderRightPane = () => (
        <View style={styles.rightPane}>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, zIndex: 1 }}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#1E293B' }}>Tổng quan {activeDate}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, zIndex: 1 }}>
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { padding: 0 }]}>
                        <LinearGradient colors={['#10B981', '#047857']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, padding: 24, borderRadius: 24 }}>
                            <View style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.15 }}><ChartBarIcon color="#FFFFFF" size={90} /></View>
                            <ChartBarIcon color="#FFFFFF" size={28} />
                            <Text style={[styles.statValue, { color: '#FFFFFF' }]}>{dayStats.revenue.toLocaleString()}đ</Text>
                            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>Doanh thu</Text>
                        </LinearGradient>
                    </View>
                    <View style={[styles.statCard, { padding: 0 }]}>
                        <LinearGradient colors={['#3B82F6', '#1D4ED8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, padding: 24, borderRadius: 24 }}>
                            <View style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.15 }}><ChartPieIcon color="#FFFFFF" size={90} /></View>
                            <ChartPieIcon color="#FFFFFF" size={28} />
                            <Text style={[styles.statValue, { color: '#FFFFFF' }]}>{dayStats.count}</Text>
                            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>Tổng đơn</Text>
                        </LinearGradient>
                    </View>
                    <View style={[styles.statCard, { padding: 0 }]}>
                        <LinearGradient colors={['#8B5CF6', '#6D28D9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, padding: 24, borderRadius: 24 }}>
                            <View style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.15 }}><CheckCircleIcon color="#FFFFFF" size={90} /></View>
                            <CheckCircleIcon color="#FFFFFF" size={28} />
                            <Text style={[styles.statValue, { color: '#FFFFFF' }]}>{dayStats.success}</Text>
                            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>Hoàn tất</Text>
                        </LinearGradient>
                    </View>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 20, marginLeft: 4 }}>DANH SÁCH GIAO DỊCH</Text>

                {loading && <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    {activeInvoices.length > 0 ? activeInvoices.map(renderInvoiceCard) :
                        (!loading && <View style={{ flex: 1, padding: 60, alignItems: 'center' }}><Text style={{ color: '#94A3B8', fontWeight: '600' }}>Không tìm thấy giao dịch nào</Text></View>)
                    }
                </View>
            </ScrollView>
        </View>
    );

    const renderMobileView = () => (
        <View style={{ flex: 1 }}>
            <View style={[styles.searchRow, { marginTop: 16 }]}>
                <View style={[styles.searchInputWrapper, { flex: 1 }]}>
                    <SearchIcon />
                    <TextInput style={styles.searchInput} placeholder="Tìm mã HD, nhân viên..." placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} />
                </View>
                <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: (filterStatus !== 'ALL' || filterPayment !== 'ALL') ? '#8BA367' : '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', height: 44, width: 44, borderRadius: 12 }]} activeOpacity={0.7} onPress={(e) => { const { pageY, pageX } = e.nativeEvent; setFilterAnchor({ y: pageY + 30, x: pageX - 220 }); }}>
                    <FilterIcon color={(filterStatus !== 'ALL' || filterPayment !== 'ALL') ? '#FFFFFF' : '#4B5563'} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={['#8BA367']} />}>
                {groupedData.map(month => (
                    <View key={month.key} style={{ marginBottom: 16 }}>
                        <TouchableOpacity style={styles.monthHeaderMobile} onPress={() => toggleMonth(month.key)}>
                            <Text style={styles.monthTitle}>{month.label}</Text>
                            <ChevronIcon isOpen={!!expandedMonths[month.key]} />
                        </TouchableOpacity>
                        {expandedMonths[month.key] && month.days.map(day => {
                            const items = day.items.filter(inv => String(inv.idHoaDon).includes(search) || (inv.tenKhachHang || '').toLowerCase().includes(search.toLowerCase()) || (inv.tenNhanVien || inv.tenThuNgan || '').toLowerCase().includes(search.toLowerCase()));
                            if (items.length === 0) return null;
                            return (
                                <View key={day.key} style={{ marginBottom: 12 }}>
                                    <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F8FAFC', marginHorizontal: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: '800', color: '#475569' }}>{day.label}</Text>
                                        <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 12 }}>{items.length} đơn</Text>
                                    </View>
                                    {items.map(renderInvoiceCard)}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            {isTablet ? (
                <View style={styles.splitWrapper}>
                    {renderLeftPane()}
                    {renderRightPane()}
                </View>
            ) : renderMobileView()}
            <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
            
            <Modal visible={!!filterAnchor} transparent animationType="none" statusBarTranslucent>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setFilterAnchor(null)}>
                    {filterAnchor && (
                        <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', top: filterAnchor.y, left: Math.max(10, filterAnchor.x), backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, width: 300, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: '#F1F5F9' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 }}>Trạng thái đơn</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                {[
                                    { value: 'ALL', label: 'Tất cả' },
                                    { value: 'HOAN_TAT', label: 'Hoàn tất' },
                                    { value: 'DA_THANH_TOAN', label: 'Đã thanh toán' },
                                    { value: 'CHO_THANH_TOAN', label: 'Chờ TT' },
                                    { value: 'DA_HUY', label: 'Đã hủy' }
                                ].map(opt => (
                                    <TouchableOpacity 
                                        key={`status-${opt.value}`}
                                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: filterStatus === opt.value ? '#8BA367' : '#F1F5F9' }}
                                        onPress={() => setFilterStatus(opt.value)}
                                    >
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: filterStatus === opt.value ? '#FFFFFF' : '#64748B' }}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 }}>Phương thức thanh toán</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {[
                                    { value: 'ALL', label: 'Tất cả' },
                                    { value: 'TIEN_MAT', label: 'Tiền mặt' },
                                    { value: 'CHUYEN_KHOAN', label: 'Chuyển khoản / Thẻ' }
                                ].map(opt => (
                                    <TouchableOpacity 
                                        key={`payment-${opt.value}`}
                                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: filterPayment === opt.value ? '#8BA367' : '#F1F5F9' }}
                                        onPress={() => setFilterPayment(opt.value)}
                                    >
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: filterPayment === opt.value ? '#FFFFFF' : '#64748B' }}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    splitWrapper: { flex: 1, flexDirection: 'row', padding: 20, gap: 24 },
    leftPane: {
        flex: 0.3, backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 6
    },
    rightPane: {
        flex: 0.7, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 32,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 6,
        overflow: 'hidden'
    },
    paneHeader: { padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
    searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 12 },
    searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#E5E7EB' },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939', padding: 0 },

    monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12 },
    monthHeaderMobile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 8 },
    monthTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
    monthCount: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

    dateCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
    dateCardActive: { borderColor: 'rgba(139, 163, 103, 0.6)', borderWidth: 2, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5, transform: [{ scale: 1.02 }] },
    dateTitle: { fontSize: 16, fontWeight: '800', color: '#475569' },
    dateCountText: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '700' },
    dotIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', marginLeft: 15 },

    statsRow: { flexDirection: 'row', gap: 20, marginBottom: 32, paddingHorizontal: 12, paddingTop: 8 },
    statCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
    statValue: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginTop: 12 },
    statLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },

    invoiceCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
    cardAccent: { width: 6, height: '100%', position: 'absolute', left: 0, top: 0 },
    cardContent: { padding: 20, paddingLeft: 26 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    idRow: { flexDirection: 'row', alignItems: 'center' },
    idText: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
    idValue: { fontSize: 16, fontWeight: '900', color: '#1E2939' },
    statusTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    statusTagText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paymentInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    paymentText: { fontSize: 12, color: '#64748B', marginLeft: 6, fontWeight: '700' },
    totalAmount: { fontSize: 18, fontWeight: '900', color: '#1E2939' },

    toggleGroup: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 3, gap: 2 },
    toggleBtn: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    toggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
});

export default InvoiceTimeline;
