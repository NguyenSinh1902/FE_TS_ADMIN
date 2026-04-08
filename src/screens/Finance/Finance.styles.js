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
});
