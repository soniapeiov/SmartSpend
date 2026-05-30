import { useAppInsets } from '../hooks/useAppInsets';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import GoBackIcon from '../assets/images/Gobackicon.svg';
import WeeklySummaryIcon from '../assets/images/ExpenseRecord.svg';
import LimitLogo from '../assets/images/limitLogo.svg';
import { CommonActions } from '@react-navigation/native';

type NotificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WeeklySummaryCard = () => {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.logoContainer}>
        <WeeklySummaryIcon width={53} height={53} />
      </View>

      <View style={cardStyles.textContainer}>
        <Text style={cardStyles.title} allowFontScaling={false}>Weekly Summary</Text>
        <Text style={cardStyles.subtitle} allowFontScaling={false}>You spent €340 this week</Text>
        <Text style={cardStyles.subtitleSecond} allowFontScaling={false}>€120 more than last week</Text>
      </View>

      <View style={cardStyles.dateContainer}>
        <Text style={cardStyles.dateText} allowFontScaling={false}>09:00</Text>
        <Text style={cardStyles.dateText} allowFontScaling={false}>April 28</Text>
      </View>
    </View>
  );
};

const BudgetAlertCard = () => {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.logoContainer}>
        <LimitLogo width={53} height={53} />
      </View>

      <View style={cardStyles.textContainer}>
        <Text style={cardStyles.title} allowFontScaling={false}>Budget Alert</Text>
        <Text style={cardStyles.limitWarning} allowFontScaling={false}>Monthly €1.000 budget exceeded</Text>
        <Text style={cardStyles.overAmount} allowFontScaling={false}>€20 over your limit</Text>
      </View>

      <View style={cardStyles.dateContainer}>
        <Text style={cardStyles.dateText} allowFontScaling={false}>09:00</Text>
        <Text style={cardStyles.dateText} allowFontScaling={false}>April 24</Text>
      </View>
    </View>
  );
};

const NotificationScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<NotificationScreenNavigationProp>();

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

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.container}>
        <WeeklySummaryCard />
        <BudgetAlertCard />
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.successLight,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  logoContainer: {
    width: 53,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: '#052224',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: '#2A6B5A',
    marginBottom: 2,
  },
  subtitleSecond: {
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: '#2A6B5A',
  },
  limitWarning: {
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: '#D9534F',
    marginBottom: 2,
  },
  overAmount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: '#D9534F',
  },
  dateContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  dateText: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.regular,
    fontWeight: '300',
    color: '#0068FF',
    textAlign: 'right',
  },
});

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
    textAlign: 'center',
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
    paddingHorizontal: 21,
    paddingTop: 30,
  },
});

export default NotificationScreen;