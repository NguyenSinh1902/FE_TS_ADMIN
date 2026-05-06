import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, useWindowDimensions, ImageBackground, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../../components/Sidebar';
import styles from './Facility.styles';

// Tabs
import TableMapTab from './tabs/TableMap/TableMapTab';
import PromotionsTab from './tabs/Promotions/PromotionsTab';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

// --- ICONS (Main Switcher) ---
const TableIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="8" width="16" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Path d="M6 16V20M18 16V20M8 8V4M16 8V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const PromoIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M21 12H15M3 12H9M12 21V15M12 3L12 9M18.36 18.36L14.12 14.12M5.64 5.64L9.88 9.88M18.36 5.64L14.12 9.88M5.64 18.36L9.88 14.12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export default function Facility({ onNavigate }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [activeTab, setActiveTab] = useState('map'); // map | promo
    const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const content = (
        <View style={isTablet ? styles.tabletMain : { flex: 1 }}>
            {!isTablet && <Header userName="Anna Trần" title="Cơ sở & Sơ đồ bàn" />}
            
            {isTablet && (
                <View style={styles.tabletHeader}>
                    <Text style={styles.tabletHeaderTitle}>Cơ sở vật chất</Text>
                    
                    {/* Tablet Tab Switcher inline with header */}
                    <View style={[styles.tabRow, styles.tabletTabRow]}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'map' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('map')}
                        >
                            <TableIcon color={activeTab === 'map' ? '#8BA367' : '#9CA3AF'} />
                            <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>Sơ đồ bàn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'promo' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('promo')}
                        >
                            <PromoIcon color={activeTab === 'promo' ? '#8BA367' : '#9CA3AF'} />
                            <Text style={[styles.tabText, activeTab === 'promo' && styles.tabTextActive]}>Khuyến mãi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!isTablet && (
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'map' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('map')}
                    >
                        <TableIcon color={activeTab === 'map' ? '#8BA367' : '#9CA3AF'} />
                        <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>Sơ đồ bàn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'promo' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('promo')}
                    >
                        <PromoIcon color={activeTab === 'promo' ? '#8BA367' : '#9CA3AF'} />
                        <Text style={[styles.tabText, activeTab === 'promo' && styles.tabTextActive]}>Khuyến mãi</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ flex: 1, paddingHorizontal: isTablet ? 32 : 0 }}>
                {activeTab === 'map' ? (
                    <TableMapTab setIsAnyModalOpen={setIsAnyModalOpen} />
                ) : (
                    <PromotionsTab setIsAnyModalOpen={setIsAnyModalOpen} />
                )}
            </View>
        </View>
    );

    if (isTablet) {
        return (
            <View style={styles.tabletContainer}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                
                {/* Clean Light Grey Background with Subtle Bubbles */}
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F8FAFC' }]}>
                    <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#8BA367', opacity: 0.05, top: -50, right: -50 }} />
                    <View style={{ position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#FCD34D', opacity: 0.03, bottom: -100, left: '20%' }} />
                    <View style={{ position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: '#6366F1', opacity: 0.02, top: '40%', right: '10%' }} />
                </View>

                <Sidebar 
                    activeRoute="Facility"
                    onNavigate={onNavigate}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                
                {content}
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {content}
            {!isAnyModalOpen && <BottomNav currentScreen="Facility" onNavigate={onNavigate} />}
        </View>
    );
}
