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


/**
STUDENT JOIN COURSE

Authentication: student session

Path Parameters: course_id String

Example: courses/{course_id}/

Request body:
{
  "courseKey": <<access_key>
}
**/
courseRouter.route('/:COURSEID')
    .post(authController.requireSession, authController.requireStudent, courseController.joinCourse);

/**
GET COURSE INFO

Authentication: user session

Path Parameters: course_id String

Query String
filter boolean Required
title boolean optional
instructor boolean optional (admin and authenticated instructor only)
access_key boolean optional (admin and authenticated instructor only)
createdAt boolean optional
students boolean optional

Example 1: courses/{course_id}/ - returns all course info
Example 2: courses/{course_id}?filter=true&title=true - returns filtered course info
**/
courseRouter.route('/:COURSEID')
    .get(authController.requireSession, courseController.getCourse);

/**
GET COURSE STUDENTS

Authentication: user session, instructor session

Path Parameters: course_id String

Example: courses/{course_id}/students
**/
courseRouter.route('/:COURSEID/students')
    .get(authController.requireSession, courseController.getStudents);

/**
DELETE STUDENT FROM COURSE

Authentication: admin session, instructor session

Path Parameters: course_id String, user_id String

Example: courses/{course_id}/students/{user_id}/
**/
courseRouter.route('/:COURSEID/students/:USERID')
    .delete(authController.requireSession, courseController.deleteStudent);

/**
CREATE COURSE LECTURE

Authentication: instructor session

Path Parameters: course_id String

Example: courses/{course_id}/lectures
**/
courseRouter.route('/:COURSEID/lectures')
    .post(authController.requireSession, courseController.createLecture);

module.exports = courseRouter;
