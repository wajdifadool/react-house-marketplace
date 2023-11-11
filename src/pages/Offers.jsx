import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // we need to tell if its sell or rent
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'; //

import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
  // component level state
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // to tell if is it ren or sell ?
  let k = 1;
  useEffect(() => {
    // https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
    // we want async function
    const fetchListing = async () => {
      console.log('called ', k);
      !k ? (k = 0) : k++;
      try {
        // get  a refrence
        const listingRef = collection(db, 'listings');

        // create Query
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc')
          // limit(10)
        );

        // Execute Query
        const querySnap = await getDocs(q); // we get snapShot

        const mListing = [];
        querySnap.forEach((doc) => {
          return mListing.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // now Update component Level Listing
        setListing(mListing);
        setLoading(false);
      } catch (error) {}
    };
    fetchListing();
  }, []);
  //   return <div>{JSON.stringify(listing)}</div>;
  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {/* check if its loading   */}
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          {/* Listings Goes here  */}
          {/* {JSON.stringify(listing)} */}
          <main>
            <ul className="categoryListings">
              {listing.map((item) => (
                // <ListingItem listing={item} id={}/>
                // <h3 key={listing.id}>{item.data.name}</h3>
                <ListingItem key={item.id} listing={item.data} id={item.id} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No Current Offers </p>
      )}
    </div>
  );
}

export default Offers;
