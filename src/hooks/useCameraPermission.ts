import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'SmartSpend needs access to your camera to scan receipts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      // iOS için react-native-vision-camera kendi izin sistemini kullanır
      setHasPermission(true);
    }
  };

  return { hasPermission, requestCameraPermission };
};