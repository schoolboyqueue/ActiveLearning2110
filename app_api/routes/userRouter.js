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
var authController = require('./../controllers/authController');
var userController = require('./../controllers/userController');
var courseController = require('./../controllers/courseController');
var userRouter     = express.Router();


/**
START USER SESSION

POST	/users/login

Path Params
none

Request Body application/json
{
  "username": String Required
  "password": String Required
}
**/
userRouter.route('/login')
    .post(authController.requireNoSession, userController.login);

/**
END USER SESSION

POST	/users/logout

Path Params
none
**/
userRouter.route('/logout')
    .post(authController.requireSession, userController.logout);

/**
CREATE USER

POST	/users

Path Params
none

Request Body application/json
{
    "username": String Required
    "password": String Required
    "role":     String Required
}
**/
userRouter.route('/')
    .post(userController.register);

/**
GET ALL USERS

Authentication: admin session

Example: users/
**/
userRouter.route('/')
    .get(authController.requireSession, authController.requireAdmin, userController.getAll);

/**
GET USER INFO

Authentication: user session

admin and authenticated user will get all user info
all other users will only get username and photo

Path Parameters: user_id String

Query String
filter boolean Required
username boolean optional
photo boolean optional
role boolean optional (admin and authenticated user only)


Example 1: users/{user_id}/
Example 2: users/{user_id}?filter=true&username=true&photo=true&role=true
**/
userRouter.route('/:USERID')
    .get(authController.requireSession, userController.getUser);

/**
DELETE USER ACCOUNT.

Authentication: admin session or user session

Path Parameters: user_id String

Example: users/{user_id}/
**/
userRouter.route('/:USERID')
    .delete(authController.requireSession, authController.requireAdminOrUser, userController.deleteUser);

/**
UPDATE USER

POST	/users/{userid}/

Path Params
userid String Required

Request Body application/json
{
  "new_role": String Optional (admin only)
  "new_photo": String Optional
}
**/
userRouter.route('/:USERID')
    .post(authController.requireSession, userController.updateUser);

/**
GET COURSE LIST

GET	/users/{userid}/courses

Path Params
userid String Required
**/
userRouter.route('/:USERID/courses')
    .get(authController.requireSession, courseController.getCourses);


module.exports = userRouter;
