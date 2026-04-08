import React, { useState, useEffect } from 'react';
import { 
    View, Text, Modal, TouchableOpacity, TextInput, 
    ScrollView, ActivityIndicator, Alert, Pressable, StyleSheet 
} from 'react-native';
import { CloseIcon } from '../StaffIcons';
import customerApi from '../../../api/customerApi';

const CustomerFormModal = ({ visible, onClose, customer, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        gioiTinh: 'NAM'
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                hoTen: customer.hoTen || '',
                soDienThoai: customer.sdt || '',
                gioiTinh: customer.gioiTinh || 'NAM'
            });
        } else {
            setFormData({
                hoTen: '',
                soDienThoai: '',
                gioiTinh: 'NAM'
            });
        }
    }, [customer, visible]);

    const handleSave = async () => {
        if (!formData.hoTen || !formData.soDienThoai) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ họ tên và số điện thoại');
            return;
        }

        try {
            setLoading(true);
            if (customer) {
                await customerApi.update(customer.id, formData);
                Alert.alert('Thành công', 'Đã cập nhật thông tin khách hàng');
            } else {
                await customerApi.create(formData);
                Alert.alert('Thành công', 'Đã thêm khách hàng mới');
            }
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Save customer error:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin khách hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.modalBox}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{customer ? 'Sửa khách hàng' : 'Thêm khách hàng'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <CloseIcon color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.hoTen} 
                                onChangeText={(t) => setFormData({...formData, hoTen: t})}
                                placeholder="Nhập họ tên khách..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.soDienThoai} 
                                onChangeText={(t) => setFormData({...formData, soDienThoai: t})}
                                keyboardType="phone-pad"
                                placeholder="Nhập số điện thoại..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Giới tính</Text>
                            <View style={styles.genderRow}>
                                <TouchableOpacity 
                                    style={[styles.genderBtn, formData.gioiTinh === 'NAM' && styles.genderBtnActive]}
                                    onPress={() => setFormData({...formData, gioiTinh: 'NAM'})}
                                >
                                    <Text style={[styles.genderText, formData.gioiTinh === 'NAM' && styles.genderTextActive]}>Nam</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.genderBtn, formData.gioiTinh === 'NU' && styles.genderBtnActive]}
                                    onPress={() => setFormData({...formData, gioiTinh: 'NU'})}
                                >
                                    <Text style={[styles.genderText, formData.gioiTinh === 'NU' && styles.genderTextActive]}>Nữ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={{ height: 40 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveBtnText}>Lưu thông tin</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalBox: { 
        backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, 
        maxHeight: '90%', paddingBottom: 20
    },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        padding: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
    },
    title: { fontSize: 18, fontWeight: '800', color: '#1E2939' },
    closeBtn: { padding: 4 },
    content: { padding: 24 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 },
    input: { 
        backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, 
        height: 52, color: '#1E2939', fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0' 
    },
    genderRow: { flexDirection: 'row', gap: 10 },
    genderBtn: { 
        flex: 1, height: 52, borderRadius: 12, backgroundColor: '#F8FAFC', 
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' 
    },
    genderBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
    genderText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    genderTextActive: { color: '#3B82F6', fontWeight: '700' },
    footer: { 
        flexDirection: 'row', padding: 24, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' 
    },
    cancelBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
    saveBtn: { flex: 2, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8BA367' },
    saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});

export default CustomerFormModal;
