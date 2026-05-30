import { useAppInsets } from '../../hooks/useAppInsets';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import ProfileIcon from '../../assets/images/Profileicon.svg';
import { useAuth } from '../../context/AuthContext';
import { getUser, updateUser } from '../../services/database';
import { firebaseAuth } from '../../services/firebase';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { firebaseUid } = useAuth();
  const { headerTop } = useAppInsets();
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUid) {
        try {
          const userData = await getUser(firebaseUid);
          if (userData) {
            setUserName(userData.fullName);
            setPhone(userData.phone);
            setEmail(userData.email);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUserData();
  }, [firebaseUid]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUpdateProfile = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (userName.trim().length < 3) {
      Alert.alert('Error', 'Name must be at least 3 characters');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await updateUser(firebaseUid!, {
        fullName: userName.trim(),
        phone: phone.trim(),
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordPress = () => {
    setShowChangePasswordModal(true);
  };

  const handleConfirmChangePassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    setLoading(true);
    setShowChangePasswordModal(false);
    
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelChangePassword = () => {
    setShowChangePasswordModal(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit My Profile</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Profile Icon */}
          <View style={styles.profileIconContainer}>
            <ProfileIcon width={60} height={60} stroke="#FFFFFF" />
          </View>

          {/* User Name Display */}
          <Text style={styles.displayName}>
            {userName}
          </Text>

          {/* Account Settings Title */}
          <Text style={styles.sectionTitle}>Account Settings</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter username"
              placeholderTextColor="rgba(9, 48, 48, 0.45)"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="rgba(9, 48, 48, 0.45)"
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={[styles.updateButton, loading && styles.updateButtonDisabled]}
            onPress={handleUpdateProfile}
            activeOpacity={0.7}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>

          {/* Change Password Link */}
          <TouchableOpacity 
            activeOpacity={0.5}
            onPress={handleChangePasswordPress}
            disabled={loading}
          >
            <Text style={styles.changePasswordLink}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Confirmation Modal */}
      <Modal
        visible={showChangePasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelChangePassword}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Do You Want To Change Your Password?</Text>
            
            <Text style={styles.modalDescription}>
              We will send you an email to reset your password.
            </Text>

            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleConfirmChangePassword}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelChangePassword}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please check your email. We've sent you a link to reset your password.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              activeOpacity={0.7}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 37,
    paddingTop: 30,
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  displayName: {
    fontSize: 25,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: '#0E3E3E',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#093030',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlignVertical: 'center',
  },
  updateButton: {
    width: 207,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  changePasswordLink: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  // Modal Styles
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
    fontSize: 18,
    fontFamily: fonts.bold,
    fontWeight: '700',
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
  nextButton: {
    width: '70%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cancelButton: {
    width: '70%',
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
  modalText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    width: 120,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  placeholder: {
    width: 30,
    height: 30,
  },
});

export default EditProfileScreen;