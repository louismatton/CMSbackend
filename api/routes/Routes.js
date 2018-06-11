// 'use strict';
var websiteController = require('../controllers/WebsiteController');
var userController = require('../controllers/UserController');
var authController = require('../controllers/AuthController');

const express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {
    session: false
});
const requireLogin = passport.authenticate('local', {
    session: false
});

module.exports = function (app) {
    // const apiRoutes = express.Router(),
    //     authRoutes = express.Router();

    // Constants for role types
    const REQUIRE_ADMIN = "Admin",
        REQUIRE_OWNER = "Owner",
        REQUIRE_CLIENT = "Client",
        REQUIRE_MEMBER = "Member";

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    // apiRoutes.use('/auth', authRoutes);

    // Registration route
    // authRoutes.post('/register', authController.register);

    app.route('/register')
        .post(authController.register);


    // Login route
    app.route('/login')
        .post(requireLogin, authController.login);

    // authRoutes.post('/login', requireLogin, authController.login);

    // Set url for API group routes
    // app.use('/api', apiRoutes);

    app.route('/users')
        .post(userController.create_a_user)
        .get(requireAuth, userController.list_all_users);

    app.route('/website/:websiteTitle')
        .get(websiteController.list_website_by_name)

    app.route('/website/:websiteTitle/:pageTitle')
        .get(websiteController.list_website_by_name_page)


    app.route('/website')
        .get(requireAuth, websiteController.list_own_website)
        .post(requireAuth, websiteController.create_a_website);
    
    app.route('/website/editpost')
    // .get(requireAuth)
        .post(requireAuth, websiteController.update_a_post);
    
    app.route('/website/editpagetitle')
        .post(requireAuth, websiteController.change_page_title);
    
    app.route('/website/addpage')
        .post(requireAuth, websiteController.add_page);

    app.route('/website/addpost')
        .post(requireAuth, websiteController.add_post);

    app.route('/website/deletepost')
        .post(requireAuth, websiteController.delete_post);

    app.route('/website/deletepage')
        .post(requireAuth, websiteController.delete_page);
        
    app.route('/website/visPage')
        .post(requireAuth, websiteController.update_page_visibility);
    
    app.route('/website/visPost')
        .post(requireAuth, websiteController.update_post_visibility);


    };