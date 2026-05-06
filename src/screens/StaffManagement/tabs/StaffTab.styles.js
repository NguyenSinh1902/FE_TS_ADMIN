import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    tabletSplitLayout: { flexGrow: 1, paddingHorizontal: 32, paddingBottom: 32 },
    tabletMainCol: { flex: 1, width: '100%' },
    sectionCard: {
        marginBottom: 20,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center' },
    tableTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    tableTopRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center' },
    sectionIconBoxGreen: { backgroundColor: '#F0FDF4' },
    sectionTitleRow: { marginLeft: 12, flexDirection: 'row', alignItems: 'center', flex: 1 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E2939' },
    badgeRed: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
    badgeRedText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
    badgeGreen: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
    badgeGreenText: { color: '#10B981', fontSize: 12, fontWeight: '700' },

    nestedScrollWrap: { maxHeight: 350 },
    pendItemCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5 },
    pendTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
    staffBasicInfo: { flex: 1 },
    staffName: { fontSize: 16, fontWeight: '800', color: '#1E2939' },
    staffRole: { fontSize: 14, color: '#8BA367', marginTop: 2, fontWeight: '700' },
    staffEmail: { fontSize: 13, color: '#64748B', marginTop: 4 },
    dateCol: { alignItems: 'flex-end' },
    dateLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
    dateValue: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    pendActionRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
    btnAccept: { flex: 1, height: 38, borderRadius: 10, overflow: 'hidden' },
    btnAcceptGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    btnAcceptText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    btnReject: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },

    cardSearchInputWrap: { width: 260, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939' },
    cardFilterBtn: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    
    pendingActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5E8D48', height: 44, paddingHorizontal: 20, borderRadius: 22, gap: 10, shadowColor: '#5E8D48', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    pendingActionText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    pendingActionBadge: { backgroundColor: '#EF4444', minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, borderWidth: 2, borderColor: '#5E8D48' },
    pendingActionBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

    activeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    avatarWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarImg: { width: 44, height: 44, borderRadius: 22 },
    avatarInitials: { fontSize: 16, fontWeight: '700', color: '#8BA367' },
    activeDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
    inactiveDot: { backgroundColor: '#9CA3AF' },
    moreBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },

    // -- Table Styles --
    tableHeaderRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16 },
    thCell: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.7)' },
    tdCell: { fontSize: 14, color: '#4A5565' },
    tdCellBold: { fontSize: 15, fontWeight: '700', color: '#1E2939', flex: 1, marginLeft: 12 },
    
    // -- Pending Modal --
    pendingModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    pendingModalBox: { width: '80%', maxWidth: 600, backgroundColor: 'rgba(240, 253, 244, 0.95)', borderRadius: 28, padding: 24, maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
    pendingModalTitle: { fontSize: 22, fontWeight: '800', color: '#166534', marginBottom: 20, textAlign: 'center' },


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

    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    filterPopupBox: { position: 'absolute', right: 20, width: 220, backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
    filterGroupTitle: { fontSize: 13, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
    filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
    filterText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
    filterTextSelected: { color: '#10B981' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#10B981' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
});
