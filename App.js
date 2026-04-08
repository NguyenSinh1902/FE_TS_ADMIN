import React, { useState } from 'react';
import Start from './src/screens/Start';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import Menu from './src/screens/Menu';
import StaffManagement from './src/screens/StaffManagement';
import Facility from './src/screens/Facility';
import Finance from './src/screens/Finance';
import CategoryDetail from './src/screens/Menu/sub-screens/CategoryDetail';
import ProductDetail from './src/screens/Menu/sub-screens/ProductDetail';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Start');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screen, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Start':
        return <Start onNavigate={navigate} />;
      case 'Login':
        return <Login onNavigate={navigate} />;
      case 'Dashboard':
        return <Dashboard onNavigate={navigate} params={screenParams} />;
      case 'Menu':
        return <Menu onNavigate={navigate} params={screenParams} />;
      case 'StaffManagement':
        return <StaffManagement onNavigate={navigate} params={screenParams} />;
      case 'Facility':
        return <Facility onNavigate={navigate} params={screenParams} />;
      case 'Finance':
        return <Finance onNavigate={navigate} params={screenParams} />;
      case 'CategoryDetail':
        return <CategoryDetail onNavigate={navigate} params={screenParams} />;
      case 'ProductDetail':
        return <ProductDetail onNavigate={navigate} params={screenParams} />;
      default:
        return <Start onNavigate={navigate} />;
    }
  };

  return renderScreen();
};

export default App;
