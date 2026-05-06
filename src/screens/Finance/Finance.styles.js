import { StyleSheet } from 'react-native';

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

    /* Tablet Styles */
    tabletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 32,
        marginBottom: 24,
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
});
