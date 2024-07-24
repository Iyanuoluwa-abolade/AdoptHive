import { Link } from 'react-router-dom';
import './MainPage.css'

const MainPage = () => {
  return (
    <div className="main-page">
        <h1>Welcome to AdoptHive!</h1>
        <p>Get started today to find your perfect match.</p>
        <div className="get-started-container">
            <Link to="/signin">
                <button className="get-started-btn">Get Started
                  <i className="fas fa-arrow-right" />
                </button>
            </Link>
        </div>
    </div>
  );
};

export default MainPage;
