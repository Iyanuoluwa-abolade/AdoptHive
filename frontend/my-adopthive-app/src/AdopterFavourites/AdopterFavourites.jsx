import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import AdopterSideBar from '../AdopterSideBar/AdopterSideBar';
import './AdopterFavourites.css';

const AdopterFavourites = () => {
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState('');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user || !user.id) {
        setError('User not logged in');
        return;
      }
      try {
        const response = await fetch(`http://localhost:3004/favourites?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favourites');
        }
        const data = await response.json();
        setFavourites(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchFavourites();
  }, [user]);

  function toggleSideBar()  {
    setIsSideBarOpen(!isSideBarOpen);
  }

    return (
      <div className='container'>
      <div className='sidebar'>
        <AdopterSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      </div>
      <div className='favourites'>
        <h2>Favourites</h2>
        {error && <div className="error">{error}</div>}
        <ul>
          {favourites.map(fav => (
            <li key={fav.id}>
              <div>
                <h3>{fav.adoptee.firstName} {fav.adoptee.lastName}</h3>
                <img src={fav.adoptee.photoUrl} alt={`${fav.adoptee.firstName} ${fav.adoptee.lastName}`} />
                <p>Age: {fav.adoptee.age}</p>
                <p>Sex: {fav.adoptee.sex}</p>
                <p>Birthdate: {fav.adoptee.birthdate}</p>
                <p>Background: {fav.adoptee.background}</p>
                <p>Interests: {fav.adoptee.interests}</p>
                <p>Education: {fav.adoptee.education}</p>
                <p>Traits: {fav.adoptee.traits}</p>
                <p>Dreams: {fav.adoptee.dreams}</p>
                <p>City: {fav.adoptee.city}</p>
                <p>Country: {fav.adoptee.country}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdopterFavourites;
