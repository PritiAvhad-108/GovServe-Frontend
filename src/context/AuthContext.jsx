import { createContext, useState, useContext, useEffect } from "react";
 
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    if (token && role && userId) {
      setUser({ token, role, userId, email });
    }
    setLoading(false);
  }, []);
  // ✅ LOGIN (sync localStorage + React state)
  const login = (userData) => {
    localStorage.setItem("jwtToken", userData.token);
    localStorage.setItem("userRole", userData.roleName);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userEmail", userData.email);
 
    setUser({
      token: userData.token,
      role: userData.roleName,
      userId: userData.userId,
      email: userData.email,
    });
  };
  // ✅ LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
 
  return (
    <AuthContext.Provider
      value={{
        user,
        userRole: user?.role,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
 