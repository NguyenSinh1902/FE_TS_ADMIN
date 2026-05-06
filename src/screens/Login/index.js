import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Login.styles';

const SupportIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#1B2A15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <Path d="M1 1L23 23" />
  </Svg>
);

const Login = ({ 
    identifier, setIdentifier, 
    password, setPassword, 
    isEmailFocused, setEmailFocused, 
    isPasswordFocused, setPasswordFocused, 
    handleLogin, handleBack,
    errorMessage, isLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.loginCard}>
      <View style={styles.loginHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}><BackIcon /></TouchableOpacity>
        <Text style={styles.loginTitle}>QUẢN TRỊ VIÊN</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={[styles.inputWrapper, isEmailFocused && styles.inputWrapperFocused]}>
          <View style={styles.inputIcon}><UserIcon /></View>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="admin@matchtea.vn"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            blurOnSubmit={false}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Mật khẩu</Text>
        <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
          <View style={styles.inputIcon}><LockIcon /></View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            style={{ padding: 8 }} 
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </TouchableOpacity>
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      <TouchableOpacity style={styles.loginBtnWrap} onPress={handleLogin} activeOpacity={0.9} disabled={isLoading}>
        <LinearGradient colors={['#8BA367', '#5D6D45']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginBtn}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
          )}
        </LinearGradient>
        <View style={styles.loginBtnGlow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotBtn}><Text style={styles.forgotText}>Quên mật khẩu?</Text></TouchableOpacity>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerRow}><SupportIcon /><Text style={styles.footerText}>Liên hệ hỗ trợ kỹ thuật</Text></TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
