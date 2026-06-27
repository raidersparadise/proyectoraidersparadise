import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const STATIC_USER = {
  email: "admin@empresa.com",
  password: "admin123",
  name: "Administrador",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (
      email === STATIC_USER.email &&
      password === STATIC_USER.password
    ) {
      setUser({
        name: STATIC_USER.name,
        email: STATIC_USER.email,
      });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}