import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const CloseIcon = ({ color = '#94A3B8' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CheckAllIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M5 13l4 4L19 7" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 18l4 4L19 12" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </Svg>
);

const NOTIFICATIONS = [
  { id: '1', title: 'Đơn hàng mới #1024', desc: 'Có một đơn hàng mới từ Bàn 04 cần chuẩn bị gấp.', time: '2 phút trước', type: 'order', isNew: true },
  { id: '2', title: 'Cảnh báo tồn kho', desc: 'Nguyên liệu Trà Ô Long sắp hết, vui lòng nhập thêm kho.', time: '1 giờ trước', type: 'warning', isNew: true },
  { id: '3', title: 'Thống kê ngày', desc: 'Báo cáo doanh thu ngày hôm qua đã sẵn sàng. Xem ngay!', time: '1 ngày trước', type: 'info', isNew: false },
  { id: '4', title: 'Ca làm việc', desc: 'Nhân viên Nguyễn Văn A đã xin đổi ca làm việc ngày mai.', time: '2 ngày trước', type: 'staff', isNew: false },
];

const NotificationModal = ({ visible, onClose }) => {
    
    const renderIcon = (type) => {
        let color = '#3B82F6';
        let bg = 'rgba(59, 130, 246, 0.1)';
        if (type === 'warning') { color = '#F59E0B'; bg = 'rgba(245, 158, 11, 0.1)'; }
        if (type === 'order') { color = '#10B981'; bg = 'rgba(16, 185, 129, 0.1)'; }
        if (type === 'staff') { color = '#8B5CF6'; bg = 'rgba(139, 92, 246, 0.1)'; }

        return (
            <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                {type === 'warning' && (
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                        <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                )}
                {type === 'order' && (
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
                    </Svg>
                )}
                {type === 'info' && (
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                        <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                )}
                {type === 'staff' && (
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                )}
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.notiItem, item.isNew && styles.notiItemNew]} activeOpacity={0.7}>
            {renderIcon(item.type)}
            <View style={styles.notiContent}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                <Text style={styles.notiDesc} numberOfLines={2}>{item.desc}</Text>
                <Text style={styles.notiTime}>{item.time}</Text>
            </View>
            {item.isNew && <View style={styles.newDot} />}
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Thông báo</Text>
                            <Text style={styles.subtitle}>Bạn có 2 thông báo mới</Text>
                        </View>
                        <TouchableOpacity style={styles.readAllBtn}>
                            <CheckAllIcon />
                            <Text style={styles.readAllText}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={NOTIFICATIONS}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
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
        alignItems: 'flex-end', // Align to right
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
    readAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6
    },
    readAllText: {
        color: '#8BA367',
        fontSize: 12,
        fontWeight: '700',
    },
    listContent: {
        paddingVertical: 12,
    },
    notiItem: {
        flexDirection: 'row',
        padding: 16,
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
    },
    notiItemNew: {
        backgroundColor: '#F8FAFC',
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notiContent: {
        flex: 1,
    },
    notiTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    notiDesc: {
        fontSize: 13,
        color: '#4A5565',
        lineHeight: 20,
        marginBottom: 8,
    },
    notiTime: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    newDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        marginTop: 6,
        marginLeft: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 84, // Align with text
    }
});

export default NotificationModal;
