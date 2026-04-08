import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import styles from './Facility.styles';

// Tabs
import TableMapTab from './tabs/TableMap/TableMapTab';
import PromotionsTab from './tabs/Promotions/PromotionsTab';

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
    const [activeTab, setActiveTab] = useState('map'); // map | promo
    const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Header userName="Anna Trần" title="Cơ sở & Sơ đồ bàn" />

            {/* Tab Switcher - Pill Style */}
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

            <View style={{ flex: 1 }}>
                {activeTab === 'map' ? (
                    <TableMapTab setIsAnyModalOpen={setIsAnyModalOpen} />
                ) : (
                    <PromotionsTab setIsAnyModalOpen={setIsAnyModalOpen} />
                )}
            </View>

            {!isAnyModalOpen && <BottomNav currentScreen="Facility" onNavigate={onNavigate} />}
        </View>
    );
}
