import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const AdopteeProfile = () => {
  const { user } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [background, setBackground] = useState('');
  const [interests, setInterests] = useState('');
  const [education, setEducation] = useState('');
  const [traits, setTraits] = useState('');
  const [dreams, setDreams] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      UserId: user.id,
      firstName,
      lastName,
      age,
      sex,
      birthdate,
      photoUrl,
      background,
      interests,
      education,
      traits,
      dreams,
      city,
      country,
    };

    const response = await fetch('http://localhost:3004/adoptee-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      navigate('/adoptee-home');
    } else {
      setError('Failed to save adoptee profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
      <select value={sex} onChange={(e) => setSex(e.target.value)} required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} placeholder="Birthdate" required />
      <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Photo URL" />
      <textarea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Background"></textarea>
      <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Interests"></textarea>
      <textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Education"></textarea>
      <textarea value={traits} onChange={(e) => setTraits(e.target.value)} placeholder="Traits"></textarea>
      <textarea value={dreams} onChange={(e) => setDreams(e.target.value)} placeholder="Dreams"></textarea>
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
      <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" required />
      {error && <div className="error">{error}</div>}
      <button type="submit">Save Profile</button>
    </form>
  );
};
export default AdopteeProfile;
