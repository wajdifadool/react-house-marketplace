import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import ForgetPassword from './pages/ForgetPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Nav Bar goes here
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />}></Route>
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
        </Routes>
        {/* nav bar */}
        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
