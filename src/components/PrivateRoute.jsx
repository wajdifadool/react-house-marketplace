import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';
// will be called twice at least beacuse it listens to useAuthStatus
const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  //   console.log('called  PrivateRoute ', loggedIn);
  if (checkingStatus) {
    return <Spinner />;
  }

  // Outlet here is the child of the PrivateRoute, the Profile
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
