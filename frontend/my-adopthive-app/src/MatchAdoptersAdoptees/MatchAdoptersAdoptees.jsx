import { useEffect, useState } from 'react';
import './MatchAdoptersAdoptees.css';

const MatchAdoptersAdoptees = () => {
  const [matchedResults, setMatchedResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/matches');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMatchedResults(data);

        setLoading(false);
      } catch (error) {
        return ('Error fetching matched data:', error);

      }
    };

    fetchMatchedData();
  }, []);

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (!matchedResults || Object.keys(matchedResults).length === 0) {
    return <p  className="no-results-message">No matched results found.</p>;
  }

  const matchedAdoptee = Object.values(matchedResults)[0];

  return (
    <div className="matched-results-container">
      <h2>Matched Adoptee</h2>
      {matchedAdoptee ? (
        <p>
          Your matched adoptee is: {matchedAdoptee.firstName} {matchedAdoptee.lastName}.
        </p>
      ) : (
        <p className="no-results-message">No matched adoptee found.</p>
      )}
    </div>
  );
};

export default MatchAdoptersAdoptees;
