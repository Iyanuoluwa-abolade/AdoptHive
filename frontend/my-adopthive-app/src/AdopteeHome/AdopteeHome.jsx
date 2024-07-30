import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';
import AdopterListHome from '../AdopterListHome/AdopterListHome';
import Spinner from '../Loading/Loading';
import useLoading from '../useLoading/useLoading';
import './AdopteeHome.css';

function AdopteeHome() {
  const { user } = useContext(UserContext);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();

  function toggleSideBar() {
    setIsSideBarOpen(!isSideBarOpen);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      startLoading();
      try {
        const storedUser = localStorage.getItem('user');
        const storedUserObject = storedUser ? JSON.parse(storedUser) : null;
        if (user !== null && storedUserObject === null) {
          setIsNewUser(true);
        } else {
          setIsNewUser(false);
        }
      } catch (error) {
        return('Error fetching user data:', error);
      } finally {
        stopLoading();
      }
    };
    fetchUserData();
  }, [user, startLoading, stopLoading]);

  return (
    <div className="home-container">
      {isLoading ? (
        <Spinner />
      ) : (
        user && (
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
        )
      )}
    </div>
  );
}

export default AdopteeHome;
