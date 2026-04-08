import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './TaxesFeesTab.styles';
import { SearchIcon, FilterIcon, TaxIcon, CloseIcon } from '../FinanceIcons';
import taxApi from '../../../api/taxApi';
import { RefreshControl, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TaxesFeesTab = ({ onModalStateChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePopId, setActivePopId] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState('ALL'); // ALL | DEFAULT | OPTIONAL

    React.useEffect(() => {
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

    React.useEffect(() => {
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

            <Modal visible={showTaxModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40 }]}>
                        <View style={styles.modalHandle} />
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
                    <View style={[styles.filterPopupBox, { top: 120, right: 16, width: 220 }]}>
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
