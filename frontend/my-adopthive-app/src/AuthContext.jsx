// import React, { useState, createContext, useState } from "react";

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   function signin() {
//     setIsAuthenticated(true);
//   }

//   function signout() {
//     setIsAuthenticated(false);
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, signin, signout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
