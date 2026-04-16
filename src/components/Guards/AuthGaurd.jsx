import React from "react";
import { Navigate } from "react-router-dom";

function AuthGuard({ children }) {
  // cheack token in local storage 
  const token = localStorage.getItem("jwtToken");

  if (!token) {
  
    return <Navigate to="/login" replace />;
  }
  return children; //token exists, render the protected component
}

export default AuthGuard;