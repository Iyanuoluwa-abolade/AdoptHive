import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdopteesProfile.css';

const AdopteesProfile = () => {
  const [adoptees, setAdoptees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdoptees = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/adoptees-profile');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdoptees(data);
      } catch (error) {
        return('Error fetching adoptees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptees();
  }, []);

  const handleMatchAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/matches', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


    } catch (error) {
      return('Error triggering matching process:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="adoptees-profile-container">
      <h2>Adoptees Profiles</h2>
      <ul className="adoptees-list">
        {adoptees.map((adoptee) => (
          <li key={adoptee.id} className="adoptees-item">

            <img src={adoptee.photoUrl} alt={`${adoptee.firstName} ${adoptee.lastName}`} className="adoptees-photo" />
            <p>Name: {adoptee.firstName} {adoptee.lastName}</p>
            <p>Age: {adoptee.age}</p>
            <p>Birthdate: {adoptee.birthdate}</p>
            <p>Background: {adoptee.background}</p>
            <p>Interests: {adoptee.interests}</p>
            <p>Education: {adoptee.education}</p>
            <p>Traits: {adoptee.traits}</p>
          </li>
        ))}
      </ul>

      <button onClick={handleMatchAll}className='button-link-container'>Match All Adoptees</button>
      <Link to="/match-adopters-adoptees"className="view-matches-link">View Matches</Link>

    </div>
  );
};

export default AdopteesProfile;
