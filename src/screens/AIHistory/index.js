import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, ImageBackground, useWindowDimensions, TextInput, Modal, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import styles from './AIHistory.styles';
import Header from '../../components/Header';
import aiStrategyApi from '../../api/aiStrategyApi';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

// ─── Icons ────────────────────────────────────────────────────────────────────
const TrendUpIcon = ({ color = "#10B981" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LightbulbIcon = ({ color = "#F59E0B", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const AlertCircleIcon = ({ color = "#EF4444", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1" fill={color} />
  </Svg>
);

const SparklesIcon = ({ color = "#8BA367", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M18 17L19 19.5L21.5 20.5L19 21.5L18 24L17 21.5L14.5 20.5L17 19.5L18 17Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ color = "#64748B", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ color = "#9CA3AF", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ color = "#64748B", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21M7 12H17M10 18H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CalendarIcon = ({ color = "#64748B", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1 4 21 4.9 21 6V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const XIcon = ({ color = "#64748B", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = "#1B2A15", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AIHistory({ onNavigate }) {
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 768;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Filter date state
  const [filterDate, setFilterDate] = useState(null); // null = show all
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async (dateStr = null) => {
    try {
      setLoading(true);
      const res = await aiStrategyApi.getHistory(dateStr); // null → no ?ngay param → all
      setHistory(res || []);
    } catch (error) {
      console.error('Fetch history error:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(null); // load all on mount
  }, [fetchHistory]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatDateYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDateDisplay = (date) =>
    date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleApplyFilter = () => {
    const ymd = formatDateYMD(tempDate);
    setFilterDate(tempDate);
    setShowDatePicker(false);
    fetchHistory(ymd);
  };

  const handleClearFilter = () => {
    setFilterDate(null);
    fetchHistory(null);
  };

  // ── Insight Renderer ─────────────────────────────────────────────────────────
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
        if (match) { title = match[1]; desc = match[2]; }
        else { title = firstLine.replace(/^\*\s*/, '').replace(/\*\*/g, ''); }

        let IconComponent = LightbulbIcon;
        let iconBg = 'rgba(245, 158, 11, 0.13)';
        let iconColor = '#F59E0B';
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('doanh thu') || lowerTitle.includes('đơn hàng') || lowerTitle.includes('tăng trưởng')) {
          IconComponent = TrendUpIcon; iconBg = 'rgba(16, 185, 129, 0.13)'; iconColor = '#10B981';
        } else if (lowerTitle.includes('chậm') || lowerTitle.includes('cảnh báo') || lowerTitle.includes('tồn kho')) {
          IconComponent = AlertCircleIcon; iconBg = 'rgba(239, 68, 68, 0.13)'; iconColor = '#EF4444';
        } else if (lowerTitle.includes('combo') || lowerTitle.includes('khuyến mãi') || lowerTitle.includes('gợi ý') || lowerTitle.includes('giải pháp')) {
          IconComponent = SparklesIcon; iconBg = 'rgba(139, 163, 103, 0.15)'; iconColor = '#8BA367';
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

  // ── History Item ─────────────────────────────────────────────────────────────
  const renderHistoryItem = (item, index) => {
    const isExpanded = expandedId === item.idNhatKy;
    const dateObj = new Date(item.thoiGianTao);
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString('vi-VN');

    // Alternate between soft green and warm cream gradients
    const gradients = [
      ['#F0F7EC', '#FAFDF8'],   // sage green tint
      ['#FFF8EF', '#FFFCF9'],   // warm cream tint
      ['#EFF6FF', '#F8FBFF'],   // soft blue tint
    ];
    const gradient = gradients[index % gradients.length];

    return (
      <LinearGradient
        key={item.idNhatKy}
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.historyCard, { backgroundColor: undefined }]}
      >
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
              <Text style={styles.cardDate}>{timeStr} · {dateStr}</Text>
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
      </LinearGradient>
    );
  };

  const filteredHistory = history.filter(item =>
    item.loiKhuyenAi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.idNhatKy?.toString().includes(searchQuery)
  );

  // ── Filter Bar ───────────────────────────────────────────────────────────────
  const renderFilterBar = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      {/* Compact search — fixed width, left-aligned */}
      <View style={{ width: 280, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 10, height: 38, borderWidth: 1, borderColor: '#E5E7EB' }}>
        <SearchIcon size={16} />
        <TextInput
          style={{ flex: 1, marginLeft: 7, fontSize: 13, color: '#1E2939', padding: 0 }}
          placeholder="Tìm kiếm nhật ký..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter date pill */}
      {filterDate ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 10, paddingHorizontal: 10, height: 36, borderWidth: 1, borderColor: '#8BA367', gap: 6 }}>
          <CalendarIcon color="#4A7C59" size={15} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#4A7C59' }}>{formatDateDisplay(filterDate)}</Text>
          <TouchableOpacity onPress={handleClearFilter} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <XIcon color="#4A7C59" size={13} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}
        >
          <FilterIcon size={16} />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── List ─────────────────────────────────────────────────────────────────────
  const renderList = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BA367" />
          <Text style={{ marginTop: 16, color: '#64748B' }}>Đang tải lịch sử...</Text>
        </View>
      );
    }
    if (filteredHistory.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <SparklesIcon color="#C4D6A4" size={48} />
          <Text style={[styles.emptyText, { marginTop: 16 }]}>
            {searchQuery
              ? 'Không tìm thấy kết quả phù hợp.'
              : filterDate
                ? `Không có nhật ký nào vào ngày ${formatDateDisplay(filterDate)}.`
                : 'Chưa có bản ghi nhật ký nào.'}
          </Text>
          {filterDate && (
            <TouchableOpacity onPress={handleClearFilter} style={{ marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#8BA367', borderRadius: 12 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Xem tất cả lịch sử</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return filteredHistory.map((item, index) => renderHistoryItem(item, index));
  };

  // ── Date Picker Modal ────────────────────────────────────────────────────────
  const renderDatePickerModal = () => (
    <DatePicker
      modal
      open={showDatePicker}
      date={tempDate}
      mode="date"
      locale="vi"
      maximumDate={new Date()}
      title="Chọn ngày lọc"
      confirmText="Áp dụng"
      cancelText="Hủy"
      onConfirm={(date) => {
        setTempDate(date);
        const ymd = formatDateYMD(date);
        setFilterDate(date);
        setShowDatePicker(false);
        fetchHistory(ymd);
      }}
      onCancel={() => setShowDatePicker(false)}
    />
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={isTablet ? styles.tabletContainer : styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {isTablet ? (
        <>
          <View style={styles.absoluteFill}>
            <View style={styles.decorativeBlob1} />
            <View style={styles.decorativeBlob2} />
            <View style={styles.decorativeBlob3} />
            <View style={styles.frostyOverlay} />
          </View>

          <View style={styles.tabletMain}>
            {/* Header */}
            <View style={styles.tabletHeader}>
              <View>
                <Text style={styles.tabletHeaderTitle}>Lịch sử nhật ký AI</Text>
                <Text style={{ fontSize: 14, color: '#7A8B70', marginTop: 2 }}>
                  {filterDate ? `Lọc: ${formatDateDisplay(filterDate)}` : 'Toàn bộ lịch sử'}
                  {' · '}{filteredHistory.length} bản ghi
                </Text>
              </View>
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

            {/* Filter bar */}
            <View style={{ paddingHorizontal: 32, paddingBottom: 8 }}>
              {renderFilterBar()}
            </View>

            <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              {renderList()}
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          <Header title="Lịch sử nhật ký AI" unreadCount={0} onNotificationPress={() => setShowNotiModal(true)} onAvatarPress={() => setShowSettingsModal(true)} />
          <View style={{ flex: 1 }}>
            <ImageBackground source={BG_IMAGE} style={{ flex: 1 }} imageStyle={{ opacity: 0.03 }}>
              <View style={{ padding: 16, flex: 1 }}>
                {renderFilterBar()}
                <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                  {renderList()}
                </ScrollView>
              </View>
            </ImageBackground>
          </View>
        </>
      )}

      {renderDatePickerModal()}
      <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </View>
  );
}
