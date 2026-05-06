import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ActivityIndicator, Alert, useWindowDimensions, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import safeAsyncStorage from '../../utils/storage';
import Svg, { Path, Circle } from 'react-native-svg';

const CloseIcon = ({ color = '#94A3B8' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const EditIcon = ({ color = '#8BA367' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CameraIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="13" r="4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const ProfileModal = ({ visible, onClose, onLogout }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields
    const [hoTen, setHoTen] = useState('');
    const [gioiTinh, setGioiTinh] = useState('NAM');
    const [ngaySinh, setNgaySinh] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [avatarUri, setAvatarUri] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (visible) {
            loadUser();
            setIsEditing(false); // Reset edit state when opening
        }
    }, [visible]);

    const loadUser = async () => {
        try {
            const userStr = await safeAsyncStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setHoTen(userData.hoTen || '');
                setGioiTinh(userData.gioiTinh || 'NAM');
                
                if (userData.ngaySinh) {
                    const dateObj = new Date(userData.ngaySinh);
                    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    setNgaySinh(formattedDate);
                } else {
                    setNgaySinh('');
                }
                
                setSoDienThoai(userData.soDienThoai || '');
                setAvatarUri(userData.hinhAnh || null);
                setAvatarFile(null);
            }
        } catch (error) {
            console.error('Error loading user', error);
        }
    };

    const handlePickImage = async () => {
        if (!isEditing) return;
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (!result.didCancel && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setAvatarUri(asset.uri);
                setAvatarFile({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || 'avatar.jpg'
                });
            }
        } catch (error) {
            console.error('Pick image error', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        loadUser(); // Reset fields to original
    };

    const handleSave = async () => {
        if (!user || !user.idNhanVien) return;

        try {
            setLoading(true);
            const formData = new FormData();

            const requestData = {
                hoTen,
                gioiTinh,
                ngaySinh,
                soDienThoai
            };

            formData.append('request', {
                string: JSON.stringify(requestData),
                type: 'application/json'
            });

            if (avatarFile) {
                formData.append('file', avatarFile);
            }

            const token = await safeAsyncStorage.getItem('token');
            const response = await fetch(`http://10.0.2.2:8080/api/nhan-vien/${user.idNhanVien}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            
            // Update local storage
            const updatedUser = { ...user, ...requestData, hinhAnh: avatarUri };
            await safeAsyncStorage.setItem('user', JSON.stringify(updatedUser));
            
            Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân');
            setIsEditing(false);
        } catch (error) {
            console.error('Save profile error', error);
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin cá nhân');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} hardwareAccelerated={true}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { width: isTablet ? 500 : '90%', maxHeight: '90%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Chỉnh sửa hồ sơ' : 'Hồ sơ cá nhân'}</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {!isEditing && (
                                <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.closeBtn, { backgroundColor: 'rgba(139, 163, 103, 0.1)' }]}>
                                    <EditIcon />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => { setIsEditing(false); onClose(); }} style={styles.closeBtn}>
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarContainer}>
                                {avatarUri ? (
                                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarInitials}>
                                            {hoTen ? hoTen.split(' ').pop().substring(0, 2).toUpperCase() : 'AD'}
                                        </Text>
                                    </View>
                                )}
                                {isEditing && (
                                    <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                                        <CameraIcon />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Họ và tên</Text>
                            <TextInput 
                                style={[styles.input, !isEditing && styles.inputReadonly]} 
                                value={hoTen} 
                                onChangeText={setHoTen} 
                                placeholder="Chưa cập nhật"
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.rowGroup}>
                            <View style={[styles.formGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Giới tính</Text>
                                {!isEditing ? (
                                    <TextInput 
                                        style={[styles.input, styles.inputReadonly]} 
                                        value={gioiTinh === 'NAM' ? 'Nam' : 'Nữ'} 
                                        editable={false}
                                    />
                                ) : (
                                    <View style={styles.genderRow}>
                                        <TouchableOpacity 
                                            style={[styles.genderBtn, gioiTinh === 'NAM' && styles.genderBtnActive]} 
                                            onPress={() => setGioiTinh('NAM')}
                                        >
                                            <Text style={[styles.genderText, gioiTinh === 'NAM' && styles.genderTextActive]}>Nam</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.genderBtn, gioiTinh === 'NU' && styles.genderBtnActive]} 
                                            onPress={() => setGioiTinh('NU')}
                                        >
                                            <Text style={[styles.genderText, gioiTinh === 'NU' && styles.genderTextActive]}>Nữ</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Ngày sinh (YYYY-MM-DD)</Text>
                            <TextInput 
                                style={[styles.input, !isEditing && styles.inputReadonly]} 
                                value={ngaySinh} 
                                onChangeText={setNgaySinh} 
                                placeholder="Chưa cập nhật"
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Số điện thoại</Text>
                            <TextInput 
                                style={[styles.input, !isEditing && styles.inputReadonly]} 
                                value={soDienThoai} 
                                onChangeText={setSoDienThoai} 
                                placeholder="Chưa cập nhật"
                                keyboardType="numeric"
                                editable={isEditing}
                            />
                        </View>

                        {isEditing ? (
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                                    <Text style={styles.cancelText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                                    <LinearGradient colors={['#8BA367', '#6B8E4E']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.saveBtnInner}>
                                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.divider} />
                                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                                    <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B'
    },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 12
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'relative'
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8BA367'
    },
    avatarInitials: {
        fontSize: 32,
        fontWeight: '900',
        color: '#8BA367'
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8BA367',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF'
    },
    formGroup: {
        marginBottom: 20
    },
    rowGroup: {
        flexDirection: 'row',
        gap: 16
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 8,
        marginLeft: 4
    },
    input: {
        backgroundColor: '#F8FAFC',
        height: 52,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    inputReadonly: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingHorizontal: 4,
        color: '#1E293B',
        fontWeight: '600'
    },
    genderRow: {
        flexDirection: 'row',
        gap: 12
    },
    genderBtn: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    genderBtnActive: {
        backgroundColor: '#F0FDF4',
        borderColor: '#8BA367'
    },
    genderText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B'
    },
    genderTextActive: {
        color: '#8BA367',
        fontWeight: '800'
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12
    },
    cancelBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelText: {
        color: '#475569',
        fontSize: 16,
        fontWeight: '700'
    },
    saveBtn: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#8BA367',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 6
    },
    saveBtnInner: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900'
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 24
    },
    logoutBtn: {
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginBottom: 10
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1
    }
});

export default ProfileModal;
