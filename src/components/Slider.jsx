import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

// Swiper import goes here
// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

import Spinner from './Spinner';

function Slider() {
  //states
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchImages = async () => {
        const listingRef = collection(db, 'listings');

        // create Query
        const q = query(listingRef, orderBy('timestamp', 'desc'), limit(10));

        // Execute Query
        const querySnap = await getDocs(q); // we get snapShot

        const mListing = [];
        querySnap.forEach((doc) => {
          return mListing.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing(mListing);
        console.log(listing);

        setLoading(false);
      };

      fetchImages();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <p className="exploreHeading">Explore</p>

      {/* Swiiper start  */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: '30vh', borderRadius: '10px' }}>
        {/* Destructre the id and the data from the lsiting item  */}
        {listing.map(({ id, data }, index) => {
          return (
            <SwiperSlide
              key={id}
              onClick={() => {
                // console.log('clicked', id);
                navigate(`category/${data.type}/${id}`);
              }}>
              <div
                className="swiperSlideDiv"
                style={{
                  // TODO: change classNames for better UI
                  background: `url(${data.imgUrls[0]}) center center/cover no-repeat`,
                  backgroundSize: 'cover',
                }}>
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ${data.discountPrice ?? data.regularPrice}
                  {data.type === 'rent' && ' / month'}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Swiper end  */}
    </>
  );
}

export default Slider;
