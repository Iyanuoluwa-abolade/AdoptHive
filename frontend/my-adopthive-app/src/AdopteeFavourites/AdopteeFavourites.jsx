import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import './AdopteeFavourites.css';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';

const AdopteeFavourites = () => {
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({});
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

  const handleRankChange = (adopterId, rank) => {
    setPreferences({ ...preferences, [adopterId]: rank });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const preferenceList = Object.keys(preferences).map(adopterId => ({
      adopterId: parseInt(adopterId),
      rank: preferences[adopterId]
    }));
    try {
      const response = await fetch('http://localhost:3004/adoptee-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences: preferenceList, UserId })
      });

      if (response.ok) {
        alert('Preferences saved successfully');
      } else {
        setError('Failed to save preferences');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  function toggleSideBar() {
    setIsSideBarOpen(!isSideBarOpen);
  }

    return (
        <div className='favourites'>
            <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
              <form onSubmit={handleSubmit}>
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
                            <div className="rank-container">
                                <label>Rank: </label>
                                <input
                                    type="number"
                                    min="1"
                                    onChange={(e) => handleRankChange(fav.adopter.id, parseInt(e.target.value))}
                                    required
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <button type="submit">Save Preferences</button>
          </form>
        </div>
    );
};

export default AdopteeFavourites;
