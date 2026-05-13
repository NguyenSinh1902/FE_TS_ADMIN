import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, ImageBackground, useWindowDimensions, Dimensions, TextInput, Modal, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import styles from './AIHistory.styles';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import aiStrategyApi from '../../api/aiStrategyApi';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

// Icons
const TrendUpIcon = ({ color = "#10B981" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LightbulbIcon = ({ color = "#F59E0B" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18H15M10 21H14M12 3C7.58172 3 4 6.58172 4 11C4 13.5 5.5 15.5 7 16.5V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16.5C18.5 15.5 20 13.5 20 11C20 6.58172 16.4183 3 12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SparklesIcon = ({ size = 20, color = "#8BA367" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3l1.91 5.81c.21.64.73 1.16 1.37 1.37L21 12l-5.72 1.82c-.64.21-1.16.73-1.37 1.37L12 21l-1.91-5.81c-.21-.64-.73-1.16-1.37-1.37L3 12l5.72-1.82c.64-.21 1.16-.73 1.37-1.37L12 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AlertCircleIcon = ({ color = "#EF4444" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 8V12M12 16H12.01" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ color = "#64748B" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FilterIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function AIHistory({ onNavigate }) {
  // 1. ALL HOOKS AT THE TOP
  const { width: windowWidth } = useWindowDimensions();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const res = await aiStrategyApi.getHistory(today);
        setHistory(res || []);
      } catch (error) {
        console.error('Fetch history error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 2. LOGIC
  const isTablet = windowWidth >= 768;

  const renderAIInsights = (text) => {
    if (!text) return null;
    const blocks = text.split('\n\n').filter(b => b.trim() !== '');

    const renderBold = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <Text key={i} style={{ fontWeight: '700', color: '#1B2A15' }}>{part.slice(2, -2)}</Text>;
        }
        return <Text key={i}>{part}</Text>;
      });
    };

    return blocks.map((block, index) => {
      if (block.startsWith('**') && block.endsWith('**') && !block.includes('\n')) {
        return (
          <View key={index} style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1B2A15', textAlign: 'center' }}>{block.slice(2, -2)}</Text>
            <View style={{ width: 40, height: 3, backgroundColor: '#8BA367', borderRadius: 2, marginTop: 8 }} />
          </View>
        );
      }

      const lines = block.split('\n');
      const firstLine = lines[0].trim();

      if (firstLine.startsWith('*')) {
        let title = '';
        let desc = '';
        const match = firstLine.match(/^\*\s*\*\*(.*?)\*\*:?\s*(.*)$/);

        if (match) {
          title = match[1];
          desc = match[2];
        } else {
          title = firstLine.replace(/^\*\s*/, '').replace(/\*\*/g, '');
        }

        let IconComponent = LightbulbIcon;
        let iconBg = 'rgba(245, 158, 11, 0.13)';
        let iconColor = '#F59E0B';

        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('doanh thu') || lowerTitle.includes('đơn hàng') || lowerTitle.includes('tăng trưởng')) {
          IconComponent = TrendUpIcon;
          iconBg = 'rgba(16, 185, 129, 0.13)';
          iconColor = '#10B981';
        } else if (lowerTitle.includes('chậm') || lowerTitle.includes('cảnh báo') || lowerTitle.includes('tồn kho')) {
          IconComponent = AlertCircleIcon;
          iconBg = 'rgba(239, 68, 68, 0.13)';
          iconColor = '#EF4444';
        } else if (lowerTitle.includes('combo') || lowerTitle.includes('khuyến mãi') || lowerTitle.includes('gợi ý') || lowerTitle.includes('giải pháp')) {
          IconComponent = SparklesIcon;
          iconBg = 'rgba(139, 163, 103, 0.15)';
          iconColor = '#8BA367';
        }

        const nestedLines = lines.slice(1).map(l => l.trim()).filter(l => l.startsWith('*'));

        return (
          <View key={index} style={styles.insightCard}>
            <View style={[styles.insightIconWrap, { backgroundColor: iconBg }]}>
              <IconComponent size={24} color={iconColor} />
            </View>
            <View style={styles.insightTextWrap}>
              <Text style={styles.insightTitle}>{title}</Text>
              {desc ? <Text style={styles.insightDesc}>{renderBold(desc)}</Text> : null}

              {nestedLines.length > 0 && (
                <View style={{ marginTop: desc ? 12 : 6 }}>
                  {nestedLines.map((nl, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#8BA367', marginTop: 8, marginRight: 10 }} />
                      <Text style={{ flex: 1, fontSize: 14, color: '#4A5565', lineHeight: 22 }}>
                        {renderBold(nl.replace(/^\*\s*/, ''))}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        );
      }

      return (
        <Text key={index} style={{ fontSize: 15, color: '#4A5565', lineHeight: 24, marginBottom: 16 }}>
          {renderBold(block)}
        </Text>
      );
    });
  };

  const renderHistoryItem = (item) => {
    const isExpanded = expandedId === item.idNhatKy;
    const dateObj = new Date(item.thoiGianTao);
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString('vi-VN');

    return (
      <View key={item.idNhatKy} style={styles.historyCard}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.idNhatKy)}
          activeOpacity={0.7}
        >
          <View style={styles.cardTitleGroup}>
            <View style={styles.cardIcon}>
              <SparklesIcon color="#8BA367" size={24} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Bản ghi nhật ký #{item.idNhatKy}</Text>
              <Text style={styles.cardDate}>{timeStr} - {dateStr}</Text>
            </View>
          </View>
          <View style={[styles.expandButton, isExpanded && { transform: [{ rotate: '180deg' }] }]}>
            <ChevronDownIcon />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {renderAIInsights(item.loiKhuyenAi)}
          </View>
        )}
      </View>
    );
  };

  const filteredHistory = history.filter(item =>
    item.loiKhuyenAi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.idNhatKy.toString().includes(searchQuery)
  );

  // 3. SINGLE RETURN
  return (
    <View style={isTablet ? styles.tabletContainer : styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {isTablet ? (
        <>
          {/* Tablet View */}
          <View style={styles.absoluteFill}>
            <View style={styles.decorativeBlob1} />
            <View style={styles.decorativeBlob2} />
            <View style={styles.decorativeBlob3} />
            <View style={styles.frostyOverlay} />
          </View>

          <Sidebar
            activeRoute="AIHistory"
            onNavigate={onNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <View style={styles.tabletMain}>
            <View style={styles.tabletHeader}>
              <Text style={styles.tabletHeaderTitle}>Lịch sử nhật ký AI</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setShowNotiModal(true)} style={styles.iconBtn}>
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <View style={styles.badge} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={styles.iconBtn}>
                  <SettingsIcon />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchInputWrapper}>
                <SearchIcon />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm nhật ký..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <FilterIcon />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              {/* <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#1B2A15' }}>Nhật ký AI</Text>
                        <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>Lưu trữ các phân tích và chiến lược từ hệ thống</Text>
                    </View> */}

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#8BA367" />
                  <Text style={{ marginTop: 16, color: '#64748B' }}>Đang tải lịch sử...</Text>
                </View>
              ) : filteredHistory.length > 0 ? (
                <View style={styles.listContainer}>
                  {filteredHistory.map(renderHistoryItem)}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có bản ghi nhật ký nào trong hôm nay.'}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          {/* Mobile View */}
          <Header title="Lịch sử nhật ký AI" unreadCount={0} onNotificationPress={() => setShowNotiModal(true)} onAvatarPress={() => setShowSettingsModal(true)} />

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Sidebar
              activeRoute="AIHistory"
              onNavigate={onNavigate}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <View style={{ flex: 1 }}>
              <ImageBackground source={BG_IMAGE} style={{ flex: 1 }} imageStyle={{ opacity: 0.03 }}>
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <View style={{ flex: 1, height: 44, backgroundColor: '#F3F4F6', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                      <SearchIcon />
                      <TextInput
                        style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#1E2939' }}
                        placeholder="Tìm kiếm..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                    <TouchableOpacity style={{ width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
                      <FilterIcon />
                    </TouchableOpacity>
                  </View>

                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#8BA367" />
                    </View>
                  ) : filteredHistory.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                      {filteredHistory.map(renderHistoryItem)}
                    </ScrollView>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Chưa có bản ghi nào.</Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </View>
          </View>
          <BottomNav currentScreen="AIHistory" onNavigate={onNavigate} />
        </>
      )}

      <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </View>
  );
}
