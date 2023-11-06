import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';
// sign in imports
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// Links: https://firebase.google.com/docs/auth/web/password-auth

import OAuth from '../components/OAuth';

function SignIn() {
  // the passowrd comopnent
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // we destructure those so we can use them anywhere in the following component
  const { password, email } = formData;

  const navigate = useNavigate();
  const onChange = (e) => {
    // after we change them we can see them in the Sig in Component in the dev tools
    setFormData((prevState) => ({
      //  we added () afer the => so we can return an object
      ...prevState, // spread operator for the prestate
      // as long the id === param name in the object we can do the following line
      // instaned of  email: e.target.value ...
      [e.target.id]: e.target.value,
      // email: e.target.value
    }));
  };

  const fetchUserData = (uid) => {
    console.log('UserUID ', uid);
  };
  // Sign in user Here
  const signinUser = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      // firestore Function
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      // if User != null then we signd in
      // signed in
      if (user) {
        // ok fetch user data and navigate
        navigate('/');
        fetchUserData(user.uid);
        // update
      }
    } catch (error) {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      console.log('SignIn.jsx  signinuser() error', error);
      toast.error('Bad user credintails');
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form>
          <input
            //
            placeholder="Email"
            type="email"
            value={email} //  @todo  fetch from local storage
            id="email"
            className="emailInput"
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            {/* if the showPassword is true then we want to show the text otherwise the password */}
            <input
              //
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password} // @todo  fetch from local storage
              id="password"
              className="passwordInput"
              onChange={onChange}
            />

            {/* show the buttin */}
            <img
              src={VisibilityIcon}
              alt="showPass"
              onClick={() => {
                console.log(showPassword);
                setShowPassword(!showPassword);
              }}
              className="showPassword"
            />
          </div>

          {/* forget Password */}
          <Link to="/forget-password" className="forgotPasswordLink">
            forget password ?
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign in </p>
            <button
              //
              onClick={signinUser}
              className="signInButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Oauth goes here  */}
        <OAuth />
        {/* Sign Up page */}
        <Link to="/sign-up" className="registerLink mb-100">
          Sign Up Instead
        </Link>
      </div>
      {/* End of Page Container */}
    </>
  );
}

export default SignIn;
