import './Header.css';
import Profile from "../Profile/Profile";
import { useState, useContext } from "react";
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
const Header = () => {
    const [ showProfile, setShowProfile ] = useState(false);
    const { user } = useContext(UserContext);

    function handleProfileDisplay() {
        setShowProfile(!showProfile);
    }

  return (
    <div className="header">
      <h1>AdoptHive</h1>
      {showProfile && <Profile /> }
      {user ?(
        <div className='user-profile'>
          <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
        </div>
      ):(
        <Link to="/signin">
         <button>Sign in</button>
        </Link>

      )}
    </div>
  );
}

export default Header;
