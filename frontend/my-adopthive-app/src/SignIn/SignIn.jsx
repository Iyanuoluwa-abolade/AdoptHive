import { useState, useContext } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();


    if (!Username || !Password) {
      setError('Please enter a username and password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3001/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, Password }),
        credentials: 'include',
      });

      if (response.ok) {
        const user = await response.json();
        updateUser(user.user)


        navigate('/Home');
      } else {
        setError('Error signing in');
        navigate('/Home');
      }
    } catch (error) {
      setError('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="sign-in-page">
      <div className="sign-in">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="inputs">
            <input
              type="text"
              id="Username"
              placeholder="Username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className='password-container'></div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="Password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={togglePasswordVisibility}
              />
          </div>
          {error && <div className="error">{error}</div>}
          <p className='new-to-adopthive'>
            New to AdoptHive?{' '}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
          <button
            className="Sign-in-btn"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
