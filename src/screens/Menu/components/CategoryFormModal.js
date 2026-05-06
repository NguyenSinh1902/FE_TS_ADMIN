import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import categoryApi from '../../../api/categoryApi';
import Svg, { Path } from 'react-native-svg';
import styles from './ProductFormModal.styles';

const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#1B2A15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const ImageIcon = () => (
    <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <Path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const defaultForm = { tenDanhMuc: "", moTa: "" };

export default function CategoryFormModal({ visible, onClose, initialData, onSave }) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    useEffect(() => {
        if (visible) {
            setSelectedImage(null);
            if (initialData) {
                setExistingImageUrl(initialData.img || null);
                setFormData({
                    tenDanhMuc: initialData.name || "",
                    moTa: initialData.moTa || ""
                });
            } else {
                setExistingImageUrl(null);
                setFormData(defaultForm);
            }
            setErrors({});
        }
    }, [visible, initialData]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleSave = async () => {
        const newErrors = {};
        if (!formData.tenDanhMuc.trim()) newErrors.tenDanhMuc = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên danh mục.');
            return;
        }

        try {
            setLoading(true);

            const requestJson = JSON.stringify({
                tenDanhMuc: formData.tenDanhMuc,
                moTa: formData.moTa || null,
                duongDanAnh: existingImageUrl,
                laHeThong: false
            });

            const data = new FormData();
            data.append('request', { string: requestJson, type: 'application/json', name: 'request' });

            if (selectedImage) {
                data.append('file', {
                    uri: selectedImage.uri,
                    name: selectedImage.fileName || 'category.jpg',
                    type: selectedImage.type || 'image/jpeg',
                });
            }

            if (initialData) {
                await categoryApi.update(initialData.id, data);
            } else {
                await categoryApi.create(data);
            }

            Alert.alert('Thành công', `Đã ${initialData ? 'cập nhật' : 'thêm'} danh mục.`);
            if (onSave) onSave();
        } catch (error) {
            console.error('Save category error:', error);
            Alert.alert('Lỗi', 'Không thể lưu danh mục này.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType={isTablet ? "fade" : "slide"}>
            <View style={[styles.overlay, isTablet && styles.overlayTablet]}>
                <View style={[styles.sheet, isTablet && styles.sheetTablet, isTablet && { height: '70%' }]}>
                    {!isTablet && <View style={styles.dragIndicator} />}
                    
                    <View style={styles.header}>
                        <Text style={styles.title}>{initialData ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            
                            {/* Image Picker */}
                            <TouchableOpacity style={styles.imagePreviewBox} onPress={pickImage} activeOpacity={0.8}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                                ) : existingImageUrl ? (
                                    <>
                                        <Image source={{ uri: existingImageUrl }} style={styles.imagePreview} />
                                        <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                                            <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>Nhấn để đổi ảnh</Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon />
                                        <Text style={styles.imageText}>Nhấn để chọn ảnh từ thư viện</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <Text style={styles.sectionTitle}>Thông tin Danh mục</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tên danh mục *</Text>
                                <TextInput 
                                    style={[styles.input, errors.tenDanhMuc && styles.inputError]} 
                                    placeholder="Ví dụ: Trà Sữa, Cà Phê..." 
                                    placeholderTextColor="#94A3B8"
                                    value={formData.tenDanhMuc}
                                    onChangeText={(t) => updateField('tenDanhMuc', t)}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mô tả danh mục</Text>
                                <TextInput 
                                    style={[styles.input, styles.textArea]} 
                                    placeholder="Gợi ý: Các loại trà sữa đậm đà từ nguyên liệu tự nhiên..." 
                                    placeholderTextColor="#94A3B8"
                                    value={formData.moTa}
                                    onChangeText={(t) => updateField('moTa', t)}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={[styles.footerActionRow, { paddingHorizontal: 0 }]}>
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
