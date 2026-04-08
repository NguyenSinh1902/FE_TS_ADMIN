import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Polyline, Circle } from 'react-native-svg';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import styles from './Dashboard.styles';
import statsApi from '../../api/statsApi';
import { RefreshControl } from 'react-native';

export default function Dashboard({ onNavigate, params }) {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    doanhThuHomNay: 0,
    phanTramTangTruongDoanhThu: 0,
    soDonHang: 0,
    phanTramTangTruongDonHang: 0,
    monBanChayNhat: '...',
    soLuongMonBanChay: 0
  });
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await statsApi.getDashboardStats();
      const chartRes = await statsApi.getDailyChart();

      if (statsRes) setStats(statsRes);
      
      if (chartRes && Array.isArray(chartRes)) {
        const maxValue = Math.max(...chartRes.map(item => item.giaTri), 1);
        const mappedChart = chartRes.map(item => ({
          label: item.nhan,
          height: Math.max((item.giaTri / maxValue) * 150, 5) // Min height 5 for visibility
        }));
        setChartData(mappedChart);
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

  const MagicWandIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <Path d="M18 19L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
      <Path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const TrendUpIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const LightbulbIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18H15M10 21H14M12 3C7.58172 3 4 6.58172 4 11C4 13.5 5.5 15.5 7 16.5V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16.5C18.5 15.5 20 13.5 20 11C20 6.58172 16.4183 3 12 3Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const AlertCircleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
      <Path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );



  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header cố định (Fixed Header) tách khỏi ScrollView */}
      <Header 
        userName="Anna Trần"
        title="Dashboard & Thống kê" 
        unreadCount={3}
        onNotificationPress={() => console.log('Chuyển đến Thông báo')}
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
              style={styles.aiButtonWrap} 
              activeOpacity={0.8}
              onPress={() => setShowAIInsights(true)}
            >
              <LinearGradient colors={['#8BA367', '#9BB377', '#8BA367']} style={styles.aiButtonGradient}>
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.2)', 'rgba(0,0,0,0)']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <MagicWandIcon />
                <Text style={styles.aiText}>Phân tích & Gợi ý (AI)</Text>
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
    </View>
  );
}
