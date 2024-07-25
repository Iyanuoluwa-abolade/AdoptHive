import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import NavBar from '../NavBar/NavBar';
import AdopterSideBar from '../AdopterSideBar/AdopterSideBar';
import AdopteeListHome from '../AdopteeListHome/AdopteeListHome';
import './AdopterHome.css';

function AdopterHome() {
  const { user } = useContext(UserContext);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  function toggleSideBar()  {
    setIsSideBarOpen(!isSideBarOpen);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserObject = storedUser ? JSON.parse(storedUser) : null;
    if (user !== null && storedUserObject === null) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
    }
  }, [user]);

  return (
    <div className="home-container">
      {user && (
        <div>
          <NavBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />

          <AdopterSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
          <div className="home-content">
            {isNewUser ? (
              <h1>Welcome, {user.FirstName}!</h1>
            ) : (
              <h1>Welcome back, {user.FirstName}!</h1>
            )}
            <AdopteeListHome/>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdopterHome;
