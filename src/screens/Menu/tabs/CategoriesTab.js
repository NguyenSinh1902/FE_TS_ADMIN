import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal, useWindowDimensions, Platform, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import styles from './CategoriesTab.styles';
import { SearchIcon, FilterIcon, MoreIcon, EditIcon, TrashIcon, CloseIcon, PlusIcon } from '../MenuIcons';
import categoryApi from '../../../api/categoryApi';
import productApi from '../../../api/productApi';
import { useNotifications } from '../../../context/NotificationContext';
import ConfirmModal from '../../../components/ConfirmModal';

const CategoriesTab = ({ onModalStateChange, onNavigate, onOpenForm }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const { showToast } = useNotifications();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterPos, setFilterPos] = useState({ top: 0, left: 0 });
    const [catFilter, setCatFilter] = useState('az');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [actionMenuContext, setActionMenuContext] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [fetchingProds, setFetchingProds] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

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
                        moTa: c.moTa,
                        img: c.duongDanAnh || 'https://images.unsplash.com/photo-1558857563-b37102e956bc?q=80&w=200',
                        isSystem: c.laHeThong,
                        count: productCount
                    };
                });
                setCategories(mapped);
            }
        } catch (error) {
            console.error('Fetch categories error:', error);
            showToast('Lỗi', 'Không thể tải danh sách danh mục', 'error');
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
        setActionMenuContext(null);
        // Tăng timeout lên 400ms để đảm bảo các modal cha đã đóng hoàn toàn trước khi mở ConfirmModal trên Android
        setTimeout(() => {
            setConfirmAction({
                message: 'Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm bên trong sẽ chuyển sang danh mục "Khác".',
                onConfirm: async () => {
                    try {
                        await categoryApi.delete(id);
                        fetchCategories();
                        showToast('Thành công', 'Đã xóa danh mục', 'success');
                    } catch (error) {
                        showToast('Lỗi', 'Không thể xóa danh mục này', 'error');
                    }
                }
            });
        }, 400);
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

    const onFilterPress = (e) => {
        if (isTablet) {
            setFilterPos({
                top: e.nativeEvent.pageY + 10,
                left: e.nativeEvent.pageX - 100
            });
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

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
        if (catFilter === 'az') return a.name.localeCompare(b.name);
        if (catFilter === 'count_desc') return b.count - a.count;
        if (catFilter === 'type_normal') return (a.isSystem === b.isSystem) ? 0 : a.isSystem ? 1 : -1;
        if (catFilter === 'type_system') return (a.isSystem === b.isSystem) ? 0 : a.isSystem ? -1 : 1;
        return 0;
    });

    if (isTablet) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.tableTopBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={[styles.searchInputWrapper, { width: 300, flex: 0 }]}>
                            <SearchIcon />
                            <TextInput
                                style={styles.searchInput} placeholder="Tìm danh mục..."
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
                        <Text style={{ color: 'white', fontWeight: '700' }}>Thêm danh mục</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tableContainer}>
                    {/* Fixed Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { width: 60 }]}>Ảnh</Text>
                        <Text style={[styles.headerCell, { flex: 2, marginLeft: 12 }]}>Tên danh mục</Text>
                        <Text style={[styles.headerCell, { flex: 1 }]}>Sản phẩm</Text>
                        <Text style={[styles.headerCell, { width: 120 }]}>Loại</Text>
                        <Text style={[styles.headerCell, { width: 60, textAlign: 'right' }]}>...</Text>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />}
                    >
                        {filteredCategories.map((cat) => (
                            <TouchableOpacity key={cat.id} style={styles.tableRow} activeOpacity={0.7} onPress={() => setSelectedCategory(cat)}>
                                <View style={{ width: 60 }}>
                                    <Image source={{ uri: cat.img }} style={styles.catIcon} />
                                </View>
                                <View style={{ flex: 2, marginLeft: 12 }}>
                                    <Text style={[styles.rowCell, { fontWeight: '700' }]}>{cat.name}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.rowCell}>{cat.count} sản phẩm</Text>
                                </View>
                                <View style={{ width: 120 }}>
                                    {cat.isSystem ? (
                                        <View style={styles.systemTag}><Text style={styles.systemTagText}>Hệ thống</Text></View>
                                    ) : (
                                        <View style={styles.normalTag}><Text style={styles.normalTagText}>Thường</Text></View>
                                    )}
                                </View>
                                <View style={{ width: 60, alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={(e) => onMorePress(e, cat)}>
                                        <MoreIcon color="#8BA367" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


                <Modal visible={showFilter} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
                    <TouchableOpacity style={[styles.filterOverlay, { width: 3000, height: 3000, top: -1000, left: -1000 }]} activeOpacity={1} onPress={() => setShowFilter(false)}>
                        <View style={[styles.filterPopupBox, isTablet && { top: filterPos.top + 1000, left: filterPos.left + 1000, right: 'auto' }]}>
                            <Text style={styles.filterGroupTitle}>Sắp xếp Danh Mục</Text>
                            <RadioItem label="Tên (A → Z)" selected={catFilter === 'az'} onPress={() => setCatFilter('az')} />
                            <RadioItem label="Nhiều sản phẩm" selected={catFilter === 'count_desc'} onPress={() => setCatFilter('count_desc')} />
                            <View style={styles.filterDivider} />
                            <RadioItem label="Danh mục thường" selected={catFilter === 'type_normal'} onPress={() => setCatFilter('type_normal')} />
                            <RadioItem label="Danh mục hệ thống" selected={catFilter === 'type_system'} onPress={() => setCatFilter('type_system')} />
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={!!actionMenuContext} transparent animationType="none" statusBarTranslucent={true}>
                    <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                        {actionMenuContext && (
                            <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y, right: isTablet ? 80 : 40 }]}>
                                <TouchableOpacity style={styles.anchorActionBtn} onPress={() => openEditForm(actionMenuContext.data)}>
                                    <EditIcon color="#1E2939" />
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
                <Modal visible={!!selectedCategory} transparent animationType="fade" statusBarTranslucent={true}>
                    <View style={styles.detailModalOverlay}>
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={() => setSelectedCategory(null)}
                        />
                        <View style={[styles.detailModalBox, isTablet && { width: 500, alignSelf: 'center' }]}>
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
                                            <Text style={styles.modalDescription}>
                                                {selectedCategory.moTa || 'Chưa có mô tả cho danh mục này...'}
                                            </Text>

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
                                                    <Text style={{ color: '#9CA3AF' }}>Chưa có sản phẩm nào.</Text>
                                                )}
                                            </View>
                                        </View>
                                    </ScrollView>

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
    }

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
                    {filteredCategories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.catCard} activeOpacity={0.8} onPress={() => setSelectedCategory(cat)}>
                            <View style={styles.catInfo}>
                                <View style={styles.catImageWrap}><Image source={{ uri: cat.img }} style={styles.catImage} /></View>
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
            <Modal visible={showFilter} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
                <TouchableOpacity style={[styles.filterOverlay, { width: 3000, height: 3000, top: -1000, left: -1000 }]} activeOpacity={1} onPress={() => setShowFilter(false)}>
                    <View style={[styles.filterPopupBox, { top: 1000, left: 1000 }]}>
                        <Text style={styles.filterGroupTitle}>Sắp xếp Danh Mục</Text>
                        <RadioItem label="Tên (A → Z)" selected={catFilter === 'az'} onPress={() => setCatFilter('az')} />
                        <RadioItem label="Nhiều sản phẩm" selected={catFilter === 'count_desc'} onPress={() => setCatFilter('count_desc')} />
                        <View style={styles.filterDivider} />
                        <RadioItem label="Danh mục thường" selected={catFilter === 'type_normal'} onPress={() => setCatFilter('type_normal')} />
                        <RadioItem label="Danh mục hệ thống" selected={catFilter === 'type_system'} onPress={() => setCatFilter('type_system')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Action Popup */}
            <Modal visible={!!actionMenuContext} transparent animationType="none" statusBarTranslucent={true}>
                <TouchableOpacity style={styles.anchorOverlay} activeOpacity={1} onPress={() => setActionMenuContext(null)}>
                    {actionMenuContext && (
                        <View style={[styles.anchorPopoverBox, { top: actionMenuContext.y }]}>
                            <TouchableOpacity style={styles.anchorActionBtn} onPress={() => openEditForm(actionMenuContext.data)}>
                                <EditIcon color="#1E2939" />
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
            <Modal visible={!!selectedCategory} transparent animationType="fade" statusBarTranslucent={true}>
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
                                                <Text style={{ color: '#9CA3AF' }}>Chưa có sản phẩm nào.</Text>
                                            )}
                                        </View>
                                    </View>
                                </ScrollView>

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

export default CategoriesTab;
