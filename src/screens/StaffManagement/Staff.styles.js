import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FAFAFA' },
    
    // -- Tablet Layout --
    tabletContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FAFAFA',
    },
    decorativeBlob1: {
        position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#8BA367', opacity: 0.1, top: -100, right: -100,
    },
    decorativeBlob2: {
        position: 'absolute', width: 500, height: 500, borderRadius: 250, backgroundColor: '#FCD34D', opacity: 0.05, bottom: -150, left: '15%',
    },
    decorativeBlob3: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#8BA367', opacity: 0.08, top: '40%', right: '20%',
    },
    frostyOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    tabletMain: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    tabletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 32,
        marginBottom: 24,
    },
    greetingText: {
        fontSize: 16,
        color: '#6A7282',
        marginBottom: 4,
    },
    tabletHeaderTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1B2A15',
    },
    iconBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    badge: {
        position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444'
    },
    segmentedControl: {
        flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 30, padding: 4,
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.8)', marginRight: 8,
    },
    segmentBtn: {
        paddingVertical: 8, paddingHorizontal: 20, borderRadius: 24,
    },
    segmentBtnActive: {
        backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
    },
    segmentText: {
        fontSize: 14, fontWeight: '600', color: '#6A7282',
    },
    segmentTextActive: {
        color: '#8BA367',
    },

    // Mobile Tab Bar
    tabRow: {
        flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 16, marginBottom: 8,
        borderRadius: 16, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    tabBtn: {
        flex: 1, height: 44, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8
    },
    tabBtnActive: { backgroundColor: '#8BA367' },
    tabText: { fontSize: 13, fontWeight: '700', color: '#8BA367' },
    tabTextActive: { color: '#FFFFFF' },
});
