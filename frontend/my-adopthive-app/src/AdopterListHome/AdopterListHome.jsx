import { useState, useEffect, useContext } from 'react';
import './AdopterListHome.css';
import { UserContext } from '../UserContext';

const AdopterListHome = () => {
  const [adopters, setAdopters] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const UserId = user.id

  useEffect(() => {
    const fetchAdopters = async () => {
      try {
        const response = await fetch('http://localhost:3004/adopter');
        if (!response.ok) {
          throw new Error('Failed to fetch adopters');
        }
        const data = await response.json();
        setAdopters(data);
      } catch (error) {
        setError('Error: ' + error.message);
      }
    };
    fetchAdopters();
  }, []);

  const handleLike = async (profileId, isAdopter) => {
    try {
      if (favourites.includes(profileId)) {
        const response = await fetch(`http://localhost:3004/favourites/${UserId}/${profileId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setFavourites(favourites.filter(id => id !== profileId));
        } else {
          setError('Failed to remove from favourites');
        }
      } else {
        const response = await fetch('http://localhost:3004/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserId, adopterId: isAdopter ? profileId : null, adopteeId: !isAdopter ? profileId : null })
        });
        if (response.ok) {
          setFavourites([...favourites, profileId]);
        } else {
          setError('Failed to add to favourites');
        }
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div className="adopter-list">
      {error && <div className="error">{error}</div>}
      {adopters.length > 0 ? (
        adopters.map((adopter) => (
          <div key={adopter.id} className="adopter-details">
            <img src={adopter.photoUrl} alt={`${adopter.firstName} ${adopter.lastName}`} />
            <div className='adopter-info'>
                <h3>
                    {adopter.firstName} {adopter.lastName}
                </h3>
            </div>
            <div className='adopter-age'>
                <p> {adopter.age}, {adopter.status} </p>
            </div>
            <i
              className={`fa-solid fa-heart ${favourites.includes(adopter.id) ? 'liked' : ''}`}
              onClick={() => handleLike(adopter.id, true)}
              style={{
                color: favourites.includes(adopter.id) ? 'red' : 'gray',
                cursor: 'pointer'
              }}
            />
          </div>
        ))
      ) : (
        <p>No adopters found</p>
      )}
    </div>
  );
};
export default AdopterListHome;
