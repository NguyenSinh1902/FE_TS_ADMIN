import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row', 
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
  frostyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },

  // --- LOGO & PORTAL AREA ---
  logoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  portalCircle: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(139, 163, 103, 0.4)', // Slightly more transparent
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  logoTextMain: {
    fontSize: 70,
    fontWeight: '900',
    color: '#F9E29C', 
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 2,
    includeFontPadding: false,
  },
  logoSubText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500', // Mảnh hơn
    letterSpacing: 4,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#8BA367',
    opacity: 0.2, // Giảm glow để tĩnh lặng hơn
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 15,
  },
  leavesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  // --- START SCREEN CONTENT ---
  startContent: {
    position: 'absolute',
    bottom: height * 0.08, // Moved down to avoid overlapping with portal
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  startSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 2,
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  startBtnWrap: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Rất mờ
  },
  startBtn: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  // --- RIGHT PANE (LOGIN) ---
  rightPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.5, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  loginCard: {
    width: '75%',
    maxWidth: 450,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    borderRadius: 28,
    padding: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1, 
    shadowRadius: 30,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700', 
    color: '#1B2A15',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Offset for back button to center title
    letterSpacing: 1.5,
  },
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
    backgroundColor: 'transparent', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 15,
    height: 56,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#4A5D23',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2, // Thicker border instead of shadow for focus
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
  loginBtnWrap: {
    marginTop: 20,
    borderRadius: 16,
    position: 'relative',
  },
  loginBtn: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  loginBtnGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8BA367',
    borderRadius: 16,
    zIndex: 1,
    opacity: 0.3,
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  forgotBtn: {
    marginTop: 15,
    alignItems: 'center',
    marginBottom: 30,
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
  }
});
