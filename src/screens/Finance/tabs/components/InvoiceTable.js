import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput,
    StyleSheet, RefreshControl, ActivityIndicator, Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import invoiceApi from '../../../../api/invoiceApi';
import InvoiceDetailModal from './InvoiceDetailModal';
import { SearchIcon, FilterIcon } from '../../FinanceIcons';
import { useRealtime } from '../../../../context/RealtimeContext';

const CalendarIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#8BA367" strokeWidth="2" />
        <Path d="M16 2V6M8 2V6M3 10H21" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);
const CloseCircleIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="#EF4444" />
        <Path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CFG = {
    CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: '#C2410C', bg: '#FFF7ED' },
    DANG_PHA_CHE: { label: 'Pha chế', color: '#C2410C', bg: '#FFF7ED' },
    CHO_LAY_MON: { label: 'Chờ lấy', color: '#C2410C', bg: '#FFF7ED' },
    DANG_PHUC_VU: { label: 'Phục vụ', color: '#C2410C', bg: '#FFF7ED' },
    CHO_THANH_TOAN: { label: 'Chờ TT', color: '#991B1B', bg: '#FEF2F2' },
    DA_THANH_TOAN: { label: 'Hoàn tất', color: '#166534', bg: '#F0FDF4' },
    HOAN_TAT: { label: 'Hoàn tất', color: '#166534', bg: '#F0FDF4' },
    DA_HUY: { label: 'Đã hủy', color: '#64748B', bg: '#F8FAFC' },
};

// ── Helpers ────────────────────────────────────────────────────────────────
const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
};
const toDisplay = (d) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const DateTimeCell = ({ iso }) => {
    if (!iso) return <View style={tbs.cellTime}><Text style={{ color: '#CBD5E1', fontWeight: '700', fontSize: 16 }}>—</Text></View>;
    const d = new Date(iso);
    const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return (
        <View style={tbs.cellTime}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#1E293B' }}>{timeStr}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>{dayStr}</Text>
        </View>
    );
};

const PaymentPill = ({ method }) => {
    if (method === 'TIEN_MAT') {
        return (
            <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#DCFCE7' }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#166534' }}>Tiền mặt</Text>
            </View>
        );
    }
    if (method === 'CHUYEN_KHOAN') {
        return (
            <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#DBEAFE' }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#1D4ED8' }}>CK / Thẻ</Text>
            </View>
        );
    }
    return <Text style={{ color: '#94A3B8' }}>—</Text>;
};

// ── Table Row ──────────────────────────────────────────────────────────────
const TableRow = ({ inv, onPress, isEven }) => {
    const s = STATUS_CFG[inv.trangThai] || { label: inv.trangThai, color: '#64748B', bg: '#F8FAFC' };
    return (
        <TouchableOpacity
            style={[tbs.row, isEven && tbs.rowEven]}
            onPress={() => onPress(inv)}
            activeOpacity={0.75}
        >
            <Text style={[tbs.cell, tbs.cellId]}>#{inv.idHoaDon}</Text>
            <DateTimeCell iso={inv.thoiGianTao} />
            <DateTimeCell iso={inv.thoiGianThanhToan} />
            <Text style={[tbs.cell, tbs.cellBan]} numberOfLines={1}>
                {(inv.danhSachTenBan || []).join(', ') || '—'}
            </Text>
            <Text style={[tbs.cell, tbs.cellKH]} numberOfLines={1}>
                {inv.tenKhachHang || 'Vãng lai'}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[tbs.cell, tbs.cellTotal]}>
                {(inv.tongThanhToan || 0).toLocaleString()}đ
            </Text>
            <View style={[tbs.cell, tbs.cellPTTT, { alignItems: 'center' }]}>
                <PaymentPill method={inv.phuongThucThanhToan} />
            </View>
            <View style={[tbs.cell, tbs.cellStatus, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                <View style={[tbs.statusPill, { backgroundColor: s.bg }]}>
                    <Text style={[tbs.statusPillText, { color: s.color }]}>{s.label}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────
const InvoiceTable = ({ onModalStateChange }) => {
    // ─── Firebase Realtime ─────────────────────────────────
    const { lastTableUpdate, lastOrderUpdate } = useRealtime();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPayment, setFilterPayment] = useState('ALL');
    const [lastSyncTime, setLastSyncTime] = useState(null);

    useEffect(() => { onModalStateChange(!!selected); }, [selected]);

    const fetchData = async (from, to) => {
        try {
            setLoading(true);
            let res;
            if (from && to) {
                res = await invoiceApi.getByDates(toYMD(from), toYMD(to));
            } else {
                res = await invoiceApi.getAll();
            }
            setInvoices(res || []);
            setLastSyncTime(Date.now());
        } catch (e) {
            console.log('InvoiceTable fetch error:', e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, []);

    // Soft-refetch khi Firebase báo có thay đổi
    const softRefTimer = useRef(null);
    const softFetch = () => {
        // Chỉ soft-fetch nếu đang không lọc theo ngày (tờ không muốn bị mất filter)
        if (startDate && endDate) return;
        if (softRefTimer.current) clearTimeout(softRefTimer.current);
        softRefTimer.current = setTimeout(async () => {
            try {
                const res = await invoiceApi.getAll();
                if (res) { setInvoices(res); setLastSyncTime(Date.now()); }
            } catch (_) {}
        }, 1500);
    };
    useEffect(() => { if (lastOrderUpdate) softFetch(); }, [lastOrderUpdate]);
    useEffect(() => { if (lastTableUpdate) softFetch(); }, [lastTableUpdate]);

    // Auto-poll mỗi 15s
    useEffect(() => {
        const poll = setInterval(() => { if (!startDate && !endDate) fetchData(null, null); }, 15000);
        return () => { clearInterval(poll); if (softRefTimer.current) clearTimeout(softRefTimer.current); };
    }, [startDate, endDate]);

    const handleApply = () => {
        if (startDate && endDate) fetchData(startDate, endDate);
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        fetchData(null, null);
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchSearch = String(inv.idHoaDon).includes(search) ||
        (inv.tenKhachHang || '').toLowerCase().includes(search.toLowerCase()) ||
        (inv.tenNhanVien || inv.tenThuNgan || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || inv.trangThai === filterStatus;
        const matchPayment = filterPayment === 'ALL' || inv.phuongThucThanhToan === filterPayment;
        return matchSearch && matchStatus && matchPayment;
    });

    const revenue = filteredInvoices
        .filter(i => i.trangThai === 'HOAN_TAT' || i.trangThai === 'DA_THANH_TOAN')
        .reduce((s, i) => s + (i.tongThanhToan || 0), 0);

    return (
        <View style={{ flex: 1 }}>
            {/* Top bar */}
            <View style={tbs.topBar}>
                {/* Search & Filter (Left) */}
                <View style={tbs.searchRow}>
                    <View style={tbs.searchInputWrapper}>
                        <SearchIcon />
                        <TextInput style={tbs.searchInput} placeholder="Tìm mã HD, khách hàng..." placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} />
                    </View>
                    <TouchableOpacity style={[tbs.filterBtn, (filterStatus !== 'ALL' || filterPayment !== 'ALL') && { backgroundColor: '#8BA367', borderColor: '#8BA367' }]} activeOpacity={0.7} onPress={(e) => { const { pageY, pageX } = e.nativeEvent; setFilterAnchor({ y: pageY + 30, x: pageX - 260 }); }}>
                        <FilterIcon color={(filterStatus !== 'ALL' || filterPayment !== 'ALL') ? '#FFFFFF' : '#4B5563'} />
                    </TouchableOpacity>
                </View>

                {/* Date range selectors (Right) */}
                <View style={tbs.dateRow}>
                    <TouchableOpacity style={tbs.datePicker} onPress={() => setShowStartPicker(true)}>
                        <CalendarIcon />
                        <Text style={[tbs.dateText, !startDate && tbs.datePlaceholder]}>
                            {startDate ? toDisplay(startDate) : 'Từ ngày'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={tbs.dateArrow}>→</Text>

                    <TouchableOpacity style={tbs.datePicker} onPress={() => setShowEndPicker(true)}>
                        <CalendarIcon />
                        <Text style={[tbs.dateText, !endDate && tbs.datePlaceholder]}>
                            {endDate ? toDisplay(endDate) : 'Đến ngày'}
                        </Text>
                    </TouchableOpacity>

                    {startDate && endDate ? (
                        <TouchableOpacity style={tbs.applyBtn} onPress={handleApply} activeOpacity={0.8}>
                            <LinearGradient colors={['#A3C079', '#8BA367']} style={tbs.applyGrad}>
                                <Text style={tbs.applyText}>Lọc</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : null}

                    {(startDate || endDate) && (
                        <TouchableOpacity style={tbs.applyBtn} onPress={handleClear} activeOpacity={0.8}>
                            <LinearGradient colors={['#FCA5A5', '#EF4444']} style={tbs.applyGrad}>
                                <Text style={tbs.applyText}>Xóa</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Summary bar */}
            <View style={tbs.summaryBar}>
                <View style={tbs.summaryItem}>
                    <Text style={tbs.summaryValue}>{filteredInvoices.length}</Text>
                    <Text style={tbs.summaryLabel}>Tổng đơn</Text>
                </View>
                <View style={tbs.summaryDivider} />
                <View style={tbs.summaryItem}>
                    <Text style={[tbs.summaryValue, { color: '#166534' }]}>{revenue.toLocaleString()}đ</Text>
                    <Text style={tbs.summaryLabel}>Doanh thu</Text>
                </View>
                <View style={tbs.summaryDivider} />
                <View style={tbs.summaryItem}>
                    <Text style={[tbs.summaryValue, { color: '#8BA367' }]}>
                        {filteredInvoices.filter(i => i.trangThai === 'HOAN_TAT' || i.trangThai === 'DA_THANH_TOAN').length}
                    </Text>
                    <Text style={tbs.summaryLabel}>Hoàn tất</Text>
                </View>
                {lastSyncTime && (
                    <>
                        <View style={tbs.summaryDivider} />
                        <View style={[tbs.summaryItem, { flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' }} />
                            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Live</Text>
                        </View>
                    </>
                )}
            </View>

            {loading && invoices.length === 0 && <ActivityIndicator color="#8BA367" style={{ marginTop: 32 }} />}

            {/* Table */}
            {!loading && (
                <>
                    {/* Table Header (Static) */}
                    <View style={tbs.tableHeader}>
                        <Text style={[tbs.th, tbs.cellId]}>Mã HD</Text>
                        <Text style={[tbs.th, tbs.cellTime]}>Tạo lúc</Text>
                        <Text style={[tbs.th, tbs.cellTime]}>Thanh toán</Text>
                        <Text style={[tbs.th, tbs.cellBan]}>Bàn</Text>
                        <Text style={[tbs.th, tbs.cellKH]}>Khách hàng</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={[tbs.th, tbs.cellTotal]}>Tổng TT</Text>
                        <Text style={[tbs.th, tbs.cellPTTT]}>PTTT</Text>
                        <Text style={[tbs.th, tbs.cellStatus, { textAlign: 'right' }]}>Trạng thái</Text>
                    </View>

                    {/* Scrollable rows */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => { setRefreshing(true); fetchData(startDate, endDate); }}
                                colors={['#8BA367']}
                            />
                        }
                    >
                        {filteredInvoices.length === 0 ? (
                            <View style={{ alignItems: 'center', paddingTop: 40 }}>
                                <Text style={{ color: '#94A3B8', fontWeight: '600' }}>Không tìm thấy hóa đơn</Text>
                            </View>
                        ) : filteredInvoices.map((inv, idx) => (
                            <TableRow key={inv.idHoaDon} inv={inv} onPress={setSelected} isEven={idx % 2 === 0} />
                        ))}
                    </ScrollView>
                </>
            )}

            {/* DatePickers */}
            <DatePicker
                modal open={showStartPicker} date={startDate || new Date()} mode="date" locale="vi"
                maximumDate={endDate || new Date()}
                title="Từ ngày" confirmText="Chọn" cancelText="Hủy"
                onConfirm={(d) => { setStartDate(d); setShowStartPicker(false); }}
                onCancel={() => setShowStartPicker(false)}
            />
            <DatePicker
                modal open={showEndPicker} date={endDate || new Date()} mode="date" locale="vi"
                minimumDate={startDate || undefined} maximumDate={new Date()}
                title="Đến ngày" confirmText="Chọn" cancelText="Hủy"
                onConfirm={(d) => { setEndDate(d); setShowEndPicker(false); }}
                onCancel={() => setShowEndPicker(false)}
            />

            <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
            
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

const tbs = StyleSheet.create({
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, gap: 16 },

    searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, maxWidth: 350 },
    searchInputWrapper: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, height: 44,
        borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939', padding: 0 },
    filterBtn: {
        backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
        height: 44, width: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'
    },

    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    datePicker: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9,
        borderWidth: 1.5, borderColor: '#C4D6A4',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    dateText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    datePlaceholder: { color: '#9CA3AF', fontWeight: '500' },
    dateArrow: { fontSize: 14, color: '#94A3B8', fontWeight: '700' },
    applyBtn: { borderRadius: 12, overflow: 'hidden' },
    applyGrad: { paddingHorizontal: 16, paddingVertical: 9 },
    applyText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

    summaryBar: {
        flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
        backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
    },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryValue: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
    summaryLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },
    summaryDivider: { width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 },

    // Table styles
    tableHeader: {
        flexDirection: 'row', backgroundColor: '#F1F5F9',
        paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16,
        borderRadius: 10, marginBottom: 6, alignItems: 'center'
    },
    th: { fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' },
    row: {
        flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
        marginHorizontal: 16, borderRadius: 10, marginBottom: 2,
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'transparent',
        alignItems: 'center'
    },
    rowEven: { backgroundColor: '#FAFAFA' },
    cell: { fontSize: 13, color: '#334155', fontWeight: '600' },

    // Column widths
    cellId: { width: 70 },
    cellTime: { width: 100 },
    cellBan: { width: 150, paddingRight: 10 },
    cellKH: { width: 120, paddingRight: 10 },
    cellTotal: { width: 140, textAlign: 'right', fontWeight: '800', color: '#1E293B', fontSize: 14, paddingRight: 15 },
    cellPTTT: { width: 120, textAlign: 'center' },
    cellStatus: { width: 120, alignItems: 'flex-end', justifyContent: 'center' },

    statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    statusPillText: { fontSize: 10, fontWeight: '800' },
});

export default InvoiceTable;
