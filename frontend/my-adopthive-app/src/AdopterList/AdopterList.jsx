import { useState, useEffect } from 'react';

const AdopterList = () => {
  const [adopters, setAdopters] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
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
      }
    };

    fetchAdopters();
  }, []);

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
        setError('Failed to fetch matches');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Adopters List</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <ul>
          {adopters.map((adopter) => (
            <li key={adopter.id}>
              <h3>{adopter.firstName} {adopter.lastName}</h3>
              <p>Age: {adopter.age}</p>
              <p>Sex: {adopter.sex}</p>
              <p>Status: {adopter.status}</p>
              <p>Background: {adopter.background}</p>
              <p>City: {adopter.city}</p>
              <p>Country: {adopter.country}</p>
              <img src={adopter.photoUrl} alt={`${adopter.firstName} ${adopter.lastName}`} />
              <div>
                <label>Rank: </label>
                <input
                  type="number"
                  min="1"

                  onChange={(e) => handleRankChange(adopter.id, parseInt(e.target.value))}
                  required
                />
              </div>
            </li>
          ))}
        </ul>
        <button type="submit">Save Preferences</button>
        <button type="button" onClick={handleRunMatching}>Run Matching</button>
      </form>
      {matchResult && matchResult.adopter && (
        <div>
          <h3>Match Result</h3>
          <p>
            Matched with: {matchResult.adopter.firstName} {matchResult.adopter.lastName}
          </p>
        </div>
      )}
    </div>
  );
};
export default AdopterList;
