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
var authController = require('./../controllers/authController');
var courseController = require('./../controllers/courseController');
var courseRouter     = express.Router();


//create course
courseRouter.route('/')
    .post(authController.requireSession, authController.requireInstuctor, courseController.createCourse);

//get all courses (admin)
courseRouter.route('/')
    .get(authController.requireSession, authController.requireAdmin, courseController.getAllCourses);

//get all courses (instructor)
courseRouter.route('/:USERID/instructor')
    .get(authController.requireSession, authController.requireInstuctor, courseController.getInstructorCourses);


module.exports = courseRouter;
