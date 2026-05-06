import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
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

const tabletStyles = StyleSheet.create({
    toolbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 0,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '50%',
    },
    searchInputWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
    },
    filterBtn: {
        width: 48, height: 48, borderRadius: 16,
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
    },
    addBtnWrap: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    addBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        height: 48,
        gap: 8,
    },
    addBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    promoCardTablet: {
        width: '50%', // 2 columns
        paddingHorizontal: 8,
        marginBottom: 16,
    }
});

export default function PromotionsTab({ setIsAnyModalOpen }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

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
            {isTablet ? (
                <View style={tabletStyles.toolbarRow}>
                    <View style={tabletStyles.searchWrap}>
                        <View style={tabletStyles.searchInputWrap}>
                            <SearchIcon />
                            <TextInput
                                style={[styles.searchInput, { flex: 1, marginLeft: 10 }]}
                                placeholder="Tìm mã khuyến mãi..."
                                placeholderTextColor="#9CA3AF"
                                value={promoSearchQuery}
                                onChangeText={setPromoSearchQuery}
                            />
                        </View>
                        <TouchableOpacity style={tabletStyles.filterBtn} onPress={() => setShowFilter(true)}>
                            <FilterIcon />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={tabletStyles.addBtnWrap} activeOpacity={0.9} onPress={onOpenAddPromo}>
                        <LinearGradient colors={['#8BA367', '#6B8743']} style={tabletStyles.addBtnGradient}>
                            <PlusIcon />
                            <Text style={tabletStyles.addBtnText}>Thêm mã mới</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
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
            )}

            <ScrollView 
                contentContainerStyle={[styles.bodyScroll, isTablet && { paddingBottom: 50 }]} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                {loading && localPromos.length === 0 && (
                    <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />
                )}
                
                <View style={isTablet ? tabletStyles.gridContainer : null}>
                    {filteredPromos.map(promo => {
                        const active = isPromoActive(promo);
                        const cardContent = (
                            <>
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
                            </>
                        );

                        return isTablet ? (
                            <View key={promo.idKhuyenMai} style={tabletStyles.promoCardTablet}>
                                <TouchableOpacity
                                    style={[styles.promoCard, { marginBottom: 0, width: '100%' }]}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedPromo(promo)}
                                >
                                    {cardContent}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                key={promo.idKhuyenMai}
                                style={styles.promoCard}
                                activeOpacity={0.9}
                                onPress={() => setSelectedPromo(promo)}
                            >
                                {cardContent}
                            </TouchableOpacity>
                        );
                    })}
                </View>
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
                    <View style={[styles.formCard, isTablet && { width: '60%', maxWidth: 700, alignSelf: 'center', padding: 0, borderRadius: 32, overflow: 'hidden' }]}>
                        <View style={{ backgroundColor: '#F8FAFC', padding: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontSize: 22, fontWeight: '900', color: '#1E2939' }}>{isEditMode ? 'Chỉnh sửa mã' : 'Thêm mã mới'}</Text>
                                    <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>Thiết lập chương trình khuyến mãi cho cửa hàng</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowPromoForm(false)} style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                    <CloseIcon />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <ScrollView style={{ padding: 24, maxHeight: 600 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputTitle}>Mã khuyến mãi</Text>
                                <TextInput
                                    style={[styles.textInput, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, height: 52, paddingHorizontal: 16, fontSize: 16, fontWeight: '700' }]}
                                    placeholder="VD: GIAM50K"
                                    placeholderTextColor="#CBD5E1"
                                    autoCapitalize="characters"
                                    value={promoFormData.maCode}
                                    onChangeText={(val) => setPromoFormData({ ...promoFormData, maCode: val })}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 20 }}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.inputTitle}>Giá trị giảm</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, height: 52, paddingHorizontal: 16 }}>
                                        <TextInput
                                            style={{ flex: 1, height: 52, fontSize: 16, fontWeight: '600', color: '#1E2939' }}
                                            placeholder="50,000"
                                            placeholderTextColor="#CBD5E1"
                                            keyboardType="numeric"
                                            value={promoFormData.giaTriGiam}
                                            onChangeText={(val) => setPromoFormData({ ...promoFormData, giaTriGiam: val })}
                                        />
                                        <Text style={{ color: '#94A3B8', fontWeight: '800' }}>{promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? 'VND' : '%'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.inputTitle}>Đơn tối thiểu</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, height: 52, paddingHorizontal: 16 }}>
                                        <TextInput
                                            style={{ flex: 1, height: 52, fontSize: 16, fontWeight: '600', color: '#1E2939' }}
                                            placeholder="200,000"
                                            placeholderTextColor="#CBD5E1"
                                            keyboardType="numeric"
                                            value={promoFormData.donToiThieu}
                                            onChangeText={(val) => setPromoFormData({ ...promoFormData, donToiThieu: val })}
                                        />
                                        <Text style={{ color: '#94A3B8', fontWeight: '800' }}>VND</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputTitle}>Loại khuyến mãi</Text>
                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                                    <TouchableOpacity 
                                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#F0F9FF' : '#F8FAFC', padding: 14, borderRadius: 16, borderWidth: 2, borderColor: promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#0EA5E9' : 'transparent' }}
                                        onPress={() => setPromoFormData({ ...promoFormData, loaiKhuyenMai: 'GIAM_TIEN_MAT' })}
                                    >
                                        <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#0EA5E9' : '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                            {promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#0EA5E9' }} />}
                                        </View>
                                        <Text style={{ fontWeight: '700', color: promoFormData.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#0C4A6E' : '#64748B' }}>Tiền mặt (VND)</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM' ? '#F5F3FF' : '#F8FAFC', padding: 14, borderRadius: 16, borderWidth: 2, borderColor: promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM' ? '#8B5CF6' : 'transparent' }}
                                        onPress={() => setPromoFormData({ ...promoFormData, loaiKhuyenMai: 'GIAM_PHAN_TRAM' })}
                                    >
                                        <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM' ? '#8B5CF6' : '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                            {promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM' && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} />}
                                        </View>
                                        <Text style={{ fontWeight: '700', color: promoFormData.loaiKhuyenMai === 'GIAM_PHAN_TRAM' ? '#4C1D95' : '#64748B' }}>Phần trăm (%)</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputTitle}>Hạn sử dụng</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, height: 52, paddingHorizontal: 16 }}>
                                        <TextInput
                                            style={{ flex: 1, height: 52, fontSize: 16, fontWeight: '600', color: '#1E2939' }}
                                            placeholder="2026-12-31"
                                            placeholderTextColor="#CBD5E1"
                                            value={promoFormData.ngayHetHan}
                                            onChangeText={(val) => setPromoFormData({ ...promoFormData, ngayHetHan: val })}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F1F5F9' }} 
                                    activeOpacity={0.8} 
                                    onPress={() => setPromoFormData({ ...promoFormData, laGiamGiaSauThue: !promoFormData.laGiamGiaSauThue })}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>Giảm sau thuế</Text>
                                    <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: promoFormData.laGiamGiaSauThue ? '#10B981' : '#CBD5E1', padding: 2 }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', alignSelf: promoFormData.laGiamGiaSauThue ? 'flex-end' : 'flex-start' }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={{ padding: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }} onPress={() => setShowPromoForm(false)}>
                                <Text style={{ color: '#64748B', fontSize: 16, fontWeight: '800' }}>Hủy bỏ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 2, height: 56, borderRadius: 16, overflow: 'hidden' }} onPress={handleSavePromo}>
                                <LinearGradient colors={['#8BA367', '#6B8743']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>{isEditMode ? 'Cập nhật khuyến mãi' : 'Tạo mã giảm giá'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal: Promo Detail */}
            <Modal visible={!!selectedPromo} transparent animationType="fade">
                <TouchableOpacity style={styles.detailOverlay} activeOpacity={1} onPress={() => setSelectedPromo(null)}>
                    <View style={[styles.formCard, isTablet && { width: '50%', maxWidth: 500, alignSelf: 'center', padding: 0, borderRadius: 32, overflow: 'hidden' }]}>
                        {selectedPromo && (
                            <View>
                                {/* Header with Gradient */}
                                <LinearGradient colors={['#8BA367', '#6B8743']} style={{ padding: 24, paddingBottom: 40 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View>
                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 4 }}>MÃ KHUYẾN MÃI</Text>
                                            <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900' }}>{selectedPromo.maCode}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setSelectedPromo(null)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 }}>
                                            <CloseIcon />
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>

                                {/* Content */}
                                <View style={{ padding: 24, marginTop: -20, backgroundColor: '#FFFFFF', borderRadius: 32 }}>
                                    <View style={{ backgroundColor: selectedPromo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#ECFDF5' : '#F5F3FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 24 }}>
                                        <Text style={{ color: selectedPromo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? '#059669' : '#4F46E5', fontWeight: '800', fontSize: 13 }}>
                                            {selectedPromo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? 'GIẢM TIỀN MẶT' : 'GIẢM PHẦN TRĂM'}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
                                        <View style={{ width: '45%' }}>
                                            <Text style={styles.infoLabel}>Giá trị giảm</Text>
                                            <Text style={[styles.infoValue, { fontSize: 20 }]}>{selectedPromo.giaTriGiam.toLocaleString()}{selectedPromo.loaiKhuyenMai === 'GIAM_TIEN_MAT' ? 'đ' : '%'}</Text>
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <Text style={styles.infoLabel}>Đơn tối thiểu</Text>
                                            <Text style={[styles.infoValue, { fontSize: 20 }]}>{selectedPromo.donToiThieu.toLocaleString()}đ</Text>
                                        </View>
                                        <View style={{ width: '45%', marginTop: 10 }}>
                                            <Text style={styles.infoLabel}>Ngày bắt đầu</Text>
                                            <Text style={styles.infoValue}>{selectedPromo.ngayBatDau.substring(0, 10)}</Text>
                                        </View>
                                        <View style={{ width: '45%', marginTop: 10 }}>
                                            <Text style={styles.infoLabel}>Ngày hết hạn</Text>
                                            <Text style={styles.infoValue}>{selectedPromo.ngayHetHan.substring(0, 10)}</Text>
                                        </View>
                                    </View>

                                    <View style={{ borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 24, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={styles.infoLabel}>Áp dụng thuế</Text>
                                            <Text style={[styles.infoValue, { fontSize: 14 }]}>{selectedPromo.laGiamGiaSauThue ? 'Giảm sau khi tính thuế' : 'Giảm trước khi tính thuế'}</Text>
                                        </View>
                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: isPromoActive(selectedPromo) ? '#10B981' : '#94A3B8' }} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* FAB */}
            {!isTablet && !isLocalModalOpen && (
                <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8} onPress={onOpenAddPromo}>
                    <PlusIcon />
                    <Text style={styles.fabText}>Thêm mã mới</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
