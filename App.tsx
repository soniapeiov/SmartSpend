import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { createTables } from './src/services/database';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await createTables();
        console.log('✅ Database initialized');
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
      }
    };
    initDatabase();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}