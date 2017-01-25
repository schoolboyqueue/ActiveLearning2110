/* jshint node: true */

//************************************************************
//  profile.controller.js                                   //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/15/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  15Jan17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Profile.Controller', function($scope, $element, $localStorage, UserService) {
    $scope.edit = false;
    $scope.loading = false;
    $scope.title = 'Profile';
    $scope.editTitle = 'Edit Profile';
    $scope.email = $localStorage.email;
    $scope.role = $localStorage.role;
    $scope.photo = $localStorage.photo;
    $scope.selectedPhoto = '';
    $scope.croppedPhoto = '';
    $scope.firstname = $localStorage.firstname;
    $scope.lastname = $localStorage.lastname;
    $scope.password = null;
    $scope.passwordVerify = null;

    $scope.editProfile = function() {
        $scope.edit = !$scope.edit;
        $scope.editTitle = $scope.editTitle === 'Edit Profile' ? 'Save Changes' : 'Edit Profile';
    };

    $scope.resImgFormat = 'image/jpeg';
    $scope.selMinSize = 100;
    $scope.selInitSize = [{
        w: 200,
        h: 80
    }];
    $scope.resImgSize = [{
        w: 200,
        h: 150
    }, {
        w: 300,
        h: 200
    }];
});

app.directive("fileread", [function() {
    return {
        scope: {
            fileread: "="
        },
        link: function(scope, element, attributes) {
            element.on("change", function(changeEvent) {
                var reader = new FileReader();
                reader.onload = function(loadEvent) {
                    scope.$apply(function() {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);

app.directive('verifypass', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                var valid = false;
                if (value) {
                    valid = value === scope.password;
                    ctrl.$setValidity('invalidEqPass', valid);
                }
                return valid ? value : undefined;
            });
        }
    };
});
