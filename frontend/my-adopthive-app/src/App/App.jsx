import React, { useState, useEffect } from 'react';
import './App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import { UserContext } from '../UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from '../MainPage/MainPage';
import AdopteesProfile from '../AdopteesProfile/AdopteesProfile'
import Home from '../Home/Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function App() {
  const [user, setUser] = useState(() => {

    const storedUser = localStorage.getItem('user');


    return (storedUser == undefined)? null : JSON.parse(storedUser);
  });

  const updateUser = (newUser) => {
    setUser(newUser);

  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className="App">
      <Header />
      <UserContext.Provider value={{ user, updateUser }}>
        <Router>
          <Routes>
            <Route path="/mainpage" element={user ? <MainPage /> : <SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Home" element={ user? <Home /> : <SignIn />} />
            <Route path="/adoptees-profile" element={<AdopteesProfile />} />
          </Routes>
        </Router>
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
