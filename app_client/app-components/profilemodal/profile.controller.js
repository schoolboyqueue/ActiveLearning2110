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
    $scope.croppedPhoto = '';
    $scope.title = 'Profile';

    var img = new Image();
    img.onload = imageToDataUri;
    $scope.$watch('selectedPhoto', function() {
        img.src = $scope.selectedPhoto;
    });

    $scope.editProfile = function() {
        if ($scope.editTitle === 'Edit Profile') {
            $scope.editTitle = 'Save Changes';
            $scope.firstname = $localStorage.firstname;
            $scope.lastname = $localStorage.lastname;
        } else {
            $scope.selectedPhoto = '';
            $scope.croppedPhoto = '';
            $scope.editTitle = 'Edit Profile';
            $scope.firstname = '';
            $scope.lastname = '';
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

    function imageToDataUri() {

        var ratio = Math.min(400 / this.width, 300 / this.height);

        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

        canvas.width = this.width*ratio;
        canvas.height = this.height*ratio;

        ctx.drawImage(this, 0, 0, this.width*ratio, this.height*ratio);

        $scope.croppedPhoto = canvas.toDataURL('image/jpeg', 0.7);
    }
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
                        element.val(null);
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);
