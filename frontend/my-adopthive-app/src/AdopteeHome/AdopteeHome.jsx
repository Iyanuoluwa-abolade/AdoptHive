import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';
import AdopterListHome from '../AdopterListHome/AdopterListHome';
import './AdopteeHome.css';

function AdopteeHome() {
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
          <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
          <div className="home-content">
            {isNewUser ? (
              <h1>Welcome, {user.FirstName}!</h1>
            ) : (
              <h1>Welcome back, {user.FirstName}!</h1>
            )}
            <AdopterListHome />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdopteeHome;
