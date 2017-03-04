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
var questionRouter2 = express.Router();

var questionController2 = require('./../controllers/questionController2');
var tokenController = require('./../controllers/tokenController');


/**
Add Question

POST	/api_v2/questions2

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: application/json
{
	"title"				: [String] Required
}
**/
questionRouter2.route('/')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        questionController2.savedQuestionToDB);

/**
Get All Questions

GET	/api_v2/questions2

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter2.route('/')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        questionController2.getAllQuestions);

/**
Copy Question From Existing

PUT	/api_v2/questions2/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter2.route('/:QUESTIONID')
    .put(tokenController.validateToken,
        tokenController.refreshToken,
        questionController2.copyQuestion);

/**
Delete Question

DELETE	/api_v2/questions2/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: 	  none
**/
questionRouter2.route('/:QUESTIONID')
    .delete(tokenController.validateToken,
        tokenController.refreshToken,
        questionController2.deleteQuestion);

/**
Edit Question

POST	/api_v2/questions/{question_id}/

Authentication:   user token
Authorization:    instructor

Path Parameters:  question_id String	required
Query String:     none
Request Body: application/json
{
	"new_title"				: [String] Required
}
**/
questionRouter2.route('/:QUESTIONID')
    .post(tokenController.validateToken,
        tokenController.refreshToken,
        questionController2.editQuestion);

module.exports = questionRouter2;
