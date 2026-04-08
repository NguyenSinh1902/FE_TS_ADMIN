import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const BellIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DecorativeBackground = () => (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Một vài mảng hình học mềm mại tạo cảm giác UI ảo diệu, hiện đại */}
        <Circle cx="90%" cy="-10" r="70" fill="rgba(255, 255, 255, 0.07)" />
        <Circle cx="15%" cy="130" r="50" fill="rgba(255, 255, 255, 0.05)" />
        <Path d="M100 -20 Q 250 150 500 -20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
    </Svg>
);

export default function Header({ 
    userName = 'Quản trị viên', 
    title = 'Dashboard', 
    unreadCount = 0,
    onNotificationPress,
    onAvatarPress
}) {
    return (
        <LinearGradient colors={['#8BA367', '#6c854c']} style={styles.headerContainer}>
            {/* Shapes trang trí mờ ảo ở nền gradient */}
            <DecorativeBackground />

            {/* Đẩy nội dung xuống qua khỏi Status Bar */}
            <View style={styles.statusBarSpacing} />
            
            <View style={styles.headerContent}>
                
                <View style={styles.leftSection}>
                    <TouchableOpacity style={styles.avatarButton} onPress={onAvatarPress} activeOpacity={0.8}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }} 
                            style={styles.avatarImage} 
                        />
                    </TouchableOpacity>

                    <View style={styles.textContainer}>
                        <Text style={styles.greetingText}>Xin chào, {userName} 👋</Text>
                        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress} activeOpacity={0.7}>
                        <BellIcon color="white" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomRightRadius: 36,
        borderBottomLeftRadius: 36,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        zIndex: 10, // Luôn đè lên trên nội dung ScrollView
        overflow: 'hidden', // Để crop các hạt deco tràn viền
    },
    statusBarSpacing: {
        height: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 15,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    avatarButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        backgroundColor: '#ccc',
        marginRight: 14,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    greetingText: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#EF4444', 
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#8BA367', // Màu viền hợp với bg
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
