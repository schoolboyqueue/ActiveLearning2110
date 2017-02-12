/* jshint node: true */

//************************************************************
//  add_students.controller.js                              //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 02/11/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  11Feb17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Add.Students.Controller', function($scope, $localStorage, $stateParams, $rootScope, UserService, NgTableParams, Papa) {

    $rootScope.$stateParams = $stateParams;
    $scope.selectedCSV = null;

    var student_cnts = [];
    var upload_cnts = [];

    if ($stateParams.selectedSection.students.length > 5) {
        student_cnts = [5, 10, 15];
    }

    $scope.student_tableParams = new NgTableParams({
        count: 10
    }, {
        counts: student_cnts,
        dataset: $stateParams.selectedSection.students
    });

    $scope.upload_tableParams = new NgTableParams({
        count: 10
    }, {
        counts: upload_cnts,
        dataset: []
    });

    function sanitizeData(data) {
        var new_data = [];
        for (var key in data) {
            var entry = {};
            var name = data[key]["Name"].split(',');
            entry.lastname = name[0].trim();
            entry.firstname = name[1].trim();
            entry.username = data[key]["Email Address"];
            entry.role = data[key]["Role"];
            entry.userid = data[key]["User ID"];
            new_data.push(entry);
        }
        return new_data;
    }

    $scope.$watch('selectedCSV', function() {
        if ($scope.selectedCSV !== null) {
            Papa.parse($scope.selectedCSV, {header: true, skipEmptyLines: true}).then(
                function(result) {
                    $scope.upload_tableParams.settings().dataset = sanitizeData(result.data);
                    $scope.upload_tableParams.reload();
                    if (result.data.length > 5) {
                        upload_cnts = [5, 10, 15];
                    }
                }
            );
        }
    });
});
