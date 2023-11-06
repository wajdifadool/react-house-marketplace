import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import GoogleIcon from '../assets/svg/googleIcon.svg';
function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const OnGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // check if user  is already
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        // if user, dosn't exist, creat user
        await setDoc(
          doc(db, 'users', user.uid), // refrence
          // data
          {
            name: user.displayName,
            email: user.email,
            timestampe: serverTimestamp(),
          }
        );
      }
      // user exists
      navigate('/');
      toast.success(`welcome ${user.displayName}!`);
    } catch (error) {
      toast.error('Could not authorizze with google');
    }
  };
  return (
    <div className="socialLogin">
      {/* //Location passed on the page we are at  */}
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
      <button className="socialIconDiv">
        <img
          className="socialIconImg"
          src={GoogleIcon}
          alt="google"
          onClick={OnGoogleClick}
        />
      </button>
    </div>
  );
}

export default OAuth;
