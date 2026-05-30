import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useAppInsets = () => {
  const insets = useSafeAreaInsets();
  
  return {
    headerTop: insets.top + 20,      
    bottomSpace: insets.bottom + 16, 
    insets,
  };
};
