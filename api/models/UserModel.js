'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');
let jwt = require ('jsonwebtoken');

let UserSchema = new Schema({
    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: 'Enter your email',
        unique: true
    },
    name: {
        type: String,
        required: 'Enter your name'
    },
    image: {
        type: String
        // url of base 64 encoded
    },
    // role: {
    //   type: String,
    //   enum: ['Client', 'Admin'],
    //   default: 'Client'
    // },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  }
);

// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    }); 
});

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };

UserSchema.methods.comparePassword  = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', UserSchema);