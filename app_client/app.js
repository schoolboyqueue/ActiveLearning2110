/* jshint node: true */

//************************************************************
//  app.js                                                  //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/11/16.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  11Jan16     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular
    .module('app', [
        'ui.router',
        'ngMessages',
        'ngStorage',
        'angularModalService',
        'angular-jwt'
    ]);

app.config(function($stateProvider, $urlRouterProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    // app state and individual views
    $stateProvider
        .state('dashboard', {
            url: '/',
            views: {
                'navbar': {
                    templateUrl: 'app-components/navbar/navbar.view.html',
                    controller: 'Navbar.Controller',
                },
                'sidebar': {
                    templateUrl: '/app-components/sidebar/sidebar.view.html',
                    controller: 'Sidebar.Controller',
                },
                'dashboard': {
                    templateUrl: '/app-components/dashboard/dashboard.view.html',
                    controller: 'Dashboard.Controller',
                }
            }
        });
});

app.controller('Main.Controller', function($scope, $http, $localStorage, $rootScope, AuthenticationService, UserService) {

    // All user info once fetched will be stored in local storage. now any of the other controllers can access user info
    // by using $storage.<field>. Ex: to get the user's e-mail do -> $storage.email

    $rootScope.app = {
        loaded: false
    };

    $scope.$storage = $localStorage;

    if (!$scope.$storage.hideSidebar) {
        $scope.$storage.hideSidebar = false;
    }

    if ($localStorage.token && !AuthenticationService.Expired($localStorage.token)) {
        $http.defaults.headers.common.Authorization = $localStorage.token;
    } else {
        AuthenticationService.Logout(false);
        $rootScope.$on('$includeContentLoaded', function() {
            showLogin();
        });
    }
});
