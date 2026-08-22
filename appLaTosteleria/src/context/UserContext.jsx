// src/context/UserContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

function getStoredUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    console.warn("Token inválido, limpiando...");
    localStorage.removeItem("token");
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getStoredUser()),
  );

  const decodeToken = useCallback(() => {
    return getStoredUser();
  }, []);

  useEffect(() => {
    const userData = decodeToken();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [decodeToken]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const userData = decodeToken();
    setUser(userData);
    setIsAuthenticated(!!userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const autorize = (requiredRoles = []) => {
    const activeUser = user ?? decodeToken();
    if (!activeUser || !requiredRoles || requiredRoles.length === 0)
      return false;
    return requiredRoles.includes(activeUser?.rol?.name);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    decodeToken,
    autorize,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
