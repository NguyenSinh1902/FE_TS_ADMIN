import React, { useState, useEffect } from 'react';
import { 
    View, Text, Modal, TouchableOpacity, TextInput, 
    ScrollView, ActivityIndicator, Alert, Pressable, StyleSheet 
} from 'react-native';
import { CloseIcon } from '../StaffIcons';
import staffApi from '../../../api/staffApi';

const StaffFormModal = ({ visible, onClose, staff, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hoTen: '',
        gioiTinh: 'NAM',
        ngaySinh: '',
        soDienThoai: '',
        vaiTro: 'THU_NGAN'
    });

    useEffect(() => {
        if (staff) {
            setFormData({
                hoTen: staff.hoTen || '',
                gioiTinh: staff.gioiTinh === 'Nữ' ? 'NU' : 'NAM',
                ngaySinh: staff.ngaySinh || '',
                soDienThoai: staff.sdt || '',
                vaiTro: staff.rawRole || 'THU_NGAN'
            });
        }
    }, [staff]);

    const handleSave = async () => {
        if (!formData.hoTen || !formData.soDienThoai) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ họ tên và số điện thoại');
            return;
        }

        try {
            setLoading(true);
            
            // 1. Update Profile
            await staffApi.updateProfile(staff.id, {
                hoTen: formData.hoTen,
                gioiTinh: formData.gioiTinh,
                ngaySinh: formData.ngaySinh,
                soDienThoai: formData.soDienThoai
            });

            // 2. Update Role if changed
            if (formData.vaiTro !== staff.rawRole) {
                await staffApi.updateRole(staff.id, formData.vaiTro);
            }

            Alert.alert('Thành công', 'Đã cập nhật thông tin nhân viên');
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Update staff error:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin nhân viên');
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
                        <Text style={styles.title}>Chỉnh sửa nhân sự</Text>
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
                                placeholder="Nhập họ tên..."
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
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
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Ngày sinh</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={formData.ngaySinh} 
                                    onChangeText={(t) => setFormData({...formData, ngaySinh: t})}
                                    placeholder="YYYY-MM-DD"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.soDienThoai} 
                                onChangeText={(t) => setFormData({...formData, soDienThoai: t})}
                                keyboardType="phone-pad"
                                placeholder="Nhập SĐT..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vai trò công việc</Text>
                            <View style={styles.roleGrid}>
                                <TouchableOpacity 
                                    style={[styles.roleBtn, formData.vaiTro === 'THU_NGAN' && styles.roleBtnActive]}
                                    onPress={() => setFormData({...formData, vaiTro: 'THU_NGAN'})}
                                >
                                    <Text style={[styles.roleText, formData.vaiTro === 'THU_NGAN' && styles.roleTextActive]}>Thu ngân</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.roleBtn, formData.vaiTro === 'PHUC_VU' && styles.roleBtnActive]}
                                    onPress={() => setFormData({...formData, vaiTro: 'PHUC_VU'})}
                                >
                                    <Text style={[styles.roleText, formData.vaiTro === 'PHUC_VU' && styles.roleTextActive]}>Phục vụ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={{ height: 40 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
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
    row: { flexDirection: 'row' },
    genderRow: { flexDirection: 'row', gap: 10 },
    genderBtn: { 
        flex: 1, height: 52, borderRadius: 12, backgroundColor: '#F8FAFC', 
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' 
    },
    genderBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
    genderText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    genderTextActive: { color: '#3B82F6', fontWeight: '700' },
    roleGrid: { flexDirection: 'row', gap: 10 },
    roleBtn: { 
        flex: 1, height: 52, borderRadius: 12, backgroundColor: '#F8FAFC', 
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' 
    },
    roleBtnActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
    roleText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    roleTextActive: { color: '#059669', fontWeight: '700' },
    footer: { 
        flexDirection: 'row', padding: 24, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' 
    },
    cancelBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
    saveBtn: { flex: 2, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#10B981' },
    saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});

export default StaffFormModal;
