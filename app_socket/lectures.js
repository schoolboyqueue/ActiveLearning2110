/* jshint node: true */
/* jshint esversion: 6 */

//************************************************************
//  socketEvents.js                                         //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/18/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  01Apr17     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var config = require('./../config'),
    Lecture = require('./../app_api_v2/models/lectureModel'),
    LiveLecture = require('./../app_api_v2/models/liveLectureModel'),
    Question = require('./../app_api_v2/models/questionModel');

exports = module.exports = function(io) {
    var lectures = io.of('/lectures').on('connection', function(socket) {
        console.log('Connection made');

        socket.on('lookup_lectures', function() {
            LiveLecture.find({}, {
                    lecture_id: 1
                })
                .exec()
                .then(function(live_lectures) {
                    var updated_lectureList = live_lectures.map(function(a) {
                        return a.lecture_id;
                    });
                    console.log(updated_lectureList);
                    socket.emit('lectures_update', JSON.stringify(updated_lectureList));
                })
                .catch(function(err) {
                    socket.emit('lectures_update', 'there seems to be a problem');
                });
        });

        socket.on('start_lecture', function(lecture_id) {
            console.log('start_lecture ' + lecture_id);
            var newLiveLecture = new LiveLecture({
                lecture_id: lecture_id,
                instructor_socket: socket.id,
            });

            newLiveLecture.save()
                .then(function(live_lecture) {
                    return Lecture.update({
                        _id: lecture_id
                    }, {
                        $set: {
                            live: true
                        }
                    });
                })
                .then(function(lecture) {
                    return LiveLecture.find({}, {
                        lecture_id: 1,
                        _id: 0
                    });
                })
                .then(function(live_lectures) {
                    var updated_lectureList = live_lectures.map(function(a) {
                        return a.lecture_id;
                    });
                    console.log(updated_lectureList);
                    lectures.emit('lectures_update', JSON.stringify(updated_lectureList));
                })
                .catch(function(err) {
                    lectures.emit('lectures_update', 'could not add lecture');
                });
        });

        socket.on('end_lecture', function(lecture_id) {
            clearRoom(lecture_id);
        });

        socket.on('join_lecture', function(data) {
            LiveLecture.findOne({
                    lecture_id: data.lecture_id
                }, {
                    instructor_socket: 1,
                    current_question: 1
                })
                .exec()
                .then(function(live_lecture) {
                    socket.instructor_socket = live_lecture.instructor_socket;
                    socket.username = data.username;
                    socket.user_id = data.user_id;
                    socket.role = data.user_role;
                    socket.lecture_id = data.lecture_id;
                    socket.join(data.lecture_id);
                    console.log('joining: ' + data.lecture_id);
                    if (live_lecture.current_question) {
                        console.log('emitting question that has already started');
                        socket.emit('question_feed', live_lecture.current_question);
                    }
                    emitUserNumer(data.lecture_id);
                });
        });

        // reference: http://stackoverflow.com/questions/39880435/make-specific-socket-leave-the-room-is-in
        socket.on('leave_lecture', function(data) {
            socket.leave(data.lecture_id);
            emitUserNumer(data.lecture_id);
        });

        socket.on('new_question', function(data) {
            console.log('question:' + JSON.stringify(data));
            Question.findById(data.question_id, {
                    "__v": 0,
                    "answer_choices.answer": 0
                })
                .exec()
                .then(function(question) {
                    data.question = question;
                    return LiveLecture.update({
                        lecture_id: socket.lecture_id
                    }, {
                        $set: {
                            current_question: data
                        }
                    });
                })
                .then(function(results) {
                    socket.broadcast.to(socket.lecture_id).emit('question_feed', data);
                })
                .catch(function(err) {
                    socket.emit('question_feed', 'error');
                });
        });

        socket.on('end_question', function() {
            LiveLecture.update({
                    lecture_id: socket.lecture_id
                }, {
                    $set: {
                        current_question: undefined
                    }
                })
                .exec()
                .then(function(results) {
                    socket.broadcast.to(socket.lecture_id).emit('end_question');
                });
        });

        socket.on('new_time', function(data) {
            console.log('time changed');
            LiveLecture.findOne({
                    lecture_id: socket.lecture_id
                }, {
                    current_question: 1
                })
                .exec()
                .then(function(liveLecture) {
                    /*
                    var question = {

                    }
                    liveLecture.current_question.question.end_time = data.time;
                    return liveLecture.save();
                    */
                    var updatedQuestion = liveLecture.current_question;
                    updatedQuestion.end_time = data.time;
                    updatedQuestion.max_time = data.timeMax;
                    return LiveLecture.update({
                        lecture_id: socket.lecture_id
                    }, {
                        $set: {
                            current_question: updatedQuestion
                        }
                    });
                })
                .then(function(results) {
                    socket.broadcast.to(data.lecture_id).emit('new_end', data);
                })
                .catch(function(err) {

                });
        });

        socket.on('answer_question', function(data) {
            Question.find({
                    _id: data.question_id
                }, {
                    answer_choices: {
                        $elemMatch: {
                            text: data.answer
                        }
                    },
                    title: 0,
                    html_title: 0,
                    html_body: 0,
                    copied: 0,
                    tags: 0,
                    __v: 0
                })
                .exec()
                .then(function(question) {
                    if (question[0].answer_choices[0].answer === true) {
                        console.log('answer correct');
                        //answer is correct, emit to student they scored correctly
                        socket.emit('answer_result', true);
                    } else {
                        console.log('answer wrong');
                        //answer is wrong, emit to student they scored incorrectly
                        socket.emit('answer_result', false);
                    }
                    //emit to instructor the updated stats
                    socket.broadcast.to(socket.instructor_socket).emit('new_answer', data.answer);
                })
                .catch(function(err) {
                    socket.emit('answer_result', 'error');
                });
        });

        socket.on('disconnect', function() {
            console.log("user disconnected: " + socket.username);
            if (socket.username) {
                if (socket.role === 'instructor') {
                    clearRoom(socket.lecture_id);
                } else {
                    emitUserNumer(socket.lecture_id);
                }
            }
        });

        //reference: http://stackoverflow.com/questions/9352549/getting-how-many-people-are-in-a-chat-room-in-socket-io#24425207
        function emitUserNumer(lecture) {
            var users = io.nsps['/lectures'].adapter.rooms[lecture];
            if (users) {
                console.log(users.length);
                socket.broadcast.to(socket.instructor_socket).emit('updated_user_total', users.length);
            }
        }

        //reference: http://stackoverflow.com/questions/39880435/make-specific-socket-leave-the-room-is-in
        function clearRoom(lecture) {
            var roomObj = io.nsps['/lectures'].adapter.rooms[lecture];
            if (roomObj) {
                console.log('clearing room');
                Object.keys(roomObj.sockets).forEach(function(id) {
                    lectures.sockets[id].leave(lecture);
                });
            }
            endLecture(lecture);
        }

        function endLecture(lecture_id) {
            console.log('end_lecture ' + lecture_id);

            LiveLecture.remove({
                    lecture_id: lecture_id
                })
                .then(function(data) {
                    return Lecture.update({
                        _id: lecture_id
                    }, {
                        $set: {
                            live: false
                        }
                    });
                })
                .then(function(lecture) {
                    return LiveLecture.find({}, {
                        lecture_id: 1
                    });
                })
                .then(function(live_lectures) {
                    var updated_lectureList = Object.values(live_lectures);
                    lectures.emit('lectures_update', JSON.stringify(updated_lectureList));
                })
                .catch(function(err) {
                    lectures.emit('lectures_update', 'could not add lecture');
                });
        }
    });
};
