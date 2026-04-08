import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import styles from '../../Facility.styles';
import promotionApi from '../../../../api/promotionApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';

// --- ICONS (Promotions Specific) ---
const ClockIcon = ({ color = "white", stroke = "white" }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2.5" />
        <Path d="M12 7V12L15 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

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

const RadioItem = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.filterOption} onPress={onPress}>
        <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
        <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
            {selected && <View style={styles.filterInnerCircle} />}
        </View>
    </TouchableOpacity>
);

export default function PromotionsTab({ setIsAnyModalOpen }) {
    const [localPromos, setLocalPromos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [promoSearchQuery, setPromoSearchQuery] = useState('');
    const [promoFilterType, setPromoFilterType] = useState('ALL');
    const [promoFilterStatus, setPromoFilterStatus] = useState('ALL');
    const [showPromoForm, setShowPromoForm] = useState(false);
    const [promoFormData, setPromoFormData] = useState({ 
        idKhuyenMai: null, maCode: '', loaiKhuyenMai: 'GIAM_TIEN_MAT', 
        giaTriGiam: '', donToiThieu: '', ngayBatDau: '', ngayHetHan: '', 
        laGiamGiaSauThue: false 
    });
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [actionMenu, setActionMenu] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const res = await promotionApi.getAll();
            setLocalPromos(res || []);
        } catch (error) {
            console.error('Fetch promos error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchPromos();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPromos();
    };

    const isPromoActive = (promo) => {
        const now = new Date();
        const start = new Date(promo.ngayBatDau);
        const end = new Date(promo.ngayHetHan);
        return now >= start && now <= end;
    };

    // Update parent's isAnyModalOpen state
    const isLocalModalOpen = !!selectedPromo || !!actionMenu || showFilter || showPromoForm;
    React.useEffect(() => {
        setIsAnyModalOpen(isLocalModalOpen);
    }, [isLocalModalOpen]);

    const onOpenAddPromo = () => {
        const now = new Date().toISOString().split('T')[0];
        setPromoFormData({ 
            idKhuyenMai: null, maCode: '', loaiKhuyenMai: 'GIAM_TIEN_MAT', 
            giaTriGiam: '', donToiThieu: '', ngayBatDau: now + 'T00:00:00', 
            ngayHetHan: now + 'T23:59:59', laGiamGiaSauThue: false 
        });
        setIsEditMode(false);
        setShowPromoForm(true);
    };

    const onOpenEditPromo = (promo) => {
        setPromoFormData({ ...promo, giaTriGiam: promo.giaTriGiam.toString(), donToiThieu: promo.donToiThieu.toString() });
        setIsEditMode(true);
        setActionMenu(null);
        setShowPromoForm(true);
    };

    const handleSavePromo = async () => {
        const payload = {
            maCode: promoFormData.maCode,
            loaiKhuyenMai: promoFormData.loaiKhuyenMai,
            giaTriGiam: parseFloat(promoFormData.giaTriGiam) || 0,
            donToiThieu: parseFloat(promoFormData.donToiThieu) || 0,
            ngayBatDau: promoFormData.ngayBatDau,
            ngayHetHan: promoFormData.ngayHetHan,
            laGiamGiaSauThue: promoFormData.laGiamGiaSauThue
        };

        try {
            setLoading(true);
            if (isEditMode) {
                await promotionApi.update(promoFormData.idKhuyenMai, payload);
                Alert.alert('Thành công', 'Đã cập nhật khuyến mãi');
            } else {
                await promotionApi.create(payload);
                Alert.alert('Thành công', 'Đã thêm khuyến mãi mới');
            }
            setShowPromoForm(false);
            fetchPromos();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu khuyến mãi');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePromo = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa khuyến mãi này?', [
            { text: 'Hủy' },
            { 
                text: 'Xóa', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await promotionApi.delete(id);
                        setActionMenu(null);
                        fetchPromos();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể xóa khuyến mãi');
                    }
                }
            }
        ]);
    };

    const togglePromoStatus = (id) => {
        // Feature not supported directly by API yet (no PATCH status)
        Alert.alert('Thông báo', 'Tính năng tạm dừng sẽ sớm được cập nhật. Bạn có thể thay đổi ngày hết hạn để điều chỉnh trạng thái.');
    };

    const filteredPromos = localPromos.filter(p => {
        const matchSearch = p.maCode.toLowerCase().includes(promoSearchQuery.toLowerCase());
        const matchType = promoFilterType === 'ALL' || p.loaiKhuyenMai === promoFilterType;
        const active = isPromoActive(p);
        const matchStatus = promoFilterStatus === 'ALL' || (promoFilterStatus === 'ACTIVE' ? active : !active);
        return matchSearch && matchType && matchStatus;
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm mã khuyến mãi..."
                        placeholderTextColor="#9CA3AF"
                        value={promoSearchQuery}
                        onChangeText={setPromoSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.bodyScroll} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {loading && localPromos.length === 0 && (
                    <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />
                )}
                {filteredPromos.map(promo => {
                    const active = isPromoActive(promo);
                    return (
                        <TouchableOpacity
                            key={promo.idKhuyenMai}
                            style={styles.promoCard}
                            activeOpacity={0.9}
                            onPress={() => setSelectedPromo(promo)}
                        >
                            <View style={[styles.couponLeft, { backgroundColor: promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#10B981' : '#6366F1' }]}>
                                <View style={styles.couponCutout} />
                                <Text style={styles.verticalText}>DISCOUNT</Text>
                            </View>

                            <View style={[styles.couponRight, !active && { opacity: 0.6 }]}>
                                <Text style={[styles.promoValueLarge, { color: promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#10B981' : '#6366F1' }]}>
                                    {promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? `Giảm ${promo.giaTriGiam.toLocaleString()}đ` : `Giảm ${promo.giaTriGiam}% off*`}
                                </Text>
                                <Text style={styles.promoCodeStylized}>{promo.maCode}</Text>

                                <View style={[styles.promoTypeBadge, { backgroundColor: promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#ECFDF5' : '#F5F3FF' }]}>
                                    <Text style={[styles.promoTypeText, { color: promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#059669' : '#4F46E5' }]}>
                                        {promo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? 'Tiền mặt' : 'Phần trăm'}
                                    </Text>
                                </View>

                                <View style={styles.promoDetailRow}>
                                    <ClockIcon color="#94A3B8" stroke="#94A3B8" />
                                    <Text style={styles.promoDetailText}>{active ? `Hết hạn: ${promo.ngayHetHan.substring(0, 10)}` : 'Hết hạn/Tạm dừng'}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.moreBtnPromo}
                                    onPress={(e) => {
                                        const { pageY, pageX } = e.nativeEvent;
                                        setActionMenu({ y: pageY - 20, x: pageX - 100, data: promo });
                                    }}
                                >
                                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <Circle cx="12" cy="5" r="2" fill="#94A3B8" />
                                        <Circle cx="12" cy="12" r="2" fill="#94A3B8" />
                                        <Circle cx="12" cy="19" r="2" fill="#94A3B8" />
                                    </Svg>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.promoStatusBtn}
                                    onPress={() => togglePromoStatus(promo.idKhuyenMai)}
                                >
                                    <View style={[styles.statusIndicator, { backgroundColor: active ? '#10B981' : '#94A3B8' }]} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Modal: Action Popover */}
            <Modal visible={!!actionMenu} transparent animationType="fade">
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenu(null)}>
                    {actionMenu && (
                        <View style={[styles.anchorBox, { top: actionMenu.y, left: actionMenu.x }]}>
                            <TouchableOpacity style={styles.anchorItem} onPress={() => onOpenEditPromo(actionMenu.data)}>
                                <EditIcon />
                                <Text style={styles.anchorText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.anchorItem, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}
                                onPress={() => handleDeletePromo(actionMenu.data.idKhuyenMai)}
                            >
                                <TrashIcon />
                                <Text style={[styles.anchorText, { color: '#EF4444' }]}>Xóa KM</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Modal: Filter */}
            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: Platform.OS === 'ios' ? 240 : 220 }]}>
                        <Text style={styles.filterGroupTitle}>Loại giảm giá</Text>
                        <RadioItem label="Tất cả" selected={promoFilterType === 'ALL'} onPress={() => setPromoFilterType('ALL')} />
                        <RadioItem label="Tiền mặt (VND)" selected={promoFilterType === 'GIAM_TIEN_MAT'} onPress={() => setPromoFilterType('GIAM_TIEN_MAT')} />
                        <RadioItem label="Phần trăm (%)" selected={promoFilterType === 'GIAM_PHAN_TRAM'} onPress={() => setPromoFilterType('GIAM_PHAN_TRAM')} />
                        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 }} />
                        <Text style={styles.filterGroupTitle}>Trạng thái mã</Text>
                        <RadioItem label="Tất cả" selected={promoFilterStatus === 'ALL'} onPress={() => setPromoFilterStatus('ALL')} />
                        <RadioItem label="Đang hoạt động" selected={promoFilterStatus === 'ACTIVE'} onPress={() => setPromoFilterStatus('ACTIVE')} />
                        <RadioItem label="Đang tạm dừng" selected={promoFilterStatus === 'INACTIVE'} onPress={() => setPromoFilterStatus('INACTIVE')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal: Promo Form */}
            <Modal visible={showPromoForm} transparent animationType="slide">
                <View style={styles.detailOverlay}>
                    <View style={styles.formCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa mã' : 'Thêm mã mới'}</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Mã khuyến mãi</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="VD: GIAM50K..."
                                value={promoFormData.maCode}
                                onChangeText={(val) => setPromoFormData({ ...promoFormData, maCode: val })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputTitle}>Giá trị giảm</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="50000"
                                    keyboardType="numeric"
                                    value={promoFormData.giaTriGiam}
                                    onChangeText={(val) => setPromoFormData({ ...promoFormData, giaTriGiam: val })}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputTitle}>Đơn tối thiểu</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="200000"
                                    keyboardType="numeric"
                                    value={promoFormData.donToiThieu}
                                    onChangeText={(val) => setPromoFormData({ ...promoFormData, donToiThieu: val })}
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Loại khuyến mãi</Text>
                            <View style={{ gap: 8 }}>
                                <RadioItem label="Giảm tiền mặt (VND)" selected={promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT'} onPress={() => setPromoFormData({ ...promoFormData, loaiKhuyenMai: 'GIAM_TIEN_MAT' })} />
                                <RadioItem label="Giảm theo phần trăm (%)" selected={promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM'} onPress={() => setPromoFormData({ ...promoFormData, loaiKhuyenMai: 'GIAM_PHAN_TRAM' })} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.switchRow} activeOpacity={0.8} onPress={() => setPromoFormData({ ...promoFormData, laGiamGiaSauThue: !promoFormData.laGiamGiaSauThue })}>
                            <Text style={styles.switchLabel}>Giảm giá sau thuế</Text>
                            <View style={[styles.filterOuterCircle, promoFormData.laGiamGiaSauThue && styles.filterOuterSelected]}>
                                {promoFormData.laGiamGiaSauThue && <View style={styles.filterInnerCircle} />}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Hạn sử dụng</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="YYYY-MM-DD"
                                value={promoFormData.ngayHetHan}
                                onChangeText={(val) => setPromoFormData({ ...promoFormData, ngayHetHan: val })}
                            />
                        </View>
                        <View style={styles.actionBtnRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPromoForm(false)}>
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePromo}>
                                <Text style={styles.saveBtnText}>Lưu mã</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal: Promo Detail */}
            <Modal visible={!!selectedPromo} transparent animationType="fade">
                <TouchableOpacity style={styles.detailOverlay} activeOpacity={1} onPress={() => setSelectedPromo(null)}>
                    <View style={styles.formCard}>
                        {selectedPromo && (
                            <>
                                <View style={[styles.modalHeader, { marginBottom: 10 }]}>
                                    <Text style={styles.modalTitle}>{selectedPromo.maCode}</Text>
                                    <TouchableOpacity onPress={() => setSelectedPromo(null)}><CloseIcon /></TouchableOpacity>
                                </View>
                                <Text style={{ color: '#8BA367', fontWeight: '800', marginBottom: 20 }}>
                                    {selectedPromo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? 'GIẢM TIỀN MẶT' : 'GIẢM PHẦN TRĂM'}
                                </Text>
                                <View style={styles.resGrid}>
                                    <View style={styles.resItem}>
                                        <Text style={styles.infoLabel}>Giá trị giảm</Text>
                                        <Text style={styles.infoValue}>{selectedPromo.giaTriGiam.toLocaleString()}đ</Text>
                                    </View>
                                    <View style={styles.resItem}>
                                        <Text style={styles.infoLabel}>Đơn tối thiểu</Text>
                                        <Text style={styles.infoValue}>{selectedPromo.donToiThieu.toLocaleString()}đ</Text>
                                    </View>
                                    <View style={styles.resItem}>
                                        <Text style={styles.infoLabel}>Ngày bắt đầu</Text>
                                        <Text style={styles.infoValue}>{selectedPromo.ngayBatDau.substring(0, 10)}</Text>
                                    </View>
                                    <View style={styles.resItem}>
                                        <Text style={styles.infoLabel}>Ngày hết hạn</Text>
                                        <Text style={styles.infoValue}>{selectedPromo.ngayHetHan.substring(0, 10)}</Text>
                                    </View>
                                </View>
                                <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 15 }]}>
                                    <Text style={styles.infoLabel}>Loại thuế áp dụng</Text>
                                    <Text style={styles.infoValue}>{selectedPromo.laGiamGiaSauThue ? 'Giảm sau thuế' : 'Giảm trước thuế'}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* FAB */}
            {!isLocalModalOpen && (
                <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8} onPress={onOpenAddPromo}>
                    <PlusIcon />
                    <Text style={styles.fabText}>Thêm mã mới</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
