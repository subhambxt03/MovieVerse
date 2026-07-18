import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides authentication state and methods
 * @returns {Object} Auth context values
 */
const useAuth = () => {
  const auth = useAuth();
  return auth;
};

export default useAuth;