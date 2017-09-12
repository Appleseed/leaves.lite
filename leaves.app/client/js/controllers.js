function makeCardReaderView(){
	setTimeout(function(){ 
		$("#grid").removeClass('col-lg-12')
		$("#grid").addClass('col-lg-5')
		$('#cardView div.card-view').each(function(){
			$(this).removeClass('col-lg-4');
			$(this).addClass('col-lg-12');
		})
	}, 1000);
}

function removeCardReaderView(){
	setTimeout(function(){ 
		$("#grid").removeClass('col-lg-5')
		$("#grid").addClass('col-lg-12')
		$('#cardView div.card-view').each(function(){
			$(this).removeClass('col-lg-12');
			$(this).addClass('col-lg-4');
		})
	}, 1000);
}

app.controller('mainController', ['$scope','$http','$state','$location','$rootScope', function($scope, $http, $state, $location, $rootScope){
	$scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
	$scope.card_view = true
	$rootScope.listArray = []
	$rootScope.tempArray = []
	$rootScope.leaves = []
	$scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'

	$scope.goToHome = function(){
		$state.go('home', {tag:'home'})
		removeCardReaderView()
	}


	$scope.navCloseOpen = function(){
		$("#wrapper").toggleClass("toggled");
	}

	$scope.cardView = function(){
		$scope.card_view = true
		makeCardReaderView()
	}

	$scope.listView = function(){
		$scope.card_view = false
		makeCardReaderView()
	}

	// $scope.save_it = function(url){
	// 	$http({
	// 		method: 'POST',
	// 		url: $scope.base_url + '/api/entries',
	// 		params: {access_token: $scope.token,url:url}
	// 	}).then(function(success){
	// 		$scope.entries = success.data
	// 		console.log(success)
	// 	}).catch(function(response){
	// 		$scope.error = response
	// 	})
	// }

	//$http.get call to get all tags json
	$http({
		method: 'GET',
		url: $scope.base_url + '/api/tags',
		params: {access_token: $scope.token}
	}).then(function(success){
		$scope.tags = success
	}).catch(function(response){
		$scope.error = response
	})
}])

app.controller('homeController', ['$scope','$http','$state','$stateParams', function($scope, $http, $state, $stateParams){
	$scope.stateJson = $state.current
	var page = 1
	$scope.loading_button = false
	var dataArray = []
	var itemIds = []
	function homeData(loadmore){
		if($stateParams.tag && $stateParams.tag != 'home'){
			var tagName = $stateParams.tag.split('-').join(' ');
			var param = {access_token: $scope.token,sort:'created',limit:12,order:'asc',page:page,tags:tagName}
			// makeCardReaderView()
		}else{
			var param = {access_token: $scope.token,sort:'created',limit:12,order:'asc',page:page}
			// makeCardReaderView()
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
			if(loadmore == 1){
				makeCardReaderView()				
			}
		})
	}

	homeData(0);
	
	$scope.loadMore = function(){
		homeData(1);
	}
	$scope.entries = dataArray
}])


app.controller('singleLeaves', ['$scope','$http','$stateParams','$timeout','$rootScope', '$state', function($scope, $http, $stateParams, $timeout, $rootScope, $state){
	var leafIdsList = String($stateParams.ids).split(',')
	function leafHTTP(id){
		$scope.active_id = id
		$http({
			method: 'GET',
			url: $scope.base_url + '/api/entries/' + id,
			params: {access_token: $scope.token}
		}).then(function(success){
			// $scope.leaves = success.data
			$rootScope.leaves.push(success.data)
		}).catch(function(response){
			$scope.error = response
		}).finally(function(){
			makeCardReaderView()
			$rootScope.leaves[$rootScope.leaves.length - 1].active = true;
		})
	}
	if($rootScope.flag == undefined){
		for (var i = 0; i < leafIdsList.length; i++) {
			leafHTTP(leafIdsList[i])
		}
	}else{
		leafHTTP(leafIdsList[leafIdsList.length-1])
	}
	console.log($stateParams.tag)
	var removeTab = function (event, index, item_id) {
		event.preventDefault();
		event.stopPropagation();
		content_index = $rootScope.leaves.findIndex(i => i.id == item_id)
		$rootScope.leaves.splice(content_index, 1);
		console.log(content_index)
		console.log($rootScope.leaves)
		var param_list = $stateParams.ids.split(',');
		var index = param_list.indexOf(String(item_id))
		if(index > -1){
			param_list.splice(index, 1);
		}
		$rootScope.listArray = param_list
		$state.go('home.single_leaves', {ids: param_list})
		if(param_list.length == 0){
			event.preventDefault();
			event.stopPropagation();
			$state.go('home',{ids:$stateParams.tag})
			removeCardReaderView()
		}
	};

    $scope.removeTab = removeTab;

}])