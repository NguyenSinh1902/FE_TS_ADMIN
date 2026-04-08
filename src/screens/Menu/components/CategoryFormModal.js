import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import categoryApi from '../../../api/categoryApi';
import Svg, { Path } from 'react-native-svg';
// Reuse the robust form styles already created for the Product form
import styles from './ProductFormModal.styles';

const CloseIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#1E2939" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const ImageIcon = () => (
    <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <Path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const defaultForm = {
    tenDanhMuc: "",
    duongDanAnh: ""
};

export default function CategoryFormModal({ visible, onClose, initialData, onSave }) {
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setFormData({
                    tenDanhMuc: initialData.name || "",
                    duongDanAnh: initialData.img || ""
                });
            } else {
                setFormData(defaultForm);
            }
            setErrors({});
        }
    }, [visible, initialData]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSave = async () => {
        const newErrors = {};
        if (!formData.tenDanhMuc.trim()) newErrors.tenDanhMuc = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tên danh mục.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                tenDanhMuc: formData.tenDanhMuc,
                duongDanAnh: formData.duongDanAnh || null,
                laHeThong: false
            };

            if (initialData) {
                await categoryApi.update(initialData.id, payload);
            } else {
                await categoryApi.create(payload);
            }

            Alert.alert("Thành công", `Đã ${initialData ? 'cập nhật' : 'thêm'} danh mục.`);
            if (onSave) onSave();
        } catch (error) {
            console.error('Save category error:', error);
            Alert.alert("Lỗi", "Không thể lưu danh mục này.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.sheet, { height: '80%' }]}>
                    <View style={styles.dragIndicator} />
                    
                    <View style={styles.header}>
                        <Text style={styles.title}>{initialData ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            
                            <View style={styles.imagePreviewBox}>
                                {formData.duongDanAnh ? (
                                    <Image source={{ uri: formData.duongDanAnh }} style={styles.imagePreview} />
                                ) : (
                                    <>
                                        <ImageIcon />
                                        <Text style={styles.imageText}>Chọn hoặc dán link ảnh</Text>
                                    </>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Đường dẫn ảnh (URL)</Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="https://..." 
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.duongDanAnh}
                                    onChangeText={(t) => updateField('duongDanAnh', t)}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tên danh mục *</Text>
                                <TextInput 
                                    style={[styles.input, errors.tenDanhMuc && styles.inputError]} 
                                    placeholder="Nhập tên danh mục..." 
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.tenDanhMuc}
                                    onChangeText={(t) => updateField('tenDanhMuc', t)}
                                />
                            </View>

                            <View style={styles.footerActionRow}>
                                <TouchableOpacity style={[styles.btnBase, styles.btnCancel]} onPress={onClose}>
                                    <Text style={styles.btnCancelText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnBase, styles.btnSave, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
                                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnSaveText}>Lưu Danh Mục</Text>}
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}
