import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Switch, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const CloseIcon = ({ color = '#94A3B8' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const MoonIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const BellIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const LockIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PrinterIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6 14h12v8H6z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const SettingsModal = ({ visible, onClose }) => {
    const [pushNoti, setPushNoti] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoPrint, setAutoPrint] = useState(true);

    const renderSettingRow = (icon, title, desc, value, onValueChange) => (
        <View style={styles.settingRow}>
            <View style={styles.iconWrap}>{icon}</View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
                trackColor={{ false: '#E2E8F0', true: '#CDE1B4' }}
                thumbColor={value ? '#8BA367' : '#F8FAFC'}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Cài đặt hệ thống</Text>
                            <Text style={styles.subtitle}>Quản lý tùy chọn & tính năng</Text>
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                        <Text style={styles.sectionTitle}>Hiển thị & Giao diện</Text>
                        {renderSettingRow(<MoonIcon />, 'Chế độ nền tối (Dark Mode)', 'Giao diện thân thiện với mắt vào ban đêm.', darkMode, setDarkMode)}
                        
                        <View style={styles.separator} />
                        
                        <Text style={styles.sectionTitle}>Thông báo</Text>
                        {renderSettingRow(<BellIcon />, 'Thông báo đẩy (Push)', 'Nhận cảnh báo đơn hàng & tồn kho ngay lập tức.', pushNoti, setPushNoti)}
                        
                        <View style={styles.separator} />
                        
                        <Text style={styles.sectionTitle}>Tích hợp & Thiết bị</Text>
                        {renderSettingRow(<PrinterIcon />, 'Tự động in hóa đơn', 'In hóa đơn ngay khi đơn hàng được thanh toán xong.', autoPrint, setAutoPrint)}
                        
                        <View style={styles.separator} />
                        
                        <Text style={styles.sectionTitle}>Bảo mật</Text>
                        <TouchableOpacity style={styles.linkRow}>
                            <View style={[styles.iconWrap, { backgroundColor: '#F8FAFC' }]}><LockIcon /></View>
                            <Text style={styles.linkText}>Đổi mật khẩu bảo mật</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end', // Align to right side under the button
    },
    modalContainer: {
        width: 380,
        height: Dimensions.get('window').height * 0.8,
        backgroundColor: '#FFFFFF',
        marginTop: 80,
        marginRight: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF'
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        fontWeight: '500',
    },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 12
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
        paddingRight: 16,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 24,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
    },
    linkText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    }
});

export default SettingsModal;
