"use strict"

var userRouter = require('./routes/userRouter');

module.exports = function(app) {
    app.use('/user', userRouter);
}
