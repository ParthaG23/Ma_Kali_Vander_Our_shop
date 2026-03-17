import { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { firebaseLogin } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else      localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !user) {
        try {
          const token = await fbUser.getIdToken();
          const { data } = await firebaseLogin(token);
          setUser(data.data);
        } catch { /* existing JWT session takes priority */ }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login  = useCallback((userData) => setUser(userData), []);
  const logout = useCallback(async () => {
    await fbSignOut(auth).catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', loading }}>
      {children}
    </AuthContext.Provider>
  );
};
