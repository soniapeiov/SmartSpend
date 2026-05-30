import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from './Navtypes';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import AddReceiptScreen from '../screens/Receipt/AddReceiptScreen';
import AddManuallyScreen from '../screens/AddManuallyScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import HomeIcon from '../assets/images/Homeicon.svg';
import AnalysisIcon from '../assets/images/Analysisicon.svg';
import CameraIcon from '../assets/images/Cameraicon.svg';
import AddManuallyIcon from '../assets/images/AddManuallyicon.svg';
import ProfileIcon from '../assets/images/Profileicon.svg';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72 + insets.bottom,  // safe area'ya göre otomatik ayarlanır
          backgroundColor: '#DFF7E2',
          borderTopLeftRadius: 70,
          borderTopRightRadius: 70,
          paddingTop: 16,
          paddingBottom: insets.bottom || 16,
          paddingHorizontal: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <HomeIcon width={25} height={31} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Analysis" 
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <AnalysisIcon width={31} height={30} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Receipt" 
        component={AddReceiptScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <CameraIcon width={34} height={29} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="AddManually" 
        component={AddManuallyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <AddManuallyIcon width={26} height={26} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <ProfileIcon width={22} height={27} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    width: 57,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },
});