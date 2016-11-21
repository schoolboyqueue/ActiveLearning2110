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

var express             = require('express');
var authController      = require('./../controllers/authController');
var courseController    = require('./../controllers/courseController');
var courseRouter        = express.Router();

/**
INSTRUCTOR CREATE COURSE

Authentication: user session, instructor session

Example: courses/

Request body:
{
  "title": <<course title>
}
**/
courseRouter.route('/')
    .post(authController.requireSession, authController.requireInstuctor, courseController.createCourse);

//get all courses (admin)
/**
ADMIN GET ALL COURSES

Authentication: user session, admin session

Example: courses/
**/
courseRouter.route('/')
    .get(authController.requireSession, authController.requireAdmin, courseController.getAllCourses);


/**
INSTRUCTOR GET ALL COURSES

Authentication: user session, instructor session

Path Parameters: course_id String

Example: courses/{course_id}/instructor
**/
courseRouter.route('/:USERID/instructor')
    .get(authController.requireSession, authController.requireInstuctor, courseController.getInstructorCourses);

/**
STUDENT JOIN COURSE

Authentication: user session, student session

Path Parameters: course_id String

Example: courses/{course_id}/student

Request body:
{
  "courseKey": <<access_key>
}
**/
courseRouter.route('/:COURSEID/student')
    .post(authController.requireSession, authController.requireStudent, courseController.joinCourse);


module.exports = courseRouter;
