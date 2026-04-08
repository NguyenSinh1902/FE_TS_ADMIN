import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Modal } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import styles from './ProductDetail.styles';
import { mockProducts } from '../../tabs/ProductsTab';

const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const DotsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="5" r="2" fill="white"/>
        <Circle cx="12" cy="12" r="2" fill="white"/>
        <Circle cx="12" cy="19" r="2" fill="white"/>
    </Svg>
);

const EditIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#1E2939" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const TrashIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export default function ProductDetail({ onNavigate, params }) {
    const { productId } = params;
    const [showMenu, setShowMenu] = useState(false);

    // Lấy thông tin sản phẩm. (Thực tế là call API dựa trên productId)
    const product = mockProducts.find(p => p.id === productId) || mockProducts[0];

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Ảnh Hero Tràn Lề */}
            <Image source={{ uri: product.img }} style={styles.heroImage} />

            {/* Header Trong Suốt lơ lửng */}
            <View style={styles.headerAbsolute}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('Menu')}>
                    <BackIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMenu(true)}>
                    <DotsIcon />
                </TouchableOpacity>
            </View>

            {/* Khối Card Thông Tin */}
            <View style={styles.contentCard}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.price}>{product.price}</Text>
                </View>

                <View style={styles.catTag}>
                    <Text style={styles.catText}>{product.category}</Text>
                </View>

                <View>
                    <Text style={styles.descTitle}>Mô tả</Text>
                    <Text style={styles.descText}>{product.desc}</Text>
                </View>
            </View>

            {/* Pop-over Dropdown Menu (3 chấm) */}
            <Modal visible={showMenu} transparent animationType="fade">
                {/* Khi bấm khung nền ngoài sẽ thoát menu */}
                <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
                    <View style={styles.dropdownRect}>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowMenu(false); console.log('Edit'); }}>
                            <EditIcon />
                            <Text style={styles.dropdownText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        
                        <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />

                        <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowMenu(false); console.log('Delete'); }}>
                            <TrashIcon />
                            <Text style={[styles.dropdownText, styles.dropdownTextDelete]}>Xoá sản phẩm</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
