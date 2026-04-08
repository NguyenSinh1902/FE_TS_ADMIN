import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import styles from './Finance.styles';
import { ReceiptIcon, TaxIcon } from './FinanceIcons';
import InvoicesTab from './tabs/InvoicesTab';
import TaxesFeesTab from './tabs/TaxesFeesTab';

export default function Finance({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('invoice'); // invoice | tax
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Header userName="Anna Trần" title="Tài chính & Chi phí" />

            {/* Tab Switcher */}
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

            {activeTab === 'invoice' ? (
                <InvoicesTab onModalStateChange={setIsTabModalOpen} />
            ) : (
                <TaxesFeesTab onModalStateChange={setIsTabModalOpen} />
            )}

            {!isTabModalOpen && <BottomNav currentScreen="Finance" onNavigate={onNavigate} />}
        </View>
    );
}
