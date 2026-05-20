// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { firebaseAuth } from '../services/firebase';
import { getUserByFirebaseUid, createUser, User } from '../services/database';
import { Alert } from 'react-native';

type AuthContextType = {
  user: User | null;
  firebaseUid: string | null;
  login: (uid: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string, phone: string) => Promise<{ success: boolean; error?: any }>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      // Pause listener during signup transaction
      if (isSigningUp) {
        return;
      }
      
      if (firebaseUser) {
        setFirebaseUid(firebaseUser.uid);
        
        try {
          const userProfile = await getUserByFirebaseUid(firebaseUser.uid);
          
          if (userProfile) {
            setUser(userProfile);
          } else {
            console.error('❌ User profile not found in database');
            Alert.alert('Error', 'User profile not found. Please sign up again.');
            await firebaseAuth.signOut();
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
          Alert.alert('Error', 'Failed to load user profile.');
        }
      } else {
        setFirebaseUid(null);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isSigningUp]);

  // Signup - Transaction with Lock
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<{ success: boolean; error?: any }> => {
    setIsSigningUp(true);
    setLoading(true);
    
    try {
      // Create Firebase user
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // Save to SQLite
      await createUser(uid, email.trim(), fullName.trim(), phone.trim());

      // Load user profile and update state
      const userProfile = await getUserByFirebaseUid(uid);
      
      if (userProfile) {
        setFirebaseUid(uid);
        setUser(userProfile);
        return { success: true };
      } else {
        throw new Error('Failed to load user profile after signup');
      }
      
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      // Cleanup: delete Firebase user if created
      try {
        const currentUser = firebaseAuth.currentUser;
        if (currentUser) {
          await currentUser.delete();
        }
      } catch (cleanupError) {
        console.error('❌ Cleanup failed:', cleanupError);
      }
      
      return { success: false, error };
      
    } finally {
      setIsSigningUp(false);
      setLoading(false);
    }
  };

  // Login - Firebase listener handles state
  const login = async (uid: string) => {
    // Firebase listener automatically loads user profile
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseAuth.signOut();
      setFirebaseUid(null);
      setUser(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  const isAuthenticated = firebaseUid !== null && user !== null;

  return (
    <AuthContext.Provider value={{ user, firebaseUid, login, logout, signup, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};