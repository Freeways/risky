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
          $scope.saveProduct = function(product){
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
          $scope.removeProduct = function(product){
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
                      angular.forEach(response.data, function(value, key) {
                        value.product = product;
                        value.vendor = vendor;
                        $scope.cves.push(value);
                        var old = StorageService.checkCve(value.id);
                        if(!old){
                          //notify
                          //send
                          StorageService.addCve(value.id);
                        }
                      });      
                    });
          };
          angular.forEach(config, function(value, key) {
            fetch(value.vendor, value.product, $scope);
          });          
        }])

        .controller('CveCtrl', function ($scope, $stateParams, $http) {
          $scope.openRef = function (link){
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
        });
