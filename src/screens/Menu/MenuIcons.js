import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const PlusIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const SearchIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
        <Path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
);

export const FilterIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#4A5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const MoreIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="5" r="2" fill="#9CA3AF"/>
        <Circle cx="12" cy="12" r="2" fill="#9CA3AF"/>
        <Circle cx="12" cy="19" r="2" fill="#9CA3AF"/>
    </Svg>
);

export const EditIcon = ({ color = "#1E2939", size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const TrashIcon = ({ color = "#EF4444", size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

export const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);
