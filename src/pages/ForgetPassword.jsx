import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    console.log(email);
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('email was sent, check your inbox ');
    } catch (error) {
      // @todo, handle error.code for better UX
      toast.error('something went worng !');
      console.log(error);
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Foreget Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="eamil"
            id="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={onChange}
          />

          <Link className="forgetPasswordLink" to="/sign-in">
            Sign in
          </Link>

          <div className="signInBar">
            <p className="signInText">Send Reset Link </p>
            <button
              //

              className="signInButton">
              <ArrowRightIcon
                /**/
                fill="#fff"
                width="34px"
                height="34px"
              />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgetPassword;
