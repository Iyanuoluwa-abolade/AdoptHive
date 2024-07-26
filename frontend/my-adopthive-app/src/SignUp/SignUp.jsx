import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css';

const SignUp = () => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [email, setemail] = useState('')
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState("Adoptee");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3004/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ FirstName, LastName, email, Username, Password, ConfirmPassword, role }),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        updateUser(result.user);
        navigate(result.redirectUrl);
      } else {
        setError('Sign Up failed');
      }
    } catch (error) {
      setError('Sign Up failed: ' + error.message);
    }
  }

  function navigateToSignIn() {
    navigate('/signin');
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>SignUp to AdoptHive</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            id="FirstName"
            placeholder="First Name"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            id="LastName"
            placeholder="Last Name"
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <input
            type="text"
            id="Username"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className='password-container'>
            <input
              type={showPassword ? 'text' : 'password'}
              id="Password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="toggle-password"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className='password-container'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="ConfirmPassword"
              placeholder="Confirm Password"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          <label style={{ color: 'white' }}>Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Adopter">Adopter</option>
            <option value="Adoptee">Adoptee</option>
          </select>
          {error && <div className="error">{error}</div>}
          <p className='already-have-account'>
            Already have an account?{' '}
            <a className="signin-link" onClick={navigateToSignIn}>
              Sign In
            </a>
          </p>
          <button>Get Started</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
