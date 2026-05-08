import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import HomeIcon from '../assets/images/Homeicon.svg';
import AnalysisIcon from '../assets/images/Analysisicon.svg';
import CameraIcon from '../assets/images/Cameraicon.svg';
import AddManuallyIcon from '../assets/images/AddManuallyicon.svg';
import ProfileIcon from '../assets/images/Profileicon.svg';

interface TabBarProps {
  activeTab?: 'Home' | 'Analysis' | 'Receipt' | 'AddManually' | 'Profile';
}

export const TabBar = ({ activeTab = 'Receipt' }: TabBarProps) => {
  const navigation = useNavigation();

  const navigateToTab = (tabName: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [{ name: tabName }],
              index: 0,
            },
          },
        ],
      })
    );
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={[styles.iconContainer, activeTab === 'Home' && styles.activeIcon]}
        onPress={() => navigateToTab('Home')}
        activeOpacity={0.7}
      >
        <HomeIcon width={25} height={31} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, activeTab === 'Analysis' && styles.activeIcon]}
        onPress={() => navigateToTab('Analysis')}
        activeOpacity={0.7}
      >
        <AnalysisIcon width={31} height={30} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, activeTab === 'Receipt' && styles.activeIcon]}
        onPress={() => navigateToTab('Receipt')}
        activeOpacity={0.7}
      >
        <CameraIcon width={34} height={29} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, activeTab === 'AddManually' && styles.activeIcon]}
        onPress={() => navigateToTab('AddManually')}
        activeOpacity={0.7}
      >
        <AddManuallyIcon width={26} height={26} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, activeTab === 'Profile' && styles.activeIcon]}
        onPress={() => navigateToTab('Profile')}
        activeOpacity={0.7}
      >
        <ProfileIcon width={22} height={27} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 108,
    backgroundColor: '#DFF7E2',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingTop: 36,
    paddingBottom: 41,
    paddingHorizontal: 60,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
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