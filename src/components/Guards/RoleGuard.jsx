//imports
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

//component defination
const RoleGuard = ({ children, allowedRoles }) => {
const token = localStorage.getItem("jwtToken");  // fetch jwt token
const location = useLocation();

//Authentication Check (NOT Logged In)
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    //Decode the JWT Token
    const decodedToken = jwtDecode(token);
  
    // Extract User Role Safely
    const userRole = 
      decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
      decodedToken.role;

    // Role Authorization Check 
    const hasAccess = allowedRoles.some(
      (role) => role.toLowerCase() === userRole?.toLowerCase()
    );

    //Access Decision
    if (hasAccess) {
      return children;
    } else {
      console.warn("Access Denied. Required roles:", allowedRoles, "Found:", userRole);
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem("jwtToken");   //Token Error Handling
    return <Navigate to="/login" replace />;
  }
};

export default RoleGuard;

