import { useAppInsets } from '../../hooks/useAppInsets';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';

type SetLimitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SetLimitScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<SetLimitScreenNavigationProp>();

  const [dailyLimit, setDailyLimit] = useState('');
  const [weeklyLimit, setWeeklyLimit] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');

  const handleGoBack = () => {
    navigation.navigate('SettingsScreen');
  };

  const handleSave = () => {
    // TODO: database e kaydet
  };

  const handleCancel = () => {
    navigation.navigate('SettingsScreen');
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

        <Text style={styles.headerTitle}>Set Spending Limit</Text>

        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Daily Limit */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Daily Limit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00 €"
                  placeholderTextColor="rgba(9, 48, 48, 0.45)"
                  value={dailyLimit}
                  onChangeText={setDailyLimit}
                  keyboardType="decimal-pad"
                />
            </View>

            {/* Weekly Limit */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weekly Limit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00 €"
                  placeholderTextColor="rgba(9, 48, 48, 0.45)"
                  value={weeklyLimit}
                  onChangeText={setWeeklyLimit}
                  keyboardType="decimal-pad"
                />
            </View>

            {/* Monthly Limit */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Monthly Limit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00 €"
                  placeholderTextColor="rgba(9, 48, 48, 0.45)"
                  value={monthlyLimit}
                  onChangeText={setMonthlyLimit}
                  keyboardType="decimal-pad"
                />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.7}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.7}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 17,
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
    paddingHorizontal: 37,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 44,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    height: 40,
    backgroundColor: colors.successLight,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: '#0E3E3E',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SetLimitScreen;