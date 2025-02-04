import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [walletBalance, setWalletBalance] = useState(0);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Fetch initial wallet balance after login
    fetchWalletBalance(userData._id);
  };

  const logout = () => {
    setUser(null);
    setWalletBalance(0);
    localStorage.removeItem('user');
  };

  const fetchWalletBalance = async (userId) => {
    try {
      const response = await api.get(`/wallet/${userId}`);
      setWalletBalance(response.data.balance);
      return response.data.balance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      walletBalance,
      fetchWalletBalance 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);