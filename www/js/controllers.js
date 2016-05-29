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


.controller('WifiCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval){
  
  $scope.wifiList = [];
  $scope.wifiIsOff = false;
  $scope.current = '';

  if (typeof WifiWizard !== 'undefined') {

    WifiWizard.isWifiEnabled(function(wifiIsEnabled) {

        if (!wifiIsEnabled) {
            $scope.wifiIsOff = true;
            console.log('Wifi is off');
        } else {

            WifiWizard.getCurrentSSID(function(result){
              $scope.current = result.substring(1, result.length-2);
            }, function(){
              console.log("Cannot retrieve current network.");
            });


            WifiWizard.listNetworks(function(previouslySelectedNetworks) {
                if (previouslySelectedNetworks.length > 0) {
                    console.log("A network was previously selected but not connected. Inform user why we're presenting the network list now.");
                    $scope.previouslySelectedNetworkExpired = true;
                }

                WifiWizard.startScan(function() {
                    console.log("Scanning for networks...");
                    $scope.scanResultsInterval = setInterval(function() {
                        console.log("Scan interval running.");
                        WifiWizard.getScanResults(function(availableNetworks) {
                            // Update
                            $scope.wifiList = availableNetworks;
                            $scope.$apply();
                            console.log("Updating network list with results.", availableNetworks)
                        }, function() {
                            console.log("Failed to get scan results.");
                        });
                    }, 3000);
                }, function() {
                    console.log('Failed to start WiFi scan.');
                });
            }, function() {
                console.log('Failed to get a listing of previously selected networks.');
            });
        }
    }, function() {

    });
  } else {
    console.log("No WifiWizard plugin loaded.");
  }

  $scope.getSecurity = function(capabilities){
    if (capabilities.indexOf("PSK") != -1){ // PSK
      if(capabilities.indexOf("WPA2-PSK") != -1){
        return "WPA2";
      }else if(capabilities.indexOf("WPA-PSK") != -1){
        return "WPA";
      }else{
        return "PSK-?";
      }
    }else{ // Other
      if(capabilities.indexOf("WEP") != -1){
        return "WEP";
      }else if(capabilities.indexOf("EAP") != -1){
        return "EAP";
      }else{
        return "OPEN";
      }
    }
  }

  $scope.getScore = function(capabilities){
    if(capabilities.indexOf("WPA2-PSK-CCMP") != -1){
      return 5;
    }else if(capabilities.indexOf("WPA-PSK-CCMP") != -1){
      return 4;
    }else if(capabilities.indexOf("WPA-PSK-CCMP+TKIP") != -1){
      return 3;
    }else if(capabilities.indexOf("WPA-PSK-TKIP") != -1){
      return 2;
    }else if(capabilities.indexOf("WEP") != -1){
      return 1;
    }else{
      return 0;
    }
  }
  
  $scope.getNumber = function(num) {
    return new Array(num);   
  }
}]);
