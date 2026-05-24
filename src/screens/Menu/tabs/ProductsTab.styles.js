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
        backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, 
        borderRadius: 6, alignSelf: 'flex-start', marginVertical: 4,
        borderWidth: 0.5, borderColor: '#DCFCE7'
    },
    prodCatText: { fontSize: 11, color: '#166534', fontWeight: '800', textTransform: 'uppercase' },
    prodPrice: { fontSize: 14, fontWeight: '800', color: '#5E8D48' },
    prodActions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
    moreButton: { padding: 4 },

    /* Modals & Overlays */
    filterOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
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

    /* Detail Modal Styles (Premium) */
    detailModalOverlay: { 
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' 
    },
    detailModalBox: { 
        backgroundColor: '#FFFFFF', // Clean white
        borderRadius: 32, overflow: 'hidden', 
        width: '90%', height: '80%', // Fixed height to ensure children render
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10
    },
    detailModalTablet: { width: 550 },
    
    modalHero: { width: '100%', height: 280, position: 'relative' },
    modalImage: { width: '100%', height: '100%' },
    modalImageGradient: { 
        position: 'absolute', top: 0, left: 0, right: 0, height: 80,
        paddingTop: 16, paddingHorizontal: 16
    },
    closeModalFloatBtn: { 
        position: 'absolute', top: 16, right: 16, width: 38, height: 38, 
        borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.3)', 
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    modalScrollArea: { flex: 1 },
    modalContent: { padding: 28 },
    
    modalHeaderRow: { marginBottom: 20 },
    modalTitle: { fontSize: 26, fontWeight: '900', color: '#1B2A15', lineHeight: 32 },
    modalPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
    modalPriceLabel: { fontSize: 14, color: '#8BA367', fontWeight: '700', textTransform: 'uppercase', marginRight: 8 },
    modalPriceVal: { fontSize: 28, fontWeight: '900', color: '#5E8D48' },
    
    modalSecTitle: { 
        fontSize: 13, fontWeight: '800', color: '#8BA367', 
        marginTop: 24, marginBottom: 12, textTransform: 'uppercase', 
        letterSpacing: 1.5, borderBottomWidth: 1, borderBottomColor: '#F1F5E9',
        paddingBottom: 8
    },
    modalDescText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
    modalDescTextEmpty: { fontSize: 14, color: '#94A3B8', fontStyle: 'italic' },
    
    variantTable: { backgroundColor: 'rgba(139, 163, 103, 0.03)', borderRadius: 20, padding: 8 },
    variantItem: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(139, 163, 103, 0.05)'
    },
    variantItemLast: { borderBottomWidth: 0 },
    variantName: { fontSize: 15, color: '#1B2A15', fontWeight: '600' },
    
    discountBadge: {
        backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#FEE2E2',
    },
    discountText: { fontSize: 12, color: '#EF4444', fontWeight: '900' },
    variantVal: { fontSize: 16, color: '#1B2A15', fontWeight: '800' },

    modalFooter: { 
        flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 32 : 20,
        backgroundColor: 'rgba(255,255,255,0.8)', borderTopWidth: 1, borderTopColor: '#F1F5E9',
        gap: 12
    },
    btnModalAction: { 
        flex: 1, height: 56, borderRadius: 18, 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8
    },
    btnModalDelete: { backgroundColor: 'rgba(239, 68, 68, 0.08)' },
    btnModalDeleteText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
    btnModalEdit: { backgroundColor: '#5E8D48' },
    btnModalEditText: { color: 'white', fontWeight: '700', fontSize: 16 },


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
    /* --- Tablet Table Styles --- */
    tableTopBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, paddingHorizontal: 32
    },
    tableContainer: {
        flex: 1, // Add flex: 1 to fill space
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        marginHorizontal: 32,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05, shadowRadius: 20, 
        marginBottom: 32, // Adjusted margin
    },
    tableHeader: {
        flexDirection: 'row', 
        paddingVertical: 18, 
        backgroundColor: '#F1F5E9', // Soft Matcha tint for header
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    headerCell: { 
        fontSize: 12, 
        fontWeight: '800', 
        color: '#8BA367', // Matcha green
        textTransform: 'uppercase', 
        letterSpacing: 1.2,
    },
    tableRow: {
        flexDirection: 'row', 
        paddingVertical: 14, 
        alignItems: 'center', 
        paddingHorizontal: 20,
        borderBottomWidth: 0.5, // Very thin divider
        borderBottomColor: 'rgba(148, 163, 184, 0.15)', // Light blue-grey tint
    },
    rowCell: { fontSize: 15, color: '#1B2A15', fontWeight: '500' },
    prodIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F1F5F9' },
    statusToggle: {
        width: 40, height: 22, borderRadius: 11, backgroundColor: '#8BA367', 
        justifyContent: 'center', paddingHorizontal: 2
    },
    statusToggleOff: { backgroundColor: '#E2E8F0' },
    toggleCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'white' },
    toggleCircleActive: { alignSelf: 'flex-end' },

    /* Action Menu Styles (Tablet) */
    actionBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(139, 163, 103, 0.08)', justifyContent: 'center', alignItems: 'center' },
});
