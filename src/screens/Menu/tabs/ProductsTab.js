import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal, useWindowDimensions, Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './ProductsTab.styles';
import { SearchIcon, FilterIcon, MoreIcon, EditIcon, TrashIcon, CloseIcon, PlusIcon } from '../MenuIcons';
import productApi from '../../../api/productApi';
import { RefreshControl, Alert } from 'react-native';

const ProductsTab = ({ onModalStateChange, onNavigate, onOpenForm }) => {
    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterPos, setFilterPos] = useState(0);
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
                        laTopping: p.laTopping,
                        isActive: true // Mock state
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
        const screenHeight = height; // from useWindowDimensions
        // Nếu cách đáy màn hình < 120px thì lật menu lên phía trên
        const MENU_HEIGHT = 110; // chiều cao ước tính của action menu
        const flipped = (screenHeight - py) < MENU_HEIGHT + 20;
        setActionMenuContext({ data: item, y: py - 20, flipped });
    };

    const onFilterPress = (e) => {
        if (isTablet) {
            setFilterPos(e.nativeEvent.pageY + 10);
        }
        setShowFilter(true);
    };

    const RadioItem = ({ label, selected, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={onPress}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
            <View style={[styles.filterOuterCircle, selected && styles.filterOuterSelected]}>
                {selected && <View style={styles.filterInnerCircle} />}
            </View>
        </TouchableOpacity>
    );

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isTablet) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.tableTopBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={[styles.searchInputWrapper, { width: 300, flex: 0 }]}>
                            <SearchIcon />
                            <TextInput 
                                style={styles.searchInput} placeholder="Tìm sản phẩm..."
                                placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}
                            />
                        </View>
                        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                            <FilterIcon />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={{ 
                            backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', 
                            paddingHorizontal: 16, height: 44, borderRadius: 12, gap: 8
                        }}
                        onPress={() => onOpenForm()}
                    >
                        <PlusIcon color="white" width={20} height={20} />
                        <Text style={{ color: 'white', fontWeight: '700' }}>Thêm sản phẩm</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tableContainer}>
                    {/* Fixed Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { width: 60 }]}>Ảnh</Text>
                        <Text style={[styles.headerCell, { flex: 2, marginLeft: 12 }]}>Tên sản phẩm</Text>
                        <Text style={[styles.headerCell, { flex: 1 }]}>Danh mục</Text>
                        <Text style={[styles.headerCell, { width: 120 }]}>Giá bán</Text>
                        <Text style={[styles.headerCell, { width: 100, textAlign: 'center' }]}>Trạng thái</Text>
                        <Text style={[styles.headerCell, { width: 60, textAlign: 'right' }]}>...</Text>
                    </View>

                    <ScrollView 
                        style={{ flex: 1 }} 
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                    >
                        {filteredProducts.map((prod) => (
                            <TouchableOpacity key={prod.id} style={styles.tableRow} activeOpacity={0.7} onPress={() => setSelectedProduct(prod)}>
                                <View style={{ width: 60 }}>
                                    <Image source={{ uri: prod.img }} style={styles.prodIcon} />
                                </View>
                                <View style={{ flex: 2, marginLeft: 12 }}>
                                    <Text style={[styles.rowCell, { fontWeight: '700' }]}>{prod.name}</Text>
                                    <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{prod.desc.substring(0, 40)}...</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.prodCatTag}><Text style={styles.prodCatText}>{prod.category}</Text></View>
                                </View>
                                <View style={{ width: 120 }}>
                                    <Text style={[styles.rowCell, { color: '#8BA367', fontWeight: '800' }]}>{prod.price}</Text>
                                </View>
                                <View style={{ width: 100, alignItems: 'center' }}>
                                    <View style={[styles.statusToggle, !prod.isActive && styles.statusToggleOff]}>
                                        <View style={[styles.toggleCircle, prod.isActive && styles.toggleCircleActive]} />
                                    </View>
                                </View>
                                <View style={{ width: 60, alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={(e) => onMorePress(e, prod)}>
                                        <MoreIcon color="#8BA367" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


                <Modal visible={showFilter} transparent animationType="fade">
                    <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
                        <View style={[styles.filterPopupBox, isTablet && { top: filterPos, right: width - 380 }]}>
                            <Text style={styles.filterGroupTitle}>Sắp xếp Sản Phẩm</Text>
                            <RadioItem label="Mới nhất" selected={prodFilter === 'newest'} onPress={() => setProdFilter('newest')} />
                            <RadioItem label="Theo Danh mục" selected={prodFilter === 'cat'} onPress={() => setProdFilter('cat')} />
                            <RadioItem label="Giá Tăng dần" selected={prodFilter === 'price_asc'} onPress={() => setProdFilter('price_asc')} />
                            <RadioItem label="Giá Giảm dần" selected={prodFilter === 'price_desc'} onPress={() => setProdFilter('price_desc')} />
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={!!actionMenuContext} transparent animationType="fade">
                    <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                        {actionMenuContext && (() => {
                            const posStyle = actionMenuContext.flipped
                                ? { bottom: height - actionMenuContext.y, right: isTablet ? 80 : 40 }
                                : { top: actionMenuContext.y, right: isTablet ? 80 : 40 };
                            return (
                                <View style={[styles.anchorPopoverBox, posStyle]}>
                                    <TouchableOpacity style={styles.anchorActionBtn} onPress={() => openEditForm(actionMenuContext.data)}>
                                        <EditIcon color="#1E2939"/>
                                        <Text style={styles.anchorActionText}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.anchorActionBtn, styles.anchorActionBtnNoBorder]} onPress={() => handleDelete(actionMenuContext.data.id)}>
                                        <TrashIcon color="#EF4444" />
                                        <Text style={[styles.anchorActionText, styles.anchorActionTextDanger]}>Xoá sản phẩm</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })()}
                    </TouchableOpacity>
                </Modal>

                {/* Detail Modal */}
                <Modal visible={!!selectedProduct} transparent animationType="fade">
                    <View style={styles.detailModalOverlay}>
                        <TouchableOpacity 
                            style={StyleSheet.absoluteFill} 
                            activeOpacity={1} 
                            onPress={() => setSelectedProduct(null)} 
                        />
                        <View style={[styles.detailModalBox, isTablet && styles.detailModalTablet]}>
                            {selectedProduct && (
                                <View style={{ flex: 1 }}>
                                    {/* Hero Image Section */}
                                    <View style={styles.modalHero}>
                                        <Image source={{ uri: selectedProduct.img }} style={styles.modalImage} resizeMode="cover" />
                                        <View 
                                            style={[styles.modalImageGradient, { backgroundColor: 'rgba(0,0,0,0.2)' }]}
                                        />
                                        <TouchableOpacity style={styles.closeModalFloatBtn} onPress={() => setSelectedProduct(null)}>
                                            <CloseIcon color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Scrollable Content Area */}
                                    <ScrollView style={styles.modalScrollArea} showsVerticalScrollIndicator={false}>
                                        <View style={styles.modalContent}>
                                            <View style={styles.modalHeaderRow}>
                                                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                                                <View style={styles.modalPriceRow}>
                                                    <Text style={styles.modalPriceLabel}>Giá bán niêm yết</Text>
                                                    <Text style={styles.modalPriceVal}>{selectedProduct.price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                                                    <View style={styles.prodCatTag}><Text style={styles.prodCatText}>{selectedProduct.category}</Text></View>
                                                    {selectedProduct.laTopping && (
                                                        <View style={styles.toppingBadge}><Text style={styles.toppingText}>Topping</Text></View>
                                                    )}
                                                </View>
                                            </View>

                                            <Text style={styles.modalSecTitle}>Các kích cỡ & Giá bán</Text>
                                            <View style={styles.variantTable}>
                                                {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                                                    selectedProduct.variants.map((v, i) => (
                                                        <View 
                                                            key={v.idBienThe || i} 
                                                            style={[styles.variantItem, i === selectedProduct.variants.length - 1 && styles.variantItemLast]}
                                                        >
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
                                                    <View style={styles.variantItem}><Text style={styles.modalDescTextEmpty}>Mặc định</Text></View>
                                                )}
                                            </View>

                                            <Text style={styles.modalSecTitle}>Mô tả sản phẩm</Text>
                                            {selectedProduct.desc && selectedProduct.desc !== 'Chưa có mô tả' ? (
                                                <Text style={styles.modalDescText}>{selectedProduct.desc}</Text>
                                            ) : (
                                                <Text style={styles.modalDescTextEmpty}>Sản phẩm này hiện chưa có mô tả chi tiết.</Text>
                                            )}
                                            
                                            {/* Extra space for scrolling if needed */}
                                            <View style={{ height: 20 }} />
                                        </View>
                                    </ScrollView>

                                    {/* Fixed Footer Actions */}
                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity 
                                            style={[styles.btnModalAction, styles.btnModalDelete]} 
                                            onPress={() => handleDelete(selectedProduct.id)}
                                        >
                                            <TrashIcon color="#EF4444" size={22} />
                                            <Text style={styles.btnModalDeleteText}>Xoá món</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.btnModalAction, styles.btnModalEdit]} 
                                            onPress={() => openEditForm(selectedProduct)}
                                        >
                                            <EditIcon color="white" size={22} />
                                            <Text style={styles.btnModalEditText}>Chỉnh sửa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

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
                <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                    <FilterIcon />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.listContainer} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
            >
                <View style={{ paddingTop: 8 }}>
                    {filteredProducts.map((prod) => (
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
