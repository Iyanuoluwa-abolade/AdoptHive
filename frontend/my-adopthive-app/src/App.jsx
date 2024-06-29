// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



import Home from './Home/Home';
import React, { useState, useEffect } from 'react';
import './App.css';
// import Header from "./Header/Header";
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { UserContext } from './UserContext';
import {BrowserRouter as Router, Routes, Route, } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser= (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={{user,updateUser}} >
        <Router>
          <Routes>
            <Route path="/" element={ user ? < Home /> : <SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Routes>
        </Router>
      </UserContext.Provider>


      {/* <header className="App-header">
        <h1>AdoptHive</h1>
      </header> */}
      <Home>
        <h1>Adopthive</h1>
        < SignIn />
      </Home>
    </div>
  );
}

export default App;
