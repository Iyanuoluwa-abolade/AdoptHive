import React, { useState, useContext } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter a username and password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5173/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const SignedInUser = data.user;

        updateUser(SignedInUser);

        navigate('/');
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

  return (
    <div className="sign-in-page">
      <div className="sign-in">
        <h2>AdoptHive</h2>
        <form onSubmit={handleSignIn}>
          <div className="inputs">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <p>
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
