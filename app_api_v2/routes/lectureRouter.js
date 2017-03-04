/* jshint node: true */

//************************************************************
//  lectureRouter.js                                        //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 03/04/2017.                 //
//  Copyright © 2017 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  03/02/05    O. Miz      Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var express = require('express');
var lectureRouter = express.Router();

var lectureController = require('./../controllers/lectureController');
var tokenController = require('./../controllers/tokenController');


/**
Create Lecture

POST	/api_v2/lectures

Authentication:   user token
Authorization:    admin, instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: application/json
{
	"title"	: String Required
}
**/
lectureRouter.route('/:COURSEID')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.savedLectureToDB);

/**
Delete Lecture

DELETE	/api_v2/lecture/{lecture_id}/course/{course_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  lecture_id, course_id String	required
Query String:     none
Request Body: 	  none
**/
lectureRouter.route('/:LECTUREID/course/:COURSEID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.deleteLecture);

/**
Add Question

POST	/api_v2/lecture/{lecture_id}/questions

Authentication:   user token
Authorization:    admin, instructor

Path Parameters:  lecture_id String	required
Query String:     none
Request Body: 	  none
**/
lectureRouter.route('/:LECTUREID/questions/:QUESTIONID')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.addQuestionToLecture);

/**
Remove Question

DELETE	/api_v2/lecture/{lecture_id}/questions{question_id}/

Authentication:   user token
Authorization:    admin, instructor

Path Parameters:  lecture_id, question_id String	required
Query String:     none
Request Body: 	  none
**/
lectureRouter.route('/:LECTUREID/questions/:QUESTIONID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.removeQuestion);

/**
Save Question Set

POST	/api_v2/lecture/{lecture_id}/questionset

Authentication:   user token
Authorization:    instructor

Path Parameters:  lecture_id String	required
Query String:     none
Request Body: 	  none
**/
lectureRouter.route('/:LECTUREID/questionset')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.saveQuestionSet);

/**
Add Question Set to Lecture

POST	/api_v2/lecture/{lecture_id}/questionset/{questionSet_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  lecture_id, questionSet_id String	required
Query String:     none
Request Body: 	  none
**/
lectureRouter.route('/:LECTUREID/questionset/:QUESTIONSETID')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        lectureController.addQuestionSet);



module.exports = lectureRouter;
