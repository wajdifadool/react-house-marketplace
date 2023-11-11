import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import ForgetPassword from './pages/ForgetPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Listing from './pages/Listing';
import Category from './pages/Category';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import EditListing from './pages/EditListing';
import Navbar from './components/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './pages/CreateListing';
import Contact from './pages/Contact';

// Nav Bar goes here
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />}></Route>
          {/* could be rent or sell */}
          {/* categoryName is  NOT saved keyword  */}
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/offers" element={<Offers />}></Route>

          {/* nest The route */}
          {/* https://www.robinwieruch.de/react-router-private-routes/ */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* @todo update  profile page */}
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/forget-password" element={<ForgetPassword />}></Route>
          <Route path="/create-listing" element={<CreateListing />} />
          {/* TODO: change all params names to variables  */}
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<EditListing />}
          />
          {/* Contact LandLord baseed on uid  */}
          <Route path="/contact/:landLordId" element={<Contact />}></Route>
        </Routes>
        {/* nav bar */}
        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
