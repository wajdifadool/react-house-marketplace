import React from 'react';
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//   useSearchParams is use to get the route query String

function Contact() {
  const [message, setMessage] = useState('');
  const [landLord, setLandLord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  const onChange = (e) => setMessage(e.target.value);

  useEffect(() => {
    const getLandLoardData = async () => {
      const docRef = doc(db, 'users', params.landLordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandLord(docSnap.data());
        console.log('Cool');
      } else {
        // Maby the landlord =dont exisets !
        toast.error('landLord data dont exist in our database any more ! ');
      }
    };
    getLandLoardData();
  }, [params.landLordId]);
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact LandLord</p>
      </header>

      {landLord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landLord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}></textarea>
            </div>

            <a
              href={`mailto:${landLord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}>
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}

      {/* {landLord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landLord?.name}</p>
          </div>
          
          <p className='messageLabel'>Email: {landLord?.email}</p>
          <p className='messageLabel'>Number: {landLord?.number}</p>
        </main>
      )} */}
    </div>
  );
}

export default Contact;
