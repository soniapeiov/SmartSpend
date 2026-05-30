import { useAppInsets } from '../../hooks/useAppInsets';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import HomeIcon from '../../assets/images/Profileicon.svg';
import NotificationIcon from '../../assets/images/Notificationicon.svg';
import MoneyBagIcon from '../../assets/images/money-bag.svg';
import { useAuth } from '../../context/AuthContext';
import { deleteUser } from '../../services/database';
import { getAuth } from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { firebaseUid, logout } = useAuth();
  const [budgetAlertEnabled, setBudgetAlertEnabled] = useState(false);
  const [summaryEnabled, setSummaryEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleBudgetAlert = (value: boolean) => {
    setBudgetAlertEnabled(value);
  };

  const toggleSummary = (value: boolean) => {
    setSummaryEnabled(value);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setShowDeleteModal(false);

      if (!firebaseAuth.currentUser) {
        Alert.alert('Error', 'No user logged in.');
        return;
      }

      try {
        await firebaseAuth.currentUser.delete();
        console.log('✅ Firebase Auth user deleted');
      } catch (authError: any) {
        if (authError.code === 'auth/requires-recent-login') {
          Alert.alert(
            'Re-authentication Required',
            'For security, please log out and log in again, then try deleting your account.',
            [{ text: 'OK', onPress: () => logout() }]
          );
          return;
        }
        throw authError;
      }

      if (firebaseUid) {
        await deleteUser(firebaseUid);
        console.log('✅ SQLite user deleted');
      }

      try {
        await firebaseAuth.signOut();
      } catch (e) {
        console.log('SignOut after delete (expected):', e);
      }

      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');

    } catch (error: any) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const switchStyle = {
    transform: [
      { scaleX: Platform.OS === 'ios' ? 0.75 : 1.0 },
      { scaleY: Platform.OS === 'ios' ? 0.75 : 1.0 },
    ],
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

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.container}>

        {/* Budget Alert Switch */}
        <View style={styles.settingItem}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <NotificationIcon width={20} height={25} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.settingText}>Budget Alert</Text>
              <Text style={styles.settingSubtext}>Notify when budget is exceeded</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#D3D3D3', true: colors.primary }}
            thumbColor={budgetAlertEnabled ? '#FFFFFF' : '#F4F3F4'}
            ios_backgroundColor="#D3D3D3"
            onValueChange={toggleBudgetAlert}
            value={budgetAlertEnabled}
            style={switchStyle}
          />
        </View>

        {/* Summary Switch */}
        <View style={styles.settingItem}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <NotificationIcon width={20} height={25} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.settingText}>Spending Summary</Text>
              <Text style={styles.settingSubtext}>Weekly & monthly reports</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#D3D3D3', true: colors.primary }}
            thumbColor={summaryEnabled ? '#FFFFFF' : '#F4F3F4'}
            ios_backgroundColor="#D3D3D3"
            onValueChange={toggleSummary}
            value={summaryEnabled}
            style={switchStyle}
          />
        </View>
          {/* Set Limit */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SetLimitScreen')}
        >
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <MoneyBagIcon width={25} height={30} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.settingText}>Set Spending Limit</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Account */}
<TouchableOpacity
  style={styles.settingItem}
  activeOpacity={0.7}
  onPress={handleDeleteAccount}
>
  <View style={styles.leftContent}>
    <View style={styles.iconContainer}>
      <HomeIcon width={20} height={25} />
    </View>
    <View style={styles.textContent}>
      <Text style={styles.settingText}>Delete Account</Text>
    </View>
  </View>
</TouchableOpacity>

      </View>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>

            <Text style={styles.modalSubtitle}>
              Are You Sure You Want To Delete Your Account?
            </Text>

            <Text style={styles.modalDescription}>
              By deleting your account, you agree that you understand the consequences of this action and that you agree to permanently delete your account and all associated data.
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonText}>Yes, Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  placeholder: {
    width: 30,
    height: 30,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 50,
    paddingHorizontal: 45,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 24,
  },
  settingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  settingSubtext: {
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    opacity: 0.5,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: '#093030',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#093030',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: '#093030',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  deleteButton: {
    width: '85%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cancelButton: {
    width: '85%',
    height: 50,
    backgroundColor: colors.successLight,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#093030',
  },
});

export default SettingsScreen;