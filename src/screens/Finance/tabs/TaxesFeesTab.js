import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, useWindowDimensions, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './TaxesFeesTab.styles';
import { 
    SearchIcon, FilterIcon, TaxIcon, CloseIcon,
    TeaLeafIcon, MatchaCupIcon, PearlIcon, TeapotIcon 
} from '../FinanceIcons';
import taxApi from '../../../api/taxApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TaxesFeesTab = ({ onModalStateChange }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const [searchQuery, setSearchQuery] = useState('');
    const [activePopId, setActivePopId] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState('ALL'); // ALL | DEFAULT | OPTIONAL

    useEffect(() => {
        onModalStateChange(showTaxModal || showFilter);
    }, [showTaxModal, showFilter]);

    // Form states
    const [formTaxName, setFormTaxName] = useState('');
    const [formTaxValue, setFormTaxValue] = useState('');
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

    const openTaxModal = (tax = null) => {
        setSelectedTax(tax);
        setFormTaxName(tax ? tax.tenThuePhi : '');
        setFormTaxValue(tax ? (tax.giaTri * 100).toString() : '');
        setFormTaxIsDefault(tax ? tax.laMacDinh : false);
        setShowTaxModal(true);
    };

    const handleSaveTax = async () => {
        const payload = {
            tenThuePhi: formTaxName,
            giaTri: parseFloat(formTaxValue) / 100,
            laMacDinh: formTaxIsDefault
        };

        try {
            setLoading(true);
            if (selectedTax) {
                await taxApi.update(selectedTax.idThuePhi, payload);
                Alert.alert('Thành công', 'Đã cập nhật thuế/phí');
            } else {
                await taxApi.create(payload);
                Alert.alert('Thành công', 'Đã thêm thuế/phí mới');
            }
            setShowTaxModal(false);
            fetchTaxes();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTax = (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa thuế/phí này?', [
            { text: 'Hủy' },
            { 
                text: 'Xóa', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await taxApi.delete(id);
                        setActivePopId(null);
                        fetchTaxes();
                    } catch (error) {
                        Alert.alert('Lỗi', 'Không thể xóa thuế/phí');
                    }
                }
            }
        ]);
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
            height: 52,
            borderRadius: 16,
            paddingHorizontal: 16,
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
            borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.1)'
        },
        filterBtn: {
            width: 52,
            height: 52,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
            borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.1)'
        },
        addBtnGradient: { borderRadius: 24, overflow: 'hidden', shadowColor: '#8BA367', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
        addBtnInner: { paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
        addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
        
        card: {
            flex: 1,
            maxWidth: '48%',
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            margin: 10,
            padding: 24,
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 4,
            overflow: 'hidden'
        },
        cardDefault: {
            backgroundColor: '#F7FAF5',
            borderWidth: 1.5,
            borderColor: 'rgba(139, 163, 103, 0.2)',
            shadowColor: '#8BA367', shadowOpacity: 0.08
        },
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
        iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(139, 163, 103, 0.08)', justifyContent: 'center', alignItems: 'center' },
        taxName: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
        taxValue: { fontSize: 36, fontWeight: '900', color: '#8BA367', letterSpacing: -1 },
        badge: { 
            backgroundColor: '#8BA367', 
            paddingHorizontal: 12, 
            paddingVertical: 5, 
            borderRadius: 10,
        },
        badgeText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
        optionalBadge: {
            backgroundColor: 'rgba(71, 85, 105, 0.08)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8
        },
        optionalBadgeText: { fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }
    });

    const renderTabletItem = ({ item }) => (
        <View style={[tabletStyles.card, item.laMacDinh && tabletStyles.cardDefault]}>
            {/* Corner Decoration for Default */}
            {item.laMacDinh && (
                <View style={{ position: 'absolute', top: -10, right: -10 }}>
                    <TeaLeafIcon size={60} opacity={0.06} />
                </View>
            )}

            <View style={tabletStyles.cardHeader}>
                <View style={[tabletStyles.iconContainer, !item.laMacDinh && { backgroundColor: 'rgba(99, 102, 241, 0.08)' }]}>
                    <TaxIcon color={item.laMacDinh ? '#8BA367' : '#6366F1'} />
                </View>
                <TouchableOpacity onPress={() => setActivePopId(activePopId === item.idThuePhi ? null : item.idThuePhi)}>
                    <Text style={{ fontSize: 24, color: '#94A3B8', fontWeight: '900', padding: 6 }}>•••</Text>
                </TouchableOpacity>
                {activePopId === item.idThuePhi && (
                    <View style={[styles.taxPopup, { top: 45, right: 0, borderWidth: 0, shadowOpacity: 0.15, borderRadius: 16 }]}>
                        <TouchableOpacity style={styles.taxPopupItem} onPress={() => { openTaxModal(item); setActivePopId(null); }}><Text style={styles.taxPopupText}>Chỉnh sửa</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.taxPopupItem, { borderBottomWidth: 0 }]} onPress={() => handleDeleteTax(item.idThuePhi)}><Text style={[styles.taxPopupText, { color: '#EF4444' }]}>Xóa</Text></TouchableOpacity>
                    </View>
                )}
            </View>
            
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={tabletStyles.taxName}>{item.tenThuePhi}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
                    <Text style={[tabletStyles.taxValue, !item.laMacDinh && { color: '#6366F1' }]}>{(item.giaTri * 100).toFixed(0)}%</Text>
                    {item.laMacDinh ? (
                        <View style={tabletStyles.badge}><Text style={tabletStyles.badgeText}>MẶC ĐỊNH</Text></View>
                    ) : (
                        <View style={tabletStyles.optionalBadge}><Text style={tabletStyles.optionalBadgeText}>Tùy chọn</Text></View>
                    )}
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
                                style={[styles.searchInput, { fontSize: 16, backgroundColor: 'transparent', borderWidth: 0 }]} 
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
                                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                    numColumns={2}
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
                                    <TouchableOpacity onPress={() => setActivePopId(activePopId === tax.idThuePhi ? null : tax.idThuePhi)}>
                                        <Text style={styles.threeDots}>•••</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.taxNameText} numberOfLines={1}>{tax.tenThuePhi}</Text>
                                <View style={[styles.taxValueRow, { justifyContent: 'space-between', width: '100%' }]}>
                                    <Text style={[styles.taxPercentText, { color: tax.laMacDinh ? '#8BA367' : '#6366F1' }]}>{(tax.giaTri * 100).toFixed(0)}%</Text>
                                    {tax.laMacDinh && (
                                        <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Mặc định</Text></View>
                                    )}
                                </View>
                                {activePopId === tax.idThuePhi && (
                                    <View style={styles.taxPopup}>
                                        <TouchableOpacity style={styles.taxPopupItem} onPress={() => { openTaxModal(tax); setActivePopId(null); }}><Text style={styles.taxPopupText}>Chỉnh sửa</Text></TouchableOpacity>
                                        <TouchableOpacity style={[styles.taxPopupItem, { borderBottomWidth: 0 }]} onPress={() => handleDeleteTax(tax.idThuePhi)}><Text style={[styles.taxPopupText, { color: '#EF4444' }]}>Xóa</Text></TouchableOpacity>
                                    </View>
                                )}
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

            <Modal visible={showTaxModal} transparent animationType="slide">
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
                            <Text style={styles.inputLabel}>Giá trị (%)</Text>
                            <TextInput style={styles.formInput} placeholder="Ví dụ: 8" keyboardType="numeric" value={formTaxValue} onChangeText={setFormTaxValue} />
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
            <Modal visible={showFilter} transparent animationType="fade">
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
        </View>
    );
};

export default TaxesFeesTab;
