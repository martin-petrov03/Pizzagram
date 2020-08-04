import React, { Component } from 'react';
import { Button, Input, InputLabel } from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import Error from '../components/Error';

class AddProduct extends Component {
  state = {
    name: '',
    description: '',
    url: '',
    error: ''
  };

  validateForm = () => {
    let isError = false; 
    if (!(this.state.url.startsWith('http') || this.state.url.startsWith('https')) || this.state.url < 10) {
      isError = true;
      this.setState({
        error: 'Invalid URL!'
      });
    }
    if (this.state.description.length < 35 || this.state.description.length > 100) {
      isError = true;
      this.setState({
        error: 'Description should be between 35 and 100 characters!'
      });
    }
    if (this.state.name.length < 4 || this.state.name.length > 30) {      
      isError = true;
      this.setState({
        error: 'Name should be between 4 and 30 characters!'
      });
    }

    if(this.state.name.length === 0 || this.state.description.length === 0 || this.state.url.length === 0) {
      isError = true;
      return false;
    }

    if (isError) {
      return false;
    }
    this.setState({
      error: ''
    })
    return true;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    if (!this.validateForm()) {      
      return false;
    }

    axios.post("http://localhost:3001/products/add",
      {
        "headers": {
          "auth": Cookies.get('token'),
          "Content-Type": "application/json",
          "userId": localStorage.getItem("userId")
        },
        "name": this.state.name,
        "description": this.state.description,
        "url": this.state.url
      }
    )
      .then(res => {
           
        if (res.status === 200 || res.status === 201) {
          this.props.history.push("/");
        } else {
          this.setState({
            error: 'Product cannot be created!'
          });
        }
      })
      .catch((err) => {
        if(err.response.status === 401) {
          this.props.history.push("/login");
        } else if(err.response.status === 409) {          
          this.setState({
            error: 'Name is taken!'
          });
        } else {
          this.setState({
            error: 'Product cannot be created!'
          });          
        }
      });
  }

  render() {
    return (
      <main className="add-product">
        <h1>Add Product</h1>
        <Error error={this.state.error} />
        <form onSubmit={this.handleSubmit}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            type="text"
            name="name"
            onChange={this.handleChange}
          /><br /><br />
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            type="text"
            name="description"
            onChange={this.handleChange}
          /><br /><br />
          <InputLabel htmlFor="url">URL</InputLabel>
          <Input
            id="url"
            type="text"
            name="url"
            onChange={this.handleChange}
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
}

export default AddProduct;