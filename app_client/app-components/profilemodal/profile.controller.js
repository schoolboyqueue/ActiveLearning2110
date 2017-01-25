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
    $scope.croppedPhoto = '';
    $scope.edit = false;
    $scope.editTitle = 'Edit Profile';
    $scope.email = $localStorage.email;
    $scope.loading = false;
    $scope.newPassword = null;
    $scope.password = null;
    $scope.photo = $localStorage.photo;
    $scope.role = $localStorage.role;
    $scope.firstnamePh = $localStorage.firstname;
    $scope.lastnamePh = $localStorage.lastname;
    $scope.selectedPhoto = '';
    $scope.title = 'Profile';

    $scope.editProfile = function() {
        if ($scope.editTitle === 'Edit Profile') {
            $scope.editTitle = 'Save Changes';
            $scope.firstname = $localStorage.firstname;
            $scope.lastname = $localStorage.lastname;
        } else {
            $scope.editTitle = 'Edit Profile';
            $scope.firstname = '';
            $scope.lastname = '';
            $scope.selectedPhoto = '';
        }
        $scope.edit = !$scope.edit;
    };

    $scope.closeProfile = function() {
        if ($scope.edit) {
            $scope.editProfile();
        } else {
            $element.modal('hide');
        }
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
