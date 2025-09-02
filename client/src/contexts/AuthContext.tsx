import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (email: string, password: string, displayName: string) => {
    // Mock registration - for development
    console.log('Mock registration:', { email, displayName });
    // Simulate successful registration
    const mockUser = { 
      uid: '123', 
      email, 
      displayName,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      }
    } as User;
    setCurrentUser(mockUser);
  };

  const login = async (email: string, password: string) => {
    // Mock login - for development
    console.log('Mock login:', { email });
    // Simulate successful login
    const mockUser = { 
      uid: '123', 
      email, 
      displayName: 'Demo User',
      metadata: {
        creationTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        lastSignInTime: new Date().toISOString()
      }
    } as User;
    setCurrentUser(mockUser);
  };

  const logout = async () => {
    // Mock logout - for development
    console.log('Mock logout');
    setCurrentUser(null);
  };

  const updateUserProfile = async (displayName: string) => {
    if (currentUser) {
      // Mock profile update - for development
      console.log('Mock profile update:', { displayName });
      setCurrentUser({ ...currentUser, displayName });
    }
  };

  useEffect(() => {
    // Mock auth state change
    const unsubscribe = (auth as any).onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};