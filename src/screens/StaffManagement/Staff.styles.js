import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FAFAFA' },
    
    // Tab Bar
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
