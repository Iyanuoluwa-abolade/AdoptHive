import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import NavBar from '../NavBar/NavBar';
import SideBar from '../SideBar/SideBar';
import './Home.css';

function Home() {
  const { user, updateUser } = useContext(UserContext);
  
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  function toggleSideBar()  {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="home-container">

      {user && (
        <div>
          <NavBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />

          <SideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
          <div className="home-content">
            <h1>Welcome back, {user.FirstName}!</h1>

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
