import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from '../lib/api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // If no token exists, the user is a guest; don't make an unauthenticated /me call
    if (!getToken()) {
      setUser(null);
      return null;
    }
    try {
      const { user } = await api.me();
      setUser(user);
      return user;
    } catch {
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, setUser, loading, login, register, logout, refresh, isAdmin: user?.role === 'admin', hasToken: !!getToken() }}>
      {children}
    </Ctx.Provider>
  );
}
