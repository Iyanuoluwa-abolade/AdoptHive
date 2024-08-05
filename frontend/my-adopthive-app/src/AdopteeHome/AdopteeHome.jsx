import { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../UserContext';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';
import AdopterListHome from '../AdopterListHome/AdopterListHome';
import Spinner from '../Loading/Loading';
import useLoading from '../useLoading/useLoading';
import './AdopteeHome.css';

function AdopteeHome({ setReceiverId }) {
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
            <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <div className="home-content">
              {isNewUser ? (
                <h1>Welcome, {user.FirstName}!</h1>
              ) : (
                <h1>Welcome back, {user.FirstName}!</h1>
              )}
              <input
                type="text"
                placeholder="Search adopters by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <AdopterListHome searchQuery={searchQuery} setReceiverId={setReceiverId} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

AdopteeHome.propTypes = {
  setReceiverId: PropTypes.func.isRequired,
};

export default AdopteeHome;
