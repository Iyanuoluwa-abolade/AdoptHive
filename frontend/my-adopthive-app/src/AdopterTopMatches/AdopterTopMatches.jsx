import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import './AdopterTopMatches.css';
import AdopterSideBar from '../AdopterSideBar/AdopterSideBar';

const AdopterTopMatches = () => {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [showMatches, setShowMatches] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    if (showMatches) {
      const fetchMatches = async () => {
        if (!user || !user.id) {
          setError('User not logged in');
          return;
        }
        try {
          const response = await fetch(`http://localhost:3004/api/calculate-matches?userId=${user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch matches');
          }
          const data = await response.json();
          setMatches(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchMatches();
    }
  }, [user, showMatches]);

  const handleButtonClick = () => {
    setShowMatches(prevShowMatches => !prevShowMatches);
  };

  function toggleSideBar()  {
    setIsSideBarOpen(!isSideBarOpen);
  }

  return (
    <div className="top-matches-container">
      <AdopterSideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      <h2>Top Matches</h2>
      {error && <div className="error">{error}</div>}
      <button onClick={handleButtonClick}>
        {showMatches ? 'Hide Matches' : 'Show Top Matches'}
      </button>
      {showMatches && (
        <ul>
          {matches.map(match => (
            <li key={match.id}>
              <div>
                <h3>{match.firstName} {match.lastName}</h3>
                <p>Age: {match.age}</p>
                <p>Location: {match.city}, {match.country}</p>
                <p>Score: {match.matchScore}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdopterTopMatches;
