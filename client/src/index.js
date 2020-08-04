import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import AuthContextProvider from './contexts/AuthContext';

ReactDOM.render(
    <AuthContextProvider>
        <Router>
            <App />
        </Router>
    </AuthContextProvider>  
    , document.getElementById('root'));