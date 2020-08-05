import React, { useState } from 'react';
import { Button, Input, InputLabel } from '@material-ui/core';
import Error from '../../components/Error';
import productService from '../../services/product-service';
import validator from './validator';

const AddProduct = (props) => {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');    

  const handleChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleSubmit = event => {
    event.preventDefault();

    const validationMessage = validator(inputs.name, inputs.description, inputs.url);
    if (validationMessage !== '') {
      setError(validationMessage);
      return false;
    }

    productService.add(inputs.name, inputs.description, inputs.url)
      .then(status => {
        if (status === 200 || status === 201) {
          props.history.push("/");
        } else {
          setError('Product cannot be created!');
        }
      })
      .catch((err) => {        
        if(err.status === 401) {
          props.history.push("/login");
        } else if(err.status === 409) {
          setError('Name is taken!');
        } else {
          setError('Product cannot be created!');
        }
      });
  }
  
  return (
    <main className="add-product">
      <h1>Add Product</h1>
      <Error error={error} />
      <form onSubmit={handleSubmit}>
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input
          id="name"
          type="text"
          name="name"
          onChange={handleChange}
        /><br /><br />
        <InputLabel htmlFor="description">Description</InputLabel>
        <Input
          id="description"
          type="text"
          name="description"
          onChange={handleChange}
        /><br /><br />
        <InputLabel htmlFor="url">URL</InputLabel>
        <Input
          id="url"
          type="text"
          name="url"
          onChange={handleChange}
        /><br />
        <div className="login-btn">
          <Button type="submit" variant="outlined" color="primary" className="add-product-btn" >
            Add Product
          </Button>
        </div>
      </form>
    </main>
  );  
}

export default AddProduct;