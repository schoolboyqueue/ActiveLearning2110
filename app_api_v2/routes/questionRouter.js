/* jshint node: true */

//************************************************************
//  questionRouter.js                                       //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Amy Zhuang on 2/5/17.	                    //
//  Copyright © 2017 Amy Zhuang. All rights reserved.	    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  05Feb17     A. Zhuang   Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var express = require('express');
var questionRouter = express.Router();

var questionController = require('./../controllers/questionController');
var authorizeController = require('./../controllers/authorizeController');
var inputController = require('./../controllers/inputController');
var tokenController = require('./../controllers/tokenController');
var userController = require('./../controllers/userController');
var courseController = require('./../controllers/courseController');
var signupController = require('./../controllers/signupController');

/**
GET ALL QUESTIONS

GET	/api_v2/questions

Authentication:   user token
Authorization:    none

Path Parameters:  none
Query String:     none
Request Body:     none
**/
questionRouter.route('/')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        questionController.getAll);

/**
Add QUESTION

POST	/api_v2/questions

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: application/json
{
	"plain_title": 	String	required
	"title": 	String	required
	"tags"				: [String] Required
	"problem_statement"	: String Required
	"answer_choices"	: [answer_choice] Required
}
**/
questionRouter.route('/')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        inputController.requireTags,
        inputController.requireProblemStatement,
        inputController.requireAnswerChoices,
        questionController.savedQuestionToDB);

/**
Edit QUESTION

POST /api_v2/questions/{question_id}/

Authentication: user token
Authorization: instructor

Path Parameters: question_id String	required
Query String: none
Request Body: 	  application/.json 		required
{
	"new_plain_title": String required
	"new_title": String required
	"new_tags": [String] required
	"new_problem_statement": 	String 	required
	"new_answer_choices": [answer_choice] required
}
**/
questionRouter.route('/:QUESTIONID')
	.post(tokenController.validateToken,
		tokenController.refreshToken,
		authorizeController.instructor,
		questionController.editQuestion);

/**
Copy QUESTION

PUT /api_v2/questions/{question_id}/

Authentication: user 	token
Authorization: 	instructor

Path Parameters: 	question_id	String	required
Query String: none
Request Body: none
**/
questionRouter.route('/:QUESTIONID')
	.put(tokenController.validateToken,
		tokenController.refreshToken,
		authorizeController.instructor,
		questionController.copyQuestion);

/**
DELETE QUESTION

DELETE	/api_v2/questions/{question_id}/

Authentication:   user token
Authorization:    admin, instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter.route('/:QUESTIONID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        questionController.deleteQuestion);


module.exports = questionRouter;
