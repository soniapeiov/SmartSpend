import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform,KeyboardAvoidingView } from 'react-native';
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
import { useAuth } from '../../context/AuthContext';
import { addExpense } from '../../services/database';
import { useAppInsets } from '../../hooks/useAppInsets';
import DateTimePicker from '@react-native-community/datetimepicker';

type ReviewExpenseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ReviewExpenseScreenRouteProp = RouteProp<RootStackParamList, 'ReviewExpenseScreen'>;

type CategoryType = 'Food' | 'Other' | 'Transportation' | 'Home' | 'Shopping';

const CATEGORIES: CategoryType[] = ['Food', 'Transportation', 'Shopping', 'Home', 'Other'];

const ReviewExpenseScreen = () => {
  const navigation = useNavigation<ReviewExpenseScreenNavigationProp>();
  const route = useRoute<ReviewExpenseScreenRouteProp>();
  const { firebaseUid } = useAuth();
  const { headerTop } = useAppInsets();

  const photoUri = route.params?.imagePath || '';

  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // Pre-fill fields with OCR results
  useEffect(() => {
    if (route.params?.total) setAmount(route.params.total);
    if (route.params?.date) {
      const cleanDate = route.params.date.replace(/\//g, '/');
      setDate(cleanDate);
      // Set selectedDate for DateTimePicker
      const [day, month, year] = cleanDate.split('/');
      setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    }
  }, [route.params]);

  const handleDatePickerChange = (event: any, pickedDate?: Date) => {
  if (event.type === 'dismissed') {
    setShowDatePicker(false);
    return;
  }
  if (pickedDate) {
    setShowDatePicker(false);
    setSelectedDate(pickedDate);
    const day = String(pickedDate.getDate()).padStart(2, '0');
    const month = String(pickedDate.getMonth() + 1).padStart(2, '0');
    const year = pickedDate.getFullYear();
    setDate(`${day}/${month}/${year}`);
  }
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
              routes: [{ name: 'Receipt' }],  
              index: 0,
            },
          },
        ],
      })
    );
  };

  const handleCategorySelect = (selectedCategory: CategoryType) => {
    setCategory(selectedCategory);
    setIsCategoryModalVisible(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Food': return <FoodIcon width={57} height={53} />;
      case 'Other': return <OtherIcon width={57} height={53} />;
      case 'Transportation': return <TransportationIcon width={57} height={53} />;
      case 'Home': return <HomeIcon width={57} height={53} />;
      case 'Shopping': return <ShoppingIcon width={57} height={53} />;
      default: return <OtherIcon width={57} height={53} />;
    }
  };

  const handleCancel = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', state: { routes: [{ name: 'Home' }], index: 0 } }],
      })
    );
  };

  const handleConfirm = async () => {
  if (!firebaseUid) {
    Alert.alert('Error', 'User not authenticated');
    return;
  }

  if (!date || !category || !amount) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    Alert.alert('Error', 'Invalid amount');
    return;
  }

  // Use receipt date at current time
  const [day, month, year] = date.split('/');
  const now = new Date();
  const timestamp = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ).getTime();

  //Date control for future 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedTimestamp = new Date(timestamp);
  selectedTimestamp.setHours(0, 0, 0, 0);

  if (selectedTimestamp.getTime() > today.getTime()) {
    Alert.alert('Invalid Date', 'You cannot add an expense for a future date');
    return;
  }

  const expenseType = route.params?.type || 'scan';

  try {
    await addExpense(
      firebaseUid,
      parsedAmount,
      category as any,
      timestamp,
      photoUri || undefined,
      expenseType
    );

    Alert.alert('Success', 'Expense added successfully');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', state: { routes: [{ name: 'Home' }], index: 0 } }],
      })
    );
  } catch (error) {
    console.error('❌ Error saving expense:', error);
    Alert.alert('Error', 'Failed to save expense');
  }
};

  return (
  <View style={styles.wrapper}>
    <View style={[styles.header, { paddingTop: headerTop }]}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack} activeOpacity={0.7}>
        <GoBackIcon width={19} height={16} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Review Expense</Text>
      <TouchableOpacity style={styles.notificationButton} onPress={handleNotification} activeOpacity={0.7}>
        <NotificationIcon width={14.57} height={18.86} />
      </TouchableOpacity>
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
          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={date ? styles.dateText : styles.datePlaceholder}>
                {date || 'DD / MM / YYYY'}
              </Text>
              <CalendarIcon width={20} height={20} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={handleDatePickerChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              activeOpacity={0.7}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text style={[styles.dropdownPlaceholder, category && { color: colors.textSecondary }]}>
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
            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} activeOpacity={0.7} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>

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
            <View style={styles.categoryIconContainer}>{getCategoryIcon(cat)}</View>
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
  aspectRatio: 3 / 4,
  backgroundColor: 'transparent', 
  borderRadius: 20,
  overflow: 'hidden',
  marginBottom: 24,
},
  photoPreview: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
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
  dateText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  datePlaceholder: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: 'rgba(9, 48, 48, 0.45)',
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