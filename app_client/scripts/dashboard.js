$(document).ready(function()
{
    $('.navbar-toggle').click(function()
    {
        $(this).toggleClass('collapsed');
    });
});

var app = angular.module('ActiveLearning', []);

app.controller('dashController', function($scope, $http)
{
    var dash = this;
    var userID = $('.userID').attr('value');
    dash.courses = [];
    $http.get('users/' + userID + '/courses')
        .then(
            function(response)
            {
                response.data.courses.forEach(function(element)
                {
                    dash.courses.push(element.title);
                });
            },
            function(response)
            {
                console.log('Error: ' + response);
            }
        );
    // $scope.getData = function()
    // {
    //     $http.get('/tags')
    //      .then(
    //          function(response)
    //          {
    //              main.hashtags = response.data;
    //          },
    //          function(response)
    //          {
    //              console.log('Error: ' + response);
    //          }
    //       );
    //   };
    // $scope.getData();
    // setInterval($scope.getData, 15 * 1000);
});
