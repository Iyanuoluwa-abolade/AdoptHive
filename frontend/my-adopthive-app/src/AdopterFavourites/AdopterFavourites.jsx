import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import AdopterSideBar from '../AdopterSideBar/AdopterSideBar';
import './AdopterFavourites.css';

const AdopterFavourites = () => {
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({});
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

  const handleRankChange = (adopteeId, rank) => {
    setPreferences({ ...preferences, [adopteeId]: rank });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const preferenceList = Object.keys(preferences).map(adopteeId => ({
      adopteeId: parseInt(adopteeId),
      rank: preferences[adopteeId]
    }));
    try {
      const response = await fetch('http://localhost:3004/adopter-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences: preferenceList, UserId: user.id })
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

  function toggleSideBar()  {
    setIsSideBarOpen(!isSideBarOpen);
  }

    return (
        <div className='favourites'>
            <AdopterSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <h2>Favourites</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                            <div className="rank-container">
                                <label>Rank: </label>
                                <input
                                    type="number"
                                    min="1"
                                    onChange={(e) => handleRankChange(fav.adoptee.id, parseInt(e.target.value))}
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

export default AdopterFavourites;
