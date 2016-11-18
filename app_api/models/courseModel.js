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

var User        = require('./userModel');

var CourseSchema  = new Schema(
{
    title:
    {
        type: String,
        required: true
    },
    instructor_id:
    {
        type: String,
        required: true
    },
    createdAt:
    {
        type : Date,
        default : Date.now
    },
    access_key:
    {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model('Course', CourseSchema);
