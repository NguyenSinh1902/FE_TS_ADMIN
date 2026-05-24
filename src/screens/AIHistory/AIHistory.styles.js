import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // -- Tablet Layout --
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeBlob1: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#8BA367', opacity: 0.1, top: -100, right: -100,
  },
  decorativeBlob2: {
    position: 'absolute', width: 500, height: 500, borderRadius: 250, backgroundColor: '#FCD34D', opacity: 0.05, bottom: -150, left: '15%',
  },
  decorativeBlob3: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#8BA367', opacity: 0.08, top: '40%', right: '20%',
  },
  frostyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabletMain: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    marginBottom: 24,
  },
  tabletHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B2A15',
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  badge: {
    position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444'
  },
  
  // -- Search Row --
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 32, marginBottom: 24, gap: 12
  },
  searchInputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 12, height: 44,
    borderWidth: 1, borderColor: '#E5E7EB',
    maxWidth: 400,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939', padding: 0 },
  filterButton: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
    justifyContent: 'center', alignItems: 'center'
  },

  content: {
    padding: isTablet ? 32 : 16,
    paddingBottom: 100,
  },
  listContainer: {
    paddingBottom: 100,
  },
  
  // -- History Cards --
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 163, 103, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2A15',
  },
  cardDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  
  // -- Insight Cards --
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  insightIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B2A15',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 14,
    color: '#4A5565',
    lineHeight: 20,
  },
  
  // -- Status & Empty --
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
  },
});
