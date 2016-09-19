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
"use strict"

var express = require('express');
var userController = require('./../controllers/userController')

var userRouter = express.Router();


//userRouter.get('/', userController.get);

userRouter.route('/')
    .post(userController.putUser);

userRouter.route('/all_users')
    .get(userController.getAll);

userRouter.route('/:user_id')
    .get(userController.getByID);

module.exports = userRouter;
