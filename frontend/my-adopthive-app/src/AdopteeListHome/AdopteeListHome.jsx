import { useState, useEffect } from 'react';
import './AdopteeListHome.css';

const AdopteeListHome = () => {
  const [adoptees, setAdoptees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdoptees = async () => {
      try {
        const response = await fetch('http://localhost:3004/adoptee');
        if (!response.ok) {
          throw new Error('Failed to fetch adoptees');
        }
        const data = await response.json();
        setAdoptees(data);
      } catch (error) {
        setError('Error: ' + error.message);
      }
    };

    fetchAdoptees();
  }, []);

  return (
    <div className="adoptee-list">
      {error && <div className="error">{error}</div>}
      {adoptees.length > 0 ? (
        adoptees.map((adoptee) => (
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
          </div>
        ))
      ) : (
        <p>No adoptees found</p>
      )}
    </div>
  );
};

export default AdopteeListHome;
