import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import InvoiceTimeline from './components/InvoiceTimeline';
import InvoiceTable from './components/InvoiceTable';

const ListIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const GridIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="14" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="14" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="3" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
    </Svg>
);

const InvoicesTab = ({ onModalStateChange }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const [viewMode, setViewMode] = useState('timeline');

    return (
        <View style={{ flex: 1 }}>
            {isTablet && (
                <View style={styles.toggleWrapper}>
                    <View style={styles.toggleGroup}>
                        <TouchableOpacity 
                            style={[styles.toggleBtn, viewMode === 'table' && styles.toggleBtnActive]} 
                            onPress={() => setViewMode('table')}
                        >
                            <ListIcon color={viewMode === 'table' ? '#8BA367' : '#94A3B8'} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.toggleBtn, viewMode === 'timeline' && styles.toggleBtnActive]} 
                            onPress={() => setViewMode('timeline')}
                        >
                            <GridIcon color={viewMode === 'timeline' ? '#8BA367' : '#94A3B8'} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {viewMode === 'timeline' ? (
                <InvoiceTimeline onModalStateChange={onModalStateChange} />
            ) : (
                <InvoiceTable onModalStateChange={onModalStateChange} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    toggleWrapper: {
        alignItems: 'flex-end',
        paddingHorizontal: 32,
        paddingTop: 0,
        paddingBottom: 8,
        backgroundColor: 'transparent',
        zIndex: 10
    },
    toggleGroup: { 
        flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 3, gap: 2,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    toggleBtn: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    toggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
});

export default InvoicesTab;
