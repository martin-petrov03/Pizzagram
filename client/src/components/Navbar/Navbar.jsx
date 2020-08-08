import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';
import { AuthContext } from '../../contexts/AuthContext';
import authService from '../../services/auth-service';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  
  const logoutFunc = () => {
    logout();
    authService.logout();
  }

  return (
    <nav className="nav">
      <Link to="/" className="site-logo">PIZZAS</Link>
      <ul>  
        {          
          !Cookies.get('token') || Cookies.get('token').length === 0 
            ? (
              <Fragment>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </Fragment>
            )
            : (
              <Fragment>
                <li><Link to="" onClick={logoutFunc}>Logout</Link></li>                
              </Fragment>)
        }          
      </ul>
    </nav>
  );
}

export default Navbar;