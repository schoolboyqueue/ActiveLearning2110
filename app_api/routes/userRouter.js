"use strict"

var express = require('express');

var useRouter = express.Router();

useRouter.route('')
    .get(function (req, res) {
        res.send('list of user');
    });

module.exports = useRouter;
