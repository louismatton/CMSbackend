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

exports.list_own_website = function (req, res) {
  console.log("websitecontroller list_own " + req.user.name);
  Website.findOne({
    userId: req.user._id
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};

exports.list_website_by_name = function (req, res) {
  console.log("websitecontroller " + "list_website_by_name");

  Website.findOne({
    title: req.params.websiteTitle
  }, function (err, website) {
    if (err)
      res.send(err);
    res.json(website);
  });
};
exports.list_website_by_name_page = function (req, res) {
  console.log("websitecontroller " + "list_website_by_name_page");
  console.log(req.params.pageName);

  Website.findOne({
    title: req.params.websiteTitle
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    var currentPages = Array();
    async.each(currentWebsite.pages, (currentPage, callback) => {
        if (currentPage.pageTitle.toLowerCase() == req.params.pageTitle.toLowerCase()) {
          res.json(currentPage)
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
      }
    )
  });
};

exports.create_a_website = function (req, res) {
  var page, post;
  var arrpages = [];
  // var posts = [];
  // post = {
  //   'postTitle': "post1",
  //   'postText': "tekst",
  //   'postPhotos': ["foto1", "foto2"],
  //   'postType': "multiplePhotos",
  //   'postOrder': 1
  // };
  // posts.push(post);
  // page = {
  //   'pageTitle': "pagina1",
  //   'pageOrder': 1,
  //   'posts': posts
  // };
  // arrpages.push(page);

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

exports.delete_page = function (req, res) {
  console.log("websitecontroller delete_page");

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    var currentPages = Array();
    async.each(currentWebsite.pages, (currentPage, callback) => {

        if (currentPage.pageOrder > req.body.pageOrder) {
          currentPage.pageOrder--;
          currentPages.push(currentPage);
        }
        if (currentPage.pageOrder < req.body.pageOrder) {
          currentPages.push(currentPage);
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        Website.findOneAndUpdate({
          userId: req.user._id,
        }, {
          pages: currentPages
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
};

exports.update_page_visibility = function (req, res) {
  console.log("websitecontroller update_page_visibility");
  console.log(req.body);

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    var currentPages = Array();
    async.each(currentWebsite.pages, (currentPage, callback) => {
        if (currentPage.pageOrder == req.body.pageOrder) {
          // console.log(true);
          if (currentPage.pageVisible == true) {
            currentPage.pageVisible = false;
            // console.log(currentPage);
          } else {
            console.log(false);

            currentPage.pageVisible = true;
          }

          // console.log(currentPage);
        }
        currentPages.push(currentPage);

        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        Website.findOneAndUpdate({
          userId: req.user._id,
        }, {
          pages: currentPages
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          // console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
};

exports.delete_post = function (req, res) {
  // delete post en verander postOrders
  console.log("websitecontroller delete_post");

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    var currentPosts = Array();
    async.each(currentWebsite.pages, (currentPage, callback) => {
        if (currentPage.pageOrder == req.body.pageOrder) {
          async.each(currentPage.posts, (currentPost, callback) => {
              if (currentPost.postOrder > req.body.postOrder) {
                currentPost.postOrder--;
                currentPosts.push(currentPost);

              }
              if (currentPost.postOrder < req.body.postOrder) {
                currentPosts.push(currentPost);
              }
              callback();
            },
            //na async.each middel
            (err) => {
              if (err) res.json(err);
              // console.log('binnenste async gedaan');
            }
          );
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        Website.findOneAndUpdate({
          userId: req.user._id,
          "pages.pageOrder": req.body.pageOrder
        }, {
          "pages.$.createdDate": Date.now(),
          "pages.$.posts": currentPosts
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
};


exports.update_a_post = function (req, res) {
  //post per order, title, text, (type en fotos) worden meegegeven
  //controle juiste pagina!!!!
  console.log("websitecontroller update_post");
  // console.log(req.user);
  // console.log(req.body);

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    let newTempPost, juistetel;
    var currentPosts = Array();
    let tel;
    async.each(currentWebsite.pages, (currentPage, callback) => {
        tel = -1;
        if (currentPage.pageOrder == req.body.pageOrder) {

          async.each(currentPage.posts, (currentPost, callback) => {
              tel++;
              currentPosts.push(currentPost);
              if (currentPost.postOrder == req.body.postOrder) {
                // console.log(currentPost);
                console.log("tel:", tel);
                juistetel = tel;
                let body = req.body;
                if (body.postTitle != null) {
                  currentPost.postTitle = body.postTitle;
                }
                if (body.postText != null) {
                  currentPost.postText = body.postText;
                }
                if (body.postPhotos != null) {
                  currentPost.postPhotos = body.postPhotos;
                  //problemen voor later?
                }
                currentPost.postDate = Date.now();

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
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        console.log(currentPosts);
        currentPosts.splice(juistetel, 1);
        console.log("juistetel:", juistetel);
        console.log("2", currentPosts);

        currentPosts.push(newTempPost);
        // console.log(currentPosts);
        Website.findOneAndUpdate({
          userId: req.user._id,
          "pages.pageOrder": req.body.pageOrder
        }, {
          "pages.$.createdDate": Date.now(),
          "pages.$.posts": currentPosts
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
}

exports.update_post_visibility = function (req, res) {
  //post per order, title, text, (type en fotos) worden meegegeven
  //controle juiste pagina!!!!
  console.log("websitecontroller update_post_vis");

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    let newTempPost, juistetel;
    var currentPosts = Array();
    let tel;
    async.each(currentWebsite.pages, (currentPage, callback) => {
        tel = -1;
        if (currentPage.pageOrder == req.body.pageOrder) {

          async.each(currentPage.posts, (currentPost, callback) => {
              tel++;
              if (currentPost.postOrder == req.body.postOrder) {

                if (currentPost.postVisible == true) {
                  currentPost.postVisible = false;
                } else {
                  currentPost.postVisible = true;
                }

                currentPost.postDate = Date.now();

                console.log("***", currentPost);
                newTempPost = currentPost;
              }
              currentPosts.push(currentPost);
              callback();
            },
            //na async.each middel
            (err) => {
              if (err) res.json(err);
            }
          );
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        Website.findOneAndUpdate({
          userId: req.user._id,
          "pages.pageOrder": req.body.pageOrder
        }, {
          "pages.$.createdDate": Date.now(),
          "pages.$.posts": currentPosts
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
}

exports.add_post = function (req, res) {
  //post per order, title, text, (type en fotos) worden meegegeven
  console.log("websitecontroller add_post");
  // console.log(req.user);
  // console.log(req.body);

  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err) res.send(err);
    var newTempPost, currentPosts, juistetel;
    juistetel = 1;
    let tel;
    async.each(currentWebsite.pages, (currentPage, callback) => {
        if (currentPage.pageOrder == req.body.pageOrder) {


          currentPosts = currentPage.posts;
          // console.log(currentPage.posts);
          tel = 1;
          async.each(currentPosts, (currentPost, callback) => {
              tel++;
              juistetel = tel;

              callback();
            },
            //na async.each middel
            (err) => {
              if (err) res.json(err);
              // console.log('binnenste async gedaan');
            }
          );
        }
        callback();
      },
      //na async.each
      (err) => {
        if (err) res.json(err);
        // console.log('buitenste async gedaan');
        // currentPosts.splice(juistetel, 1);

        let newPost;
        if (req.body.postPhotos == null) {
          console.log("noPhoto");
          newPost = {
            'postTitle': req.body.postTitle,
            'postText': req.body.postText,
            // 'postPhotos': req.body.postPhotos,
            'postType': "noPhoto",
            'postOrder': juistetel++
          };

        } else if (req.body.postPhotos.length == 1) {
          console.log("singlePhoto");
          newPost = {
            'postTitle': req.body.postTitle,
            'postText': req.body.postText,
            'postPhotos': req.body.postPhotos,
            'postType': "singlePhoto",
            'postOrder': juistetel++
          };
        } else {
          console.log("multiplePhoto");
          newPost = {
            'postTitle': req.body.postTitle,
            'postText': req.body.postText,
            'postPhotos': req.body.postPhotos,
            'postType': "multiplePhotos",
            'postOrder': juistetel++
          };
        }
        currentPosts.push(newPost);
        // console.log(currentPosts);
        Website.findOneAndUpdate({
          userId: req.user._id,
          "pages.pageOrder": req.body.pageOrder
        }, {
          "pages.$.createdDate": Date.now(),
          "pages.$.posts": currentPosts
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          // console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    )
  });
}

exports.add_page = function (req, res) {
  console.log('addpage');
  Website.findOne({
    userId: req.user._id
  }, function (err, currentWebsite) {
    if (err)
      res.send(err);
    let tel = 1;

    async.each(currentWebsite.pages, (currentPage, callback) => {
        tel++;
        callback();
      },
      //functie na async
      (err) => {
        if (err) res.send(err);

        let newPage = {
          'pageTitle': req.body.pageTitle,
          'pageOrder': tel
        };
        Website.findOneAndUpdate({
          userId: req.user._id,
        }, {
          $push: {
            pages: newPage
          }
        }, {
          new: true
        }).exec((err, changedWebsite) => {
          if (err) console.log(err);
          // console.log(changedWebsite);
          // console.log(changedWebsite.pages[0].posts);
          res.json(changedWebsite);
        });
      }
    );
  });
}

exports.change_page_title = function (req, res) {
  Website.findOneAndUpdate({
    userId: req.user._id,
    "pages.pageOrder": req.body.pageOrder
  }, {
    "pages.$.pageTitle": req.body.pageTitle
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