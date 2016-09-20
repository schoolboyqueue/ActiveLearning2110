/* jshint node: true */

"use strict";

module.exports = function(app) {
    /**
    Respond to GET request

    - parameter PATH:       SPA route
    - parameter HANDLER:    callback
    */
    app.get('*', function(req, res){
        res.send('hello team 2B||!2B from app_client');
    });
};
