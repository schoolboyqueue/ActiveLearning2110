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
var rand    = require("random-key");

var roles =
{
    ADMIN       : 'admin',
    INSTRUCTOR  : 'instructor',
    STUDENT     : 'student',
};

var createCourse  = function (req, res)
{
    var newCourse = null;

    var course_instructor =
    {
        instructor_id   : req.user._id.toString(),
        username        : req.user.username
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
                success : true,
                message : 'Course Creation Successsful',
                course  : savedCourse
            }
        );
    });
};

var deleteStudent = function (req, res)
{
    Course.findById(req.params.COURSEID, function(err, course)
    {
        if (err || !course)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Course Not Found'
                }
            );
        }
        else if (req.user.role === roles.ADMIN || req.user._id.toString() === course.instructor.instructor_id || req.user._id.toString() === req.params.USERID)
        {

          Course.update({ $pull: { "students" : { "student_id": req.params.USERID } } }, function(err, data)
          {
              if (err || !data)
              {
                  return res.status(400).json(
                      {
                          success: false,
                          message: 'Interal Error: Could Not Delete User'
                      }
                  );
              }
              else
              {
                  res.status(200).json(
                      {
                          success : true,
                          message: 'Student Deleted'
                      }
                  );
              }
          });
        }
        else
        {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Not Authorized'
                }
            );
        }
    });
};

var getCourse = function (req, res)
{
    Course.findById(req.params.COURSEID, function(err, course)
    {
        if (err || !course)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Course Not Found'
                }
            );
        }
        else
        {
            course.__v = undefined;
            course._id = undefined;

            if (req.user.role === roles.ADMIN || req.user._id.toString() === course.instructor.instructor_id)
            {
                if (req.query.filter)
                {
                    course.title = req.query.title ? course.title : undefined;
                    course.instructor = req.query.instructor ? course.instructor : undefined;
                    course.access_key = req.query.access_key ? course.access_key : undefined;
                    course.createdAt = req.query.createdAt ? course.createdAt : undefined;
                    course.students = req.query.students ? course.students : undefined;
                }
                return res.status(200).json(
                    {
                        success : true,
                        course  : course
                    }
                );
            }
            else
            {
                course.instructor.instructor_id = undefined;
                course.access_key = undefined;

                if (req.query.filter)
                {
                    course.instructor = req.query.instructor ? course.instructor : undefined;
                    course.title = req.query.title ? course.title : undefined;
                    course.createdAt = req.query.createdAt ? course.createdAt : undefined;
                    course.students = undefined;
                }
                return res.status(200).json(
                    {
                        success : true,
                        course  : course
                    }
                );
            }

        }
    });
};

var getCourses = function (req, res)
{
    if (req.user.role === roles.INSTRUCTOR)
    {
        Course.find({"instructor.instructor_id": req.params.USERID}, function(err, courses)
        {
            if (!err && courses)
            {
                return res.status(200).json(
                    {
                        success: true,
                        courses: courses
                    }
                );
            }
        });
    }
    else if (req.user.role === roles.ADMIN)
    {
        Course.find(function(err, courses)
        {
            if (!err && courses)
            {
                return res.status(200).json(
                    {
                        success: true,
                        courses: courses
                    }
                );
            }
        });
    }
    else if (req.user.role === roles.STUDENT)
    {
        Course.find({"students.student_id": req.params.USERID}, function(err, courses)
        {
            if (!err && courses)
            {
                return res.status(200).json(
                    {
                        success: true,
                        courses: courses
                    }
                );
            }
        });
    }
    else
    {
        res.status(404).json(
            {
                success: false,
                message: 'No Courses Not Found'
            }
        );
    }
};

var getStudents = function (req, res)
{
    Course.findById(req.params.COURSEID, function(err, course)
    {
        if (err || !course)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Course Not Found'
                }
            );
        }
        else
        {
            res.status(200).json(
                {
                    success : true,
                    students  : course.students
                }
            );
        }
    });
};

var joinCourse = function (req, res)
{
  Course.findById(req.params.COURSEID, function(err, course)
  {
      if (err || !course)
      {
          return res.status(404).json(
              {
                  success: false,
                  message: 'Course Not Found'
              }
          );
      }
      if (req.body.courseKey !== course.access_key)
      {
          return res.status(401).json(
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
                  student_id: req.user.id.toString(),
                  username  : req.user.username
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
              if (!err)
              {
                  res.status(200).json(
                      {
                          success   : true,
                          message   : 'Student Added'
                      }
                  );
              }
          });
      }
  });
};

module.exports =
{
    createCourse        :    createCourse,
    deleteStudent       :    deleteStudent,
    getCourse           :    getCourse,
    getCourses          :    getCourses,
    getStudents         :    getStudents,
    joinCourse          :    joinCourse
};
