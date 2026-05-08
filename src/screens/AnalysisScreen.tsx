import React, { useState, useMemo } from 'react';  
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SwipeListView } from 'react-native-swipe-list-view';
import { PieChart } from 'react-native-chart-kit';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import GoBackIcon from '../assets/images/Gobackicon.svg';
import NotificationIcon from '../assets/images/Notificationicon.svg';
import FoodIcon from '../assets/images/Food.svg';
import OtherIcon from '../assets/images/Other.svg';
import TransportationIcon from '../assets/images/Transportation.svg';
import HomeIcon from '../assets/images/Home.svg';
import ShoppingIcon from '../assets/images/Shopping.svg';
import { CommonActions } from '@react-navigation/native';
import { 
  getExpensesByCategory, 
  getExpensesByPeriod, 
  deleteExpense,
  Expense 
} from '../data/mockData';

type AnalysisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

const AnalysisScreen = () => {
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');
  const [refreshKey, setRefreshKey] = useState(0);  

  const categoryData = useMemo(
    () => getExpensesByCategory(selectedPeriod),
    [selectedPeriod, refreshKey]  
  );

  const expenses = useMemo(
    () => getExpensesByPeriod(selectedPeriod),
    [selectedPeriod, refreshKey]  
  );

  const chartColors: { [key: string]: string } = {
    Food: '#5B9FFF',
    Transportation: '#00D09E',
    Home: '#FFA7A7',
    Shopping: '#B794F6',
    Other: '#9CA3AF',
  };

  const pieData = categoryData.map((item) => ({
    name: '',  
    population: item.percentage,
    color: chartColors[item.category] || '#9CA3AF',
    legendFontColor: colors.primaryDark,
    legendFontSize: 14,
  }));

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
            deleteExpense(item.id);
            setRefreshKey(prev => prev + 1);  // render
          },
        },
      ]
    );
  };

  //  Edit expense
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

  // Expense Item Render (Front - görünen kısım)
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

  // Hidden buttons (Back - kaydırınca görünen)
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
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Analysis</Text>

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
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'yearly' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('yearly')}
              activeOpacity={0.7}
            >
              <Text style={styles.periodText}>Year</Text>
            </TouchableOpacity>
          </View>

          {/* Chart + Legend Yan Yana */}
          {pieData.length > 0 ? (
            <View style={styles.chartWithLegendContainer}>
              {/* Pie Chart - Sol taraf */}
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieData}
                  width={210}  
                  height={210}  
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"  
                  center={[18, 0]} 
                  absolute={false}
                  hasLegend={false}
                />
              </View>

              {/* Legend + Yüzdeler - Sağ taraf */}
              <View style={styles.legendContainer}>
                {categoryData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View 
                      style={[
                        styles.legendColorBox, 
                        { backgroundColor: chartColors[item.category] }
                      ]} 
                    />
                    <Text style={styles.legendText}>{item.category}</Text>
                    <Text 
                      style={[
                        styles.legendPercentage,
                        { color: chartColors[item.category] }  
                      ]}
                    >
                      %{item.percentage}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No data available for this period</Text>
          )}

          {/* Expenses List with Swipe */}
          <SwipeListView
            key={refreshKey}  // Yeniden render için
            data={expenses}
            renderItem={renderExpenseItem}
            renderHiddenItem={renderHiddenItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.expensesList}
            showsVerticalScrollIndicator={false}
            rightOpenValue={-160}
            disableRightSwipe
            closeOnRowPress
            scrollEnabled={false}  // ScrollView içinde olduğu için
          />
        </ScrollView>
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
    paddingHorizontal: 21,
    paddingTop: 30,
  },

  // Period Selector
  periodSelector: {
    width: 358,
    height: 60,
    backgroundColor: colors.successLight,
    borderRadius: 22,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 12,
    marginBottom: 30,
  },
  periodButton: {
    width: 72,
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

  // Chart + Legend Container
  chartWithLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,  
    marginTop: 0,
    marginBottom: 30,
  },

  // Chart Container
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,  
  },

  // Legend Container
  legendContainer: {
    flex: 2,
    paddingLeft: 0,  
    paddingRight: 5,  
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,  
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,  
  },
  legendText: {
    flex: 1,
    fontSize: 12,  
    fontFamily: fonts.regular,
    color: colors.primaryDark,
  },
  legendPercentage: {
    fontSize: 15,
    fontFamily: fonts.bold,
    minWidth: 45,  
    textAlign: 'right',
  },

  // Expenses List
  expensesList: {
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  // Expense Item (Front - görünen)
  expenseItemFront: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
    marginHorizontal: 14,
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

  // Hidden Buttons (Back - kaydırınca görünen)
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

  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.primaryDark,
    marginTop: 40,
  },
});

export default AnalysisScreen;