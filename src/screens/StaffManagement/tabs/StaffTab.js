import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, Switch, TextInput, Platform, useWindowDimensions } from 'react-native';
import { RefreshControl, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './StaffTab.styles';
import { 
    ClockIcon, CheckCircleIcon, SearchIcon, FilterIcon, 
    MoreIcon, CloseIcon, EditIcon, TrashIcon 
} from '../StaffIcons';
import staffApi from '../../../api/staffApi';
import StaffFormModal from '../components/StaffFormModal';
import ConfirmModal from '../components/ConfirmModal';
import AddStaffModal from '../components/AddStaffModal';

const AVATAR_DEFAULT = require('../../../assets/images/avatardefault.png');
// Returns a valid Image source — remote URI or local default asset
const getAvatarSource = (uri) => uri ? { uri } : AVATAR_DEFAULT;

const ROLE_MAP = {
    'ADMIN': 'Quản trị',
    'THU_NGAN': 'Thu ngân',
    'PHUC_VU': 'Phục vụ'
};

const STATUS_MAP = {
    'HOAT_DONG': 'Hoạt động',
    'BI_KHOA': 'Bị khóa',
    'CHO_DUYET': 'Chờ duyệt'
};

const StaffTab = ({ onModalStateChange, showToast }) => {
    const [activeList, setActiveList] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showStaffFilter, setShowStaffFilter] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [staffFilterRole, setStaffFilterRole] = useState('ALL');
    const [staffSort, setStaffSort] = useState('NEWEST');
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [actionMenuContext, setActionMenuContext] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [filterPos, setFilterPos] = useState(360);
    const [confirmModalConfig, setConfirmModalConfig] = useState({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => {},
        loading: false
    });

    const fetchStaffs = async () => {
        try {
            setLoading(true);
            const [pending, operating] = await Promise.all([
                staffApi.getPending(),
                staffApi.getOperating()
            ]);
            
            const mapStaff = (item) => ({
                id: item.idNhanVien,
                hoTen: item.hoTen,
                vaiTro: ROLE_MAP[item.vaiTro] || item.vaiTro,
                rawRole: item.vaiTro,
                email: item.email,
                sdt: item.soDienThoai,
                gioiTinh: item.gioiTinh || 'N/A',
                ngaySinh: item.ngaySinh || 'N/A',
                trangThai: item.trangThai,
                img: item.avatar || null,
            });

            setPendingList((pending || []).filter(i => i.vaiTro !== 'ADMIN').map(mapStaff));
            setActiveList((operating || []).filter(i => i.vaiTro !== 'ADMIN').map(mapStaff));
        } catch (error) {
            console.error('Fetch staff error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchStaffs();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStaffs();
    };

    const toggleStatus = async (item) => {
        try {
            const nextStatus = item.trangThai === 'HOAT_DONG' ? 'BI_KHOA' : 'HOAT_DONG';
            await staffApi.updateStatus(item.id, nextStatus);
            fetchStaffs();
            showToast(`Đã ${nextStatus === 'HOAT_DONG' ? 'mở khóa' : 'khóa'} nhân viên`);
        } catch (error) {
            showToast('Không thể cập nhật trạng thái nhân viên');
        }
    };

    const handleAccept = async (id) => {
        try {
            await staffApi.updateStatus(id, 'HOAT_DONG');
            showToast('Đã duyệt nhân viên');
            fetchStaffs();
        } catch (error) {
            showToast('Không thể duyệt nhân viên');
        }
    };

    const handleReject = (id) => {
        setConfirmModalConfig({
            visible: true,
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa yêu cầu đăng ký này?',
            onConfirm: async () => {
                try {
                    setConfirmModalConfig(prev => ({ ...prev, loading: true }));
                    await staffApi.delete(id);
                    fetchStaffs();
                    showToast('Đã xóa yêu cầu đăng ký');
                } catch (error) {
                    showToast('Không thể xóa yêu cầu đăng ký');
                } finally {
                    setConfirmModalConfig({ visible: false, title: '', message: '', onConfirm: () => {}, loading: false });
                }
            }
        });
    };

    const handleDelete = (id) => {
        setConfirmModalConfig({
            visible: true,
            title: 'Xác nhận sa thải',
            message: 'Bạn có chắc muốn sa thải nhân viên này?',
            onConfirm: async () => {
                try {
                    setConfirmModalConfig(prev => ({ ...prev, loading: true }));
                    await staffApi.delete(id);
                    setActionMenuContext(null);
                    setSelectedDetail(null);
                    fetchStaffs();
                    showToast('Đã sa thải nhân viên');
                } catch (error) {
                    showToast('Không thể thực hiện yêu cầu');
                } finally {
                    setConfirmModalConfig({ visible: false, title: '', message: '', onConfirm: () => {}, loading: false });
                }
            }
        });
    };

    React.useEffect(() => {
        onModalStateChange(!!actionMenuContext || !!selectedDetail || showStaffFilter || !!selectedStaff || showAddModal);
    }, [actionMenuContext, selectedDetail, showStaffFilter, selectedStaff, showAddModal]);

    const onMorePress = (e, item) => {
        setActionMenuContext({ data: item, y: e.nativeEvent.pageY - 40 });
    };

    const onFilterPress = (event) => {
        const { pageY } = event.nativeEvent;
        setFilterPos(pageY + 20);
        setShowStaffFilter(true);
    };

    const filteredActiveList = activeList.filter(item => {
        let matchSearch = item.hoTen.toLowerCase().includes(searchQuery.toLowerCase());
        let matchRole = true;
        if (staffFilterRole !== 'ALL') matchRole = item.rawRole === staffFilterRole;
        return matchSearch && matchRole;
    }).sort((a, b) => {
        if (staffSort === 'NEWEST') return b.id - a.id;
        if (staffSort === 'OLDEST') return a.id - b.id;
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

    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const renderPendingList = () => (
        <View style={[styles.sectionCard, pendingList.length === 0 && { opacity: 0.6 }, isTablet && { flex: 1 }]}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}><ClockIcon /></View>
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Tài khoản chờ duyệt</Text>
                    <View style={styles.badgeRed}><Text style={styles.badgeRedText}>{pendingList.length}</Text></View>
                </View>
            </View>
            <ScrollView style={styles.nestedScrollWrap} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {pendingList.length > 0 ? pendingList.map(item => (
                    <View key={item.id} style={styles.pendItem}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setSelectedDetail(item)}>
                            <View style={styles.pendTopRow}>
                                <View style={styles.staffBasicInfo}>
                                    <Text style={styles.staffName}>{item.hoTen}</Text>
                                    <Text style={styles.staffRole}>{item.vaiTro}</Text>
                                    <Text style={styles.staffEmail}>{item.email}</Text>
                                </View>
                                <View style={styles.dateCol}>
                                    <Text style={styles.dateLabel}>Điện thoại</Text>
                                    <Text style={styles.dateValue}>{item.sdt}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.pendActionRow}>
                            <TouchableOpacity style={styles.btnAccept} activeOpacity={0.8} onPress={() => handleAccept(item.id)}>
                                <LinearGradient colors={['#8BA367', '#5D6D45']} style={styles.btnAcceptGradient}>
                                    <CheckCircleIcon color="#FFFFFF" />
                                    <Text style={styles.btnAcceptText}>Cấp quyền</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnReject} activeOpacity={0.7} onPress={() => handleReject(item.id)}>
                                <CloseIcon color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )) : (
                    <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Không có yêu cầu chờ duyệt</Text>
                )}
            </ScrollView>
        </View>
    );

    const renderActiveList = () => (
        <View style={[styles.sectionCard, isTablet && { flex: 1 }]}>
            <View style={isTablet ? styles.tableTopBar : { paddingHorizontal: 16, marginBottom: 16 }}>
                {/* Left: Search + Filter */}
                <View style={styles.tableTopRight}>
                    <View style={styles.cardSearchInputWrap}>
                        <SearchIcon width={18} height={18} />
                        <TextInput style={styles.cardSearchInput} placeholder="Tìm tên nhân viên..." placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}/>
                    </View>
                    <TouchableOpacity style={styles.cardFilterBtn} onPress={onFilterPress}>
                        <FilterIcon width={18} height={18} />
                    </TouchableOpacity>
                </View>

                {/* Right: Add + Pending Buttons (tablet only) */}
                {isTablet && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity
                            style={[styles.pendingActionBtn, { backgroundColor: '#8BA367', paddingHorizontal: 16 }]}
                            onPress={() => setShowAddModal(true)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.pendingActionText, { fontSize: 18, marginRight: 4 }]}>+</Text>
                            <Text style={styles.pendingActionText}>Thêm nhân viên</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pendingActionBtn} onPress={() => setShowPendingModal(true)} activeOpacity={0.8}>
                            <ClockIcon color="#FFF" width={18} height={18} />
                            <Text style={styles.pendingActionText}>Tài khoản chờ duyệt</Text>
                            {pendingList.length > 0 && (
                                <View style={styles.pendingActionBadge}>
                                    <Text style={styles.pendingActionBadgeText}>{pendingList.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {isTablet ? (
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <View style={styles.tableHeaderRow}>
                        <Text style={[styles.thCell, { flex: 2 }]}>Avatar / Họ tên</Text>
                        <Text style={[styles.thCell, { flex: 1.5 }]}>Chức vụ</Text>
                        <Text style={[styles.thCell, { flex: 2 }]}>Email</Text>
                        <Text style={[styles.thCell, { flex: 1.5 }]}>Số điện thoại</Text>
                        <Text style={[styles.thCell, { width: 100, textAlign: 'center' }]}>Trạng thái</Text>
                        <Text style={[styles.thCell, { width: 60, textAlign: 'center' }]}>Thao tác</Text>
                    </View>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}>
                        <View style={{ paddingBottom: 20 }}>
                            {filteredActiveList.map(item => (
                                <TouchableOpacity key={item.id} style={styles.tableRow} activeOpacity={0.7} onPress={() => setSelectedDetail(item)}>
                                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.avatarWrap}>
                                            <Image source={getAvatarSource(item.img)} style={styles.avatarImg} />
                                            <View style={[styles.activeDot, item.trangThai === 'BI_KHOA' && styles.inactiveDot]} />
                                        </View>
                                        <Text style={[styles.tdCellBold, item.trangThai === 'BI_KHOA' && { color: '#9CA3AF' }]} numberOfLines={1}>{item.hoTen}</Text>
                                    </View>
                                    <Text style={[styles.tdCell, { flex: 1.5 }]}>{item.vaiTro}</Text>
                                    <Text style={[styles.tdCell, { flex: 2 }]} numberOfLines={1}>{item.email}</Text>
                                    <Text style={[styles.tdCell, { flex: 1.5 }]}>{item.sdt}</Text>
                                    <View style={{ width: 100, alignItems: 'center' }}>
                                        <Switch trackColor={{ false: "#E5E7EB", true: "#BBF7D0" }} thumbColor={item.trangThai === 'HOAT_DONG' ? "#10B981" : "#FFF"} value={item.trangThai === 'HOAT_DONG'} onValueChange={() => toggleStatus(item)} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}/>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.moreBtn} onPress={(e) => onMorePress(e, item)}><MoreIcon /></TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={{ paddingBottom: 20 }}>
                    {filteredActiveList.map(item => (
                        <View key={item.id} style={styles.activeItem}>
                            <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} activeOpacity={0.7} onPress={() => setSelectedDetail(item)}>
                                <View style={styles.avatarWrap}>
                                    <Image source={getAvatarSource(item.img)} style={styles.avatarImg} />
                                    <View style={[styles.activeDot, item.trangThai === 'BI_KHOA' && styles.inactiveDot]} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.staffName, item.trangThai === 'BI_KHOA' && { color: '#9CA3AF' }]}>{item.hoTen}</Text>
                                    <Text style={styles.staffRole}>{item.vaiTro}</Text>
                                </View>
                            </TouchableOpacity>
                            <Switch trackColor={{ false: "#E5E7EB", true: "#BBF7D0" }} thumbColor={item.trangThai === 'HOAT_DONG' ? "#10B981" : "#FFF"} value={item.trangThai === 'HOAT_DONG'} onValueChange={() => toggleStatus(item)} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginRight: 4 }}/>
                            <TouchableOpacity style={styles.moreBtn} onPress={(e) => onMorePress(e, item)}><MoreIcon /></TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <View style={{ flex: 1, paddingHorizontal: 32, paddingBottom: 32 }}>
                    <View style={styles.tabletMainCol}>
                        {renderActiveList()}
                    </View>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.bodyScroll} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                >
                    {renderPendingList()}
                    {renderActiveList()}
                </ScrollView>
            )}

            {/* Modal for Pending List (Tablet only) */}
            <Modal visible={showPendingModal} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.pendingModalOverlay} activeOpacity={1} onPress={() => setShowPendingModal(false)}>
                    <TouchableOpacity activeOpacity={1} style={styles.pendingModalBox}>
                        <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setShowPendingModal(false)}>
                            <CloseIcon />
                        </TouchableOpacity>
                        <Text style={styles.pendingModalTitle}>Tài khoản chờ duyệt</Text>
                        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={true}>
                            {pendingList.length > 0 ? pendingList.map(item => (
                                <View key={item.id} style={styles.pendItemCard}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setShowPendingModal(false); setSelectedDetail(item); }}>
                                        <View style={styles.pendTopRow}>
                                            <View style={styles.staffBasicInfo}>
                                                <Text style={styles.staffName}>{item.hoTen}</Text>
                                                <Text style={styles.staffRole}>{item.vaiTro}</Text>
                                                <Text style={styles.staffEmail}>{item.email}</Text>
                                            </View>
                                            <View style={styles.dateCol}>
                                                <Text style={styles.dateLabel}>Điện thoại</Text>
                                                <Text style={styles.dateValue}>{item.sdt}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.pendActionRow}>
                                        <TouchableOpacity style={styles.btnAccept} activeOpacity={0.8} onPress={() => handleAccept(item.id)}>
                                            <LinearGradient colors={['#8BA367', '#5D6D45']} style={styles.btnAcceptGradient}>
                                                <CheckCircleIcon color="#FFFFFF" />
                                                <Text style={styles.btnAcceptText}>Cấp quyền kích hoạt</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnReject} activeOpacity={0.7} onPress={() => handleReject(item.id)}>
                                            <CloseIcon color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )) : (
                                <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Không có yêu cầu chờ duyệt</Text>
                            )}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Modals from StaffTab */}
            <Modal visible={!!actionMenuContext} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                    {actionMenuContext && (
                        <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y }]}>
                            <TouchableOpacity style={styles.anchorActionBtn} onPress={() => { setSelectedStaff(actionMenuContext.data); setActionMenuContext(null); }}><EditIcon /><Text style={styles.anchorActionText}>Chỉnh sửa nhân sự</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.anchorActionBtn, { borderBottomWidth: 0 }]} onPress={() => handleDelete(actionMenuContext.data.id)}><TrashIcon /><Text style={[styles.anchorActionText, { color: '#EF4444' }]}>Sa thải</Text></TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            <Modal visible={!!selectedDetail} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.detailModalOverlay} activeOpacity={1} onPress={() => setSelectedDetail(null)}>
                    <TouchableOpacity activeOpacity={1} style={styles.detailCardBox}>
                        {selectedDetail && (
                            <>
                                <View style={styles.overlapAvatarWrap}>
                                    <Image source={getAvatarSource(selectedDetail.img)} style={styles.ovlAvatarImg} />
                                </View>
                                <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setSelectedDetail(null)}><CloseIcon /></TouchableOpacity>
                                <Text style={styles.detailTitle}>{selectedDetail.hoTen}</Text>
                                <Text style={styles.detailRole}>{selectedDetail.vaiTro}</Text>
                                <View style={styles.detailGrid}>
                                    {[
                                        { label: 'Email liên lạc', val: selectedDetail.email },
                                        { label: 'Số điện thoại', val: selectedDetail.sdt },
                                        { label: 'Ngày sinh', val: selectedDetail.ngaySinh },
                                        { label: 'Giới tính', val: selectedDetail.gioiTinh },
                                    ].map((cell, idx) => (
                                        <View key={idx} style={styles.dataCell}><Text style={styles.dataLabel}>{cell.label}</Text><Text style={styles.dataValue}>{cell.val}</Text></View>
                                    ))}
                                    <View style={[styles.dataCell, { width: '100%' }]}>
                                        <Text style={styles.dataLabel}>Trạng thái Server</Text>
                                        <Text style={[styles.dataValue, { color: selectedDetail.trangThai === 'HOAT_DONG' ? '#10B981' : (selectedDetail.trangThai === 'BI_KHOA' ? '#EF4444' : '#F59E0B') }]}>{STATUS_MAP[selectedDetail.trangThai] || selectedDetail.trangThai}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showStaffFilter} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowStaffFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: filterPos }]}>
                        <Text style={styles.filterGroupTitle}>Nhóm Phân quyền</Text>
                        <RadioItem label="Tất cả" selected={staffFilterRole === 'ALL'} onPress={() => setStaffFilterRole('ALL')} />
                        <RadioItem label="Thu ngân" selected={staffFilterRole === 'THU_NGAN'} onPress={() => setStaffFilterRole('THU_NGAN')} />
                        <RadioItem label="Phục vụ" selected={staffFilterRole === 'PHUC_VU'} onPress={() => setStaffFilterRole('PHUC_VU')} />
                        <View style={{height: 1, backgroundColor: '#F3F4F6', marginVertical: 4}} />
                        <Text style={styles.filterGroupTitle}>Sắp xếp Dữ liệu</Text>
                        <RadioItem label="Mới nhất" selected={staffSort === 'NEWEST'} onPress={() => setStaffSort('NEWEST')} />
                        <RadioItem label="Cũ nhất" selected={staffSort === 'OLDEST'} onPress={() => setStaffSort('OLDEST')} />
                    </View>
                </TouchableOpacity>
            </Modal>
            <StaffFormModal 
                visible={!!selectedStaff} 
                onClose={() => setSelectedStaff(null)}
                staff={selectedStaff}
                onSaveSuccess={(msg) => {
                    fetchStaffs();
                    showToast(msg);
                }}
            />

            <AddStaffModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={(msg) => {
                    fetchStaffs();
                    showToast(msg);
                }}
            />

            <ConfirmModal 
                visible={confirmModalConfig.visible}
                title={confirmModalConfig.title}
                message={confirmModalConfig.message}
                onConfirm={confirmModalConfig.onConfirm}
                onCancel={() => setConfirmModalConfig({ visible: false, title: '', message: '', onConfirm: () => {}, loading: false })}
                loading={confirmModalConfig.loading}
            />
        </View>
    );
};

export default StaffTab;
