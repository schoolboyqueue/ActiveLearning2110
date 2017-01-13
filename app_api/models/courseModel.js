/* jshint node: true */

//************************************************************
//  courseModel.js                                          //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 11/17/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  17Nov16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;


var student = {
    student_id:
    {
        type    : String,
        required: true,
        unique  : true,
    },
    username:
    {
        type    : String,
        required: true,
        unique  : true
    },
    join_date:
    {
        type    : Date,
        default : Date.now
    },
    "_id": false
};

var instructor =
{
    instructor_id:
    {
        type    : String,
        required: true
    },
    username:
    {
        type    : String,
        required: true
    }
};

var StudentSchema  = new Schema(
{
    student_id:
    {
        type    : String,
        required: true,
        unique  : true,
    },
    username:
    {
        type    : String,
        required: true,
        unique  : true
    },
    join_date:
    {
        type    : Date,
        default : Date.now
    }
});

var QuestionSchema  = new Schema(
{
    question_num: Number,
    question_body: String,
    answer_choices: [String],
    answer: Number
});

var LectureSchema  = new Schema(
{
    lecture_num: Number,
    title: String,
    day: String,
    inSession: Boolean,
    questions: [QuestionSchema]
});

var CourseSchema  = new Schema(
{
    title:
    {
        type    : String,
        required: true
    },
    instructor:
    {
        type: instructor
    },
    students:
    [
        student
    ],
    createdAt:
    {
        type    : Date,
        default : Date.now
    },
    access_key:
    {
        type    : String,
        required: true,
        unique  : true
    },
    lectures:
    [
        LectureSchema
    ]
});

CourseSchema.methods.lectureOneQuestions = function(question_array)
{
    var question1 =
    {
        question_num: 1,
        question_body: 'this is a test question',
        answer_choices: ['a', 'b', 'c', 'd'],
        answer: 0
    }
    question_array.push(question1);
    return question_array;
};

module.exports = mongoose.model('Course', CourseSchema);
