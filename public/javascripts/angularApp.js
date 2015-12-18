var app = angular.module("sqkii" , ['ui.router', 'ezfb']);
var pathPrefix = '/api';
		
app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'ezfbProvider',
	function($stateProvider, $urlRouterProvider, ezfbProvider) {
		ezfbProvider.setInitParams({'appId':433904336805084});
		$stateProvider
			.state('fblogin', {
				url	:	'/fblogin',
				templateUrl	:	'/fblogin.html',
				controller	:	'AuthCtrl',
				onEnter	:	['$state', 'auth', function($state, auth) {
					if(auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})
			.state('login', {
				url	:	'/login',
				templateUrl	:	'/login.html',
				controller	:	'AuthCtrl',
				onEnter	:	['$state', 'auth', function($state, auth) {
					if(auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})
			.state('register', {
				url	:	'/register',
				templateUrl	:	'/register.html',
				controller	:	'AuthCtrl',
				onEnter	:	['$state', 'auth', function($state, auth) {
					if(auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})
			.state('home', {
				url	:	'/home',
				templateUrl	:	'/home.html',
				controller	:	'CheesesCtrl',
				resolve		:	{
					postPromise	:	['cheeses', function(cheeses) {
						return cheeses.getAllPopulated();
					}]
				}
			})
			.state('jobs', {
				url	:	'/jobs',
				templateUrl	:	'/jobs.html',
				controller	:	'DiscoverCtrl',
				resolve		:	{
					postPromise	:	['cheeses', function(cheeses) {
						//control and filter using this to save memory
						return cheeses.getAllPopulated();
					}]
				}
			})
			.state('resumes', {
				url	:	'/resumes',
				templateUrl	:	'/resumes.html',
				controller	:	'DiscoverCtrl',
				resolve		:	{
					postPromise	:	['cheeses', function(cheeses) {
						//control and filter using this to save memory
						return cheeses.getAllPopulated();
					}]
				}
			})
			.state('cheese', {
				url	:	'/cheese/{id}',
				templateUrl	:	'/cheese.html',
				controller	:	'CheeseCtrl',
				resolve		:	{
					cheese	:	['$stateParams', 'cheeses', function($stateParams, cheeses) {
						return cheeses.get($stateParams.id);
					}]
				}
			})
			.state('discover', {
				url	:	'/discover',
				templateUrl	:	'/discover.html',
				controller	:	'DiscoverCtrl',
				resolve		:	{
					postPromise	:	['cheeses', function(cheeses) {
						//control and filter using this to save memory
						return cheeses.getAllPopulated();
					}]
				}
			})
			.state('search', {
				url	:	'/search',
				templateUrl	:	'/search.html',
				controller	:	'SearchCtrl'
			})
			.state('me', {
				url	:	'/me',
				templateUrl	:	'/me.html',
				controller	:	'UserCtrl',
				resolve		:	{
					user	:	['auth', 'users', function(auth, users) {
						return users.get(auth.currentUser()._id);
					}]
				}
			})
			.state('user', {
				url	:	'/user/{id}',
				templateUrl	:	'/user.html',
				controller	:	'UserCtrl',
				resolve		:	{
					user	:	['$stateParams', 'users', function($stateParams, users) {
						return users.get($stateParams.id);
					}]
				}
			})
			.state('users', {
				url	:	'/users',
				templateUrl	:	'/users.html',
				controller	:	'UsersCtrl',
				resolve		:	{
					postPromise	:	['users', function(users) {
						//control and filter using this to save memory
						return users.getAll();
					}]
				}
			})
			.state('posts', {
				url	:	'/posts/{id}',
				templateUrl	:	'/posts.html',
				controller	:	'PostsCtrl',
				resolve		:	{
					post	:	['$stateParams', 'posts', function($stateParams, posts) {
						return posts.get($stateParams.id);
					}]
				}
			});
		
		$urlRouterProvider.otherwise('home');
	}
	
]);

app.controller('NavCtrl', [
	'$scope',
	'auth',
	function($scope, auth) {
		
		$scope.isLoggedIn = auth.isLoggedIn;	
		
		
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
	}
]);

app.controller("AuthCtrl", [
	'$scope',
	'$state',
	'auth',
	'ezfb',
	'users',
	function($scope, $state, auth, ezfb, users) {
		$scope.user = {};
		$scope.currentUser = auth.currentUser;
		
		$scope.register = function() {
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		}
		
		$scope.logIn = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		}
		
		$scope.fbLogIn = function() {
			auth.fbLogIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function(){
				
				$state.go('home');
			});
		}
		
		$scope.fblogin2 = function () {
			/**
			 * Calling FB.login with required permissions specified
			 * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
			 */
			ezfb.login(function (res) {
			  /**
			   * no manual $scope.$apply, I got that handled
			   */
				if (res.authResponse) {
					updateLoginStatus(updateApiMe);					
				}
			}, {scope: 'email,user_likes'});
		};

		$scope.logout = function () {
			/**
			* Calling FB.logout
			* https://developers.facebook.com/docs/reference/javascript/FB.logout
			*/
			ezfb.logout(function () {
				updateLoginStatus(updateApiMe);
			});
		};

		$scope.share = function () {
			ezfb.ui(
				{
					method: 'feed',
					name: 'angular-easyfb API demo',
					picture: 'http://plnkr.co/img/plunker.png',
					link: 'http://plnkr.co/edit/qclqht?p=preview',
					description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' + ' Facebook integration in AngularJS made easy!' + ' Please try it and feel free to give feedbacks.'
				},
				function (res) {
					// res: FB.ui response
				}
			);
		};

		/**
		* For generating better looking JSON results
		*/
		var autoToJSON = ['loginStatus', 'apiMe']; 
		angular.forEach(autoToJSON, function (varName) {
			$scope.$watch(varName, function (val) {
				$scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
			}, true);
		});

		/**
		* Update loginStatus result
		*/
		function updateLoginStatus (more) {
			ezfb.getLoginStatus(function (res) {
				$scope.loginStatus = res;
	
				(more || angular.noop)();
			});
		}

		/**
		* Update api('/me') result
		*/
		function updateApiMe () {
			ezfb.api('/me?fields=email,id,name', function (res) {
				$scope.apiMe = res;
			}).then(function(){
				var user = {
					facebook	:	{
						id		:	$scope.apiMe.id,
						email	:	$scope.apiMe.email,
						name	:	$scope.apiMe.name
					},
					name		:	$scope.apiMe.name					
				};
				
				auth.fbLogIn(user).success(function(res){
					$state.go('home');
				});
			});
		}
	}
]);

app.controller("UsersCtrl", [
	'$scope',
	'$state',
	'auth',
	'users',
	function($scope, $state, auth, users) {
		$scope.currentUser = auth.currentUser;
		$scope.users = users.users;
		
		$scope.refreshUser = function() {
			//return user.get($scope.currentUser);
		}
	}
]);

app.controller("UserCtrl", [
	'$scope',
	'$state',
	'auth',
	'users',
	'user',
	function($scope, $state, auth, users, user) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.user = user;
		
	}
]);

app.controller("MainCtrl", [
	
	'$scope',
	'auth',
	'posts',
	function($scope, auth, posts) {
		$scope.test 	= 'Hello World';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.posts 	= posts.posts;
		
		$scope.generatePost = function(){
			$scope.posts.push({title:'computer', link:'localhost', upvotes:0,comments	:	[
						{
							author	:	'jan',
							body	:	'Awesome post!',
							upvotes	:	0
						},
						{
							author	:	'ben',
							body	:	'hey hey ~',
							upvotes	:	0
						},
					]});
		}
		
		$scope.addPost = function() {
			if(!$scope.title || $scope.title === '') {return;}
			
			posts.create(auth.currentUser()._id, {
				title	:	$scope.title,
				link	:	$scope.link
			});
			
			$scope.title	= '';
			$scope.link	= '';
		}
		
		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		}
	}
]);

app.controller("PostsCtrl", [
	'$scope',
	'auth',
	'posts',
	'post',
	function($scope, auth, posts, post) {		
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.post = post;
	
		$scope.addComment = function(){
			if(!$scope.body || $scope.body === '') {return;}
	
			posts.addComment(post, auth.currentUser()._id, {
				body	:	$scope.body,
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
			$scope.body	=	'';
		};
		
		$scope.incrementUpvotes = function(comment) {
			posts.upvoteComment(post, comment);
		}
	}
]);

app.controller("CheesesCtrl", [
	'$scope',
	'auth',
	'cheeses',
	function($scope, auth, cheeses) {	
		$scope.test 	= 'Hello World';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.cheeses 	= cheeses.cheeses;
		$scope.orderProp	= 'date.left';
		$scope.reverse	= false;
		
		$scope.generateCheese = function(){
			$scope.cheeses.push(
				{
					title 		: 'Timberrrr',
					description	: 'Style yourself with Timberland - $58 off with a $300 spend! Get more with your purchase from now till 12 March.',
					enddate		: 1394582400000,
					startdate 	: 1394150400000,
					advertiser 	: 123,
					creator 	: 123,
					boughtimpre : 500,
					discover 	: 1,
					status		: 1,
					numimpre 	: 500,
					numviewed 	: 420,
					remainingimpre 	: 400,
					targetgender 	: 'both',
					targetmaxage 	: 100,
					targetminage 	: 0,
					imageurl 	: 'https://s3-ap-southeast-1.amazonaws.com/sqkii-uploads/4-74b2dfb2-b7a8-4a41-aa77-f19dc7cdbbb8.jpg',
					thumburl 	: 'https://s3-ap-southeast-1.amazonaws.com/sqkii-uploads/thumb-4-74b2dfb2-b7a8-4a41-aa77-f19dc7cdbbb8.jpg'
				}
			);
		}
		
		$scope.incrementUpvotes = function(cheese) {
			cheeses.upvote(cheese);
		}
		
		
		$scope.queryCheese = function(query) {
			return "oi";
		}
		
		$scope.timeLeft = function(cheese) {
			var milliseconds = parseInt(cheese.date.left);
			
			// take away the miliseconds
			var seconds = parseInt(milliseconds / 1000);
			if(seconds < 1) {
				return "just ended";
			} else {
				// take away the seconds
				var minutes = parseInt(seconds / 60);
				if(minutes < 1) {
					return (seconds % 60) + "s!";
				} else {
					// take away the minutes
					var hours = parseInt(minutes / 60);
					if(hours < 1) {
						return (minutes % 60) + " mins!";
					} else {
						// take away the hours
						var days = parseInt(hours / 24);
						if(days < 1) {
							return (hours % 24) + " hrs";
						} else {
							// take away the days 
							var months = parseInt(days / 30);
							if(months < 1) {
								return (days % 30) + " days";
							} else {
								return (months + " months");
							}
						}
					}
				}
			}	
		}
	}
]);

app.controller("CheeseCtrl", [
	'$scope',
	'auth',
	'cheeses',
	'cheese',
	'ezfb',
	function($scope, auth, cheeses, cheese, ezfb) {		
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.cheese = cheese;
		$scope.validatedDate = new Date();
		
		$scope.addComment = function(){
			if(!$scope.comment || $scope.comment === '') {return;}
	
			var data = {
				comment	:	$scope.comment,
				user	:	auth.currentUser()._id,
				username:	auth.currentUser().name
			}
			cheeses.comment(cheese, auth.currentUser()._id, data );
			$scope.comment	=	'';
		};
		
		$scope.incrementUpvotes = function() {
			cheeses.upvote(cheese);
		}
		
		$scope.like = function() {
			if(auth.isLoggedIn()) {
				cheeses.like(cheese, auth.currentUser()._id);
			}
		}

		$scope.shareCheese = function () {
			ezfb.ui(
				{
					method: 'feed',
					name: cheese.title,
					picture: cheese.thumburl,
					link: cheese.link,
					description: cheese.description
				},
				function (res) {
					// res: FB.ui response
					console.log(res);
					cheeses.share(cheese, auth.currentUser()._id);
				}
			);
		};

		
		$scope.validateCheese = function(){
			if(!$scope.validatedDate || $scope.validatedDate === '') {return;}	
			
			var data = {
				comment	:	$scope.validateComment,
				user	:	auth.currentUser()._id,
				username:	auth.currentUser().name,
				validatedAt : $scope.validatedDate

			}
			
			cheeses.validate(cheese, auth.currentUser()._id, data );
			$scope.validatedDate	=	'';
		};
	}
]);

app.controller("DiscoverCtrl", [
	'$scope',
	'auth',
	'cheeses',
	function($scope, auth, cheeses) {	
		$scope.test 	= 'Discover Great Cheese';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.cheesesList 	= cheeses.cheeses;
		$scope.orderProp	= 'title';
		$scope.reverse	= false;
		
		$scope.incrementUpvotes = function(cheese) {
			cheeses.upvote(cheese);
		}
		
	}
]);

app.controller("SearchCtrl", [
	'$scope',
	'auth',
	'cheeses',
	function($scope, auth, cheeses) {	
		$scope.test 	= 'Search for Great Cheese';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.orderProp	= 'title';
		$scope.reverse	= false;
		$scope.searchedCheeses 	= [];
		
		$scope.queryCheese = function(query) {

		}
		
	}
]);


app.factory('auth', ['$http', '$window', 'ezfb', function($http, $window, ezfb) {
	var auth = {};
	
	auth.saveToken = function(token) {
		$window.localStorage['sqkii-news-token'] = token;
	}
	
	auth.getToken = function() {
		return $window.localStorage['sqkii-news-token'];
	}
	
	auth.isLoggedIn = function(temp) {
		var token = auth.getToken();
		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
		return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}
	
	auth.currentUser = function() {
		if(auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			return payload.user;
		}
	}
	
	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	}
	
	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	}
	
	auth.logOut = function() {
		$window.localStorage.removeItem('sqkii-news-token');
	}
	
	auth.fbLogIn = function(user) {
		return $http.post('/fbauth', user).success(function (data) {
			auth.saveToken(data.token);
		});
	}
	
	
	return auth;
}])



app.factory('users', ['$http', '$window', function($http, $window) {
	var o = { users : []};
	
	o.getAll = function() {
		return $http.get(pathPrefix + '/user/').success(function(data) {
			angular.copy(data, o.users);	
		});
	}
	
	o.get = function(id) {
		return $http.get(pathPrefix + '/user/' + id).success(function(res) {
			return res.data;
		});
	}
	
	o.getFB = function(id) {
		return $http.get(pathPrefix + '/user/?fbid=' + id).success(function(res) {
			return res.data;
		});
	}
	
	
	return o;
}])



app.factory('cheeses', ['$http', 'auth', function($http, auth){
	var o = { cheeses : [] };
	
	var limitAmount = "?limit=";
	var limit = "?limit=";
	var skip = "?skip=";
	var populateAll = "?populate=advertiser+creator";
	
	// Get all cheese 
	o.getAll = function() {
		return $http.get(pathPrefix + '/cheese').success(function(data) {
			angular.copy(data, o.cheeses);	
		});
	}
	
	// Get all cheese with population of nested arrays
	o.getAllPopulated = function() {
		return $http.get(pathPrefix + '/cheese' + populateAll).success(function(data) {
			angular.copy(data, o.cheeses);	
		});
	}
	
	// Get the default list of cheese for discovery
	o.getDiscoveryCheeses = function() {
		return $http.get(pathPrefix + '/cheese' + populateAll).success(function(data) {
			angular.copy(data, o.cheeses);	
		});
	}
	
	// Get the list of cheese sorted by time remaining
	o.getEndingCheeses = function() {
		return $http.get(pathPrefix + '/cheese' + populateAll).success(function(data) {
			angular.copy(data, o.cheeses);	
		});
	}
	
	// Getting based on a query *for future customisable filters
	o.getQuery = function(query) {
		return $http.get(pathPrefix + '/cheese' + populateAll).success(function(data) {
			angular.copy(data, o.cheeses);	
		});
	}
	
	// Getting a single cheese
	o.get = function(id) {
		return $http.get(pathPrefix + '/cheese/' + id + populateAll).then(function(res) {
			return res.data;
		});
	}
	
	// Create a new cheese
	// To initialise the attributes, 
	// match the ng-model values with the values in our Cheese schema
	o.create = function(userId, cheese) {
		return $http.post(pathPrefix + '/user/' + userId + '/cheese', cheese, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			o.cheeses.push(data);
		});
	}
	
	// Comment
	o.comment = function(cheese, userId, comment) {
		cheese.comments.push(comment);
		
		return $http.put(pathPrefix + '/cheese/' + cheese._id, cheese, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	}
	
	// Like
	o.like = function(cheese, userId) {
		var likes = cheese.likes;
		
		if(likes.indexOf(userId) == -1) {
			var cheeselike = {cheese : cheese._id, liker : userId};
			
			$http.post(pathPrefix + '/cheeselike/', cheeselike).success(function() {
				
				cheese.likes.push(userId);
				
				return $http.put(pathPrefix + '/cheese/' + cheese._id, cheese, {
					headers: {Authorization: 'Bearer ' + auth.getToken()}
				}).error(function(data) {
					cheese.likes.pop();
				});

			});
		}  else {
			//no like
			console.log("2) likes.indexOf(userId) " + likes.indexOf(userId));
		}
	}
	
	// Share
	o.share = function(cheese, userId) {
		var cheeseshare = {cheese : cheese._id, sharer : userId};

		$http.post(pathPrefix + '/cheeseshare/', cheeseshare).success(function() {
			// thank you for sharing, game bonus
		}); 
	}
	
	// to-do
	o.upvote = function(cheese) {
		cheese.upvotes += 1;

		return $http.put(pathPrefix + '/cheese/' + cheese._id, cheese, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).error(function(data) {
			cheese.upvotes -= 1;
		});
	}
	
	//to - do
	o.upvoteComment = function(cheese, comment) {
		return $http.put(pathPrefix + '/cheese/' + post._id + '/comment/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			comment.upvotes += 1;
		});
	}
	
	// Validate
	// cheese is the cheese object
	// userId is the user id for referencing
	// comment is the comments user inputs
	// date is the validation date that user inputs
	o.validate = function(cheese, userId, cheesevalidate) {
		var validatedUsers = cheese.validatedUsers;
		
		if(validatedUsers.indexOf(userId) == -1) {
			cheese.validates.push(cheesevalidate);
			
			//create a validate object in database
			$http.post(pathPrefix + '/cheesevalidate/', cheesevalidate);
				
			return $http.put(pathPrefix + '/cheese/' + cheese._id, cheese, {
				headers: {Authorization: 'Bearer ' + auth.getToken()}
			}).success(function(data){
				validatedUsers.push(userId);
				
			}).error(function(data) {
				var index = cheese.validates.indexOf(userId);
				validates.splice(index, 1);			
			});

		}  else {
			// validated before, to-do edit validate or maybe not
		}
	}
	
	return o;
}]);




app.factory('posts', ['$http', 'auth', function($http, auth){
	var o = { posts : [] };
	
	o.getAll = function() {
		return $http.get(pathPrefix + '/post').success(function(data) {
			angular.copy(data, o.posts);	
		});
	}
	
	o.get = function(id) {
		return $http.get(pathPrefix + '/post/' + id + '?populate=creator+comments').then(function(res) {
			return res.data;
		});
	}
	
	o.create = function(userId, post) {
		return $http.post(pathPrefix + '/user/' + userId + '/post', post, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			o.posts.push(data);
		});
	}
	
	
	// to-do
	o.upvote = function(post) {
		post.upvotes += 1;

		return $http.put(pathPrefix + '/post/' + post._id, post, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).error(function(data) {
			post.upvotes -= 1;
		});
	}
	
	//to - do
	o.addComment = function(post, userId, comment) {
		return $http.post(pathPrefix + '/user/' + userId + '/posts/' + post._id + '/comment', comment, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	}
	
	//to - do
	o.upvoteComment = function(post, comment) {
		return $http.put(pathPrefix + '/post/' + post._id + '/comment/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			comment.upvotes += 1;
		});
	}
	
	return o;
}]);


		