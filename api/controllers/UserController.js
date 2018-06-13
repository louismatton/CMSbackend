'use strict';

let mongoose = require('mongoose'),
  async = require('async'),
  User = mongoose.model('Users');

// tokenController = require('./TokenController')


exports.list_all_users = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err)
      res.send(err);

    res.json(users);
  });
};


exports.create_a_user = (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
    name: req.body.name
  });

  user.save((err) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.json({
      message: 'new user added!'
    });
    // tokenController.createToken(req, res);
  });
};

// exports.signin = (req, res) => {
//   User.findOne({
//     username: req.body.username
//   }, function(err, user) {
//     if (err) throw err;

//     if (!user) {
//       res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
//     } else {
//       // check if password matches
//       user.comparePassword(req.body.password, function (err, isMatch) {
//         if (isMatch && !err) {
//           // if user is found and password is right create a token
//           var token = jwt.sign(user.toJSON(), config.secret);
//           // return the information including token as JSON
//           res.json({success: true, token: 'JWT ' + token});
//         } else {
//           res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
//         }
//       });
//     }
//   });
// };




exports.update_a_user = (req, res) => {
  User.findOneAndUpdate({
    _id: req.params.userId
  }, req.body, {
    new: true
  }).exec((err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.delete_a_user = (req, res) => {
  User.remove({
    _id: req.params.userId
  }).exec((err, user) => {
    if (err)
      res.send(err);
    res.json({
      message: 'User successfully deleted'
    });
  });
};

