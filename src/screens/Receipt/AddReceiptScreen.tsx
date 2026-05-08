import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import NotificationIcon from '../../assets/images/Notificationicon.svg';
import { CommonActions } from '@react-navigation/native';

type AddReceiptScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddReceiptScreen = () => {
  const navigation = useNavigation<AddReceiptScreenNavigationProp>();

  const handleScanCamera = () => {
    navigation.navigate('ScanScreen');
  };

  const handleChooseGallery = () => {
    navigation.navigate('GalleryScreen');
  };

  const handleNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  const handleCancel = () => {
    // TabNavigator içindeki Home tab'ına git
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

  const handleGoBack = () => {
    // TabNavigator içindeki Home tab'ına git
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Receipt</Text>

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
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add Receipt</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.scanButton}
              activeOpacity={0.7}
              onPress={handleScanCamera}
            >
              <Text style={styles.scanButtonText}>Scan with Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.galleryButton}
              activeOpacity={0.7}
              onPress={handleChooseGallery}
            >
              <Text style={styles.galleryButtonText}>Choose From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: 339,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: -60,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: '#0E3E3E',
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  scanButton: {
    width: 218,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  galleryButton: {
    width: 218,
    height: 45,
    backgroundColor: colors.successLight,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButtonText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: '#0E3E3E',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  cancelButton: {
    width: 218,
    height: 45,
    backgroundColor: '#E8F5EA',
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: '#0E3E3E',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default AddReceiptScreen;