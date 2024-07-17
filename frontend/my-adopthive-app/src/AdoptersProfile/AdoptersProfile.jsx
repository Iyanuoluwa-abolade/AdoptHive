import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdoptersProfile.css';

const AdoptersProfile = () => {
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdopters = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/adopters-profile');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdopters(data);
      } catch (error) {
        return ('Error fetching adopters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdopters();
  }, []);

  const handleMatchAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/match', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


    } catch (error) {
      return ('Error triggering matching process:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="adopters-profile-container">
      <h2>Adopters Profiles</h2>
      <ul className="adopters-list">
        {adopters.map((adopter) => (
          <li key={adopter.id} className="adopters-item">
            <p>Name: {adopter.firstName} {adopter.lastName}</p>
            <p>Age: {adopter.age}</p>
            <p>Birthdate: {adopter.birthdate}</p>
            <img src={adopter.photoUrl} alt={`${adopter.firstName} ${adopter.lastName}`} className="adopters-photo" />
            <p>Background: {adopter.background}</p>
            <p>Interests: {adopter.interests}</p>
            <p>Education: {adopter.education}</p>
            <p>Traits: {adopter.traits}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleMatchAll}>Match All Adopters</button>
      <Link to="/match-adopters-adoptees">View Matches</Link>
    </div>
  );
};

export default AdoptersProfile;
