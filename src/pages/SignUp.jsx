// Here is the Link
// https://firebase.google.com/docs/auth/web/start
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
// from firebase
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

// Cloud Fire Store
import {
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../firebase.config';

import { toast } from 'react-toastify';

import OAuth from '../components/OAuth';
function SignUp() {
  // the passowrd comopnent
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // we destructure those so we can use them anywhere in the following component
  const { name, password, email } = formData;

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

  // Handle form subbmitiion
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredintails = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredintails);

      // @todo - add local Storage

      const user = userCredintails.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // we signed up, now create the userin the firestore
      // first create the Object
      const formDataCopy = { ...formData }; // copy object, Note the curly brackets
      delete formDataCopy.password; // delete the password
      formDataCopy.timestamp = serverTimestamp(); // First Sign Up TimeStampe

      // now Uplad to FireStore see doc at :
      // LINK: https://firebase.google.com/docs/firestore/manage-data/add-data#web-modular-api_3
      // LINK: https://github.com/firebase/snippets-web/blob/d781c67b528afe99fcdb7c7056104772463fa3ec/snippets/firestore-next/test-firestore/data_types.js#L8-L24
      const dataDocRes = await setDoc(doc(db, 'users', user.uid), formDataCopy);

      // @todo : check for successful data insertion using then await
      // https://stackoverflow.com/questions/70399400/what-does-setdoc-function-return

      console.log('dataDocRes', dataDocRes);

      //we signed up , now navigate to hame page
      // @todo , change to toast !
      console.log('Signed Up');
      navigate('/'); // go to home page
    } catch (error) {
      //  @todo - handle Error :
      //https://www.google.com/search?q=firebase+auth+errors+list&oq=firebase+auth+errors+list+&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDdqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8
      setError(error);
      // console.log('Error Occured ', error);

      // show toast
      toast.error('something went worng !');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmitForm}>
          <input
            //
            placeholder="Name:"
            type="text"
            value={name} //  @todo  fetch from local storage
            id="name" // as the same in the state (MUST)
            className="nameInput"
            onChange={onChange}
          />

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

          <div className="signUpBar">
            <p className="signUpText">Sign up </p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Oauth goes here  */}
        <OAuth />
        {/* Sign Up page */}
        <Link to="/sign-in" className="registerLink mb-100">
          Sign In Instead
        </Link>
      </div>
      {/* End of Page Container */}
    </>
  );
}

export default SignUp;
