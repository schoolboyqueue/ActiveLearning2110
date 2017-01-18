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
//  14Jan16     J. Carter  Implemented local storage for    //
//                          data persistance.               //
//************************************************************

var app = angular
    .module('app', [
        'ui.router',
        'ngMessages',
        'ngStorage',
        'angularModalService',
        'angular-jwt',
        'oc.lazyLoad'
    ]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ocLazyLoadProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    $ocLazyLoadProvider.config({
        'debug': true, // For debugging 'true/false'
        'events': true, // For Event 'true/false'
        'modules': [{ // Set modules initially
            name : 'dashboard', // Dashboard
            files: ['app-components/navbar/navbar.controller.js',
                    'app-components/sidebar/sidebar.controller.js',
                    'app-components/dashboard/dashboard.controller.js']
        }]
    });

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
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('dashboard');
                }]
            }
        });
});

app.controller('Main.Controller', function($scope, $http, $localStorage, $rootScope, AuthenticationService, UserService) {

    // All user info once fetched will be stored in local storage. now any of the other controllers can access user info
    // by using $storage.<field>. Ex: to get the user's e-mail do -> $storage.email

    $scope.$storage = $localStorage;

    if (!$scope.$storage.hideSidebar) {
        $scope.$storage.hideSidebar = false;
    }

    if (AuthenticationService.LoggedIn()) {
        $http.defaults.headers.common.Authorization = $localStorage.token;
    } else {
        AuthenticationService.Logout();
        UserService.ShowLogin();
    }
});
