import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { setOnAuthFailure } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restores the session on refresh using the stored refresh token (PRD
  // page 9). If even that fails, the user just stays logged out.
  useEffect(() => {
    authApi
      .fetchMe()
      .then((session) => {
        if (session) setUser(session.user);
      })
      .finally(() => setLoading(false));
  }, []);

  // Registered with the Axios interceptor: force logout only when a
  // background silent-refresh also fails (PRD page 9), e.g. the refresh
  // token itself expired mid-session.
  useEffect(() => {
    setOnAuthFailure(() => setUser(null));
    return () => setOnAuthFailure(null);
  }, []);

  async function login(credentials) {
    const { user: loggedInUser } = await authApi.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(data) {
    const { user: newUser } = await authApi.register(data);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}
