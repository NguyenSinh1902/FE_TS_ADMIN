import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import styles from '../../Facility.styles';
import tableApi from '../../../../api/tableApi';
import reservationApi from '../../../../api/reservationApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';

// --- ICONS (TableMap Specific) ---
const ChairIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M7 13V21M17 13V21M3 13H21M5 13V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V13" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
);

const ClockIcon = ({ color = "white", stroke = "white" }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2.5" />
        <Path d="M12 7V12L15 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const CalendarIcon = ({ color = "white", stroke = "white" }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="2" />
        <Path d="M16 2V6M8 2V6M3 10H21" stroke={stroke} strokeWidth="2" />
    </Svg>
);

const LeafPattern = () => (
    <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d="M10,10 Q20,0 30,10 T50,10 T70,10 T90,10" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
        <Path d="M0,30 Q10,20 20,30 T40,30 T60,30 T80,30 T100,30" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
        <Path d="M10,60 Q20,50 30,60 T50,60 T70,60 T90,60" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
    </Svg>
);

// --- SHARED ICONS (Copying to avoid complex imports for now) ---
const SearchIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
        <Path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const FilterIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const MoreIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="5" r="2" fill="#FFFFFF" />
        <Circle cx="12" cy="12" r="2" fill="#FFFFFF" />
        <Circle cx="12" cy="19" r="2" fill="#FFFFFF" />
    </Svg>
);

const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const EditIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const TrashIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PlusIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19M5 12H19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// --- MOCK DATA ---
// --- MOCK DATA ---
const mockReservations = []; // Deprecated - using API state

const RadioItem = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.filterOption} onPress={onPress}>
        <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
        <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
            {selected && <View style={styles.filterInnerCircle} />}
        </View>
    </TouchableOpacity>
);

export default function TableMapTab({ setIsAnyModalOpen }) {
    const [localTables, setLocalTables] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // ... rest of state stays the same ...
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCapacity, setFilterCapacity] = useState('ALL');
    const [selectedTable, setSelectedTable] = useState(null);
    const [actionMenu, setActionMenu] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, tenBan: '', sucChua: '', tinhTrangBan: 'TRONG' });

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [tablesRes, resvRes] = await Promise.all([
                tableApi.getAll(),
                reservationApi.getAll()
            ]);
            
            const mappedTables = (tablesRes || []).map(t => ({
                id: t.idBan,
                tenBan: t.tenBan,
                sucChua: t.sucChua,
                tinhTrangBan: t.tinhTrangBan
            }));
            
            setLocalTables(mappedTables);
            setReservations(resvRes || []);
        } catch (error) {
            console.error('Fetch facility data error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchAllData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllData();
    };

    const getTableReservation = (banId) => {
        // Only pick active or upcoming reservations (not completed or cancelled)
        return reservations.find(r => 
            (r.trangThaiDat === 'DA_DEN' || r.trangThaiDat === 'CHO_DEN') && 
            r.danhSachBan?.some(b => b.idBan === banId)
        );
    };

    const formatTimeDisplay = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const calculateSessionTime = (isoString) => {
        if (!isoString) return '';
        const start = new Date(isoString);
        const now = new Date();
        const diffMs = now - start;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins <= 0) return '1p'; // Minimal display
        if (diffMins < 60) return `${diffMins}p`;
        const hrs = Math.floor(diffMins / 60);
        const minsRemaining = diffMins % 60;
        return `${hrs}h ${minsRemaining}p`;
    };

    // Update parent's isAnyModalOpen state
    const isLocalModalOpen = !!selectedTable || !!actionMenu || showFilter || showFormModal;
    React.useEffect(() => {
        setIsAnyModalOpen(isLocalModalOpen);
    }, [isLocalModalOpen]);

    const filteredTables = localTables.filter(t => {
        const matchSearch = t.tenBan.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || t.tinhTrangBan === filterStatus;
        const matchCapacity = filterCapacity === 'ALL' || t.sucChua.toString() === filterCapacity;
        return matchSearch && matchStatus && matchCapacity;
    });

    const getReservation = (banId) => mockReservations.find(r => r.banId === banId);

    const onMorePress = (e, table) => {
        const { pageY, pageX } = e.nativeEvent;
        setActionMenu({ y: pageY - 20, x: pageX - 100, data: table });
    };

    const onOpenAdd = () => {
        setFormData({ id: null, tenBan: '', sucChua: '4', tinhTrangBan: 'TRONG' });
        setIsEditMode(false);
        setShowFormModal(true);
    };

    const onOpenEdit = (table) => {
        setFormData({ ...table, sucChua: table.sucChua.toString() });
        setIsEditMode(true);
        setActionMenu(null);
        setShowFormModal(true);
    };

    const handleSaveTable = async () => {
        const payload = {
            tenBan: formData.tenBan,
            sucChua: parseInt(formData.sucChua) || 4
        };

        try {
            setLoading(true);
            if (isEditMode) {
                await tableApi.update(formData.id, payload);
                Alert.alert('Thành công', 'Đã cập nhật thông tin bàn');
            } else {
                await tableApi.create(payload);
                Alert.alert('Thành công', 'Đã thêm bàn mới');
            }
            setShowFormModal(false);
            fetchAllData();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu thông tin bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTable = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa bàn này?', [
            { text: 'Hủy' },
            { 
                text: 'Xóa', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await tableApi.delete(id);
                        setActionMenu(null);
                        fetchAllData();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể xóa bàn');
                    }
                }
            }
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tên bàn..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>Trống</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>Có khách</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendText}>Đặt trước</Text>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.bodyScroll} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {loading && localTables.length === 0 && (
                    <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />
                )}
                <View style={styles.gridContainer}>
                    {filteredTables.map(table => {
                        let bgStyle = styles.bgTrong;
                        let dotColor = '#8BA367';
                        let statusText = 'Trống';
                        const resv = getTableReservation(table.id);

                        if (table.tinhTrangBan === 'CO_KHACH') {
                            bgStyle = styles.bgCoKhach;
                            dotColor = '#C2410C';
                            statusText = 'Có khách';
                        } else if (table.tinhTrangBan === 'DA_DAT') {
                            bgStyle = styles.bgDatTruoc;
                            dotColor = '#D97706';
                            statusText = 'Đã đặt';
                        }

                        return (
                            <TouchableOpacity
                                key={table.id}
                                style={styles.ticketCard}
                                activeOpacity={0.9}
                                onPress={() => setSelectedTable(table)}
                            >
                                <View style={[styles.ticketTop, bgStyle]}>
                                    <View style={styles.patternLayer}>
                                        <LeafPattern />
                                    </View>
                                    <View style={styles.ticketTopRow}>
                                        <View style={styles.statusCircleWrap}>
                                            <ChairIcon color={dotColor} />
                                        </View>
                                        <TouchableOpacity style={styles.moreBtnTicket} onPress={(e) => onMorePress(e, table)}>
                                            <MoreIcon />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.ticketTopRow}>
                                        <Text style={styles.tableName}>{table.tenBan}</Text>
                                        <View style={styles.statusBadgeInline}>
                                            <Text style={styles.statusBadgeText}>{statusText}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.cutoutLeft} />
                                <View style={styles.cutoutRight} />
                                <View style={styles.ticketBottom}>
                                    <View style={styles.ticketBottomRow}>
                                        <Text style={styles.tableSeats}>{table.sucChua} ghế</Text>
                                        {table.tinhTrangBan === 'CO_KHACH' && resv && (
                                            <View style={[styles.timeBadgeBottom, { backgroundColor: '#FEF2F2' }]}>
                                                <ClockIcon color="#EF4444" stroke="#EF4444" />
                                                <Text style={[styles.timeTextBottom, { color: '#EF4444' }]}>
                                                    {calculateSessionTime(resv.thoiGianDat)}
                                                </Text>
                                            </View>
                                        )}
                                        {table.tinhTrangBan === 'DA_DAT' && resv && (
                                            <View style={[styles.timeBadgeBottom, { backgroundColor: '#FFFBEB' }]}>
                                                <CalendarIcon color="#D97706" stroke="#D97706" />
                                                <Text style={[styles.timeTextBottom, { color: '#D97706' }]}>
                                                    {formatTimeDisplay(resv.thoiGianDat)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Modal: Table Detail */}
            <Modal visible={!!selectedTable} transparent animationType="fade">
                <TouchableOpacity style={styles.detailOverlay} activeOpacity={1} onPress={() => setSelectedTable(null)}>
                    <TouchableOpacity activeOpacity={1} style={styles.detailCard}>
                        {selectedTable && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedTable.tenBan}</Text>
                                    <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedTable(null)}>
                                        <CloseIcon />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Sức chứa bàn</Text>
                                    <Text style={styles.infoValue}>{selectedTable.sucChua} người</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <View style={[
                                        styles.badge,
                                        selectedTable.tinhTrangBan === 'TRONG' ? { backgroundColor: '#DCFCE7' } :
                                            (selectedTable.tinhTrangBan === 'CO_KHACH' ? { backgroundColor: '#FEF2F2' } : { backgroundColor: '#FFFBEB' })
                                    ]}>
                                        <Text style={[
                                            styles.badgeText,
                                            selectedTable.tinhTrangBan === 'TRONG' ? { color: '#10B981' } :
                                                (selectedTable.tinhTrangBan === 'CO_KHACH' ? { color: '#EF4444' } : { color: '#F59E0B' })
                                        ]}>
                                            {selectedTable.tinhTrangBan === 'TRONG' ? 'ĐANG TRỐNG' :
                                                (selectedTable.tinhTrangBan === 'CO_KHACH' ? 'CO_KHACH' : 'ĐÃ ĐẶT TRƯỚC')}
                                        </Text>
                                    </View>
                                </View>
                                {getTableReservation(selectedTable.id) ? (
                                    <View style={styles.reservationSection}>
                                        <Text style={styles.resTitle}>
                                            {selectedTable.tinhTrangBan === 'CO_KHACH' ? 'Thông tin khách ngồi' : 'Thông tin đặt bàn'}
                                        </Text>
                                        <View style={styles.resGrid}>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Khách hàng</Text>
                                                <Text style={styles.infoValue}>{getTableReservation(selectedTable.id).tenKhachHang}</Text>
                                            </View>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Điện thoại</Text>
                                                <Text style={styles.infoValue}>{getTableReservation(selectedTable.id).sdtKhachHang}</Text>
                                            </View>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Thời gian</Text>
                                                <Text style={styles.infoValue}>{formatTimeDisplay(getTableReservation(selectedTable.id).thoiGianDat)}</Text>
                                            </View>
                                            <View style={styles.resItem}>
                                                <Text style={styles.infoLabel}>Số người</Text>
                                                <Text style={styles.infoValue}>{getTableReservation(selectedTable.id).soLuongNguoi} người</Text>
                                            </View>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Ghi chú</Text>
                                            <Text style={[styles.infoValue, { fontWeight: '500', color: '#64748B' }]}>
                                                {getTableReservation(selectedTable.id).ghiChu || 'Không có ghi chú'}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>Hiện chưa có lịch đặt chỗ cho bàn này.</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Modal: Action Popover */}
            <Modal visible={!!actionMenu} transparent animationType="fade">
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenu(null)}>
                    {actionMenu && (
                        <View style={[styles.anchorBox, { top: actionMenu.y, left: actionMenu.x }]}>
                            <TouchableOpacity style={styles.anchorItem} onPress={() => onOpenEdit(actionMenu.data)}>
                                <EditIcon />
                                <Text style={styles.anchorText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.anchorItem, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}
                                onPress={() => handleDeleteTable(actionMenu.data.id)}
                            >
                                <TrashIcon />
                                <Text style={[styles.anchorText, { color: '#EF4444' }]}>Xóa bàn</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Modal: Filter */}
            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: Platform.OS === 'ios' ? 240 : 220 }]}>
                        <Text style={styles.filterGroupTitle}>Trạng thái bàn hiện tại</Text>
                        <RadioItem label="Tất cả" selected={filterStatus === 'ALL'} onPress={() => setFilterStatus('ALL')} />
                        <RadioItem label="Bàn trống" selected={filterStatus === 'TRONG'} onPress={() => setFilterStatus('TRONG')} />
                        <RadioItem label="Có khách" selected={filterStatus === 'CO_KHACH'} onPress={() => setFilterStatus('CO_KHACH')} />
                        <RadioItem label="Đặt trước" selected={filterStatus === 'DA_DAT'} onPress={() => setFilterStatus('DA_DAT')} />
                        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 }} />
                        <Text style={styles.filterGroupTitle}>Sức chứa bàn</Text>
                        <RadioItem label="Tất cả" selected={filterCapacity === 'ALL'} onPress={() => setFilterCapacity('ALL')} />
                        <RadioItem label="2 người" selected={filterCapacity === '2'} onPress={() => setFilterCapacity('2')} />
                        <RadioItem label="4 người" selected={filterCapacity === '4'} onPress={() => setFilterCapacity('4')} />
                        <RadioItem label="6+ người" selected={filterCapacity === '6'} onPress={() => setFilterCapacity('6')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal: Form */}
            <Modal visible={showFormModal} transparent animationType="slide">
                <View style={styles.detailOverlay}>
                    <View style={styles.formCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Tên bàn</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="VD: Bàn 09..."
                                value={formData.tenBan}
                                onChangeText={(val) => setFormData({ ...formData, tenBan: val })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Sức chứa (Ghế)</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="VD: 4"
                                keyboardType="numeric"
                                value={formData.sucChua}
                                onChangeText={(val) => setFormData({ ...formData, sucChua: val })}
                            />
                        </View>
                        <View style={styles.actionBtnRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowFormModal(false)}>
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTable}>
                                <Text style={styles.saveBtnText}>Lưu bàn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* FAB */}
            {!isLocalModalOpen && (
                <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8} onPress={onOpenAdd}>
                    <PlusIcon />
                    <Text style={styles.fabText}>Thêm bàn mới</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
