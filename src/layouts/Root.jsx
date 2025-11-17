import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { createContext, useContext } from "react";

// Auth context for logout functionality
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Root component");
  }
  return context;
};

export default function Root() {
  const { isInitialized } = useSelector(state => state.user);

  const logout = async () => {
    try {
      if (window.ApperSDK?.ApperUI?.logout) {
        await window.ApperSDK.ApperUI.logout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ logout, isInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  );
}