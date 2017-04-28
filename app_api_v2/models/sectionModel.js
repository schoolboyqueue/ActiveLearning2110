/* jshint node: true */

//************************************************************
//  sectionModel.js                                         //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 03/18/2017.                 //
//  Copyright © 2017 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  03/18/17    O. Miz      Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var student_snapshot = {
    student_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending'
    },
    average: {
        type: Number,
        default: 0
    },
    "_id": false
};

var SectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    course_oid: { 
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    course_id: {
        type: String,
        required: true
    },
    section_key: {
        type: String,
        required: true,
        unique: true
    },
    students: [student_snapshot]
});

module.exports = mongoose.model('Section', SectionSchema);
