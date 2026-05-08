import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navtypes';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import GoBackIcon from '../../assets/images/Gobackicon.svg';
import NotificationIcon from '../../assets/images/Notificationicon.svg';
import { CommonActions } from '@react-navigation/native';
import { TabBar } from '../../components/TabBar';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

type GalleryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GalleryScreen = () => {
  const navigation = useNavigation<GalleryScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleChooseImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
        handleGoBack();
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to open gallery');
        handleGoBack();
      } else if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri || null);
        console.log('Image selected:', response.assets[0].uri);
      }
    });
  };

  const handleContinue = () => {
    if (selectedImage) {
      console.log('Continue to ReviewExpense with image:', selectedImage);
      navigation.navigate('ReviewExpense');
    } else {
      Alert.alert('No Image', 'Please select an image first');
    }
  };

  // Ekran açılır açılmaz galeriyi aç
  React.useEffect(() => {
    handleChooseImage();
  }, []);

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

        <Text style={styles.headerTitle}>Choose Image</Text>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
          activeOpacity={0.7}
        >
          <NotificationIcon width={14.57} height={18.86} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
              <Text style={styles.placeholderSubtext}>Tap "Choose Another" to select an image</Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.chooseButton}
            activeOpacity={0.7}
            onPress={handleChooseImage}
          >
            <Text style={styles.chooseButtonText}>Choose Another</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              !selectedImage && styles.continueButtonDisabled,
            ]}
            activeOpacity={0.7}
            onPress={handleContinue}
            disabled={!selectedImage}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingTop: 40,
    paddingBottom: 140,
    alignItems: 'center',
  },
  imageContainer: {
    width: '90%',
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    gap: 20,
  },
  chooseButton: {
    flex: 1,
    height: 45,
    backgroundColor: colors.successLight,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chooseButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    flex: 1,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.successLight,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default GalleryScreen;