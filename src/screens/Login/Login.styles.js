import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shieldIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Add golden glow background
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  titleText: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '500',
    color: '#FFF8E7',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D4AF37',
    letterSpacing: 1.5,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF8E7',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotPasswordText: {
    color: '#D4AF37', // Vàng gold
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.6)', // Border màu gold rực
  },
  loginBtn: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  contactText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#D4AF37',
    fontSize: 12,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    textAlign: 'center',
  }
});
