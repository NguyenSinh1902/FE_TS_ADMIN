import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(27, 42, 21, 0.4)', // Darker Matcha tint
        justifyContent: 'flex-end',
    },
    overlayTablet: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        height: '92%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 8,
    },
    sheetTablet: {
        width: 550, // Slightly wider for elegance
        height: '80%', 
        borderRadius: 32,
        paddingTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
    dragIndicator: {
        width: 40, height: 5, borderRadius: 3,
        backgroundColor: '#E2E8F0',
        alignSelf: 'center', marginBottom: 12,
    },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1B2A15', letterSpacing: -0.5 },
    closeBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
    
    // Form Elements
    sectionTitle: { 
        fontSize: 13, fontWeight: '800', color: '#8BA367', 
        textTransform: 'uppercase', letterSpacing: 1.5, 
        marginTop: 32, marginBottom: 16,
        borderBottomWidth: 1, borderBottomColor: '#F1F5E9', paddingBottom: 8
    },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', color: '#1B2A15', marginBottom: 8 },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5, borderColor: '#F1F5F9',
        borderRadius: 18, paddingHorizontal: 16,
        height: 54, color: '#1E2939', fontSize: 15, fontWeight: '600'
    },
    textArea: {
        height: 100, paddingVertical: 12, textAlignVertical: 'top'
    },
    inputError: { borderColor: '#FECACA', backgroundColor: '#FFFDFD' },
    
    // Image Preview
    imagePreviewBox: {
        width: '100%', height: 180, borderRadius: 28,
        backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20, overflow: 'hidden',
        borderWidth: 2, borderColor: '#F1F5F9', borderStyle: 'dashed'
    },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    imageText: { color: '#94A3B8', marginTop: 8, fontWeight: '600', fontSize: 13 },
    
    // Switch
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20, backgroundColor: 'rgba(139, 163, 103, 0.05)', borderRadius: 20, marginTop: 12
    },
    
    // Dynamic Variants List
    variantCard: {
        backgroundColor: '#FFFFFF', borderRadius: 28,
        padding: 20, marginBottom: 20,
        borderWidth: 1, borderColor: '#F1F5E9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
    },
    variantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    variantTitle: { fontSize: 15, fontWeight: '800', color: '#1B2A15' },
    variantRow: { flexDirection: 'row', gap: 12 },
    variantCol: { flex: 1 },
    variantActionBtn: {
        width: 38, height: 38, borderRadius: 12, backgroundColor: '#FEF2F2',
        justifyContent: 'center', alignItems: 'center'
    },
    addVariantBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 18, borderRadius: 20,
        backgroundColor: 'rgba(139, 163, 103, 0.08)', borderWidth: 1.5, borderColor: 'rgba(139, 163, 103, 0.2)',
        marginBottom: 24,
    },
    addVariantText: { color: '#5E8D48', fontWeight: '800', marginLeft: 10, fontSize: 15 },

    // Footer Actions
    footerActionRow: {
        flexDirection: 'row', gap: 12, marginTop: 12, paddingBottom: 24, paddingHorizontal: 0
    },
    btnBase: {
        flex: 1, height: 58, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
    },
    btnCancel: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
    btnCancelText: { color: '#94A3B8', fontWeight: '800', fontSize: 16 },
    btnSave: { 
        backgroundColor: '#5E8D48',
        shadowColor: '#5E8D48', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 5
    },
    btnSaveText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },

    // Category Picker Tags
    categoryPickerRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    catTag: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    catTagSelected: {
        backgroundColor: '#5E8D48',
        borderColor: '#5E8D48',
    },
    catTagText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
    },
    catTagTextSelected: {
        color: '#FFFFFF',
    }
});

