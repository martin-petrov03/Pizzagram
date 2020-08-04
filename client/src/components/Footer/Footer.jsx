import React from 'react';
import './index.css';

function Footer() {
    return (
        <footer className="main-footer">
            <div className="left-side">
                <h2>Pizzas</h2>
                <h4 className="description">You can choose from our best pizzas and may be create your own!</h4>
            </div>
            <div className="right-side">
                <h2>Contacts</h2>
                <h4>Email: pizzeria@gmail.com</h4>
                <h4>Phone: (541) 754-3010</h4>
            </div>
        </footer>
    );
}

export default Footer;