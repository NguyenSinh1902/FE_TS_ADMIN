import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // space for bottom nav
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  
  // -- Stat Card --
  statCard: {
    backgroundColor: '#FFFFFF', // Dùng màu trắng đặc để thẻ tách rạch ròi khỏi nền
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#8BA367", // Bóng Shadow ám màu xanh lá mạ của app cho sang trọng
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5, // Có thể an toàn bật lại elevation vì nền thẻ đã là màu đặc (solid)
    marginBottom: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    color: '#4A5565',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  statValue: {
    color: '#101828',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statPercent: {
    color: '#009966',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  statCompare: {
    color: '#6A7282',
    fontSize: 12,
  },
  iconBoxWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxGreen: {
    backgroundColor: 'rgba(0, 188, 125, 0.1)',
  },
  iconBoxBlue: {
    backgroundColor: 'rgba(43, 127, 255, 0.1)',
  },
  iconBoxPurple: {
    backgroundColor: 'rgba(173, 70, 255, 0.1)',
  },
  
  // -- AI Button --
  aiButtonWrap: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 16,
  },
  aiButtonGradient: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
  },
  aiText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },

  // -- Chart Card --
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: "#8BA367",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  segmentControl: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  segmentButton: {
    flex: 1,
    height: 36,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  segmentButtonActive: {
    backgroundColor: '#8BA367',
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  segmentText: {
    color: '#4A5565',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: 'white',
  },
  
  // -- Chart Implementation --
  chartArea: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 40,
    paddingBottom: 25,
    position: 'relative',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: 35,
  },
  gridLine: {
    position: 'absolute',
    left: 45,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  yAxisLabel: {
    color: '#6B7280',
    fontSize: 10,
  },
  chartBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  xAxisLabel: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 10,
  },
  barCol: {
    width: 25,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  
  // -- AI Modal --
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  modalHeader: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderTextContainer: {
    marginLeft: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 24,
    paddingTop: 16,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 16,
  },
  insightIconWrap: {
    width: 48,
    height: 60, // Fixed height to match Figma padding slightly
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  insightTitle: {
    color: '#1E2939',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightDesc: {
    color: '#4A5565',
    fontSize: 14,
    lineHeight: 22,
  },
  modalFooter: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  modalFooterText: {
    color: '#6A7282',
    fontSize: 12,
  }
});
