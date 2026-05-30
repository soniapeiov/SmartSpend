import { useAppInsets } from '../../hooks/useAppInsets';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ActivityIndicator, Image } from 'react-native';
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
import { scanReceipt } from '../../services/ocr';

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanScreen = () => {
  const { headerTop } = useAppInsets();
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = React.useRef<any>(null);

  const handleNotification = () => navigation.navigate('NotificationScreen');

  const handleGoBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', state: { routes: [{ name: 'Receipt' }], index: 0 } }],
      })
    );
  };

  const [showBadge, setShowBadge] = useState(false);

  const handleTakePhoto = async () => {
  if (cameraRef.current) {
    try {
      const result = await cameraRef.current.capture();
      setPhoto(result.uri);
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 2000); // 2 saniye sonra kaybolur
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  }
};

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleConfirm = async () => {
    if (!photo) return;
    try {
      setIsProcessing(true);
      const result = await scanReceipt(photo);
      navigation.navigate('ReviewExpenseScreen', {
        total: result.total,
        date: result.date,
        imagePath: photo,
        type: 'scan',
      });
    } catch (error) {
      Alert.alert(
        'Scan Failed',
        'Could not read the receipt. Would you like to enter the details manually?',
        [
          { text: 'Enter Manually', onPress: () => navigation.navigate('AddManuallyScreen', { editMode: false }) },
          { text: 'Try Again', style: 'cancel', onPress: handleRetake },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack} activeOpacity={0.7}>
          <GoBackIcon width={19} height={16} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {photo ? 'Review Photo' : 'Scan With Camera'}
        </Text>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotification} activeOpacity={0.7}>
          <NotificationIcon width={14.57} height={18.86} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Camera Screen and Preview */}
        <View style={styles.cameraContainer}>
  {photo ? (
    <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="contain" />
  ) : (
    <Camera ref={cameraRef} style={styles.camera} cameraType={CameraType.Back} />
  )}
  {showBadge && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}> Photo captured! </Text>
    </View>
  )}
</View>

        {/* Buttons */}
        {photo ? (
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} activeOpacity={0.7}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, isProcessing && styles.buttonDisabled]}
              onPress={handleConfirm}
              activeOpacity={0.7}
              disabled={isProcessing}
            >
              {isProcessing
                ? <ActivityIndicator color={colors.textSecondary} />
                : <Text style={styles.confirmButtonText}>Continue</Text>
              }
            </TouchableOpacity>
          </View>
        ) : (
          
          <TouchableOpacity style={styles.apertureButton} onPress={handleTakePhoto} activeOpacity={0.7}>
            <ApertureIcon width={53} height={52} />
          </TouchableOpacity>
        )}
      </View>

      <TabBar activeTab="Receipt" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    marginBottom: 17,
  },
  goBackButton: { width: 19, height: 16 },
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
    paddingBottom: 140,
    alignItems: 'center',
  },
  cameraContainer: {
    width: '90%',
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: { flex: 1 },
  photoPreview: { width: '100%', height: '100%' },
  apertureButton: {
    width: 65,
    height: 63,
    backgroundColor: colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    width: '80%',
    gap: 20,
  },
  retakeButton: {
    flex: 1,
    height: 45,
    backgroundColor: colors.successLight,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  buttonDisabled: { opacity: 0.5 },
  badge: {
  position: 'absolute',
  bottom: 12,
  alignSelf: 'center',
  backgroundColor: colors.primary,
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: 20,
},
badgeText: {
  fontSize: 13,
  fontFamily: fonts.medium,
  color: colors.textSecondary,
},
});

export default ScanScreen;