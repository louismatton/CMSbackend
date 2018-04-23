// 'use strict';

// var mongoose = require('mongoose'),
//   Page = mongoose.model('Websites');

// exports.list_all_pages = function(req, res) {
//   Page.find({}, function(err, page) {
//     if (err)
//       res.send(err);
//       console.log("pagecontroller list_all"+page)
//     res.json(page);
//   });
// };

// exports.list_own_pages = function(req, res) {
//   // console.log("pagecontroller list_own"+req.user.name);
//     Page.find({userId: req.user._id}, function(err, page) {
//       if (err)
//         res.send(err);
//       res.json(page);
//     });
//   };


// // exports.create_a_page = function(req, res) {
// //   var new_page = new Page(req.body);
// //   new_page.userId = req.user._id;
// //   new_page.save(function(err, page) {
// //     if (err)
// //       res.send(err);
// //     res.json(page);
// //   });
// // };

// exports.create_a_page = function (req, res) {
//   var page, post;
//   var arrpages = [];
//   var posts = [];
//   post = {
//     'postTitle': "post1",
//     'postText': "tekst",
//     'postPhotos': ["foto1", "foto2"],
//     'postType': "multiplePhotos",
//     'postOrder': 1
//   };
//   posts.push(post);
//   page = {
//     'pageTitle': "pagina1",
//     'pageOrder': 1,
//     'posts': posts
//   };
//   arrpages.push(page);

//   var new_page = new Page({
//     title:"website1",
//     userId:req.user._id,
//     pages:arrpages
//   });

//   new_page.save(function (err, page) {
//     if (err)
//       res.send(err);
//     res.json(page);
//   });
// };

// exports.read_a_page = function(req, res) {
//   Page.findById(req.params.pageId, function(err, page) {
//     if (err)
//       res.send(err);
//     res.json(page);
//   });
// };


// exports.update_a_page = function(req, res) {
//   Page.findOneAndUpdate({_id: req.params.pageId}, req.body, {new: true}, function(err, page) {
//     if (err)
//       res.send(err);
//     res.json(page);
//   });
// };

// exports.update_a_post = function(req, res) {
//   // Page.findOneAndUpdate({_id: req.params.pageId}, req.body, {new: true}, function(err, page) {
//     Page.findById(req.params.pageId, function(err, page) {
//       page.find()

//     if (err)
//       res.send(err);
//     res.json(page);
//   });
// };



// exports.delete_a_page = function(req, res) {
//   Page.remove({
//     _id: req.params.pageId
//   }, function(err, page) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Page successfully deleted' });
//   });
// };

