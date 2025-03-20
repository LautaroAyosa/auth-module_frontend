// hooks/useAuth.ts
import { useContext, useEffect } from 'react';
import { AuthContext } from '../pages/_app';
import { isLoggedIn } from '../utils/auth';

export function useAuth() {
  const { authenticated, user, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      isLoggedIn().then((data) => setAuth(data));
    }
  }, [user, setAuth]);

  return { authenticated, user, setAuth };
}
