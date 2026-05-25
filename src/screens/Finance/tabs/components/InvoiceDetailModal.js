import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Line, Path } from 'react-native-svg';
import { CloseIcon, CashIcon, BankIcon, ClockIcon } from '../../FinanceIcons';

const fmt = (n) => (n ?? 0).toLocaleString('vi-VN') + 'đ';

const STATUS_MAP = {
    CHO_XAC_NHAN:  { label: 'Chờ xác nhận', color: '#EA580C' },
    DANG_PHA_CHE:  { label: 'Đang pha chế', color: '#EA580C' },
    CHO_LAY_MON:   { label: 'Chờ lấy món',  color: '#EA580C' },
    DANG_PHUC_VU:  { label: 'Đang phục vụ', color: '#EA580C' },
    CHO_THANH_TOAN:{ label: 'Chờ thanh toán', color: '#DC2626' },
    DA_THANH_TOAN: { label: 'Hoàn tất',     color: '#059669' },
    HOAN_TAT:      { label: 'Hoàn tất',     color: '#059669' },
    DA_HUY:        { label: 'Đã hủy',       color: '#475569' },
};

const TicketCutout = () => (
    <View style={s_modal.cutoutContainer}>
        <View style={s_modal.dashedLineWrapper}>
            <Svg height="2" width="100%">
                <Line x1="0" y1="1" x2="100%" y2="1" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 6" />
            </Svg>
        </View>
    </View>
);

const MetaItem = ({ label, value, valColor = '#1E293B' }) => (
    <View style={s_modal.metaItem}>
        <Text style={s_modal.metaLabel}>{label}</Text>
        <Text style={[s_modal.metaValue, { color: valColor }]} numberOfLines={1}>{value}</Text>
    </View>
);

const SumRow = ({ label, value, color = '#334155', isBold = false }) => (
    <View style={s_modal.sumRow}>
        <Text style={[s_modal.sumLabel, isBold && { fontWeight: '700', color: '#0F172A' }]}>{label}</Text>
        <Text style={[s_modal.sumValue, { color }, isBold && { fontWeight: '800', fontSize: 18 }]}>{value}</Text>
    </View>
);

const InvoiceDetailModal = ({ invoice, onClose }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const modalWidth = isTablet ? 600 : '90%';

    if (!invoice) return null;
    const s = STATUS_MAP[invoice.trangThai] || { label: invoice.trangThai, color: '#64748B' };
    
    const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(iso).toLocaleDateString('vi-VN') : '—';
    const createdAt = fmtTime(invoice.thoiGianTao);
    const payAt = fmtTime(invoice.thoiGianThanhToan);

    return (
        <Modal visible={!!invoice} transparent animationType="slide" statusBarTranslucent>
            <View style={s_modal.overlay}>
                <View style={[s_modal.sheet, { width: modalWidth }]}>
                    
                    {/* Header: Dark & Bold */}
                    <LinearGradient colors={['#0F172A', '#1E293B']} style={s_modal.headerGrad}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View>
                                <Text style={s_modal.hdTitle}>HÓA ĐƠN DỊCH VỤ</Text>
                                <Text style={s_modal.hdCode}>#{invoice.idHoaDon}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={s_modal.closeBtn} activeOpacity={0.7}>
                                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M18 6L6 18M6 6l12 12"/></Svg>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={s_modal.headerTimeRow}>
                            <View>
                                <Text style={s_modal.timeLabel}>Tạo lúc</Text>
                                <Text style={s_modal.timeValue}>{createdAt}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={s_modal.timeLabel}>Thanh toán</Text>
                                <Text style={s_modal.timeValue}>{payAt}</Text>
                            </View>
                        </View>
                        
                        <View style={s_modal.statusBadge}>
                            <Text style={[s_modal.statusText, { color: s.color }]}>{s.label}</Text>
                        </View>
                    </LinearGradient>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                        
                        {/* Meta Info Grid */}
                        <View style={s_modal.metaBox}>
                            <View style={s_modal.metaRow}>
                                <MetaItem label="BÀN" value={(invoice.danhSachTenBan || []).join(', ') || '—'} valColor="#0369A1" />
                                <MetaItem label="LOẠI ĐƠN" value={invoice.loaiDonHang === 'TAI_BAN' ? 'Tại bàn' : invoice.loaiDonHang === 'MANG_VE' ? 'Mang về' : (invoice.loaiDonHang || '—')} />
                            </View>
                            <View style={s_modal.metaRow}>
                                <MetaItem label="THU NGÂN" value={invoice.tenThuNgan || '—'} />
                                <MetaItem label="PHỤC VỤ" value={invoice.tenPhucVu || '—'} />
                            </View>
                            <View style={s_modal.metaRow}>
                                <MetaItem label="KHÁCH HÀNG" value={invoice.tenKhachHang || 'Khách vãng lai'} />
                                <MetaItem label="MÃ KM" value={invoice.maKhuyenMai || '—'} valColor="#B45309" />
                            </View>
                        </View>

                        <TicketCutout />

                        {/* Items */}
                        <View style={{ paddingHorizontal: 24 }}>
                            <Text style={s_modal.sectionTitle}>CHI TIẾT MÓN</Text>
                            {(invoice.danhSachChiTiet || []).map((item, idx) => {
                                let opts = {};
                                try { opts = JSON.parse(item.tuyChonJson || '{}'); } catch(_) {}
                                return (
                                    <View key={idx} style={s_modal.itemRow}>
                                        <View style={s_modal.itemQtyWrap}>
                                            <Text style={s_modal.itemQty}>{item.soLuong}</Text>
                                        </View>
                                        <View style={{ flex: 1, paddingRight: 16 }}>
                                            <Text style={s_modal.itemName}>{item.tenSanPham}</Text>
                                            <Text style={s_modal.itemSub}>
                                                Size {item.tenKichCo || 'M'}
                                                {opts.duong ? ` · Đường ${opts.duong}` : ''}
                                                {opts.da ? ` · ${opts.da}` : ''}
                                            </Text>
                                            {(item.danhSachTopping || []).length > 0 && (
                                                <Text style={s_modal.itemSub}>
                                                    + {item.danhSachTopping.map(t => t.tenTopping).join(', ')}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={s_modal.itemPrice}>{fmt(item.thanhTien)}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <TicketCutout />

                        {/* Summary */}
                        <View style={s_modal.summaryBlock}>
                            <SumRow label="Tổng tiền hàng" value={fmt(invoice.tongTienHang)} />
                            
                            {(invoice.giamGiaKhuyenMai || 0) > 0 &&
                                <SumRow label={`Giảm khuyến mãi${invoice.maKhuyenMai ? ` (${invoice.maKhuyenMai})` : ''}`} value={`-${fmt(invoice.giamGiaKhuyenMai)}`} color="#16A34A" />}
                            
                            {(invoice.giamGiaThanhVien || 0) > 0 &&
                                <SumRow label="Giảm thành viên" value={`-${fmt(invoice.giamGiaThanhVien)}`} color="#16A34A" />}
                                
                            {(invoice.diemSuDung || 0) > 0 &&
                                <SumRow label="Điểm sử dụng" value={`${invoice.diemSuDung} điểm`} color="#D97706" />}
                                
                            {(invoice.tongTienThue || 0) > 0 &&
                                <SumRow label="Thuế & phí" value={`+${fmt(invoice.tongTienThue)}`} />}
                        </View>

                    </ScrollView>

                    {/* Sticky Bottom Total */}
                    <View style={s_modal.bottomSection}>
                        <LinearGradient colors={['#A3CB6C', '#83A849']} style={s_modal.totalCard}>
                            <View>
                                <Text style={s_modal.totalLabel}>TỔNG THANH TOÁN</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                    {invoice.phuongThucThanhToan === 'TIEN_MAT' ? <CashIcon color="#FFF" /> : <BankIcon color="#FFF" />}
                                    <Text style={s_modal.ptttText}>
                                        {invoice.phuongThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : invoice.phuongThucThanhToan === 'CHUYEN_KHOAN' ? 'Chuyển khoản' : (invoice.phuongThucThanhToan || 'Chưa TT')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={s_modal.totalValue}>{fmt(invoice.tongThanhToan)}</Text>
                        </LinearGradient>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const s_modal = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    sheet: {
        backgroundColor: '#FCFDFD', 
        borderRadius: 24, 
        maxHeight: '92%', 
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 20
    },
    headerGrad: { padding: 24, paddingBottom: 32, zIndex: 10 },
    hdTitle: { fontSize: 13, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
    hdCode: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginTop: 2, letterSpacing: 0.5 },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    
    headerTimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
    timeLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
    timeValue: { fontSize: 15, color: '#E2E8F0', fontWeight: '700' },
    
    statusBadge: { 
        position: 'absolute', bottom: -14, alignSelf: 'center', 
        paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, 
        backgroundColor: '#FFFFFF',
        shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 
    },
    statusText: { fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },

    metaBox: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
    metaRow: { flexDirection: 'row', gap: 16 },
    metaItem: { flex: 1 },
    metaLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '800', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    metaValue: { fontSize: 16, color: '#1E293B', fontWeight: '800' },

    cutoutContainer: { height: 24, flexDirection: 'row', alignItems: 'center', marginVertical: 8, paddingHorizontal: 24 },
    dashedLineWrapper: { flex: 1, height: 2, overflow: 'hidden' },

    sectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748B', marginBottom: 12, marginTop: 4, letterSpacing: 0.5 },
    
    itemRow: { flexDirection: 'row', paddingVertical: 12 },
    itemQtyWrap: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 16, marginTop: 2 },
    itemQty: { fontSize: 16, fontWeight: '900', color: '#475569' },
    itemName: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
    itemSub: { fontSize: 14, color: '#64748B', lineHeight: 20, fontWeight: '500' },
    itemPrice: { fontSize: 18, fontWeight: '900', color: '#1E293B', alignSelf: 'flex-start' },

    summaryBlock: { gap: 10, paddingBottom: 8, paddingHorizontal: 24 },
    sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sumLabel: { fontSize: 16, color: '#64748B', fontWeight: '500' },
    sumValue: { fontSize: 17, fontWeight: '800' },

    bottomSection: { padding: 24, paddingTop: 16, backgroundColor: '#FCFDFD' },
    totalCard: { borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#A3CB6C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
    totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '800', letterSpacing: 0.5 },
    ptttText: { fontSize: 16, color: '#FFFFFF', fontWeight: '800' },
    totalValue: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' }
});

export default InvoiceDetailModal;
