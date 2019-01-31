var env = {};
if(window){  
    Object.assign(env, window.__env);
}

var app = angular.module('leavesNext');
(function(app){
    "use strict";

    app.constant('ENV', env);

    disableLogging.$inject = ['$logProvider', 'ENV'];

    // app config
    function disableLogging($logProvider, ENV) {
        $logProvider.debugEnabled(ENV.ENABLEDEBUG);
    }

})(app);