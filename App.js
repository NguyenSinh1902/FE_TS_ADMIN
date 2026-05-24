import React, { useState, useEffect } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, ActivityIndicator, useWindowDimensions, DeviceEventEmitter, LogBox } from 'react-native';
import safeAsyncStorage from './src/utils/storage';
import { RealtimeProvider } from './src/context/RealtimeContext';
import { NotificationProvider } from './src/context/NotificationContext';

LogBox.ignoreAllLogs();

import Sidebar from './src/components/Sidebar';
import BottomNav from './src/components/BottomNav';

import Start from './src/screens/Start';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import Menu from './src/screens/Menu';
import StaffManagement from './src/screens/StaffManagement';
import Facility from './src/screens/Facility';
import Finance from './src/screens/Finance';
import AIHistory from './src/screens/AIHistory';
import CategoryDetail from './src/screens/Menu/sub-screens/CategoryDetail';
import ProductDetail from './src/screens/Menu/sub-screens/ProductDetail';

const Stack = createNativeStackNavigator();
const TabStack = createNativeStackNavigator();

const MainAppTabs = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState(route?.params?.screen || 'Dashboard');

  const handleNavigate = (screen, params) => {
    if (screen === 'Start' || screen === 'Login') {
      if (params?.reset) {
        navigation.reset({ index: 0, routes: [{ name: screen }] });
      } else {
        navigation.navigate(screen, params);
      }
      return;
    }

    setCurrentTab(screen); // Eager update

    if (params?.reset) {
      navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen, params: params?.params || {} } }] });
    } else {
      navigation.navigate('Main', { screen, params });
    }
  };

  const renderScreen = (Component, extraProps = {}) => {
    return ({ navigation: childNav, route: childRoute }) => (
      <Component 
        {...extraProps}
        params={childRoute.params || {}}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <View style={{ flex: 1, flexDirection: isTablet ? 'row' : 'column', backgroundColor: '#F8FAFC' }}>
       {isTablet && (
         <Sidebar 
            activeTab={currentTab}
            onNavigate={handleNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
         />
       )}
       <View style={{ flex: 1 }}>
         <TabStack.Navigator 
           screenOptions={{ headerShown: false, animation: 'none' }}
           screenListeners={{
             state: (e) => {
               // Sync state when Android physical back button is pressed or navigation happens
               if (e.data?.state?.routes) {
                 const routes = e.data.state.routes;
                 const activeRouteName = routes[routes.length - 1].name;
                 setCurrentTab(activeRouteName);
               }
             }
           }}
         >
           <TabStack.Screen name="Dashboard" component={renderScreen(Dashboard)} />
           <TabStack.Screen name="Menu" component={renderScreen(Menu)} />
           <TabStack.Screen name="StaffManagement" component={renderScreen(StaffManagement)} />
           <TabStack.Screen name="Facility" component={renderScreen(Facility)} />
           <TabStack.Screen name="Finance" component={renderScreen(Finance)} />
           <TabStack.Screen name="AIHistory" component={renderScreen(AIHistory)} />
         </TabStack.Navigator>
       </View>
       {!isTablet && (
         <BottomNav 
            activeTab={currentTab}
            onNavigate={handleNavigate}
         />
       )}
    </View>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Start');

  useEffect(() => {
    checkLoginSession();

    // ─── FCM Setup ─────────────────────────────────────────────────────────────────────
    // Để dùng FCM: chạy 'npm install @react-native-firebase/app @react-native-firebase/messaging'
    // trong thư mục MatchTeaManager, sau đó rebuild app.
    let unsubscribeFCM = () => {};
    try {
      const messaging = require('@react-native-firebase/messaging').default;

      const setupFCM = async () => {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            await messaging().subscribeToTopic('admin');
            console.log('[FCM] ✅ Subscribed to admin topic');
          }
        } catch (e) {
          console.log('[FCM] Permission error:', e.message);
        }
      };
      setupFCM();

      unsubscribeFCM = messaging().onMessage(async remoteMessage => {
        DeviceEventEmitter.emit('FCM_MESSAGE', remoteMessage);
      });
    } catch (e) {
      console.log('[FCM] Package not installed yet – skip FCM setup');
    }

    return () => unsubscribeFCM();
  }, []);

  const checkLoginSession = async () => {
    try {
      const token = await safeAsyncStorage.getItem('token');
      const userStr = await safeAsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (token && user && user.vaiTro !== 'PHUC_VU' && user.vaiTro !== 'THU_NGAN') {
        setInitialRoute('Dashboard');
      } else {
        // Nếu có token nhưng vai trò không hợp lệ, xóa session
        if (token) {
          await safeAsyncStorage.removeItem('token');
          await safeAsyncStorage.removeItem('user');
        }
        setInitialRoute('Start');
      }
    } catch (e) {
      setInitialRoute('Start');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    );
  }

  const renderScreen = (Component, extraProps = {}) => {
    return ({ navigation, route }) => (
      <Component 
        {...extraProps}
        params={route.params || {}}
        onNavigate={(screen, params) => {
          if (params?.goBack) {
            navigation.goBack();
          } else if (params?.reset) {
            navigation.reset({
              index: 0,
              routes: [{ name: screen, params: params?.params || {} }],
            });
          } else {
            navigation.navigate(screen, params);
          }
        }}
      />
    );
  };

  return (
    <NotificationProvider>
      <RealtimeProvider>
        <NavigationContainer>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <Stack.Navigator
            initialRouteName={initialRoute === 'Dashboard' ? 'Main' : initialRoute}
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
          >
            <Stack.Screen name="Start" component={renderScreen(Start)} />
            <Stack.Screen name="Login" component={renderScreen(Login)} />
            <Stack.Screen name="Main" component={MainAppTabs} />
            <Stack.Screen name="CategoryDetail" component={renderScreen(CategoryDetail)} />
            <Stack.Screen name="ProductDetail" component={renderScreen(ProductDetail)} />
          </Stack.Navigator>
        </NavigationContainer>
      </RealtimeProvider>
    </NotificationProvider>
  );
};

export default App;
