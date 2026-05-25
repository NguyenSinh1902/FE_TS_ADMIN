import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';

const ConfirmModal = ({ visible, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy', danger = true }) => {
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <View style={[styles.iconWrap, danger ? styles.iconDanger : styles.iconPrimary]}>
                        <Text style={{ fontSize: 32 }}>{danger ? '⚠️' : '❓'}</Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, danger ? styles.confirmBtnDanger : styles.confirmBtnPrimary]} onPress={onConfirm}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
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
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalBox: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconDanger: {
        backgroundColor: '#FEF2F2',
    },
    iconPrimary: {
        backgroundColor: '#F0FDF4',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    btn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F1F5F9',
    },
    cancelText: {
        color: '#64748B',
        fontWeight: '700',
        fontSize: 15,
    },
    confirmBtnDanger: {
        backgroundColor: '#EF4444',
    },
    confirmBtnPrimary: {
        backgroundColor: '#10B981',
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default ConfirmModal;
