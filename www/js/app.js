// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngStorage', 'ngCordova', 'ngAnimate', 'starter.controllers'])
.factory ('StorageService', function ($localStorage) {
  $localStorage = $localStorage.$default({
    products: [], cves: [], config: {}
  });
  var _getAll = function () {
    return $localStorage.products;
  };
  var _add = function (product) {
    $localStorage.products.push(product);
  };
  var _check = function (product) {
    var exist = $localStorage.products.indexOf(product);
    exist++;
    return exist;
  };
  var _remove = function (product) {
    $localStorage.products.splice($localStorage.products.indexOf(product), 1);
  };
  var _getAllCve = function () {
    return $localStorage.cves;
  };
  var _addCve = function (cve) {
      $localStorage.cves.push(cve);
  };
  var _checkCve = function (cve) {
    var exist = $localStorage.cves.indexOf(cve);
    exist++;
    return exist;
  };
  var _removeCve = function (cve) {
    $localStorage.cves.splice($localStorage.cves.indexOf(cve), 1);
  };
  var _alterConfig = function(key, value){
    $localStorage.config[key] = value;
  };
  var _getConfig = function(key){
    return $localStorage.config[key];
  };
  return {
      getAll: _getAll,
      add: _add,
      check: _check,
      remove: _remove,
      getAllCve: _getAllCve,
      addCve: _addCve,
      checkCve : _checkCve,
      removeCve: _removeCve,
      alterConfig: _alterConfig,
      getConfig: _getConfig
    };
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
//    if(window.cordova && window.cordova.plugins.Keyboard) {
//        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//    }
//    if(window.StatusBar) {
//        StatusBar.styleDefault();
//    }
//    window.plugin.notification.local.onadd = function (id, state, json) {
//        var notification = {
//            id: id,
//            state: state,
//            json: json
//        };
//        $timeout(function() {
//            $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
//        });
//    };
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.setting', {
    url: '/setting',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingCtrl'
      }
    }
  })
  
    .state('app.subscription', {
      url: '/subscriptions',
      views: {
        'menuContent': {
          templateUrl: 'templates/subscriptions.html',
          controller: 'SubscriptionCtrl'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'VendorsCtrl'
        }
      }
    })
    .state('app.products', {
      url: '/browse/:name',
      views: {
        'menuContent': {
          templateUrl: 'templates/products.html',
          controller: 'ProductsCtrl'
        }
      }
    })
    .state('app.cves', {
      url: '/cves',
      views: {
        'menuContent': {
          templateUrl: 'templates/cves.html',
          controller: 'CvesCtrl',
          cache: false
      }
    }
  })
  .state('app.wifi', {
    url: '/wifi',
    views: {
      'menuContent': {
        templateUrl: 'templates/wifi.html',
        controller: 'WifiCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/cves/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/cve.html',
        controller: 'CveCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/cves');
});
