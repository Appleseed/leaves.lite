var app  = angular.module('leavesNext', ['ui.router','ngSanitize','infinite-scroll','ui.bootstrap'])

app.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
	.state('home', {
		url: '/?tag',
		templateUrl: 'views/card-view.html',
		controller: 'homeController'
	})

	.state('home.reader', {
		url: 'leaf/:ids',
		templateUrl: 'views/card-reader.html',
		controller: 'singleLeaves'
	})

	.state('list-view', {
		url: '/list/?tag',
		templateUrl: 'views/list-view.html',
		controller: 'homeController'
	})

	.state('list-view.reader', {
		url: 'leaf/:ids',
		templateUrl: 'views/list-reader.html',
		controller: 'singleLeaves'
	})

	$urlRouterProvider.otherwise('/?tag=home');
})

app.directive('leavesNav', function(){
	return {
		restrict: 'E',
		templateUrl: 'views/navbar.html'
	}
})

app.directive('leavesCard', function(){
	return {
		restrict: 'E',
		templateUrl: 'views/leaves-card.html',
		scope: {
			data: '=',
			state: "@state",
			listarr: '='
		},
		controller: 'leavesCardCtrl'
	}
})


app.directive('leavesList', function(){
	return {
		restrict: 'E',
		templateUrl: 'views/leaves-list.html',
		scope: {
			data: '=',
			state: "@state",
			listarr: '='

		},
		controller: 'leavesListCtrl'
	}
})
app.controller('leavesListCtrl',['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){
	$scope.added_date = function(tm) {
		return moment(tm).startOf('hour').fromNow();
	}
	$scope.getSingleLeaves = function(id,listarr){
		$rootScope.rm_id = true
		$rootScope.flag = 1
		if(listarr.indexOf(id) === -1){  
			listarr.push(id)
			$scope.listArray = listarr
			var param = {ids: listarr}
			$state.go('list-view.reader', param)
	    }
	}
}])
app.controller('leavesCardCtrl',['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){
	$scope.added_date = function(tm) {
		return moment(tm).startOf('hour').fromNow();
	}
	$scope.getSingleLeaves = function(id,listarr){
		$rootScope.rm_id = true
		$rootScope.flag = 1
		if(listarr.indexOf(id) === -1){  
			listarr.push(id)
			$scope.listArray = listarr
			var param = {ids: listarr}
			$state.go('home.reader', param)
	    }
	}
}])
// app.directive('tabHighlight', [function(){
//     return {
//       restrict: 'A',
//       link: function(scope, element) {
//         var x, y, initial_background = '#c3d5e6';

//         element
//           .removeAttr('style')
//           .mousemove(function (e) {
//             // Add highlight effect on inactive tabs
//             if(!element.hasClass('active'))
//             {
//               x = e.pageX - this.offsetLeft;
//               y = e.pageY - this.offsetTop;

//               element
//                 .css({ background: '-moz-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background })
//                 .css({ background: '-webkit-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background })
//                 .css({ background: 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background });
//             }
//           })
//           .mouseout(function () {
//             element.removeAttr('style');
//           });
//       }
//     };
//   }]);
