import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
function Profile() {
  const auth = getAuth(); //
  // this will get Invoked once  the page Load
  // we want to save the user data using use State
  // there for we call useState
  // const [user, setUser] = useState(null); // passing an Null!

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  // init navigate
  const navigate = useNavigate();

  // log out and clear the user data from browser memoery
  const onLogOut = () => {
    auth.signOut();

    navigate('/'); // go to main page (explore)
  };

  /**
   * no need for use effect repalces with pirvateRoute
   */
  // useEffect(() => {
  //   // this
  //   console.log(auth.currentUser);
  //   setUser(auth.currentUser);
  // }, []);
  // if User not null ->
  // return user ? (
  //   <p>User Goes Here {JSON.stringify(user)}</p>
  // ) : (
  //   <h1>No User Logedin </h1>
  // );
  // the user data are saved in indexsDB browser dev  tools
  // no user

  // to update the user data in firestore
  // clicked when clickin "done"
  const onSubmit = async () => {
    // here we update to the database
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name  in auth
        // https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in fireStire
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          // we update the name in the firestore
          name: name,
          // or  name,  instaed of name:name
        });
      }
    } catch (error) {
      console.log('Error', error);
      toast.error('Could not update prfoile Details');
    }
  };

  // this will update the user data when input get changed
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, // passing the prev state as an object and update to it
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <>
      {/* Adding Logout  */}
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader"> My Profile</p>
          <button onClick={onLogOut} type="button" className="logOut">
            Log out
          </button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              onClick={() => {
                // if change deatils is true , then we submit
                changeDetails && onSubmit();

                // if change deatils is flase , then set it to true so we can update user data
                // the changeDetails will make sure the input is disabled
                setChangeDetails(!changeDetails);
              }}
              className="changePersonalDetails">
              {changeDetails ? 'done' : 'change'}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name" // if id !== formadata params , setFormData will not work as it should to
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />

              <input
                type="email"
                id="email"
                className={
                  !changeDetails ? 'profileEmail' : 'profileEmailActive'
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;
