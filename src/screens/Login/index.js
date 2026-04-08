import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import styles from './Login.styles';

export default function Login({ onNavigate }) {
  const [identifier, setIdentifier] = useState('admin@matchtea.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onNavigate('Dashboard');
  };

  const TopShieldIcon = () => (
    <Svg width="30" height="37" viewBox="0 0 30 37" fill="none">
      <Path d="M28.3332 20.0006C28.3332 28.3339 22.4998 32.5006 15.5665 34.9173C15.2034 35.0403 14.8091 35.0344 14.4498 34.9006C7.49984 32.5006 1.6665 28.3339 1.6665 20.0006V8.33392C1.6665 7.89189 1.8421 7.46797 2.15466 7.15541C2.46722 6.84285 2.89114 6.66725 3.33317 6.66725C6.6665 6.66725 10.8332 4.66725 13.7332 2.13392C14.0863 1.83225 14.5354 1.6665 14.9998 1.6665C15.4642 1.6665 15.9134 1.83225 16.2665 2.13392C19.1832 4.68392 23.3332 6.66725 26.6665 6.66725C27.1085 6.66725 27.5325 6.84285 27.845 7.15541C28.1576 7.46797 28.3332 7.89189 28.3332 8.33392V20.0006Z" stroke="#FFF8E7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const InputShieldIcon = () => (
    <Svg width="16" height="19" viewBox="0 0 15 19" fill="none">
      <Path d="M14.1668 10.0005C14.1668 14.1672 11.2502 16.2505 7.7835 17.4589C7.60196 17.5204 7.40478 17.5174 7.22516 17.4505C3.75016 16.2505 0.833496 14.1672 0.833496 10.0005V4.1672C0.833496 3.94619 0.921294 3.73423 1.07757 3.57795C1.23385 3.42167 1.44582 3.33387 1.66683 3.33387C3.3335 3.33387 5.41683 2.33387 6.86683 1.0672C7.04337 0.91637 7.26796 0.833496 7.50016 0.833496C7.73237 0.833496 7.95695 0.91637 8.1335 1.0672C9.59183 2.3422 11.6668 3.33387 13.3335 3.33387C13.5545 3.33387 13.7665 3.42167 13.9228 3.57795C14.079 3.73423 14.1668 3.94619 14.1668 4.1672V10.0005Z" stroke="#D4AF37" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const PadlockArc = () => (
    <Svg width="18" height="15" viewBox="0 0 17 15" fill="none">
        <Path d="M14.1 5.5H2.5C1.5 5.5 0.8 6.2 0.8 7.1V13.6C0.8 14.5 1.5 15.2 2.5 15.2H14.1C15.1 15.2 15.8 14.5 15.8 13.6V7.1C15.8 6.2 15.1 5.5 14.1 5.5Z" stroke="#D4AF37" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M4.5 5.5V4C4.5 2.5 5.5 1.5 8.5 1.5C11.5 1.5 12.5 2.5 12.5 4V5.5" stroke="#D4AF37" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );

  const EyeIcon = ({ visible }) => (
    <Svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <Path d="M1 7.5C1.5 5.5 3.5 2.5 10 2.5C16.5 2.5 18.5 5.5 19 7.5C18.5 9.5 16.5 12.5 10 12.5C3.5 12.5 1.5 9.5 1 7.5Z" stroke={visible ? "#D4AF37" : "rgba(255,255,255,0.5)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10Z" stroke={visible ? "#D4AF37" : "rgba(255,255,255,0.5)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <LinearGradient 
        colors={['#728654', '#55693D', '#3C4B29']} 
        style={styles.gradientBg}
      >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.shieldIconWrap}>
            <TopShieldIcon />
          </View>
          <Text style={styles.titleText}>MatchTea</Text>
          <Text style={styles.subtitleText}>QUẢN TRỊ VIÊN</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã số quản lý / Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <InputShieldIcon />
              </View>
              <TextInput
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="admin@matchtea.vn"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu bảo mật</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <PadlockArc />
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionRow}>
            {/* Replaced 'Remember login' with 'Forgot password' */}
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtnWrap} onPress={handleLogin} activeOpacity={0.8}>
            <LinearGradient colors={['rgba(139, 154, 96, 0.9)', 'rgba(109, 124, 66, 0.9)']} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>ĐĂNG NHẬP ADMIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.contactText}>Liên hệ kỹ thuật nếu quên mật khẩu</Text>
        </View>

        {/* Footer Badges */}
        <View style={styles.securityBadge}>
          <Svg width="12" height="15" viewBox="0 0 14 16" fill="none">
            <Path d="M11.3 7.6H2C1.2 7.6 0.6 8.2 0.6 9V14C0.6 14.8 1.2 15.4 2 15.4H11.3C12 15.4 12.6 14.8 12.6 14V9C12.6 8.2 12 7.6 11.3 7.6Z" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M3.5 7.6V4.5C3.5 2.5 5 1 7 1C9 1 10.5 2.5 10.5 4.5V7.6" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
          <Text style={styles.badgeText}>MÃ HÓA BẢO MẬT</Text>
        </View>
        <Text style={styles.footerText}>Chỉ dành cho quản trị viên được ủy quyền</Text>
        
      </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
