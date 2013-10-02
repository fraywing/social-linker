/*
* Social Linker
* Author: Austin Anderson
* License: MIT
*
*UPDATE 10/1/2013
*added watch global param, which will watch route changes to limit when the buttons are updated. Abtaining from watch will cause an update on ALL route changes
*added check for both $scope and $rootScope to find socialLinkerOpts
*
*How to use:
*Requires jQuery.
*
* 1.Inlude the module social-linker in your app module.
* 2.Import and add a socialLinkerOpts object to your rootScope (had to use it to avoid prototypical inheritence issues)
* 3.Add each of your social objects to the socialLinkerOpts object. 
*
* Like:
*
* $scope.socialLinkerOpts = { OR $rootScope.socialLinkerOpts = { 
*   watch : ['/posts'/],
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
}
*
*4. Add the corresponding types and the directive to each of you link elements, like:
*
*  <div social-linker social-linker-type="twitter"></div>
*   <div social-linker social-linker-type="facebook"></div>
*
*5. Smack a turtle
*
*
*CURRENT SOCIAL TYPES:
*reddit,facebook,linkedin,twitter,googleplus
*
*TODO:
*
* 1. Remove jQuery
* 2. Add more Types
* 3. Add popup support
* 4. Meow Mix
*/

directives.directive('socialLinker', function($location,$timeout,$rootScope,$http,$q){
    var methods = {
	linkedin : function(title,desc,image,url){
	   var title = !!!title ? "" : "&title="+encodeURIComponent(title),
	     desc = !!!desc ? "" : "&summary="+encodeURIComponent(desc),
	     url = !!!url ? "" : "&url="+url;

	     return "http://www.linkedin.com/shareArticle?mini=true"+url+title+desc;
	},
	facebook : function(title,desc,image,url){
	    var title = !!!title ? "" : "&p[title]="+encodeURIComponent(title),
	     desc = !!!desc ? "" : "&p[summary]="+encodeURIComponent(desc),
	     image = !!!image ? "" : "&p[image][o]="+image,
	     url = !!!url ? "" : "&p[url]="+url;
	     
	     return "http://www.facebook.com/sharer/sharer.php?s=100"+url+image+title+desc;
	},
	twitter : function(title,desc,image,url){
	    var title = !!!title ? "" : title,
	     url = !!!url ? "" : url;
	     var def = $q.defer();
	     //uses safe.mn as the URL shortener
	       $http.jsonp("http://safe.mn/api/shorten/",{params: {url : url,"format" : "jsonp", callback : "JSON_CALLBACK"				}})
	     .success(function(data){
		var url = "http://www.twitter.com/intent/tweet?text="+encodeURIComponent(title+" "+data.url);
		def.resolve(url);
		});
	     
	     return def.promise;
	},
	reddit : function(title,desc,image,url){
	    var title = !!!title ? "" : encodeURIComponent(title),
	     url = !!!url ? "" : url;
	     
	     return "http://www.reddit.com/submit?url="+url+"&title="+title;
	},
	pintrest : function(title,desc,image,url){
	    var title = !!!title ? "" : encodeURIComponent(title),
	     desc = !!!desc ? "" : encodeURIComponent(desc),
	     image = !!!image ? "" : image,
	     url = !!!url ? "" : url;
	     
	    return "http://pinterest.com/pin/create/bookmarklet/?media="+image+"&url="+url+"&is_video=false&description="+desc;
	},
	googleplus : function(title,desc,image,url){
	    var url = !!!url ? "" : url;
	    return "https://plus.google.com/share?url="+url; 
	},
	populate : function(el,response,lightbox){
	    if (lightbox) {
		$(el).click(function(e){
			e.preventDefault();
			methods.lightbox(response);
		    });
	    }else{
	    el[0].href = response;
	    }
	},
	goodPath : function(watch,path){
	    if (watch == true) {
		//check on every route change
		return true;
	    }
	    var goodPath = false;
	    for(var x in watch){
		 var escapedQuery = watch[x].replace(/\//g, "\\/"),
			    escapedPath =  path;
			    var pattern = new RegExp(escapedQuery,'g');
			    if (pattern.test(escapedPath)){
				goodPath = true;
			    }
			    else{
				goodPath = false;
			    }
		}
	    return goodPath;
	}
	/*,
	lightbox : function(url){ //cross framing blocked...duh
	    console.log(url);
	    var iframe = "<iframe src='"+url+"' style='height:400px; width:500px;'></iframe>",
	    lbox = "<div style='position:absolute; top:5%; left:50%;'> <div style='position:relative; background:red; z-index:9999; left:-50%; width:500px; height:400px;'>"+iframe+"</div><div>"
	    $("body").append(lbox+"<div class='social-linker-background' style='width:100%;z-index:9998;height:100%;position:fixed;left:0px;top:0px;background:rgba(2,2,2,0.5);'></div>")
	}*/

    };
    
    return {
	restrict : "A",
	scope : {
	    $locationChangeStart: "@",
	    $viewContentLoaded : "@"
	    },
	link : function(scope,el,attr){
	    var obName = attr.socialLinkerType;
	    //rootscope check
	    $rootScope.$watch("socialLinkerOpts."+obName+".url", function(){
		if (!!!$rootScope.socialLinkerOpts) {
		    return false;
		}
		run(); });
	    //scope check
	    scope.$watch("socialLinkerOpts."+obName+".url", function(){
		if (!!!scope.socialLinkerOpts) {
		    return false;
		}
		run(); });
	    
	    function run(){
		if (!!!scope.socialLinkerOpts && !!!$rootScope.socialLinkerOpts) {
		    console.log("Social Linker Options Not Found!");
		    return false;
		}
		var locationChange = $rootScope["socialLinkerOpts"].locationChange,
		watch =  !!!$rootScope["socialLinkerOpts"].watch ? true : $rootScope["socialLinkerOpts"].watch,
		//lightbox = !!!$rootScope["socialLinkerOpts"] && $rootScope["socialLinkerOpts"] != true ? false : true;
		lightbox = false,
		goodPath = methods.goodPath(watch,$location.path()),
		opts = $rootScope["socialLinkerOpts"][obName];

		if (locationChange && goodPath) {
		    scope.$on('$locationChangeStart',function(scope,next,current){
			    if (methods.goodPath(watch,$location.path())) {
				doCheck();	
			    }	
			});
			    //do the check anyway on directive load
			doCheck();	
		}
		function doCheck() {
		    var nOp = $rootScope["socialLinkerOpts"][obName];
	
			var title = !!!nOp.title ? "" : nOp.title,
		        desc = !!!nOp.description ? "" : nOp.description,
		    	image = !!!nOp.image ? "" : nOp.image,
			url = !!!nOp.url ? "" : nOp.url;
			var response = methods[obName](title,desc,image,url);
			if (angular.isObject(response)) {
			    response.then(function(data){
			    methods.populate(el,data,lightbox);
				});
			}else{
			    methods.populate(el,response,lightbox);
			}
		}
	    };
	}
    }
    
    });