import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, StyleSheet, Modal, useWindowDimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Polyline, Circle } from 'react-native-svg';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../../components/Sidebar';
import styles from './Dashboard.styles';
import statsApi from '../../api/statsApi';
import { RefreshControl } from 'react-native';
import NotificationModal from '../../components/NotificationModal';
import SettingsModal from '../../components/SettingsModal';

const BG_IMAGE = require('../../assets/images/matcha_background.png');

export default function Dashboard({ onNavigate, params }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768; // Standard tablet threshold

  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    doanhThuHomNay: 0,
    phanTramTangTruongDoanhThu: 0,
    soDonHang: 0,
    phanTramTangTruongDonHang: 0,
    monBanChayNhat: '...',
    soLuongMonBanChay: 0,
    orderSources: [],
    peakHours: [],
    top5BanChay: [],
    top5BanCham: []
  });
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await statsApi.getDashboardStats();
      const chartRes = await statsApi.getDailyChart();

      if (statsRes) setStats(statsRes);

      if (chartRes && Array.isArray(chartRes) && chartRes.length > 0) {
        const maxValue = Math.max(...chartRes.map(item => item.giaTri), 1);
        const mappedChart = chartRes.map(item => ({
          label: item.nhan,
          height: Math.max((item.giaTri / maxValue) * 150, 5) // Min height 5 for visibility
        }));
        setChartData(mappedChart);
      } else {
        setChartData([
          { label: '9h', height: 5 },
          { label: '11h', height: 5 },
          { label: '13h', height: 5 },
          { label: '15h', height: 5 },
          { label: '17h', height: 5 },
          { label: '19h', height: 5 }
        ]);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

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
      <Path d="M5 8H19L17 21H7L5 8Z" stroke="#AD46FF" strokeWidth="2" strokeLinejoin="round" />
      <Path d="M9 3V8M15 3V8" stroke="#AD46FF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const CloseIcon = () => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const TrendUpIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const LightbulbIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18H15M10 21H14M12 3C7.58172 3 4 6.58172 4 11C4 13.5 5.5 15.5 7 16.5V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16.5C18.5 15.5 20 13.5 20 11C20 6.58172 16.4183 3 12 3Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const SparklesIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l1.91 5.81c.21.64.73 1.16 1.37 1.37L21 12l-5.72 1.82c-.64.21-1.16.73-1.37 1.37L12 21l-1.91-5.81c-.21-.64-.73-1.16-1.37-1.37L3 12l5.72-1.82c.64-.21 1.16-.73 1.37-1.37L12 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const AlertCircleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
      <Path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const SettingsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const renderStatCard = (label, value, percent, compare, icon, iconStyle) => (
    <View style={[styles.statCard, isTablet && { marginBottom: 0 }]}>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <View style={styles.statDetailRow}>
          <Text style={[styles.statPercent, percent < 0 && { color: '#EF4444' }]}>
            {percent > 0 ? '+' : ''}{percent}%
          </Text>
          <Text style={styles.statCompare}>{compare}</Text>
        </View>
      </View>
      <View style={[styles.iconBoxWrap, iconStyle]}>
        {icon}
      </View>
    </View>
  );

  const renderChart = (customStyle) => (
    <View style={[styles.chartCard, customStyle]}>
      <View style={styles.chartHeader}>
        <View style={styles.chartHeaderLeft}>
          <CalendarIcon />
          <Text style={styles.chartTitle}>Tăng trưởng doanh thu</Text>
        </View>
      </View>

      <View style={styles.segmentControl}>
        <TouchableOpacity style={[styles.segmentButton, styles.segmentButtonActive]}>
          <Text style={[styles.segmentText, styles.segmentTextActive]}>Ngày</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.segmentButton}>
          <Text style={styles.segmentText}>Tháng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.segmentButton}>
          <Text style={styles.segmentText}>Năm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartArea}>
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: 45 }]} />
        <View style={[styles.gridLine, { top: 90 }]} />
        <View style={[styles.gridLine, { top: 135 }]} />
        <View style={[styles.gridLine, { top: 180 }]} />

        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>6000</Text>
          <Text style={styles.yAxisLabel}>4500</Text>
          <Text style={styles.yAxisLabel}>3000</Text>
          <Text style={styles.yAxisLabel}>1500</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {chartData.map((item, index) => (
          <View key={index} style={styles.chartBarItem}>
            <LinearGradient
              colors={['rgba(139, 163, 103, 0.80)', 'rgba(139, 163, 103, 0.20)']}
              style={[styles.barCol, { height: item.height }]}
            />
            <Text style={styles.xAxisLabel}>{item.label}</Text>
          </View>
        ))}
      </View>


    </View>
  );

  const renderDonutChart = (sources) => {
    if (!sources || sources.length === 0) {
      return (
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 20, borderColor: 'rgba(139, 163, 103, 0.15)' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#8BA367', marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: '#4A5565' }}>Tại chỗ (0%)</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(139, 163, 103, 0.3)', marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: '#4A5565' }}>Mang về (0%)</Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 12, fontStyle: 'italic' }}>Chưa có dữ liệu hôm nay</Text>
        </View>
      );
    }

    const radius = 50;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    const colors = ['#8BA367', '#FCD34D', '#3B82F6', '#EF4444'];
    let currentOffset = 0;

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 120, height: 120, justifyContent: 'center', alignItems: 'center' }}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            {sources.map((item, index) => {
              const percentage = item.percentage || 0;
              const strokeLength = (percentage / 100) * circumference;
              const strokeDasharray = `${strokeLength} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += strokeLength;
              return (
                <Circle
                  key={index}
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  origin="60, 60"
                  rotation="-90"
                />
              );
            })}
          </Svg>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 24, gap: 16 }}>
          {sources.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors[index % colors.length], marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: '#4A5565' }}>{item.label || (item.source === 'TAI_CHO' ? 'Tại chỗ' : item.source === 'MANG_VE' ? 'Mang về' : item.source)} ({item.percentage}%)</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPeakHours = (hours) => {
    if (!hours || hours.length === 0) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={{ width: '100%', height: 100, backgroundColor: 'rgba(139, 163, 103, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.3)', borderStyle: 'dashed' }} />
          <Text style={{ fontSize: 12, color: '#6A7282', marginTop: 16 }}>(Chưa có dữ liệu)</Text>
        </View>
      );
    }

    const maxOrders = Math.max(...hours.map(h => h.orders), 1);

    return (
      <View style={{ width: '100%', height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
        {hours.map((item, index) => {
          const heightPercent = (item.orders / maxOrders) * 100;
          return (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: '#6A7282', marginBottom: 4, fontWeight: '600' }}>{item.orders > 0 ? item.orders : ''}</Text>
              <View style={{ width: '60%', maxWidth: 16, minHeight: 4, height: `${Math.max(heightPercent, 2)}%`, backgroundColor: item.orders === maxOrders && item.orders > 0 ? '#F59E0B' : '#8BA367', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
              <Text style={{ fontSize: 9, color: '#9CA3AF', marginTop: 6 }}>{item.hour.split(':')[0]}h</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTopList = (title, data) => (
    <View style={[styles.chartCard, { marginBottom: 0, flex: 1 }]}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1B2A15', marginBottom: 16 }}>{title}</Text>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 14, color: '#1E293B', flex: 1 }} numberOfLines={1}>{index + 1}. {item.tenMon}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#8BA367' }}>{item.soLuong} phần</Text>
          </View>
        ))
      ) : (
        <View style={{ width: '100%', height: 160, backgroundColor: 'rgba(139, 163, 103, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139, 163, 103, 0.2)', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#6A7282' }}>Chưa có dữ liệu 7 ngày qua</Text>
        </View>
      )}
    </View>
  );

  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        {/* Luxury Glassmorphism Background */}
        <ImageBackground source={BG_IMAGE} style={styles.absoluteFill} blurRadius={25}>
          <View style={styles.decorativeBlob1} />
          <View style={styles.decorativeBlob2} />
          <View style={styles.frostyOverlay} />
        </ImageBackground>

        <Sidebar
          activeRoute="Dashboard"
          onNavigate={onNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <View style={styles.tabletMain}>
          <View style={styles.tabletHeader}>
            <Text style={styles.tabletHeaderTitle}>Dashboard & Thống kê</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setShowNotiModal(true)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.4)', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1B2A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <View style={{ position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.4)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' }}>
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
            <View style={styles.tabletStatsGrid}>
              <View style={styles.tabletStatCardWrap}>
                {renderStatCard('Doanh thu hôm nay', `${stats.doanhThuHomNay.toLocaleString()}₫`, stats.phanTramTangTruongDoanhThu, 'vs hôm qua', <CoinIcon />, styles.iconBoxGreen)}
              </View>
              <View style={styles.tabletStatCardWrap}>
                {renderStatCard('Số đơn hàng', stats.soDonHang, stats.phanTramTangTruongDonHang, 'vs hôm qua', <BoxIcon />, styles.iconBoxBlue)}
              </View>
              <View style={styles.tabletStatCardWrap}>
                {renderStatCard('Món bán chạy nhất', stats.monBanChayNhat, stats.soLuongMonBanChay, 'món đã bán', <CupIcon />, styles.iconBoxPurple)}
              </View>
            </View>

            <View style={styles.tabletChartRow}>
              <View style={[styles.tabletChartCol, { display: 'flex', flexDirection: 'column' }]}>
                {renderChart({ flex: 1, marginBottom: 16 })}
                <TouchableOpacity
                  style={styles.aiWideButtonWrap}
                  activeOpacity={0.9}
                  onPress={() => setShowAIInsights(true)}
                >
                  <LinearGradient
                    colors={['#4A5D23', '#8BA367']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aiWideButtonGradient}
                  >
                    <SparklesIcon size={24} />
                    <Text style={styles.aiWideButtonText}>Xem phân tích chuyên sâu từ AI</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.tabletSideCols}>
                <View style={[styles.chartCard, { flex: 1, marginBottom: 0, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1B2A15', marginBottom: 16 }}>Tỷ lệ đơn hàng theo nguồn</Text>
                  {renderDonutChart(stats.orderSources)}
                </View>
                <View style={[styles.chartCard, { flex: 1, marginBottom: 0, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1B2A15', marginBottom: 16 }}>Khung giờ cao điểm</Text>
                  {renderPeakHours(stats.peakHours)}
                </View>
              </View>
            </View>

            {/* Top Products Tables */}
            <View style={[styles.tabletChartRow, { marginTop: 20 }]}>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                {renderTopList('Top 5 Sản phẩm Bán chạy', stats.top5BanChay)}
              </View>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                {renderTopList('Top 5 Sản phẩm Bán chậm', stats.top5BanCham)}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* AI Insights Modal remains same but can be centered better for tablet */}
        <Modal visible={showAIInsights} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxWidth: 600 }]}>
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

              <View style={styles.modalContent}>
                <View style={styles.insightCard}>
                  <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.13)' }]}>
                    <TrendUpIcon />
                  </View>
                  <View style={styles.insightTextWrap}>
                    <Text style={styles.insightTitle}>Tăng trưởng doanh thu</Text>
                    <Text style={styles.insightDesc}>Doanh thu tăng 15% so với tuần trước. Xu hướng tích cực!</Text>
                  </View>
                </View>

                <View style={styles.insightCard}>
                  <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.13)' }]}>
                    <LightbulbIcon />
                  </View>
                  <View style={styles.insightTextWrap}>
                    <Text style={styles.insightTitle}>Gợi ý chiến lược</Text>
                    <Text style={styles.insightDesc}>Nên tập trung đẩy mạnh Trà Đào Cam Sả vào khung giờ 14h-16h khi nhu cầu cao nhất.</Text>
                  </View>
                </View>

                <View style={styles.insightCard}>
                  <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.13)' }]}>
                    <AlertCircleIcon />
                  </View>
                  <View style={styles.insightTextWrap}>
                    <Text style={styles.insightTitle}>Cảnh báo tồn kho</Text>
                    <Text style={styles.insightDesc}>Nguyên liệu Trà Ô Long sắp hết. Đề xuất nhập thêm 50kg trong 2 ngày tới.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Text style={styles.modalFooterText}>Cập nhật lúc 08:22:15</Text>
              </View>
            </View>
          </View>
        </Modal>
        <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
        <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header cố định (Fixed Header) tách khỏi ScrollView */}
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

            {/* Revenue Stat */}
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Doanh thu hôm nay</Text>
                <Text style={styles.statValue}>{stats.doanhThuHomNay.toLocaleString()}₫</Text>
                <View style={styles.statDetailRow}>
                  <Text style={[styles.statPercent, stats.phanTramTangTruongDoanhThu < 0 && { color: '#EF4444' }]}>
                    {stats.phanTramTangTruongDoanhThu > 0 ? '+' : ''}{stats.phanTramTangTruongDoanhThu}%
                  </Text>
                  <Text style={styles.statCompare}>vs hôm qua</Text>
                </View>
              </View>
              <View style={[styles.iconBoxWrap, styles.iconBoxGreen]}>
                <CoinIcon />
              </View>
            </View>

            {/* Orders Stat */}
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Số đơn hàng</Text>
                <Text style={styles.statValue}>{stats.soDonHang}</Text>
                <View style={styles.statDetailRow}>
                  <Text style={[styles.statPercent, stats.phanTramTangTruongDonHang < 0 && { color: '#EF4444' }]}>
                    {stats.phanTramTangTruongDonHang > 0 ? '+' : ''}{stats.phanTramTangTruongDonHang}%
                  </Text>
                  <Text style={styles.statCompare}>vs hôm qua</Text>
                </View>
              </View>
              <View style={[styles.iconBoxWrap, styles.iconBoxBlue]}>
                <BoxIcon />
              </View>
            </View>

            {/* Best Seller Stat */}
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Món bán chạy nhất</Text>
                <Text style={styles.statValue}>{stats.monBanChayNhat}</Text>
                <View style={styles.statDetailRow}>
                  <Text style={styles.statPercent}>{stats.soLuongMonBanChay} món</Text>
                  <Text style={styles.statCompare}>đã bán</Text>
                </View>
              </View>
              <View style={[styles.iconBoxWrap, styles.iconBoxPurple]}>
                <CupIcon />
              </View>
            </View>

            {/* AI Assistant Button */}
            <TouchableOpacity
              style={styles.aiWideButtonWrap}
              activeOpacity={0.8}
              onPress={() => setShowAIInsights(true)}
            >
              <LinearGradient
                colors={['#8BA367', '#5D6D45']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiWideButtonGradient}
              >
                <SparklesIcon size={24} />
                <Text style={styles.aiWideButtonText}>Xem phân tích chuyên sâu từ AI</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Chart Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <CalendarIcon />
                <Text style={styles.chartTitle}>Tăng trưởng doanh thu</Text>
              </View>

              <View style={styles.segmentControl}>
                <TouchableOpacity style={[styles.segmentButton, styles.segmentButtonActive]}>
                  <Text style={[styles.segmentText, styles.segmentTextActive]}>Ngày</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.segmentButton}>
                  <Text style={styles.segmentText}>Tháng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.segmentButton}>
                  <Text style={styles.segmentText}>Năm</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.chartArea}>
                {/* Horizontal Grid lines */}
                <View style={[styles.gridLine, { top: 0 }]} />
                <View style={[styles.gridLine, { top: 45 }]} />
                <View style={[styles.gridLine, { top: 90 }]} />
                <View style={[styles.gridLine, { top: 135 }]} />
                <View style={[styles.gridLine, { top: 180 }]} />

                {/* Y Axis Labels */}
                <View style={styles.yAxis}>
                  <Text style={styles.yAxisLabel}>6000</Text>
                  <Text style={styles.yAxisLabel}>4500</Text>
                  <Text style={styles.yAxisLabel}>3000</Text>
                  <Text style={styles.yAxisLabel}>1500</Text>
                  <Text style={styles.yAxisLabel}>0</Text>
                </View>

                {/* Bars */}
                {chartData.map((item, index) => (
                  <View key={index} style={styles.chartBarItem}>
                    <LinearGradient
                      colors={['rgba(139, 163, 103, 0.80)', 'rgba(139, 163, 103, 0.20)']}
                      style={[styles.barCol, { height: item.height }]}
                    />
                    <Text style={styles.xAxisLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

            </View>

          </View>
        </ScrollView>
      </LinearGradient>

      {/* AI Insights Modal */}
      <Modal visible={showAIInsights} transparent={true} animationType="fade">
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

            <View style={styles.modalContent}>
              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.13)' }]}>
                  <TrendUpIcon />
                </View>
                <View style={styles.insightTextWrap}>
                  <Text style={styles.insightTitle}>Tăng trưởng doanh thu</Text>
                  <Text style={styles.insightDesc}>Doanh thu tăng 15% so với tuần trước. Xu hướng tích cực!</Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.13)' }]}>
                  <LightbulbIcon />
                </View>
                <View style={styles.insightTextWrap}>
                  <Text style={styles.insightTitle}>Gợi ý chiến lược</Text>
                  <Text style={styles.insightDesc}>Nên tập trung đẩy mạnh Trà Đào Cam Sả vào khung giờ 14h-16h khi nhu cầu cao nhất.</Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.13)' }]}>
                  <AlertCircleIcon />
                </View>
                <View style={styles.insightTextWrap}>
                  <Text style={styles.insightTitle}>Cảnh báo tồn kho</Text>
                  <Text style={styles.insightDesc}>Nguyên liệu Trà Ô Long sắp hết. Đề xuất nhập thêm 50kg trong 2 ngày tới.</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>Cập nhật lúc 08:22:15</Text>
            </View>

          </View>
        </View>
      </Modal>

      <BottomNav currentScreen="Dashboard" onNavigate={onNavigate} />
      
      <NotificationModal visible={showNotiModal} onClose={() => setShowNotiModal(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </View>
  );
}

