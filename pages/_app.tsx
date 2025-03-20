import { createContext, useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout'
import { isLoggedIn } from '../utils/auth'; // Your axios call
import "../styles/globals.css"
import { ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
}

export interface AuthState {
  authenticated: boolean;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  setAuth: (newState: AuthState | ((prev: AuthState) => AuthState)) => void;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: null,
  setAuth: () => {},
} as AuthContextType);

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & { getLayout?: (page: React.ReactNode) => React.ReactNode };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const [authState, setAuth] = useState<AuthState>({
    authenticated: false,
    user: null,
  });

  useEffect(() => {
    // Only check auth if we don't have a user yet
    if (!authState.user) {
      isLoggedIn().then((data) => setAuth(data));
    }
  }, []);

  const getLayout =
    Component.getLayout || ((page:React.ReactNode) => <MainLayout>{page}</MainLayout>);

  return (
    <AuthContext.Provider value={{ ...authState, setAuth }}>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer
        position="bottom-right"
        autoClose={3000} // Auto-closes after 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  );
}

export default MyApp;