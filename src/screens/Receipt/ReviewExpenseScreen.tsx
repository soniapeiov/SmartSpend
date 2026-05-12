/** MODIFIED ReviewExpenseScreen.tsx
 * RouteProp<RootStackParamList, 'ReviewExpense'> changed to 'ReviewExpenseScreen' to match the actual screen name in Navtypes.ts
 * photoUri now reads from route.params?.imagePath instead of route.params?.photoUri
 * useEffect now reads route.params?.total into amount and route.params?.date into date, replacing the old ocrData object */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Modal from 'react-native-modal';
import { RootStackParamList } from '../../navigation/Navtypes';  
import { colors } from '../../theme/colors';  
import { fonts } from '../../theme/fonts';  
import GoBackIcon from '../../assets/images/Gobackicon.svg';  
import NotificationIcon from '../../assets/images/Notificationicon.svg';  
import DropdownIcon from '../../assets/images/Dropdownicon.svg';  
import CalendarIcon from '../../assets/images/Calendaricon.svg';  
import FoodIcon from '../../assets/images/Food.svg';  
import OtherIcon from '../../assets/images/Other.svg';  
import TransportationIcon from '../../assets/images/Transportation.svg';  
import HomeIcon from '../../assets/images/Home.svg';  
import ShoppingIcon from '../../assets/images/Shopping.svg';  
import { CommonActions } from '@react-navigation/native';
import { addExpense } from '../../data/mockData';  

type ReviewExpenseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ReviewExpenseScreenRouteProp = RouteProp<RootStackParamList, 'ReviewExpenseScreen'>;

type CategoryType = 'Food' | 'Other' | 'Transportation' | 'Home' | 'Shopping';

const CATEGORIES: CategoryType[] = ['Food', 'Transportation', 'Shopping', 'Home', 'Other'];

const ReviewExpenseScreen = () => {
  const navigation = useNavigation<ReviewExpenseScreenNavigationProp>();
  const route = useRoute<ReviewExpenseScreenRouteProp>();
  
  // Updated to match what ScanScreen and GalleryScreen send
  const photoUri = route.params?.imagePath || '';

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

   // Pre-fill fields with OCR results
  useEffect(() => {
    if (route.params?.total) setAmount(route.params.total);
    if (route.params?.date) setDate(route.params.date.replace(/\//g, ' / '));
  }, [route.params]);

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + ' / ' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 4) + ' / ' + cleaned.slice(4, 8);
    }
    
    setDate(formatted);
  };

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

  const handleCategoryPress = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCategorySelect = (selectedCategory: CategoryType) => {
    setCategory(selectedCategory);
    setIsCategoryModalVisible(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Food':
        return <FoodIcon width={57} height={53} />;
      case 'Other':
        return <OtherIcon width={57} height={53} />;
      case 'Transportation':
        return <TransportationIcon width={57} height={53} />;
      case 'Home':
        return <HomeIcon width={57} height={53} />;
      case 'Shopping':
        return <ShoppingIcon width={57} height={53} />;
      default:
        return <OtherIcon width={57} height={53} />;
    }
  };

  const handleCancel = () => {
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

  const handleConfirm = () => {
    if (!date || !category || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const cleanDate = date.replace(/ \/ /g, '/');
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }

    const now = new Date();
    const [day, month, year] = cleanDate.split('/');
    
    const timestamp = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ).getTime();

    const expenseType = route.params?.type || 'scan'; // default to 'scan' if not provided

    addExpense({
      userId: 1,
      date: cleanDate,
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      category: category as any,
      amount: parsedAmount,
      type: expenseType,
      imageUrl: photoUri,
      createdAt: timestamp,
    });

    Alert.alert('Success', 'Expense added successfully');

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

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Review Expense</Text>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
          activeOpacity={0.7}
        >
          <NotificationIcon width={14.57} height={18.86} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image 
                source={{ uri: photoUri }} 
                style={styles.photoPreview}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.dateContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD / MM / YYYY"
                placeholderTextColor="rgba(9, 48, 48, 0.45)"
                value={date}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={14}
              />
              <CalendarIcon width={20} height={20} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <TouchableOpacity 
              style={styles.dropdownContainer}
              activeOpacity={0.7}
              onPress={handleCategoryPress}
            >
              <Text style={[
                styles.dropdownPlaceholder,
                category && { color: colors.textSecondary }
              ]}>
                {category || 'Select the category'}
              </Text>
              <DropdownIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="3.53"
              placeholderTextColor="rgba(9, 48, 48, 0.45)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.confirmButton}
              activeOpacity={0.7}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal
        isVisible={isCategoryModalVisible}
        onBackdropPress={() => setIsCategoryModalVisible(false)}
        onBackButtonPress={() => setIsCategoryModalVisible(false)}
        style={styles.modal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Category</Text>
          
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(cat)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIconContainer}>
                {getCategoryIcon(cat)}
              </View>
              <Text style={styles.categoryName}>{cat}</Text>
            </TouchableOpacity>
          ))}
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
    paddingTop: 69,
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
    paddingHorizontal: 37,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  photoPreviewContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
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
  dropdownContainer: {
    width: '100%',
    height: 44,
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: 'rgba(9, 48, 48, 0.45)',
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
  confirmButton: {
    flex: 1,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dateContainer: {
    width: '100%',
    height: 44,
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlignVertical: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 57,
    height: 53,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.primaryDark,
  },
});

export default ReviewExpenseScreen;