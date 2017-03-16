/* jshint node: true */
/* jshint esversion: 6 */

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

/**
Add Question

POST	/api_v2/question

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: application/json
{
	"title": 	String	required
  "tags": [String] Required
	"html_title": 	String	required
	"html_body"	: String Required
	"answer_choices"	: [answer_choice] Required
}
**/
questionRouter.route('/')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        inputController.requireTags,
        inputController.requireQuestionBody,
        inputController.requireAnswerChoices,
        questionController.savedQuestionToDB);

/**
Get All Questions
*Does not return copied questions and only returns Question snapshot.
*Call /question/{question_id}/ for full details

GET	/api_v2/question?tag={query_string}/

Authentication:   user token
Authorization:    none

Path Parameters:  none
Query String:     query_string String optional
Example:          /question?tag=cs%202110&tag=chapter%205&tag=c%20language searches for tags ["cs 2110", "chapter 5", "c language"]
Request Body:     none
**/
questionRouter.route('/')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        questionController.getAllQuestions);

/**
Get Question Full Details

GET	/api_v2/question/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter.route('/:QUESTIONID')
    .get(tokenController.validateToken,
        tokenController.refreshToken,
        questionController.getQuestion);

/**
Copy Question From Existing
*Does not allow instructor to copy their own Question.

PUT /api_v2/question/{question_id}/copy

Authentication:   user 	token
Authorization: 	  instructor

Path Parameters: 	question_id	String	required
Query String:     none
Request Body:     none
**/
questionRouter.route('/:QUESTIONID/copy')
    .put(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        questionController.copyQuestion);

/**
Delete Question

DELETE	/api_v2/questions/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter.route('/:QUESTIONID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        authorizeController.instructor,
        questionController.deleteQuestion);

/**
Edit Question

POST /api_v2/questions/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	    required
Query String:     none
Request Body: 	  application/.json 		required
{
  "title": 	String	required
  "tags": [String] Required
  "html_title": 	String	required
  "html_body"	: String Required
  "answer_choices"	: [answer_choice] Required
}
**/
questionRouter.route('/:QUESTIONID')
	 .post(tokenController.validateToken,
        tokenController.refreshToken,
		    authorizeController.instructor,
		    questionController.editQuestion);


module.exports = questionRouter;
