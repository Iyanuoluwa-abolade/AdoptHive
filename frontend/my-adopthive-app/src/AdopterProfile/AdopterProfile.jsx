import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const AdopterProfile = () => {
  const { user } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [status, setStatus] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [background, setBackground] = useState('');
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
      status,
      photoUrl,
      background,
    };
    try {
      const response = await fetch('http://localhost:4/adopter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate('/adopter-home');
      } else {
        setError('Failed to save adopter profile.');
      }
    } catch (err) {
      setError('Failed to save adopter profile')
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
      <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" required />
      <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Photo URL" />
      <textarea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Background"></textarea>
      {error && <div className="error">{error}</div>}
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default AdopterProfile;
