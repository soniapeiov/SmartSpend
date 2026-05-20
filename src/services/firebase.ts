import auth from '@react-native-firebase/auth';

// Firebase Authentication instance
export const firebaseAuth = auth();

export default {
  auth: firebaseAuth,
};
