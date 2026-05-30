export type RootStackParamList = {
  Launch: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;

  NotificationScreen: undefined;  

  GalleryScreen: undefined;      
  ScanScreen: undefined;          
  AddReceiptScreen: undefined;
  
  ReviewExpenseScreen: {
    total: string | null;
    date: string | null;
    imagePath: string;
    type?: 'scan' | 'gallery';
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

  EditProfileScreen: undefined;
  SettingsScreen: undefined;
  SetLimitScreen: undefined; 
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