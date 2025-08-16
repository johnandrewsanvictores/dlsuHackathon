import { createContext, useContext, useEffect, useState } from "react";
import api from "/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      } catch (_) {
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  // Fetch user profile from server on mount if we have stored user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/user/profile");
        const currentUser = res.data?.user ?? null;
        setUser(currentUser);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have stored user data and we're not already loading
    if (localStorage.getItem("authUser") && loading) {
      fetchUser();
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
