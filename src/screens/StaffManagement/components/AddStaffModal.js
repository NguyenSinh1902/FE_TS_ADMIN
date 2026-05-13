import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput,
  ActivityIndicator, StyleSheet, useWindowDimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import authApi from '../../../api/authApi';
import staffApi from '../../../api/staffApi';

// ─── Icons ───────────────────────────────────────────────────────
const CloseIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const CheckIcon = ({ color = '#fff', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="20,6 9,17 4,12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="7" r="4" stroke="#8BA367" strokeWidth="2" />
  </Svg>
);

const MailIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    <Polyline points="22,6 12,13 2,6" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const LockIcon = ({ color = '#94A3B8' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const EyeIcon = ({ show }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    {show ? (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="12" cy="12" r="3" stroke="#94A3B8" strokeWidth="2" />
      </>
    ) : (
      <>
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <Path d="M1 1l22 22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </Svg>
);

// ─── Step Indicator ───────────────────────────────────────────────
const StepDot = ({ num, state }) => {
  const isDone = state === 'done';
  const isActive = state === 'active';
  return (
    <View style={[dot.circle, isDone && dot.done, isActive && dot.active]}>
      {isDone
        ? <CheckIcon size={12} color="#fff" />
        : <Text style={[dot.num, isActive && { color: '#fff' }]}>{num}</Text>
      }
    </View>
  );
};

const StepIndicator = ({ current }) => {
  const steps = ['Thông tin', 'Xác thực OTP', 'Hoàn tất'];
  const getState = (i) => {
    if (i + 1 < current) return 'done';
    if (i + 1 === current) return 'active';
    return 'idle';
  };
  return (
    <View style={dot.row}>
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <View style={dot.group}>
            <StepDot num={i + 1} state={getState(i)} />
            <Text style={[dot.label, getState(i) === 'active' && dot.labelActive]}>{label}</Text>
          </View>
          {i < steps.length - 1 && (
            <View style={[dot.line, getState(i) === 'done' && dot.lineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const dot = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  group: { alignItems: 'center', width: 72 },
  circle: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center',
  },
  active: { backgroundColor: '#8BA367', borderColor: '#8BA367' },
  done: { backgroundColor: '#10B981', borderColor: '#10B981' },
  num: { fontSize: 12, fontWeight: '700', color: '#CBD5E1' },
  label: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4, textAlign: 'center' },
  labelActive: { color: '#8BA367', fontWeight: '800' },
  line: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginTop: 13 },
  lineDone: { backgroundColor: '#10B981' },
});

// ─── Field Row (icon + label + input) ────────────────────────────
const Field = ({ icon, label, rightElement, ...inputProps }) => (
  <View style={f.wrap}>
    <Text style={f.label}>{label}</Text>
    <View style={f.inputRow}>
      <View style={f.iconWrap}>{icon}</View>
      <TextInput style={f.input} placeholderTextColor="#CBD5E1" {...inputProps} />
      {rightElement}
    </View>
  </View>
);

const f = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 5, marginLeft: 2 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 10,
    borderWidth: 1, borderColor: '#E2E8F0',
    height: 44, paddingHorizontal: 12,
  },
  iconWrap: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#1B2A15', padding: 0 },
});

// ─── Role Selector ───────────────────────────────────────────────
const ROLES = [
  { key: 'PHUC_VU', label: 'Phục vụ', emoji: '🍵' },
  { key: 'THU_NGAN', label: 'Thu ngân', emoji: '💰' },
];

// ─── Main Component ───────────────────────────────────────────────
export default function AddStaffModal({ visible, onClose, onSuccess }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [soDienThoai, setSoDienThoai] = useState('');
  const [vaiTro, setVaiTro] = useState('PHUC_VU');
  const [otp, setOtp] = useState('');
  const [createdId, setCreatedId] = useState(null);

  const reset = () => {
    setStep(1); setLoading(false); setError('');
    setHoTen(''); setEmail(''); setMatKhau('123456');
    setSoDienThoai(''); setVaiTro('PHUC_VU'); setOtp(''); setCreatedId(null);
  };

  const handleClose = () => { reset(); onClose(); };

  // Step 1
  const handleRegister = async () => {
    if (!hoTen.trim()) { setError('Vui lòng nhập họ tên'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Email không hợp lệ'); return; }
    if (!matKhau || matKhau.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    setError(''); setLoading(true);
    try {
      const res = await authApi.register({
        email: email.trim(), matKhau,
        hoTen: hoTen.trim(),
        soDienThoai: soDienThoai.trim() || null,
        vaiTro,
      });
      setCreatedId(res.idNhanVien);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Email đã tồn tại hoặc không thể tạo tài khoản');
    } finally { setLoading(false); }
  };

  // Step 2
  const handleVerify = async () => {
    if (otp.length < 4) { setError('Vui lòng nhập mã OTP từ email'); return; }
    setError(''); setLoading(true);
    try {
      await authApi.verifyRegister({ email: email.trim(), otp: otp.trim() });
      if (createdId) await staffApi.updateStatus(createdId, 'HOAT_DONG');
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn');
    } finally { setLoading(false); }
  };

  const handleDone = () => {
    onSuccess?.(`Đã thêm nhân viên ${hoTen} thành công!`);
    reset(); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

        <View style={[s.card, isTablet && s.cardTablet]}>
          {/* ── Header ── */}
          <View style={s.header}>
            <View style={s.headerTitle}>
              <View style={s.headerIcon}>
                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
                  <Circle cx="9" cy="7" r="4" stroke="#8BA367" strokeWidth="2" />
                  <Path d="M19 8v6M22 11h-6" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </View>
              <Text style={s.title}>Thêm nhân viên mới</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={s.closeBtn}><CloseIcon /></TouchableOpacity>
          </View>

          <View style={s.divider} />

          {/* ── Step Indicator ── */}
          <StepIndicator current={step} />

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <View>
              {isTablet ? (
                /* Tablet: 2-column layout */
                <>
                  <View style={s.row2col}>
                    <View style={{ flex: 1 }}>
                      <Field icon={<UserIcon />} label="Họ và tên *" placeholder="Nguyễn Văn A" value={hoTen} onChangeText={setHoTen} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Field icon={<PhoneIcon />} label="Số điện thoại" placeholder="0901234567" value={soDienThoai} onChangeText={setSoDienThoai} keyboardType="phone-pad" />
                    </View>
                  </View>
                  <View style={s.row2col}>
                    <View style={{ flex: 1 }}>
                      <Field icon={<MailIcon />} label="Email đăng nhập *" placeholder="nhanvien@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Field
                        icon={<LockIcon color="#8BA367" />}
                        label="Mật khẩu *"
                        placeholder="Tối thiểu 6 ký tự"
                        value={matKhau}
                        onChangeText={setMatKhau}
                        secureTextEntry={!showPass}
                        rightElement={
                          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                            <EyeIcon show={showPass} />
                          </TouchableOpacity>
                        }
                      />
                    </View>
                  </View>
                </>
              ) : (
                /* Mobile: single column */
                <>
                  <Field icon={<UserIcon />} label="Họ và tên *" placeholder="Nguyễn Văn A" value={hoTen} onChangeText={setHoTen} />
                  <Field icon={<MailIcon />} label="Email đăng nhập *" placeholder="nhanvien@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  <Field icon={<PhoneIcon />} label="Số điện thoại" placeholder="0901234567 (không bắt buộc)" value={soDienThoai} onChangeText={setSoDienThoai} keyboardType="phone-pad" />
                  <Field
                    icon={<LockIcon color="#8BA367" />}
                    label="Mật khẩu *"
                    placeholder="Tối thiểu 6 ký tự"
                    value={matKhau}
                    onChangeText={setMatKhau}
                    secureTextEntry={!showPass}
                    rightElement={
                      <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                        <EyeIcon show={showPass} />
                      </TouchableOpacity>
                    }
                  />
                </>
              )}


              {/* Chức vụ */}
              <Text style={f.label}>Chức vụ</Text>
              <View style={s.roleRow}>
                {ROLES.map(r => (
                  <TouchableOpacity
                    key={r.key}
                    style={[s.roleBtn, vaiTro === r.key && s.roleBtnActive]}
                    onPress={() => setVaiTro(r.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.roleEmoji}>{r.emoji}</Text>
                    <Text style={[s.roleBtnText, vaiTro === r.key && s.roleBtnTextActive]}>{r.label}</Text>
                    {vaiTro === r.key && (
                      <View style={s.roleCheck}><CheckIcon size={10} color="#fff" /></View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {error ? <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View> : null}

              <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={['#8BA367', '#6B8E4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.primaryBtnText}>Tạo tài khoản & gửi OTP →</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <View>
              <View style={s.mailBox}>
                <MailIcon />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.mailTitle}>OTP đã gửi tới</Text>
                  <Text style={s.mailEmail}>{email}</Text>
                </View>
              </View>

              <Text style={[f.label, { textAlign: 'center', marginBottom: 10 }]}>Nhập mã OTP</Text>
              <TextInput
                style={s.otpInput}
                placeholder="• • • • • •"
                placeholderTextColor="#CBD5E1"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
              <Text style={s.otpHint}>Sau xác thực, tài khoản sẽ được kích hoạt ngay lập tức</Text>

              {error ? <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View> : null}

              <TouchableOpacity onPress={handleVerify} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={['#8BA367', '#6B8E4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.primaryBtnText}>Xác thực & Kích hoạt ✓</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={s.backBtn} onPress={() => { setStep(1); setError(''); setOtp(''); }}>
                <Text style={s.backBtnText}>← Quay lại</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <View style={s.successRing}>
                <LinearGradient colors={['#10B981', '#059669']} style={s.successCircle}>
                  <CheckIcon size={32} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={s.successTitle}>Tạo thành công!</Text>
              <Text style={s.successSub}>
                <Text style={{ fontWeight: '800', color: '#1B2A15' }}>{hoTen}</Text>
                {' '}đã được thêm với vai trò{' '}
                <Text style={{ fontWeight: '800', color: '#8BA367' }}>
                  {ROLES.find(r => r.key === vaiTro)?.label}
                </Text>
                {'\n'}Tài khoản đã kích hoạt, nhân viên có thể đăng nhập ngay.
              </Text>
              <TouchableOpacity onPress={handleDone} activeOpacity={0.85} style={{ width: '100%', marginTop: 20 }}>
                <LinearGradient colors={['#8BA367', '#6B8E4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
                  <Text style={s.primaryBtnText}>Hoàn tất</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  card: {
    width: '100%', maxWidth: 480,
    backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15, shadowRadius: 40, elevation: 20,
  },
  cardTablet: { maxWidth: 580 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(139,163,103,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#1B2A15' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },

  row2col: { flexDirection: 'row', gap: 12 },

  passwordHint: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F8FAFC', borderRadius: 10,
    padding: 10, marginBottom: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  passwordHintText: { flex: 1, fontSize: 12, color: '#94A3B8', lineHeight: 18 },

  roleRow: { flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 18 },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC', position: 'relative',
  },
  roleBtnActive: { borderColor: '#8BA367', backgroundColor: '#F0FDF4' },
  roleEmoji: { fontSize: 16 },
  roleBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  roleBtnTextActive: { color: '#8BA367' },
  roleCheck: {
    position: 'absolute', top: -6, right: -6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#8BA367', justifyContent: 'center', alignItems: 'center',
  },

  errorBox: {
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#FCA5A5', marginBottom: 12,
  },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '600', textAlign: 'center' },

  primaryBtn: {
    height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  backBtn: { height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  backBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },

  mailBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(139,163,103,0.06)', borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(139,163,103,0.2)',
  },
  mailTitle: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  mailEmail: { fontSize: 14, fontWeight: '800', color: '#1B2A15', marginTop: 2 },

  otpInput: {
    height: 72, backgroundColor: '#F8FAFC', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    fontSize: 32, fontWeight: '900', color: '#1B2A15',
    letterSpacing: 12, textAlign: 'center',
    marginBottom: 10,
  },
  otpHint: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 20 },

  successRing: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(16,185,129,0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  successCircle: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#1B2A15', marginBottom: 10 },
  successSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
});
