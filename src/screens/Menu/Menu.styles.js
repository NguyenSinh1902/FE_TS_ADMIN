import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    
    /* Tab Container */
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 4
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 16
    },
    tabButtonActive: {
        backgroundColor: 'white',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    tabText: { fontSize: 14, fontWeight: '700', color: '#6A7282' },
    tabTextActive: { color: '#10B981' },

    fabExtended: {
        position: 'absolute', bottom: 100, right: 16,
        backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 14,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
    },
    fabText: { color: 'white', fontWeight: '800', marginLeft: 8, fontSize: 14 },
});
