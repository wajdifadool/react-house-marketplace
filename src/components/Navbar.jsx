import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as ProfileIcon } from '../assets/svg/personOutlineIcon.svg';

// we imported the SVG as React Components

function Navbar() {
  // https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const location = useLocation();

  // update style for selected  navBar item
  const pathMatchRoute = (route) => {
    return route === location.pathname;
    // @todo - return the class name instated if boolean
  };
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          {/* Explore */}
          <li onClick={(e) => navigate('/')} className="navbarListItem">
            <ExploreIcon
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }>
              Explore
            </p>
          </li>

          {/* Offer */}
          <li onClick={(e) => navigate('/offers')} className="navbarListItem">
            <OfferIcon
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/offers')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }>
              Offer
            </p>
          </li>

          {/* Profile */}

          <li onClick={() => navigate('/profile')} className="navbarListItem">
            <ProfileIcon
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }>
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
