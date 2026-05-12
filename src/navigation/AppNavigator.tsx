import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navtypes';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Launch" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ReviewExpenseScreen" component={ReviewExpenseScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;