import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import styles from './Menu.styles';
import { PlusIcon } from './MenuIcons';
import ProductsTab from './tabs/ProductsTab';
import CategoriesTab from './tabs/CategoriesTab';
import ProductFormModal from './components/ProductFormModal';
import CategoryFormModal from './components/CategoryFormModal';

export default function Menu({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('products');
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);

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

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Header userName="Anna Trần" title="Quản lý Thực đơn" />

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
                    <BottomNav currentScreen="Menu" onNavigate={onNavigate} />
                </>
            )}
        </View>
    );
}
