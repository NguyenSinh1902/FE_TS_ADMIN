import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import safeAsyncStorage from './src/utils/storage';

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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Start');

  useEffect(() => {
    checkLoginSession();
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
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Start" component={renderScreen(Start)} />
        <Stack.Screen name="Login" component={renderScreen(Login)} />
        <Stack.Screen name="Dashboard" component={renderScreen(Dashboard)} />
        <Stack.Screen name="Menu" component={renderScreen(Menu)} />
        <Stack.Screen name="StaffManagement" component={renderScreen(StaffManagement)} />
        <Stack.Screen name="Facility" component={renderScreen(Facility)} />
        <Stack.Screen name="Finance" component={renderScreen(Finance)} />
        <Stack.Screen name="AIHistory" component={renderScreen(AIHistory)} />
        <Stack.Screen name="CategoryDetail" component={renderScreen(CategoryDetail)} />
        <Stack.Screen name="ProductDetail" component={renderScreen(ProductDetail)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
