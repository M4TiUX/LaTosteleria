// src/context/UserContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const decodeToken = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return jwtDecode(token);
    } catch (error) {
      console.warn("Token inválido, limpiando...");
      localStorage.removeItem("token");
      return null;
    }
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
    if (!user || !requiredRoles || requiredRoles.length === 0) return false;
    return requiredRoles.includes(user?.rol?.name);
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