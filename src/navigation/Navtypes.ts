export type RootStackParamList = {
  Launch: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  GalleryScreen: undefined;      
  ScanScreen: undefined;          
  NotificationScreen: undefined;  
  ReviewExpense: {  
    photoUri?: string;
    type?: 'scan' | 'gallery';
    ocrData?: {
      date?: string;
      category?: string;
      amount?: number;
    };
  };
  AddManuallyScreen: {  
    editMode?: boolean;
    expense?: {
      id: number;
      date: string;
      category: string;
      amount: number;
    };
  };
};

export type TabParamList = {
  Home: undefined;
  Analysis: undefined;
  Receipt: undefined;
  AddManually: {  
    editMode?: boolean;
    expense?: {
      id: number;
      date: string;
      category: string;
      amount: number;
    };
  };
  Profile: undefined;
};