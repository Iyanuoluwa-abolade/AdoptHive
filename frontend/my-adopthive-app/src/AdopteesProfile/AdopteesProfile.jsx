import React, { useEffect, useState } from 'react';
import './AdopteesProfile.css'

const AdopteesProfile = () => {
  const [Adoptee, setAdoptee] = useState([]);

  useEffect(() => {
    const fetchAdoptee = async () => {
      try {
        const response = await fetch('http://localhost:3001/adoptee-profile'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdoptee(data);
      } catch (error) {

      }
    };

    fetchAdoptee();
  }, []);

  return (
    <div className="adoptees-profile-container">
      <h2>Adoptees Profiles</h2>
      <ul className='adoptees-list'>
        {Adoptee.map(adoptee => (
          <li key={adoptee.id} className='adoptee-item'>
            <p>Name: {adoptee.firstName} {adoptee.lastName}</p>
            <p>Age: {adoptee.age}</p>
            <p>Birthdate: {adoptee.birthdate}</p>
            <img src={adoptee.photoUrl} alt={`${adoptee.firstName} ${adoptee.lastName}`} className='adoptee-photo' />
            <p>Background: {adoptee.background}</p>
            <p>Interests: {adoptee.interests}</p>
            <p>Education: {adoptee.education}</p>
            <p>Traits: {adoptee.traits}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdopteesProfile;
