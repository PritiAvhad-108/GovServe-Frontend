import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");

    if (token) {
      setUser({ token, role, email, userId });
    }
    setLoading(false);
  }, []);

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

  const logout = () => {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
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