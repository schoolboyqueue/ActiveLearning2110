/* jshint node: true */
/* jshint esversion: 6 */

//************************************************************
//  questionSetModel.js                                     //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 03/03/17.                   //
//  Copyright © 2017 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  03Mar17     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var question_snapshot = {
    question_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true,
        lowercase: true
    },
    copied: {
        type: Boolean,
        required: true
    },
    "_id": false
};

var QuestionSetSchema = new Schema({
    instructor_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    questions: [question_snapshot],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuestionSet', QuestionSetSchema);
