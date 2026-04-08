import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, Switch, TextInput, Platform } from 'react-native';
import styles from './StaffTab.styles';
import { 
    ClockIcon, CheckCircleIcon, SearchIcon, FilterIcon, 
    MoreIcon, CloseIcon, EditIcon, TrashIcon 
} from '../StaffIcons';
import staffApi from '../../../api/staffApi';
import { RefreshControl, Alert, ActivityIndicator } from 'react-native';
import StaffFormModal from '../components/StaffFormModal';

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

const StaffTab = ({ onModalStateChange }) => {
    const [activeList, setActiveList] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showStaffFilter, setShowStaffFilter] = useState(false);
    const [staffFilterRole, setStaffFilterRole] = useState('ALL');
    const [staffSort, setStaffSort] = useState('NEWEST'); 
    
    const [actionMenuContext, setActionMenuContext] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

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
                img: `https://i.pravatar.cc/150?u=${item.idNhanVien}` // Fallback img
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
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái nhân viên');
        }
    };

    const handleAccept = async (id) => {
        try {
            await staffApi.updateStatus(id, 'HOAT_DONG');
            Alert.alert('Thành công', 'Đã duyệt nhân viên');
            fetchStaffs();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể duyệt nhân viên');
        }
    };

    const handleReject = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa yêu cầu đăng ký này?', [
            { text: 'Hủy' },
            { 
                text: 'Xóa', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await staffApi.delete(id);
                        fetchStaffs();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể xóa nhân viên');
                    }
                }
            }
        ]);
    };

    const handleDelete = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn sa thải nhân viên này?', [
            { text: 'Hủy' },
            { 
                text: 'Sa thải', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await staffApi.delete(id);
                        setActionMenuContext(null);
                        setSelectedDetail(null);
                        fetchStaffs();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể thực hiện yêu cầu');
                    }
                }
            }
        ]);
    }

    React.useEffect(() => {
        onModalStateChange(!!actionMenuContext || !!selectedDetail || showStaffFilter || !!selectedStaff);
    }, [actionMenuContext, selectedDetail, showStaffFilter, selectedStaff]);

    const onMorePress = (e, item) => {
        setActionMenuContext({ data: item, y: e.nativeEvent.pageY - 30 });
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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={styles.bodyScroll} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {/* CARD 1: CHỜ PHÊ DUYỆT */}
                <View style={[styles.sectionCard, pendingList.length === 0 && { opacity: 0.6 }]}>
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
                                    <TouchableOpacity style={styles.btnAccept} activeOpacity={0.7} onPress={() => handleAccept(item.id)}>
                                        <CheckCircleIcon color="#FFFFFF" />
                                        <Text style={styles.btnAcceptText}>Cấp quyền kích hoạt</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnReject} activeOpacity={0.7} onPress={() => handleReject(item.id)}><CloseIcon /></TouchableOpacity>
                                </View>
                            </View>
                        )) : (
                            <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Không có yêu cầu chờ duyệt</Text>
                        )}
                    </ScrollView>
                </View>

                {/* CARD 2: NHÂN VIÊN ĐANG LÀM */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIconBox, styles.sectionIconBoxGreen]}><CheckCircleIcon /></View>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Danh sách Vận hành</Text>
                            <View style={styles.badgeGreen}><Text style={styles.badgeGreenText}>{filteredActiveList.filter(l=>l.trangThai === 'HOAT_DONG').length}</Text></View>
                        </View>
                    </View>
                    <View style={styles.cardSearchRow}>
                        <View style={styles.cardSearchInputWrap}>
                            <SearchIcon />
                            <TextInput style={styles.cardSearchInput} placeholder="Tìm tên nhân viên..." placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}/>
                        </View>
                        <TouchableOpacity style={styles.cardFilterBtn} onPress={() => setShowStaffFilter(true)}><FilterIcon /></TouchableOpacity>
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        {filteredActiveList.map(item => (
                            <View key={item.id} style={styles.activeItem}>
                                <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} activeOpacity={0.7} onPress={() => setSelectedDetail(item)}>
                                    <View style={styles.avatarWrap}>
                                        {item.img ? <Image source={{ uri: item.img }} style={styles.avatarImg} /> : <View style={[styles.avatarImg, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}><Text style={styles.avatarInitials}>{item.hoTen.charAt(0)}</Text></View>}
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
                </View>
            </ScrollView>

            {/* Modals from StaffTab */}
            <Modal visible={!!actionMenuContext} transparent animationType="fade">
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                    {actionMenuContext && (
                        <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y }]}>
                            <TouchableOpacity style={styles.anchorActionBtn} onPress={() => { setSelectedStaff(actionMenuContext.data); setActionMenuContext(null); }}><EditIcon /><Text style={styles.anchorActionText}>Chỉnh sửa nhân sự</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.anchorActionBtn, { borderBottomWidth: 0 }]} onPress={() => handleDelete(actionMenuContext.data.id)}><TrashIcon /><Text style={[styles.anchorActionText, { color: '#EF4444' }]}>Sa thải</Text></TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            <Modal visible={!!selectedDetail} transparent animationType="fade">
                <TouchableOpacity style={styles.detailModalOverlay} activeOpacity={1} onPress={() => setSelectedDetail(null)}>
                    <TouchableOpacity activeOpacity={1} style={styles.detailCardBox}>
                        {selectedDetail && (
                            <>
                                <View style={styles.overlapAvatarWrap}><Image source={{ uri: selectedDetail.img }} style={styles.ovlAvatarImg} /></View>
                                <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setSelectedDetail(null)}><CloseIcon /></TouchableOpacity>
                                <Text style={styles.detailTitle}>{selectedDetail.hoTen}</Text>
                                <Text style={styles.detailRole}>{selectedDetail.vaiTro}</Text>
                                <View style={styles.detailGrid}>
                                    {[
                                        { label: 'Email liên lạc', val: selectedDetail.email },
                                        { label: 'Số điện thoại', val: selectedDetail.sdt },
                                        { label: 'Ngày sinh', val: selectedDetail.ngaySinh },
                                        { label: 'Giới tính', val: selectedDetail.gioiTinh },
                                        { label: 'Ngày hiệu lực', val: selectedDetail.createdAt || 'N/A' },
                                    ].map((cell, idx) => (
                                        <View key={idx} style={styles.dataCell}><Text style={styles.dataLabel}>{cell.label}</Text><Text style={styles.dataValue}>{cell.val}</Text></View>
                                    ))}
                                    <View style={styles.dataCell}>
                                        <Text style={styles.dataLabel}>Trạng thái Server</Text>
                                        <Text style={[styles.dataValue, { color: selectedDetail.trangThai === 'HOAT_DONG' ? '#10B981' : (selectedDetail.trangThai === 'BI_KHOA' ? '#EF4444' : '#F59E0B') }]}>{STATUS_MAP[selectedDetail.trangThai] || selectedDetail.trangThai}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showStaffFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowStaffFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: Platform.OS === 'ios' ? 380 : 360 }]}>
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
                onSaveSuccess={fetchStaffs}
            />
        </View>
    );
};

export default StaffTab;
