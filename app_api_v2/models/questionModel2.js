/* jshint node: true */

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

var QuestionSchema2 = new Schema({
    instructor_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    copy: Boolean
});

module.exports = mongoose.model('Question2', QuestionSchema2);
