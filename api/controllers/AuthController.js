// Load required packages
"use strict"

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/UserModel');
const jwt = require('jsonwebtoken'),  
      crypto = require('crypto'),
      // User = require('../models/user'),
      config = require('../config/main');
// var BearerStrategy = require('passport-http-bearer').Strategy
// var Token = require('../models/TokenModel');

passport.use(new BasicStrategy(
  function(email, password, callback) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

function generateToken(user) {  
  console.log(config.secret);
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds (2 u 46 min)
  });
}

// Set user info from request
function setUserInfo(request) {  
  return {
    _id: request._id,
    name: request.name,
    email: request.email,
    role: request.role,
  };
}


//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {

  let userInfo = setUserInfo(req.user);
  console.log(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}


//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) { 
  console.log(req.body); 
  // Check for registration errors
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  // Return error if full name not provided
  if (!name) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      // If email is unique and password was provided, create account
      let user = new User({
        email: email,
        password: password,
        name: name
      });

      user.save(function(err, user) {
        if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
}

//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = function(role) {  
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}


// passport.use(new BearerStrategy(
//   function(accessToken, callback) {
//     Token.findOne({value: accessToken }, function (err, token) {
//       if (err) { return callback(err, false); }
//       // No token found
//       if (!token) { return callback("token not found", false); }
//       if (token.expires <= Date.now()){return callback("token expired", false)}

//       User.findOne({ _id: token.userId }, function (err, user) {
//         if (err) { return callback(err); }
//         // No user found
//         if (!user) { return callback("user not found", false); }
//         // Simple example with no scope
//         callback(null, user);
//       });
//     });
//   }
// ));


//The option of session being set to false tells passport to not store session variables between calls to our API. 
//This forces the user to submit the username and password on each call.
exports.isAuthenticated = passport.authenticate('basic', { session : false });
// exports.isBearerAuthenticated = passport.authenticate('bearer', { session : false });
