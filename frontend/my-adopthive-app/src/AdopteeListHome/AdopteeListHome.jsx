import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import './AdopteeListHome.css';
import { UserContext } from '../UserContext';

const AdopteeListHome = ({ searchQuery }) => {
  const [adoptees, setAdoptees] = useState([]);
  const [filteredAdoptees, setFilteredAdoptees] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const UserId = user.id;

  useEffect(() => {
    const fetchAdoptees = async () => {
      try {
        const response = await fetch('http://localhost:3004/adoptee');
        if (!response.ok) {
          throw new Error('Failed to fetch adoptees');
        }
        const data = await response.json();
        setAdoptees(data);
        setFilteredAdoptees(data);
      } catch (error) {
        setError('Error: ' + error.message);
      }
    };
    fetchAdoptees();
  }, []);

  useEffect(() => {
    const results = adoptees.filter(adoptee =>
      `${adoptee.firstName} ${adoptee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdoptees(results);
  }, [searchQuery, adoptees]);

  const handleLike = async (profileId, isAdoptee) => {
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
          body: JSON.stringify({ UserId, adopteeId: isAdoptee ? profileId : null, adopterId: !isAdoptee ? profileId : null })
        });
        if (response.ok) {
          setFavourites([...favourites, profileId]);
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to add to favourites');
        }
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div className="adoptee-list">
      {error && <div className="error">{error}</div>}
      {filteredAdoptees.length > 0 ? (
        filteredAdoptees.map((adoptee) => (
          <div key={adoptee.id} className="adoptee-details">
            <img
              src={adoptee.photoUrl}
              alt={`${adoptee.firstName} ${adoptee.lastName}`}
            />
            <div className="adoptee-info">
              <h3>{adoptee.firstName} {adoptee.lastName}</h3>
            </div>
            <div className='adoptee-age'>
              <p>Age: {adoptee.age}</p>
            </div>
            <i
              className={`fa-solid fa-heart ${favourites.includes(adoptee.id) ? 'liked' : ''}`}
              onClick={() => handleLike(adoptee.id, true)}
              style={{
                color: favourites.includes(adoptee.id) ? 'red' : 'gray',
                cursor: 'pointer'
              }}
            />
          </div>
        ))
      ) : (
        <p>No adoptees found</p>
      )}
    </div>
  );
};


AdopteeListHome.propTypes = {
  searchQuery: PropTypes.string.isRequired, 
};

export default AdopteeListHome;
