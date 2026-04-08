import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal } from 'react-native';
import styles from './CategoriesTab.styles';
import { SearchIcon, FilterIcon, MoreIcon, EditIcon, TrashIcon, CloseIcon } from '../MenuIcons';
import categoryApi from '../../../api/categoryApi';
import productApi from '../../../api/productApi';
import { RefreshControl, Alert, ActivityIndicator, Pressable, StyleSheet } from 'react-native';



const CategoriesTab = ({ onModalStateChange, onNavigate, onOpenForm }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [catFilter, setCatFilter] = useState('az'); 
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [actionMenuContext, setActionMenuContext] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [fetchingProds, setFetchingProds] = useState(false);

    const fetchCategoryProducts = async (catId) => {
        try {
            setFetchingProds(true);
            const data = await productApi.getByCategory(catId);
            setCategoryProducts(data || []);
        } catch (error) {
            console.error('Fetch cat prods error:', error);
        } finally {
            setFetchingProds(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const [catData, prodData] = await Promise.all([
                categoryApi.getAll(),
                productApi.getAll()
            ]);

            if (catData) {
                const mapped = catData.map(c => {
                    const productCount = prodData ? prodData.filter(p => p.idDanhMuc === c.idDanhMuc).length : 0;
                    return {
                        id: c.idDanhMuc,
                        name: c.tenDanhMuc,
                        img: c.duongDanAnh || 'https://images.unsplash.com/photo-1558857563-b37102e956bc?q=80&w=200',
                        isSystem: c.laHeThong,
                        count: productCount
                    };
                });
                setCategories(mapped);
            }
        } catch (error) {
            console.error('Fetch categories error:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategories();
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm bên trong sẽ chuyển sang danh mục "Khác".',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await categoryApi.delete(id);
                            fetchCategories();
                            setActionMenuContext(null);
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa danh mục này');
                        }
                    }
                }
            ]
        );
    };

    React.useEffect(() => {
        onModalStateChange(!!selectedCategory || !!actionMenuContext || showFilter);
    }, [selectedCategory, actionMenuContext, showFilter]);

    const openEditForm = (item) => {
        onOpenForm(item);
        setSelectedCategory(null);
        setActionMenuContext(null);
    };

    const onMorePress = (e, item) => {
        const py = e.nativeEvent.pageY;
        setActionMenuContext({ data: item, y: py - 20 });
    };

    const RadioItem = ({ label, selected, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={onPress}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
            <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
                {selected && <View style={styles.filterInnerCircle} />}
            </View>
        </TouchableOpacity>
    );

    React.useEffect(() => {
        if (selectedCategory) {
            fetchCategoryProducts(selectedCategory.id);
        } else {
            setCategoryProducts([]);
        }
    }, [selectedCategory]);

    const relatedProductsInner = categoryProducts.map(p => {
        const firstVariant = p.danhSachBienThe && p.danhSachBienThe.length > 0 ? p.danhSachBienThe[0] : null;
        return {
            id: p.idSanPham,
            name: p.tenSanPham,
            price: firstVariant ? `${firstVariant.giaBan.toLocaleString()}₫` : 'N/A',
            img: p.duongDanAnh || 'https://images.unsplash.com/photo-1558857563-b37102e956bc?q=80&w=200'
        };
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput 
                        style={styles.searchInput} placeholder="Tìm danh mục..."
                        placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.listContainer} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                <View style={{ paddingTop: 8 }}>
                    {categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.catCard} activeOpacity={0.8} onPress={() => setSelectedCategory(cat)}>
                            <View style={styles.catInfo}>
                                <View style={styles.catImageWrap}><Image source={{ uri: cat.img }} style={styles.catImage}/></View>
                                <View>
                                    <Text style={styles.catName}>{cat.name}</Text>
                                    <Text style={styles.catCount}>{cat.count} sản phẩm {cat.isSystem && ' • Hệ thống'}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.moreButton} onPress={(e) => onMorePress(e, cat)}>
                                <MoreIcon />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={styles.filterPopupBox}>
                        <Text style={styles.filterGroupTitle}>Sắp xếp Danh Mục</Text>
                        <RadioItem label="Tên (A → Z)" selected={catFilter === 'az'} onPress={() => setCatFilter('az')} />
                        <RadioItem label="Nhiều sản phẩm" selected={catFilter === 'count_desc'} onPress={() => setCatFilter('count_desc')} />
                        <View style={styles.filterDivider}/>
                        <RadioItem label="Danh mục thường" selected={catFilter === 'type_normal'} onPress={() => setCatFilter('type_normal')} />
                        <RadioItem label="Danh mục hệ thống" selected={catFilter === 'type_system'} onPress={() => setCatFilter('type_system')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Action Popup */}
            <Modal visible={!!actionMenuContext} transparent animationType="fade">
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                    {actionMenuContext && (
                        <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y }]}>
                            <TouchableOpacity style={styles.anchorActionBtn} onPress={() => openEditForm(actionMenuContext.data)}>
                                <EditIcon color="#1E2939"/>
                                <Text style={styles.anchorActionText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.anchorActionBtn, styles.anchorActionBtnNoBorder, { opacity: actionMenuContext.data.isSystem ? 0.4 : 1 }]} 
                                disabled={actionMenuContext.data.isSystem}
                                onPress={() => handleDelete(actionMenuContext.data.id)}
                            >
                                <TrashIcon color="#EF4444" />
                                <Text style={[styles.anchorActionText, styles.anchorActionTextDanger]}>Xoá danh mục</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Category Detail Modal */}
        <Modal visible={!!selectedCategory} transparent animationType="fade">
            <View style={styles.detailModalOverlay}>
                <Pressable 
                    style={StyleSheet.absoluteFill} 
                    onPress={() => setSelectedCategory(null)} 
                />
                <View style={styles.detailModalBox}>
                    {selectedCategory && (
                        <View style={{ flex: 1 }}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false} 
                                contentContainerStyle={{ paddingBottom: 20 }}
                                nestedScrollEnabled={true}
                            >
                                <View>
                                    <Image source={{ uri: selectedCategory.img }} style={styles.modalImage} />
                                    <TouchableOpacity 
                                        style={styles.closeModalFloatBtn} 
                                        onPress={() => setSelectedCategory(null)}
                                    >
                                        <CloseIcon />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalTitleRow}><Text style={styles.modalTitle}>{selectedCategory.name}</Text></View>
                                    {selectedCategory.isSystem && <View style={styles.systemBadge}><Text style={styles.systemText}>Chỉ đọc / Hệ thống</Text></View>}
                                    <Text style={styles.catCountText}>Tổng số lượng: {selectedCategory.count} sản phẩm</Text>
                                    
                                    {selectedCategory.isSystem && (
                                        <View style={styles.warningBox}>
                                            <Text style={styles.warningText}>Đây là thư mục hệ thống. Dòng tiền và các sản phẩm không phân loại sẽ được tự động gom vào đây.</Text>
                                        </View>
                                    )}

                                    <View style={styles.catModalListContainer}>
                                        <Text style={styles.catModalListTitle}>Sản phẩm thuộc danh mục</Text>
                                        {fetchingProds ? (
                                            <ActivityIndicator size="small" color="#8BA367" style={{ marginVertical: 20 }} />
                                        ) : relatedProductsInner.length > 0 ? (
                                            relatedProductsInner.map(rp => (
                                                <View key={rp.id} style={styles.catModalProdItem}>
                                                    <Image source={{ uri: rp.img }} style={styles.catModalProdImg} />
                                                    <View style={styles.catModalProdInfo}>
                                                        <Text style={styles.catModalProdName}>{rp.name}</Text>
                                                        <Text style={styles.catModalProdPrice}>{rp.price}</Text>
                                                    </View>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{color: '#9CA3AF'}}>Chưa có sản phẩm nào.</Text>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Fixed Footer Actions */}
                            <View style={{ padding: 20, paddingTop: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                                <View style={styles.modalActionRow}>
                                    <TouchableOpacity 
                                        style={[styles.modalActionBtnSquare, selectedCategory.isSystem && { opacity: 0.5, backgroundColor: '#F8FAFC' }]} 
                                        onPress={() => !selectedCategory.isSystem && openEditForm(selectedCategory)}
                                        disabled={selectedCategory.isSystem}
                                    >
                                        <EditIcon color={selectedCategory.isSystem ? "#CBD5E1" : "#3B82F6"} size={22} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.modalActionBtnSquare, styles.modalActionDangerSquare, selectedCategory.isSystem && { opacity: 0.3 }]} 
                                        onPress={() => !selectedCategory.isSystem && handleDelete(selectedCategory.id)}
                                        disabled={selectedCategory.isSystem}
                                    >
                                        <TrashIcon size={22} color={selectedCategory.isSystem ? "#CBD5E1" : "#EF4444"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>

        </View>
    );
};

export default CategoriesTab;
