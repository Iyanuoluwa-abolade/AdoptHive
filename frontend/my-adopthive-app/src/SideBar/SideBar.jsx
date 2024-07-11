import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './SideBar.css';


function SideBar({isOpen}) {

    const [selectedItem, setSelectedItem] = useState(null);



    function handleItemClick(item) {
        setSelectedItem(item);
    }



    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
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

SideBar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default SideBar;
