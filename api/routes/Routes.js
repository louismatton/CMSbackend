// 'use strict';
var todoList = require('../controllers/test1controller');
var websiteController = require('../controllers/WebsiteController');

var pageController = require('../controllers/PageController');
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

    // todoList Routes
    app.route('/tasks')
        .get(requireAuth, todoList.list_all_tasks)
        // .get(authController.isAuthenticated, todoList.list_all_tasks)
        .post(authController.isAuthenticated, todoList.create_a_task);

    app.route('/owntasks')
        .get(requireAuth, todoList.list_own_tasks)

    app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);

    app.route('/users')
        .post(userController.create_a_user)
        .get(requireAuth, userController.list_all_users);

    app.route('/website')
        .get(requireAuth, websiteController.list_own_websites)
        // .get(authController.isAuthenticated, todoList.list_all_tasks)
        .post(requireAuth, websiteController.create_a_website);
    
    app.route('/website/editpost')
        .post(requireAuth, websiteController.update_a_post);
    
    app.route('/website/editpagetitle')
        .post(requireAuth, websiteController.change_page_title);
    
};