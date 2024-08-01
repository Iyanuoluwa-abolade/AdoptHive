import Header from '../Header/Header';
import Footer from '../Footer/Footer.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import MainPage from '../MainPage/MainPage';
import AdopteeProfile from '../AdopteeProfile/AdopteeProfile.jsx';
import AdopterProfile from '../AdopterProfile/AdopterProfile.jsx';
import AdopteeList from '../AdopteeList/AdopteeList.jsx';
import AdopterList from '../AdopterList/AdopterList.jsx';
import AdopteeHome from '../AdopteeHome/AdopteeHome.jsx';
import AdopterHome from '../AdopterHome/AdopterHome.jsx';
import { useContext } from 'react';
import './App.css';
import { UserContext, UserProvider } from '../UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdopteeFavourites from '../AdopteeFavourites/AdopteeFavourites.jsx';
import AdopterFavourites from '../AdopterFavourites/AdopterFavourites.jsx';
import AdopterTopMatches from '../AdopterTopMatches/AdopterTopMatches.jsx';
import AdopteeTopMatches from '../AdopteeTopMatches/AdopteeTopMatches.jsx';

function App() {
  const { user, role } = useContext(UserContext);

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <Router>
      <Header />
        <Routes>
          <Route path="/mainpage" element={user ? <MainPage /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to={user ? (role === 'Adopter' ? "/adopter-home" : "/adoptee-home") : "/signin"} />} />
          <Route path="/adopter-profile" element={user ? <AdopterProfile /> : <Navigate to="/signin" />} />
          <Route path="/adoptee-profile" element={user ? <AdopteeProfile /> : <Navigate to="/signin" />} />
          <Route path="/adoptee-list" element={user && role === 'Adopter' ? <AdopteeList adopterId={user.id} /> : <Navigate to="/signin" />} />
          <Route path="/adopter-list" element={user && role === 'Adoptee' ? <AdopterList adopteeId={user.id} /> : <Navigate to="/signin" />} />
          <Route path="/adopter-home" element={user && role === 'Adopter' ? <AdopterHome /> : <Navigate to="/signin" />} />
          <Route path="/adoptee-home" element={user && role === 'Adoptee' ? <AdopteeHome /> : <Navigate to="/signin" />} />
          <Route path="/adoptee-favourites" element={user && role === 'Adoptee' ? <AdopteeFavourites adopteeId={user.id} /> : <Navigate to="/signin" />} />
          <Route path="/adopter-favourites" element={user && role === 'Adopter' ? <AdopterFavourites adopterId={user.id} /> : <Navigate to="/signin" />} />
          <Route path="/adoptee-top-match" element={user && role === 'Adoptee' ? <AdopteeTopMatches adopterId={user.id} /> : <Navigate to="/signin" />} />
          <Route path="/adopter-top-match" element={user && role === 'Adopter' ? <AdopterTopMatches adopterId={user.id} /> : <Navigate to="/signin" />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default WrappedApp;
