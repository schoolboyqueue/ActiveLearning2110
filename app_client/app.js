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

app.controller('Main.Controller', function($scope, $http, $localStorage, ModalService, AuthenticationService) {

    var showLogin = function() {
        ModalService.showModal({
            templateUrl: '/app-components/login/login.view.html',
            controller: 'Login.Controller'
        }).then(function(modal) {
            modal.element.modal({
                backdrop: 'static',
                keyboard: false
            });
            modal.close.then(function(result) {
                console.log(result);
            });
        });
    };

    if ($localStorage.currentUser && !AuthenticationService.Expired($localStorage.currentUser.token)) {
        $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
    } else {
        AuthenticationService.Logout(false);
        showLogin();
    }
});
