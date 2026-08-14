import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export function Auth({ requiredRoles }) {
  const location = useLocation();
  const { user, decodeToken, autorize } = useContext(UserContext);
  const activeUser = user ?? decodeToken();
  let render = null;
  // Especificar el render si el usuario esta autorizado
  if (activeUser && autorize(requiredRoles)) {
    render = <Outlet />;
  } else {
    render = <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  return <div>{render}</div>;
}

Auth.propTypes = {
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
