import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

import {
  updateDoc,
  doc,
  collection,
  getDoc,
  getDocs,
  where,
  orderBy,
  limit,
  query,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';
import { list } from 'firebase/storage';
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

  const [userListing, setUserListing] = useState([]); // updated in the useEffect

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

  useEffect(() => {
    // show the listing for the current user
    // TODO: move to Local SERVICES  LAYER  (MVC)
    const fetchUserListing = async () => {
      // do the fetch
      try {
        // the Current User id from localIndexDB
        const userId = auth.currentUser.uid;

        // Refrence for the collection
        const listingsRef = collection(db, 'listings');

        // Build the query
        // const q = query(
        //   listingRef,
        //   // it will select a all coucumnets where userRef = `Current UID`
        //   where('userRef', '==', userId),
        //   orderBy('timestamp', 'desc'),
        //   limit(10)
        // );

        const q = query(
          listingsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        // Execute the Query
        const querySnapShot = await getDocs(q);

        console.log(querySnapShot);
        const mListing = []; //
        querySnapShot.forEach((doc) => {
          return mListing.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // update data state
        setUserListing(mListing);
        console.log('fetched UserListing', mListing);
        //  updated state , the JSX element will be reacted to
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserListing();
  }, [auth.currentUser.uid]);
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

  const onDelete = async (listingID) => {
    // make acoonfirm
    if (window.confirm('are you sure to delete')) {
      await deleteDoc(doc(db, 'listings', listingID));

      // ok now filter and update the ui
      const updatedListings = userListing.filter(
        (listing) => listing.id !== listingID
      );

      setUserListing(updatedListings);
      toast.success('listing has been deleted!');
    }
  };

  const onEdit = (listingId) => {
    // this function just navigate to the edit page
    navigate(`/edit-listing/${listingId}`);
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

          {/* Create the Add Listing Here  */}
          {/* //TODO: move to offer Page */}
          <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="home" />
            <p>Sell or rent Home</p>
            <img src={arrowRightIcon} alt="arrowRightIcon" />
          </Link>

          {/* the Listings */}
          <p className="pageHeader">My Listings :</p>

          <ul className="categoryListings">
            {userListing.map((item) => (
              // <ListingItem listing={item} id={}/>
              // <h3 key={listing.id}>{item.data.name}</h3>
              <ListingItem
                key={item.id}
                listing={item.data}
                id={item.id}
                onDelete={() => onDelete(item.id)}
                onEdit={() => onEdit(item.id)}
              />
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}

export default Profile;
