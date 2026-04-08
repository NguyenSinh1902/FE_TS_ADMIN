import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal } from 'react-native';
import styles from './ProductsTab.styles';
import { SearchIcon, FilterIcon, MoreIcon, EditIcon, TrashIcon, CloseIcon } from '../MenuIcons';
import productApi from '../../../api/productApi';
import { RefreshControl, Alert } from 'react-native';



const ProductsTab = ({ onModalStateChange, onNavigate, onOpenForm }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [prodFilter, setProdFilter] = useState('newest'); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionMenuContext, setActionMenuContext] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productApi.getAll();
            if (data) {
                const mapped = data.map(p => {
                    const firstVariant = p.danhSachBienThe && p.danhSachBienThe.length > 0 ? p.danhSachBienThe[0] : null;
                    const priceStr = firstVariant ? `${firstVariant.giaBan.toLocaleString()}₫` : 'N/A';
                    return {
                        id: p.idSanPham,
                        name: p.tenSanPham,
                        category: p.tenDanhMuc,
                        desc: p.moTa || 'Chưa có mô tả',
                        price: priceStr,
                        img: p.duongDanAnh || 'https://images.unsplash.com/photo-1558857563-b37102e956bc?q=80&w=200',
                        variants: p.danhSachBienThe,
                        idDanhMuc: p.idDanhMuc,
                        laTopping: p.laTopping
                    };
                });
                setProducts(mapped);
            }
        } catch (error) {
            console.error('Fetch products error:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa sản phẩm này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await productApi.delete(id);
                            fetchProducts();
                            setActionMenuContext(null);
                            setSelectedProduct(null);
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa sản phẩm này');
                        }
                    }
                }
            ]
        );
    };

    React.useEffect(() => {
        onModalStateChange(!!selectedProduct || !!actionMenuContext || showFilter);
    }, [selectedProduct, actionMenuContext, showFilter]);

    const openEditForm = (item) => {
        onOpenForm(item);
        setSelectedProduct(null);
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

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                    <SearchIcon />
                    <TextInput 
                        style={styles.searchInput} placeholder="Tìm sản phẩm..."
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
                    {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((prod) => (
                        <TouchableOpacity key={prod.id} style={styles.prodCard} activeOpacity={0.8} onPress={() => setSelectedProduct(prod)}>
                            <Image source={{ uri: prod.img }} style={styles.prodImage} />
                            <View style={styles.prodInfo}>
                                <Text style={styles.prodName}>{prod.name}</Text>
                                <View style={styles.prodCatTag}><Text style={styles.prodCatText}>{prod.category}</Text></View>
                                <Text style={styles.prodPrice}>{prod.price}</Text>
                            </View>
                            <View style={styles.prodActions}>
                                <TouchableOpacity style={styles.moreButton} onPress={(e) => onMorePress(e, prod)}>
                                    <MoreIcon />
                                </TouchableOpacity>
                                <View style={{ width: 34, height: 20, borderRadius: 10, backgroundColor: '#10B981', justifyContent: 'center', paddingHorizontal: 2 }}>
                                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', alignSelf: 'flex-end' }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <Modal visible={showFilter} transparent animationType="fade">
                <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={styles.filterPopupBox}>
                        <Text style={styles.filterGroupTitle}>Sắp xếp Sản Phẩm</Text>
                        <RadioItem label="Mới nhất" selected={prodFilter === 'newest'} onPress={() => setProdFilter('newest')} />
                        <RadioItem label="Theo Danh mục" selected={prodFilter === 'cat'} onPress={() => setProdFilter('cat')} />
                        <RadioItem label="Giá Tăng dần" selected={prodFilter === 'price_asc'} onPress={() => setProdFilter('price_asc')} />
                        <RadioItem label="Giá Giảm dần" selected={prodFilter === 'price_desc'} onPress={() => setProdFilter('price_desc')} />
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
                            <TouchableOpacity style={[styles.anchorActionBtn, styles.anchorActionBtnNoBorder]} onPress={() => handleDelete(actionMenuContext.data.id)}>
                                <TrashIcon color="#EF4444" />
                                <Text style={[styles.anchorActionText, styles.anchorActionTextDanger]}>Xoá sản phẩm</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={!!selectedProduct} transparent animationType="fade">
                <TouchableOpacity style={styles.detailModalOverlay} activeOpacity={1} onPress={() => setSelectedProduct(null)}>
                    <TouchableOpacity activeOpacity={1} style={styles.detailModalBox}>
                        {selectedProduct && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>
                                    <Image source={{ uri: selectedProduct.img }} style={styles.modalImage} />
                                    <TouchableOpacity style={styles.closeModalFloatBtn} onPress={() => setSelectedProduct(null)}><CloseIcon /></TouchableOpacity>
                                </View>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalTitleRow}>
                                        <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                                        <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
                                    </View>
                                    
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <View style={styles.prodCatTag}><Text style={styles.prodCatText}>{selectedProduct.category}</Text></View>
                                        {selectedProduct.laTopping && (
                                            <View style={styles.toppingBadge}><Text style={styles.toppingText}>Topping</Text></View>
                                        )}
                                    </View>

                                    <Text style={styles.variantSectionTitle}>Các kích cỡ & Giá bán</Text>
                                    <View style={styles.variantList}>
                                        {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                                            selectedProduct.variants.map((v, i) => (
                                                <View key={v.idBienThe || i} style={styles.variantItem}>
                                                    <Text style={styles.variantName}>{v.tenKichCo}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        {v.phanTramGiamGia > 0 && (
                                                            <View style={styles.discountBadge}>
                                                                <Text style={styles.discountText}>-{v.phanTramGiamGia}%</Text>
                                                            </View>
                                                        )}
                                                        <Text style={styles.variantVal}>{v.giaBan.toLocaleString()}₫</Text>
                                                    </View>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{color: '#9CA3AF'}}>Mặc định</Text>
                                        )}
                                    </View>

                                    <Text style={styles.modalDescTitle}>Mô tả</Text>
                                    <Text style={styles.modalDescText}>{selectedProduct.desc}</Text>
                                    <View style={styles.modalActionRow}>
                                        <TouchableOpacity style={styles.modalActionBtnSquare} onPress={() => openEditForm(selectedProduct)}><EditIcon color="#3B82F6" size={24} /></TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.modalActionBtnSquare, styles.modalActionDangerSquare]}
                                            onPress={() => handleDelete(selectedProduct.id)}
                                        >
                                            <TrashIcon size={24} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        </View>
    );
};

export default ProductsTab;
