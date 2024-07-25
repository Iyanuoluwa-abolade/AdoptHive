import { useState, useEffect } from 'react';
import './AdopterListHome.css';

const AdopterListHome = () => {
  const [adopters, setAdopters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdopters = async () => {
      try {
        const response = await fetch('http://localhost:3004/adopter');
        if (!response.ok) {
          throw new Error('Failed to fetch adoptees');
        }
        const data = await response.json();
        setAdopters(data);
      } catch (error) {
        setError('Error: ' + error.message);
      }
    };

    fetchAdopters();
  }, []);

  return (
    <div className="adopter-list">
      {error && <div className="error">{error}</div>}

      {adopters.length > 0 ? (
        adopters.map((adopter) => (
          <div key={adopter.id} className="adopter-details">
            <img src={adopter.photoUrl} alt={`${adopter.firstName} ${adopter.lastName}`} />
            <h3>
              {adopter.firstName} {adopter.lastName}
            </h3>
            <p>Age: {adopter.age}</p>
            <p>Sex: {adopter.sex}</p>
            <p>Status: {adopter.status}</p>
            <p>Background: {adopter.background}</p>
            <p>City: {adopter.city}</p>
            <p>Country: {adopter.country}</p>
          </div>
        ))
      ) : (
        <p>No adopters found</p>
      )}
    </div>
  );
};
export default AdopterListHome;
