import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import AdopterSideBar from '../AdopterSideBar/AdopterSideBar';
import AdopteeListHome from '../AdopteeListHome/AdopteeListHome';
import Spinner from '../Loading/Loading';
import useLoading from '../useLoading/useLoading';
import './AdopterHome.css';

function AdopterHome() {
  const { user } = useContext(UserContext);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, startLoading, stopLoading } = useLoading();

  function toggleSideBar() {
    setIsSideBarOpen(!isSideBarOpen);
  }

  useEffect(() => {
    const checkUserStatus = () => {
      startLoading();

      const storedUser = localStorage.getItem('user');
      const storedUserObject = storedUser ? JSON.parse(storedUser) : null;

      if (user !== null && storedUserObject === null) {
        setIsNewUser(true);
      } else {
        setIsNewUser(false);
      }

      stopLoading();
    };

    checkUserStatus();
  }, [user, startLoading, stopLoading]);

  return (
    <div className="home-container">
      {isLoading ? (
        <Spinner />
      ) : (
        user && (
          <div>
            <AdopterSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <div className="home-content">
              {isNewUser ? (
                <h1>Welcome, {user.FirstName}!</h1>
              ) : (
                <h1>Welcome back, {user.FirstName}!</h1>
              )}
              <input
                type="text"
                placeholder="Search adoptees by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <AdopteeListHome searchQuery={searchQuery} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default AdopterHome;
