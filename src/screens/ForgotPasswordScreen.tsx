import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleNextStep = () => {
  console.log('Next step clicked, email:', email);
  console.log('Setting modal to true');
  setShowModal(true);
};

  return (
    <KeyboardAvoidingView 
      style={styles.wrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Reset Password?</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account. We'll send you a secure link to create a new password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor="rgba(9, 48, 48, 0.45)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            selectTextOnFocus={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          activeOpacity={0.7}
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signupButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.5}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupPrompt}>
            Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please check your email. We've sent you a link to reset your password.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              activeOpacity={0.7}
              onPress={() => setShowModal(false)}
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
    height: 187,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 36,
    paddingTop: 34,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#0E3E3E',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0E3E3E',
    textAlign: 'center',
    width: '100%',
    maxWidth: 359,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 60,
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
  nextButton: {
    width: 207,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextButtonText: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  signupButton: {
    width: 207,
    height: 45,
    backgroundColor: colors.successLight,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#0E3E3E',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  signupPrompt: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signupLink: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 350,
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
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default ForgotPasswordScreen;