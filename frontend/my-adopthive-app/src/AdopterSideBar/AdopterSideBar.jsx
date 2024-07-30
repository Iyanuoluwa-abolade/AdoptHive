import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AdopterSideBar.css';

function AdopterSideBar({isOpen}) {
    const [selectedItem, setSelectedItem] = useState(null);

    function handleItemClick(item) {
        setSelectedItem(item);
    }

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-items">
                <ul>
                    <li className={selectedItem === "adopter-home" ? "selected" : "" }>
                        <Link to="/adopter-home" onClick={() => handleItemClick("adopter-home")}>
                            <i className="fa-solid fa-house"></i>
                            <p>Home</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adopter-profile" ? "selected" : "" }>
                        <Link to="/adopter-profile" onClick={() => handleItemClick("adopter-profile")}>
                            <i className="fa-solid fa-person"></i>
                            <p>Edit Profile</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adoptee-list" ? "selected" : "" }>
                        <Link to="/adoptee-list" onClick={() => handleItemClick("adoptee-list")}>
                            <i className="fas fa-users"></i>
                            <p>Find Your Match</p>
                        </Link>
                    </li>
                    <li className={selectedItem === "adopter-favourites" ? "selected" : "" }>
                        <Link to="/adopter-favourites" onClick={() => handleItemClick("adopter-favourites")}>
                            <i className='fas fa-heart'></i>
                            <p>Favourites</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

AdopterSideBar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default AdopterSideBar;
