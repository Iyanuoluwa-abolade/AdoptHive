import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";


function Profile() {
    const { user, updateUser } = useContext(UserContext);


    const navigate = useNavigate();
    function handleLogout() {
        updateUser(null);
        localStorage.removeItem("user");
        navigate("/signin");
    }



    return (
        <div className="profile">
            <p>User: {user.FirstName}</p>
            <p>Role: {user.role}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;
