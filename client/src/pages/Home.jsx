import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MatirialIcons from 'material-icons';
import { CircularProgress } from '@material-ui/core';
import Cookie from 'js-cookie';
import Footer from '../components/Footer/Footer';
import productService from '../services/product-service'

const Home = (props) => {
  const [products, setProducts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    productService.load()
      .then(products => {
        console.log(products);
        setProducts(products);
        setIsLoading(false);        
      });
  }, []);

  const increaseLikes = (productId) => {
    let allProducts = products;
    allProducts.forEach(p => {
      if(p._id === productId) {
        p.likes++;
      }
    });    
    setProducts(allProducts);
  }
  
  const like = (event) => {
    const productId = event.target.getAttribute('productid');    

    if(!Cookie.get('token')) {   
      props.history.push('/login');
      return;
    }

    if(Cookie.get('likedProductsIds').includes(productId)) {
      return;
    }

    increaseLikes(productId);
    
    productService.like(productId)
      .then(() => {
        let likedProductsIds = Cookie.get('likedProductsIds');        
        
        if(likedProductsIds.length) {
          likedProductsIds += ` ${productId}`;
        } else {
          likedProductsIds = productId; 
        }

        Cookie.set('likedProductsIds', likedProductsIds);
        
        setIsLiked(true);
      });
  }

  const deleteProduct = (event) => {
    const productId = event.target.getAttribute('productid');

    productService.delete(productId)
      .then(() => {
        const allProducts = [];
        products.forEach((product) => {
          if(product._id !== productId) {
            allProducts.push(product);
          }
        });
        setProducts(allProducts);
      })
      .catch(err => {
        if(err.tokenIsOutDated) {
          props.history.push("/login");
        }
      });
  }

  const ToggleLikeIconColor = (productId) => {
    let likeBtnClass = 'material-icons like-icon';
    if(Cookie.get('likedProductsIds')) {
      if(Cookie.get('likedProductsIds').includes(productId)) {
        likeBtnClass = 'material-icons liked-icon';
      }
    }
    if(isLiked)
    {
      setIsLiked(false);
      likeBtnClass = 'material-icons liked-icon';      
    }
    return <i className={likeBtnClass} onClick={like} productid={productId}>favorite</i>;
  }
  
  if(isLoading) {
    return (
      <main className="main-container">
        <CircularProgress className="loader" />
      </main>
    );
  }else if(products.length) {      
    return (
      <div className="home-page">
        <Link to="/product/add" className="add-link"><span className="material-icons">add_box</span></Link>
        <main className="main-container">
          {products.map(product => (
            <div className="product-item" key={product._id}>
              <img src={product.url} alt={product.name} />
              <h2 className="title">{product.name}</h2>
              <p className="description">{product.description}</p>
              <div className="actions">
                <span className="likes-count">Likes: {product.likes}</span>
                {
                  ToggleLikeIconColor(product._id)        
                }
                {product.author === Cookie.get('userId') ? <i className="material-icons delete-icon" onClick={deleteProduct} productid={product._id}>delete</i> : null}
              </div>
            </div>
          ))}
          <br/>
        </main>
        <Footer />
        </div>        
    )
  }else {
    return <><h2 className="main-message">No Products!</h2><br/></>
  }    
}

export default Home;