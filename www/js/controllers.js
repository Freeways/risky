angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('WifiCtrl', ['$scope','WifiService', function($scope, WifiService){
  
  $scope.wifiList = [];

  window.setInterval(function(){
    $scope.wifiList = WifiService.list();
    console.log($scope.wifiList);
    $scope.$apply();
  }, 2000);

  $scope.getList = function(){
    $scope.wifiList = WifiService.list();
  }

 /* $ionicPlatform.ready(function() {
    $cordovaWifiWizard.listNetworks().then(function(data){
      // $scope.wifiList = data;
      console.log(data);
    }, function(){});
  });

  $cordovaWifiWizard.listNetworks().then(function(data){
    $scope.wifiList = data;
  });
  
  $scope.isEnabled = true;

  window.setTimeout(function(){
    WifiService.isEnabled(function(e){
      $scope.isEnabled = true;
    }, function(e){
      $scope.isEnabled = false;
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: 'Please enable wifi before using this feature',
        title: 'Wifi ',
        subTitle: 'Wifi access is disabled!',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Enable</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($scope.isEnabled) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.enableWifi();
              }
            }
          }
        ]
      });
    });
    $scope.$apply();
  }, 5000);

  window.setTimeout(function(){
    $scope.wifiList = WifiService.list();
    $scope.$apply();
  }, 5000);

  $scope.getList = function(){
    $scope.wifiList = WifiService.list();
  }

  $scope.enableWifi = function(){
    WifiService.enableWifi();
  }*/

}]);
