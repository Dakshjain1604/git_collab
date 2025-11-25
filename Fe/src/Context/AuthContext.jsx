import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("dmatch_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("dmatch_token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("dmatch_token", token);
    } else {
      localStorage.removeItem("dmatch_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("dmatch_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("dmatch_user");
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      setUser,
      setToken,
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("dmatch_history");
      },
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

