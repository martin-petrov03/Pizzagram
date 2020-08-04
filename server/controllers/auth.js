const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');

const signUp = (req, res) => {  
  const { email, username, password } = req.body;  
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const usernameRegex = /[A-Za-z0-9]+/;

  if(!emailRegex.test(email) || !usernameRegex.test(username) || email.length < 5 || username.length < 5 || password.length < 5) {    
    res.status(422)
      .json({ message: 'Invalid Data!' });
      return;
  }
  
  const salt = encryption.generateSalt();
  const hashedPassword = encryption.generateHashedPassword(salt, password);

  User.findOne({ email }).then(user => {
    if (user) {
      res.status(409)
        .json({ message: 'E-Mail address already exists!' });
    } else {
      if(email)
      User.create({
        email,
        username,
        hashedPassword,
        salt
      }).then((user) => {
        res.status(201)
          .json({ message: 'User created!', userId: user._id });
      })
        .catch((error) => {
          if (!error.statusCode) {
            error.statusCode = 500;
          }

          res.status(error.statusCode)
            .json({ message: error.message });
        });
    }
  });  
}

const signIn = (req, res) => {   
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this email could not be found');
        error.statusCode = 401;
        res.status(401).json(
        {
          message: 'A user with this email could not be found!',
        });
        throw error;
      }
      
      if(!user.authenticate(password)) {
        const error = new Error('A user with this email could not be found!');
        error.statusCode = 401;
        res.status(401).json(
        {
          message: 'Invalid password!',
        });
        throw error;
      }

      const token = jwt.sign({
        email: user.email,
        userId: user._id.toString()
      }
        , 'somesupersecret'
        , { expiresIn: '1h' });
            
      req.auth = 'Authorization ' + token;
      res.status(200).json(
        {
          message: 'User successfully logged in!',
          token,
          username: user.username,
          likedProductsIds: user.likedProductsIds,
          userId: user._id.toString()
        }
      );
    })  
    .catch (error => {
      console.log(error);
    });
}

module.exports = {
  signUp,
  signIn 
}