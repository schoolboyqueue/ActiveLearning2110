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
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
};

var deleteUser = function (req, res)
{
    if (req.params.USERID !== req.user._id.toString() && req.user.role !== roles.ADMIN)
    {
        return res.status(401).json(
            {
                success: false,
                message: 'Not Authorized'
            }
        );
    }
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
    if (req.params.USERID !== req.user._id.toString() && req.user.role !== roles.ADMIN)
    {
        return res.status(401).json(
            {
                success: false,
                message: 'Not Authorized'
            }
        );
    }
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
        res.status(200).json(
            {
                success: true,
                user: user
            }
        );
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
        if (req.body.username == "admin@activelearning.com")
        {
            addUser = new User(
            {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                role    : req.body.role
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
                message: 'Registration Successsful'
            }
        );
    });
};

var requireAdmin = function (req, res, next)
{
    if (req.user.role !== roles.ADMIN)
    {
        console.log('admin: false');
        return res.status(401).json(
            {
                success: false,
                message: 'Admin Authorization Required'
            }
        );
    }
    else
    {
        console.log('admin: true');
        next();
    }
};

var requireNoSession = function(req, res, next)
{
    if (req.user)
    {
        console.log('no session: false');
        return res.status(411).json(
            {
                success: false,
                message: 'Session Already Active. Please End Session'
            }
        );
    }
    else
    {
        console.log('no session: true');
        next();
    }
};

var requireSession = function (req, res, next)
{
    if (!req.user)
    {
        console.log('session: false');
        return res.status(401).json(
            {
                success: false,
                message: 'No Session Active'
            }
        );
    }
    else
    {
        console.log('session: true');
        next();
    }
};

var updatePhoto = function (req, res)
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
        user.photo = req.query.new_photo;
        user.save(function(err, updated_user)
        {
            if (!err)
            {
                res.status(200).json(
                    {
                        success: true,
                        message: 'Photo Updated',
                        user: updated_user
                    }
                );
            }
        });
    });
};

var updateRole = function (req, res)
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
        user.role = req.query.new_role;
        user.save(function(err, updated_user)
        {
            if (!err)
            {
                res.status(200).json(
                    {
                        success: true,
                        message: 'Role Updated',
                        user: updated_user
                    }
                );
            }
        });
    });
};

var updateUser = function (req, res)
{
    res.status(501).json(
        {
            success: false,
            message: 'Update User not yet implemented'
        }
    );
};

module.exports =
{
    deleteUser        :    deleteUser,
    getAll            :    getAll,
    getUser           :    getUser,
    login             :    login,
    logout            :    logout,
    register          :    register,
    requireAdmin      :    requireAdmin,
    requireNoSession  :    requireNoSession,
    requireSession    :    requireSession,
    updatePhoto       :    updatePhoto,
    updateRole        :    updateRole,
    updateUser        :    updateUser
};
