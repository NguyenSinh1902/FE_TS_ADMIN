import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    heroImage: { width: width, height: height * 0.45, resizeMode: 'cover' },
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
    contentCard: {
        flex: 1, backgroundColor: '#FFFFFF',
        marginTop: -32, borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingHorizontal: 24, paddingTop: 32,
        shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1, shadowRadius: 20, elevation: 15,
    },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    title: { fontSize: 26, fontWeight: '800', color: '#1E2939', flex: 1, marginRight: 16 },
    price: { fontSize: 22, fontWeight: '700', color: '#10B981' },
    catTag: {
        alignSelf: 'flex-start', backgroundColor: 'rgba(139, 163, 103, 0.1)',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 24,
    },
    catText: { fontSize: 13, color: '#8BA367', fontWeight: '700' },
    descTitle: { fontSize: 18, fontWeight: '700', color: '#1E2939', marginBottom: 8 },
    descText: { fontSize: 15, color: '#4A5565', lineHeight: 24 },
    
    // Dropdown Pop-over Modal
    menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0)' },
    dropdownRect: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : (StatusBar.currentHeight || 30) + 60,
        right: 20,
        width: 170,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2, shadowRadius: 15, elevation: 10,
    },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
    dropdownText: { fontSize: 15, color: '#1E2939', marginLeft: 12, fontWeight: '500' },
    dropdownTextDelete: { color: '#EF4444' },
});
