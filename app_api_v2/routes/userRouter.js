/* jshint node: true */

//************************************************************
//  authRouter.js                                           //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 12/22/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  22Dec16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var express = require('express');
var userRouter = express.Router();

var userController = require('./../controllers/userController');
var courseController = require('./../controllers/courseController');
var tokenController = require('./../controllers/tokenController');
var authorizeController = require('./../controllers/authorizeController');
var inputController = require('./../controllers/inputController');
var questionController = require('./../controllers/questionController');
var lectureController = require('./../controllers/lectureController');


/**
GET ALL USERS

GET	/api_v2/user

Authentication:   user token        required
Authorization:    admin             required

Path Parameters:  none
Query String:     none
Request Body:     none
**/
userRouter.route('/')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.admin,
        userController.getAll);

/**
GET USER

GET	/api_v2/user/{user_id}/

Authentication:   user token        required
Authorization:    admin or self     required

Path Parameters:  user_id String    required
Query String:     none
Request Body:     none
**/
userRouter.route('/:USERID')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.adminOrSelf,
        userController.getUser);

/**
UPDATE USER

POST	/api_v2/user/{user_id}/

Authentication:   user token        required
Authorization:    admin or self     required

Path Parameters:  user_id String    required
Query String:     none
Request Body:     application/json  required
{
 "new_photo"   : String            Optional
 "new_firstname":String
 "new_lastname": String
 "new_role"    : String            Optional (admin only)
}
**/
userRouter.route('/:USERID')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.adminOrSelf,
        authorizeController.roleUpdate,
        userController.updateUser);

/**
GET USER COURSES

GET	/api_v2/user/{user_id}/courses

Authentication:   user token                required
Authorization:    student or instructor     required

Path Parameters:  user_id String    required
Query String:     none
Request Body:     none
**/
userRouter.route('/:USERID/courses')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.studentOrInstructor,
        courseController.getUserCourses);


/**
UPDATE USER ROLE

POST	/api_v2/user/{user_id}/role

Authentication:   user token        required
Authorization:    admin             required

Path Parameters:  user_id String    required
Query String:     none
Request Body:     application/json  required
{
  "new_role"   :  String            required
}
**/
userRouter.route('/:USERID/role')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.admin,
        inputController.requireRole,
        userController.updateRole);


/**
UPDATE USER PASSWORD

POST	/api_v2/user/{user_id}/password

Authentication:   user token        required
Authorization:    self              required

Path Parameters:  user_id String    required
Query String:     none
Request Body:     application/json  required
{
  "cur_password": String            required
  "new_password": String            required
}
**/
userRouter.route('/:USERID/password')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.self,
        inputController.requireCurrentPassword,
        inputController.requireNewPassword,
        userController.updatePassword);


/**
DEACTIVATE/REACTIVATE USER

POST	/api_v2/user/{user_id}/deactivate

Authentication:   user token       required
Authorization:    admin            required

Path Parameters:  user_id String   required
Query String:     none
Request Body:     none
**/
userRouter.route('/:USERID/deactivate')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.admin,
        userController.deactivateUser);

/**
Get All Instructor Questions
*Only returns snapshot of questions.
*Call /question/{question_id}/ for full question details

GET	/api_v2/user/{instructor_id}/questions

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
userRouter.route('/:USERID/questions')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        questionController.getAllInstructorQuestions);

/**
Get All Instructor Question Sets

GET	/api_v2/user/{instructor_id}/questionset

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
userRouter.route('/:USERID/questionsets')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.getAllQuestionSets);


module.exports = userRouter;
