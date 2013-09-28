social-linker
=============

Angularjs directive that binds scope-driven social buttons! Even includes link shrinker for twitter!



#How to use:
***Requires jQuery. :-( ***

 1.Include the module social-linker in your app module.
 2.Import and add a socialLinkerOpts object to your rootScope (had to use it to avoid prototypical inheritence issues)
 3.Add each of your social objects to the socialLinkerOpts object.

***Like:***

```javascript $rootScope.socialLinkerOpts = {
 twitter : {
 title : $scope.title,
 description : $scope.subTitle,
 url : "http://www.awesomesite.com/post/"+$scope.postURL,
 },
 
 facebook : {
 title : $scope.title,
 description : $scope.subTitle,
 url : "http://www.awesomesite.com/post/"+$scope.postURL,
 }
 }```

4. Add the corresponding types and the directive to each of you link elements, like:

 ```html <a social-linker social-linker-type="twitter"></a>   
 <a social-linker social-linker-type="facebook"></a>```

5. Smack a turtle


***CURRENT SOCIAL TYPES:***
reddit,facebook,linkedin,twitter,googleplus

***TODO:***

 1. Remove jQuery
 2. Add more Types
 3. Add popup support
 4. Meow Mix
