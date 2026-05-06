import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    tableTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    tableTopRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardSearchInputWrap: { width: 260, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939' },
    cardFilterBtn: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    
    addCustomerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5E8D48', height: 44, paddingHorizontal: 20, borderRadius: 22, gap: 10, shadowColor: '#5E8D48', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    addCustomerText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

    // -- Table Styles --
    tableHeaderRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16 },
    thCell: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.7)' },
    tdCell: { fontSize: 14, color: '#4A5565' },
    tdCellBold: { fontSize: 15, fontWeight: '700', color: '#1E2939', flex: 1, marginLeft: 12 },
    
    avatarWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarImg: { width: 44, height: 44, borderRadius: 22 },
    avatarInitials: { fontSize: 16, fontWeight: '700', color: '#8BA367' },
    moreBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },

    customerCard: { backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.7)' },
    custTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    custName: { fontSize: 18, fontWeight: '800', color: '#1E2939', marginBottom: 6 },
    custBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    custBadgeVang: { backgroundColor: 'rgba(254, 249, 195, 0.6)' },
    custBadgeBac: { backgroundColor: 'rgba(241, 245, 249, 0.6)' },
    custBadgeMoi: { backgroundColor: 'rgba(240, 253, 244, 0.6)' },
    custBadgeTextVang: { fontSize: 13, fontWeight: '800', color: '#CA8A04' },
    custBadgeTextBac: { fontSize: 13, fontWeight: '800', color: '#64748B' },
    custBadgeTextMoi: { fontSize: 13, fontWeight: '800', color: '#10B981' },
    custDateLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    custDateValue: { fontSize: 13, fontWeight: '700', color: '#64748B' },
    custMetricsRow: { flexDirection: 'row', gap: 12 },
    metricBoxBlue: { flex: 1, backgroundColor: '#EFF6FF', borderRadius: 16, padding: 12 },
    metricBoxGreen: { flex: 1, backgroundColor: '#F0FDF4', borderRadius: 16, padding: 12 },
    metricHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    metricLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    metricValueBlue: { fontSize: 18, fontWeight: '800', color: '#3B82F6' },
    metricValueGreen: { fontSize: 18, fontWeight: '800', color: '#10B981' },

    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    filterPopupBox: { position: 'absolute', right: 20, width: 220, backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
    filterGroupTitle: { fontSize: 13, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
    filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
    filterText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
    filterTextSelected: { color: '#10B981' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#10B981' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },

    // Modals
    anchorOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    anchorPopoverBox: { position: 'absolute', right: 20, backgroundColor: '#FFF', borderRadius: 16, width: 180, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, padding: 4 },
    anchorActionBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 10 },
    anchorActionText: { fontSize: 14, fontWeight: '600', color: '#1E2939' },

    detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    detailCardBox: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 28, width: '100%', maxWidth: 500, padding: 32, alignItems: 'center', paddingTop: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.15, shadowRadius: 30 },
    overlapAvatarWrap: { position: 'absolute', top: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1 },
    ovlAvatarImg: { width: '100%', height: '100%', borderRadius: 44 },
    detailCloseBtn: { position: 'absolute', top: 20, right: 20, width: 36, height: 36, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 18, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    detailTitle: { fontSize: 24, fontWeight: '800', color: '#1E2939', marginTop: 10 },
    detailRole: { fontSize: 16, color: '#8BA367', fontWeight: '700', marginBottom: 24 },
    detailGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    dataCell: { width: '45%' },
    dataLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
    dataValue: { fontSize: 15, fontWeight: '700', color: '#4A5565' },

    custDetailActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
    custDetailBtnEdit: { 
        flex: 1, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 
    },
    custDetailBtnTextEdit: { color: '#3B82F6', fontWeight: '700', fontSize: 14 },
    custDetailBtnDelete: { 
        flex: 1, height: 48, borderRadius: 12, backgroundColor: '#FEF2F2', 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 
    },
    custDetailBtnTextDelete: { color: '#EF4444', fontWeight: '700', fontSize: 14 },

    fabExtended: {
        position: 'absolute', bottom: 100, right: 16,
        backgroundColor: '#8BA367', paddingHorizontal: 20, paddingVertical: 14,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
    },
    fabText: { color: 'white', fontWeight: '800', marginLeft: 8, fontSize: 14 },
});
