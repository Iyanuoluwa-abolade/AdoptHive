import Home from './Home/Home';
import React, { useState, useEffect } from 'react';
import './App.css';

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
            <Route path="/Home" element={user && <Home />} />
          </Routes>
        </Router>
      </UserContext.Provider>

      <Home>
        <h1>Adopthive</h1>
        < SignIn />
      </Home>
    </div>
  );
}

export default App;
