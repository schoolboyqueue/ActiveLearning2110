/* jshint node: true */
/* jshint esversion: 6 */

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

var User = require('./../models/userModel');
var Course = require('./../models/courseModel');
var Section = require('./../models/SectionModel');
var rand = require("random-key");
var bcrypt = require('bcryptjs');

var roles = {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
};

var checkForNull = function(data) {
   var promise = new Promise(function(resolve, reject){
       if (!data) {
          var error_message = new Error('Does Not Exist');
          reject(error_message);
       }
       else {
          resolve(data);
       }
   });
   return promise;
};

var instructorAddStudent = function(req, res, next) {
  console.log('courseController instructorAddStudent2');

  var newStudent;
  var student_status;
  var updatedCourse;

  User.findOne({username: req.body.username})
  .exec()
  //Check if student has a user account
  .then(function(user) {
      if (!user)
      {
          //student not found, create student account
          student_status = "pending";
          var password = rand.generate();

          var pre_registered = {
              password: password,
              course_id: req.params.COURSEID,
              section_id: req.params.SECTIONID
          };

          var newUser = new User({
              username: req.body.username,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              role: roles.STUDENT,
              register_status: student_status,
              pre_register_key: password,
              pre_registered: pre_registered
          });
          return newUser.save();
      }
      else {
          //student already registered
          student_status = "complete";
          return user;
      }
  })
  //saved new student and get course
  .then(function(user) {
      newStudent = {
        student_id: user._id.toString(),
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        status: student_status
      };
      //return NewSection.findById(req.params.SECTIONID);
      return Course.findById(req.params.COURSEID);
  })
  //check if student is already in course
  .then(function(course){
      return new Promise((resolve, reject) => {
          for (var i = 0; i < course.students.length; i++) {
              if (course.students[i] === newStudent.username) {
                  //student found in course
                  var error_message = new Error('Student Already in Course');
                  reject(error_message);
              }
          }
          //student not found in course
          resolve(course);
      });
  })
  //add student to section
  .then(function(course){
      updatedCourse = course;
      return Section.findOneAndUpdate(
        { _id: req.params.SECTIONID },
        { $addToSet: { students: newStudent } },
        { new: true });
  })
  //Update Course with updated section and also add student to student list
  .then(function(section){
      //return NewSection.find({"course_id": req.params.COURSEID}, {"__v": 0, "course_id": 0});
      var section_id = section._id.toString();
      var sect = {
          name: section.name,
          _id: section_id,
          section_key: section.section_key,
          students: section.students
      };
      return Course.update(
         { _id: req.params.COURSEID, "sections._id": section_id },
         { $set: { "sections.$" : sect }, $push: {students: newStudent.username} }, {new: true});
  })
  .then(function(data){
      return res.status(200).json({
          success: true,
          jwt_token: req.token,
          message: 'Student Added to Course',
          student_username: newStudent.username
      });
  })
  .catch(function(err){
      return res.status(500).json({
          success: false,
          message: err.message
      });
  });
};

var updateStudentStatus = function(req, res, next) {
    console.log('courseController updateStudentStatus');

    if (req.user.register_status === "pending") {
        var course_id = req.user.pre_registered.course_id;
        var section_id = req.user.pre_registered.section_id;
        var key = req.user.pre_registered_key;

        req.user.pre_registered = undefined;
        req.user.pre_registered_key = undefined;
        req.user.register_status = "complete";

        req.user.save()
        .then(function(user){
            return Section.findOneAndUpdate(
               { _id: section_id, "students.student_id": req.user._id.toString() },
               { $set: { "students.$.status" : "complete" } }, {new: true});
        })
        .then(function(section){
            var sect = {
                name: section.name,
                _id: section_id,
                section_key: section.section_key,
                students: section.students
            };
            return Course.update(
               { _id: course_id, "sections._id": section_id },
               { $set: { "sections.$" : sect } }, {new: true});
        })
        .then(function(data){
            console.log(data);
            next();
        })
        .catch(function(err){
            return res.status(401).json({
                success: false,
                message: 'Pre Registration Not Complete'
            });
        });
    }
    else {
        next();
    }
};

var joinCourse = function(req, res, next) {
    console.log('courseController joinCourse2');

    var sectionKey = req.body.section_key;
    var studentToAdd;
    var courseToJoin;

    User.findById(req.decodedToken.sub)
    .exec()
    .then(function(user) {
        req.username = user.username;
        studentToAdd = {
            student_id: user._id.toString(),
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            status: "complete"
        };
        return Course.findOne({"sections.section_key": sectionKey, students: {$nin: [studentToAdd.username]}});
    })
    .then(function(course){
        return new Promise((resolve, reject) => {
            if (!course) {
                var error_message = new Error('Student Already in Course');
                reject(error_message);
            }
            else {
                resolve(course);
            }
        });
    })
    .then(function(course){
        courseToJoin = course;
        return Section.findOneAndUpdate(
          { section_key: sectionKey },
          { $addToSet: { students: studentToAdd } },
          { new: true });
    })
    .then(function(section){
        var course_id = courseToJoin._id.toString();
        var section_id = section._id.toString();
        var sect = {
            name: section.name,
            _id: section_id,
            section_key: section.section_key,
            students: section.students
        };
        return Course.update(
           { _id: course_id, "sections._id": section_id },
           { $set: { "sections.$" : sect }, $push: {students: studentToAdd.username} }, {new: true});
    })
    .then(function(data){
        next();
    })
    .catch(function(err){
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};

var deleteStudentFromCourse = function(req, res) {
    console.log('courseController deleteStudentFromCourse');

    var student;

    User.findById(req.params.USERID)
    .exec()
    .then(function(user){
        student = user.username;
        return Section.findOneAndUpdate(
                {_id: req.params.SECTIONID},
                { $pull: { students: { student_id:  req.params.USERID } } },
                {new: true});
    })
    .then(function(section) {
        var section_id = section._id.toString();
        var sect = {
            name: section.name,
            _id: section_id,
            section_key: section.section_key,
            students: section.students
        };
        return Course.findOneAndUpdate(
           { _id: req.params.COURSEID, "sections._id": section_id },
           { $set: { "sections.$" : sect }, $pull: {students: student} }, {new: true});
    })
    .then(function(course){
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'Student Deleted',
            course: course
        });
    })
    .catch(function(err){
        return res.status(400).json({
            success: false,
            message: err.message
        });
    });
};

var getCourse = function(req, res) {
    console.log('courseController getCourse');

    Course.findById(req.params.COURSEID, {"__v": 0})
    .exec()
    .then(function(course){
        return res.status(200).json({
            success: true,
            jwt_token: req.token,
            message: 'Request Success',
            course: course
        });
    })
    .catch(function(err){
        return res.status(404).json({
            success: false,
            message: 'Course Not Found'
        });
    });
};

/*
var getStudentCourses = function(req, res) {
    console.log('courseController getStudentCourses');

    var finalCourses = [];

    Section.aggregate([
      {$match: {"students.student_id": req.decodedToken.sub}},
      {$lookup: {from: "courses", localField: "section_key", foreignField: "sections.section_key", as: "course_info"}}
    ])
    .then(function(sections){
        for (var i = 0; i < sections.length; i++) {
            var tempCourse = sections[i].course_info[0];
            var temp = {
                _id: tempCourse._id.toString(),
                title: tempCourse.title,
                lectures: tempCourse.lectures,
                schedule: tempCourse.schedule,
                instructor: tempCourse.instructor,
                average: 0,
                numOfStudents: tempCourse.students.length,
                section: sections[i].name
            };
            finalCourses.push(temp);
        }
        return res.status(201).json({
            success: true,
            jwt_token: req.token,
            message: 'Request Success',
            courses: finalCourses
        });
    })
    .catch(function(err){
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};
*/

var getUserCourses = function(req, res) {
    console.log('courseController getUserCourses');

    if (req.decodedToken.role === roles.STUDENT) {
        var finalCourses = [];

        Section.aggregate([
          {$match: {"students.student_id": req.decodedToken.sub}},
          {$lookup: {from: "courses", localField: "section_key", foreignField: "sections.section_key", as: "course_info"}}
        ])
        .then(function(sections){
            for (var i = 0; i < sections.length; i++) {
                var tempCourse = sections[i].course_info[0];
                var temp = {
                    _id: tempCourse._id.toString(),
                    title: tempCourse.title,
                    lectures: tempCourse.lectures,
                    schedule: tempCourse.schedule,
                    instructor: tempCourse.instructor,
                    average: 0,
                    numOfStudents: tempCourse.students.length,
                    section: sections[i].name
                };
                finalCourses.push(temp);
            }
            return res.status(201).json({
                success: true,
                jwt_token: req.token,
                message: 'Request Success',
                courses: finalCourses
            });
        })
        .catch(function(err){
            return res.status(404).json({
                success: false,
                message: err.message
            });
        });
    }
    else {
        Course.find({}, {"__v": 0})
        .exec()
        .then(function(courses){
            return res.status(201).json({
                success: true,
                jwt_token: req.token,
                message: 'Request Success',
                courses: courses
            });
        })
        .catch(function(err){
            return res.status(404).json({
                success: false,
                message: 'No Coures Found'
            });
        });
    }
};

var savedCourseToDB = function(req, res) {
    console.log('courseController savedCourseToDB');

    var course_instructor;
    var course_id;
    var updated_course;

    User.findById(req.decodedToken.sub)
    .exec()
    .then(function(user) {
        course_instructor = {
            instructor_id: user._id.toString(),
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            photo: "user.photo"
        };
        var newCourse = new Course({
            title: req.body.title,
            instructor: course_instructor,
            schedule: req.body.course_schedule,
            course_key: rand.generate()
        });
        return newCourse.save();
    })
    .then(function(course) {
        updated_course = course;
        course_id = course._id.toString();
        for (var i = 0; i < req.body.sections.length; i++) {
            req.body.sections[i].section_key = rand.generate();
            req.body.sections[i].course_id = course_id;
        }
        return Section.insertMany(req.body.sections);
    })
    .then(function(sections) {
        return Section.find({"course_id": course_id}, {"__v": 0, "course_id": 0});
    })
    .then(function(sections) {
        for (var i = 0; i < sections.length; i++) {
          var sect = {
              name: sections[i].name,
              _id: sections[i]._id.toString(),
              section_key: sections[i].section_key,
              students: sections[i].students
          };
          //sectionsToSave.push(sect);
          updated_course.sections.push(sect);
        }
        //updated_course.sections = sectionsToSave;
        return updated_course.save();
    })
    .then(function(course){
        return Course.find({'instructor.instructor_id': req.decodedToken.sub});
    })
    .then(function(courses){
        return res.status(201).json({
            success: true,
            jwt_token: req.token,
            message: 'Course Creation Successsful',
            courses: courses
        });
    })
    .catch(function(err) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    });
};

module.exports = {
    deleteStudentFromCourse: deleteStudentFromCourse,
    getCourse: getCourse,
    getUserCourses: getUserCourses,
    instructorAddStudent: instructorAddStudent,
    joinCourse: joinCourse,
    savedCourseToDB: savedCourseToDB,
    updateStudentStatus: updateStudentStatus
};
