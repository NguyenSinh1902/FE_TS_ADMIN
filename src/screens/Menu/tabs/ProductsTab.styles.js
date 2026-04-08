import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    /* Search Row */
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
    filterButton: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
        justifyContent: 'center', alignItems: 'center'
    },

    listContainer: { paddingBottom: 100 },

    /* Product Card */
    prodCard: {
        flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 16,
        marginBottom: 12, borderRadius: 16, padding: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
        alignItems: 'center'
    },
    prodImage: { width: 70, height: 70, borderRadius: 12 },
    prodInfo: { flex: 1, marginLeft: 16 },
    prodName: { fontSize: 16, fontWeight: '700', color: '#1E2939' },
    prodCatTag: { 
        backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, 
        borderRadius: 6, alignSelf: 'flex-start', marginVertical: 4 
    },
    prodCatText: { fontSize: 11, color: '#6A7282', fontWeight: '600' },
    prodPrice: { fontSize: 14, fontWeight: '800', color: '#10B981' },
    prodActions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
    moreButton: { padding: 4 },

    /* Modals & Overlays */
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    filterPopupBox: {
        position: 'absolute', top: 180, right: 16, width: 220,
        backgroundColor: 'white', borderRadius: 16, paddingVertical: 8,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
    },
    filterOption: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    filterText: { fontSize: 14, color: '#4B5563' },
    filterTextSelected: { color: '#10B981', fontWeight: '700' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#10B981' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
    filterGroupTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginLeft: 16, marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },

    anchorOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
    anchorPopoverBox: {
        position: 'absolute', right: 40, width: 160,
        backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
    },
    anchorActionBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    anchorActionBtnNoBorder: { borderBottomWidth: 0 },
    anchorActionText: { fontSize: 14, fontWeight: '600', color: '#1E2939', marginLeft: 10 },
    anchorActionTextDanger: { color: '#EF4444' },

    detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    detailModalBox: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', maxHeight: '80%' },
    modalImage: { width: '100%', height: 240 },
    closeModalFloatBtn: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { padding: 24 },
    modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: '#1E2939' },
    modalPrice: { fontSize: 20, fontWeight: '800', color: '#10B981' },
    modalDescTitle: { fontSize: 14, fontWeight: '800', color: '#4B5563', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
    modalDescText: { fontSize: 15, color: '#6B7280', lineHeight: 22 },
    modalActionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
    modalActionBtnSquare: { flex: 1, height: 54, borderRadius: 16, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
    modalActionDangerSquare: { backgroundColor: '#FEF2F2' },

    fabExtended: {
        position: 'absolute', bottom: 100, right: 16,
        backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 14,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
    },
    fabText: { color: 'white', fontWeight: '800', marginLeft: 8, fontSize: 14 },

    /* Variants List in Modal */
    variantList: { marginTop: 8 },
    variantItem: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F6F8FA'
    },
    variantName: { fontSize: 15, color: '#4B5563', fontWeight: '500' },
    variantVal: { fontSize: 15, color: '#1E2939', fontWeight: '700' },
    discountBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
        borderWidth: 0.5,
        borderColor: '#FEE2E2',
    },
    discountText: {
        fontSize: 11,
        color: '#EF4444',
        fontWeight: '800',
    },
    toppingBadge: { 
        backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, 
        borderRadius: 8, borderWidth: 1, borderColor: '#D1FAE5',
        alignSelf: 'flex-start', marginBottom: 12
    },
    toppingText: { fontSize: 11, color: '#059669', fontWeight: '800', textTransform: 'uppercase' },
    variantSectionTitle: { fontSize: 14, fontWeight: '800', color: '#4B5563', marginTop: 20, marginBottom: 4, textTransform: 'uppercase' },
});
