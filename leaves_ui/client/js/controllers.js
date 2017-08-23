app.controller('mainController', ['$scope','$http','$state', function($scope, $http, $state){
	$scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
	$scope.card_view = true
	$scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'
	$scope.navCloseOpen = function(){
		$("#wrapper").toggleClass("toggled");
	}

	$scope.cardView = function(){
		$scope.card_view = true
		console.log($scope.card_view)
	}

	$scope.listView = function(){
		$scope.card_view = false
		console.log($scope.card_view)
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

	$scope.close = function(){		
		document.getElementById("body").style.overflowY = "scroll";
		document.getElementById("mySidenav").style.height = "0";
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

app.controller('homeController', ['$scope','$http','$state', function($scope, $http, $state){
	document.getElementById('body').style.overflowY = "scroll"
	$scope.stateJson = $state.current
	var page = 1
	$scope.disable_scroll = true
	var dataArray = []
	function homeData(){
		$scope.loadingMessage = true
		if(page >= 2){
			$scope.disable_scroll = true
		}	
		$http({
			method: 'GET',
			url: $scope.base_url + '/api/entries',
			params: {access_token: $scope.token,limit:12,page:page}
		}).then(function(success){
			$scope.homeData = success
			angular.forEach(success.data._embedded.items, function(value) {
				dataArray.push(value)
			})
		}).catch(function(response){
			$scope.error = response
		}).finally(function(){
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
		page = page + 1
		homeData();
	}
	$scope.entries = dataArray



}])

app.controller('tagController', ['$scope','$http','$stateParams','$state', function($scope, $http, $stateParams, $state){
	$scope.stateJson = $state.current
	$scope.tagName = $stateParams.tag_slug.split('-').join(' ');
	document.getElementById('body').style.overflowY = "scroll"
	console.log($state.current)
	var page = 1
	$scope.disable_scroll = true
	var tagArray = []
	function tagLeaves(){
	$scope.loadingMessage = true
	if(page >= 2){
		$scope.disable_scroll = true
	}	
		$http({
			method: 'GET',
			url: $scope.base_url + '/api/entries',
			params: {access_token: $scope.token,limit:12,page:page,tags:$scope.tagName}
		}).then(function(success){
			$scope.tagData = success
			angular.forEach(success.data._embedded.items, function(value) {
				tagArray.push(value)
			})
		}).catch(function(response){
			$scope.error = response
		}).finally(function(){
			$scope.loadingMessage = false
			if(tagArray.length == $scope.tagData.data.total){
				$scope.disable_scroll = true				
			}else{
				$scope.disable_scroll = false
			}
		})
	}

	tagLeaves();
	
	$scope.loadMore = function(){
		page = page + 1
		tagLeaves();
	}
	$scope.entries = tagArray
}])

app.controller('singleLeaves', ['$scope','$http','$stateParams','$sce', function($scope, $http, $stateParams){
	document.getElementById('body').style.overflowY = "hidden"
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