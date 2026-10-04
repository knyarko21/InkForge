
import {
  createContext,
  useContext,
  useState
} from "react";

// ===============================
// Create authentication context
// ===============================

const AuthContext = createContext(null);

// ===============================
// Auth Provider
// ===============================

function AuthProvider({ children }) {

  // Get the stored user from localStorage
  const storedUser = localStorage.getItem("user");

  // Keep the current user in React state
  const [user, setUser] = useState(
    storedUser
      ? JSON.parse(storedUser)
      : null
  );

  // ===============================
  // Login
  // ===============================

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // ===============================
  // Logout
  // ===============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ===============================
  // Authentication status
  // ===============================

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ===============================
// Custom authentication hook
// ===============================

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuth
};