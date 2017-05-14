var app = angular.module('leave_lite', ['angular.filter']);

app.controller('DocCtrl', function ($scope, $http, $sce){

	$http.get('http://anant.co/data/topic.docker.js').success(function(data) {
        $scope.documents = data;
    });

	$scope.getLinkPreview = function(url){
	$scope.preview = true
		$http.get('http://localhost:5000/api?url='+ url).success(function(data){
			$scope.result = data
			if(data.video_url){
				$scope.embed_url = $sce.trustAsResourceUrl(data.video_url)
			}
		}).finally(function(){
			$scope.preview = false
		})
	}

});

app.directive('linkPreview', function() {
	 return {
      restrict: 'E',
      templateUrl: 'views/linkpreview.html'
    };
});