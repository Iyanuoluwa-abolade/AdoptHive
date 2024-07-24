import Profile from "../Profile/Profile";
import { useState } from "react";
import './NavBar.css';

function Navbar() {
    const [ showProfile, setShowProfile ] = useState(false);

    function handleProfileDisplay() {
        setShowProfile(!showProfile);
    }

    return (
        <div className='navbar'>

            {showProfile && <Profile /> }
            <div className='user-profile'>
                <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
            </div>
        </div>
    );
}

export default Navbar;
