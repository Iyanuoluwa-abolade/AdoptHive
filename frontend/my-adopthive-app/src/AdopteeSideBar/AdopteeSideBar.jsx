import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AdopteeSideBar.css';

function AdopteeSideBar({isOpen}) {
    const [selectedItem, setSelectedItem] = useState(null);

    function handleItemClick(item) {
        setSelectedItem(item);
    }

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-items">
                <ul>
                    <li className={selectedItem === "adoptee-home" ? "selected" : "" }>
                        <Link to="/adoptee-home" onClick={() => handleItemClick("adoptee-home")}>
                            <i className="fa-solid fa-house"></i>
                            <p>Home</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adoptee-profile" ? "selected" : "" }>
                        <Link to="/adoptee-profile" onClick={() => handleItemClick("adoptee-profile")}>
                            <i className="fa-solid fa-person"></i>
                            <p>Edit Profile</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adopter-list" ? "selected" : "" }>
                        <Link to="/adopter-list" onClick={() => handleItemClick("adopter-list")}>
                            <i className="fas fa-users"></i>
                            <p>Find Your Match</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

AdopteeSideBar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default AdopteeSideBar;
