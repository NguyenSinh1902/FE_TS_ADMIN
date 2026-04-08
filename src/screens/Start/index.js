import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Start.styles';

export default function Start({ onNavigate }) {
    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Background image replaces the dummyimage from the user's code */}
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.bgImage}
            >
                {/* Dark overlay from user's _container */}
                <View style={styles.overlay} />

                <View style={styles.contentContainer}>
                    {/* Glassmorphism Card */}
                    <View style={styles.glassCard}>
                        
                        <View style={styles.textContainer}>
                            <Text style={styles.matchTeaAdmin}>MatchTea{'\n'}Admin</Text>
                            <Text style={styles.subtitle}>
                                Hệ thống quản trị và phân tích{'\n'}chiến lược thông minh
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        {/* Login Button with LinearGradient for the golden/olive overlay effect */}
                        <TouchableOpacity 
                            style={styles.buttonWrapper}
                            onPress={() => onNavigate('Login')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient 
                                colors={['rgba(139, 154, 96, 0.9)', 'rgba(109, 124, 66, 0.9)']} 
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>TRUY CẬP HỆ THỐNG</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Security Badge - Absolutely positioned to overlap bottom edge */}
                        <View style={styles.securityBadge}>
                            <Text style={styles.securityText}>🔐 Bảo mật cao</Text>
                        </View>
                    </View>

                    <Text style={styles.footerText}>© 2026 MatchTea Management System</Text>
                </View>
            </ImageBackground>
        </View>
    );
}
