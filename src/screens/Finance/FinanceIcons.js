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

export const FilterIcon = ({ color = "#4B5563" }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export const DownloadIcon = ({ color = "#64748B" }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15L17 10M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const ChartBarIcon = ({ size = 24, color = "#64748B" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M18 20V10M12 20V4M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const ChartPieIcon = ({ size = 24, color = "#64748B" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2V12H22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const CheckCircleIcon = ({ size = 24, color = "#64748B" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M22 11.08V12A10 10 0 1117.17 4.05M22 4L12 14.01L9 11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const TeaLeafIcon = ({ size = 100, color = "#8BA367", opacity = 0.1 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M2 22C2 22 10 20 16 14C22 8 22 2 22 2C22 2 16 2 10 8C4 14 2 22 2 22Z" stroke={color} strokeWidth="1" strokeOpacity={opacity} fill="none" />
        <Path d="M2 22L22 2" stroke={color} strokeWidth="0.5" strokeOpacity={opacity} />
        <Path d="M9 15C9 15 11 14 13 12" stroke={color} strokeWidth="0.5" strokeOpacity={opacity} />
    </Svg>
);

export const MatchaCupIcon = ({ size = 100, color = "#8BA367", opacity = 0.1 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5 8H19L18 19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19L5 8Z" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Path d="M5 8C5 5.2 7.2 3 10 3H14C16.8 3 19 5.2 19 8" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Path d="M9 11L15 11" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
    </Svg>
);

export const PearlIcon = ({ size = 40, color = "#8BA367", opacity = 0.1 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Circle cx="10" cy="10" r="2" fill={color} fillOpacity={opacity} />
    </Svg>
);

export const TeapotIcon = ({ size = 120, color = "#8BA367", opacity = 0.1 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 12C4 8.7 6.7 6 10 6H14C17.3 6 20 8.7 20 12V14C20 17.3 17.3 20 14 20H10C6.7 20 4 17.3 4 14V12Z" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Path d="M20 10H22V14H20" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Path d="M4 12L1 14" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <Path d="M10 6C10 4.3 11.3 3 13 3" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
    </Svg>
);

export const PremiumCupIcon = ({ size = 18, color = "#8BA367" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M17 8C19.2091 8 21 9.79086 21 12C21 14.2091 19.2091 16 17 16H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 8H17V17C17 19.2091 15.2091 21 13 21H9C6.79086 21 5 19.2091 5 17V8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 2L9 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13 2L13 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const PremiumNoteIcon = ({ size = 18, color = "#8BA367" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M11 4H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15.5 3.5L20.5 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 9H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 13H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const PremiumReceiptIcon = ({ size = 20, color = "#8BA367" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 2V22L7 20L10 22L13 20L16 22L19 20L22 22V2L19 4L16 2L13 4L10 2L7 4L4 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 8H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 16H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);
