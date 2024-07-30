import { useState, useEffect, useContext} from 'react';
import './AdopterList.css';
import { UserContext } from '../UserContext';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';
import Spinner from '../Loading/Loading';
import useLoading from '../useLoading/useLoading';

const AdopterList = () => {
  const [adopters, setAdopters] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const [matchResult, setMatchResult] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const UserId = user.id

  useEffect(() => {
    startLoading();
    fetchAdopters();
  }, []);

  const fetchAdopters = async () => {
    try {
      const response = await fetch('http://localhost:3004/adopter');
      if (response.ok) {
        const data = await response.json();
        setAdopters(data);
      } else {
        setError('Failed to fetch adopters');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    } finally {
      stopLoading();
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

  const handleRunMatching = async () => {
    try {
      const response = await fetch('http://localhost:3004/run-matching', {
        credentials: 'include',
      });
      if (response.ok) {
        const match = await response.json();
        setMatchResult(match);
      } else {
        setError('Failed to fetch matches');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  function toggleSideBar() {
    setIsSideBarOpen(!isSideBarOpen);
  }

  return (
    <div className='adopter-list-container'>
      <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <h2>Adopters</h2>
            <ul>
              {adopters.map((adopter) => (
                <li key={adopter.id}>
                  <h3>{adopter.firstName} {adopter.lastName}</h3>
                  <img src={adopter.photoUrl} alt={`${adopter.firstName} ${adopter.lastName}`} />
                  <p>Age: {adopter.age}</p>
                  <p>Sex: {adopter.sex}</p>
                  <p>Status: {adopter.status}</p>
                  <p>Background: {adopter.background}</p>
                  <p>City: {adopter.city}</p>
                  <p>Country: {adopter.country}</p>
                  <div className="rank-container">
                    <label>Rank: </label>
                    <input
                      type="number"
                      min="1"
                      onChange={(e) => handleRankChange(adopter.id, parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <i
                    className={`fa-solid fa-heart ${favourites.includes(adopter.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(adopter.id, true)}
                    style={{
                      color: favourites.includes(adopter.id) ? 'red' : 'gray',
                      cursor: 'pointer'
                    }}
                  />
                </li>
              ))}
            </ul>
            <button type="submit">Save Preferences</button>
            <button type="button" onClick={handleRunMatching}>Run Matching</button>
          </form>
          {matchResult && matchResult.adopter && (
            <div className='match-result'>
              <h3>Match Result</h3>
              <p>
                Matched with: {matchResult.adopter.firstName} {matchResult.adopter.lastName}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdopterList;
