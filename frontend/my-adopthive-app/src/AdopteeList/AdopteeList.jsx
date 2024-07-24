import { useState, useEffect } from 'react';

const AdopteeList = () => {
  const [adoptees, setAdoptees] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    const fetchAdoptees = async () => {
      try {
        const response = await fetch('http://localhost:3004/adoptee');
        if (response.ok) {
          const data = await response.json();
          setAdoptees(data);
        } else {
          setError('Failed to fetch adoptees');
        }
      } catch (error) {
        setError('Error: ' + error.message);
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
      adopteeId: parseInt(adopteeId),
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
      })
      if (response.ok) {
        const match = await response.json();
        setMatchResult(match);
      } else {
        setError('Failed to run matching');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Adoptees List</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <ul>
          {adoptees.map((adoptee) => (
            <li key={adoptee.id}>
              <h3>{adoptee.firstName} {adoptee.lastName}</h3>
              <p>Age: {adoptee.age}</p>
              <p>Sex: {adoptee.sex}</p>
              <p>Birthdate: {adoptee.birthdate}</p>
              <p>Background: {adoptee.background}</p>
              <p>Interests: {adoptee.interests}</p>
              <p>Education: {adoptee.education}</p>
              <p>Traits: {adoptee.traits}</p>
              <p>Dreams: {adoptee.dreams}</p>
              <img src={adoptee.photoUrl} alt={`${adoptee.firstName} ${adoptee.lastName}`} />
              <div>
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
      {matchResult && (
        <div>
          <h3>Match Result</h3>
          <p>
            Matched with: {matchResult.adoptee.firstName} {matchResult.adoptee.lastName}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdopteeList;
