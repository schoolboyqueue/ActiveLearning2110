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

var express = require('express');
var courseRouter = express.Router();

var authorizeController = require('./../controllers/authorizeController');
var inputController = require('./../controllers/inputController');
var tokenController = require('./../controllers/tokenController');
var userController = require('./../controllers/userController');
var courseController = require('./../controllers/courseController');
var lectureController = require('./../controllers/lectureController');
var signupController = require('./../controllers/signupController');

/**
INSTRUCTOR CREATE COURSE

POST    /api_v2/course

Authentication:   user token
Authorization:    instructor

Path Parameters:  none
Query String:     none
Request Body:     application/json      required
{
    "title":      String                required
    "sections": [{
        "name": String
    }]                                  required
    "course_schedule":
    {
        "semester": String              required
        "days":     [String]            required
        "time":     String              required
    }
}

days:   enum ["mon", "tue", "wed", "thu", "fri"]
**/
courseRouter.route('/')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        inputController.requireCourseTitle,
        inputController.requireCourseSchedule,
        inputController.requireSections,
        courseController.createCourse,
        courseController.getUserCourses);

/**
STUDENT JOIN COURSE

POST    se

Authentication:     user token
Authorization:      student

Path Parameters:    none
Query String:       none
Request Body:       application/json    required
{
    "section_key":  String              required
}
**/
courseRouter.route('/students')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.student,
        userController.setUserName,
        courseController.joinCourse,
        courseController.getUserCourses);

/**
INSTRUCTOR ADD STUDENTS

POST  /api_v2/course/{course_id}/sections/{section_id}/students/

Authentication:   user token
Authorization:    instructor

Path Parameters:
    course_id       String              required
    section_id      String              required

Query String:       none
Request Body:       application/json    required
{
    "username":     String              required
    "firstname":    String              required
    "lastname":     String              required
}
**/
courseRouter.route('/:COURSEID/sections/:SECTIONID/students')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        inputController.requireFirstname,
        inputController.requireLastname,
        inputController.requireUsername,
        userController.isValidStudent,
        signupController.preRegisterStudent,
        courseController.instructorAddStudent);

/**
DELETE STUDENT FROM SECTION

DELETE    /api_v2/course/{course_id}/sections/{section_id}/students/{user_id}/

Authentication:   user token
Authorization:    admin, instructor or self student

Path Parameters:
    course_id   String  required
    user_id     String  required

Query String:     none
Request Body:     none
**/
courseRouter.route('/:COURSEID/sections/:SECTIONID/students/:USERID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.adminOrInstructorOrSelf,
        courseController.deleteStudentFromCourse);

/**
GET COURSE INFO

GET    /api_v2/course/{course_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  course_id String    required
Query String:     none
Request Body:     none
**/
courseRouter.route('/:COURSEID')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        courseController.getCourse);

/**
CREATE COURSE LECTURE

POST    /api_v2/course/{course_id}/lectures

Authentication:   user token
Authorization:    instructor

Path Parameters:  course_id String      required
Query String:     none
Request Body:     application/json      required
{
    "lecture_title":    String          required
    "lecture_schedule": {
        "day":  String                  required
        "date": String                  required
    }
}

day:    enum ["mon", "tue", "wed", "thu", "fri"]
date:   'YYYY-MM-DD'
**/
courseRouter.route('/:COURSEID/lectures')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        lectureController.savedLectureToDB);

/**
GET COURSE LECTURES

GET    /api_v2/course/{course_id}/lectures

Authentication:   user token
Authorization:    instructor

Path Parameters:  course_id String  required
Query String:     none
Request Body:     none
**/
courseRouter.route('/:COURSEID/lectures')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        lectureController.getCourseLectures);

/**
DELETE COURSE LECTURE

DELETE    /api_v2/course/{course_id}/lectures/{lecture_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:
    course_id   String  required
    lecture_id  String  required

Query String:     none
Request Body:     none
**/
courseRouter.route('/:COURSEID/lectures/:LECTUREID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        lectureController.deleteLecture);

module.exports = courseRouter;
