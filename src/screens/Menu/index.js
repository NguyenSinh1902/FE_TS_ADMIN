import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, useWindowDimensions } from 'react-native';
import Header from '../../components/Header';
import styles from './Menu.styles';
import { PlusIcon } from './MenuIcons';
import ProductsTab from './tabs/ProductsTab';
import CategoriesTab from './tabs/CategoriesTab';
import ProductFormModal from './components/ProductFormModal';
import CategoryFormModal from './components/CategoryFormModal';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';
import { Svg, Path, Circle } from 'react-native-svg';

const SettingsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function Menu({ onNavigate }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [activeTab, setActiveTab] = useState('products');
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showNotiModal, setShowNotiModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Form States
    const [productFormVisible, setProductFormVisible] = useState(false);
    const [editingProductData, setEditingProductData] = useState(null);
    const [categoryFormVisible, setCategoryFormVisible] = useState(false);
    const [editingCategoryData, setEditingCategoryData] = useState(null);

    const openProductForm = (data = null) => {
        setEditingProductData(data);
        setProductFormVisible(true);
    };

    const openCategoryForm = (data = null) => {
        setEditingCategoryData(data);
        setCategoryFormVisible(true);
    };

    // Track modal state for BottomNav hiding
    React.useEffect(() => {
        setIsTabModalOpen(productFormVisible || categoryFormVisible);
    }, [productFormVisible, categoryFormVisible]);

    if (isTablet) {
        return (
            <View style={styles.tabletContainer}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

                {/* Decorative Background */}
                <View style={[styles.absoluteFill, { backgroundColor: '#F5F5F2' }]}>
                    <View style={styles.decorativeBlob1} />
                    <View style={styles.decorativeBlob2} />
                    <View style={styles.decorativeBlob3} />
                    <View style={styles.frostyOverlay} />
                </View>

                

                <View style={styles.tabletMain}>
                    <View style={styles.tabletHeader}>
                        <View>
                            <Text style={styles.tabletHeaderTitle}>Quản lý Thực đơn</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.segmentedControl}>
                                <TouchableOpacity
                                    style={[styles.segmentBtn, activeTab === 'categories' && styles.segmentBtnActive]}
                                    onPress={() => setActiveTab('categories')}
                                >
                                    <Text style={[styles.segmentText, activeTab === 'categories' && styles.segmentTextActive]}>Danh mục</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segmentBtn, activeTab === 'products' && styles.segmentBtnActive]}
                                    onPress={() => setActiveTab('products')}
                                >
                                    <Text style={[styles.segmentText, activeTab === 'products' && styles.segmentTextActive]}>Sản phẩm</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotiModal(true)}>
                                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <View style={styles.badge} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettingsModal(true)}>
                                <SettingsIcon />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {activeTab === 'products' ? (
                        <ProductsTab
                            onModalStateChange={setIsTabModalOpen}
                            onNavigate={onNavigate}
                            onOpenForm={openProductForm}
                        />
                    ) : (
                        <CategoriesTab
                            onModalStateChange={setIsTabModalOpen}
                            onNavigate={onNavigate}
                            onOpenForm={openCategoryForm}
                        />
                    )}
                </View>

                <ProductFormModal
                    visible={productFormVisible}
                    onClose={() => setProductFormVisible(false)}
                    initialData={editingProductData}
                    onSave={() => setProductFormVisible(false)}
                />

                <CategoryFormModal
                    visible={categoryFormVisible}
                    onClose={() => setCategoryFormVisible(false)}
                    initialData={editingCategoryData}
                    onSave={() => setCategoryFormVisible(false)}
                />

                <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
                <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <Header userName="Anna Trần" title="Quản lý Thực đơn" onNotificationPress={() => setShowNotiModal(true)} />

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'categories' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('categories')}
                >
                    <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>Danh mục</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'products' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('products')}
                >
                    <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>Sản phẩm</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'products' ? (
                <ProductsTab
                    onModalStateChange={setIsTabModalOpen}
                    onNavigate={onNavigate}
                    onOpenForm={openProductForm}
                />
            ) : (
                <CategoriesTab
                    onModalStateChange={setIsTabModalOpen}
                    onNavigate={onNavigate}
                    onOpenForm={openCategoryForm}
                />
            )}

            <ProductFormModal
                visible={productFormVisible}
                onClose={() => setProductFormVisible(false)}
                initialData={editingProductData}
                onSave={() => setProductFormVisible(false)}
            />

            <CategoryFormModal
                visible={categoryFormVisible}
                onClose={() => setCategoryFormVisible(false)}
                initialData={editingCategoryData}
                onSave={() => setCategoryFormVisible(false)}
            />

            {!isTabModalOpen && (
                <>
                    <TouchableOpacity
                        style={styles.fabExtended}
                        activeOpacity={0.8}
                        onPress={() => activeTab === 'products' ? openProductForm() : openCategoryForm()}
                    >
                        <PlusIcon />
                        <Text style={styles.fabText}>{activeTab === 'categories' ? 'Thêm Danh mục' : 'Thêm Sản phẩm'}</Text>
                    </TouchableOpacity>
                    
                </>
            )}

            <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
            <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
        </View>
    );
}
