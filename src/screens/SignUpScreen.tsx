import { useAppInsets } from '../hooks/useAppInsets';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signup } = useAuth();

  // States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('+');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (text: string) => {
    if (!text.startsWith('+')) {
      setMobile('+' + text.replace(/[^0-9]/g, ''));
    } else {
      const cleaned = text.slice(1).replace(/[^0-9\s]/g, '');
      setMobile('+' + cleaned);
    }
  };

  // Form validation
  const validateForm = () => {
    // Full Name
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (fullName.trim().length < 3) {
      Alert.alert('Error', 'Full name must be at least 3 characters');
      return false;
    }

    // Email
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Mobile
    if (!mobile || mobile === '+') {
      Alert.alert('Error', 'Please enter your mobile number');
      return false;
    }
    const cleanedMobile = mobile.replace(/\s/g, '');
    if (cleanedMobile.length < 8) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return false;
    }

    // Password
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  // Firebase Sign Up using AuthContext
  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    const result = await signup(
      email.trim(),
      password,
      fullName.trim(),
      mobile.trim()
    );

    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      // AppNavigator automatically redirects to Main
    } else {
      // Firebase error messages
      const error = result.error;
      let errorMessage = 'Sign up failed. Please try again.';

      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Sign Up Failed', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.wrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="rgba(9, 48, 48, 0.45)"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor="rgba(9, 48, 48, 0.45)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+ 123 456 789"
            placeholderTextColor="rgba(9, 48, 48, 0.45)"
            value={mobile}
            onChangeText={handleMobileChange}
            keyboardType="phone-pad"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="●●●●●●●●"
              placeholderTextColor="rgba(14, 62, 62, 0.45)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.5}
              disabled={loading}
            >
              <Icon 
                name={showPassword ? "eye-slash" : "eye"}
                size={20} 
                color="#093030" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="●●●●●●●●"
              placeholderTextColor="rgba(14, 62, 62, 0.45)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.5}
              disabled={loading}
            >
              <Icon 
                name={showConfirmPassword ? "eye-slash" : "eye"}
                size={20} 
                color="#093030" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.signupButtonDisabled]}
          activeOpacity={0.7}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textSecondary} />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.loginPrompt}>
            Already have an account?  <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    height: 202,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  container: {
    paddingHorizontal: 37,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
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
  passwordContainer: {
    width: '100%',
    height: 44,
    backgroundColor: colors.successLight,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlignVertical: 'center',
  },
  eyeIcon: {
    padding: 5,
  },
  signupButton: {
    width: 207,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  loginPrompt: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginLink: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default SignUpScreen;