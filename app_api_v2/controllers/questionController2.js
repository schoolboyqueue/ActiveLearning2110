/* jshint node: true */
/* jshint esversion: 6 */

//************************************************************
//  questionController.js                                   //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Amy Zhuang on 02/05/17.                      //
//  Copyright © 2017 Amy Zhuang. All rights reserved.       //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  02Feb5      A. Zhuang   Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var User = require('./../models/userModel');
var Question2 = require('./../models/questionModel2');
var QuestionSet = require('./../models/questionSetModel');
var rand = require("random-key");


var getAllQuestions = function(req, res) {
    console.log('questionController2 getAllQuestions');

    Question2.find()
        .exec()
        .then(function(questions) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                questions: questions,
                message: "Success on getAllQuestions"
            });
        })
        .catch(function(err) {
            return res.status(500).json({
                success: false,
                message: 'Internal Error'
            });
        });
};

var getAllInstructorQuestions = function(req, res) {
    console.log('questionController2 getAllInstructorQuestions');

    Question2.find({"instructor_id": req.params.USERID})
        .exec()
        .then(function(questions) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                questions: questions,
                message: "Success on getAllInstructorQuestions"
            });
        })
        .catch(function(err) {
            return res.status(500).json({
                success: false,
                message: 'Internal Error'
            });
        });
};

var getAllQuestionSets = function(req, res) {
    console.log('questionController2 getAllQuestionSets');

    QuestionSet.find({"instructor_id": req.params.USERID})
        .exec()
        .then(function(questionsets) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                questionsets: questionsets,
                message: "Success on getAllQuestionSets"
            });
        })
        .catch(function(err) {
            return res.status(500).json({
                success: false,
                message: 'Internal Error'
            });
        });
};

var savedQuestionToDB = function(req, res) {
    console.log('questionController2 savedQuestionToDB');

    var newQuestion = new Question2({
        title: req.body.title,
        instructor_id: req.decodedToken.sub
    });

    newQuestion.save()
    .then(function(question) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'Question Created',
            question: question
        });
    })
    .catch(function(err) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};

var copyQuestion = function(req, res) {
    console.log('questionController2 savedQuestionToDB');

    Question2.findById(req.params.QUESTIONID)
    .exec()
    .then(function(question) {
        var newQuestion = new Question2({
            title: question.title,
            instructor_id: req.decodedToken.sub,
            copy: true
        });
        return newQuestion.save();
    })
    .then(function(question) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'Question Copied',
            question: question
        });
    })
    .catch(function(err) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};

var deleteQuestion = function(req, res) {
    console.log('questionController deleteQuestion');

    Question2.remove({_id: req.params.QUESTIONID})
    .exec()
    .then(function(data) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'Question Deleted',
            data: data
        });
    })
    .catch(function(err) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};

var editQuestion = function(req, res) {
    console.log('questionController editQuestion');

    Question2.findById(req.params.QUESTIONID)
      .exec()
      .then(function(question) {
          return new Promise((resolve, reject) => {
              if (question.copy) {
                  var error_message = new Error('Cannot Edit Question');
                  reject(error_message);
              }
              resolve(question);
          });
      })
      .then(function(question) {
          question.title = req.body.new_title;
          return question.save();
      })
      .then(function(question) {
          return res.status(200).json({
              success: true,
              jwt_token: req.token,
              message: 'Question Updated',
              question: question
          });
      })
      .catch(function(err) {
          return res.status(404).json({
              success: false,
              message: err.message
          });
      });
};

/*
var editQuestion = function(req, res) {
    console.log('questionController editQuestion');

    Question2.findByIdAndUpdate(req.params.QUESTIONID,
      {title: req.body.new_title}, {new: true})
      .exec()
      .then(function(question) {
          return res.status(200).json({
              success: true,
              jwt_token: req.token,
              message: 'Question Updated',
              question: question
          });
      })
      .catch(function(err) {
          return res.status(404).json({
              success: false,
              message: err.message
          });
      });
};
*/

var savedQuestionSetToDB = function(req, res) {
    console.log('questionController editAnswer');

    var newQuestionSet = new QuestionSet({
        title: "question set",
        instructor_id: req.decodedToken.sub,
        question_ids: req.body.question_ids
    });

    newQuestionSet.save()
    .then(function(questionSet) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'QuestionSet Created',
            questionSet: questionSet
        });
    })
    .catch(function(err) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });

};

module.exports = {
    savedQuestionToDB: savedQuestionToDB,
    copyQuestion     : copyQuestion,
    deleteQuestion: deleteQuestion,
    editQuestion: editQuestion,
    getAllQuestions : getAllQuestions,
    getAllQuestionSets : getAllQuestionSets,
    getAllInstructorQuestions: getAllInstructorQuestions,
    savedQuestionSetToDB: savedQuestionSetToDB
};
