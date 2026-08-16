import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export function Auth({ requiredRoles }) {
  const location = useLocation();
  const { user, decodeToken, autorize } = useContext(UserContext);
  const activeUser = user ?? decodeToken();

  if (!activeUser) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!autorize(requiredRoles)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

Auth.propTypes = {
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
