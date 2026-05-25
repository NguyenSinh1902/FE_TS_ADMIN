import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, StyleSheet, Modal, useWindowDimensions, Image } from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Polyline, Circle, Line, Defs, LinearGradient as SvgGradient, Stop, Text as TextSVG } from 'react-native-svg';
import Header from '../../components/Header';
import styles from './Dashboard.styles';
import statsApi from '../../api/statsApi';
import aiStrategyApi from '../../api/aiStrategyApi';
import { RefreshControl, ActivityIndicator } from 'react-native';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

const LeafIcon = ({ style, size = 120, opacity = 0.05 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M2 22C2 22 6 18 12 17C18 16 22 12 22 2C22 2 12 2 6 8C2.5 11.5 2 16 2 22Z" fill="#8BA367" opacity={opacity} />
    <Path d="M2 22C6 18 12 17 22 2" stroke="#8BA367" strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />
    <Path d="M8 14C11 13 14 10 17 6" stroke="#8BA367" strokeWidth="1" opacity={opacity} strokeLinecap="round" />
  </Svg>
);

const BobaCupIcon = ({ style, size = 120, opacity = 0.05 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M6 5 L18 5 L16 20 C16 21 15 22 14 22 L10 22 C9 22 8 21 8 20 L6 5" stroke="#8BA367" strokeWidth="1.5" opacity={opacity} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 5 L19 5" stroke="#8BA367" strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />
    <Path d="M14 2 L12 5" stroke="#8BA367" strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />
    <Circle cx="10" cy="18" r="1.5" fill="#8BA367" opacity={opacity} />
    <Circle cx="14" cy="18" r="1.5" fill="#8BA367" opacity={opacity} />
    <Circle cx="12" cy="16" r="1.5" fill="#8BA367" opacity={opacity} />
    <Circle cx="9" cy="15" r="1.5" fill="#8BA367" opacity={opacity} />
    <Circle cx="13" cy="14" r="1.5" fill="#8BA367" opacity={opacity} />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LightbulbIcon = ({ color = "#F59E0B", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendUpIcon = ({ color = "#10B981", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export default function Dashboard({ onNavigate, params }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // SECTION 1: TODAY
  const [overview, setOverview] = useState({
    doanhThuHomNay: 0,
    phanTramTangTruongDoanhThu: 0,
    soDonHang: 0,
    phanTramTangTruongDonHang: 0,
    monBanChayNhat: null
  });
  const [chartToday, setChartToday] = useState({ orderSources: [], peakHours: [] });

  // SECTION 2: PERIOD STATS
  const [timeFilter, setTimeFilter] = useState('ngay'); // ngay (tuan nay), tuan (thang nay), thang (nam nay), custom
  const [detailedStats, setDetailedStats] = useState({ tongDoanhThu: 0, tongSoDonHang: 0, monBanChayNhat: '...' });
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [topProducts, setTopProducts] = useState({ top5BanChay: [], top5BanCham: [] });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Custom date selector
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Format Date object → 'YYYY-MM-DD' cho API
  const formatDateToYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Format Date object → 'DD/MM/YYYY' để hiển thị UI
  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateString = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderGrowthBadge = (value, customStyle = {}) => {
    const val = Number(value) || 0;
    const isNegative = val < 0;
    const isZero = val === 0;
    const color = isNegative ? '#EF4444' : (isZero ? '#94A3B8' : '#059669');
    const arrow = isNegative ? '↘' : (isZero ? '→' : '↗');
    const sign = isNegative ? '' : (isZero ? '' : '+');

    return (
      <Text style={[styles.todayCardGrowth, customStyle, { color }]}>
        {arrow} {sign}{val}%
      </Text>
    );
  };

  const fetchAIAnalysis = async () => {
    setShowAIInsights(true);
    if (aiData) return;
    try {
      setAiLoading(true);
      setAiError('');
      const today = new Date().toISOString().split('T')[0];
      const res = await aiStrategyApi.analyze(today);
      setAiData(res);
    } catch (error) {
      console.error('Fetch AI error:', error);
      setAiError('Không thể lấy phân tích AI lúc này.');
    } finally {
      setAiLoading(false);
    }
  };

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

  const getDateRange = (filter) => {
    const today = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    let tuNgay, denNgay;
    denNgay = toYMD(today);

    if (filter === 'ngay') {
      // Tuần này: Từ Thứ 2 đến Chủ nhật của tuần hiện tại
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      tuNgay = toYMD(monday);
      denNgay = toYMD(sunday);
    } else if (filter === 'tuan') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      tuNgay = toYMD(startOfMonth);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      denNgay = toYMD(endOfMonth);
    } else if (filter === 'thang') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      tuNgay = toYMD(startOfYear);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      denNgay = toYMD(endOfYear);
    } else {
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      tuNgay = toYMD(monday);
      denNgay = toYMD(sunday);
    }
    return { tuNgay, denNgay };
  };

  const fetchOverviewData = async () => {
    try {
      const ovRes = await statsApi.getOverviewToday();
      const ctRes = await statsApi.getChartToday();
      if (ovRes) setOverview(ovRes);
      if (ctRes) setChartToday(ctRes);
    } catch (e) { console.error('Fetch overview error:', e); }
  };

  const fetchDetailedData = async (customStart, customEnd) => {
    setLoadingDetail(true);
    let tuNgay, denNgay;
    if (timeFilter === 'custom' && customStart && customEnd) {
      tuNgay = customStart;
      denNgay = customEnd;
    } else {
      const range = getDateRange(timeFilter);
      tuNgay = range.tuNgay;
      denNgay = range.denNgay;
    }

    if (!tuNgay || !denNgay) {
      setLoadingDetail(false);
      return;
    }

    try {
      const dsRes = await statsApi.getDetailedStats(tuNgay, denNgay);
      if (dsRes) setDetailedStats(dsRes);
    } catch (e) {
      console.error('Lỗi API getDetailedStats (chi-tiet):', e?.response?.config?.url || e.message);
    }

    try {
      const donVi = (timeFilter === 'custom' || timeFilter === 'ngay') ? 'ngay' : timeFilter;
      const rcRes = await statsApi.getRevenueChart(tuNgay, denNgay, donVi);
      if (rcRes && Array.isArray(rcRes) && rcRes.length > 0) {
        const maxValue = Math.max(...rcRes.map(item => item.giaTri), 1);
        const mappedChart = rcRes.map(item => ({
          label: item.nhan.includes(' - ') ? item.nhan.split(' - ')[0] : item.nhan,
          height: Math.max((item.giaTri / maxValue) * 140, 5),
          giaTri: item.giaTri,
          maxValue: maxValue
        }));
        setRevenueChartData(mappedChart);
      } else {
        setRevenueChartData([]);
      }
    } catch (e) {
      console.error('Lỗi API getRevenueChart (bieu-do-doanh-thu):', e?.response?.config?.url || e.message);
      setRevenueChartData([]);
    }

    try {
      const pmRes = await statsApi.getPaymentMethods(tuNgay, denNgay);
      if (pmRes) setPaymentMethods(pmRes);
    } catch (e) {
      console.error('Lỗi API getPaymentMethods (phuong-thuc-thanh-toan):', e?.response?.config?.url || e.message);
    }

    try {
      const tpRes = await statsApi.getTopProducts(tuNgay, denNgay);
      if (tpRes) setTopProducts(tpRes);
    } catch (e) {
      console.error('Lỗi API getTopProducts (top-san-pham):', e?.response?.config?.url || e.message);
    }

    setLoadingDetail(false);
  };

  React.useEffect(() => {
    fetchOverviewData();
  }, []);

  React.useEffect(() => {
    if (timeFilter !== 'custom') {
      fetchDetailedData();
    }
  }, [timeFilter]);

  const handleApplyCustomDate = () => {
    setShowDatePicker(false);
    setTimeFilter('custom');
    fetchDetailedData(formatDateToYMD(startDate), formatDateToYMD(endDate));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOverviewData();
    if (timeFilter === 'custom') {
      await fetchDetailedData(formatDateToYMD(startDate), formatDateToYMD(endDate));
    } else {
      await fetchDetailedData();
    }
    setRefreshing(false);
  };

  // SVGs & Icons
  const MagicWandIcon = ({ size = 24, color = "white" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <Path d="M18 19L22 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const CalendarIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Rect x="3" y="4" width="14" height="14" rx="2" stroke="#8BA367" strokeWidth="1.5" />
      <Path d="M3 8H17" stroke="#8BA367" strokeWidth="1.5" />
      <Path d="M7 2V6" stroke="#8BA367" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M13 2V6" stroke="#8BA367" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );

  const CoinIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#00BC7D" strokeWidth="2" />
      <Path d="M12 7V17" stroke="#00BC7D" strokeWidth="2" strokeLinecap="round" />
      <Path d="M9 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H9" stroke="#00BC7D" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const BoxIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="6" width="16" height="14" rx="2" stroke="#2B7FFF" strokeWidth="2" />
      <Path d="M4 10H20" stroke="#2B7FFF" strokeWidth="2" />
      <Path d="M10 14H14" stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const CupIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M5 8H19L17 21H7L5 8Z" stroke="#8BA367" strokeWidth="2" strokeLinejoin="round" />
      <Path d="M9 3V8M15 3V8" stroke="#8BA367" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const CloseIcon = () => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const renderBestSellerCardContent = () => {
    const defaultImg = require('../../assets/images/matcha_background.png');
    const p = overview.monBanChayNhat;

    if (!p) {
      return (
        <View style={[styles.innerChartCard, { marginTop: 10, padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: -12, marginBottom: -12 }]}>
          <Text style={{ fontSize: 11, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu hôm nay</Text>
        </View>
      );
    }

    const tenSanPham = p.tenSanPham || 'Chưa xác định';
    const soLuongDaBan = p.soLuongDaBan || 0;
    const giaBan = p.giaBanMacDinh ? `${p.giaBanMacDinh.toLocaleString()}₫` : '';
    const imgSource = p.duongDanAnh ? { uri: p.duongDanAnh } : defaultImg;
    const doanhThu = p.giaBanMacDinh ? (p.giaBanMacDinh * soLuongDaBan).toLocaleString() : null;
    const DAILY_GOAL = 20;
    const progress = Math.min((soLuongDaBan / DAILY_GOAL) * 100, 100);

    return (
      <View style={[styles.innerChartCard, { marginTop: 12, padding: 16, flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', marginHorizontal: -12, marginBottom: -12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={imgSource}
              style={{ width: 70, height: 70, borderRadius: 14, marginRight: 14, borderWidth: 2, borderColor: '#FFF' }}
              resizeMode="cover"
            />
            <View style={{ position: 'absolute', top: -6, right: 8, backgroundColor: '#F59E0B', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1.5, borderColor: '#FFF' }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#FFF' }}>TOP 1</Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1B2A15', marginBottom: 4 }} numberOfLines={2}>{tenSanPham}</Text>
            {p.giaBanMacDinh ? (
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#D97706' }}>{giaBan}</Text>
            ) : null}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 14 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#10B981' }}>{soLuongDaBan}</Text>
            <Text style={{ fontSize: 11, color: '#7A8B70', fontWeight: '600', marginTop: 2 }}>Số phần đã bán</Text>
          </View>
          {doanhThu ? (
            <>
              <View style={{ width: 1, backgroundColor: 'rgba(0,0,0,0.07)' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#D97706' }} numberOfLines={1} adjustsFontSizeToFit>{doanhThu}₫</Text>
                <Text style={{ fontSize: 11, color: '#7A8B70', fontWeight: '600', marginTop: 2 }}>Doanh thu ước tính</Text>
              </View>
            </>
          ) : null}
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#7A8B70' }}>🎯 Mục tiêu ngày</Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#8BA367' }}>{soLuongDaBan}/{DAILY_GOAL}</Text>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${progress}%`, backgroundColor: progress >= 100 ? '#10B981' : '#8BA367', borderRadius: 4 }} />
          </View>
        </View>
      </View>
    );
  };

  const getDetailedBestSellerName = (val) => {
    if (!val) return '...';
    if (typeof val === 'object') {
      return val.tenSanPham || '...';
    }
    return val;
  };

  const getRevenueChartTitleSuffix = () => {
    const today = new Date();
    if (timeFilter === 'ngay') return ' - Tuần này';
    if (timeFilter === 'tuan') return ` - Tháng ${today.getMonth() + 1}`;
    if (timeFilter === 'thang') return ` - Năm ${today.getFullYear()}`;
    if (timeFilter === 'custom') return ` - Từ ${formatDateDisplay(startDate)} đến ${formatDateDisplay(endDate)}`;
    return '';
  };

  // SECTION 1 HELPER RENDERERS
  const renderPeakHoursCompact = (hours) => {
    if (!hours || hours.length === 0) {
      return (
        <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: '#5C6955', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    const maxOrders = Math.max(...hours.map(h => h.orders), 1);
    const minItemWidth = 28;
    const svgW = Math.max(isTablet ? 400 : 320, hours.length * minItemWidth);
    const svgH = 180;
    const paddingLeft = 32;
    const paddingBottom = 28;
    const paddingRight = 10;
    const chartW = svgW - paddingLeft - paddingRight;
    const chartH = svgH - paddingBottom;

    const points = hours.map((item, index) => {
      const x = paddingLeft + (index / (hours.length - 1)) * chartW;
      const y = chartH - ((item.orders / maxOrders) * chartH) + 5;
      return `${x},${y}`;
    }).join(' ');

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: svgH }}>
        <Svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {[0, 0.5, 1].map((ratio, i) => {
            const y = chartH - (chartH * ratio) + 5;
            const val = Math.round(maxOrders * ratio);
            return (
              <React.Fragment key={`grid_${i}`}>
                <Line x1={paddingLeft} y1={y} x2={svgW} y2={y} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                <TextSVG x={paddingLeft - 8} y={y + 4} fontSize="12" fill="#7A8B70" fontWeight="600" textAnchor="end">{val}</TextSVG>
              </React.Fragment>
            );
          })}
          <Polyline points={points} fill="none" stroke="#8BA367" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {hours.map((item, index) => {
            const x = paddingLeft + (index / (hours.length - 1)) * chartW;
            const y = chartH - ((item.orders / maxOrders) * chartH) + 5;
            return (
              <React.Fragment key={`dot_${index}`}>
                <Circle cx={x} cy={y} r="4" fill="rgba(139, 163, 103, 0.3)" />
                <Circle cx={x} cy={y} r="2" fill="#8BA367" />
              </React.Fragment>
            );
          })}
          {hours.map((item, index) => {
            const hourNum = parseInt(item.hour.split(':')[0]);
            if (hourNum % 3 !== 0) return null;
            const x = paddingLeft + (index / (hours.length - 1)) * chartW;
            return (
              <TextSVG key={`lbl_${index}`} x={x} y={svgH - 4} fontSize="12" fill="#7A8B70" fontWeight="600" textAnchor="middle">{hourNum}:00</TextSVG>
            );
          })}
        </Svg>
      </ScrollView>
    );
  };

  const renderDonutChartCompact = (sources) => {
    if (!sources || sources.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: '#5C6955', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    // Normalize sources to always have both TAI_CHO and MANG_VE
    let normalizedSources = [];
    const taiCho = sources.find(s => s.source === 'TAI_CHO' || (s.label && s.label.toLowerCase().includes('tại chỗ')));
    const mangVe = sources.find(s => s.source === 'MANG_VE' || (s.label && s.label.toLowerCase().includes('mang về')));

    normalizedSources.push(taiCho || { source: 'TAI_CHO', percentage: 0, label: 'Tại chỗ' });
    normalizedSources.push(mangVe || { source: 'MANG_VE', percentage: 0, label: 'Mang về' });

    const radius = 52;
    const strokeWidth = 22;
    const size = 200;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    let currentOffset = 0;

    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {/* Donut chart SVG */}
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {normalizedSources.map((item, index) => {
              const percentage = item.percentage || 0;
              if (percentage === 0) return null;

              const strokeLength = (percentage / 100) * circumference;
              const strokeDasharray = `${strokeLength} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += strokeLength;

              return (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  origin={`${center}, ${center}`}
                  rotation="-90"
                />
              );
            })}
          </Svg>
        </View>

        {/* Legend — width cố định, không dùng flex:1 để tránh collapse */}
        <View style={{ flexDirection: 'column', gap: 12 }}>
          {normalizedSources.map((item, index) => (
            <View key={`lgd_${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors[index % colors.length], marginRight: 8, flexShrink: 0 }} />
              <View>
                <Text style={{ fontSize: 13, color: '#1B2A15', fontWeight: '700' }}>
                  {item.label || (item.source === 'TAI_CHO' ? 'Tại chỗ' : 'Mang về')}
                </Text>
                <Text style={{ fontSize: 16, color: colors[index % colors.length], fontWeight: '900', marginTop: 1 }}>
                  {item.percentage || 0}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // SECTION 2 HELPER RENDERERS
  const renderDetailedRevenueChart = () => {
    if (!revenueChartData || revenueChartData.length === 0) {
      return (
        <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    const maxVal = revenueChartData[0]?.maxValue || 1000;
    const yAxisLabels = [maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25, 0];

    const dataPointsCount = revenueChartData.length;
    // Each slot is 80px wide; chart is ~80% of tablet width when few bars, else scroll
    const minItemWidth = 80;
    const targetChartW = Math.round((isTablet ? 600 : 400) * 0.8);
    const widthChart = Math.max(targetChartW, dataPointsCount * minItemWidth);
    const actualItemWidth = widthChart / dataPointsCount;
    const barWidth = Math.min(36, actualItemWidth * 0.4); // max 36px, 40% of slot
    const heightChart = 280;
    const paddingBottom = 28;
    const paddingTop = 10;
    const innerChartH = heightChart - paddingBottom - paddingTop;
    const yAxisWidth = 52;

    return (
      <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, paddingVertical: 16, paddingLeft: 8, paddingRight: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E1F', marginBottom: 16, marginLeft: 8 }}>Tăng trưởng doanh thu{getRevenueChartTitleSuffix()}</Text>
        <View style={{ flexDirection: 'row', height: heightChart + 20 }}>
          {/* Y Axis fixed on left */}
          <View style={{ width: yAxisWidth, height: heightChart, justifyContent: 'space-between', paddingBottom: paddingBottom, paddingTop: paddingTop }}>
            {yAxisLabels.map((val, i) => {
              let labelText = Math.round(val).toString();
              if (val >= 1000000) labelText = (val / 1000000).toFixed(1) + 'M';
              else if (val >= 1000) labelText = (val / 1000).toFixed(1) + 'k';
              return (
                <Text key={i} style={{ fontSize: 12, color: '#7A8B70', fontWeight: '600', textAlign: 'right', paddingRight: 8 }}>
                  {labelText}
                </Text>
              );
            })}
          </View>

          {/* Scrollable Bar Chart */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ width: widthChart, height: heightChart }}>
              {/* Grid Lines via SVG */}
              <Svg width={widthChart} height={heightChart} style={{ position: 'absolute' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingTop + innerChartH * (1 - ratio);
                  return <Line key={i} x1={0} y1={y} x2={widthChart} y2={y} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />;
                })}
              </Svg>

              {/* Bars */}
              <View style={{ position: 'absolute', top: paddingTop, left: 0, right: 0, height: innerChartH, flexDirection: 'row', alignItems: 'flex-end' }}>
                {revenueChartData.map((item, index) => {
                  const itemRatio = (item.giaTri || 0) / maxVal;
                  const barH = Math.max(itemRatio * innerChartH, 4);
                  return (
                    <View key={index} style={{ width: actualItemWidth, alignItems: 'center', justifyContent: 'flex-end', height: innerChartH }}>
                      <View style={{ width: barWidth, height: barH, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#8BA367' }} />
                    </View>
                  );
                })}
              </View>

              {/* X Labels */}
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: paddingBottom, flexDirection: 'row' }}>
                {revenueChartData.map((item, index) => (
                  <View key={index} style={{ width: actualItemWidth, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#7A8B70', fontWeight: '700', textAlign: 'center' }}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderPaymentMethods = () => {
    if (!paymentMethods || paymentMethods.length === 0) {
      return (
        <View style={{ marginTop: 24, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E1F', marginBottom: 12 }}>Cơ cấu phương thức thanh toán</Text>
          <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    return (
      <View style={{ marginTop: 24, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E1F', marginBottom: 16 }}>Cơ cấu phương thức thanh toán</Text>
        <View style={{ gap: 16 }}>
          {paymentMethods.map((pm, index) => {
            const isCash = pm.code === 'TIEN_MAT';
            const barColor = isCash ? '#F59E0B' : '#3B82F6';
            const bgColor = isCash ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)';
            return (
              <View key={index}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#3C4A35' }}>{pm.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: barColor }}>{pm.phanTram}% ({pm.soLuongDon} đơn)</Text>
                </View>
                <View style={{ height: 12, backgroundColor: bgColor, borderRadius: 6, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${pm.phanTram}%`, backgroundColor: barColor, borderRadius: 6 }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderListRowItem = (rank, name, qty) => (
    <View style={styles.listRowItem} key={rank}>
      <Text style={styles.listRowRank}>{rank}.</Text>
      <Text style={styles.listRowName} numberOfLines={1}>{name}</Text>
      <Text style={styles.listRowQty}>{qty} phần</Text>
    </View>
  );

  const renderSection2Skeleton = () => (
    <View style={styles.bottomRowContainer}>
      {/* Left Column Skeleton */}
      <View style={styles.bottomColLeft}>
        <View style={styles.microCardsRow}>
          {[1, 2, 3].map((k) => (
            <View style={styles.microCard} key={k}>
              <View style={[styles.microCardContent, { height: 60, justifyContent: 'center' }]}>
                <View style={{ width: '60%', height: 10, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 5, marginBottom: 6 }} />
                <View style={{ width: '80%', height: 14, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 7 }} />
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 180, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#8BA367" />
        </View>
      </View>

      {/* Right Column Skeleton */}
      <View style={styles.bottomColRight}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, height: 250, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 16, padding: 12, justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map((k) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '70%', height: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 6 }} />
                <View style={{ width: '20%', height: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 6 }} />
              </View>
            ))}
          </View>
          <View style={{ flex: 1, height: 250, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 16, padding: 12, justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map((k) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '70%', height: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 6 }} />
                <View style={{ width: '20%', height: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 6 }} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderModals = () => (
    <>
      {/* Date range picker modal */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide" statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 360 }]}>
            {/* Header */}
            <LinearGradient colors={['#8BA367', '#6A8050']} style={[styles.modalHeader, { borderTopLeftRadius: 24, borderTopRightRadius: 24 }]}>
              <View style={styles.modalHeaderLeft}>
                <CalendarIcon />
                <View style={[styles.modalHeaderTextContainer, { marginLeft: 10 }]}>
                  <Text style={styles.modalTitle}>Chọn khoảng thời gian</Text>
                  <Text style={styles.modalSubtitle}>Nhấn vào từng ô để chọn ngày</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowDatePicker(false)}>
                <CloseIcon />
              </TouchableOpacity>
            </LinearGradient>

            <View style={{ padding: 20 }}>
              {/* Từ ngày */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#5C6955', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Từ ngày</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9F1', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1.5, borderColor: '#C4D6A4' }}
                activeOpacity={0.7}
              >
                <CalendarIcon />
                <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#1B2A15', flex: 1 }}>
                  {formatDateDisplay(startDate)}
                </Text>
                <Text style={{ fontSize: 12, color: '#8BA367', fontWeight: '600' }}>Thay đổi ›</Text>
              </TouchableOpacity>

              {/* Đến ngày */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#5C6955', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Đến ngày</Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9F1', borderRadius: 14, padding: 14, marginBottom: 24, borderWidth: 1.5, borderColor: '#C4D6A4' }}
                activeOpacity={0.7}
              >
                <CalendarIcon />
                <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#1B2A15', flex: 1 }}>
                  {formatDateDisplay(endDate)}
                </Text>
                <Text style={{ fontSize: 12, color: '#8BA367', fontWeight: '600' }}>Thay đổi ›</Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={{ flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyCustomDate}
                  style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#8BA367', '#5D6D45']} style={{ paddingVertical: 13, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>Áp dụng</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Native DatePicker — Ngày bắt đầu */}
      <DatePicker
        modal
        open={showStartPicker}
        date={startDate}
        mode="date"
        locale="vi"
        maximumDate={endDate}
        title="Chọn ngày bắt đầu"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={(date) => {
          setShowStartPicker(false);
          setStartDate(date);
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      {/* Native DatePicker — Ngày kết thúc */}
      <DatePicker
        modal
        open={showEndPicker}
        date={endDate}
        mode="date"
        locale="vi"
        minimumDate={startDate}
        maximumDate={new Date()}
        title="Chọn ngày kết thúc"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={(date) => {
          setShowEndPicker(false);
          setEndDate(date);
        }}
        onCancel={() => setShowEndPicker(false)}
      />

      {/* AI Insights Modal */}
      <Modal visible={showAIInsights} transparent={true} animationType="fade" statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#8BA367', '#9BB377']} style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <MagicWandIcon />
                <View style={styles.modalHeaderTextContainer}>
                  <Text style={styles.modalTitle}>AI Insights</Text>
                  <Text style={styles.modalSubtitle}>Phân tích bởi Gemini AI</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAIInsights(false)}>
                <CloseIcon />
              </TouchableOpacity>
            </LinearGradient>

            <View style={[styles.modalContent, { maxHeight: 520 }]}>
              {aiLoading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#8BA367" />
                  <Text style={{ marginTop: 16, color: '#6A7282', fontSize: 15 }}>AI đang phân tích dữ liệu...</Text>
                </View>
              ) : aiError ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#EF4444', fontSize: 15 }}>{aiError}</Text>
                </View>
              ) : aiData ? (
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                  <View style={{ padding: 20, backgroundColor: 'rgba(139, 163, 103, 0.05)', borderRadius: 16 }}>
                    {renderAIInsights(aiData.loiKhuyenAi)}
                  </View>
                </ScrollView>
              ) : null}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={{ paddingVertical: 12, alignItems: 'center' }} onPress={() => { setShowAIInsights(false); onNavigate('AIHistory'); }}>
                <Text style={{ color: '#8BA367', fontSize: 14, fontWeight: '700' }}>Xem lịch sử nhật ký AI</Text>
              </TouchableOpacity>
              {aiData && aiData.thoiGianTao && (
                <Text style={styles.modalFooterText}>Cập nhật lúc {new Date(aiData.thoiGianTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );

  if (isTablet) {
    return (<>
      <View style={styles.tabletContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />


        <LinearGradient colors={['#F5F4EE', '#EBF5E6', '#F5F4EE']} style={styles.tabletMain}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingTop: 32, marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#1B2A15' }}>Dashboard & Thống kê</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setShowNotiModal(true)} style={styles.iconBtn}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <View style={{ position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={styles.iconBtn}>
                <SettingsIcon />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.tabletContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />
            }
          >
            {/* Decors on Main area */}
            <BobaCupIcon style={[styles.decorativeLeaf, { top: -20, right: 40, transform: [{ rotate: '15deg' }] }]} size={160} opacity={0.08} />
            <LeafIcon style={[styles.decorativeLeaf, { top: 180, left: -20, transform: [{ rotate: '-25deg' }] }]} size={140} opacity={0.06} />
            <BobaCupIcon style={[styles.decorativeLeaf, { bottom: 100, right: 50, transform: [{ rotate: '-10deg' }] }]} size={180} opacity={0.06} />
            <LeafIcon style={[styles.decorativeLeaf, { top: 500, right: -30, transform: [{ rotate: '45deg' }] }]} size={200} opacity={0.05} />
            <LeafIcon style={[styles.decorativeLeaf, { bottom: 200, left: 40, transform: [{ rotate: '120deg' }] }]} size={120} opacity={0.07} />

            {/* ================= PHẦN 1: TỔNG QUAN HÔM NAY (Bố cục Ngang & Pastel Gradients) ================= */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#5C6955', marginBottom: 12, letterSpacing: 0.5 }}>TỔNG QUAN HÔM NAY</Text>

              <View style={styles.tabletStatsGrid}>
                {/* Card 1: Doanh thu - Green Gradient */}
                <View style={styles.tabletStatCardWrapLeft}>
                  <LinearGradient colors={['#E8F5E9', '#81C784']} style={[styles.todayCardGradient, { flexDirection: 'column' }]}>
                    <View>
                      <Text style={[styles.todayCardLabel, { fontSize: 16, marginBottom: 8 }]}>Doanh thu hôm nay</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={[styles.todayCardValue, { fontSize: 32, fontWeight: '900' }]}>{overview.doanhThuHomNay.toLocaleString()}₫</Text>
                        <View style={{ alignItems: 'flex-end', paddingTop: 4 }}>
                          {renderGrowthBadge(overview.phanTramTangTruongDoanhThu, { fontSize: 14, fontWeight: '700' })}
                          <Text style={[styles.todayCardCompare, { fontSize: 12, marginTop: 2 }]}>vs. hôm qua</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.innerChartCard, { flex: 1, marginTop: 12 }]}>
                      <Text style={styles.innerCardTitle}>Biểu đồ Khung giờ</Text>
                      {renderPeakHoursCompact(chartToday.peakHours)}
                    </View>
                  </LinearGradient>
                </View>

                {/* Card 2: Đơn hàng - Blue Gradient */}
                <View style={styles.tabletStatCardWrapMiddle}>
                  <LinearGradient colors={['#E3F2FD', '#90CAF9']} style={[styles.todayCardGradient, { flexDirection: 'column' }]}>
                    <View>
                      <Text style={[styles.todayCardLabel, { fontSize: 16, marginBottom: 8 }]}>Số đơn hàng hôm nay</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={[styles.todayCardValue, { fontSize: 32, fontWeight: '900' }]}>{overview.soDonHang} đơn</Text>
                        <View style={{ alignItems: 'flex-end', paddingTop: 4 }}>
                          {renderGrowthBadge(overview.phanTramTangTruongDonHang, { fontSize: 14, fontWeight: '700' })}
                          <Text style={[styles.todayCardCompare, { fontSize: 12, marginTop: 2 }]}>vs. hôm qua</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.innerChartCard, { marginTop: 12 }]}>
                      <Text style={styles.innerCardTitle}>Tỷ lệ loại đơn hàng</Text>
                      {renderDonutChartCompact(chartToday.orderSources)}
                    </View>
                  </LinearGradient>
                </View>

                {/* Card 3: Bán chạy nhất - Gold Gradient */}
                <View style={[styles.tabletStatCardWrapRight, { flexDirection: 'column' }]}>
                  <LinearGradient colors={['#FEF9E7', '#FAD7A1']} style={[styles.todayCardGradient, { flex: 1, padding: 18, marginBottom: 16 }]}>
                    <Text style={[styles.todayCardLabel, { color: '#B9770E', fontSize: 14 }]}>Món bán chạy nhất hôm nay</Text>
                    {renderBestSellerCardContent()}
                  </LinearGradient>

                  {/* AI Capsule Button situated underneath Card 3, matching width */}
                  <TouchableOpacity
                    style={styles.aiCapsuleBtn}
                    activeOpacity={0.8}
                    onPress={fetchAIAnalysis}
                  >
                    <LinearGradient
                      colors={['#1B2A15', '#4A5D23']}
                      style={styles.aiBtnGradient}
                    >
                      <SparklesIcon size={20} color="#FFD700" />
                      <Text style={styles.aiCapsuleBtnText}>Xem phân tích AI</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

            {/* ================= PHẦN 2: THỐNG KÊ CHI TIẾT (Bọc khối tổng thể & 55/45) ================= */}
            <View style={styles.section2Container}>
              <View style={styles.toolbarRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#1B2A15' }}>THỐNG KÊ CHI TIẾT</Text>
                  <LeafIcon style={{ marginLeft: 6, transform: [{ rotate: '15deg' }] }} size={20} opacity={0.7} />
                </View>

                {/* Toolbar controls */}
                <View style={styles.toolbarRight}>
                  <View style={styles.segmentControl}>
                    <TouchableOpacity onPress={() => setTimeFilter('ngay')} style={[styles.segmentButton, timeFilter === 'ngay' && styles.segmentButtonActive]}>
                      <Text style={[styles.segmentText, timeFilter === 'ngay' && styles.segmentTextActive]}>Tuần này</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTimeFilter('tuan')} style={[styles.segmentButton, timeFilter === 'tuan' && styles.segmentButtonActive]}>
                      <Text style={[styles.segmentText, timeFilter === 'tuan' && styles.segmentTextActive]}>Tháng này</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTimeFilter('thang')} style={[styles.segmentButton, timeFilter === 'thang' && styles.segmentButtonActive]}>
                      <Text style={[styles.segmentText, timeFilter === 'thang' && styles.segmentTextActive]}>Năm nay</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePillBtn}>
                    <CalendarIcon />
                    <Text style={styles.datePillText}>Khoảng thời gian</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {loadingDetail ? (
                renderSection2Skeleton()
              ) : (
                <View style={styles.bottomRowContainer}>
                  {/* Left Column (55%): 3 micro cards + Scrollable Line Chart */}
                  <View style={styles.bottomColLeft}>
                    {/* Micro cards placed right above the chart */}
                    <View style={styles.microCardsRow}>
                      <View style={[styles.microCard, { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 0, padding: 14, flexDirection: 'column', justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                            <View style={{ transform: [{ scale: 0.7 }] }}><CoinIcon /></View>
                          </View>
                          <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 12, flexShrink: 1 }} numberOfLines={1}>Tổng Doanh Thu</Text>
                        </View>
                        <Text style={{ color: '#15803D', fontSize: 20, fontWeight: '800', textAlign: 'center', width: '100%' }} numberOfLines={1} adjustsFontSizeToFit>{detailedStats.tongDoanhThu.toLocaleString()}₫</Text>
                      </View>

                      <View style={[styles.microCard, { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 0, padding: 14, flexDirection: 'column', justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                            <View style={{ transform: [{ scale: 0.7 }] }}><BoxIcon /></View>
                          </View>
                          <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 12, flexShrink: 1 }} numberOfLines={1}>Tổng Đơn</Text>
                        </View>
                        <Text style={{ color: '#1D4ED8', fontSize: 20, fontWeight: '800', textAlign: 'center', width: '100%' }} numberOfLines={1} adjustsFontSizeToFit>{detailedStats.tongSoDonHang}</Text>
                      </View>

                      <View style={[styles.microCard, { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 0, padding: 14, flexDirection: 'column', justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#FEF9E7', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                            <View style={{ transform: [{ scale: 0.7 }] }}><CupIcon /></View>
                          </View>
                          <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 12, flexShrink: 1 }} numberOfLines={1}>Bán chạy nhất</Text>
                        </View>
                        <Text style={{ color: '#B45309', fontSize: 20, fontWeight: '800', textAlign: 'center', width: '100%' }} numberOfLines={1} adjustsFontSizeToFit>{getDetailedBestSellerName(detailedStats.monBanChayNhat)}</Text>
                      </View>
                    </View>

                    {renderDetailedRevenueChart()}
                    {renderPaymentMethods()}
                  </View>

                  {/* Right Column (45%): Top 5 Selling & Top 5 Slow Selling stacked */}
                  <View style={styles.bottomColRight}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.8)' }}>

                      {/* Top Selling */}
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1B2A15', marginBottom: 16 }}>Top 5 sản phẩm bán chạy nhất</Text>
                        {topProducts.top5BanChay && topProducts.top5BanChay.length > 0 ? (
                          topProducts.top5BanChay.map((item, index) =>
                            renderListRowItem(index + 1, item.tenSanPham, item.soLuong)
                          )
                        ) : (
                          <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
                        )}
                      </View>

                      {/* AI Insight Tip */}
                      <View style={{ marginVertical: 24, backgroundColor: 'rgba(244, 249, 241, 0.8)', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4D6A4', borderStyle: 'dashed' }}>
                        <Text style={{ fontSize: 24, marginRight: 12 }}>✨</Text>
                        <Text style={{ flex: 1, fontSize: 13, color: '#4A5D23', fontWeight: '600', fontStyle: 'italic', lineHeight: 20 }}>
                          Gợi ý: Thử kết hợp sản phẩm bán chạy và bán chậm thành Combo để tối ưu doanh số!
                        </Text>
                      </View>

                      {/* Top Slow */}
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1B2A15', marginBottom: 16 }}>Top 5 sản phẩm bán chậm nhất</Text>
                        {topProducts.top5BanCham && topProducts.top5BanCham.length > 0 ? (
                          topProducts.top5BanCham.map((item, index) =>
                            renderListRowItem(index + 1, item.tenSanPham, item.soLuong)
                          )
                        ) : (
                          <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
                        )}
                      </View>

                    </View>
                  </View>
                </View>
              )}
            </View>

          </ScrollView>
        </LinearGradient>
      </View>
      {renderModals()}
    </>);
  }

  // ================= MOBILE LAYOUT =================
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Header
        userName="Anna Trần"
        title="Dashboard & Thống kê"
        unreadCount={3}
        onNotificationPress={() => setShowNotiModal(true)}
        onAvatarPress={() => console.log('Chuyển đến Profile cá nhân')}
      />

      <LinearGradient colors={['#F5F3EE', '#FFFFFF', '#E8F5E0']} style={styles.gradientBg}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8BA367']} />
          }
        >
          <View style={styles.contentContainer}>
            {/* Decors */}
            <BobaCupIcon style={[styles.decorativeLeaf, { top: -10, right: -20, transform: [{ rotate: '15deg' }] }]} size={140} opacity={0.08} />
            <LeafIcon style={[styles.decorativeLeaf, { top: 250, left: -30, transform: [{ rotate: '-25deg' }] }]} size={120} opacity={0.06} />
            <BobaCupIcon style={[styles.decorativeLeaf, { bottom: 150, right: 10, transform: [{ rotate: '-15deg' }] }]} size={160} opacity={0.06} />
            <LeafIcon style={[styles.decorativeLeaf, { bottom: 30, left: 50, transform: [{ rotate: '60deg' }] }]} size={100} opacity={0.05} />

            {/* ================= SECTION 1: TODAY OVERVIEW ================= */}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.mobileSectionTitle}>Tổng quan hôm nay</Text>

              {/* Doanh thu card */}
              <LinearGradient colors={['#E8F5E9', '#81C784']} style={[styles.todayCardGradient, { height: 280, marginBottom: 12 }]}>
                <View>
                  <Text style={styles.todayCardLabel}>Doanh thu hôm nay</Text>
                  <View style={styles.todayCardValueRow}>
                    <Text style={styles.todayCardValue}>{overview.doanhThuHomNay.toLocaleString()}₫</Text>
                    {renderGrowthBadge(overview.phanTramTangTruongDoanhThu)}
                  </View>
                  <Text style={styles.todayCardCompare}>vs. hôm qua</Text>
                </View>
                <View style={[styles.innerChartCard, { flex: 1, marginTop: 16 }]}>
                  <Text style={styles.innerCardTitle}>Biểu đồ Khung giờ</Text>
                  {renderPeakHoursCompact(chartToday.peakHours)}
                </View>
              </LinearGradient>

              {/* Don hang card */}
              <LinearGradient colors={['#E3F2FD', '#90CAF9']} style={[styles.todayCardGradient, { height: 280, marginBottom: 12, flexDirection: 'column' }]}>
                <View>
                  <Text style={styles.todayCardLabel}>Số đơn hàng hôm nay</Text>
                  <View style={styles.todayCardValueRow}>
                    <Text style={styles.todayCardValue}>{overview.soDonHang} đơn</Text>
                    {renderGrowthBadge(overview.phanTramTangTruongDonHang)}
                  </View>
                  <Text style={styles.todayCardCompare}>vs. hôm qua</Text>
                </View>
                <View style={[styles.innerChartCard, { flex: 1, marginTop: 16 }]}>
                  <Text style={styles.innerCardTitle}>Tỷ lệ loại đơn hàng</Text>
                  {renderDonutChartCompact(chartToday.orderSources)}
                </View>
              </LinearGradient>

              {/* Best seller card */}
              <LinearGradient colors={['#FEF9E7', '#FAD7A1']} style={[styles.todayCardGradient, { height: 210, marginBottom: 16 }]}>
                <Text style={[styles.todayCardLabel, { color: '#B9770E', fontSize: 14 }]}>Món bán chạy nhất hôm nay</Text>
                {renderBestSellerCardContent()}
              </LinearGradient>

              {/* AI Assistant Button */}
              <TouchableOpacity
                style={[styles.aiCapsuleBtn, { marginBottom: 16 }]}
                activeOpacity={0.8}
                onPress={fetchAIAnalysis}
              >
                <LinearGradient
                  colors={['#1B2A15', '#4A5D23']}
                  style={styles.aiBtnGradient}
                >
                  <SparklesIcon size={20} color="#FFD700" />
                  <Text style={styles.aiCapsuleBtnText}>Xem phân tích AI</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ================= SECTION 2: PERIOD STATS ================= */}
            <View style={styles.section2Container}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#1B2A15' }}>THỐNG KÊ CHI TIẾT</Text>

                {/* Segment Filter */}
                <View style={[styles.segmentControl, { marginRight: 0 }]}>
                  <TouchableOpacity onPress={() => setTimeFilter('ngay')} style={[styles.segmentButton, timeFilter === 'ngay' && styles.segmentButtonActive]}>
                    <Text style={[styles.segmentText, { fontSize: 10 }, timeFilter === 'ngay' && styles.segmentTextActive]}>Tuần</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTimeFilter('tuan')} style={[styles.segmentButton, timeFilter === 'tuan' && styles.segmentButtonActive]}>
                    <Text style={[styles.segmentText, { fontSize: 10 }, timeFilter === 'tuan' && styles.segmentTextActive]}>Tháng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTimeFilter('thang')} style={[styles.segmentButton, timeFilter === 'thang' && styles.segmentButtonActive]}>
                    <Text style={[styles.segmentText, { fontSize: 10 }, timeFilter === 'thang' && styles.segmentTextActive]}>Năm</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.datePillBtn, { marginBottom: 16, width: 140 }]}>
                <CalendarIcon />
                <Text style={styles.datePillText}>Khoảng thời gian</Text>
              </TouchableOpacity>

              {loadingDetail ? (
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#8BA367" />
                </View>
              ) : (
                <>
                  {/* Micro Cards */}
                  <View style={{ gap: 10, marginBottom: 16 }}>
                    <View style={styles.microCardContent}>
                      <Text style={styles.microCardLabel}>Tổng Doanh Thu</Text>
                      <Text style={styles.microCardValue}>{detailedStats.tongDoanhThu.toLocaleString()}₫</Text>
                    </View>
                    <View style={styles.microCardContent}>
                      <Text style={styles.microCardLabel}>Tổng Số Đơn Hàng</Text>
                      <Text style={styles.microCardValue}>{detailedStats.tongSoDonHang}</Text>
                    </View>
                    <View style={styles.microCardContent}>
                      <Text style={styles.microCardLabel}>Sản phẩm bán chạy nhất</Text>
                      <Text style={[styles.microCardValue, { fontSize: 14 }]} numberOfLines={1}>{getDetailedBestSellerName(detailedStats.monBanChayNhat)}</Text>
                    </View>
                  </View>

                  {/* Revenue Chart */}
                  {renderDetailedRevenueChart()}

                  {renderPaymentMethods()}

                  {/* Top Products lists */}
                  <View style={{ gap: 16, marginTop: 16 }}>
                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E1F', marginBottom: 12 }}>Top 5 sản phẩm bán chạy nhất</Text>
                      {topProducts.top5BanChay && topProducts.top5BanChay.length > 0 ? (
                        topProducts.top5BanChay.map((item, index) =>
                          renderListRowItem(index + 1, item.tenSanPham, item.soLuong)
                        )
                      ) : (
                        <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
                      )}
                    </View>

                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E1F', marginBottom: 12 }}>Top 5 sản phẩm bán chậm nhất</Text>
                      {topProducts.top5BanCham && topProducts.top5BanCham.length > 0 ? (
                        topProducts.top5BanCham.map((item, index) =>
                          renderListRowItem(index + 1, item.tenSanPham, item.soLuong)
                        )
                      ) : (
                        <Text style={{ fontSize: 13, color: '#7A8B70', fontStyle: 'italic' }}>Chưa có dữ liệu</Text>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>

          </View>
        </ScrollView>
      </LinearGradient>


      {renderModals()}
    </View>
  );
}
