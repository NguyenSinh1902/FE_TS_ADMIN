import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Login Card
  loginCard: {
    width: '85%',
    maxWidth: 450,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 28,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B2A15',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
    letterSpacing: 1.5,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B2A15',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    height: 56,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#4A5D23',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#1B2A15',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },

  // Button
  loginBtnWrap: {
    marginTop: 10,
    borderRadius: 16,
  },
  loginBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  loginBtnGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8BA367',
    borderRadius: 16,
    opacity: 0.3,
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    zIndex: -1,
  },

  // Footer
  forgotBtn: {
    marginTop: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotText: {
    color: '#1B2A15',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  footerContainer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#4A5D23',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
});
