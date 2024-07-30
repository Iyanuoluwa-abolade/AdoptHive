import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import './AdopteeFavourites.css';

const AdopteeFavourites = () => {
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({});

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

  const handleRankChange = (adopterId, rank) => {
    setPreferences({ ...preferences, [adopterId]: rank });
  };

    return (
        <div className='favourites'>
            <h2>Favourites</h2>
            {error && <div className="error">{error}</div>}
            <ul>
                {favourites.map(fav => (
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
        </div>
    );
};

export default AdopteeFavourites;
