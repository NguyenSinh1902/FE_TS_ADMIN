import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export const ReceiptIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const TaxIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M12 1V23M5 5L19 19M19 5L5 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const SearchIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
        <Path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export const FilterIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const ChevronIcon = ({ isOpen }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d={isOpen ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const TableTypeIcon = ({ color = "#64748B" }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="8" width="16" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Path d="M6 16V20M18 16V20" stroke={color} strokeWidth="2" />
    </Svg>
);

export const BagIcon = ({ color = "#64748B" }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M3 6H21M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CashIcon = ({ color = "#64748B" }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
);

export const BankIcon = ({ color = "#64748B" }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="10" width="18" height="12" rx="2" stroke={color} strokeWidth="2" />
        <Path d="M7 10V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V10" stroke={color} strokeWidth="2" />
    </Svg>
);

export const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6l12 12" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);
