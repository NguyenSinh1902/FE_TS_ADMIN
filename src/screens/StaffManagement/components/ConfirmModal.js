import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';

const ConfirmModal = ({ visible, title, message, onConfirm, onCancel, loading }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.modalBox, isTablet && styles.modalBoxTablet]}>
                    <Text style={styles.title}>{title || 'Xác nhận'}</Text>
                    <Text style={styles.message}>{message}</Text>
                    
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
                            <Text style={styles.cancelBtnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.confirmBtnText}>Xác nhận</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalBoxTablet: {
        width: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 10,
    },
    message: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    cancelBtnText: {
        color: '#64748B',
        fontWeight: '700',
        fontSize: 14,
    },
    confirmBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#EF4444', // Red for delete, can be parameterized if needed
    },
    confirmBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default ConfirmModal;
