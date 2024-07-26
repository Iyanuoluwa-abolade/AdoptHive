import './Header.css';
import Profile from "../Profile/Profile";
import { useState } from "react";

const Header = () => {
    const [ showProfile, setShowProfile ] = useState(false);

    function handleProfileDisplay() {
        setShowProfile(!showProfile);
    }

  return (
    <div className="header">
      <h1>AdoptHive</h1>
      {showProfile && <Profile /> }
      <div className='user-profile'>
        <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
      </div>

    </div>
  );
}

export default Header;
