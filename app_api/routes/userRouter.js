/* jshint node: true */

//************************************************************
//  userRouter.js                                           //
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

var express        = require('express');
var authController = require('./../controllers/authController');
var userController = require('./../controllers/userController');
var userRouter     = express.Router();

/**
START USER SESSION

Authentication: no user session

Example: users/login
**/
userRouter.route('/login')
    .post(authController.requireNoSession, userController.login);

/**
END USER SESSION

Authentication: user session

Example: users/logout
**/
userRouter.route('/logout')
    .post(authController.requireSession, userController.logout);

/**
CREATE USER

Example: users/
**/
userRouter.route('/')
    .post(userController.register);

/**
GET ALL USERS

Authentication: admin session

Example: users/
**/
userRouter.route('/')
    .get(authController.requireSession, authController.requireAdmin, userController.getAll);

/**
GET USER INFO

Authentication: admin session or user session

Path Parameters: user_id String

Example: users/{user_id}/
**/
userRouter.route('/:USERID')
    .get(authController.requireSession, authController.requireAdminOrUser, userController.getUser);

/**
DELETE USER ACCOUNT.

Authentication: admin session or user session

Path Parameters: user_id String

Example: users/{user_id}/
**/
userRouter.route('/:USERID')
    .delete(authController.requireSession, authController.requireAdminOrUser, userController.deleteUser);


/**
UPDATE USER - TODO
**/
userRouter.route('/:USERID')
    .post(authController.requireSession, userController.updateUser);


/**
CHANGE USER ROLE

Authentication: admin session

Path Parameters: user_id String

Query String: new_role String

Example: users/{user_id}/role?new_role=<<role>>
**/
userRouter.route('/:USERID/role')
    .post(authController.requireSession, authController.requireAdmin, userController.updateRole);

/**
CHANGE USER PHOTO

Authentication: user session

Path Parameters: user_id String

Query String: new_role String

Example: users/{user_id}/photo?new_photo=<<photo_url>>
**/
userRouter.route('/:USERID/photo')
    .post(authController.requireSession, userController.updatePhoto);



module.exports = userRouter;
