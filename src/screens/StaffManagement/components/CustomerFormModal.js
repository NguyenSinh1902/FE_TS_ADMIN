import React, { useState, useEffect } from 'react';
import { 
    View, Text, Modal, TouchableOpacity, TextInput, 
    ScrollView, ActivityIndicator, Alert, Pressable, StyleSheet,
    useWindowDimensions, Platform
} from 'react-native';
import { CloseIcon } from '../StaffIcons';
import customerApi from '../../../api/customerApi';

const CustomerFormModal = ({ visible, onClose, customer, onSaveSuccess }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        gioiTinh: 'NAM'
    });
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setFieldErrors({});
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
        let errors = {};
        if (!formData.hoTen) errors.hoTen = 'Vui lòng nhập họ tên';
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            setLoading(true);
            setFieldErrors({});
            let message = '';
            if (customer) {
                await customerApi.update(customer.id, formData);
                message = 'Đã cập nhật thông tin khách hàng';
            } else {
                await customerApi.create(formData);
                message = 'Đã thêm khách hàng mới';
            }
            onSaveSuccess(message);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setFieldErrors({ general: error.response.data.message });
            } else {
                setFieldErrors({ general: 'Không thể lưu thông tin khách hàng' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.overlay, isTablet && styles.overlayCenter]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalBox, isTablet && styles.modalBoxTablet]}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{customer ? 'Cập nhật thông tin' : 'Thêm khách hàng mới'}</Text>
                            <Text style={styles.subtitle}>{customer ? 'Chỉnh sửa thông tin thành viên' : 'Đăng ký thành viên MatchTea'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <CloseIcon color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên khách hàng</Text>
                            <TextInput 
                                style={[styles.input, fieldErrors.hoTen && { borderColor: '#EF4444' }]} 
                                value={formData.hoTen} 
                                onChangeText={(t) => { setFormData({...formData, hoTen: t}); setFieldErrors(prev => ({...prev, hoTen: null})) }}
                                placeholder="Ví dụ: Nguyễn Văn A"
                                placeholderTextColor="#9CA3AF"
                            />
                            {fieldErrors.hoTen && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldErrors.hoTen}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại liên lạc</Text>
                            <TextInput 
                                style={[styles.input, fieldErrors.soDienThoai && { borderColor: '#EF4444' }]} 
                                value={formData.soDienThoai} 
                                onChangeText={(t) => { setFormData({...formData, soDienThoai: t}); setFieldErrors(prev => ({...prev, soDienThoai: null})) }}
                                keyboardType="phone-pad"
                                placeholder="09xx xxx xxx"
                                placeholderTextColor="#9CA3AF"
                            />
                            {fieldErrors.soDienThoai && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldErrors.soDienThoai}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Giới tính</Text>
                            <View style={styles.genderRow}>
                                <TouchableOpacity 
                                    style={[styles.genderBtn, formData.gender === 'NAM' && styles.genderBtnActive]}
                                    onPress={() => setFormData({...formData, gioiTinh: 'NAM'})}
                                >
                                    <View style={[styles.radioOuter, formData.gioiTinh === 'NAM' && styles.radioOuterActive]}>
                                        {formData.gioiTinh === 'NAM' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.genderText, formData.gioiTinh === 'NAM' && styles.genderTextActive]}>Nam</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.genderBtn, formData.gender === 'NU' && styles.genderBtnActive]}
                                    onPress={() => setFormData({...formData, gioiTinh: 'NU'})}
                                >
                                    <View style={[styles.radioOuter, formData.gioiTinh === 'NU' && styles.radioOuterActive]}>
                                        {formData.gioiTinh === 'NU' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.genderText, formData.gioiTinh === 'NU' && styles.genderTextActive]}>Nữ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {fieldErrors.general ? (
                            <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 15, marginBottom: 5, textAlign: 'center' }}>
                                {fieldErrors.general}
                            </Text>
                        ) : null}
                        
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Để sau</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveBtnText}>{customer ? 'Cập nhật ngay' : 'Hoàn tất đăng ký'}</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    overlayCenter: { justifyContent: 'center', alignItems: 'center' },
    modalBox: { 
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, 
        maxHeight: '90%', paddingBottom: Platform.OS === 'ios' ? 40 : 20
    },
    modalBoxTablet: {
        width: 460, borderRadius: 28, paddingBottom: 0, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 20
    },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', 
        padding: 24, paddingBottom: 20
    },
    title: { fontSize: 20, fontWeight: '800', color: '#1E2939', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
    closeBtn: { width: 36, height: 36, backgroundColor: '#F1F5F9', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    content: { paddingHorizontal: 24 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { 
        backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 18, 
        height: 56, color: '#1E2939', fontSize: 16, borderWidth: 1.5, borderColor: '#F1F5F9' 
    },
    genderRow: { flexDirection: 'row', gap: 12 },
    genderBtn: { 
        flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1.5, borderColor: '#F1F5F9' 
    },
    radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    radioOuterActive: { borderColor: '#8BA367' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8BA367' },
    genderText: { fontSize: 15, color: '#64748B', fontWeight: '600' },
    genderTextActive: { color: '#1E2939', fontWeight: '700' },
    footer: { 
        flexDirection: 'row', padding: 24, gap: 12, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#F1F5F9' 
    },
    cancelBtn: { flex: 1, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
    cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
    saveBtn: { flex: 1.8, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5E8D48', shadowColor: '#5E8D48', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});

export default CustomerFormModal;
