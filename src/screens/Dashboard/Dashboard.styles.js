import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  frostyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    flex: 1, // Add this to make them equal height
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    marginBottom: 16, // Default for mobile
  },
  statContent: {
    flex: 1,
    justifyContent: 'space-between', // Push content apart evenly
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
  aiWideButtonWrap: {
    marginTop: 12,
    borderRadius: 16,
    shadowColor: "#8BA367",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
    overflow: 'hidden',
  },
  aiWideButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  aiWideButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  // -- Chart Card --
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    color: '#1B2A15',
    fontSize: 10,
    marginTop: 10,
    fontWeight: '700',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalFooterText: {
    color: '#6A7282',
    fontSize: 12,
  },

  // -- Tablet Specific Styles --
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  tabletMain: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  decorativeBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#8BA367',
    opacity: 0.15,
    top: -50,
    right: -50,
  },
  decorativeBlob2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#FCD34D',
    opacity: 0.08,
    bottom: -100,
    left: '20%',
  },
  tabletContent: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  tabletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  tabletHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#101828',
  },
  tabletStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12,
  },
  tabletStatCardWrap: {
    width: '33.33%',
    paddingHorizontal: 12,
    marginBottom: 24, // Consistent 24px vertical gap
  },
  tabletChartRow: {
    flexDirection: 'row',
    marginHorizontal: -12,
  },
  tabletChartCol: {
    flex: 2.2,
    paddingHorizontal: 12,
  },
  tabletSideCols: {
    flex: 1.8,
    paddingHorizontal: 12,
    gap: 20,
  },
  aiFabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  tabletAIDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  }
});

