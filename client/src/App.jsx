import React, {Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';
import AddProduct from './pages/AddProduct/AddProduct';
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (    
      <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/product/add" component={AddProduct} />
            <Route component={Error} />
          </Switch>
      </Fragment>    
  );
}

export default App;