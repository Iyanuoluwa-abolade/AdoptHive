import React, { useState, useContext } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const [FirstName, setFirstName] = useState('');
  const [MiddleName, setMiddleName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setrole] = useState("AP");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ FirstName, MiddleName, LastName, Username, Password, ConfirmPassword, role }),
        credentials: 'include',
      });

      if (response.ok) {

        const SignedInUser =  await response.json();


        updateUser(SignedInUser);
        navigate('/Home');
      } else {
        setError('Sign Up failed');
      }

    } catch (error) {

    }
  }

  function navigateToSignIn() {
    navigate('/SignIn');
  }

  function togglePasswordVisibility(){
    setShowPassword(!showPassword);
  }

  function toggleConfirmPasswordVisibility(){
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Welcome to AdoptHive</h2>
        <p className="sign-up-text">Sign Up</p>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            id="FirstName"
            placeholder="FirstName"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            id="MiddleName"
            placeholder="MiddleName"
            value={MiddleName}
            onChange={(e) => setMiddleName(e.target.value)}
            required
          />
          <input
            type="text"
            id="LastName"
            placeholder="LastName"
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
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
              type={showPassword ? 'text' :'password'}
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
            onChange={(e) => setrole(e.target.value)}
            required
          >
            <option value="AP">Adoptive Parent</option>
            <option value="OS">Orphanage Staff</option>
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
