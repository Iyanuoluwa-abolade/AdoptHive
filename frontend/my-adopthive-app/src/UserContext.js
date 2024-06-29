import { createContext } from 'react';

export const UserContext = createContext();

// export const UserContextProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     const updateUser = (newUser) => {
//       setUser(newUser);
//     };

//     return (
//       <UserContext.Provider value={{ user, updateUser }}>
//         {children}
//       </UserContext.Provider>
//     );
//   };

// export const useUserContext =()=>{
//     return useContext(UserContext);
// }
