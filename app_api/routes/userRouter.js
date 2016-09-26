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

var userRouter = express.Router();

userRouter.route('/login')
    .post(userController.login);

userRouter.route('/register')
    .post(userController.register);

userRouter.route('/list')
    .get(userController.list);

userRouter.route('/profile/:USERID')
    .get(userController.getUser);

userRouter.route('/delete/:USERID')
    .delete(userController.delete_user);
/*
userRouter.route('/profile/:USERID')
    .post(userController.updateUser);
*/

module.exports = userRouter;
