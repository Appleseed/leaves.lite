app.controller('mainController', ['$scope','$http', function($scope, $http){
	$scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
	$scope.token = 'NzIyYWNkMTBkM2FlMzY2MTc3Yzk0MzlmYTAxODcyZGMzY2ZjMzVhMjJlN2I2ODYyMGNjYWU4NmUxMzcwMjE3Mw'
	$scope.navCloseOpen = function(){
		$("#wrapper").toggleClass("toggled");
	}

	$scope.save_it = function(url){
		$http({
			method: 'POST',
			url: $scope.base_url + '/api/entries',
			params: {access_token: $scope.token,url:url}
		}).then(function(success){
			$scope.entries = success.data
			console.log(success)
		}).catch(function(response){
			$scope.error = response
		})
	}
}])

app.controller('homeController', ['$scope','$http', function($scope, $http){
	$http({
		method: 'GET',
		url: $scope.base_url + '/api/entries',
		params: {access_token: $scope.token}
	}).then(function(success){
		$scope.entries = success.data
	}).catch(function(response){
		$scope.error = response
	})

	$http({
		method: 'GET',
		url: $scope.base_url + '/api/tags',
		params: {access_token: $scope.token}
	}).then(function(success){
		$scope.tags = success
	}).catch(function(response){
		$scope.error = response
		// console.log(response)
	})
}])

app.controller('singleLeaves', ['$scope','$http','$stateParams','$sce', function($scope, $http, $stateParams){

	$http({
		method: 'GET',
		url: $scope.base_url + '/api/entries/' + $stateParams.id,
		params: {access_token: $scope.token}
	}).then(function(success){
		$scope.leaves = success.data
	}).catch(function(response){
		$scope.error = response
		// console.log(response)
	}).finally(function(){
		document.getElementById("mySidenav").style.height = "100%";
	})
}])
