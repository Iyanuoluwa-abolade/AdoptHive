import { useState, useEffect } from 'react';
import './AdopteeList.css';
import AdopteeSideBar from '../AdopteeSideBar/AdopteeSideBar';
import Spinner from '../Loading/Loading';
import useLoading from '../useLoading/useLoading';

const AdopteeList = () => {
  const [adoptees, setAdoptees] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    const fetchAdoptees = async () => {
      try {
        const response = await fetch('http://localhost:3004/adoptee');
        if (response.ok) {
          const data = await response.json();
          setAdoptees(data);
        } else {
          setError('Failed to fetch adopters');
        }
      } catch (error) {
        setError('Error: ' + error.message);
      } finally {
        stopLoading();
      }
    };
    fetchAdoptees();
  }, []);

  const handleRankChange = (adopteeId, rank) => {
    setPreferences({ ...preferences, [adopteeId]: rank });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const preferenceList = Object.keys(preferences).map(adopteeId => ({
      adopterId: parseInt(adopteeId),
      rank: preferences[adopteeId]
    }));
    try {
      const response = await fetch('http://localhost:3004/adopter-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences: preferenceList })
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
    <div className='adoptee-list-container'>
      <AdopteeSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      {isLoading ? (
      <Spinner />
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <h2>Adoptees</h2>
            <ul>
              {adoptees.map((adoptee) => (
                <li key={adoptee.id}>
                  <h3>{adoptee.firstName} {adoptee.lastName}</h3>
                  <img src={adoptee.photoUrl} alt={`${adoptee.firstName} ${adoptee.lastName}`} />
                  <p>Age: {adoptee.age}</p>
                  <p>Sex: {adoptee.sex}</p>
                  <p>Birthdate: {adoptee.birthdate}</p>
                  <p>Background: {adoptee.background}</p>
                  <p>Interests: {adoptee.interests}</p>
                  <p>Education: {adoptee.education}</p>
                  <p>Traits: {adoptee.traits}</p>
                <p>Dreams: {adoptee.dreams}</p>
                  <div className="rank-container">
                    <label>Rank: </label>
                    <input
                      type="number"
                      min="1"
                      onChange={(e) => handleRankChange(adoptee.id, parseInt(e.target.value))}
                      required
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button type="submit">Save Preferences</button>
            <button type="button" onClick={handleRunMatching}>Run Matching</button>
          </form>
          {matchResult && matchResult.adoptee && (
            <div className='match-result'>
              <h3>Match Result</h3>
              <p>
                Matched with: {matchResult.adoptee.firstName} {matchResult.adoptee.lastName}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdopteeList;
