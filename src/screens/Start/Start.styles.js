import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgba(93, 110, 68, 1)',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darkened slightly for better text contrast
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    glassCard: {
        width: width * 0.88,
        backgroundColor: 'rgba(255, 255, 255, 0.01)', // Glass effect sáng hơn và sang hơn
        borderColor: 'rgba(255, 255, 255, 0.25)',
        borderWidth: 1,
        borderRadius: 32,
        paddingTop: 45,
        paddingBottom: 45,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        // elevation: 10 => Bỏ elevation để tránh lỗi viền trắng shadow trên Android
        marginTop: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    matchTeaAdmin: {
        textAlign: 'center',
        color: '#ECCD6B', // Golden color approximated from the design
        fontSize: 44,
        fontWeight: '500',
        lineHeight: 52,
        marginBottom: 20,
    },
    subtitle: {
        textAlign: 'center',
        color: 'rgba(255, 248, 231, 1)',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 26,
    },
    divider: {
        width: 100, // Matching the small divider line in design
        height: 1,
        backgroundColor: 'rgba(212, 175, 55, 0.4)', // Golden divider
        marginBottom: 40,
    },
    buttonWrapper: {
        width: '85%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.5)',
    },
    button: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    securityBadge: {
        marginTop: 35, // Đẩy xuống dưới nút một khoảng cách đều
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: 'rgba(212, 175, 55, 0.4)',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    securityText: {
        color: '#D4AF37', // Chữ màu vàng gold để nhập bộ màu
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    footerText: {
        position: 'absolute',
        bottom: 50,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13,
    }
});
