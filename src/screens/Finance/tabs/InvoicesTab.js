import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import styles from './InvoicesTab.styles';
import DatePicker from 'react-native-date-picker';
import invoiceApi from '../../../api/invoiceApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { 
    SearchIcon, FilterIcon, ChevronIcon, TableTypeIcon, BagIcon, 
    CashIcon, BankIcon, CloseIcon 
} from '../FinanceIcons';

const InvoicesTab = ({ onModalStateChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState({ 'Hôm nay': true });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    React.useEffect(() => {
        onModalStateChange(!!selectedInvoice || showFilter);
    }, [selectedInvoice, showFilter]);

    // Filter States
    const [filterOrderType, setFilterOrderType] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPayment, setFilterPayment] = useState('ALL');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    
    // Date Picker States
    const [openStartPicker, setOpenStartPicker] = useState(false);
    const [openEndPicker, setOpenEndPicker] = useState(false);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
            
            // Map and add section (date grouping)
            const now = new Date();
            const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            
            const mapped = (res || []).map(inv => {
                const invDate = new Date(inv.thoiGianTao);
                const invDayStr = `${String(invDate.getDate()).padStart(2, '0')}/${String(invDate.getMonth() + 1).padStart(2, '0')}/${invDate.getFullYear()}`;
                return {
                    ...inv,
                    section: invDayStr === todayStr ? 'Hôm nay' : invDayStr
                };
            });
            
            setInvoices(mapped);
        } catch (error) {
            console.error('Fetch invoices error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchInvoices();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchInvoices();
    };

    const handleApplyFilter = () => {
        setShowFilter(false);
        fetchInvoices();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CHO_XAC_NHAN':
            case 'DANG_PHA_CHE':
            case 'CHO_LAY_MON':
            case 'DANG_PHUC_VU':
                return { box: styles.statusProcessing, text: styles.statusProcessingText, label: 'Đang xử lý' };
            case 'CHO_THANH_TOAN':
                return { box: styles.statusWarning, text: styles.statusWarningText, label: 'Chờ thanh toán' };
            case 'DA_THANH_TOAN':
            case 'HOAN_TAT':
                return { box: styles.statusSuccess, text: styles.statusSuccessText, label: 'Thành công' };
            case 'DA_HUY':
                return { box: styles.statusNeutral, text: styles.statusNeutralText, label: 'Đã hủy' };
            default:
                return { box: styles.statusNeutral, text: styles.statusNeutralText, label: status };
        }
    };

    const formatDateTime = (isoStr) => {
        if (!isoStr) return '---';
        const date = new Date(isoStr);
        const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${time} - ${day}`;
    };

    const setQuickDate = (type) => {
        const now = new Date();
        const start = new Date();
        const end = new Date();
        switch(type) {
            case 'TODAY': break;
            case 'YESTERDAY': start.setDate(now.getDate() - 1); end.setDate(now.getDate() - 1); break;
            case '7DAYS': start.setDate(now.getDate() - 7); break;
            case 'MONTH': start.setDate(1); break;
            default: setFilterStartDate(''); setFilterEndDate(''); return;
        }
        const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        setFilterStartDate(fmt(start));
        setFilterEndDate(fmt(end));
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.idHoaDon.toString().includes(searchQuery) || inv.tenNhanVien?.toLowerCase().includes(searchQuery.toLowerCase()) || inv.danhSachTenBan.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterOrderType === 'ALL' || inv.loaiDonHang === filterOrderType;
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'HOAN_TAT' && inv.trangThai === 'HOAN_TAT') || (filterStatus === 'DA_THANH_TOAN' && inv.trangThai === 'DA_THANH_TOAN') || (filterStatus === 'DA_HUY' && inv.trangThai === 'DA_HUY') || (filterStatus === 'PROCESSING' && ['CHO_XAC_NHAN', 'DANG_PHA_CHE', 'CHO_LAY_MON', 'DANG_PHUC_VU', 'CHO_THANH_TOAN'].includes(inv.trangThai));
        const matchesPayment = filterPayment === 'ALL' || inv.phuongThucThanhToan === filterPayment;
        let matchesDate = true;
        if (filterStartDate || filterEndDate) {
            // Server side filtering handled in fetchInvoices, 
            // but keep local check for robustness or if fetch was 'ALL'
            const invDate = new Date(inv.thoiGianTao);
            invDate.setHours(0, 0, 0, 0);
            if (filterStartDate) {
                const parts = filterStartDate.split('/');
                const start = new Date(parts[2], parts[1] - 1, parts[0]);
                if (invDate < start) matchesDate = false;
            }
            if (filterEndDate) {
                const parts = filterEndDate.split('/');
                const end = new Date(parts[2], parts[1] - 1, parts[0]);
                if (invDate > end) matchesDate = false;
            }
        }
        return matchesSearch && matchesType && matchesStatus && matchesPayment && matchesDate;
    });

    const groupedInvoices = filteredInvoices.reduce((groups, inv) => {
        const group = inv.section;
        if (!groups[group]) groups[group] = [];
        groups[group].push(inv);
        return groups;
    }, {});

    const RadioItem = ({ label, selected, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={onPress}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
            <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
                {selected && <View style={styles.filterInnerCircle} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Tìm mã HD, nhân viên..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.bodyScroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {loading && invoices.length === 0 && (
                    <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />
                )}
                {Object.keys(groupedInvoices).map(sectionName => (
                    <View key={sectionName} style={styles.sectionContainer}>
                        <TouchableOpacity 
                            style={styles.sectionHeader} 
                            activeOpacity={0.7}
                            onPress={() => setExpandedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }))}
                        >
                            <View style={styles.sectionLeft}>
                                <Text style={styles.sectionTitle}>{sectionName}</Text>
                                <View style={styles.badgeCount}>
                                    <Text style={styles.badgeCountText}>{groupedInvoices[sectionName].length}</Text>
                                </View>
                            </View>
                            <ChevronIcon isOpen={expandedSections[sectionName]} />
                        </TouchableOpacity>

                        {expandedSections[sectionName] && groupedInvoices[sectionName].map(inv => {
                            const st = getStatusStyle(inv.trangThai);
                            const accentColor = st.text.color || '#F1F5F9';
                            return (
                                <TouchableOpacity 
                                    key={inv.idHoaDon} style={styles.invoiceCard} activeOpacity={0.9}
                                    onPress={() => setSelectedInvoice(inv)}
                                >
                                    <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardTop}>
                                            <View style={styles.idRow}>
                                                <Text style={styles.idText}>ID:</Text>
                                                <Text style={styles.idValue}>#HD-{inv.idHoaDon}</Text>
                                                <Text style={styles.timeText}>{inv.thoiGianTao.substring(11, 16)}</Text>
                                            </View>
                                            <View style={[styles.statusTag, st.box]}>
                                                <Text style={[styles.statusTagText, st.text]}>{st.label}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardMiddle}>
                                            <View style={styles.typeIconWrapper}>
                                                {inv.loaiDonHang === 'TAI_BAN' ? <TableTypeIcon color={accentColor} /> : <BagIcon color={accentColor} />}
                                            </View>
                                            <View style={styles.typeInfo}>
                                                <Text style={styles.typeLabel}>{inv.loaiDonHang === 'TAI_BAN' ? 'Tại bàn' : 'Mang về'}</Text>
                                                <Text style={styles.typeValue}>{inv.loaiDonHang === 'TAI_BAN' ? inv.danhSachTenBan.join(', ') : 'Matcha Takeaway'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.dashedDivider} />
                                        <View style={styles.cardBottom}>
                                            <View style={styles.paymentInfo}>{inv.phuongThucThanhToan === 'TIEN_MAT' ? <CashIcon /> : <BankIcon />}<Text style={styles.paymentText}>{inv.phuongThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : 'Chuyển khoản'}</Text></View>
                                            <Text style={styles.totalAmount}>{inv.tongThanhToan.toLocaleString()}đ</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>

            {/* Modal & Pickers */}
            <Modal 
                visible={!!selectedInvoice} 
                transparent 
                animationType="slide"
                statusBarTranslucent
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: 20 }]}>
                        <View style={styles.modalHandle} />
                        {selectedInvoice && (
                            <>
                                <View style={styles.modalHeader}>
                                    <View><Text style={styles.modalTitle}>Chi tiết hóa đơn</Text><Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>#HD-{selectedInvoice.idHoaDon}</Text></View>
                                    <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: '#F8FAFC', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }} onPress={() => setSelectedInvoice(null)}><CloseIcon /></TouchableOpacity>
                                </View>
                                <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                                    <View style={styles.billPaper}>
                                        <View style={styles.billHeader}>
                                            <View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Giờ tạo đơn</Text><Text style={styles.billInfoValue}>{formatDateTime(selectedInvoice.thoiGianTao)}</Text></View>
                                            <View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Giờ thanh toán</Text><Text style={styles.billInfoValue}>{formatDateTime(selectedInvoice.thoiGianThanhToan)}</Text></View>
                                            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 }} />
                                            <View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Nhân viên</Text><Text style={styles.billInfoValue}>{selectedInvoice.tenNhanVien}</Text></View>
                                            <View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Hình thức</Text><Text style={styles.billInfoValue}>{selectedInvoice.loaiDonHang === 'TAI_BAN' ? 'Tại bàn' : 'Mang về'}</Text></View>
                                            <View style={styles.billInfoRow}><Text style={styles.billInfoLabel}>Thanh toán</Text><Text style={[styles.billInfoValue, { color: '#8BA367' }]}>{selectedInvoice.phuongThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : 'Chuyển khoản'}</Text></View>
                                        </View>
                                        <Text style={styles.itemListTitle}>Danh sách món</Text>
                                        {selectedInvoice.danhSachChiTiet.map((item, idx) => (
                                            <View key={idx} style={{ marginBottom: 15 }}>
                                                <View style={styles.itemRow}><Text style={styles.itemName}>{item.tenSanPham} ({item.tenKichCo})</Text><Text style={styles.itemQty}>x{item.soLuong}</Text><Text style={styles.itemPrice}>{item.thanhTien.toLocaleString()}đ</Text></View>
                                                {item.danhSachTopping.length > 0 && <Text style={styles.itemToppings}>+ {item.danhSachTopping.map(t => t.tenTopping).join(', ')}</Text>}
                                            </View>
                                        ))}
                                        <View style={styles.summarySection}>
                                            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tiền hàng</Text><Text style={styles.summaryValue}>{selectedInvoice.tongTienHang.toLocaleString()}đ</Text></View>
                                            {selectedInvoice.danhSachThuePhi.map((tp, idx) => (
                                                <View key={idx} style={styles.summaryRow}><Text style={styles.summaryLabel}>{tp.tenThuePhi}</Text><Text style={styles.summaryValue}>+{tp.soTienQuyDoi?.toLocaleString()}đ</Text></View>
                                            ))}
                                            <View style={styles.mainTotalRow}><Text style={styles.mainTotalLabel}>TỔNG CỘNG</Text><Text style={styles.mainTotalValue}>{selectedInvoice.tongThanhToan.toLocaleString()}đ</Text></View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: 120, right: 16, width: 280 }]}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
                            <Text style={styles.filterGroupTitle}>Loại đơn hàng</Text>
                            <RadioItem label="Tất cả" selected={filterOrderType === 'ALL'} onPress={() => setFilterOrderType('ALL')} />
                            <RadioItem label="Tại bàn" selected={filterOrderType === 'TAI_BAN'} onPress={() => setFilterOrderType('TAI_BAN')} />
                            <RadioItem label="Mang về" selected={filterOrderType === 'MANG_VE'} onPress={() => setFilterOrderType('MANG_VE')} />
                            <Text style={styles.filterGroupTitle}>Trạng thái</Text>
                            <RadioItem label="Tất cả" selected={filterStatus === 'ALL'} onPress={() => setFilterStatus('ALL')} />
                            <RadioItem label="Đang xử lý" selected={filterStatus === 'PROCESSING'} onPress={() => setFilterStatus('PROCESSING')} />
                            <RadioItem label="Đã thanh toán" selected={filterStatus === 'DA_THANH_TOAN'} onPress={() => setFilterStatus('DA_THANH_TOAN')} />
                            <RadioItem label="Hoàn tất" selected={filterStatus === 'HOAN_TAT'} onPress={() => setFilterStatus('HOAN_TAT')} />
                            <RadioItem label="Đã hủy" selected={filterStatus === 'DA_HUY'} onPress={() => setFilterStatus('DA_HUY')} />
                            <Text style={styles.filterGroupTitle}>Thanh toán</Text>
                            <RadioItem label="Tất cả" selected={filterPayment === 'ALL'} onPress={() => setFilterPayment('ALL')} />
                            <RadioItem label="Tiền mặt" selected={filterPayment === 'TIEN_MAT'} onPress={() => setFilterPayment('TIEN_MAT')} />
                            <RadioItem label="Chuyển khoản" selected={filterPayment === 'CHUYEN_KHOAN'} onPress={() => setFilterPayment('CHUYEN_KHOAN')} />
                            <Text style={styles.filterGroupTitle}>Phím tắt thời gian</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
                                {['TODAY', 'YESTERDAY', '7DAYS', 'MONTH'].map(type => { const labels = { TODAY: 'Hôm nay', YESTERDAY: 'Hôm qua', '7DAYS': '7 ngày qua', MONTH: 'Tháng này' }; return (<TouchableOpacity key={type} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' }} onPress={() => setQuickDate(type)}><Text style={{ fontSize: 12, color: '#4B5563', fontWeight: '600' }}>{labels[type]}</Text></TouchableOpacity>); })}
                            </View>
                            <Text style={styles.filterGroupTitle}>Khoảng tùy chỉnh</Text>
                            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 10 }}>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, height: 40, justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' }} onPress={() => setOpenStartPicker(true)}><Text style={{ color: filterStartDate ? '#1E293B' : '#9CA3AF', fontSize: 13 }}>{filterStartDate || 'Từ ngày'}</Text></TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, height: 40, justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' }} onPress={() => setOpenEndPicker(true)}><Text style={{ color: filterEndDate ? '#1E293B' : '#9CA3AF', fontSize: 13 }}>{filterEndDate || 'Đến ngày'}</Text></TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{ backgroundColor: '#8BA367', margin: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }} onPress={handleApplyFilter}><Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Áp dụng</Text></TouchableOpacity>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            <DatePicker modal mode="date" title="Chọn ngày bắt đầu" confirmText="Xác nhận" cancelText="Hủy" open={openStartPicker} date={new Date()} onConfirm={(date) => { const fmt = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; setFilterStartDate(fmt); setOpenStartPicker(false); }} onCancel={() => setOpenStartPicker(false)} />
            <DatePicker modal mode="date" title="Chọn ngày kết thúc" confirmText="Xác nhận" cancelText="Hủy" open={openEndPicker} date={new Date()} onConfirm={(date) => { const fmt = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; setFilterEndDate(fmt); setOpenEndPicker(false); }} onCancel={() => setOpenEndPicker(false)} />
        </View>
    );
};

export default InvoicesTab;
