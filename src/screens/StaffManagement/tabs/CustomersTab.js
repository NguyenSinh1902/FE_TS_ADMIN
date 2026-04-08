import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ScrollView as RnScrollView, TextInput, Modal, Platform } from 'react-native';
import styles from './CustomersTab.styles';
import { SearchIcon, FilterIcon, BadgeIcon, CartIcon, CoinIcon, PlusIcon, EditIcon, TrashIcon, CloseIcon } from '../StaffIcons';
import customerApi from '../../../api/customerApi';
import { RefreshControl, ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';
import CustomerFormModal from '../components/CustomerFormModal';

const TIER_NAME_MAP = {
    'MOI': 'Khách mới',
    'BAC': 'Hạng Bạc',
    'VANG': 'Hạng Vàng',
};

const TIER_LABEL_MAP = {
    'MOI': 'MỚI',
    'BAC': 'BẠC',
    'VANG': 'VÀNG',
};

const CustomersTab = ({ onModalStateChange }) => {
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [custSearchQuery, setCustSearchQuery] = useState('');
    const [showCustFilter, setShowCustFilter] = useState(false);
    const [custFilterTier, setCustFilterTier] = useState('ALL');
    const [custSort, setCustSort] = useState('NEWEST'); 
    
    // Modals
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formTarget, setFormTarget] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await customerApi.getAll();
            const mapped = (res || []).map(item => ({
                id: item.idKhachHang,
                hoTen: item.hoTen,
                sdt: item.soDienThoai,
                gioiTinh: item.gioiTinh,
                hangKhachHang: item.hangThanhVien, // BAC, VANG, MOI
                points: item.diemTichLuy || 0,
                totalPoints: item.tongDiemDaTichLuy || 0,
                status: item.trangThai
            }));
            setCustomerList(mapped);
        } catch (error) {
            console.error('Fetch customers error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCustomers();
    };

    React.useEffect(() => {
        onModalStateChange(showCustFilter || !!selectedCustomer || showFormModal);
    }, [showCustFilter, selectedCustomer, showFormModal]);

    const handleDelete = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa khách hàng này?', [
            { text: 'Hủy' },
            { 
                text: 'Xóa', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await customerApi.delete(id);
                        setSelectedCustomer(null);
                        fetchCustomers();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể xóa khách hàng');
                    }
                }
            }
        ]);
    };

    const filteredCustomers = customerList.filter(item => {
        let matchSearch = item.hoTen.toLowerCase().includes(custSearchQuery.toLowerCase()) || item.sdt.includes(custSearchQuery);
        let matchTier = true;
        if (custFilterTier !== 'ALL') matchTier = item.hangKhachHang === custFilterTier;
        return matchSearch && matchTier;
    }).sort((a, b) => {
        if (custSort === 'NEWEST') return b.id - a.id;
        if (custSort === 'OLDEST') return a.id - b.id;
        return 0;
    });

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
            <View style={[styles.cardSearchRow, { marginHorizontal: 16, marginTop: 16, marginBottom: 8 }]}>
                <View style={styles.cardSearchInputWrap}>
                    <SearchIcon />
                    <TextInput 
                        style={styles.cardSearchInput} placeholder="Tìm tên hoặc SĐT khách hàng..."
                        placeholderTextColor="#9CA3AF" value={custSearchQuery} onChangeText={setCustSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.cardFilterBtn} onPress={() => setShowCustFilter(true)}><FilterIcon /></TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {filteredCustomers.length > 0 ? filteredCustomers.map(cust => {
                    let isVang = cust.hangKhachHang === 'VANG';
                    let isBac = cust.hangKhachHang === 'BAC';
                    let badgeColor = isVang ? "#CA8A04" : (isBac ? "#64748B" : "#8BA367");
                    let badgeType = isVang ? 'Vang' : (isBac ? 'Bac' : 'Moi');

                    return (
                        <TouchableOpacity 
                            key={cust.id} 
                            style={styles.customerCard}
                            activeOpacity={0.7}
                            onPress={() => setSelectedCustomer(cust)}
                        >
                            <View style={styles.custTopRow}>
                                <View>
                                    <Text style={styles.custName}>{cust.hoTen}</Text>
                                    <View style={[styles.custBadge, styles[`custBadge${badgeType}`]]}>
                                        <BadgeIcon color={badgeColor} />
                                        <Text style={styles[`custBadgeText${badgeType}`]}>{TIER_LABEL_MAP[cust.hangKhachHang] || cust.hangKhachHang}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.custDateLabel}>Số điện thoại</Text>
                                    <Text style={styles.custDateValue}>{cust.sdt}</Text>
                                </View>
                            </View>
                            <View style={styles.custMetricsRow}>
                                <View style={styles.metricBoxBlue}>
                                    <View style={styles.metricHead}><CoinIcon color="#3B82F6" /><Text style={styles.metricLabel}>Đang có</Text></View>
                                    <Text style={styles.metricValueBlue}>{cust.points} điểm</Text>
                                </View>
                                <View style={styles.metricBoxGreen}>
                                    <View style={styles.metricHead}><CoinIcon color="#10B981" /><Text style={styles.metricLabel}>Tổng tích lũy</Text></View>
                                    <Text style={styles.metricValueGreen}>{cust.totalPoints}đ</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }) : (
                    <View style={{ marginTop: 60, alignItems: 'center' }}>
                        <ActivityIndicator animating={loading} color="#8BA367" />
                        {!loading && <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Không tìm thấy khách hàng nào</Text>}
                    </View>
                )}
            </ScrollView>

            {/* FAB Add */}
            <TouchableOpacity 
                style={styles.fabExtended} 
                activeOpacity={0.8}
                onPress={() => { setFormTarget(null); setShowFormModal(true); }}
            >
                <PlusIcon />
                <Text style={styles.fabText}>Thêm Khách</Text>
            </TouchableOpacity>

            <Modal visible={showCustFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowCustFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: Platform.OS === 'ios' ? 245 : 225 }]}>
                        <Text style={styles.filterGroupTitle}>Thứ tự thời gian</Text>
                        <RadioItem label="Mới nhất" selected={custSort === 'NEWEST'} onPress={() => setCustSort('NEWEST')} />
                        <RadioItem label="Cũ nhất" selected={custSort === 'OLDEST'} onPress={() => setCustSort('OLDEST')} />
                        <View style={{height: 1, backgroundColor: '#F3F4F6', marginVertical: 4}} />
                        <Text style={styles.filterGroupTitle}>Hạng khách hàng</Text>
                        <RadioItem label="Tất cả Hạng" selected={custFilterTier === 'ALL'} onPress={() => setCustFilterTier('ALL')} />
                        <RadioItem label="Khách Hạng Vàng" selected={custFilterTier === 'VANG'} onPress={() => setCustFilterTier('VANG')} />
                        <RadioItem label="Khách Hạng Bạc" selected={custFilterTier === 'BAC'} onPress={() => setCustFilterTier('BAC')} />
                        <RadioItem label="Khách Mới" selected={custFilterTier === 'MOI'} onPress={() => setCustFilterTier('MOI')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={!!selectedCustomer} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setSelectedCustomer(null)}>
                    <View style={styles.custDetailPop}>
                        {selectedCustomer && (
                            <>
                                <View style={styles.custDetailTop}>
                                    <Text style={styles.custDetailTitle}>{selectedCustomer.hoTen}</Text>
                                    <TouchableOpacity onPress={() => setSelectedCustomer(null)}><CloseIcon color="#64748B" /></TouchableOpacity>
                                </View>
                                <View style={styles.custDetailInfoBox}>
                                    <Text style={styles.custDetailLabel}>Số điện thoại: <Text style={styles.custDetailVal}>{selectedCustomer.sdt}</Text></Text>
                                    <Text style={styles.custDetailLabel}>Hạng hiện tại: <Text style={styles.custDetailVal}>{TIER_NAME_MAP[selectedCustomer.hangKhachHang]}</Text></Text>
                                    <Text style={styles.custDetailLabel}>Điểm tích lũy: <Text style={[styles.custDetailVal, {color: '#10B981'}]}>{selectedCustomer.points}</Text></Text>
                                </View>
                                <View style={styles.custDetailActions}>
                                    <TouchableOpacity 
                                        style={styles.custDetailBtnEdit}
                                        onPress={() => { setFormTarget(selectedCustomer); setShowFormModal(true); setSelectedCustomer(null); }}
                                    >
                                        <EditIcon color="#3B82F6" />
                                        <Text style={styles.custDetailBtnTextEdit}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.custDetailBtnDelete}
                                        onPress={() => handleDelete(selectedCustomer.id)}
                                    >
                                        <TrashIcon color="#EF4444" />
                                        <Text style={styles.custDetailBtnTextDelete}>Xóa khách</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            <CustomerFormModal 
                visible={showFormModal} 
                onClose={() => setShowFormModal(false)}
                customer={formTarget}
                onSaveSuccess={fetchCustomers}
            />
        </View>
    );
};

export default CustomersTab;
