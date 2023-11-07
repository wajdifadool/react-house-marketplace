import { getDoc } from 'firebase/firestore';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDocs, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

// import 'swiper/css/bundle';

// See Example at : https://blog.logrocket.com/react-leaflet-tutorial/
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// get the data
function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedLinkedCopied, setSharedLinkedCopied] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const type = params.categoryName;
        const listingID = params.listingId;
        const docRef = doc(db, 'listings', listingID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setListing(docSnap.data());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.ListingID]);
  //   console.log(params);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {/* </Swiper> */}

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: '50vh' }}>
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${listing.imgUrls[index]}) center center/cover no-repeat`,
                  backgroundSize: 'cover',
                }}></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Share Button */}

      <div
        className="shareIconDiv"
        onClick={() => {
          // Copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          setSharedLinkedCopied(true);
          setTimeout(() => {
            setSharedLinkedCopied(false);
          }, 3000);
        }}>
        <img src={shareIcon} alt="" />
      </div>

      {/* Show an alert !  */}

      {sharedLinkedCopied && <div className="linkCopied">link Copied </div>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - {/*  */}$
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === 'rent' ? 'Rent' : 'Sell'}
        </p>

        {listing.offer && (
          <p className="discountPrice">
            $ {listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>

          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>

          <li>{listing.parking && 'Parking Spot avalabile'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>
        {/* Map */}
        <div className="leafletContainer">
          <MapContainer
            style={{
              height: '100%',
              width: '100%',
            }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton">
            Contact LandLord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
