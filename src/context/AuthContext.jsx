import { createContext, useState, useContext, useEffect } from "react";
 
const AuthContext = createContext(); //-- Create the AuthContext
 
//component
export const AuthProvider = ({ children }) => {
  //state variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    if (token && role && userId&& email) {
      setUser({ token, role, userId, email });
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
  //LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
 
  return (
    //Provide Context Values
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
 
//custome hook 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {                        //safety check
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
 