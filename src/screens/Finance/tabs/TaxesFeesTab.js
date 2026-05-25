import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, useWindowDimensions, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './TaxesFeesTab.styles';
import { 
    SearchIcon, FilterIcon, TaxIcon, CloseIcon,
    TeaLeafIcon, MatchaCupIcon, PearlIcon, TeapotIcon 
} from '../FinanceIcons';
import taxApi from '../../../api/taxApi';
import { RefreshControl, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNotifications } from '../../../context/NotificationContext';
import ConfirmModal from '../../../components/ConfirmModal';

const EditIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const TrashIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const TaxesFeesTab = ({ onModalStateChange }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const { showToast } = useNotifications();

    const [searchQuery, setSearchQuery] = useState('');
    const [actionMenu, setActionMenu] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState('ALL'); // ALL | DEFAULT | OPTIONAL
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        onModalStateChange(showTaxModal || showFilter || !!actionMenu);
    }, [showTaxModal, showFilter, actionMenu]);

    // Form states
    const [formTaxName, setFormTaxName] = useState('');
    const [formTaxValue, setFormTaxValue] = useState('');
    const [formTaxType, setFormTaxType] = useState('PHAN_TRAM'); // PHAN_TRAM | TIEN_MAT
    const [formTaxIsDefault, setFormTaxIsDefault] = useState(false);

    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTaxes = async () => {
        try {
            setLoading(true);
            const res = await taxApi.getAll();
            setTaxes(res || []);
        } catch (error) {
            console.error('Fetch taxes error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTaxes();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTaxes();
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
    };

    const openTaxModal = (tax = null) => {
        setSelectedTax(tax);
        setFormTaxName(tax ? tax.tenThuePhi : '');
        setFormTaxValue(tax ? tax.giaTri.toString() : '');
        setFormTaxType(tax ? tax.loaiGiaTri : 'PHAN_TRAM');
        setFormTaxIsDefault(tax ? tax.laMacDinh : false);
        setShowTaxModal(true);
    };

    const handleSaveTax = async () => {
        if (!formTaxName || !formTaxValue) {
            showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        const payload = {
            tenThuePhi: formTaxName,
            giaTri: parseFloat(formTaxValue),
            loaiGiaTri: formTaxType,
            laMacDinh: formTaxIsDefault
        };

        try {
            setLoading(true);
            if (selectedTax) {
                await taxApi.update(selectedTax.idThuePhi, payload);
                showToast('Thành công', 'Đã cập nhật thuế/phí', 'success');
            } else {
                await taxApi.create(payload);
                showToast('Thành công', 'Đã thêm thuế/phí mới', 'success');
            }
            setShowTaxModal(false);
            fetchTaxes();
        } catch (error) {
            showToast('Lỗi', 'Không thể lưu thông tin', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTax = (id) => {
        setActionMenu(null);
        setTimeout(() => {
            setConfirmAction({
                message: 'Bạn có chắc muốn xóa thuế/phí này?',
                onConfirm: async () => {
                    try {
                        await taxApi.delete(id);
                        fetchTaxes();
                        showToast('Thành công', 'Đã xóa thuế/phí', 'success');
                    } catch (error) {
                        showToast('Lỗi', 'Không thể xóa thuế/phí', 'error');
                    }
                }
            });
        }, 150);
    };

    const filteredTaxes = taxes.filter(t => {
        const matchesSearch = t.tenThuePhi.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'ALL' || 
                             (filterType === 'DEFAULT' && t.laMacDinh) || 
                             (filterType === 'OPTIONAL' && !t.laMacDinh);
        return matchesSearch && matchesFilter;
    });

    const tabletStyles = StyleSheet.create({
        screenWrapper: { flex: 1, padding: 20 },
        premiumBox: {
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 28,
            padding: 32,
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 6,
            overflow: 'hidden'
        },
        toolbar: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 32
        },
        searchGroup: { 
            flexDirection: 'row', 
            alignItems: 'center', 
            width: '40%', 
            gap: 12 
        },
        searchBox: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            height: 48,
            borderRadius: 14,
            paddingHorizontal: 16,
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
            borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.1)'
        },
        filterBtn: {
            width: 48,
            height: 48,
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
            borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.1)'
        },
        addBtnGradient: { borderRadius: 24, overflow: 'hidden', shadowColor: '#8BA367', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
        addBtnInner: { paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
        addBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
        
        card: {
            flex: 1,
            maxWidth: '31.3%',
            minWidth: '31.3%',
            borderRadius: 24,
            margin: '1%',
            padding: 24,
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 5,
            overflow: 'hidden',
            borderWidth: 1, borderColor: '#F1F5F9'
        },
        cardDefault: {
            borderWidth: 1.5,
            borderColor: 'rgba(139, 163, 103, 0.3)',
            shadowColor: '#8BA367', shadowOpacity: 0.12
        },
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
        iconContainer: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 163, 103, 0.08)', justifyContent: 'center', alignItems: 'center' },
        taxName: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
        taxValue: { fontSize: 28, fontWeight: '900', color: '#8BA367', letterSpacing: -0.5 },
        badge: { 
            backgroundColor: '#8BA367', 
            paddingHorizontal: 10, 
            paddingVertical: 4, 
            borderRadius: 8,
            marginLeft: 6
        },
        badgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
        optionalBadge: {
            backgroundColor: 'rgba(71, 85, 105, 0.08)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            marginLeft: 6
        },
        optionalBadgeText: { fontSize: 9, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' },
        typeBadge: {
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            borderWidth: 1,
        },
        typeBadgeText: { fontSize: 9, fontWeight: '800' }
    });

    const renderTabletItem = ({ item }) => (
        <View style={[tabletStyles.card, item.laMacDinh && tabletStyles.cardDefault]}>
            <LinearGradient 
                colors={item.laMacDinh ? ['#ECFCCB', '#FFFFFF'] : ['#E0E7FF', '#FFFFFF']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
            />
            
            {/* Corner Decoration */}
            <View style={{ position: 'absolute', top: -10, right: -10 }}>
                {item.laMacDinh ? <TeaLeafIcon size={120} opacity={0.15} /> : <MatchaCupIcon size={120} opacity={0.12} />}
            </View>

            <View style={tabletStyles.cardHeader}>
                <View style={[tabletStyles.iconContainer, !item.laMacDinh && { backgroundColor: 'rgba(99, 102, 241, 0.08)' }]}>
                    <TaxIcon color={item.laMacDinh ? '#8BA367' : '#6366F1'} size={20} />
                </View>
                <TouchableOpacity 
                    onPress={(e) => {
                        const { pageY, pageX } = e.nativeEvent;
                        setActionMenu({ y: pageY - 20, x: pageX - 150, data: item });
                    }}
                >
                    <Text style={{ fontSize: 20, color: '#94A3B8', fontWeight: '900', padding: 4 }}>•••</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1 }}>
                <Text style={tabletStyles.taxName} numberOfLines={1}>{item.tenThuePhi}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
                    <Text style={[tabletStyles.taxValue, !item.laMacDinh && { color: '#6366F1' }]}>
                        {item.loaiGiaTri === 'PHAN_TRAM' ? `${item.giaTri}%` : formatCurrency(item.giaTri)}
                    </Text>
                    
                    <View style={{ flexDirection: 'row' }}>
                        {/* Type Tag */}
                        <View style={[
                            tabletStyles.typeBadge, 
                            { 
                                backgroundColor: item.loaiGiaTri === 'PHAN_TRAM' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                                borderColor: item.loaiGiaTri === 'PHAN_TRAM' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                            }
                        ]}>
                            <Text style={[
                                tabletStyles.typeBadgeText, 
                                { color: item.loaiGiaTri === 'PHAN_TRAM' ? '#10B981' : '#6366F1' }
                            ]}>
                                {item.loaiGiaTri === 'PHAN_TRAM' ? 'Phần trăm' : 'Tiền mặt'}
                            </Text>
                        </View>

                        {/* Default/Optional Tag */}
                        {item.laMacDinh ? (
                            <View style={tabletStyles.badge}><Text style={tabletStyles.badgeText}>MẶC ĐỊNH</Text></View>
                        ) : (
                            <View style={tabletStyles.optionalBadge}><Text style={tabletStyles.optionalBadgeText}>Tùy chọn</Text></View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );

    const renderTabletView = () => (
        <View style={tabletStyles.screenWrapper}>
            <View style={tabletStyles.premiumBox}>
                <LinearGradient 
                    colors={['#F0F4EF', '#FFFFFF']} 
                    start={{x: 1, y: 0}} end={{x: 0, y: 1}}
                    style={StyleSheet.absoluteFill}
                />
                
                {/* Background Decals */}
                <View style={StyleSheet.absoluteFill}>
                    <View style={{ position: 'absolute', top: '20%', right: -30 }}><TeaLeafIcon size={180} opacity={0.04} /></View>
                    <View style={{ position: 'absolute', bottom: -40, left: 20 }}><MatchaCupIcon size={200} opacity={0.03} /></View>
                    <View style={{ position: 'absolute', top: 50, left: '45%' }}><PearlIcon size={60} opacity={0.05} /></View>
                </View>

                <View style={tabletStyles.toolbar}>
                    <View style={tabletStyles.searchGroup}>
                        <View style={tabletStyles.searchBox}>
                            <SearchIcon />
                            <TextInput 
                                style={[styles.searchInput, { fontSize: 15, backgroundColor: 'transparent', borderWidth: 0 }]} 
                                placeholder="Tìm tên thuế, phí..."
                                placeholderTextColor="#9CA3AF" 
                                value={searchQuery} 
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <TouchableOpacity style={tabletStyles.filterBtn} onPress={() => setShowFilter(true)}>
                            <FilterIcon />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openTaxModal()}>
                        <LinearGradient 
                            colors={['#8BA367', '#6B8E4E']} 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={tabletStyles.addBtnGradient}
                        >
                            <View style={tabletStyles.addBtnInner}>
                                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <Path d="M12 5V19M5 12H19" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                                </Svg>
                                <Text style={tabletStyles.addBtnText}>Thêm thuế/phí mới</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredTaxes}
                    keyExtractor={item => item.idThuePhi.toString()}
                    renderItem={renderTabletItem}
                    numColumns={3}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                    ListEmptyComponent={loading ? null : <View style={{ padding: 100, alignItems: 'center' }}><Text style={{ color: '#94A3B8', fontWeight: '600' }}>Chưa có thuế/phí nào</Text></View>}
                />
            </View>
        </View>
    );

    const RadioItem = ({ label, selected, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={onPress}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
            <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
                {selected && <View style={styles.filterInnerCircle} />}
            </View>
        </TouchableOpacity>
    );

    const renderMobileView = () => (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput 
                        style={styles.searchInput} placeholder="Tìm tên thuế, phí..."
                        placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}
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
                {loading && taxes.length === 0 && (
                    <ActivityIndicator color="#8BA367" style={{ marginTop: 20 }} />
                )}
                <View style={styles.taxGrid}>
                    {filteredTaxes.map(tax => (
                        <View key={tax.idThuePhi} style={styles.taxCard}>
                            <View style={[styles.cardAccentTax, { backgroundColor: tax.laMacDinh ? '#8BA367' : '#6366F1' }]} />
                            <View style={styles.taxCardContent}>
                                <View style={styles.taxCardHeader}>
                                    <View style={[styles.taxIconCircle, { backgroundColor: tax.laMacDinh ? '#F0FDF4' : '#EEF2FF' }]}>
                                        <TaxIcon color={tax.laMacDinh ? '#8BA367' : '#6366F1'} />
                                    </View>
                                    <TouchableOpacity 
                                        onPress={(e) => {
                                            const { pageY, pageX } = e.nativeEvent;
                                            setActionMenu({ y: pageY - 20, x: pageX - 150, data: tax });
                                        }}
                                    >
                                        <Text style={styles.threeDots}>•••</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.taxNameText} numberOfLines={1}>{tax.tenThuePhi}</Text>
                                <View style={[styles.taxValueRow, { justifyContent: 'space-between', width: '100%' }]}>
                                    <View>
                                        <Text style={[styles.taxPercentText, { color: tax.laMacDinh ? '#8BA367' : '#6366F1' }]}>
                                            {tax.loaiGiaTri === 'PHAN_TRAM' ? `${tax.giaTri}%` : formatCurrency(tax.giaTri)}
                                        </Text>
                                        {/* Mobile Type Label */}
                                        <Text style={{ fontSize: 9, color: '#94A3B8', fontWeight: '700', marginTop: 2 }}>
                                            {tax.loaiGiaTri === 'PHAN_TRAM' ? 'PHẦN TRĂM' : 'TIỀN MẶT'}
                                        </Text>
                                    </View>
                                    {tax.laMacDinh && (
                                        <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Mặc định</Text></View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.fabBtn} onPress={() => openTaxModal()}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 5V19M5 12H19" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                </Svg>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? renderTabletView() : renderMobileView()}

            <Modal visible={showTaxModal} transparent animationType="slide" statusBarTranslucent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40, width: isTablet ? 500 : '100%', alignSelf: isTablet ? 'center' : 'auto', borderRadius: isTablet ? 32 : 0, marginBottom: isTablet ? 'auto' : 0, marginTop: isTablet ? 'auto' : 0 }]}>
                        {!isTablet && <View style={styles.modalHandle} />}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedTax ? 'Chỉnh sửa' : 'Thêm mới'} Thuế/Phí</Text>
                            <TouchableOpacity onPress={() => setShowTaxModal(false)}><CloseIcon /></TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 4 }}>
                            <Text style={styles.inputLabel}>Tên thuế/phí</Text>
                            <TextInput style={styles.formInput} placeholder="Ví dụ: VAT 8%" value={formTaxName} onChangeText={setFormTaxName} />
                            
                            <Text style={styles.inputLabel}>Loại giá trị</Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                                <TouchableOpacity 
                                    style={[{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }, formTaxType === 'PHAN_TRAM' && { backgroundColor: '#F0FDF4', borderColor: '#8BA367' }]}
                                    onPress={() => setFormTaxType('PHAN_TRAM')}
                                >
                                    <Text style={[{ fontSize: 14, fontWeight: '700', color: '#64748B' }, formTaxType === 'PHAN_TRAM' && { color: '#8BA367' }]}>Phần trăm (%)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }, formTaxType === 'TIEN_MAT' && { backgroundColor: '#F0FDF4', borderColor: '#8BA367' }]}
                                    onPress={() => setFormTaxType('TIEN_MAT')}
                                >
                                    <Text style={[{ fontSize: 14, fontWeight: '700', color: '#64748B' }, formTaxType === 'TIEN_MAT' && { color: '#8BA367' }]}>Tiền mặt (đ)</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.inputLabel}>Giá trị {formTaxType === 'PHAN_TRAM' ? '(%)' : '(đ)'}</Text>
                            <TextInput style={styles.formInput} placeholder={formTaxType === 'PHAN_TRAM' ? "Ví dụ: 8" : "Ví dụ: 15000"} keyboardType="numeric" value={formTaxValue} onChangeText={setFormTaxValue} />
                            
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 10 }} onPress={() => setFormTaxIsDefault(!formTaxIsDefault)}>
                                <View style={[styles.filterOuterCircle, formTaxIsDefault && styles.filterOuterSelected]}>{formTaxIsDefault && <View style={styles.filterInnerCircle} />}</View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569' }}>Thiết lập làm mặc định</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#8BA367', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 10 }} onPress={handleSaveTax}><Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Lưu thông tin</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Filter Modal */}
            <Modal visible={showFilter} transparent animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: isTablet ? 160 : 120, right: isTablet ? 60 : 16, width: 220, borderWidth: 0 }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.filterGroupTitle}>Loại thuế phí</Text>
                            <RadioItem label="Tất cả" selected={filterType === 'ALL'} onPress={() => setFilterType('ALL')} />
                            <RadioItem label="Mặc định" selected={filterType === 'DEFAULT'} onPress={() => setFilterType('DEFAULT')} />
                            <RadioItem label="Tùy chọn" selected={filterType === 'OPTIONAL'} onPress={() => setFilterType('OPTIONAL')} />
                            
                            <TouchableOpacity 
                                style={{ backgroundColor: '#8BA367', margin: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }}
                                onPress={() => setShowFilter(false)}
                            >
                                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Áp dụng</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Action Popup */}
            <Modal visible={!!actionMenu} transparent animationType="none" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setActionMenu(null)}>
                    {actionMenu && (
                        <View style={[styles.taxPopup, { top: actionMenu.y, left: actionMenu.x, right: undefined }]}>
                            <TouchableOpacity style={styles.taxPopupItem} onPress={() => { openTaxModal(actionMenu.data); setActionMenu(null); }}>
                                <EditIcon />
                                <Text style={[styles.taxPopupText, { marginLeft: 10 }]}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.taxPopupItem, { borderBottomWidth: 0 }]} onPress={() => { handleDeleteTax(actionMenu.data.idThuePhi); setActionMenu(null); }}>
                                <TrashIcon />
                                <Text style={[styles.taxPopupText, { color: '#EF4444', marginLeft: 10 }]}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Confirm Modal */}
            <ConfirmModal 
                visible={!!confirmAction} 
                title="Xác nhận xóa" 
                message={confirmAction?.message || ''} 
                onConfirm={() => {
                    if (confirmAction?.onConfirm) confirmAction.onConfirm();
                    setConfirmAction(null);
                }} 
                onCancel={() => setConfirmAction(null)} 
            />
        </View>
    );
};

export default TaxesFeesTab;
