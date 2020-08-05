import React, { useState, useContext } from 'react';
import { Button, Input, InputLabel } from '@material-ui/core';
import Cookies from 'js-cookie';
import Error from '../components/Error';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/auth-service';

const Login = (props) => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState({});
  
  const validateForm = () => {
    if(!(inputs.email.length > 4 && inputs.password.length > 4)) {
      setError('Invalid email or password!');
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleSubmit = event => {
    event.preventDefault();    

    const email = inputs.email;
    const password = inputs.password;
    
    if(!validateForm()) {      
      setError('Something went wrong!');
      return false;
    }
   
    authService.login(email, password)
      .then((status) => {        
        if(status >= 200 && status < 300 && Cookies.get('username') && Cookies.get('userId')) {
          login();
          props.history.push('/');
          return;
        }
      })
      .catch(err => {
        setError('Invalid email or password!');
        return;
      });    
  }
  
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <Error error={error} />
      <form onSubmit={handleSubmit}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          type="email"
          name="email"         
          onChange={handleChange}
        /><br/><br/>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          name="password"
          onChange={handleChange}            
        /><br/>
        <div className="login-btn">
          <Button type="submit" variant="outlined" color="primary" className="login-btn" >
            Login
          </Button>
        </div>
      </form>
    </div>
  );  
}

export default Login;