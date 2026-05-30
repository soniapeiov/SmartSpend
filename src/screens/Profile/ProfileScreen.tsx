import { useAppInsets } from '../../hooks/useAppInsets';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import NotificationIcon from '../../assets/images/Notificationicon.svg';
import LogoutIcon from '../../assets/images/Logouticon.svg';
import ProfileIcon from '../../assets/images/Profileicon.svg';
import EditProfileIcon from '../../assets/images/EditProfile.svg';
import SettingsIcon from '../../assets/images/Settings.svg';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../services/database';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout, firebaseUid } = useAuth();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserName = async () => {
      if (firebaseUid) {
        try {
          const userData = await getUser(firebaseUid);
          if (userData) {
            setUserName(userData.fullName);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUserName();
  }, [firebaseUid]);

  const handleNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  const handleGoBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [{ name: 'Home' }],
              index: 0,
            },
          },
        ],
      })
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleSettings = () => {
    navigation.navigate('SettingsScreen');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('✅ Logout successful');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
          activeOpacity={0.7}
        >
          <NotificationIcon width={14.57} height={18.86} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.profileIconContainer}>
          <ProfileIcon width={60} height={60} stroke="#FFFFFF" />
        </View>

        <Text style={styles.userName}>
          {userName}
        </Text>

        <TouchableOpacity 
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={handleEditProfile}
        >
          <EditProfileIcon width={57} height={53} />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuButton, styles.menuButtonSpacing]}
          activeOpacity={0.7}
          onPress={handleSettings}
        >
          <SettingsIcon width={57} height={53} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuButton, styles.menuButtonSpacing]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <LogoutIcon width={57} height={53} />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    marginBottom: 47,
  },
  goBackButton: {
    width: 19,
    height: 16,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  notificationButton: {
    width: 30,
    height: 30,
    backgroundColor: colors.successLight,
    borderRadius: 25.71,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#6DB6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 25,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: '#0E3E3E',
    textAlign: 'center',
    marginBottom: 50,
    textTransform: 'capitalize',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 70,
    width: '100%',
  },
  menuButtonSpacing: {
    marginTop: 35,
  },
  menuText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default ProfileScreen;