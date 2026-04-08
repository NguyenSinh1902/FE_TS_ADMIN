import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image, Switch, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import categoryApi from '../../../api/categoryApi';
import productApi from '../../../api/productApi';
import Svg, { Path } from 'react-native-svg';
import styles from './ProductFormModal.styles';

const CloseIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#1E2939" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const TrashIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const PlusIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19M5 12H19" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const ImageIcon = () => (
    <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <Path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const defaultForm = {
    tenSanPham: "",
    idDanhMuc: null,
    duongDanAnh: "",
    laTopping: false,
    danhSachBienThe: [
        { id: Date.now(), tenKichCo: 'Phần', giaBan: '', phanTramGiamGia: '0', soLuongTonKho: '-1' }
    ]
};

export default function ProductFormModal({ visible, onClose, initialData, onSave }) {
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCats, setFetchingCats] = useState(false);

    // Cập nhật dữ liệu nếu đang Edit
    useEffect(() => {
        const fetchCats = async () => {
            try {
                setFetchingCats(true);
                const data = await categoryApi.getAll();
                setCategories(data || []);
            } catch (error) {
                console.error('Fetch cats for modal error:', error);
            } finally {
                setFetchingCats(false);
            }
        };
        if (visible) {
            fetchCats();
            if (initialData) {
                setFormData({
                    tenSanPham: initialData.name || "",
                    idDanhMuc: initialData.idDanhMuc || null,
                    duongDanAnh: initialData.img || "",
                    laTopping: initialData.laTopping || false,
                    danhSachBienThe: initialData.variants ? initialData.variants.map(v => ({
                        ...v,
                        id: v.idBienThe || Date.now() + Math.random(),
                        giaBan: v.giaBan?.toString() || '',
                        phanTramGiamGia: v.phanTramGiamGia?.toString() || '0',
                        soLuongTonKho: v.soLuongTonKho?.toString() || '-1'
                    })) : []
                });
            } else {
                setFormData(defaultForm);
            }
            setErrors({});
        }
    }, [visible, initialData]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null })); // Xoá lỗi khi nhập
    };

    // ----- Quản lý mảng Biến Thể -----
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            danhSachBienThe: [
                ...prev.danhSachBienThe,
                { id: Date.now(), tenKichCo: '', giaBan: '', phanTramGiamGia: '', soLuongTonKho: '' }
            ]
        }));
    };

    const updateVariant = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            danhSachBienThe: prev.danhSachBienThe.map(v => 
                v.id === id ? { ...v, [field]: value } : v
            )
        }));
    };

    const removeVariant = (id) => {
        setFormData(prev => ({
            ...prev,
            danhSachBienThe: prev.danhSachBienThe.filter(v => v.id !== id)
        }));
    };

    // Validation Basic
    const handleSave = async () => {
        const newErrors = {};
        if (!formData.tenSanPham.trim()) newErrors.tenSanPham = true;
        if (!formData.idDanhMuc) newErrors.idDanhMuc = true;
        if (formData.danhSachBienThe.length === 0) {
            Alert.alert("Lỗi", "Vui lòng thêm ít nhất một biến thể.");
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ tên và chọn danh mục.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                tenSanPham: formData.tenSanPham,
                idDanhMuc: formData.idDanhMuc,
                duongDanAnh: formData.duongDanAnh || null,
                laTopping: formData.laTopping,
                danhSachBienThe: formData.danhSachBienThe.map(v => ({
                    idBienThe: typeof v.id === 'string' && v.id.includes('.') ? null : v.idBienThe || null,
                    tenKichCo: v.tenKichCo,
                    giaBan: parseFloat(v.giaBan) || 0,
                    phanTramGiamGia: parseInt(v.phanTramGiamGia) || 0,
                    soLuongTonKho: parseInt(v.soLuongTonKho) || -1
                }))
            };

            if (initialData) {
                await productApi.update(initialData.id, payload);
            } else {
                await productApi.create(payload);
            }

            Alert.alert("Thành công", `Đã ${initialData ? 'cập nhật' : 'thêm'} sản phẩm.`);
            if (onSave) onSave();
        } catch (error) {
            console.error('Save product error:', error);
            Alert.alert("Lỗi", "Không thể lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.dragIndicator} />
                    
                    <View style={styles.header}>
                        <Text style={styles.title}>{initialData ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            
                            {/* Khu vực up ảnh */}
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

                            {/* Thông tin cơ bản */}
                            <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tên sản phẩm *</Text>
                                <TextInput 
                                    style={[styles.input, errors.tenSanPham && styles.inputError]} 
                                    placeholder="Nhập tên sản phẩm" 
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.tenSanPham}
                                    onChangeText={(t) => updateField('tenSanPham', t)}
                                />
                            </View>

                            <View style={[styles.inputGroup, errors.idDanhMuc && styles.inputError]}>
                                <Text style={styles.label}>Danh mục *</Text>
                                <View style={styles.categoryPickerRow}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {categories.map(c => (
                                            <TouchableOpacity 
                                                key={c.idDanhMuc} 
                                                style={[styles.catTag, formData.idDanhMuc === c.idDanhMuc && styles.catTagSelected]}
                                                onPress={() => updateField('idDanhMuc', c.idDanhMuc)}
                                            >
                                                <Text style={[styles.catTagText, formData.idDanhMuc === c.idDanhMuc && styles.catTagTextSelected]}>
                                                    {c.tenDanhMuc}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                        {fetchingCats && <ActivityIndicator size="small" color="#8BA367" style={{ marginLeft: 10 }} />}
                                    </ScrollView>
                                </View>
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Sản phẩm này là Topping?</Text>
                                <Switch
                                    trackColor={{ false: "#E5E7EB", true: "#BBF7D0" }}
                                    thumbColor={formData.laTopping ? "#10B981" : "#FFF"}
                                    onValueChange={(val) => updateField('laTopping', val)}
                                    value={formData.laTopping}
                                />
                            </View>

                            {/* Khu vực biến thể Mảng Động */}
                            <Text style={[styles.sectionTitle, {marginTop: 32}]}>Biến Thể (Kích cỡ, Loại)</Text>
                            
                            {formData.danhSachBienThe.map((variant, index) => (
                                <View key={variant.id} style={styles.variantCard}>
                                    <View style={styles.variantHeader}>
                                        <Text style={styles.variantTitle}>Biến thể #{index + 1}</Text>
                                        <TouchableOpacity style={styles.variantActionBtn} onPress={() => removeVariant(variant.id)}>
                                            <TrashIcon />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Tên kích cỡ</Text>
                                        <TextInput 
                                            style={styles.input} placeholder="Size M, L, Nhỏ, Lớn..." 
                                            value={variant.tenKichCo} onChangeText={(t) => updateVariant(variant.id, 'tenKichCo', t)}
                                        />
                                    </View>

                                    <View style={styles.variantRow}>
                                        <View style={styles.variantCol}>
                                            <Text style={styles.label}>Giá bán</Text>
                                            <TextInput 
                                                style={styles.input} placeholder="0" keyboardType="numeric"
                                                value={variant.giaBan} onChangeText={(t) => updateVariant(variant.id, 'giaBan', t)}
                                            />
                                        </View>
                                        <View style={styles.variantCol}>
                                            <Text style={styles.label}>% Giảm</Text>
                                            <TextInput 
                                                style={styles.input} placeholder="0%" keyboardType="numeric"
                                                value={variant.phanTramGiamGia} onChangeText={(t) => updateVariant(variant.id, 'phanTramGiamGia', t)}
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={[styles.inputGroup, {marginTop: 16, marginBottom: 0}]}>
                                        <Text style={styles.label}>Tồn kho</Text>
                                        <TextInput 
                                            style={styles.input} placeholder="Số lượng tồn..." keyboardType="numeric"
                                            value={variant.soLuongTonKho} onChangeText={(t) => updateVariant(variant.id, 'soLuongTonKho', t)}
                                        />
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.addVariantBtn} activeOpacity={0.7} onPress={addVariant}>
                                <PlusIcon />
                                <Text style={styles.addVariantText}>Thêm biến thể</Text>
                            </TouchableOpacity>

                            {/* Nút Hành Động Cuối Form */}
                            <View style={styles.footerActionRow}>
                                <TouchableOpacity style={[styles.btnBase, styles.btnCancel]} onPress={onClose}>
                                    <Text style={styles.btnCancelText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnBase, styles.btnSave, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
                                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnSaveText}>Lưu Sản Phẩm</Text>}
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}
