'use strict';

var mongoose = require('mongoose'),
  async = require('async'),
  Website = mongoose.model('Website');

exports.list_all_websites = function (req, res) {
  Website.find({}, function (err, website) {
    if (err)
      res.send(err);
    console.log("websitecontroller list_all" + website)
    res.json(website);
  });
};

exports.list_own_websites = function (req, res) {
  // console.log("websitecontroller list_own"+req.user.name);
  Website.find({
    userId: req.user._id
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};


// exports.create_a_website = function(req, res) {
//   var new_website = new Website(req.body);
//   new_website.userId = req.user._id;
//   new_website.save(function(err, website) {
//     if (err)
//       res.send(err);
//     res.json(website);
//   });
// };

exports.create_a_website = function (req, res) {
  var page, post;
  var arrpages = [];
  var posts = [];
  post = {
    'postTitle': "post1",
    'postText': "tekst",
    'postPhotos': ["foto1", "foto2"],
    'postType': "multiplePhotos",
    'postOrder': 1
  };
  posts.push(post);
  page = {
    'pageTitle': "pagina1",
    'pageOrder': 1,
    'posts': posts
  };
  arrpages.push(page);

  var new_website = new Website({
    title: "website1",
    userId: req.user._id,
    pages: arrpages
  });

  new_website.save(function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};

exports.read_a_website = function (req, res) {
  Website.findById(req.params.websiteId, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};


exports.update_a_website = function (req, res) {
  Website.findOneAndUpdate({
    _id: req.params.websiteId
  }, req.body, {
    new: true
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};


exports.update_a_post = function (req, res) {
  console.log("websitecontroller update_post");

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    let newTempPost, currentPosts, juistetel;
    let tel;
    async.each(currentWebsite.pages, (currentPage, callback) => {
        currentPosts = currentPage.posts;
        tel = -1;
        async.each(currentPosts, (currentPost, callback) => {
            tel++;
            if (currentPost.postOrder == req.body.postOrder) {
              juistetel = tel;
              let body = req.body;
              if (body.postTitle != null) {
                currentPost.postTitle = body.postTitle;
              }
              if (body.postText != null) {
                currentPost.postText = body.postText;
              }
              if (body.postPhotos != null) {
                currentPost.postType = body.postType;
                currentPost.postPhotos = body.postPhotos;
                //problemen voor later?
              }
              newTempPost = currentPost;
            }
            callback();
          },
          //na async.each middel
          (err) => {
            if (err) res.json(err);
            // console.log('binnenste async gedaan');
          }
        );
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        // console.log('buitenste async gedaan');
        currentPosts.splice(juistetel, 1);

        currentPosts.push(newTempPost);
        // console.log(currentPosts);
        Website.findOneAndUpdate({
          userId: req.user._id,
          "pages.pageOrder": req.body.pageOrder
        }, {
          "pages.$.posts": currentPosts
        },{new:true}).exec((err, changedWebsite) => {
          if (err) console.log(err);
          // console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
}

exports.change_page_title = function(req, res){
  Website.findOneAndUpdate({
    userId:req.user._id,
    "pages.pageOrder": req.body.pageOrder

  },{
    "pages.$.pageTitle":req.body.pageTitle  
  }, {
    new: true
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
}


exports.delete_a_website = function (req, res) {
  Website.remove({
    _id: req.params.websiteId
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json({
      message: 'Website successfully deleted'
    });
  });
};