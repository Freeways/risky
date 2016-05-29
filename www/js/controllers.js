angular.module('starter.controllers', [])


        .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
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
          }).then(function (modal) {
            $scope.modal = modal;
          });

          // Triggered in the login modal to close it
          $scope.closeLogin = function () {
            $scope.modal.hide();
          };

          // Open the login modal
          $scope.login = function () {
            $scope.modal.show();
          };

          // Perform the login action when the user submits the login form
          $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
              $scope.closeLogin();
            }, 1000);
          };
        })

        .controller('VendorsCtrl', ['$scope', '$http', function ($scope, $http) {

            fetchVendors = function () {
              $scope.code = null;
              $scope.response = null;
              $http({method: 'GET', url: 'https://cve.circl.lu/api/browse'}).
                      then(function (response) {
                        $scope.status = response.status;
                        $scope.vendor = response.data;
                      }, function (response) {
                        $scope.vendor = response.data || "Request failed";
                        $scope.status = response.status;
                      });
            };
            fetchVendors();
          }])

        .controller('ProductsCtrl', function ($scope, $stateParams, $http, StorageService) {
          $scope.saveProduct = function (product) {
            StorageService.add({vendor: $stateParams.name, product: product});
          };
          fetchProducts = function (name) {
            $scope.code = null;
            $scope.response = null;
            $http({method: 'GET', url: 'https://cve.circl.lu/api/browse/' + name}).
                    then(function (response) {
                      $scope.status = response.status;
                      $scope.products = response.data;
                    }, function (response) {
                      $scope.cves = response.data || "Request failed";
                      $scope.products = response.status;
                    });
          };
          fetchProducts($stateParams.name);
        })

        .controller('SubscriptionCtrl', ['$scope', 'StorageService', function ($scope, StorageService) {
            $scope.removeProduct = function (product) {
              StorageService.remove(product);
              console.log(StorageService.getAll());
            };
            $scope.products = StorageService.getAll();
          }])

        .controller('CvesCtrl', ['$scope', '$http', 'StorageService', '$cordovaLocalNotification', function ($scope, $http, StorageService, $cordovaLocalNotification) {
            var config = StorageService.getAll();
            $scope.cves = [];
            fetch = function (vendor, product, $scope) {
              $scope.code = null;
              $scope.response = null;
              $http({method: 'GET', url: 'https://cve.circl.lu/api/search/' + vendor + '/' + product}).
                      then(function (response) {
                        $scope.status = response.status;
                        angular.forEach(response.data, function (value, key) {
                          value.product = product;
                          value.vendor = vendor;
                          $scope.cves.push(value);
                          var old = StorageService.checkCve(value.id);
                          if (!old) {
                            $scope.scheduleDelayedNotification = function () {
                              var now = new Date().getTime();
                              var _10SecondsFromNow = new Date(now + 10 * 1000);

                              $cordovaLocalNotification.schedule({
                                id: 1,
                                title: 'Title here',
                                text: 'Text here',
                                at: _10SecondsFromNow
                              }).then(function (result) {
                                // ...
                              });
                            };
                            //send
                            StorageService.addCve(value.id);
                          }
                        });
                      });
            };
            angular.forEach(config, function (value, key) {
              fetch(value.vendor, value.product, $scope);
            });
          }])

        .controller('CveCtrl', function ($scope, $stateParams, $http) {
          $scope.openRef = function (link) {
            window.open(link, '_blank', 'location=yes');
          };
          fetchOne = function (id) {
            $scope.code = null;
            $scope.response = null;
            $http({method: 'GET', url: 'https://cve.circl.lu/api/cve/' + id}).
                    then(function (response) {
                      $scope.status = response.status;
                      $scope.cve = response.data;
                      console.log(response.data);
                    }, function (response) {
                      $scope.cve = response.data || "Request failed";
                      $scope.status = response.status;
                    });
          };
          fetchOne($stateParams.id);
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