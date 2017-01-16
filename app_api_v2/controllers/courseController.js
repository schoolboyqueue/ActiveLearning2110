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

var User    = require('./../models/userModel');
var Course  = require('./../models/courseModel');
var rand    = require("random-key");

var roles =
{
    ADMIN       : 'admin',
    INSTRUCTOR  : 'instructor',
    STUDENT     : 'student',
};

function checkForStudent(req, res, course, callback)
{
    console.log('courseController checkForStudent');

    if (course.students === null)
    {
      callback(false);
      return;
    }
    else
    {
        for (var i = 0; i < course.students.length; i++)
        {
            if (course.students[i].student_id === req.decodedToken.sub)
            {
                callback(true);
                return;
            }
        }
        callback(false);
    }
}

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
                return res.status(500).json(
                    {
                        success: false,
                        message: err
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
    console.log('courseController joinCourse');

    Course.findOne({'access_key': req.body.course_key}, function (err, course)
    {
        if (err || !course)
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
            checkForStudent(req, res, course, function(student)
            {
                if (student)
                {
                    return res.status(404).json(
                        {
                            success: false,
                            message: 'Student Already In Course'
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

var deleteStudentFromCourse = function (req, res)
{
    console.log('userController deleteStudentFromCourse');

    Course.update({ $pull: { "students" : { "student_id": req.query.id } } }, function(err, data)
    {
        if (err || !data || data.nModified === 0)
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
                    message: 'Student Deleted',
                    data  :   data
                }
            );
        }
    });
};

var getCourse = function (req, res)
{
    console.log('userController getUser');

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
            return res.status(200).json(
                {
                    success   : true,
                    course    : course
                }
            );
        }
    });
};

var getLectures = function (req, res)
{
    console.log('userController getUser');

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
        else if (req.decodedToken.sub !== course.instructor.instructor_id)
        {
            return res.status(401).json(
                {
                    success: false,
                    message: 'User is not Course Instructor'
                }
            );
        }
        else
        {
            return res.status(200).json(
                {
                    success   : true,
                    lectures  : course.lectures
                }
            );
        }
    });
};

var getStudents = function (req, res)
{
    console.log('userController getStudents');

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
            return res.status(200).json(
                {
                    success   : true,
                    students    : course.students
                }
            );
        }
    });
};

var createLecture  = function (req, res)
{
    console.log('userController createLecture');

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
            if (req.decodedToken.sub !== course.instructor.instructor_id)
            {
                return res.status(401).json(
                    {
                        success: false,
                        message: 'User not Authorized to create lecture'
                    }
                );
            }
            else
            {
                var question_array = [];
                var next_lecture_number = !course.lectures ? 1 : (course.lectures.length + 1);
                course.lectures.push(
                    {
                        lecture_num: next_lecture_number,
                        title: req.body.title,
                        day: req.body.day,
                        inSession: false,
                        questions: course.lectureOneQuestions(question_array)
                    }
                )
                course.save(function(err, updatedCourse) {
                    if (err || !updatedCourse)
                    {
                        return res.status(404).json(
                            {
                                success: false,
                                message: 'Lecture Not Created'
                            }
                        );
                    }
                    else
                    {
                        return res.status(201).json(
                            {
                                success : true,
                                message : 'Lecture Creation Successsful',
                                lecture_id: updatedCourse.lectures[updatedCourse.lectures.length-1]._id
                            }
                        );
                    }
                });
            }
        }
    });
};

var deleteLecture  = function (req, res)
{
    console.log('userController createLecture');

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
          if (req.decodedToken.sub !== course.instructor.instructor_id)
          {
              return res.status(401).json(
                  {
                      success: false,
                      message: 'User not Authorized to delete lecture'
                  }
              );
          }
          else
          {
              course.lectures.id(req.params.LECTUREID).remove();
              course.save(function (err)
              {
                  if (err)
                  {
                      return res.status(401).json(
                          {
                              success: false,
                              message: 'Unable To Delete Lecture'
                          }
                      );
                  }
                  else
                  {
                      return res.status(201).json(
                          {
                              success : true,
                              message : 'Lecture Deletion Successsful'
                          }
                      );
                  }
              });
          }
        }
    });
};

var getUserCourses  = function (req, res)
{
    console.log('userController getUserCourses');

    if (req.decodedToken.role === roles.STUDENT)
    {
        Course.find({'students.student_id' : req.decodedToken.sub}, function(err, courses)
        {
            if (err || !courses)
            {
                return res.status(404).json(
                    {
                        success: false,
                        message: 'No Coures Found'
                    }
                );
            }
            else
            {
                return res.status(201).json(
                    {
                        success : true,
                        courses : courses
                    }
                );
            }
        });
    }
    else
    {
        Course.find({'instructor.instructor_id' : req.decodedToken.sub}, function(err, courses)
        {
            if (err || !courses)
            {
                return res.status(404).json(
                    {
                        success: false,
                        message: 'No Coures Found'
                    }
                );
            }
            else
            {
                return res.status(201).json(
                    {
                        success : true,
                        courses : courses
                    }
                );
            }
        });
    }

};

module.exports =
{
    createCourse      :     createCourse,
    createLecture     :     createLecture,
    deleteLecture     :     deleteLecture,
    deleteStudentFromCourse :   deleteStudentFromCourse,
    joinCourse        :     joinCourse,
    getCourse         :     getCourse,
    getLectures       :     getLectures,
    getStudents       :     getStudents,
    getUserCourses    :     getUserCourses
};
