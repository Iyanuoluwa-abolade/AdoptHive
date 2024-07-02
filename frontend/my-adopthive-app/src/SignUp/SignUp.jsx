// import React, { useState, useContext } from 'react';
// import './SignUp.css'; // Import your CSS for styling
// import { Link, useNavigate } from 'react-router-dom';
// import { UserContext } from '../UserContext.js';

// const SignUp = () => {
//     const [firstname, setFirstName] = useState('');
//     const [middlename, setMiddleName] = useState('');
//     const [lastname, setLastName] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const { updateUser } = useContext(UserContext);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:5173/users`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username, password }),
//                 credentials: 'include',
//             });

//             if ( response.ok) {
//                 const data = await response.json();
//                 const SignedInUser = data.user;

//                 console.log("Sign Up sucessful");

//                 setFirstName('');
//                 setMiddleName('');
//                 setLastName('');
//                 setUsername('');
//                 setPassword('');

//                 updateUser(SignedInUser);

//                 navigate('/');
//             } else {
//                 alert('Sign Up failed');
//             }

//         } catch (error) {
//             alert('Sign in failed:' + error);
//         }
//     }

//     return (
//         <div className="sign-in-container">
//             <form className="sign-in-form" onSubmit={handleSignIn}>
//                 <h2>Sign in to AdoptHive</h2>
//                 <div className="form-control">
//           {/* <label htmlFor="username">Username</label> */}
//                     <input
//                         type="text"
//                         id="username"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername (e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-control">
//           {/* <label htmlFor="password">Password</label> */}
//                     <input
//                         type="password"
//                         id="password"
//                         placeholder='Password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-actions">
//                     <button type="submit">Sign In</button>
//                     <a href="#" onClick={() => console.log('Forgot password clicked')}>
//                         Forgot Password?
//                     </a>
//                 </div>
//                 </form>
//                 <div className="new-to-adopthive">
//                     <p>New to AdoptHive? <Link to="/SignUp">Sign Up now</Link></p>

//                 </div>

//         </div>
//     );
// };

// export default SignUp;

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
  const [Role, setRole] = useState("");
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
        body: JSON.stringify({ FirstName, MiddleName, LastName, Username, Password, ConfirmPassword, Role }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        // const data = await response.json();
        const SignedInUser = data.user;
        console.log('Sign Up sucessful');

        setFirstName('');
        setMiddleName('');
        setLastName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setRole('');

        updateUser(SignedInUser);
        navigate('/');
      } else {
        setError('Sign Up failed');
      }
      if (data.error) {
        setError(data.error);
      }

    } catch (error) {
      console.log(error);
    //   setError('Sign up failed: ' + error.message);
    }
  }

  function navigateToSignIn() {
    navigate('/SignIn');
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
          <input
            type="password"
            id="Password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          <input
            type="password"
            id="ConfirmPassword"
            placeholder="Confirm Password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          <label style={{ color: 'white' }}>Role</label>
          <select
            name="Role"
            value={Role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="AP">Adoptive Parent</option>
            <option value="OS">Orphanage Staff</option>
          </select>
          {/* {error && <div className="error">{error}</div>} */}
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
