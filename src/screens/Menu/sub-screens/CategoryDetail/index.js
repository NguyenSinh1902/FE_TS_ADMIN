import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from './CategoryDetail.styles';
import { mockCategories } from '../../tabs/CategoriesTab';
import { mockProducts } from '../../tabs/ProductsTab';

const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export default function CategoryDetail({ onNavigate, params }) {
    const { categoryId } = params;
    
    // Logic Lấy dữ liệu
    const category = mockCategories.find(c => c.id === categoryId) || mockCategories[0];
    const relatedProducts = mockProducts.filter(p => p.category === category.name);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Ảnh Nền Hero */}
            <Image source={{ uri: category.img }} style={styles.heroImage} />

            {/* Nút Back Absolute */}
            <View style={styles.headerAbsolute}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('Menu')}>
                    <BackIcon />
                </TouchableOpacity>
            </View>

            {/* Nội dung vuốt Scroll */}
            <View style={styles.contentWrapper}>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{category.name}</Text>
                        {category.isSystem && (
                            <View style={styles.systemBadge}>
                                <Text style={styles.systemText}>Hệ thống</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.countText}>Tổng số: {category.count} sản phẩm</Text>
                    
                    {category.isSystem && (
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                Đây là danh mục đặc biệt. Khi bạn xóa các danh mục khác, sản phẩm sẽ tự động được chuyển về đây.
                            </Text>
                        </View>
                    )}
                </View>

                <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.listTitle}>Sản phẩm thuộc danh mục</Text>
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map(prod => (
                            <TouchableOpacity 
                                key={prod.id} 
                                style={styles.prodCard}
                                onPress={() => onNavigate('ProductDetail', { productId: prod.id })}
                            >
                                <Image source={{ uri: prod.img }} style={styles.prodImage} />
                                <View style={styles.prodInfo}>
                                    <Text style={styles.prodName}>{prod.name}</Text>
                                    <Text style={styles.prodPrice}>{prod.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 20 }}>Không có sản phẩm nào.</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
