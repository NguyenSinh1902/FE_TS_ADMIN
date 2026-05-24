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
    justifyContent: 'space-between',
  },
  segmentButton: {
    paddingHorizontal: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderTextContainer: {
    marginLeft: 12,
  },
  modalTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
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
    padding: 20,
    paddingTop: 14,
  },
  insightCard: {
    backgroundColor: '#FAFCF8',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(139, 163, 103, 0.15)',
    marginBottom: 12,
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
  },

  // -- Section 2 (Thống kê chi tiết) Tablet --
  section2Container: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginTop: 20,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  datePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  datePillText: {
    marginLeft: 8,
    color: '#1B2A15',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomRowContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  bottomColLeft: {
    flex: 5.5,
    flexDirection: 'column',
    gap: 20,
  },
  bottomColRight: {
    flex: 4.5,
    flexDirection: 'column',
  },
  microCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  microCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  microCardContent: {
    flex: 1,
  },
  microCardLabel: {
    fontSize: 13,
    color: '#4A5565',
    marginBottom: 8,
  },
  microCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B2A15',
  },
  decorativeLeaf: {
    position: 'absolute',
  },
  tabletStatCardWrapLeft: {
    width: '33.33%',
    paddingHorizontal: 8,
  },
  tabletStatCardWrapMiddle: {
    width: '33.33%',
    paddingHorizontal: 8,
  },
  tabletStatCardWrapRight: {
    width: '33.33%',
    paddingHorizontal: 8,
  },
  todayCardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  todayCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  todayCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  todayCardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
  },
  todayCardGrowth: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  todayCardCompare: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  innerChartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  innerCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  aiCapsuleBtn: {
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#8BA367',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  aiBtnGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCapsuleBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mobileSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B2A15',
    marginBottom: 16,
  },
  listRowItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  listRowRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5565',
    width: 24,
  },
  listRowName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2A15',
    marginRight: 12,
  },
  listRowQty: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  innerChartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: -18,
    marginBottom: -18,
    overflow: 'hidden',
  },
  innerCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2A15',
    marginBottom: 8,
  }
});

