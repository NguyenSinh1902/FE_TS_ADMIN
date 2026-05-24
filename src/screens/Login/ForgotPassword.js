import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Login.styles';
import authApi from '../../api/authApi';

const getErrorMessage = (error) => {
  const data = error.response?.data;
  if (!data) return 'Không thể kết nối đến máy chủ';
  if (typeof data === 'string') return data;
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    return Object.values(data.errors)[0];
  }
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].defaultMessage) {
    return data.errors[0].defaultMessage;
  }
  const keys = Object.keys(data).filter(k => !['timestamp', 'status', 'error', 'path', 'message'].includes(k));
  if (keys.length > 0 && typeof data[keys[0]] === 'string') {
    return data[keys[0]];
  }
  if (data.message) return data.message;
  return 'Lỗi từ máy chủ';
};

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

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isOtpFocused, setOtpFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      setErrorMessage('Vui lòng nhập email');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await authApi.requestOtp(email);
      if (response && response.message) {
        setSuccessMessage(response.message);
        setStep(2);
      } else {
        setErrorMessage('Gửi OTP thất bại');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await authApi.resetPassword({
        email: email,
        otp: otp,
        matKhauMoi: newPassword
      });
      if (response && response.message) {
        setIsResetSuccess(true);
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setErrorMessage('Đổi mật khẩu thất bại');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderBack = () => {
    if (step === 2) {
      setStep(1);
      setErrorMessage('');
      setSuccessMessage('');
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.loginCard}>
      <View style={styles.loginHeader}>
        <TouchableOpacity onPress={handleHeaderBack} style={styles.backBtn}><BackIcon /></TouchableOpacity>
        <Text style={styles.loginTitle}>{step === 1 ? 'QUÊN MẬT KHẨU' : 'XÁC NHẬN OTP'}</Text>
      </View>

      {step === 1 ? (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputWrapper, isEmailFocused && styles.inputWrapperFocused]}>
            <View style={styles.inputIcon}><UserIcon /></View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@matchtea.vn"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              blurOnSubmit={false}
            />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={[styles.errorText, { color: '#34A853' }]}>{successMessage}</Text> : null}
          
          <TouchableOpacity style={[styles.loginBtnWrap, { marginTop: 30 }]} onPress={handleRequestOtp} activeOpacity={0.9} disabled={isLoading}>
            <LinearGradient colors={['#8BA367', '#5D6D45']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginBtn}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginBtnText}>GỬI MÃ OTP</Text>
              )}
            </LinearGradient>
            <View style={styles.loginBtnGlow} />
          </TouchableOpacity>
        </View>
      ) : (
        isResetSuccess ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
            <Svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="10" stroke="#34A853" strokeWidth="2" />
              <Path d="M8 12L11 15L16 9" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ color: '#1B2A15', fontSize: 18, fontWeight: '700', marginTop: 20, textAlign: 'center' }}>
              Đổi mật khẩu thành công!
            </Text>
            <Text style={{ color: '#4A5D23', fontSize: 14, marginTop: 10, textAlign: 'center' }}>
              Bạn sẽ được chuyển về màn hình đăng nhập trong giây lát...
            </Text>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mã OTP</Text>
            <View style={[styles.inputWrapper, isOtpFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}><LockIcon /></View>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                onFocus={() => setOtpFocused(true)}
                onBlur={() => setOtpFocused(false)}
                blurOnSubmit={false}
              />
            </View>

            <View style={{ height: 20 }} />

            <Text style={styles.inputLabel}>Mật khẩu mới</Text>
            <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}><LockIcon /></View>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
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

            <View style={{ height: 20 }} />

            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
            <View style={[styles.inputWrapper, isConfirmPasswordFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}><LockIcon /></View>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                blurOnSubmit={false}
              />
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={[styles.errorText, { color: '#34A853' }]}>{successMessage}</Text> : null}

            <TouchableOpacity style={[styles.loginBtnWrap, { marginTop: 30 }]} onPress={handleResetPassword} activeOpacity={0.9} disabled={isLoading}>
              <LinearGradient colors={['#8BA367', '#5D6D45']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginBtn}>
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginBtnText}>ĐỔI MẬT KHẨU</Text>
                )}
              </LinearGradient>
              <View style={styles.loginBtnGlow} />
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default ForgotPassword;
