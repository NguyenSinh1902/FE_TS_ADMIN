import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import BottomNav from '../../components/BottomNav';
import Header from '../../components/Header';
import styles from './Staff.styles';
import { UserIcon, UsersIcon } from './StaffIcons';
import StaffTab from './tabs/StaffTab';
import CustomersTab from './tabs/CustomersTab';

export default function StaffManagement({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('staff'); 
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            <Header userName="Anna Trần" title="Quản lý Nhân sự & CRM" />

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
                <StaffTab onModalStateChange={setIsTabModalOpen} />
            ) : (
                <CustomersTab onModalStateChange={setIsTabModalOpen} />
            )}

            {/* Bottom Nav: Only visible if no tab-level modal is active */}
            {!isTabModalOpen && <BottomNav currentScreen="StaffManagement" onNavigate={onNavigate} />}
        </View>
    );
}
