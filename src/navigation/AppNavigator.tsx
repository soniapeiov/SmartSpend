import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from './Navtypes';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import LaunchScreen from '../screens/LaunchScreen'; 
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { TabNavigator } from './TabNavigator';
import GalleryScreen from '../screens/Receipt/GalleryScreen';
import ScanScreen from '../screens/Receipt/ScanScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReviewExpenseScreen from '../screens/Receipt/ReviewExpenseScreen';
import AddManuallyScreen from '../screens/AddManuallyScreen';
import AddReceiptScreen from '../screens/Receipt/AddReceiptScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import SetLimitScreen from '../screens/Profile/SetLimitScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="ReviewExpenseScreen" component={ReviewExpenseScreen} />
          <Stack.Screen name="AddManuallyScreen" component={AddManuallyScreen} />
          <Stack.Screen name="AddReceiptScreen" component={AddReceiptScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="SetLimitScreen" component={SetLimitScreen} /> 
        </>
      ) : (
        <>
          <Stack.Screen name="Launch" component={LaunchScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;