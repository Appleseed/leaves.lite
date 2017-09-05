function makeCardReaderView(){
	$("#viewDiv").removeClass('col-lg-12')
	$("#viewDiv").addClass('col-lg-4')
}

app.controller('mainController', ['$scope','$http','$state','$location', function($scope, $http, $state, $location){
	$scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
	$scope.card_view = true
	$scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'

	$scope.goToHome = function(){
		$("#viewDiv").removeClass('col-lg-4')
		$("#viewDiv").addClass('col-lg-12')
		// $state.go('home')
		$location.path('/home')
		console.log('go to home')
	}


	$scope.navCloseOpen = function(){
		$("#wrapper").toggleClass("toggled");
	}

	$scope.cardView = function(){
		$scope.card_view = true
		// makeCardReaderView()
	}

	$scope.listView = function(){
		$scope.card_view = false
		// makeCardReaderView()
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

	//$http.get call to get all tags json
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

app.controller('homeController', ['$scope','$http','$state','$stateParams', function($scope, $http, $state, $stateParams){
	$scope.stateJson = $state.current
	var page = 1
	$scope.disable_scroll = true
	$scope.loading_button = false
	var dataArray = []
	function homeData(){
		if($stateParams.tag && $stateParams.tag != 'home'){
			var tagName = $stateParams.tag.split('-').join(' ');
			var param = {access_token: $scope.token,limit:12,page:page,tags:tagName}
		}else{
			var param = {access_token: $scope.token,limit:12,page:page}
		}
		$scope.loadingMessage = true
		if(page >= 2){
			$scope.loading_button = true
		}	
		$http({
			method: 'GET',
			url: $scope.base_url + '/api/entries',
			params: param
		}).then(function(success){
			$scope.homeData = success
			angular.forEach(success.data._embedded.items, function(value) {
				dataArray.push(value)
			})
		}).catch(function(response){
			$scope.error = response
		}).finally(function(){
			page = page + 1
			$scope.loading_button = true
			$scope.loadingMessage = false
			if(dataArray.length == $scope.homeData.data.total){
				$scope.disable_scroll = false				
			}else{
				$scope.disable_scroll = false
			}
		})
	}

	homeData();
	
	$scope.loadMore = function(){
		homeData();
	}
	$scope.entries = dataArray



}])

app.controller('singleLeaves', ['$scope','$http','$stateParams','$timeout', function($scope, $http, $stateParams, $timeout){
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
		makeCardReaderView()
	})
}])