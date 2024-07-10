import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './SideBar.css';
import { PiSidebarDuotone } from 'react-icons/pi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SideBar(props) {
    const { user, updateUser } = useContext(UserContext);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    function handleProfileDisplay () {
        setShowProfile(!showProfile);
    }

    function handleItemClick(item) {
        setSelectedItem(item);
    }

    return (
        <div className={`sidebar ${props.isOpen ? "open" : ""}`}>
            <div className="sidebar-items">
                <ul>
                    <li className={selectedItem === "Home" ? "selected" : "" }>
                        <Link to="/Home" onClick={() => handleItemClick("Home")}>
                            <i className="fa-solid fa-house"></i>
                            <p>Home</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adoptees-profile" ? "selected" : "" }>
                        <Link to="/adoptees-profile" onClick={() => handleItemClick("adoptees-profile")}>
                            <i className="fa-solid fa-person"></i>
                            <p>Adoptees Profile</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "notifications" ? "selected" : "" }>
                        <Link to="/notifications" onClick={() => handleItemClick("notifications")}>
                            <i className='fa-solid fa-bell'></i>
                            <p>Notifications</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
