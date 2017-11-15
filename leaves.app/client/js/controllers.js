app.controller('mainController', ['$scope', '$http', '$state', '$location', '$rootScope', function($scope, $http, $state, $location, $rootScope) {
    $scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
    $scope.card_view = true
    $rootScope.listArray = []
    $rootScope.tempArray = []
    $rootScope.leaves = []
    $scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'

    $scope.goToHome = function() {
        $state.go('home', { tag: 'home' })
        $rootScope.isidexit = 0
    }
    $scope.save_it = function(url) {
        $http({
            method: 'POST',
            url: $scope.base_url + '/api/entries',
            params: { access_token: $scope.token, url: url }
        }).then(function(success) {
            $scope.entries = success.data
            console.log(success)
        }).catch(function(response) {
            $scope.error = response
        })
    }

    //$http.get call to get all tags json
    var tags_list = []
    $http({
        method: 'GET',
        url: $scope.base_url + '/api/tags',
        params: { access_token: $scope.token }
    }).then(function(success) {
        angular.forEach(success.data, function(value) {
            var slug = value.label.split(' ').join('-')
            tags_list.push({ id: value.id, label: value.label, slug: slug })
        })
    }).catch(function(response) {
        $scope.error = response
    })
    $scope.tags = tags_list
}])

app.controller('homeController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
    $rootScope.isidexit = 0
    $scope.stateJson = $state.current
    var page = 1
    $scope.loading_button = false
    var dataArray = []
    var itemIds = []
    $scope.current_params = { tag: $stateParams.tag }

    function homeData(loadmore) {
        if ($stateParams.tag && $stateParams.tag != 'home') {
            var tagName = $stateParams.tag.split('-').join(' ');
            var param = { access_token: $scope.token, sort: 'created', limit: 12, order: 'desc', page: page, tags: tagName }
        } else {
            var param = { access_token: $scope.token, sort: 'created', limit: 12, order: 'desc', page: page }
        }
        $scope.loadingMessage = true
        if (page >= 2) {
            $scope.loading_button = true
        }
        $http({
            method: 'GET',
            url: $scope.base_url + '/api/entries',
            params: param
        }).then(function(success) {
            $scope.homeData = success
            angular.forEach(success.data._embedded.items, function(value) {
                dataArray.push(value)
            })
        }).catch(function(response) {
            $scope.error = response
        }).finally(function() {
            page = page + 1
            if (dataArray.length < $scope.homeData.data.total) {
                $scope.loading_button = true
                $scope.loadingMessage = false
            }
        })
    }

    homeData(0);

    $scope.loadMore = function() {
        homeData(1);
    }
    $scope.entries = dataArray
}])


app.controller('singleLeaves', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', function($scope, $http, $stateParams, $timeout, $rootScope, $state) {
    var leafIdsList = String($stateParams.ids).split(',')
    $scope.readerView = false
    $rootScope.isidexit = 1

    function leafHTTP(id) {
        var param_list = $stateParams.ids.split(',');
        console.log(param_list)
        $scope.active_id = id
        $http({
            method: 'GET',
            url: $scope.base_url + '/api/entries/' + id,
            params: { access_token: $scope.token }
        }).then(function(success) {
            $rootScope.leaves.push(success.data)
        }).catch(function(response) {
            $scope.error = response
        }).finally(function() {
            $rootScope.leaves[$rootScope.leaves.length - 1].active = true;
            $scope.readerView = true
        })
    }
    if ($rootScope.flag == undefined) {
        $rootScope.listArray = leafIdsList
        for (var i = 0; i < leafIdsList.length; i++) {
            leafHTTP(leafIdsList[i])
        }
    } else {
        console.log(leafIdsList)
        console.log($rootScope.rm_id)
        if ($rootScope.rm_id) {
            leafHTTP(leafIdsList[leafIdsList.length - 1])
        }
    }
    var removeTab = function(event, index, item_id) {
        event.preventDefault();
        event.stopPropagation();

        if ($state.current.name == 'home.reader') {
            var sendTo = 'home.reader'
            var sendToParent = 'home'
        } else {
            var sendTo = 'list-view.reader'
            var sendToParent = 'list-view'
        }

        $rootScope.rm_id = false
        content_index = $rootScope.leaves.findIndex(i => i.id == item_id)
        $rootScope.leaves.splice(content_index, 1);
        var param_list = $stateParams.ids.split(',');
        var item_index = param_list.indexOf(String(item_id))
        if (item_index > -1) {
            param_list.splice(item_index, 1);
        }
        $rootScope.listArray = param_list
        console.log(param_list)
        $state.go(sendTo, { ids: param_list })
        if (param_list.length == 0) {
            event.preventDefault();
            event.stopPropagation();
            $state.go(sendToParent, { ids: $stateParams.tag })
            $rootScope.listArray = []
            $rootScope.isidexit = 0
        }
    };

    $scope.removeTab = removeTab;

}])