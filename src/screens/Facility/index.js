import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, useWindowDimensions, ImageBackground, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import Header from '../../components/Header';
import styles from './Facility.styles';

// Tabs
import TableMapTab from './tabs/TableMap/TableMapTab';
import PromotionsTab from './tabs/Promotions/PromotionsTab';

import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

const TableIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="8" width="16" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Path d="M6 16V20M18 16V20M8 8V4M16 8V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const SettingsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    const [showNotiModal, setShowNotiModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const content = (
        <View style={isTablet ? styles.tabletMain : { flex: 1 }}>
            {!isTablet && <Header userName="Anna Trần" title="Cơ sở & Sơ đồ bàn" onNotificationPress={() => setShowNotiModal(true)} />}
            
            {isTablet && (
                <View style={styles.tabletHeader}>
                    <Text style={styles.tabletHeaderTitle}>Cơ sở vật chất</Text>
                    
                    {/* Tablet Tab Switcher inline with header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.tabRow, styles.tabletTabRow, { marginVertical: 0 }]}>
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


                {content}

                <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
                <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {content}

            <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
            <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
        </View>
    );
}
