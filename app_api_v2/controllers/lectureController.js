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

var Course = require('./../models/courseModel'),
    Lecture = require('./../models/lectureModel'),
    Question = require('./../models/questionModel'),
    QuestionSet = require('./../models/questionSetModel'),
    Result = require('./../models/resultModel'),
    winston = require('winston');


var checkForNull = function(data) {
    var promise = new Promise(function(resolve, reject) {
        if (!data) {
            var error_message = new Error('Does Not Exist');
            reject(error_message);
        } else {
            resolve(data);
        }
    });
    return promise;
};

var addQuestionSet = function(req, res) {
    winston.info('lectureController: add question set');
    QuestionSet.findById(req.params.QUESTIONSETID)
        .exec()
        .then(function(questionSet) {
            return Lecture.findOneAndUpdate({
                _id: req.params.LECTUREID
            }, {
                $addToSet: {
                    questions: {
                        $each: questionSet.questions
                    }
                }
            }, {
                new: true
            });
        })
        .then(function(lecture) {
            var updatedLecture = lecture.toObject();
            delete updatedLecture._id;
            updatedLecture.lecture_id = lecture._id.toString();
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Set Added To Lecture',
                lecture: updatedLecture
            });
        })
        .catch(function(err) {
            console.log("test");
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
};

var addQuestionToLecture = function(req, res) {
    winston.info('lectureController: add question to lecture');

    Question.findById(req.params.QUESTIONID)
        .exec()
        .then(checkForNull)
        .then(function(question) {
            if (question.instructor_id !== req.decodedToken.sub) {
                var newQuestion = new Question({
                    title: question.title,
                    tags: question.tags,
                    instructor_id: req.decodedToken.sub,
                    html_title: question.html_title,
                    html_body: question.html_body,
                    answer_choices: question.answer_choices,
                    copied: true
                });
                return newQuestion.save();
            } else return question;
        })
        .then(function(question) {
            req.question = question;
            return Lecture.findById(req.params.LECTUREID);
        })
        .then(function(lecture) {
            var question = {
                title: req.question.title,
                question_id: req.question._id.toString(),
                tags: req.question.tags,
                copied: req.question.copied
            };
            lecture.questions.push(question);
            return lecture.save();
        })
        .then(function(lecture) {
            var updatedLecture = lecture.toObject();
            delete updatedLecture._id;
            updatedLecture.lecture_id = lecture._id.toString();
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Added to Lecture',
                lecture: updatedLecture
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
    winston.info('lectureController: delete lecture');

    Course.findByIdAndUpdate(req.params.COURSEID, {
            $pull: {
                "lectures": {
                    "lecture_id": req.params.LECTUREID
                }
            }
        }, {
            new: true
        })
        .exec()
        .then(function(course) {
            req.course = course;
            return Lecture.remove({
                _id: req.params.LECTUREID
            });
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
    winston.info('lectureController: edit lecture');

    Lecture.findByIdAndUpdate(req.params.LECTUREID, {
            $set: {
                title: req.body.title,
                schedule: req.body.schedule
            }
        }, {
            new: true
        })
        .exec()
        .then(function(lecture) {
            return Course.findOneAndUpdate({
                "_id": lecture.course_id,
                "lectures.lecture_id": req.params.LECTUREID
            }, {
                $set: {
                    "lectures.$.title": req.body.title,
                    "lectures.$.schedule": req.body.schedule
                }
            }, {
                new: true
            });
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

var getLecture = function(req, res) {
    winston.info('lectureController: get lecture');

    Lecture.findById(req.params.LECTUREID, {
            "__v": 0
        })
        .exec()
        .then(checkForNull)
        .then(function(lecture) {
            var updatedLecture = lecture.toObject();
            delete updatedLecture._id;
            updatedLecture.lecture_id = lecture._id.toString();
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Request Success',
                lecture: updatedLecture
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
    winston.info('lectureController: get course lectures');

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

var getAllQuestionSets = function(req, res) {
    winston.info('lectureController: get all question sets');

    QuestionSet.find({
            "instructor_id": req.params.USERID
        })
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

var getStudentResults = function(req, res) {
    winston.info('lectureController: get student results');

    /*
    Result.find({student_id: req.params.STUDENTID, lecture_id: req.params.LECTUREID})
    .exec()
    .then(function(results) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            results: results,
            message: "Success on getStudentResults"
        });
    });
    */
    Result.aggregate([
        {$match: {"student_id": req.params.STUDENTID, "lecture_id": req.params.LECTUREID}},
        {$lookup: {from: "questions",localField: "question_oid",foreignField: "_id",as: "question_details"}}
    ])
    .exec()
    .then(function(results) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            results: results,
            message: "Success on getStudentResults"
        });
    })
    .catch(function(err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error'
        });
    });
    /*
    Result.aggregate([
        {$match: {student_id: req.params.STUDENTID, lecture_id: req.params.LECTUREID}},
        {$lookup: {from: "questions", localField: "question_id", foreignField: "_id", as: "questions"}}
        ])
    */


    /*
    QuestionSet.find({
            "instructor_id": req.params.USERID
        })
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
        */
};

var getInstructorResults = function(req, res) {
    winston.info('lectureController: get instructor results');
    console.log(req.params.LECTUREID);

    Result.aggregate( [
      {$match: {"lecture_id" : req.params.LECTUREID}},
     { $group : { "_id" : "$question_id", student_results: { $push: "$correct" }, student_answers: { $push: "$answer" } } }
     ] )
    .exec()
    .then(function(results) {
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            results: results,
            message: "Success on getInstructorResults"
        });
    })
    .catch(function(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Error'
        });
    });
};


var removeQuestion = function(req, res) {
    winston.info('lectureController: remove question');

    Lecture.findByIdAndUpdate(req.params.LECTUREID, {
            $pull: {
                "questions": {
                    "question_id": req.params.QUESTIONID
                }
            }
        }, {
            new: true
        })
        .exec()
        .then(function(lecture) {
            var updatedLecture = lecture.toObject();
            delete updatedLecture._id;
            updatedLecture.lecture_id = lecture._id.toString();
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Removed',
                lecture: updatedLecture
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
    winston.info('lectureController: re-order question');

    Question.findById(req.params.QUESTIONID)
        .exec()
        .then(checkForNull)
        .then(function(question) {
            req.question = question;
            return Lecture.findByIdAndUpdate(req.params.LECTUREID, {
                $pull: {
                    "questions": {
                        "question_id": req.params.QUESTIONID
                    }
                }
            }, {
                new: true
            });
        })
        .then(function(lecture) {
            var question = {
                title: req.question.title,
                question_id: req.question._id.toString(),
                tags: req.question.tags,
                copied: req.question.copied
            };
            lecture.questions.splice(req.body.index, 0, question);
            return lecture.save();
        })
        .then(function(lecture) {
            var updatedLecture = lecture.toObject();
            delete updatedLecture._id;
            updatedLecture.lecture_id = lecture._id.toString();
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Reorder Complete',
                lecture: updatedLecture
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
    winston.info('lectureController: save question to database');

    Course.findById(req.params.COURSEID)
        .exec()
        .then(checkForNull)
        .then(function(course) {
            req.course = course;
            var newLecture = new Lecture({
                title: req.body.lecture_title,
                instructor_id: req.decodedToken.sub,
                course_id: req.params.COURSEID,
                schedule: req.body.lecture_schedule
            });
            return newLecture.save();
        })
        .then(function(lecture) {
            var new_lecture_snapshot = {
                lecture_id: lecture._id.toString(),
                title: lecture.title,
                schedule: lecture.schedule
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
    winston.info('lectureController: save question set');

    Lecture.findById(req.params.LECTUREID)
        .exec()
        .then(function(lecture) {
            var questions = [];
            for (var i = 0; i < lecture.questions.length; i++) {
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
            return QuestionSet.find({
                "instructor_id": req.decodedToken.sub
            });
        })
        .then(function(questionSets) {
            return res.status(200).json({
                success: true,
                jwt_token: req.token,
                message: 'Question Set Saved',
                questionSets: questionSets
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
    addQuestionSet: addQuestionSet,
    addQuestionToLecture: addQuestionToLecture,
    deleteLecture: deleteLecture,
    editLecture: editLecture,
    getLecture: getLecture,
    getCourseLectures: getCourseLectures,
    getAllQuestionSets: getAllQuestionSets,
    getInstructorResults: getInstructorResults,
    getStudentResults: getStudentResults,
    removeQuestion: removeQuestion,
    reorderQuestion: reorderQuestion,
    savedLectureToDB: savedLectureToDB,
    saveQuestionSet: saveQuestionSet
};
