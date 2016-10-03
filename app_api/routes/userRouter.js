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
//TODO need to eventually limit this endpoint to admin
userRouter.route('/')
    .get(userController.getAll);

//get user info, should be limited to user and admin
userRouter.route('/:USERID')
    .get(userController.requireSession, userController.getUser);

//delete user, need to limit to user and admin
userRouter.route('/:USERID')
    .delete(userController.requireSession, userController.deleteUser);

//update user, need to limit to user and admin
userRouter.route('/:USERID')
    .post(userController.requireSession, userController.updateUser);


module.exports = userRouter;
