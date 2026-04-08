import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const UserIcon = ({ color = "#1E2939", size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20 21V19C20 17.8954 19.1046 17 18 17H6C4.89543 17 4 17.8954 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const UsersIcon = ({ color = "#1E2939", size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11ZM6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21M22 21V19C22 17.8954 21.1046 17 20 17H16M16 3.13C17.7252 3.514 19 5.11115 19 7C19 8.88885 17.7252 10.486 16 10.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const ClockIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#EA580C" strokeWidth="2"/>
        <Path d="M12 6V12L16 14" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CheckCircleIcon = ({ size = 20, color = "#10B981" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7675 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98233 16.07 2.86" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M22 4L12 14L9 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const MoreIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="5" r="2" fill="#9CA3AF"/>
        <Circle cx="12" cy="12" r="2" fill="#9CA3AF"/>
        <Circle cx="12" cy="19" r="2" fill="#9CA3AF"/>
    </Svg>
);

export const EditIcon = ({ size = 20, color = "#3B82F6" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const TrashIcon = ({ size = 20, color = "#EF4444" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CloseIcon = ({ size = 18 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="#1E2939" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const SearchIcon = ({ size = 18 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
        <Path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
);

export const FilterIcon = ({ size = 18 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CartIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const BadgeIcon = ({ color = "#1E2939", size = 18 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CoinIcon = ({ size = 20, color = "#6B8743" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5"/>
        <Path d="M12 6V18M9 9.5C9 8.119 10.343 7 12 7C13.657 7 15 8.119 15 9.5C15 10.881 13.657 12 12 12C10.343 12 9 13.119 9 14.5C9 15.881 10.343 17 12 17C13.657 17 15 15.881 15 14.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const PlusIcon = ({ size = 20, color = "white" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);
