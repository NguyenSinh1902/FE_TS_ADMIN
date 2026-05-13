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
        width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
        overflow: 'hidden', position: 'relative',
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    cardAccentTax: { height: 3, backgroundColor: '#6366F1' },
    taxCardContent: { padding: 12 },
    taxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    taxIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
    threeDots: { fontSize: 16, color: '#94A3B8', fontWeight: '900', marginTop: -4, padding: 4 },
    taxNameText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
    taxValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    taxPercentText: { fontSize: 18, fontWeight: '900', color: '#6366F1' },
    defaultBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    defaultBadgeText: { fontSize: 9, fontWeight: '800', color: '#16A34A', textTransform: 'uppercase' },
    
    taxPopup: {
        position: 'absolute', top: 35, right: 8, width: 100,
        backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 10, zIndex: 100
    },
    taxPopupItem: { paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    taxPopupText: { fontSize: 12, fontWeight: '600', color: '#475569' },

    fabBtn: {
        position: 'absolute', right: 20, bottom: 100,
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: '#8BA367', justifyContent: 'center', alignItems: 'center',
        shadowColor: '#8BA367', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 6, marginLeft: 2 },

    /* Modal Styles */
    modalOverlay: { 
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'flex-end'
    },
    modalContent: { 
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, 
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, elevation: 20, zIndex: 1000
    },
    modalHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: '#1E2939' },

    /* Filter Popover */
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    filterPopupBox: {
        position: 'absolute', right: 16, width: 200,
        backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 6,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 15, elevation: 15,
        borderWidth: 1, borderColor: '#F1F5F9', zIndex: 2000
    },
    filterOption: { 
        paddingVertical: 10, paddingHorizontal: 14, 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' 
    },
    filterText: { fontSize: 13, color: '#4A5565' },
    filterTextSelected: { color: '#8BA367', fontWeight: '700' },
    filterOuterCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#8BA367' },
    filterInnerCircle: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#8BA367' },
    filterGroupTitle: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginLeft: 14, marginTop: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    
    formInput: {
        height: 46,
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 14,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        width: '100%'
    },
});
