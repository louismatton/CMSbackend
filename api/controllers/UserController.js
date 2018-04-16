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
    res.json({ message: 'new user added!'});
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


exports.read_a_user_with_join = (req, res) => {
  User.findById(req.params.userId).exec((err, user) => {
    if (err) {
      res.send(err);
    }
    if (user) {
      user.numberOfFriends = user.friends.length;
      Wishlist.findOne({ userId: req.params.userId }).exec((err, wishlist) => {
        if (err) {
          res.send(err);
        }
        DrunkenBeer.findOne({ userId: req.params.userId }).exec((err, drunkenbeer) => {
          if (err) {
            res.send(err);
          }
          if (drunkenbeer && wishlist) {
            res.send(Object.assign(drunkenbeer.toObject(), wishlist.toObject(), user.toObject()));
          }
          else {
            if (drunkenbeer) {
              res.send(Object.assign(drunkenbeer.toObject(), user.toObject()));
            }
            else {
              if (wishlist) {
                res.send(Object.assign(wishlist.toObject(), user.toObject()));
              }
              else {
                res.json(user);
              }
            }

          }
        })

      })
    }
    else{
      res.json({ success: false, msg: "User not found."})
    }



  });
};


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

exports.find_a_user = (req, res) => {
     let naamvoorsplit=req.params.name;
    let naam = [];
    naam = naamvoorsplit.split(" ");

  if(naam[1]!=undefined){
    User.find(
      {$or:
        [{
            firstname: {
              $regex: new RegExp("^" + naam[0].toLowerCase(), "i")
            }
          },{
            firstname: {
              $regex: new RegExp("^" + naam[1].toLowerCase(), "i")
            }
          },
          {
            lastname: {
              $regex: new RegExp("^" + naam[1].toLowerCase(), "i")
            }
          },{
            lastname: {
              $regex: new RegExp("^" + naam[0].toLowerCase(), "i")
            }
          }
        ]
    }).exec((err, users) => {
      if (err)
        res.send(err);
      res.json(users);
    });
  }else{
      User.find(
    {$or:
      [{
          firstname: {
            $regex: new RegExp("^" + req.params.name.toLowerCase(), "i")
          }
        },
        {
          lastname: {
            $regex: new RegExp("^" + req.params.name.toLowerCase(), "i")
          }
        }
      ]
  }).exec((err, users) => {
    if (err)
      res.send(err);
    res.json(users);
  });
  }

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


exports.friends_by_userid = (req, res) => {
  let arrFriends = [];
  User.find({ _id: req.params.userId }).exec((err, user) => {
    if (err) {
      res.send(err);
    }
    async.each(user[0].friends, (friendid, callback) => {
      User.find({ _id: friendid }).exec((err, friend) => {
        if (err) {
          callback(err);
        }
        arrFriends.push(friend[0]);
        callback();
      })
    },
      (err)=> {
        if (err) {
          res.send(err)
        }

        res.send(arrFriends);
      })
  });
};