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

var roles =
{
    ADMIN       : 'admin',
    INSTRUCTOR  : 'instructor',
    STUDENT     : 'student',
};

var deleteUser = function (req, res)
{
    User.findById(req.params.USERID, function(err, user)
    {
        if (err || !user)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User Not Found'
                }
            );
        }
        user.remove(function(err)
        {
            if (!err)
            {
                if (req.user.role !== roles.ADMIN)
                {
                    req.session.reset();
                }
                res.status(200).json(
                    {
                        success: true,
                        message: 'User Deleted'
                    }
                );
            }
        });
    });
};

var getAll  = function (req, res)
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

var getUser = function (req, res)
{
    User.findById(req.params.USERID, function(err, user)
    {
        if (err || !user)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User Not Found'
                }
            );
        }
        if (req.query.filter)
        {
            var filteredUser =
            {
                username: '',
                photo: '',
                role: ''
            }
            filteredUser.username = req.query.username ? user.username : undefined;
            filteredUser.photo = req.query.photo ? user.photo : undefined;
            filteredUser.role = req.query.role ? user.role : undefined;
            res.status(200).json(
                {
                    success : true,
                    user    : filteredUser
                }
            );
        }
        else
        {
            user.password = undefined;
            res.status(200).json(
                {
                    success : true,
                    user    : user
                }
            );
        }
    });
};

var login = function (req, res)
{
    if (!req.body.username || !req.body.password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'You failed to enter email and/or password'
            }
        );
    }

    User.findOne({username: req.body.username}, function(err, user)
    {
        if (err)
        {
            return res.status(500).json(
                {
                    success: false,
                    message: 'Internal Error'
                }
            );
        }
        if (!user)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User Not Found'
                }
            );
        }
        if (!bcrypt.compareSync(req.body.password, user.password))
        {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Incorrect Password'
                }
            );
        }
        req.session.user = user;
        req.session.user.password = undefined;
        res.status(200).json(
            {
                success: true,
                message: 'Login Successful',
                user_id: user._id
            }
        );
    });
};

var logout = function(req, res)
{
    req.session.reset();
    res.status(200).json(
        {
            success: true,
            message: 'Logout Successful'
        }
    );
};

var register = function (req, res)
{
    var addUser = null;

    if (!req.body.username || !req.body.password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'You failed to enter username and password'
            }
        );
    }
    if (req.body.role === roles.ADMIN)
    {
        if (req.body.username == "admin@gatech.edu")
        {
            addUser = new User(
            {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                role    : 'admin'
            });
        }
        else
        {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Not Authorized'
                }
            );
        }
    }
    else
    {
        addUser = new User(
        {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            role    : req.body.role
        });
    }
    addUser.save(function(err, savedUser)
    {
        if (err)
        {
            return res.status(500).json(
                {
                    success: false,
                    message: "Internal Error"
                }
            );
        }
        res.status(201).json(
            {
                success: true,
                message: 'Registration Successsful',
                id: savedUser._id.toString()
            }
        );
    });
};

var updateUser = function (req, res)
{
    User.findById(req.params.USERID, function(err, user)
    {
        if (err || !user)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User Not Found'
                }
            );
        }
        if (req.body.new_photo)
        {
            user.photo = req.body.new_photo;
        }
        if (req.body.new_role)
        {
            if (req.user.role === roles.ADMIN)
            {
                if (req.body.new_role !== roles.INSTRUCTOR || req.body.new_role !== roles.STUDENT)
                {
                    return res.status(401).json(
                        {
                            success: false,
                            message: 'Incorrect Role'
                        }
                    );
                }
                else user.role = req.body.new_role;
            }
            else
            {
                return res.status(401).json(
                    {
                        success: false,
                        message: 'Admin Authorization Required'
                    }
                );
            }
        }
        user.save(function(err, updated_user)
        {
            if (err)
            {
                return res.status(401).json(
                    {
                        success : false,
                        message : 'User Not Updated'
                    }
                );
            }
            else
            {
                return res.status(200).json(
                    {
                        success : true,
                        message : 'User Updated',
                        user    : updated_user
                    }
                );
            }
        });
    });
};

module.exports =
{
    deleteUser  : deleteUser,
    getAll      : getAll,
    getUser     : getUser,
    login       : login,
    logout      : logout,
    register    : register,
    updateUser  : updateUser
};
