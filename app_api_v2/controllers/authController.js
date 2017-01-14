/* jshint node: true */

//************************************************************
//  authController.js                                       //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 12/22/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  22Dec16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var User       = require('./../models/userModel');
var config     = require('./../../config');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');

var roles =   {
                  ADMIN       : 'admin',
                  INSTRUCTOR  : 'instructor',
                  STUDENT     : 'student',
              };

var authorizeAdmin = function (req, res, next)
{
    console.log('authController admin');

    if (req.decodedToken.role !== roles.ADMIN)
    {
        return res.status(401).json(
            {
                success: false,
                message: 'Admin Authorization Required'
            }
        );
    }
    else
    {
        next();
    }
}

var authorizeRoleUpdate = function (req, res, next)
{
    console.log('authController updateRole');

    if (!req.body.new_role)
    {
        next();
    }
    else
    {
        if (req.decodedToken.role !== roles.ADMIN)
        {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Not Authorized'
                }
            );
        }
        else
        {
            next();
        }
    }
}

var authorizeAdminOrSelf = function (req, res, next)
{
    console.log('authController adminOrSelf');
    //console.log('Decoded Token: ')
    //console.log(req.decodedToken);

    if (req.decodedToken.sub !== req.params.USERID && req.decodedToken.role !== roles.ADMIN)
    {
        return res.status(401).json(
            {
                success: false,
                message: 'Not Authorized'
            }
        );
    }
    else
    {
        next();
    }
}

var authorizeSelf = function (req, res, next)
{
    console.log('authController authorizeSelf');
    //console.log('Decoded Token: ')
    //console.log(req.decodedToken);

    if (req.decodedToken.sub !== req.params.USERID)
    {
        return res.status(401).json(
            {
                success: false,
                message: 'Not Authorized'
            }
        );
    }
    else
    {
        next();
    }
}

var authenticateUser = function (req, res, next)
{
    console.log('authController authenticateUser');

    if (!req.body.username)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Username'
            }
        );
    }
    else if (!req.body.password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Password'
            }
        );
    }
    else
    {
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
            else if (!user)
            {
                return res.status(404).json(
                    {
                        success: false,
                        message: 'User Does Not Exist'
                    }
                );
            }
            else if (!bcrypt.compareSync(req.body.password, user.password))
            {
                return res.status(401).json(
                    {
                        success: false,
                        message: 'Invalid Password'
                    }
                );
            }
            else
            {
                req.user_id    = user._id.toString();
                req.user_role  = user.role;
                next();
            }
        });
    }
};

/*
var authenticateUser2 = function (req, res)
{
    console.log('authController authenticate');
    if (!req.body.username)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'You failed to enter username'
            }
        );
    }
    else if (!req.body.password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'You failed to enter password'
            }
        );
    }
    else
    {
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
            else if (!user)
            {
                return res.status(404).json(
                    {
                        success: false,
                        message: 'User Not Found'
                    }
                );
            }
            else if (!bcrypt.compareSync(req.body.password, user.password))
            {
                return res.status(401).json(
                    {
                        success: false,
                        message: 'Invalid Password'
                    }
                );
            }
            else
            {
                var claims =  {
                                  exp   : Math.floor(Date.now() / 1000) + (60 * 5),
                                  iss   : 'activelearning2110.com',
                                  sub   : user._id.toString(),
                                  role  : user.role
                              }
                jwt.sign(claims, config.jwt_secret, {}, function(err, token)
                {
                    if (err)
                    {
                        return res.status(401).json(
                            {
                                success: false,
                                error: err
                            }
                        );
                    }
                    else
                    {
                        //console.log(token);
                        setCookieJWT(res, token, function(test)
                        {
                            return res.status(200).json(
                                {
                                    success: true,
                                    message: 'Auth Successful',
                                    user_id: user._id,
                                    jwt_token: token
                                }
                            );
                        });
                    }
                });
            }
        });
    }
};
*/

var logout = function(req, res)
{
    console.log('authController logout');
    setCookieJWT(res, undefined, function()
    {
        return res.status(200).json(
            {
                success: true,
                message: 'Logout Successful'
            }
        );
    });
};

module.exports =
{
    authenticateUser    :   authenticateUser,
    authorizeAdmin      :   authorizeAdmin,
    authorizeAdminOrSelf:   authorizeAdminOrSelf,
    authorizeRoleUpdate :   authorizeRoleUpdate,
    authorizeSelf       :   authorizeSelf,
    logout              :   logout
};
