import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navtypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import Logo from '../assets/images/logo.svg';

type LaunchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Launch'>;

const LaunchScreen = () => {
  const navigation = useNavigation<LaunchScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Logo width={243} height={240} />
      <Text style={styles.title}>SmartSpend</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LaunchScreen;