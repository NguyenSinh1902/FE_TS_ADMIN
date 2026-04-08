import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        height: '92%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 8, // For the drag indicator
    },
    dragIndicator: {
        width: 40, height: 5, borderRadius: 3,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center', marginBottom: 12,
    },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 16,
    },
    title: { fontSize: 20, fontWeight: '800', color: '#1E2939' },
    closeBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
    },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    
    // Form Elements
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E2939', marginTop: 24, marginBottom: 12 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#4A5565', marginBottom: 8 },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 12, paddingHorizontal: 16,
        height: 48, color: '#1E2939', fontSize: 15,
    },
    inputError: { borderColor: '#EF4444' },
    
    // Image Preview
    imagePreviewBox: {
        width: '100%', height: 160, borderRadius: 16,
        backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16, overflow: 'hidden',
        borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed'
    },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    imageText: { color: '#9CA3AF', marginTop: 8, fontWeight: '500' },
    
    // Switch
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: 8
    },
    
    // Dynamic Variants List
    variantCard: {
        backgroundColor: '#F9FAFB', borderRadius: 16,
        padding: 16, marginBottom: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    variantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    variantTitle: { fontSize: 15, fontWeight: '700', color: '#1E2939' },
    variantRow: { flexDirection: 'row', gap: 12 }, // Horizontal inputs side by side
    variantCol: { flex: 1 },
    variantActionBtn: {
        width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF2F2',
        justifyContent: 'center', alignItems: 'center'
    },
    addVariantBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, borderRadius: 12,
        backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
        marginBottom: 20,
    },
    addVariantText: { color: '#15803D', fontWeight: '600', marginLeft: 8 },

    // Footer Actions
    footerActionRow: {
        flexDirection: 'row', gap: 12, marginTop: 24, paddingBottom: 24,
    },
    btnBase: {
        flex: 1, height: 52, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    btnCancel: { backgroundColor: '#F3F4F6' },
    btnCancelText: { color: '#4A5565', fontWeight: '700', fontSize: 16 },
    btnSave: { 
        backgroundColor: '#8BA367',
        shadowColor: '#8BA367', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
    },
    btnSaveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

    // Category Picker Tags
    categoryPickerRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    catTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    catTagSelected: {
        backgroundColor: '#8BA367',
        borderColor: '#8BA367',
    },
    catTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    catTagTextSelected: {
        color: '#FFFFFF',
    }
});
