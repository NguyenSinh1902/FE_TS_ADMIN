import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const DashboardIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 18V12M10 18V8M16 18V4M2 22H22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MenuIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StaffIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FacilityIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21M5 21V5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21M9 8H15M9 12H15M9 16H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FinanceIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M9 12H9.01M12 16H15M9 16H9.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function BottomNav({ currentScreen, onNavigate }) {
    const navItems = [
        { key: 'Dashboard', label: 'Dashboard', icon: DashboardIcon },
        { key: 'Menu', label: 'Thực đơn', icon: MenuIcon },
        { key: 'StaffManagement', label: 'Nhân sự', icon: StaffIcon },
        { key: 'Facility', label: 'Cơ sở', icon: FacilityIcon },
        { key: 'Finance', label: 'Tài chính', icon: FinanceIcon },
    ];

    return (
        <View style={styles.navContainer}>
            {navItems.map((item) => {
                const isActive = currentScreen === item.key;
                const IconComponent = item.icon;
                const color = isActive ? '#FFFFFF' : '#8BA367';
                
                return (
                    <TouchableOpacity 
                        key={item.key} 
                        style={styles.navItem} 
                        onPress={() => onNavigate(item.key)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                            <IconComponent color={color} />
                        </View>
                        <Text style={[styles.navText, isActive && styles.navTextActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: Platform.OS === 'ios' ? 90 : 80,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: '#8BA367',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width / 5.2,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconWrapperActive: {
        backgroundColor: '#8BA367',
        shadowColor: '#8BA367',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    navText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6A7282',
    },
    navTextActive: {
        color: '#8BA367',
        fontWeight: '700',
    }
});
