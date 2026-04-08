import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 cột

export default StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },

    /* Unified Tabs Style */
    tabRow: {
        flexDirection: 'row',
        marginVertical: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 4,
        marginHorizontal: 16,
    },
    tabBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 10, borderRadius: 16,
    },
    tabBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
    },
    tabText: { fontSize: 14, fontWeight: '600', color: '#6A7282', marginLeft: 8 },
    tabTextActive: { color: '#8BA367' },

    /* Search & Filter Row */
    searchRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, marginBottom: 12, gap: 10
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

    /* Legend (Chú thích màu) */
    legendRow: {
        flexDirection: 'row', justifyContent: 'center',
        paddingHorizontal: 16, marginBottom: 16, gap: 15
    },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 12, color: '#64748B', fontWeight: '500' },

    /* Grid Table Layout */
    bodyScroll: { paddingHorizontal: 16, paddingBottom: 150 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

    /* Ticket Card Style */
    ticketCard: {
        width: cardWidth,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    ticketTop: {
        height: 110,
        padding: 14,
        justifyContent: 'space-between',
        position: 'relative',
    },
    ticketTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ticketBottom: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    ticketBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Status Colors (Premium Muted Pastel)
    bgTrong: { backgroundColor: '#8BA367' }, // Keeping original for contrast with white dots, or slightly muted
    bgCoKhach: { backgroundColor: '#E9967A' }, // Pastel Coral
    bgDatTruoc: { backgroundColor: '#FBC02D' }, // Pastel Honey

    /* Subtle Pattern Layer */
    patternLayer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.15,
    },

    // Cutouts
    cutoutLeft: {
        position: 'absolute',
        left: -8, top: 92,
        width: 16, height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        zIndex: 5,
    },
    cutoutRight: {
        position: 'absolute',
        right: -8, top: 92,
        width: 16, height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        zIndex: 5,
    },

    statusCircleWrap: {
        width: 38, height: 38,
        borderRadius: 19,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center', alignItems: 'center',
        zIndex: 10,
    },

    /* Inline Status Label on Top Colored Section */
    statusBadgeInline: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF' },

    /* Time Badge on White Footer */
    timeBadgeBottom: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F4F7F1', // Soft Matcha tint for footer
        paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 12,
    },
    timeTextBottom: { fontSize: 12, fontWeight: '800', color: '#6B8743', marginLeft: 4 },

    tableName: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', zIndex: 10 },
    tableSeats: { fontSize: 13, color: '#64748B', fontWeight: '800' },
    tableStatusText: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },

    /* More Action Button (⋮) */
    moreBtnTicket: { padding: 4, zIndex: 10 },

    /* Chairs (Ghế nhỏ xung quanh) */
    seatDot: {
        position: 'absolute',
        width: 10, height: 10, borderRadius: 3,
        backgroundColor: '#D1D5DB', // Mặc định xám nhẹ
    },
    seatActiveTrong: { backgroundColor: '#10B981' },
    seatActiveCoKhach: { backgroundColor: '#EF4444' },
    seatActiveDatTruoc: { backgroundColor: '#F59E0B' },

    /* Filter Popover */
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    filterPopupBox: {
        position: 'absolute', right: 20, width: 220,
        backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
    },
    filterOption: {
        paddingVertical: 12, paddingHorizontal: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    filterText: { fontSize: 13, color: '#4A5565' },
    filterTextSelected: { color: '#8BA367', fontWeight: '700' },
    filterOuterCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    filterOuterSelected: { borderColor: '#8BA367' },
    filterInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8BA367' },
    filterGroupTitle: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginLeft: 16, marginTop: 8, marginBottom: 4, textTransform: 'uppercase' },

    /* Inline Detail Modal */
    detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    detailCard: {
        width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28,
        padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3, shadowRadius: 25, elevation: 20,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: '#1E2939' },
    closeBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },

    infoRow: { marginBottom: 16 },
    infoLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 4, fontWeight: '500' },
    infoValue: { fontSize: 16, color: '#1E2939', fontWeight: '700' },

    reservationSection: {
        marginTop: 10, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9'
    },
    resTitle: { fontSize: 18, fontWeight: '800', color: '#1E2939', marginBottom: 16 },
    resGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    resItem: { width: '48%', marginBottom: 16 },

    emptyState: { alignItems: 'center', marginTop: 10 },
    emptyText: { fontSize: 15, color: '#94A3B8', marginBottom: 20 },
    createBtn: {
        backgroundColor: '#8BA367', paddingVertical: 14, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'
    },
    createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },

    /* Anchor Menu (Sửa/Xóa) */
    anchorOverlay: { flex: 1, backgroundColor: 'transparent' },
    anchorBox: {
        position: 'absolute', width: 140, backgroundColor: '#FFFFFF',
        borderRadius: 16, paddingVertical: 4, elevation: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
    },
    anchorItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    anchorText: { fontSize: 14, color: '#1E2939', fontWeight: '600', marginLeft: 10 },

    badge: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12
    },
    badgeText: { fontSize: 12, fontWeight: '800' },

    /* Floating Action Button (FAB) - Premium Slate/Ebony Redesign */
    fabBtn: {
        position: 'absolute',
        bottom: 110, right: 20,
        height: 56,
        paddingHorizontal: 22,
        borderRadius: 28,
        backgroundColor: '#1E2939', // Premium Slate/Dark Gray
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35, shadowRadius: 15, elevation: 12,
        zIndex: 100,
    },
    fabText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        marginLeft: 10,
    },

    /* Form Modal Styles */
    formCard: {
        width: '90%', backgroundColor: '#FFFFFF', borderRadius: 28,
        padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3, shadowRadius: 25, elevation: 20,
    },
    inputGroup: { marginBottom: 20 },
    inputTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' },
    textInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1E2939',
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    actionBtnRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
    saveBtn: {
        flex: 2, backgroundColor: '#8BA367',
        paddingVertical: 14, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center'
    },
    saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    cancelBtn: {
        flex: 1, backgroundColor: '#F3F4F6',
        paddingVertical: 14, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center'
    },
    cancelBtnText: { color: '#64748B', fontSize: 16, fontWeight: '600' },

    /* Promotion Coupon Card Styles */
    promoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginBottom: 20,
        height: 120,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1, shadowRadius: 15, elevation: 6,
    },
    couponLeft: {
        width: 50,
        backgroundColor: '#6366F1', // Premium Violet/Indigo
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    verticalText: {
        transform: [{ rotate: '-90deg' }],
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        width: 100,
        textAlign: 'center',
    },
    couponCutout: {
        position: 'absolute',
        left: -10, top: 50,
        width: 20, height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    couponRight: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        position: 'relative',
    },
    promoValueLarge: { fontSize: 13, color: '#6366F1', fontWeight: '800', marginBottom: 2 },
    promoCodeStylized: { fontSize: 22, fontWeight: '900', color: '#1E2939', letterSpacing: 0.5 },

    promoTypeBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 6, alignSelf: 'flex-start',
        marginTop: 6,
    },
    promoTypeText: { fontSize: 10, fontWeight: '800', color: '#4F46E5', textTransform: 'uppercase' },

    promoDetailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    promoDetailText: { fontSize: 12, color: '#94A3B8', marginLeft: 6, fontWeight: '600' },

    moreBtnPromo: {
        position: 'absolute', top: 10, right: 10, padding: 8
    },

    /* Status Toggle Toggle */
    promoStatusBtn: {
        position: 'absolute', bottom: 10, right: 10, padding: 8,
        borderRadius: 10, backgroundColor: '#F8FAFC',
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    statusIndicator: {
        width: 10, height: 10, borderRadius: 5,
    },

    /* Toggle Switch Row */
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 15
    },
    switchLabel: { fontSize: 14, fontWeight: '700', color: '#475569' },
});
