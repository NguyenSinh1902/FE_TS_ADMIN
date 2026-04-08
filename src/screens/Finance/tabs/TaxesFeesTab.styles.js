import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    /* Search & Filter Row */
    searchRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, marginTop: 12, marginBottom: 12, gap: 10
    },
    searchInputWrapper: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', borderRadius: 12,
        paddingHorizontal: 12, height: 44,
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939', padding: 0 },
    filterBtn: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
        justifyContent: 'center', alignItems: 'center'
    },

    bodyScroll: { paddingBottom: 100 },

    /* Tax Tab Styles */
    taxGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' },
    taxCard: { 
        width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
        overflow: 'hidden', position: 'relative'
    },
    cardAccentTax: { height: 4, backgroundColor: '#6366F1' },
    taxCardContent: { padding: 16 },
    taxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    taxIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
    threeDots: { fontSize: 18, color: '#94A3B8', fontWeight: '900', marginTop: -4, padding: 4 },
    taxNameText: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
    taxValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    taxPercentText: { fontSize: 20, fontWeight: '900', color: '#6366F1' },
    defaultBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    defaultBadgeText: { fontSize: 10, fontWeight: '800', color: '#16A34A', textTransform: 'uppercase' },
    
    taxPopup: {
        position: 'absolute', top: 40, right: 10, width: 110,
        backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10, zIndex: 100
    },
    taxPopupItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    taxPopupText: { fontSize: 13, fontWeight: '600', color: '#475569' },

    fabBtn: {
        position: 'absolute', right: 20, bottom: 100,
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: '#8BA367', justifyContent: 'center', alignItems: 'center',
        shadowColor: '#8BA367', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 15, elevation: 12
    },
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, marginLeft: 4 },

    /* Modal Styles */
    modalOverlay: { 
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'flex-end'
    },
    modalContent: { 
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, 
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, elevation: 20, zIndex: 1000
    },
    modalHandle: { width: 45, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#1E2939' },

    /* Filter Popover */
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    filterPopupBox: {
        position: 'absolute', right: 16, width: 220,
        backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
        borderWidth: 1, borderColor: '#F1F5F9', zIndex: 2000
    },
    filterOption: { 
        paddingVertical: 12, paddingHorizontal: 16, 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' 
    },
    filterText: { fontSize: 13, color: '#4A5565' },
    filterTextSelected: { color: '#8BA367', fontWeight: '700' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#8BA367' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8BA367' },
    filterGroupTitle: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginLeft: 16, marginTop: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    
    formInput: {
        height: 48,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
        width: '100%'
    },
});
