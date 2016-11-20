/* jshint node: true */

//************************************************************
//  courseController.js                                     //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 11/19/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  19Nov16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var Course  = require('./../models/courseModel');
var rand = require("random-key");

var roles =
{
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
};

var createCourse  = function (req, res)
{
    var newCourse = null;

    var course_instructor =
    {
        instructor_id : req.user.id.toString(),
        username:       req.user.username,
    }

    newCourse = new Course(
    {
        title:          req.body.title,
        instructor:     course_instructor,
        access_key:     rand.generate()
    });

    newCourse.save(function(err, savedCourse)
    {
        if (err)
        {
            return res.status(500).json(
                {
                    success: false,
                    message: "Internal Error"
                }
            );
        }
        res.status(201).json(
            {
                success: true,
                message: 'Course Creation Successsful',
                course :  savedCourse
            }
        );
    });
};

var getAllCourses  = function (req, res)
{
    Course.find(function(err, courses)
    {
        if (err)
        {
            res.status(500);
            res.send('Internal Error');
        }
        else
        {
            res.status(200);
            res.send(courses);
        }
    });
};

var getInstructorCourses = function (req, res)
{
    Course.find({"instructor.instructor_id": req.params.USERID}, function(err, courses)
    {
        if (err || !courses)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'No Courses Not Found'
                }
            );
        }
        res.status(200).json(
            {
                success: true,
                courses: courses
            }
        );
    });
};

module.exports =
{
    createCourse        :    createCourse,
    getAllCourses       :    getAllCourses,
    getInstructorCourses:    getInstructorCourses
};