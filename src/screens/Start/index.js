import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StatusBar, Animated, Easing, Dimensions, StyleSheet, ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Login from '../Login';
import startStyles from './Start.styles';
import authApi from '../../api/authApi';
import safeAsyncStorage from '../../utils/storage';

const { width, height } = Dimensions.get('window');
const BG_IMAGE = require('../../assets/images/matcha_background.png');

const GlassBubble = ({ x, y, size, reverse = false, floatY, floatYReverse }) => (
  <Animated.View style={{ 
    position: 'absolute', top: y, left: x, width: size, height: size,
    transform: [{ translateY: reverse ? floatYReverse : floatY }],
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  }}>
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.2)']}
      start={{ x: 0.1, y: 0.1 }} end={{ x: 0.9, y: 0.9 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={{
      position: 'absolute', top: size * 0.15, left: size * 0.15,
      width: size * 0.25, height: size * 0.25, borderRadius: size,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      transform: [{ scaleX: 1.2 }, { rotate: '-45deg' }]
    }} />
  </Animated.View>
);

export default function Start({ onNavigate }) {
  const [step, setStep] = useState('start'); 
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Focus states
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  // Animation Values
  const blurFadeAnim = useRef(new Animated.Value(0)).current; 
  const contentFadeAnim = useRef(new Animated.Value(1)).current; 
  const logoPositionX = useRef(new Animated.Value(0)).current; 
  const logoScale = useRef(new Animated.Value(1)).current;
  const rightPaneTranslateX = useRef(new Animated.Value(width * 0.5)).current; 
  const bubblesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(bubblesAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear
      })
    ).start();
  }, []);

  const handleStartTransition = () => {
    setStep('animating');
    Animated.parallel([
      Animated.timing(contentFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(blurFadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(logoPositionX, { 
        toValue: 1, 
        duration: 1200, 
        useNativeDriver: true, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }),
      Animated.timing(logoScale, {
        toValue: 0.85, 
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }),
      Animated.timing(rightPaneTranslateX, { 
        toValue: 0, 
        duration: 1200, 
        useNativeDriver: true, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      })
    ]).start(() => {
      setStep('login');
    });
  };

  const handleLoginSubmit = async () => {
    if (!identifier || !password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authApi.login({
        email: identifier,
        matKhau: password
      });

      if (response && response.success && response.token) {
        const userRole = response.user?.vaiTro;
        if (userRole === 'PHUC_VU' || userRole === 'THU_NGAN') {
          setErrorMessage('Tài khoản không có quyền truy cập hệ thống quản trị');
          setIsLoading(false);
          return;
        }

        // Save token and user info
        await safeAsyncStorage.setItem('token', response.token);
        if (response.user) {
          await safeAsyncStorage.setItem('user', JSON.stringify(response.user));
        }
        
        onNavigate('Dashboard');
      } else {
        setErrorMessage(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStart = () => {
    Animated.parallel([
      Animated.timing(contentFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(blurFadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      Animated.timing(logoPositionX, { 
        toValue: 0, 
        duration: 1000, 
        useNativeDriver: true, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }),
      Animated.timing(logoScale, {
        toValue: 1, 
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }),
      Animated.timing(rightPaneTranslateX, { 
        toValue: width * 0.5, 
        duration: 1000, 
        useNativeDriver: true, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      })
    ]).start(() => {
      setStep('start');
    });
  };

  const floatY = bubblesAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -30, 0]
  });

  const floatYReverse = bubblesAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 30, 0]
  });

  const logoTranslateX = logoPositionX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width * 0.25] 
  });

  return (
    <View style={startStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={BG_IMAGE} style={startStyles.absoluteFill} blurRadius={6}>
        <View style={startStyles.darkOverlay} />
      </ImageBackground>

      <Animated.View style={[startStyles.absoluteFill, { opacity: blurFadeAnim }]}>
        <ImageBackground source={BG_IMAGE} style={startStyles.absoluteFill} blurRadius={25}>
          <View style={startStyles.frostyOverlay} />
        </ImageBackground>
      </Animated.View>

      <View style={startStyles.bubblesContainer} pointerEvents="none">
        <GlassBubble x={width * 0.15} y={height * 0.2} size={80} floatY={floatY} floatYReverse={floatYReverse} />
        <GlassBubble x={width * 0.8} y={height * 0.15} size={50} reverse floatY={floatY} floatYReverse={floatYReverse} />
        <GlassBubble x={width * 0.05} y={height * 0.6} size={60} reverse floatY={floatY} floatYReverse={floatYReverse} />
        <GlassBubble x={width * 0.85} y={height * 0.7} size={100} floatY={floatY} floatYReverse={floatYReverse} />
        <GlassBubble x={width * 0.7} y={height * 0.4} size={30} reverse floatY={floatY} floatYReverse={floatYReverse} />
      </View>

      <Animated.View style={[startStyles.logoContainer, { transform: [{ translateX: logoTranslateX }, { scale: logoScale }] }]} pointerEvents="none">
        <View style={startStyles.logoGlow} />
        <View style={startStyles.portalCircle} />
        <Text style={startStyles.logoTextMain}>MatchTea</Text>
        <Text style={startStyles.logoSubText}>QUẢN TRỊ VIÊN</Text>
      </Animated.View>

      <Animated.View style={[startStyles.startContent, { opacity: contentFadeAnim }]} pointerEvents={step === 'start' ? 'auto' : 'none'}>
        <Text style={startStyles.startSubtitle}>SẴN SÀNG KHỞI TẠO</Text>
        <TouchableOpacity style={startStyles.startBtnWrap} onPress={handleStartTransition} activeOpacity={0.8}>
          <LinearGradient colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.05)']} style={startStyles.startBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={startStyles.startBtnText}>TRUY CẬP HỆ THỐNG</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[startStyles.rightPane, { transform: [{ translateX: rightPaneTranslateX }] }]}>
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Login 
            identifier={identifier} setIdentifier={(val) => { setIdentifier(val); setErrorMessage(''); }}
            password={password} setPassword={(val) => { setPassword(val); setErrorMessage(''); }}
            isEmailFocused={isEmailFocused} setEmailFocused={setEmailFocused}
            isPasswordFocused={isPasswordFocused} setPasswordFocused={setPasswordFocused}
            handleLogin={handleLoginSubmit}
            handleBack={handleBackToStart}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />
        </View>
      </Animated.View>
    </View>
  );
}
