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

    /* Category Card */
    catCard: {
        flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 16,
        marginBottom: 12, borderRadius: 16, padding: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
        alignItems: 'center', justifyContent: 'space-between'
    },
    catInfo: { flexDirection: 'row', alignItems: 'center' },
    catImageWrap: { width: 50, height: 50, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F3F4F6' },
    catImage: { width: '100%', height: '100%' },
    catName: { fontSize: 16, fontWeight: '700', color: '#1E2939', marginLeft: 12 },
    catCount: { fontSize: 13, color: '#9CA3AF', marginLeft: 12, marginTop: 2 },
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
    filterDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4, marginHorizontal: 16 },

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
    detailModalBox: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', height: '80%' },
    modalImage: { width: '100%', height: 240 },
    closeModalFloatBtn: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { padding: 24 },
    modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: '#1E2939' },
    systemBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 8 },
    systemText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },
    catCountText: { fontSize: 14, color: '#6B7280', marginVertical: 8 },
    warningBox: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginVertical: 12 },
    warningText: { fontSize: 13, color: '#B45309', lineHeight: 18 },
    catModalListContainer: { marginTop: 24, paddingBottom: 10 },
    catModalListTitle: { fontSize: 13, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: 12 },
    catModalProdItem: { 
        flexDirection: 'row', alignItems: 'center', marginBottom: 10,
        backgroundColor: '#F8FAFC', padding: 10, borderRadius: 12,
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    catModalProdImg: { width: 44, height: 44, borderRadius: 10 },
    catModalProdInfo: { marginLeft: 12, flex: 1 },
    catModalProdName: { fontSize: 14, fontWeight: '700', color: '#1E2939' },
    catModalProdPrice: { fontSize: 13, color: '#10B981', fontWeight: '600', marginTop: 1 },
    modalActionRow: { flexDirection: 'row', gap: 12 },
    modalActionBtnSquare: { flex: 1, height: 50, borderRadius: 14, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
    modalActionDangerSquare: { backgroundColor: '#FEF2F2' },

    fabExtended: {
        position: 'absolute', bottom: 100, right: 16,
        backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 14,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
    },
    fabText: { color: 'white', fontWeight: '800', marginLeft: 8, fontSize: 14 },
});
