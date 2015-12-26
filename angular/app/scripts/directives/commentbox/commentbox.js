'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:commentBox
 * @description
 * # commentBox
 */
angular.module('commentBox', ['commentList', 'commentForm'])
  .directive('commentBox', function ($http) {
    return {
      template: '<div class="commentBox">' +
                  '<h1>Comments</h1>' +
                  '<comment-list comments="data"></comment-list>' +
                  '<comment-form></comment-form>' +
                '</div>',
      restrict: 'E',
      scope: {
        url: '@',
        pollInterval: '@'
      },
      link: function postLink(scope, element, attrs) {
       function get_time_diff( datetime )
       {
       var datetime = new Date( datetime ).getTime();
        var now = new Date().getTime();

       if( isNaN(datetime) )
       {
        return "";
       }


    if (datetime < now) {
        var milisec_diff = now - datetime;
    }else{
        var milisec_diff = datetime - now;
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

    if(days>1) return days+" days ago";
    else if(days===1) return days+" day ago";

    var hours = Math.floor(milisec_diff/ 1000 / 60 / 60);

    if(hours >1) return hours + " hours ago";
    else if(hours ===1) return hours+ "hour ago"

    var minutes = Math.floor(milisec_diff/ 1000 / 60);
    
    if(minutes > 1) return minutes+ " minutes ago";
     else return " 1 minute ago";
   
   }


        var loadCommentsFromServer = function () {
          $http.get(scope.url)
            .success(function(data, status, headers, config){
          
              scope.data = data;
              for (var comment of scope.data){

                //calculate time diff
                comment.lapse= get_time_diff(comment.time);

              }
            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        var handleCommentSubmit = function (event, data) {
          var comment = data;

          //Recode the post time 
          var date = new Date();
          comment.time=date;
          scope.data.concat([comment]);
          $http.post(scope.url, comment)
            .success(function(data, status, headers, config){
              console.log('success')
            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        loadCommentsFromServer();
        setInterval(loadCommentsFromServer, scope.pollInterval);
        scope.$on('submitted', handleCommentSubmit);
      }
  }});
