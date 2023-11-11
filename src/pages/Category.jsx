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

function Category() {
  // component level state
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState('');
  const params = useParams(); // to tell if is it ren or sell ?
  let k = 1;

  // https://react.dev/learn/preserving-and-resetting-state
  // https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
  // we want async function
  const fetchListing = async () => {
    console.log('called ', k);
    !k ? (k = 0) : k++;
    try {
      // get  a refrence
      const listingRef = collection(db, 'listings');

      // let startAfter1 = '';
      // if (lastFetchedListing == '') {
      //   startAfter1 = '';
      // } else {
      //   startAfter1 = lastFetchedListing;
      // }
      // toast.success(startAfter1);
      // create Query
      const q = query(
        listingRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc')
        // startAfter(lastFetchedListing),
        // limit(1)
      );

      // Execute Query
      const querySnap = await getDocs(q); // we get snapShot

      // add the docs
      const mListing = [];
      querySnap.forEach((doc) => {
        return mListing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // now Update component Level Listing
      setListing(mListing);
      // setListing((prevState) => [...prevState, ...mListing]); // we add to the previous array we cross aspread over
      setLoading(false);

      // save the last fetched Item
      // const lastVisbile = querySnap.docs[querySnap.docs.length - 1];
      // console.log('Last visible', lastVisbile.id);
      // setLastFetchedListing(lastVisbile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [params.categoryName]);
  //   return <div>{JSON.stringify(listing)}</div>;
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {/* {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for Sell'} */}

          {`places for ${params.categoryName}`}
        </p>
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
              <br />
              {/* TODO:change to scroll listner */}
              {/* <p className="loadMore" onClick={fetchListing}>
                Load More
              </p> */}
            </ul>
          </main>
        </>
      ) : (
        <p>No Litsing for {params.categoryName} </p>
      )}
    </div>
  );
}

export default Category;
