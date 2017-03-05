/* jshint node: true */
/* jshint esversion: 6 */

//************************************************************
//  lectureController.js                                    //
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

var Course = require('./../models/courseModel');
var Lecture = require('./../models/lectureModel');
var Question2 = require('./../models/questionModel2');
var QuestionSet = require('./../models/questionSetModel');


var checkForNull = function(data) {
   var promise = new Promise(function(resolve, reject){
       if (!data) {
         var error_message = new Error('Does Not Exist');
          reject(error_message);
       }
       else {
          resolve(data);
       }
   });
   return promise;
};

var addQuestionSet = function(req, res) {
    console.log('lectureController addQuestionSet');

    QuestionSet.findById(req.params.QUESTIONSETID)
        .exec()
        .then(function(questionSet) {
            req.questionSet = questionSet;
            return Lecture.findById(req.params.LECTUREID);
        })
        .then(function(lecture) {
            for (var i = 0; i < req.questionSet.questions.length; i++)
            {
                lecture.questions.push(req.questionSet.questions[i]);
            }
            return lecture.save();
        })
        .then(function(lecture) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Set Added To Lecture',
                lecture: lecture
            });
        })
        .catch(function(err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var addQuestionToLecture = function(req, res) {
    console.log('lectureController addQuestionToLecture');

    Question2.findById(req.params.QUESTIONID)
        .exec()
        .then(function(question) {
            req.question = question;
            return Lecture.findById(req.params.LECTUREID);
        })
        .then(function(lecture) {
            var question = {
                title: req.question.title,
                question_id: req.params.QUESTIONID
            };
            lecture.questions.push(question);
            return lecture.save();
        })
        .then(function(lecture) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Added to Lecture',
                lecture: lecture
            });
        })
        .catch(function(err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var deleteLecture = function(req, res) {
    console.log('lectureController deleteLecture');

    Course.findByIdAndUpdate(req.params.COURSEID,
      {$pull: {"lectures": {"lecture_id": req.params.LECTUREID}}},
      {new: true})
      .exec()
      .then(function(course) {
          req.course = course;
          return Lecture.remove({_id: req.params.LECTUREID});
      })
      .then(function(data) {
          return res.status(200).json({
              success: true,
              jwt_token: req.token,
              message: 'Lecture Deleted',
              lectures: req.course.lectures
          });
      })
      .catch(function(err) {
          return res.status(404).json({
              success: false,
              message: err.message
          });
      });
};

var editLecture = function(req, res) {
    console.log('lectureController editLecture');

    Lecture.findByIdAndUpdate(req.params.LECTUREID,
      {$set: { title: req.body.title, schedule: req.body.schedule }},
      {new: true})
      .exec()
      .then(function(lecture) {
          return Course.findOneAndUpdate({"_id":lecture.course_id, "lectures.lecture_id": req.params.LECTUREID},
                  {$set: {"lectures.$.title": req.body.title ,"lectures.$.schedule": req.body.schedule}},
                  {new: true});
      })
      .then(function(course) {
          return res.status(200).json({
              success: true,
              jwt_token: req.token,
              message: 'Lecture Edited',
              lectures: course.lectures
          });
      })
      .catch(function(err) {
          return res.status(404).json({
              success: false,
              message: err.message
          });
      });
};

var getCourseLectures = function(req, res) {
    console.log('lectureController getCourseLectures');

    Course.findById(req.params.COURSEID)
        .exec()
        .then(checkForNull)
        .then(function(course) {
            return res.status(201).json({
                success: true,
                jwt_token: req.token,
                message: 'Request Success',
                lectures: course.lectures
            });
        })
        .catch(function(err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var removeQuestion = function(req, res) {
    console.log('lectureController removeQuestion');

    Lecture.findByIdAndUpdate(req.params.LECTUREID,
      {$pull: {"questions": {"question_id": req.params.QUESTIONID}}},
      {new: true})
      .exec()
      .then(function(lecture) {
          return res.status(200).json({
              success: true,
              jwt_token: req.token,
              message: 'Question Removed',
              lecture: lecture
          });
      })
      .catch(function(err) {
          return res.status(404).json({
              success: false,
              message: err.message
          });
      });
};

var reorderQuestion = function(req, res) {
    console.log('lectureController reorderQuestion');

    Question2.findById(req.params.QUESTIONID)
        .exec()
        .then(function(question) {
            req.question = question;
            return Lecture.findByIdAndUpdate(req.params.LECTUREID,
              {$pull: {"questions": {"question_id": req.params.QUESTIONID}}},
              {new: true});
        })
        .then(function(lecture) {
            var question = {
                title: req.question.title,
                question_id: req.question._id.toString()
            };
            lecture.questions.splice(req.body.index, 0, question);
            return lecture.save();
        })
        .then(function(lecture) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Reorder Complete',
                lecture: lecture
            });
        })
        .catch(function(err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var savedLectureToDB = function(req, res) {
    console.log('lectureController savedLectureToDB');

    Course.findById(req.params.COURSEID)
        .exec()
        .then(checkForNull)
        .then(function(course) {
            req.course = course;
            var newLecture = new Lecture({
                title: req.body.lecture_title,
                instructor_id: req.decodedToken.sub,
                course_id:  req.params.COURSEID,
                schedule: req.body.lecture_schedule
            });
            return newLecture.save();
        })
        .then(function(lecture) {
            var new_lecture_snapshot =
            {
                lecture_id  :  lecture._id.toString(),
                title       :  lecture.title,
                schedule    :  lecture.schedule
            };
            req.course.lectures.push(new_lecture_snapshot);
            return req.course.save();
        })
        .then(function(course) {
            return res.status(201).json({
                success: true,
                jwt_token: req.token,
                message: 'Lecture Creation Successsful',
                lectures: course.lectures
            });
        })
        .catch(function(err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var saveQuestionSet = function(req, res) {
    console.log('lectureController saveQuestionSet');

    Lecture.findById(req.params.LECTUREID)
        .exec()
        .then(function(lecture) {
            var questions = [];
            for (var i = 0; i < lecture.questions.length; i++)
            {
                questions.push(lecture.questions[i]);
            }
            return questions;
        })
        .then(function(questions) {
            var newQuestionSet = new QuestionSet({
                title: req.body.title,
                instructor_id: req.decodedToken.sub,
                questions: questions
            });
            return newQuestionSet.save();
        })
        .then(function(questionSet) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Set Saved',
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
    addQuestionSet      : addQuestionSet,
    addQuestionToLecture: addQuestionToLecture,
    deleteLecture       : deleteLecture,
    editLecture         : editLecture,
    getCourseLectures   : getCourseLectures,
    removeQuestion      : removeQuestion,
    reorderQuestion     : reorderQuestion,
    savedLectureToDB    : savedLectureToDB,
    saveQuestionSet     : saveQuestionSet
};
