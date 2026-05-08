import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import NotificationIcon from '../assets/images/Notificationicon.svg';
import MoneyIcon from '../assets/images/Moneyicon.svg';
import FoodIcon from '../assets/images/Food.svg';
import OtherIcon from '../assets/images/Other.svg';
import TransportationIcon from '../assets/images/Transportation.svg';
import HomeIcon from '../assets/images/Home.svg';
import ShoppingIcon from '../assets/images/Shopping.svg';
import { 
  getTotalExpenses, 
  getExpensesByPeriod, 
  deleteExpense,
  Expense 
} from '../data/mockData';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  const [refreshKey, setRefreshKey] = useState(0);  // ✅ Yeniden render için

  const totalExpenses = getTotalExpenses(selectedPeriod);
  const expenses = getExpensesByPeriod(selectedPeriod);

  const formattedAmount = totalExpenses.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  // Delete expense
  const handleDelete = (item: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this ${item.category} expense (${item.amount.toFixed(2)}€)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(item.id);  // ✅ Mock data'dan sil
            setRefreshKey(prev => prev + 1);  // ✅ Yeniden render
          },
        },
      ]
    );
  };

  // Edit expense
const handleEdit = (item: Expense) => {
  // @ts-ignore - Tab navigator'a navigate
  navigation.navigate('Main', {
    screen: 'AddManually',
    params: {
      editMode: true,
      expense: {
        id: item.id,
        date: item.date,
        category: item.category,
        amount: item.amount,
      },
    },
  });
};

  // Kategori ikonunu getir
  const getCategoryIcon = (category: string) => {
    switch (category) {
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

  // Tarih formatla
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${time} - ${month} ${day}`;
  };

  // Harcama item render
  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItemFront}>
      <View style={styles.categoryIconContainer}>
        {getCategoryIcon(item.category)}
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.category}</Text>
        <Text style={styles.categoryDateTime}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <Text style={styles.expenseAmount}>{item.amount.toFixed(2)}€</Text>
    </View>
  );

  // Hidden buttons
  const renderHiddenItem = ({ item }: { item: Expense }) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        style={[styles.hiddenButton, styles.editButton]}
        onPress={() => handleEdit(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.hiddenButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.hiddenButton, styles.deleteButton]}
        onPress={() => handleDelete(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.hiddenButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hi, Welcome</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
          activeOpacity={0.7}
        >
          <NotificationIcon width={14.57} height={18.86} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Total Expenses Card */}
        <View style={styles.totalExpensesCard}>
          <Text style={styles.totalExpensesLabel}>Total Expenses</Text>
          <View style={styles.amountRow}>
            <View style={styles.moneyIconContainer}>
              <MoneyIcon width={41} height={38} />
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>{formattedAmount} €</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'daily' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('daily')}
            activeOpacity={0.7}
          >
            <Text style={styles.periodText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'weekly' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('weekly')}
            activeOpacity={0.7}
          >
            <Text style={styles.periodText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'monthly' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('monthly')}
            activeOpacity={0.7}
          >
            <Text style={styles.periodText}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        <SwipeListView
          key={refreshKey}  // ✅ Yeniden render için
          data={expenses}
          renderItem={renderExpenseItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.expensesList}
          showsVerticalScrollIndicator={false}
          rightOpenValue={-160}
          disableRightSwipe
          closeOnRowPress
        />
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
    paddingTop: 69,
    marginBottom: 17,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.primaryDark,
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
    paddingHorizontal: 21,
    paddingTop: 35,
  },
  
  // Total Expenses Card
  totalExpensesCard: {
    width: 357,
    height: 144,
    backgroundColor: colors.primary,
    borderRadius: 31,
    alignSelf: 'center',
    paddingTop: 18,
    paddingHorizontal: 25,
  },
  totalExpensesLabel: {
    fontSize: 20,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  moneyIconContainer: {
    width: 41,
    height: 38,
    marginRight: 16,
  },
  amountContainer: {
    flex: 1,
    height: 45,
    backgroundColor: colors.background,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  amountText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  
  // Period Selector
  periodSelector: {
    width: 358,
    height: 60,
    backgroundColor: colors.successLight,
    borderRadius: 22,
    alignSelf: 'center',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 24,
  },
  periodButton: {
    width: 95,
    height: 50,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.primaryDark,
    textAlign: 'center',
  },

  // Expenses List
  expensesList: {
    paddingTop: 30,
    paddingBottom: 120,
    paddingHorizontal: 0,  // ✅ 14 → 0
  },
  
  // Expense Item (Front)
  expenseItemFront: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
    marginHorizontal: 14,  // ✅ Liste içindeki itemlara margin
    paddingHorizontal: 0,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  categoryIconContainer: {
    width: 57,
    height: 53,
  },
  categoryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  categoryDateTime: {
    fontSize: 11.16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#0068FF',
  },
  expenseAmount: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.primaryDark,
    marginRight: 25,  
  },

  // Hidden Buttons (Back)
  hiddenItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 53,
    marginBottom: 27,
    marginHorizontal: 14,  
    paddingRight: 0,  
  },
  hiddenButton: {
    width: 80,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  hiddenButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;