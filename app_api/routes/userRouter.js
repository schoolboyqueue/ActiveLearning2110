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
var userController = require('./../controllers/userController');
var userRouter     = express.Router();

//start user session
userRouter.route('/login')
    .post(userController.requireNoSession, userController.login);

//end user session
userRouter.route('/logout')
    .post(userController.requireSession, userController.logout);

//create new user
userRouter.route('/')
    .post(userController.register);

//get all users
userRouter.route('/')
    .get(userController.requireAdmin, userController.getAll);

//get user info, should be limited to user and admin
userRouter.route('/:USERID')
    .get(userController.requireSession, userController.getUser);


/**
Delete the user account.

Authentication
- admin session, user session

Path Parameters
- user_id String

Responses

- 200
- 401
- 404

**/
userRouter.route('/:USERID')
    .delete(userController.requireSession, userController.deleteUser);

//update user, need to limit to user and admin
userRouter.route('/:USERID')
    .post(userController.requireSession, userController.updateUser);


/**
Delete the user account.

Authentication
- admin session, user session

Path Parameters
- user_id String

Query String
- new_role String   REQUIRED

example
- users/{user_id}/role?new_role=<<role>>

    **/
//update users role, Admin restricted
//users/{user_id}/role?new_role=<<role>>
userRouter.route('/:USERID/role')
    .post(userController.requireAdmin, userController.updateRole);


module.exports = userRouter;
