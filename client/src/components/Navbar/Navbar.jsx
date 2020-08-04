import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';
import { AuthContext } from '../../contexts/AuthContext';

class Navbar extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);    
  }

  logout = async() => {
    const { logout } = this.context;
    logout();
    Cookies.set('token', '');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('likedProductsIds');
  }

  render() {
    return (
    <nav className="nav">
        <Link to="/" className="site-logo">PIZZAS</Link>
        <ul>
            {
              this.context.isAuthenticated
                ?(
                  <Fragment>
                    <li className="greeting"><Link to="">Hello, {localStorage.getItem('username')}</Link></li>
                    <li><Link to="/product/add">Add Product</Link></li>
                    <li><Link to="" onClick={this.logout}>Logout</Link></li>
                  </Fragment>
                )
                : (
                  <Fragment>                      
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </Fragment>)
            }
            
        </ul>
    </nav>
  );
  }  
}

export default Navbar;