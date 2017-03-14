/* jshint node: true */
/* jshint esversion: 6 */

//************************************************************
//  questionModel.js                                        //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Amy Zhuang on 02/05/17.                      //
//  Copyright © 2017 Amy Zhuang. All rights reserved.       //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  02Feb05     A. Zhuang   Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var answer_choice = {
    text: {
        type: String,
        required: true
    },
    answer: {
        type: Boolean,
        required: true
    },
    "_id": false
};

var QuestionSchema = new Schema({
    instructor_id: {
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
    html_title: {
        type: String,
        required: true
    },
    html_body: {
        type: String,
        required: true,
    },
    answer_choices:[answer_choice],
    copied: Boolean
});


module.exports = mongoose.model('Question', QuestionSchema);
