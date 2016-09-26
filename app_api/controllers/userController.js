/* jshint node: true */

//************************************************************
//  userController.js                                       //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/18/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  18Sep16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";
var User    = require('./../models/userModel');
var bcrypt  = require('bcryptjs');

var list    = function (req, res)
{
    User.find(function(err, users)
    {
        if (err)
        {
            res.status(500);
            res.send('Internal Error');
        }
        else
        {
            res.status(200);
            res.send(users);
        }
    });
};

var login = function (req, res)
{
    if (!req.body.email || !req.body.password)
    {
        res.status(404);
        res.send('Login Failed:  Data Missing');
    }
    else
    {
        User.findOne({email: req.body.email}, function(err, user)
        {
            if (err)
            {
                console.log(err);
                res.status(500);
                res.send('Internal Error');
            }
            else if (!user)
            {
                res.status(404);
                res.send('Login Failed:  User not found');
            }
            else if (!bcrypt.compareSync(req.body.password, user.password))
            {
                res.status(401);
                res.json("Login Failed: Wrong Password");
            }
            else
            {
                res.status(200);
                res.json("login success");
            }
        });
    }
};

var register = function (req, res)
{
    if (!req.body.email || !req.body.username || !req.body.password)
    {
        res.status(404);
        res.send('Registration Failed:  Data Missing');
    }
    else
    {
        var addUser = new User(
        {
            email        :    req.body.email,
            username     :    req.body.username,
            password     :    bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        });
        addUser.save(function(err, savedUser)
        {
            if (err)
            {
                res.status(500);
                res.send('Internal Error');
            }
            else
            {
                res.status(201);
                res.json("Registration success");
            }
        });
    }
};

var getUser = function (req, res)
{
    User.findById(req.params.USERID, function(err, user)
    {
        if (err)
        {
            res.status(404);
            res.send('Not Found');
        }
        else
        {
            res.status(200);
            res.send(user);
        }
    });
};

var delete_user = function (req, res)
{
    User.findById(req.params.USERID, function(err, user)
    {
        user.remove(function(err)
        {
            if (!err)
            {
                res.status(200);
                res.json('User Deleted');
            }
        });
    });
};

module.exports =
{
    list          :    list,
    register      :    register,
    login         :    login,
    getUser       :    getUser,
    delete_user   :    delete_user
};
