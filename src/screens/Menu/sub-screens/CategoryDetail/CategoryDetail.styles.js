import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    heroImage: { width: width, height: height * 0.35, resizeMode: 'cover' },
    headerAbsolute: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
        zIndex: 10,
    },
    iconBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center', alignItems: 'center',
    },
    contentWrapper: {
        flex: 1, backgroundColor: '#F3F4F6',
        marginTop: -32, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingHorizontal: 24, paddingVertical: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 10, elevation: 5,
        marginBottom: 16,
    },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    title: { fontSize: 24, fontWeight: '800', color: '#1E2939', flex: 1 },
    systemBadge: {
        alignSelf: 'flex-start', backgroundColor: '#FEF2F2',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
        borderWidth: 1, borderColor: '#FECACA'
    },
    systemText: { fontSize: 12, color: '#DC2626', fontWeight: '700' },
    countText: { fontSize: 15, color: '#6A7282', marginTop: 8 },
    warningBox: {
        marginTop: 16, backgroundColor: '#FFFBEB',
        padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7',
    },
    warningText: { fontSize: 13, color: '#D97706', lineHeight: 20 },
    
    // Product List Reused
    listContainer: { paddingHorizontal: 16, paddingBottom: 40 },
    listTitle: { fontSize: 18, fontWeight: '700', color: '#1E2939', marginBottom: 16, marginLeft: 8 },
    prodCard: {
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, marginBottom: 16,
        flexDirection: 'row', alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    prodImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F3F4F6' },
    prodInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
    prodName: { fontSize: 15, fontWeight: '700', color: '#1E2939', marginBottom: 6 },
    prodPrice: { fontSize: 14, fontWeight: '700', color: '#10B981' },
});
