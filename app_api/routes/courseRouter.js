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

var express          = require('express');
var courseController = require('./../controllers/courseController');
var courseRouter     = express.Router();




courseRouter.route('/')
    .post(courseController.requireInstuct, courseController.createCourse);

/*
//get all users
userRouter.route('/')
    .get(courseController.requireAdmin, courseController.getAll);

//get course info, should be limited to user and admin
userRouter.route('/:COURSEID')
    .get(courseController.requireSession, courseController.getUser);

//delete course
userRouter.route('/:COURSEID')
    .delete(courseController.requireSession, courseController.deleteCourse);

*/




module.exports = courseRouter;
