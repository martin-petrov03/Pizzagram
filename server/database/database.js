const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.Promise = global.Promise;
module.exports = () => {
    mongoose.set('useCreateIndex', true);
    //'mongodb://localhost:27017/pizza-order'
    const uri = 'mongodb+srv://Admin:admin@eshop.zmcak.mongodb.net/Pizzagram?retryWrites=true&w=majority';
    mongoose.connect(uri, {
        useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.once('open', err => {
        if (err) {
            console.log(err);
        }
        
        console.log('Database ready!');
    });

    db.on('error', reason => {
        console.log(reason);
    });
};