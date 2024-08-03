import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import './AdopteeFavourites.css';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';

const AdopteeFavourites = () => {
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState('');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const UserId = user.id

  useEffect(() => {
    fetchFavourites();
  }, [user]);
  const fetchFavourites = async () => {
    try {
      const response = await fetch(`http://localhost:3004/favourites?userId=${UserId}`);
      if (response.ok) {
        const data = await response.json();
        setFavourites(data);
      } else {
        setError('Failed to fetch favourites');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  function toggleSideBar() {
    setIsSideBarOpen(!isSideBarOpen);
  }

    return (
      <div className='container'>
      <div className='sidebar'>
        <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      </div>
      <div className='favourites'>
        <h2>Favourites</h2>
        {error && <div className="error">{error}</div>}
        <ul>
          {favourites && favourites.map(fav => (
            <li key={fav.id}>
              <div>
                <h3>{fav.adopter.firstName} {fav.adopter.lastName}</h3>
                <img src={fav.adopter.photoUrl} alt={`${fav.adopter.firstName} ${fav.adopter.lastName}`} />
                <p>Age: {fav.adopter.age}</p>
                <p>Sex: {fav.adopter.sex}</p>
                <p>Status: {fav.adopter.status}</p>
                <p>Background: {fav.adopter.background}</p>
                <p>City: {fav.adopter.city}</p>
                <p>Country: {fav.adopter.country}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdopteeFavourites;
