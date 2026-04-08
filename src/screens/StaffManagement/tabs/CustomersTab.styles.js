import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    cardSearchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    cardSearchInputWrap: { flex: 1, height: 44, backgroundColor: '#FFFFFF', borderRadius: 12, borderHorizontal: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    cardSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939' },
    cardFilterBtn: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },

    customerCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    custTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    custName: { fontSize: 18, fontWeight: '800', color: '#1E2939', marginBottom: 6 },
    custBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    custBadgeVang: { backgroundColor: '#FEF9C3' },
    custBadgeBac: { backgroundColor: '#F1F5F9' },
    custBadgeMoi: { backgroundColor: '#F0FDF4' },
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

    /* Detail Popup */
    custDetailPop: {
        backgroundColor: 'white', marginHorizontal: 20, borderRadius: 24,
        padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
        alignSelf: 'center', width: '90%', marginTop: '50%'
    },
    custDetailTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    custDetailTitle: { fontSize: 20, fontWeight: '800', color: '#1E2939' },
    custDetailInfoBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 20 },
    custDetailLabel: { fontSize: 14, color: '#64748B', marginBottom: 8 },
    custDetailVal: { fontWeight: '700', color: '#1E2939' },
    custDetailActions: { flexDirection: 'row', gap: 12 },
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
