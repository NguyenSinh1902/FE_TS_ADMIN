import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter, Animated, Dimensions, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const NotificationContext = createContext(null);

const { width } = Dimensions.get('window');

/**
 * Toast banner xuất hiện từ trên xuống khi có thông báo mới
 */
const ToastBanner = ({ notification, onDismiss }) => {
    const slideY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!notification) return;

        // Slide in
        Animated.parallel([
            Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        // Auto-dismiss sau 4s
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideY, { toValue: -120, duration: 300, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start(() => onDismiss());
        }, 4000);

        return () => clearTimeout(timer);
    }, [notification]);

    if (!notification) return null;

    const isCancelled = notification.title?.includes('HỦY') || notification.title?.includes('🚨');
    const bgColor = isCancelled ? '#7F1D1D' : '#14532D';
    const borderColor = isCancelled ? '#DC2626' : '#16A34A';

    return (
        <Animated.View
            style={[
                toastStyles.container,
                { backgroundColor: bgColor, borderLeftColor: borderColor, transform: [{ translateY: slideY }], opacity }
            ]}
            pointerEvents="box-none"
        >
            <TouchableOpacity style={toastStyles.inner} activeOpacity={0.9} onPress={onDismiss}>
                <Text style={toastStyles.emoji}>{isCancelled ? '🚨' : '📈'}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={toastStyles.title} numberOfLines={1}>{notification.title}</Text>
                    <Text style={toastStyles.body} numberOfLines={2}>{notification.body}</Text>
                </View>
                <Text style={toastStyles.close}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const toastStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 550,
        zIndex: 9999,
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 20,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    emoji: { fontSize: 28 },
    title: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, marginBottom: 4 },
    body: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500', lineHeight: 22 },
    close: { color: 'rgba(255,255,255,0.6)', fontSize: 20, fontWeight: '700', paddingLeft: 12 },
});

/**
 * Provider bọc toàn bộ app, lắng nghe FCM event từ DeviceEventEmitter
 */
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);
    const toastKey = useRef(0);

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('FCM_MESSAGE', (remoteMessage) => {
            const { notification, data } = remoteMessage;
            const title = notification?.title || data?.title || 'Thông báo';
            const body = notification?.body || data?.body || '';

            const isCancelled = title.includes('HỦY') || title.includes('🚨');
            const newNoti = {
                id: String(++toastKey.current),
                title,
                body,
                time: new Date(),
                type: isCancelled ? 'cancel' : 'complete',
                isNew: true,
            };

            setNotifications(prev => [newNoti, ...prev].slice(0, 50)); // Giữ tối đa 50
            setToast(newNoti);
        });

        return () => sub.remove();
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    };

    const showToastMsg = (title, body, type = 'success') => {
        const isError = type === 'error' || type === 'cancel';
        const newNoti = {
            id: String(++toastKey.current),
            title,
            body,
            time: new Date(),
            type: isError ? 'cancel' : 'complete',
            isNew: false, // Don't add to notification center history by default unless wanted, but let's just make it a pure toast
        };
        setToast(newNoti);
    };

    const unreadCount = notifications.filter(n => n.isNew).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, showToast: showToastMsg }}>
            {children}
            <ToastBanner notification={toast} onDismiss={() => setToast(null)} />
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
