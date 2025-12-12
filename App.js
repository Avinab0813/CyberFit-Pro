import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar, NativeModules } from 'react-native'; 
import { AuthProvider, AuthContext } from './src/context/AuthContext'; 
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/AuthScreen';

// Sub-component to handle logic inside the Provider
const RootNavigation = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#D4FF00" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {isAuthenticated ? <AppNavigator /> : <AuthScreen />}
    </>
  );
};

export default function App() {
  // Disable Shake Menu
  useEffect(() => {
    if (NativeModules.DevSettings) {
      NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false);
    }
  }, []);

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}