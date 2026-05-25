import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, useWindowDimensions } from 'react-native';
import Header from '../../components/Header';
import styles from './Staff.styles';
import { UserIcon, UsersIcon } from './StaffIcons';
import StaffTab from './tabs/StaffTab';
import CustomersTab from './tabs/CustomersTab';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';
import { Svg, Path, Circle } from 'react-native-svg';

const SettingsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Decorative Tea Cup SVG
const TeaCupDeco = ({ size = 60, opacity = 0.06 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity}>
        <Path d="M15 30 L85 30 L75 80 L25 80 Z" fill="#3D5A2A" />
        <Path d="M85 35 Q105 35 105 50 Q105 65 85 65" stroke="#3D5A2A" strokeWidth="5" fill="none" />
        <Path d="M30 25 Q35 15 40 25" stroke="#3D5A2A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M48 22 Q53 10 58 22" stroke="#3D5A2A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M20 85 L80 85" stroke="#3D5A2A" strokeWidth="5" strokeLinecap="round" />
    </Svg>
);

// Decorative Leaf SVG
const LeafDeco = ({ size = 50, opacity = 0.06 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity}>
        <Path d="M50 10 Q90 40 70 80 Q50 95 30 80 Q10 40 50 10Z" fill="#5D7A3A" />
        <Path d="M50 10 L50 85" stroke="#3D5A2A" strokeWidth="3" fill="none" />
        <Path d="M50 40 L70 55" stroke="#3D5A2A" strokeWidth="2" fill="none" />
        <Path d="M50 55 L30 68" stroke="#3D5A2A" strokeWidth="2" fill="none" />
        <Path d="M50 30 L67 42" stroke="#3D5A2A" strokeWidth="2" fill="none" />
    </Svg>
);

// Decorative Matcha Whisk
const MatchaDeco = ({ size = 55, opacity = 0.05 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity}>
        <Circle cx="50" cy="50" r="35" stroke="#3D5A2A" strokeWidth="4" fill="none" />
        <Circle cx="50" cy="50" r="20" stroke="#3D5A2A" strokeWidth="3" fill="none" />
        <Circle cx="50" cy="50" r="8" fill="#3D5A2A" />
        <Path d="M50 15 L50 85 M15 50 L85 50 M26 26 L74 74 M74 26 L26 74" stroke="#3D5A2A" strokeWidth="2" />
    </Svg>
);

export default function StaffManagement({ onNavigate }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [activeTab, setActiveTab] = useState('staff');
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showNotiModal, setShowNotiModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (isTablet) {
        return (
            <View style={styles.tabletContainer}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

                {/* Decorative Background — white-gray with tea icons */}
                <View style={[styles.absoluteFill, { backgroundColor: '#F5F5F2' }]}>
                    {/* Blobs tint */}
                    <View style={styles.decorativeBlob1} />
                    <View style={styles.decorativeBlob2} />
                    <View style={styles.decorativeBlob3} />
                    <View style={styles.frostyOverlay} />
                    {/* Tea decorations scattered */}
                    <View style={{ position: 'absolute', top: 40, right: 80 }}><TeaCupDeco size={120} opacity={0.07} /></View>
                    <View style={{ position: 'absolute', top: 200, right: 20, transform: [{ rotate: '20deg' }] }}><LeafDeco size={90} opacity={0.06} /></View>
                    <View style={{ position: 'absolute', bottom: 120, right: 120, transform: [{ rotate: '-15deg' }] }}><TeaCupDeco size={80} opacity={0.05} /></View>
                    <View style={{ position: 'absolute', bottom: 60, right: 60 }}><MatchaDeco size={100} opacity={0.05} /></View>
                    <View style={{ position: 'absolute', top: 100, right: 300, transform: [{ rotate: '30deg' }] }}><LeafDeco size={70} opacity={0.06} /></View>
                    <View style={{ position: 'absolute', bottom: 200, right: 250, transform: [{ rotate: '-10deg' }] }}><LeafDeco size={55} opacity={0.05} /></View>
                    <View style={{ position: 'absolute', top: 350, right: 180, transform: [{ rotate: '45deg' }] }}><LeafDeco size={65} opacity={0.04} /></View>
                </View>



                <View style={styles.tabletMain}>
                    {showToast && (
                        <View style={{
                            position: 'absolute', top: 10, alignSelf: 'center',
                            backgroundColor: '#E6F4EA', paddingVertical: 8, paddingHorizontal: 16,
                            borderRadius: 20, zIndex: 9999,
                            borderWidth: 1, borderColor: '#A3D2A6',
                            flexDirection: 'row', alignItems: 'center',
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
                        }}>
                            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                                <Circle cx="12" cy="12" r="10" fill="#34A853" />
                                <Path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                            <Text style={{ color: '#1E4620', fontWeight: '600', fontSize: 13 }}>{toastMessage}</Text>
                        </View>
                    )}
                    <View style={styles.tabletHeader}>
                        <View>
                            <Text style={styles.tabletHeaderTitle}>Quản lý Nhân sự & CRM</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* Segmented Control */}
                            <View style={styles.segmentedControl}>
                                <TouchableOpacity
                                    style={[styles.segmentBtn, activeTab === 'staff' && styles.segmentBtnActive]}
                                    onPress={() => setActiveTab('staff')}
                                >
                                    <Text style={[styles.segmentText, activeTab === 'staff' && styles.segmentTextActive]}>Hồ sơ Nhân sự</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segmentBtn, activeTab === 'customer' && styles.segmentBtnActive]}
                                    onPress={() => setActiveTab('customer')}
                                >
                                    <Text style={[styles.segmentText, activeTab === 'customer' && styles.segmentTextActive]}>Khách hàng (CRM)</Text>
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

                    {activeTab === 'staff' ? (
                        <StaffTab onModalStateChange={setIsTabModalOpen} showToast={triggerToast} />
                    ) : (
                        <CustomersTab onModalStateChange={setIsTabModalOpen} showToast={triggerToast} />
                    )}
                </View>
                <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
                <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            </View>
        );
    }

    // Mobile Fallback
    return (
        <View style={styles.mainContainer}>
            {showToast && (
                <View style={{
                    position: 'absolute', top: 10, alignSelf: 'center',
                    backgroundColor: '#E6F4EA', paddingVertical: 8, paddingHorizontal: 16,
                    borderRadius: 20, zIndex: 9999,
                    borderWidth: 1, borderColor: '#A3D2A6',
                    flexDirection: 'row', alignItems: 'center',
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
                }}>
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                        <Circle cx="12" cy="12" r="10" fill="#34A853" />
                        <Path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ color: '#1E4620', fontWeight: '600', fontSize: 13 }}>{toastMessage}</Text>
                </View>
            )}
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <Header userName="Anna Trần" title="Quản lý Nhân sự & CRM" onNotificationPress={() => setShowNotiModal(true)} />

            {/* Tab Selection */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'staff' && styles.tabBtnActive]}
                    activeOpacity={0.8} onPress={() => setActiveTab('staff')}
                >
                    <UserIcon color={activeTab === 'staff' ? '#FFFFFF' : '#8BA367'} />
                    <Text style={[styles.tabText, activeTab === 'staff' && styles.tabTextActive]}>Hồ sơ Nhân sự</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'customer' && styles.tabBtnActive]}
                    activeOpacity={0.8} onPress={() => setActiveTab('customer')}
                >
                    <UsersIcon color={activeTab === 'customer' ? '#FFFFFF' : '#8BA367'} />
                    <Text style={[styles.tabText, activeTab === 'customer' && styles.tabTextActive]}>Khách hàng (CRM)</Text>
                </TouchableOpacity>
            </View>

            {/* Specialized Tab Content */}
            {activeTab === 'staff' ? (
                <StaffTab onModalStateChange={setIsTabModalOpen} showToast={triggerToast} />
            ) : (
                <CustomersTab onModalStateChange={setIsTabModalOpen} showToast={triggerToast} />
            )}

            {/* Bottom Nav: Only visible if no tab-level modal is active */}

            <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
            <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
        </View>
    );
}
