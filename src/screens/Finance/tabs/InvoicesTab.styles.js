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

    /* Invoice List Styles */
    bodyScroll: { paddingBottom: 100 },
    sectionContainer: { marginBottom: 12 },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: '#F8FAFC', marginHorizontal: 16, borderRadius: 12,
        marginBottom: 8,
    },
    sectionLeft: { flexDirection: 'row', alignItems: 'center' },
    sectionTitle: { fontSize: 15, fontWeight: '800', color: '#475569' },
    badgeCount: {
        backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 2,
        borderRadius: 8, marginLeft: 8
    },
    badgeCountText: { fontSize: 11, fontWeight: '800', color: '#64748B' },

    /* Invoice Card - Premium Receipt Style */
    invoiceCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    cardAccent: { width: 6, height: '100%', position: 'absolute', left: 0, top: 0 },
    cardContent: { padding: 16, paddingLeft: 22 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    idRow: { flexDirection: 'row', alignItems: 'center' },
    idText: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
    idValue: { fontSize: 15, fontWeight: '900', color: '#1E2939', marginLeft: 4 },
    timeText: { fontSize: 12, color: '#94A3B8', marginLeft: 8, fontWeight: '600' },

    cardMiddle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 10 },
    typeIconWrapper: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    typeInfo: { marginLeft: 12 },
    typeLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    typeValue: { fontSize: 15, fontWeight: '900', color: '#334155', marginTop: 1 },

    dashedDivider: {
        width: '100%', height: 1, borderStyle: 'dashed', borderWidth: 1,
        borderColor: '#E2E8F0', marginVertical: 12, borderRadius: 1,
    },

    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paymentInfo: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10
    },
    paymentText: { fontSize: 12, color: '#64748B', marginLeft: 6, fontWeight: '700' },
    totalAmount: { fontSize: 18, fontWeight: '900', color: '#1E2939' },

    /* Status Tags */
    statusTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    statusTagText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },

    /* Detail Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '85%', width: '100%',
        elevation: 20, zIndex: 1000
    },
    modalHandle: { width: 45, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#1E2939' },

    billPaper: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
    billHeader: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 15, marginBottom: 15 },
    billInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    billInfoLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
    billInfoValue: { fontSize: 13, color: '#1E2939', fontWeight: '700' },
    itemListTitle: { fontSize: 14, fontWeight: '800', color: '#475569', marginBottom: 15, textTransform: 'uppercase' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    itemName: { fontSize: 14, fontWeight: '700', color: '#1E2939', flex: 1 },
    itemQty: { fontSize: 14, fontWeight: '600', color: '#64748B', marginHorizontal: 10 },
    itemPrice: { fontSize: 14, fontWeight: '800', color: '#1E2939' },
    itemToppings: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2, fontStyle: 'italic' },
    summarySection: { borderTopWidth: 2, borderTopColor: '#1E2939', paddingTop: 15, marginTop: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    summaryValue: { fontSize: 14, color: '#1E2939', fontWeight: '700' },
    mainTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    mainTotalLabel: { fontSize: 18, fontWeight: '900', color: '#1E2939' },
    mainTotalValue: { fontSize: 22, fontWeight: '900', color: '#8BA367' },

    /* Filter Popover */
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    filterPopupBox: {
        position: 'absolute', right: 20, width: 220,
        backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    filterOption: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    filterText: { fontSize: 13, color: '#4A5565' },
    filterTextSelected: { color: '#8BA367', fontWeight: '700' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#8BA367' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8BA367' },
    filterGroupTitle: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginLeft: 16, marginTop: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

    // Theme Colors
    statusProcessing: { backgroundColor: '#FFF7ED' },
    statusProcessingText: { color: '#C2410C' },
    statusSuccess: { backgroundColor: '#F0FDF4' },
    statusSuccessText: { color: '#166534' },
    statusWarning: { backgroundColor: '#FEF2F2' },
    statusWarningText: { color: '#991B1B' },
    statusNeutral: { backgroundColor: '#F8FAFC' },
    statusNeutralText: { color: '#64748B' },
});
