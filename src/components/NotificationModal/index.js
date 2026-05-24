import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNotifications } from '../../context/NotificationContext';

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

const fmtTime = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} giờ trước`;
    return `${Math.floor(diffH / 24)} ngày trước`;
};

const NotificationModal = ({ visible, onClose }) => {
    const { notifications, unreadCount, markAllRead } = useNotifications() || { notifications: [], unreadCount: 0, markAllRead: () => {} };

    const renderIcon = (type) => {
        const isCancelled = type === 'cancel';
        const color = isCancelled ? '#DC2626' : '#10B981';
        const bg = isCancelled ? 'rgba(220, 38, 38, 0.1)' : 'rgba(16, 185, 129, 0.1)';
        return (
            <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                <Text style={{ fontSize: 18 }}>{isCancelled ? '🚨' : '📈'}</Text>
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.notiItem, item.isNew && styles.notiItemNew]} activeOpacity={0.7}>
            {renderIcon(item.type)}
            <View style={styles.notiContent}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                <Text style={styles.notiDesc} numberOfLines={2}>{item.body}</Text>
                <Text style={styles.notiTime}>{fmtTime(item.time)}</Text>
            </View>
            {item.isNew && <View style={styles.newDot} />}
        </TouchableOpacity>
    );

    const EmptyState = () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 16 }}>🔔</Text>
            <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>Chưa có thông báo nào</Text>
            <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 6 }}>Thông báo sẽ xuất hiện ở đây</Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Thông báo</Text>
                            <Text style={styles.subtitle}>
                                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới` : 'Không có thông báo mới'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.readAllBtn} onPress={markAllRead}>
                            <CheckAllIcon />
                            <Text style={styles.readAllText}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                    </View>

                    {notifications.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    )}
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
