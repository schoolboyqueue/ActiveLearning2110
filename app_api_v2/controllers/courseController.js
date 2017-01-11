/* jshint node: true */

//************************************************************
//  courseController.js                                     //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 01/07/17.                   //
//  Copyright © 2017 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  07Jan17     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var User  = require('./../../app_api/models/userModel');
var Course  = require('./../../app_api/models/courseModel');
var rand    = require("random-key");

var createCourse = function(req, res)
{
    console.log('courseController createCourse');

    User.findById(req.decodedToken.sub, function(err, user)
    {
        var newCourse = null;

        var course_instructor =
        {
            instructor_id   : user._id.toString(),
            username        : user.username
        };

        newCourse = new Course(
        {
            title       : req.body.title,
            instructor  : course_instructor,
            access_key  : rand.generate()
        });

        newCourse.save(function(err, savedCourse)
        {
            if (err)
            {
              console.log(err);
                return res.status(500).json(
                    {
                        success: false,
                        message: "Internal Error"
                    }
                );
            }
            res.status(201).json(
                {
                    success   : true,
                    message   : 'Course Creation Successsful',
                    course_id : savedCourse._id.toString()
                }
            );
        });
    });
}

var joinCourse = function(req, res)
{
  User.findById(req.decodedToken.sub, function(err, user)
  {
    if (err)
    {
        return res.status(404).json(
            {
                success: false,
                message: 'User Not Found'
            }
        );
    }
    else
    {
        Course.findOne({'access_key': req.body.course_key}, function (err, course)
        {
            if (err)
            {
                return res.status(404).json(
                    {
                        success: false,
                        message: 'Invalid Course Key'
                    }
                );
            }
            else
            {
                course.students.push(
                    {
                        student_id: user.id.toString(),
                        username  : user.username
                    }
                );
                course.save(function(err, updated_course)
                {
                    if (err)
                    {
                        return res.status(200).json(
                            {
                                success   : false,
                                message   : 'Internal Error'
                            }
                        );
                    }
                    else
                    {
                        res.status(200).json(
                            {
                                success   : true,
                                message   : 'Student Added to Course',
                                course_id : updated_course._id.toString()
                            }
                        );
                    }
                });
            }
        });
    }
  });
}

module.exports =
{
    createCourse      :     createCourse,
    joinCourse        :     joinCourse
};
