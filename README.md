social-linker
=============

Angularjs directive that binds scope-driven social buttons! Even includes link shrinker for twitter!

###social-linker v1.0.2

#How to use:
###Requires jQuery.

 1.Include the directive script.
 
 2.Include the module social-linker in your app module.
 
 3.Import and add a socialLinkerOpts object to your rootScope (had to use it to avoid prototypical inheritence issues)
 
 4.Add each of your social objects to the socialLinkerOpts object.

***Like:***

```javascript 
$scope.socialLinkerOpts = { OR $rootScope.socialLinkerOpts = { 
 watch : ["/posts/","/IdontWantIthere/"],
 locationChange : true,
 twitter : {
 title : $scope.title,
 description : $scope.subTitle,
 url : "http://www.awesomesite.com/post/"+$scope.postURL,
 },
 facebook : {
 title : $scope.title,
 description : $scope.subTitle,
 url : "http://www.awesomesite.com/post/"+$scope.postURL,
 image : "http://www.sweetcoolthing.com/image1.png"
 }
}
```

 4.Add the corresponding types and the directive to each of you link elements, like:

```html
<a social-linker social-linker-type="twitter"></a>   
<a social-linker social-linker-type="facebook"></a>
```

 5.Smack a turtle

***Properies***

```watch``` ***ARRAY*** GLOBAL an array of routes you'd like social-linker to update on, leave this out to check ALWAYS

```locationChange``` ***BOOL*** GLOBAL want this to update on route change? No? Make this false.

```title``` ***STRING*** Title of the page to be shared

```description``` ***STRING*** Description of page to be shared

```image``` ***STRING*** an image of what will be shared

```url``` ***STRING*** A link to the page that will be shared

***CURRENT SOCIAL TYPES:***
reddit,facebook,linkedin,twitter,googleplus

***TODO:***

 1. Remove jQuery
 2. Add more Types
 3. Add popup support
 4. Meow Mix
