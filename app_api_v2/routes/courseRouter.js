/* jshint node: true */

//************************************************************
//  authRouter.js                                           //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/18/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  22Dec16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var express           = require('express');
var courseRouter      = express.Router();

var authorizeController  = require('./../controllers/authorizeController');
var inputController      = require('./../controllers/inputController');
var tokenController      = require('./../controllers/tokenController');
var courseController     = require('./../controllers/courseController');

/**
INSTRUCTOR CREATE COURSE

POST	/api_v2/course

Authentication:   user token
Authorization:    instructor

Path Parameters:  none
Query String:     none
Request Body:     application/json     required
{
  "title":        String               required
}
**/
courseRouter.route('/')
    .post(tokenController.validateToken,
          tokenController.refreshToken,
          authorizeController.instructor,
          inputController.requireCourseTitle,
          courseController.createCourse);

/**
STUDENT JOIN COURSE

POST	/api_v2/course{course_id}/

Authentication:   user token
Authorization:    student

Path Parameters:  course_id String    required
Query String:     none
Request Body:     application/json    required
{
  "course_key":   String              required
}
**/
courseRouter.route('/:COURSEID')
    .post(tokenController.validateToken,
          tokenController.refreshToken,
          authorizeController.student,
          inputController.requireCourseKey,
          courseController.joinCourse);

module.exports = courseRouter;
