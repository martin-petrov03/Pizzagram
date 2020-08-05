import React, { useState } from 'react';
import { Button, Input, InputLabel } from '@material-ui/core';
import Cookies from 'js-cookie';
import Error from '../../components/Error';
import authService from '../../services/auth-service';
import validator from './validator';

const Register = (props) => {
  if (Cookies.get('token')) {
    props.history.push('/');
  }
  
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');  

  const handleChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleSubmit = event => {
    const email = inputs.email;
    const username = inputs.username;
    const password = inputs.password;

    event.preventDefault();    
    
    const validationMessage = validator(email, username, password);
    if(validationMessage !== '') {
      setError(validationMessage);
    } else {
      authService.register(email, username, password)         
        .then(status => {          
          if(status >= 200 && status < 300) {
            props.history.push("/login");
          }
        })
        .catch(() => {          
          setError('Invalid data!');
        });
    }    
  }
    
  return (
    <div className="login-container">          
      <h1 className="login-title">Register</h1>
      
      <Error error={error} />
      <form onSubmit={handleSubmit}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          type="email"
          name="email"            
          onChange={handleChange}
        /><br/><br/>
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          id="username"
          type="username"
          name="username"            
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
            Register
          </Button>
        </div>
      </form>
    </div>
  );  
}

export default Register;