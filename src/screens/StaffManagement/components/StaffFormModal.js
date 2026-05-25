import React, { useState, useEffect } from 'react';
import { 
    View, Text, Modal, TouchableOpacity, TextInput, 
    ScrollView, ActivityIndicator, Alert, Pressable, StyleSheet,
    useWindowDimensions, Platform, Image
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { CloseIcon, PlusIcon, EditIcon } from '../StaffIcons';
import staffApi from '../../../api/staffApi';

const StaffFormModal = ({ visible, onClose, staff, onSaveSuccess }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [loading, setLoading] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        hoTen: '',
        gioiTinh: 'NAM',
        ngaySinh: '',
        soDienThoai: '',
        vaiTro: 'THU_NGAN'
    });
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setFieldErrors({});
        if (staff) {
            setFormData({
                hoTen: staff.hoTen || '',
                gioiTinh: staff.gioiTinh === 'Nữ' ? 'NU' : 'NAM',
                ngaySinh: staff.ngaySinh || '',
                soDienThoai: staff.sdt || '',
                vaiTro: staff.rawRole || 'THU_NGAN'
            });
            setSelectedImage(null); // Reset image when switching staff
        }
    }, [staff, visible]);

    const handlePickImage = () => {
        try {
            const options = {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 1000,
                maxWidth: 1000,
            };

            launchImageLibrary(options, (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    setFieldErrors({ general: 'Không thể chọn ảnh' });
                    return;
                }
                const asset = response.assets[0];
                setSelectedImage(asset);
            });
        } catch (err) {
            setFieldErrors({ general: 'Chức năng chọn ảnh chưa sẵn sàng. Hãy build lại ứng dụng.' });
        }
    };

    const handleSave = async () => {
        let errors = {};
        if (!formData.hoTen) errors.hoTen = 'Vui lòng nhập họ tên';
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            setLoading(true);
            
            // Prepare FormData according to new API spec
            const data = new FormData();
            
            // Create the request JSON part
            const requestJson = JSON.stringify({
                hoTen: formData.hoTen,
                gioiTinh: formData.gioiTinh,
                ngaySinh: (formData.ngaySinh && formData.ngaySinh !== 'N/A') ? formData.ngaySinh : null,
                soDienThoai: formData.soDienThoai ? formData.soDienThoai : null
            });

            // In React Native (Android), FormData supports appending a part
            // with explicit content-type using the { string, type } object format.
            // This makes Spring Boot's @RequestPart("request") recognise it as JSON.
            data.append('request', {
                string: requestJson,
                type: 'application/json',
            });

            if (selectedImage) {
                data.append('file', {
                    uri: Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
                    type: selectedImage.type || 'image/jpeg',
                    name: selectedImage.fileName || 'avatar.jpg',
                });
            }

            await staffApi.updateProfile(staff.id, data);

            if (formData.vaiTro !== staff.rawRole) {
                await staffApi.updateRole(staff.id, formData.vaiTro);
            }

            onSaveSuccess('Đã cập nhật thông tin nhân viên');
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setFieldErrors({ general: error.response.data.message });
            } else {
                setFieldErrors({ general: 'Không thể lưu thông tin nhân viên.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const getValidDate = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return new Date(new Date().setFullYear(new Date().getFullYear() - 20));
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? new Date(new Date().setFullYear(new Date().getFullYear() - 20)) : d;
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true}>
            <View style={[styles.overlay, isTablet && styles.overlayCenter]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalBox, isTablet && styles.modalBoxTablet]}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Hồ sơ nhân viên</Text>
                            <Text style={styles.subtitle}>Chỉnh sửa thông tin nhân sự hệ thống</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <CloseIcon color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Avatar Upload Section */}
                        <View style={styles.avatarPickerSection}>
                            <TouchableOpacity style={styles.avatarCircle} onPress={handlePickImage} activeOpacity={0.8}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage.uri }} style={styles.pickedAvatar} />
                                ) : (
                                    staff?.img ? (
                                        <Image source={{ uri: staff.img }} style={styles.pickedAvatar} />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <PlusIcon color="#64748B" width={24} height={24} />
                                        </View>
                                    )
                                )}
                                <View style={styles.editBadge}>
                                    <EditIcon color="#FFF" size={14} />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.avatarHint}>Chạm để thay đổi ảnh đại diện</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên</Text>
                            <TextInput 
                                style={[styles.input, fieldErrors.hoTen && { borderColor: '#EF4444' }]} 
                                value={formData.hoTen} 
                                onChangeText={(t) => { setFormData({...formData, hoTen: t}); setFieldErrors(prev => ({...prev, hoTen: null})) }}
                                placeholder="Nhập họ tên..."
                                placeholderTextColor="#9CA3AF"
                            />
                            {fieldErrors.hoTen && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldErrors.hoTen}</Text>}
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={styles.label}>Giới tính</Text>
                                <View style={styles.genderRow}>
                                    <TouchableOpacity 
                                        style={[styles.genderBtn, formData.gioiTinh === 'NAM' && styles.genderBtnActive]}
                                        onPress={() => setFormData({...formData, gioiTinh: 'NAM'})}
                                    >
                                        <View style={[styles.radioOuter, formData.gioiTinh === 'NAM' && styles.radioOuterActive]}>
                                            {formData.gioiTinh === 'NAM' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={[styles.genderText, formData.gioiTinh === 'NAM' && styles.genderTextActive]}>Nam</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.genderBtn, formData.gioiTinh === 'NU' && styles.genderBtnActive]}
                                        onPress={() => setFormData({...formData, gioiTinh: 'NU'})}
                                    >
                                        <View style={[styles.radioOuter, formData.gioiTinh === 'NU' && styles.radioOuterActive]}>
                                            {formData.gioiTinh === 'NU' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={[styles.genderText, formData.gioiTinh === 'NU' && styles.genderTextActive]}>Nữ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Ngày sinh</Text>
                                <TouchableOpacity 
                                    style={[styles.input, { justifyContent: 'center' }]} 
                                    onPress={() => setOpenPicker(true)}
                                >
                                    <Text style={{ fontSize: 16, color: (formData.ngaySinh && formData.ngaySinh !== 'N/A') ? '#1E2939' : '#9CA3AF' }}>
                                        {(!formData.ngaySinh || formData.ngaySinh === 'N/A') ? 'Chọn ngày sinh' : formData.ngaySinh}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <DatePicker
                            modal
                            mode="date"
                            open={openPicker}
                            date={getValidDate(formData.ngaySinh)}
                            onConfirm={(date) => {
                                setOpenPicker(false);
                                setFormData({ ...formData, ngaySinh: formatDate(date) });
                            }}
                            onCancel={() => setOpenPicker(false)}
                            title="Chọn ngày sinh"
                            confirmText="Xác nhận"
                            cancelText="Hủy"
                        />

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại liên lạc</Text>
                            <TextInput 
                                style={[styles.input, fieldErrors.soDienThoai && { borderColor: '#EF4444' }]} 
                                value={formData.soDienThoai} 
                                onChangeText={(t) => { setFormData({...formData, soDienThoai: t}); setFieldErrors(prev => ({...prev, soDienThoai: null})) }}
                                keyboardType="phone-pad"
                                placeholder="Nhập số điện thoại..."
                                placeholderTextColor="#9CA3AF"
                            />
                            {fieldErrors.soDienThoai && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldErrors.soDienThoai}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vai trò công việc</Text>
                            <View style={styles.roleGrid}>
                                <TouchableOpacity 
                                    style={[styles.roleBtn, formData.vaiTro === 'THU_NGAN' && styles.roleBtnActive]}
                                    onPress={() => setFormData({...formData, vaiTro: 'THU_NGAN'})}
                                >
                                    <View style={[styles.radioOuter, formData.vaiTro === 'THU_NGAN' && styles.radioOuterActive]}>
                                        {formData.vaiTro === 'THU_NGAN' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.roleText, formData.vaiTro === 'THU_NGAN' && styles.roleTextActive]}>Thu ngân</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.roleBtn, formData.vaiTro === 'PHUC_VU' && styles.roleBtnActive]}
                                    onPress={() => setFormData({...formData, vaiTro: 'PHUC_VU'})}
                                >
                                    <View style={[styles.radioOuter, formData.vaiTro === 'PHUC_VU' && styles.radioOuterActive]}>
                                        {formData.vaiTro === 'PHUC_VU' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.roleText, formData.vaiTro === 'PHUC_VU' && styles.roleTextActive]}>Phục vụ</Text>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    overlayCenter: { justifyContent: 'center', alignItems: 'center' },
    modalBox: { 
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, 
        maxHeight: '90%', paddingBottom: Platform.OS === 'ios' ? 40 : 20
    },
    modalBoxTablet: {
        width: 500, borderRadius: 28, paddingBottom: 0, overflow: 'hidden',
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
    avatarPickerSection: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#FFF' },
    avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    pickedAvatar: { width: '100%', height: '100%' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5E8D48', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    avatarHint: { fontSize: 12, color: '#94A3B8', marginTop: 10, fontWeight: '500' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { 
        backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 18, 
        height: 56, color: '#1E2939', fontSize: 16, borderWidth: 1.5, borderColor: '#F1F5F9' 
    },
    row: { flexDirection: 'row' },
    genderRow: { flexDirection: 'row', gap: 10 },
    genderBtn: { 
        flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#F1F5F9' 
    },
    roleGrid: { flexDirection: 'row', gap: 12 },
    roleBtn: { 
        flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#F1F5F9' 
    },
    radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    radioOuterActive: { borderColor: '#5E8D48' },
    radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5E8D48' },
    genderText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    genderTextActive: { color: '#1E2939', fontWeight: '700' },
    roleText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
    roleTextActive: { color: '#1E2939', fontWeight: '700' },
    footer: { 
        flexDirection: 'row', padding: 24, gap: 12, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#F1F5F9' 
    },
    cancelBtn: { flex: 1, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
    cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
    saveBtn: { flex: 1.8, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5E8D48', shadowColor: '#5E8D48', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});

export default StaffFormModal;
