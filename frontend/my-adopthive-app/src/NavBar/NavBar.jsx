import Profile from "../Profile/Profile";
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { PiSidebarDuotone } from 'react-icons/pi';
import './NavBar.css';

function Navbar(props) {
    const [ showProfile, setShowProfile ] = useState(false);
    const { user, updateUser } = useContext(UserContext);


    function handleProfileDisplay() {
        setShowProfile(!showProfile);
    }

    return (
        <div className='navbar'>
            <div onClick={props.toggleSideBar} className='toggle-btn'>
                <PiSidebarDuotone />
            </div>
            <div className='navbar-title'>
                <h1>AdoptHive</h1>
            </div>
            {showProfile && <Profile /> }
            <div className='user-profile'>
                <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
            </div>
        </div>
    );
}

export default Navbar;
