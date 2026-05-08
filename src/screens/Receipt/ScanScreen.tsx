import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import NotificationIcon from '../../assets/images/Notificationicon.svg';
import ApertureIcon from '../../assets/images/Apertureicon.svg';
import { CommonActions } from '@react-navigation/native';
import { TabBar } from '../../components/TabBar';
import { Camera, CameraType } from 'react-native-camera-kit';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanScreen = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = React.useRef<any>(null);

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

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        
        // Android 13+ (API 33+) için READ_MEDIA_IMAGES
        if (androidVersion >= 33) {
          const granted = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_IMAGES' as any,
            {
              title: 'Media Permission',
              message: 'App needs access to save photos to your gallery',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 12 ve altı için WRITE_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to save photos to your gallery',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const savePhotoToGallery = async (uri: string) => {
    try {
      const hasPermission = await requestStoragePermission();
      
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot save photo without storage permission');
        return;
      }

      await CameraRoll.save(uri, { type: 'photo' });
      console.log('Photo saved to gallery:', uri);
      Alert.alert('Success', 'Photo saved to gallery!');
    } catch (error) {
      console.error('Error saving photo to gallery:', error);
      Alert.alert('Error', 'Failed to save photo to gallery');
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.capture();
        setPhoto(result.uri);
        console.log('Photo taken:', result.uri);
        
        // Otomatik olarak galeri kaydet
        await savePhotoToGallery(result.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleContinue = () => {
    if (photo) {
      console.log('Continue to ReviewExpense with photo:', photo);
      navigation.navigate('ReviewExpense');
    } else {
      Alert.alert('No Photo', 'Please take a photo first');
    }
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

        <Text style={styles.headerTitle}>Scan With Camera</Text>

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
        {/* Camera Preview */}
        <View style={styles.cameraPlaceholder}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            cameraType={CameraType.Back}
          />
        </View>

        {/* Aperture Button */}
        <TouchableOpacity 
          style={styles.apertureButtonContainer}
          activeOpacity={0.7}
          onPress={handleTakePhoto}
        >
          <ApertureIcon width={43} height={42} />
        </TouchableOpacity>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueButton}
            activeOpacity={0.7}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <TabBar activeTab="Receipt" />
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
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 140,
  },
  cameraPlaceholder: {
    width: '90%',
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  apertureButtonContainer: {
    width: 59,
    height: 57,
    backgroundColor: colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    gap: 20,
  },
  cancelButton: {
    flex: 1,
    height: 32,
    backgroundColor: colors.successLight,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    flex: 1,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ScanScreen;