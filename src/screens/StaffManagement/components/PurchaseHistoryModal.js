import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, TouchableOpacity, ScrollView,
  ActivityIndicator, StyleSheet, useWindowDimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import customerApi from '../../../api/customerApi';

// ─── Icons ───────────────────────────────────────────────────────
const CloseIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
const ReceiptIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="14,2 14,8 20,8" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 15h6M9 11h6M9 7h2" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
const ChevronIcon = ({ down }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d={down ? "M6 9l6 6 6-6" : "M18 15l-6-6-6 6"} stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const TagIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="7" cy="7" r="1.5" stroke="#8BA367" strokeWidth="2" />
  </Svg>
);

// ─── Helpers ─────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n ?? 0) + 'đ';
const fmtDate = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const PAYMENT_MAP = {
  'CHUYEN_KHOAN': 'Chuyển khoản',
  'TIEN_MAT': 'Tiền mặt',
  'THE': 'Thẻ',
};
const ORDER_TYPE_MAP = {
  'TAI_BAN': 'Tại bàn',
  'MANG_VE': 'Mang về',
};
const STATUS_COLOR = {
  'HOAN_TAT': { bg: '#F0FDF4', text: '#16A34A', label: 'Hoàn tất' },
  'DANG_XU_LY': { bg: '#FFF7ED', text: '#EA580C', label: 'Đang xử lý' },
  'DA_HUY': { bg: '#FEF2F2', text: '#DC2626', label: 'Đã hủy' },
};

// ─── Invoice Card ─────────────────────────────────────────────────
const InvoiceCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_COLOR[item.trangThai] || { bg: '#F8FAFC', text: '#64748B', label: item.trangThai };

  return (
    <View style={c.card}>
      {/* Card Header - always visible */}
      <TouchableOpacity style={c.cardTop} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={c.cardTopLeft}>
          <View style={c.receiptIcon}><ReceiptIcon /></View>
          <View>
            <Text style={c.invoiceId}>Hóa đơn #{item.idHoaDon}</Text>
            <Text style={c.invoiceDate}>{fmtDate(item.thoiGianThanhToan || item.thoiGianTao)}</Text>
          </View>
        </View>
        <View style={c.cardTopRight}>
          <Text style={c.totalAmount}>{fmt(item.tongThanhToan)}</Text>
          <View style={[c.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[c.statusText, { color: status.text }]}>{status.label}</Text>
          </View>
          <View style={{ marginLeft: 6, marginTop: 2 }}>
            <ChevronIcon down={!expanded} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Meta row */}
      <View style={c.metaRow}>
        <Text style={c.metaChip}>🏠 {item.danhSachTenBan?.join(', ') || '—'}</Text>
        <Text style={c.metaChip}>🛵 {ORDER_TYPE_MAP[item.loaiDonHang] || item.loaiDonHang}</Text>
        <Text style={c.metaChip}>💳 {PAYMENT_MAP[item.phuongThucThanhToan] || item.phuongThucThanhToan}</Text>
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View style={c.expandBody}>
          {/* Staff Info */}
          <View style={c.staffRow}>
            <Text style={c.staffChip}>👨‍💼 Thu ngân: <Text style={{ fontWeight: '700', color: '#1B2A15' }}>{item.tenThuNgan || '—'}</Text></Text>
            <Text style={c.staffChip}>🧑‍🍳 Phục vụ: <Text style={{ fontWeight: '700', color: '#1B2A15' }}>{item.tenPhucVu || '—'}</Text></Text>
          </View>

          {/* Products */}
          <Text style={c.sectionTitle}>Sản phẩm đã mua</Text>
          {(item.danhSachChiTiet || []).map((p, i) => {
            const opts = (() => { try { return JSON.parse(p.tuyChonJson); } catch { return {}; } })();
            const optText = Object.entries(opts).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · ');
            return (
              <View key={i} style={c.productRow}>
                <View style={c.productDot} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={c.productName}>{p.tenSanPham} <Text style={c.productSize}>({p.tenKichCo})</Text></Text>
                    <Text style={c.productPrice}>{fmt(p.thanhTien)}</Text>
                  </View>
                  <Text style={c.productQty}>x{p.soLuong}  {optText ? `· ${optText}` : ''}</Text>
                  {p.danhSachTopping?.length > 0 && (
                    <Text style={c.productTopping}>
                      🧋 {p.danhSachTopping.map(t => `${t.tenTopping} (+${fmt(t.giaTopping)})`).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}

          {/* Summary */}
          <View style={c.summaryBox}>
            <View style={c.summaryRow}>
              <Text style={c.summaryLabel}>Tiền hàng</Text>
              <Text style={c.summaryVal}>{fmt(item.tongTienHang)}</Text>
            </View>
            {item.giamGiaKhuyenMai > 0 && (
              <View style={c.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TagIcon />
                  <Text style={[c.summaryLabel, { color: '#16A34A' }]}>KM {item.maKhuyenMai}</Text>
                </View>
                <Text style={[c.summaryVal, { color: '#16A34A' }]}>-{fmt(item.giamGiaKhuyenMai)}</Text>
              </View>
            )}
            {item.giamGiaThanhVien > 0 && (
              <View style={c.summaryRow}>
                <Text style={[c.summaryLabel, { color: '#8BA367' }]}>Giảm thành viên</Text>
                <Text style={[c.summaryVal, { color: '#8BA367' }]}>-{fmt(item.giamGiaThanhVien)}</Text>
              </View>
            )}
            {(item.danhSachThuePhi || []).map((tax, i) => (
              <View key={i} style={c.summaryRow}>
                <Text style={[c.summaryLabel, { color: '#94A3B8' }]}>
                  {tax.tenThuePhi} ({tax.loaiGiaTri === 'PHAN_TRAM' ? `${tax.giaTriTaiThoiDiemBan}%` : fmt(tax.giaTriTaiThoiDiemBan)})
                </Text>
                <Text style={[c.summaryVal, { color: '#94A3B8' }]}>+{fmt(tax.soTienQuyDoi)}</Text>
              </View>
            ))}
            <View style={[c.summaryRow, c.summaryTotal]}>
              <Text style={c.summaryTotalLabel}>Thanh toán</Text>
              <Text style={c.summaryTotalVal}>{fmt(item.tongThanhToan)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────
export default function PurchaseHistoryModal({ visible, onClose, customer }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (visible && customer?.id) {
      setLoading(true);
      customerApi.getPurchaseHistory(customer.id)
        .then(res => {
          setHistory(res?.content || []);
          setTotal(res?.totalElements || 0);
        })
        .catch(() => setHistory([]))
        .finally(() => setLoading(false));
    }
  }, [visible, customer?.id]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent={true}>
      <View style={m.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View style={[m.sheet, isTablet && m.sheetTablet]}>
          {/* Header */}
          <LinearGradient colors={['#F7FAF5', '#FFFFFF']} style={m.header}>
            <View style={m.headerLeft}>
              <View style={m.headerIcon}><ReceiptIcon /></View>
              <View>
                <Text style={m.headerTitle}>Lịch sử mua hàng</Text>
                {customer && <Text style={m.headerSub}>{customer.hoTen} · {total} đơn</Text>}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={m.closeBtn}><CloseIcon /></TouchableOpacity>
          </LinearGradient>

          <View style={m.divider} />

          {/* Content */}
          {loading ? (
            <View style={m.center}>
              <ActivityIndicator size="large" color="#8BA367" />
              <Text style={m.loadingText}>Đang tải lịch sử...</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={m.center}>
              <Text style={{ fontSize: 40 }}>🧾</Text>
              <Text style={m.emptyText}>Chưa có đơn hàng nào</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            >
              {/* Stats summary */}
              <View style={m.statsRow}>
                <View style={m.statBox}>
                  <Text style={m.statNum}>{total}</Text>
                  <Text style={m.statLabel}>Tổng đơn</Text>
                </View>
                <View style={m.statBox}>
                  <Text style={[m.statNum, { color: '#10B981' }]}>
                    {fmt(history.reduce((s, i) => s + (i.tongThanhToan || 0), 0))}
                  </Text>
                  <Text style={m.statLabel}>Đã chi (trang này)</Text>
                </View>
                <View style={m.statBox}>
                  <Text style={[m.statNum, { color: '#F59E0B' }]}>{customer?.points ?? 0}</Text>
                  <Text style={m.statLabel}>Điểm hiện có</Text>
                </View>
              </View>

              {history.map(item => <InvoiceCard key={item.idHoaDon} item={item} />)}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const c = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  cardTopLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  receiptIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(139,163,103,0.1)', justifyContent: 'center', alignItems: 'center' },
  invoiceId: { fontSize: 14, fontWeight: '800', color: '#1B2A15' },
  invoiceDate: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  totalAmount: { fontSize: 15, fontWeight: '900', color: '#1B2A15' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingBottom: 12 },
  metaChip: { fontSize: 11, color: '#64748B', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontWeight: '600', borderWidth: 1, borderColor: '#E2E8F0' },

  expandBody: { borderTopWidth: 1, borderTopColor: '#F1F5F9', padding: 14 },
  staffRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 14 },
  staffChip: { fontSize: 12, color: '#64748B' },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  productRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  productDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8BA367', marginTop: 6 },
  productName: { fontSize: 14, fontWeight: '700', color: '#1B2A15' },
  productSize: { fontSize: 12, fontWeight: '400', color: '#94A3B8' },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#1B2A15' },
  productQty: { fontSize: 12, color: '#64748B', marginTop: 2 },
  productTopping: { fontSize: 12, color: '#8BA367', marginTop: 2 },

  summaryBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#64748B' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: '#1B2A15' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8, marginTop: 4, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 14, fontWeight: '800', color: '#1B2A15' },
  summaryTotalVal: { fontSize: 16, fontWeight: '900', color: '#8BA367' },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  sheet: {
    width: '100%', maxWidth: 520, maxHeight: '88%',
    backgroundColor: '#FFFFFF', borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 40, elevation: 20,
  },
  sheetTablet: { maxWidth: 680 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139,163,103,0.12)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1B2A15' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 60, minHeight: 200 },
  loadingText: { marginTop: 12, color: '#94A3B8', fontWeight: '600' },
  emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '600', fontSize: 15 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  statNum: { fontSize: 18, fontWeight: '900', color: '#1B2A15' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2, textAlign: 'center' },
});
