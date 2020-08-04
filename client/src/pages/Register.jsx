import React, { useState } from 'react';
import { Button, Input, InputLabel } from '@material-ui/core';
import Cookie from 'js-cookie';
import Error from '../components/Error';
import authService from '../services/auth-service';

const Register = (props) => {
  if (Cookie.get('token')) {
    props.history.push('/');
  }
  
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');  
  
  const validateForm = () => {
    setError('');

    if(inputs.password && inputs.password.length < 5) {
      setError('Password should be minimum 5 characters!');
    }
    if(inputs.username && inputs.username.length < 5) {
      setError('Invalid username!');
    }
    if(inputs.email && inputs.email.length <= 4) {
      setError('Invalid email!');
    }

    if(error.length) {      
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleSubmit = event => {
    const email = inputs.email;
    const username = inputs.username;
    const password = inputs.password;

    event.preventDefault();    
    
    if(!validateForm()) {    
      setError('Invalid data!');
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