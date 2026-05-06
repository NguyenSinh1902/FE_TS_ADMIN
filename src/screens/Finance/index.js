import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, useWindowDimensions, ImageBackground, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../../components/Sidebar';
import styles from './Finance.styles';
import { 
    ReceiptIcon, TaxIcon, 
    TeaLeafIcon, MatchaCupIcon, PearlIcon, TeapotIcon 
} from './FinanceIcons';
import InvoicesTab from './tabs/InvoicesTab';
import TaxesFeesTab from './tabs/TaxesFeesTab';

export default function Finance({ onNavigate }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    
    const [activeTab, setActiveTab] = useState('invoice'); // invoice | tax
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const SettingsIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const renderContent = () => (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <View style={styles.tabletHeader}>
                    <View>
                        <Text style={styles.tabletHeaderTitle}>Tài chính & Chi phí</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.segmentedControl}>
                            <TouchableOpacity
                                style={[styles.segmentBtn, activeTab === 'invoice' && styles.segmentBtnActive]}
                                onPress={() => setActiveTab('invoice')}
                            >
                                <Text style={[styles.segmentText, activeTab === 'invoice' && styles.segmentTextActive]}>Hóa đơn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentBtn, activeTab === 'tax' && styles.segmentBtnActive]}
                                onPress={() => setActiveTab('tax')}
                            >
                                <Text style={[styles.segmentText, activeTab === 'tax' && styles.segmentTextActive]}>Thuế & phí</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.iconBtn}>
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                            <View style={{ position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <SettingsIcon />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <Header userName="Anna Trần" title="Tài chính & Chi phí" />
                    {/* Tab Switcher (Mobile) */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'invoice' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('invoice')}
                        >
                            <ReceiptIcon color={activeTab === 'invoice' ? '#8BA367' : '#9CA3AF'} />
                            <Text style={[styles.tabText, activeTab === 'invoice' && styles.tabTextActive]}>Hóa đơn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'tax' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('tax')}
                        >
                            <TaxIcon color={activeTab === 'tax' ? '#8BA367' : '#9CA3AF'} />
                            <Text style={[styles.tabText, activeTab === 'tax' && styles.tabTextActive]}>Thuế & phí</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {activeTab === 'invoice' ? (
                <InvoicesTab onModalStateChange={setIsTabModalOpen} />
            ) : (
                <TaxesFeesTab onModalStateChange={setIsTabModalOpen} />
            )}

            {!isTablet && !isTabModalOpen && <BottomNav currentScreen="Finance" onNavigate={onNavigate} />}
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            {isTablet ? (
                <View style={{ flex: 1, backgroundColor: '#F8F9FA', flexDirection: 'row' }}>
                    {/* Decorative Background Assets */}
                    <View style={StyleSheet.absoluteFill}>
                        <View style={{ position: 'absolute', top: 50, right: '10%' }}><TeaLeafIcon size={200} opacity={0.06} /></View>
                        <View style={{ position: 'absolute', bottom: -50, left: '30%' }}><MatchaCupIcon size={250} opacity={0.04} /></View>
                        <View style={{ position: 'absolute', top: '40%', right: '5%' }}><TeapotIcon size={180} opacity={0.05} /></View>
                        <View style={{ position: 'absolute', bottom: 100, right: '25%' }}><PearlIcon size={60} opacity={0.08} /></View>
                        <View style={{ position: 'absolute', top: 150, left: '50%' }}><PearlIcon size={40} opacity={0.05} /></View>
                        
                        {/* Glass Bubbles */}
                        <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(139, 163, 103, 0.03)', top: -100, left: '20%' }} />
                        <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(252, 211, 77, 0.02)', bottom: 50, right: '15%' }} />
                    </View>

                    <Sidebar 
                        activeRoute="Finance" 
                        onNavigate={onNavigate} 
                        isCollapsed={isSidebarCollapsed}
                        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.4)' }}>
                        {renderContent()}
                    </View>
                </View>
            ) : (
                renderContent()
            )}
        </View>
    );
}
