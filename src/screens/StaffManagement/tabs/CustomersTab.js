import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ScrollView as RnScrollView, TextInput, Modal, Platform, useWindowDimensions } from 'react-native';
import styles from './CustomersTab.styles';
import { SearchIcon, FilterIcon, BadgeIcon, CartIcon, CoinIcon, PlusIcon, EditIcon, TrashIcon, CloseIcon, MoreIcon } from '../StaffIcons';
import customerApi from '../../../api/customerApi';
import { RefreshControl, ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';
import CustomerFormModal from '../components/CustomerFormModal';
import ConfirmModal from '../components/ConfirmModal';
import PurchaseHistoryModal from '../components/PurchaseHistoryModal';
import Svg, { Circle, Path } from 'react-native-svg';

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

const CustomersTab = ({ onModalStateChange, showToast }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [custSearchQuery, setCustSearchQuery] = useState('');
    const [showCustFilter, setShowCustFilter] = useState(false);
    const [custFilterTier, setCustFilterTier] = useState('ALL');
    const [custSort, setCustSort] = useState('NEWEST'); 
    
    // Modals & Menu
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formTarget, setFormTarget] = useState(null);
    const [actionMenuContext, setActionMenuContext] = useState(null);
    const [filterPos, setFilterPos] = useState(225);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyCustomer, setHistoryCustomer] = useState(null);

    const onMorePress = (event, data) => {
        const { pageY } = event.nativeEvent;
        setActionMenuContext({ y: pageY - 40, data });
    };

    const onFilterPress = (event) => {
        const { pageY } = event.nativeEvent;
        setFilterPos(pageY + 20);
        setShowCustFilter(true);
    };

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
        onModalStateChange(showCustFilter || !!selectedDetail || showFormModal || !!actionMenuContext || showHistoryModal);
    }, [showCustFilter, selectedDetail, showFormModal, actionMenuContext, showHistoryModal]);

    const handleDelete = (id) => {
        setCustomerToDelete(id);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;
        try {
            setDeleteLoading(true);
            await customerApi.delete(customerToDelete);
            setSelectedDetail(null);
            setActionMenuContext(null);
            fetchCustomers();
            showToast('Đã xóa khách hàng');
        } catch (error) {
            showToast('Không thể xóa khách hàng');
        } finally {
            setDeleteLoading(false);
            setShowConfirmModal(false);
            setCustomerToDelete(null);
        }
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
            {isTablet ? (
                <View style={{ flex: 1, paddingHorizontal: 32, paddingBottom: 32 }}>
                    <View style={styles.tableTopBar}>
                        <View style={styles.tableTopRight}>
                            <View style={styles.cardSearchInputWrap}>
                                <SearchIcon width={18} height={18} />
                                <TextInput 
                                    style={styles.cardSearchInput} placeholder="Tìm tên hoặc SĐT khách hàng..."
                                    placeholderTextColor="#9CA3AF" value={custSearchQuery} onChangeText={setCustSearchQuery}
                                />
                            </View>
                            <TouchableOpacity style={styles.cardFilterBtn} onPress={onFilterPress}><FilterIcon width={18} height={18} /></TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={styles.addCustomerBtn} 
                            activeOpacity={0.8}
                            onPress={() => { setFormTarget(null); setShowFormModal(true); }}
                        >
                            <PlusIcon color="#FFF" width={18} height={18} />
                            <Text style={styles.addCustomerText}>Thêm mới khách hàng</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, overflow: 'hidden' }}>
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.thCell, { flex: 2 }]}>Khách hàng</Text>
                            <Text style={[styles.thCell, { flex: 1.5 }]}>Số điện thoại</Text>
                            <Text style={[styles.thCell, { flex: 1.5 }]}>Hạng thành viên</Text>
                            <Text style={[styles.thCell, { flex: 1.5 }]}>Điểm tích lũy</Text>
                            <Text style={[styles.thCell, { width: 60, textAlign: 'center' }]}>Thao tác</Text>
                        </View>
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}>
                            <View style={{ paddingBottom: 20 }}>
                                {filteredCustomers.map(cust => {
                                    let isVang = cust.hangKhachHang === 'VANG';
                                    let isBac = cust.hangKhachHang === 'BAC';
                                    let badgeColor = isVang ? "#CA8A04" : (isBac ? "#64748B" : "#8BA367");
                                    let badgeType = isVang ? 'Vang' : (isBac ? 'Bac' : 'Moi');

                                    return (
                                        <TouchableOpacity key={cust.id} style={styles.tableRow} activeOpacity={0.7} onPress={() => setSelectedDetail(cust)}>
                                            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={styles.avatarWrap}>
                                                    <View style={[styles.avatarImg, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}><Text style={styles.avatarInitials}>{cust.hoTen.charAt(0)}</Text></View>
                                                </View>
                                                <Text style={styles.tdCellBold} numberOfLines={1}>{cust.hoTen}</Text>
                                            </View>
                                            <Text style={[styles.tdCell, { flex: 1.5 }]}>{cust.sdt}</Text>
                                            <View style={{ flex: 1.5, flexDirection: 'row' }}>
                                                <View style={[styles.custBadge, styles[`custBadge${badgeType}`]]}>
                                                    <BadgeIcon color={badgeColor} size={14} />
                                                    <Text style={styles[`custBadgeText${badgeType}`]}>{TIER_LABEL_MAP[cust.hangKhachHang] || cust.hangKhachHang}</Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.tdCell, { flex: 1.5, fontWeight: '700', color: '#10B981' }]}>{cust.points} điểm</Text>
                                            <View style={{ width: 60, alignItems: 'center' }}>
                                                <TouchableOpacity style={styles.moreBtn} onPress={(e) => onMorePress(e, cust)}><MoreIcon /></TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                >
                    <View style={{ marginTop: 16, marginBottom: 8, flexDirection: 'row', gap: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                            <View style={[styles.cardSearchInputWrap, { flex: 1, width: 'auto', borderRadius: 12 }]}>
                                <SearchIcon width={18} height={18} />
                                <TextInput 
                                    style={styles.cardSearchInput} placeholder="Tìm tên hoặc SĐT khách hàng..."
                                    placeholderTextColor="#9CA3AF" value={custSearchQuery} onChangeText={setCustSearchQuery}
                                />
                            </View>
                            <TouchableOpacity style={[styles.cardFilterBtn, { borderRadius: 12 }]} onPress={onFilterPress}><FilterIcon width={18} height={18} /></TouchableOpacity>
                        </View>
                    </View>

                    <View>
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
                                    onPress={() => setSelectedDetail(cust)}
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
                    </View>
                </ScrollView>
            )}

            {/* FAB Add (mobile only) */}
            {!isTablet && (
                <TouchableOpacity 
                    style={styles.fabExtended} 
                    activeOpacity={0.8}
                    onPress={() => { setFormTarget(null); setShowFormModal(true); }}
                >
                    <PlusIcon />
                    <Text style={styles.fabText}>Thêm Khách</Text>
                </TouchableOpacity>
            )}

            <Modal visible={showCustFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowCustFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: filterPos }]}>
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

            {/* More Menu Modal */}
            <Modal visible={!!actionMenuContext} transparent animationType="fade">
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                    {actionMenuContext && (
                        <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y }]}>
                            <TouchableOpacity style={styles.anchorActionBtn} onPress={() => { setFormTarget(actionMenuContext.data); setShowFormModal(true); setActionMenuContext(null); }}><EditIcon /><Text style={styles.anchorActionText}>Chỉnh sửa khách</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.anchorActionBtn, { borderBottomWidth: 0 }]} onPress={() => handleDelete(actionMenuContext.data.id)}><TrashIcon /><Text style={[styles.anchorActionText, { color: '#EF4444' }]}>Xóa khách hàng</Text></TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={!!selectedDetail} transparent animationType="fade">
                <TouchableOpacity style={styles.detailModalOverlay} activeOpacity={1} onPress={() => setSelectedDetail(null)}>
                    <TouchableOpacity activeOpacity={1} style={styles.detailCardBox}>
                        {selectedDetail && (
                            <>
                                <View style={styles.overlapAvatarWrap}>
                                    <View style={[styles.ovlAvatarImg, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}><Text style={[styles.avatarInitials, { fontSize: 32 }]}>{selectedDetail.hoTen.charAt(0)}</Text></View>
                                </View>
                                <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setSelectedDetail(null)}><CloseIcon /></TouchableOpacity>
                                <Text style={styles.detailTitle}>{selectedDetail.hoTen}</Text>
                                <Text style={styles.detailRole}>{TIER_NAME_MAP[selectedDetail.hangKhachHang]}</Text>
                                <View style={styles.detailGrid}>
                                    {[
                                        { label: 'Số điện thoại', val: selectedDetail.sdt },
                                        { label: 'Hạng khách hàng', val: TIER_NAME_MAP[selectedDetail.hangKhachHang] },
                                        { label: 'Điểm hiện có', val: `${selectedDetail.points} điểm` },
                                        { label: 'Tổng tích lũy', val: `${selectedDetail.totalPoints.toLocaleString()}đ` },
                                        { label: 'Giới tính', val: selectedDetail.gioiTinh || 'N/A' },
                                    ].map((cell, idx) => (
                                        <View key={idx} style={styles.dataCell}><Text style={styles.dataLabel}>{cell.label}</Text><Text style={styles.dataValue}>{cell.val}</Text></View>
                                    ))}
                                </View>
                                <View style={styles.custDetailActions}>
                                    <TouchableOpacity 
                                        style={styles.custDetailBtnEdit}
                                        onPress={() => { setFormTarget(selectedDetail); setShowFormModal(true); setSelectedDetail(null); }}
                                    >
                                        <EditIcon color="#3B82F6" />
                                        <Text style={styles.custDetailBtnTextEdit}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.custDetailBtnEdit, { backgroundColor: 'rgba(139,163,103,0.1)', flex: 1.2 }]}
                                        onPress={() => { setHistoryCustomer(selectedDetail); setShowHistoryModal(true); }}
                                    >
                                        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
                                            <Path d="M9 15h6M9 11h6" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
                                        </Svg>
                                        <Text style={[styles.custDetailBtnTextEdit, { color: '#8BA367' }]}>Lịch sử mua</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.custDetailBtnDelete}
                                        onPress={() => handleDelete(selectedDetail.id)}
                                    >
                                        <TrashIcon color="#EF4444" />
                                        <Text style={styles.custDetailBtnTextDelete}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <CustomerFormModal 
                visible={showFormModal} 
                onClose={() => setShowFormModal(false)}
                customer={formTarget}
                onSaveSuccess={(msg) => {
                    fetchCustomers();
                    showToast(msg);
                }}
            />

            <PurchaseHistoryModal
                visible={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                customer={historyCustomer}
            />

            <ConfirmModal 
                visible={showConfirmModal}
                title="Xác nhận xóa"
                message="Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setCustomerToDelete(null);
                }}
                loading={deleteLoading}
            />
        </View>
    );
};

export default CustomersTab;
