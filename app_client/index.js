/* jshint node: true */

//****************************************************************
//  app_client/index.js                                         //
//  Active Learning 2110                                        //
//                                                              //
//  Created by Jeremy Carter on 10/08/16.                       //
//  Copyright © 2016 Jeremy Carter. All rights reserved.        //
//                                                              //
//  Date        Name        Description                         //
//  -------     ---------   --------------                      //
//  08Oct16     J.Carter    Initial Design                      //
//                                                              //
//****************************************************************

"use strict";
//var User = require('../app_api/models/userModel');

module.exports = function(app)
{
    /*
    app.use(function(req, res, next)
    {
        if (req.session && req.session.user)
        {
            console.log("SESSION FOUND FROM APP CLIENT");
            User.findOne({username: req.session.user.username}, function(err, user)
            {
                if (user)
                {
                    req.user = user;
                    req.user.password = undefined;
                    req.session.user = req.user;
                }
                next();
            });
        }
        else
        {
            console.log("SESSION NOT FOUND FROM APP CLIENT");
            next();
        }
    });
    */

    /**
    Respond to GET request

    - parameter PATH:       SPA route
    - parameter HANDLER:    callback
    */
    app.get('/', hasSesion, function(req, res)
    {
        res.render('login', {
            title: 'Active Learning 2110'
        });
    });

    app.get('/dashboard', isAuthenticated, function(req, res)
    {
        res.render('dashboard', {
            id      : req.user.id,
            role    : req.user.role,
            photo   : req.user.photo,
            username: req.user.username
        });
    });

    /**
    Middleware for checking if the current user has an active session
    */
    function hasSesion(req, res, next)
    {
        if (req.user) return res.redirect('/dashboard');
        next();
    }

    /**
    Middleware for checking if the current user has an active session
    */
    function isAuthenticated(req, res, next)
    {
        if (req.user) return next();
        res.redirect('/');
    }
};
