angular.module('WifiServices', [])
    .factory('WifiService', function() {
        var unique_array = angular.fromJson('[]');

        function win_wifi(e) {
            console.log('win');
            alert("Success");
        }

        function fail_wifi(e) {
            console.log('fail');
            alert("Error");
        }

        function connectWifi(wifi_ssid) {
            console.log('connect? ');
            WifiWizard.connectNetwork(wifi_ssid, win_wifi, fail_wifi);
        }

        function listHandler(a) {

            var network_array = [];
            for (var i = 0; i < a.length; i++) {
                network_array.push(a[i].SSID);
            }

            unique_array = network_array.filter(function(elem, pos) {
                return network_array.indexOf(elem) == pos;
            });

            // alert("Wifi List Ready!");
        }

        function getScanResult() {
            console.log('getScan');
            WifiWizard.getScanResults(listHandler, failNetwork);
        }

        function successNetwork(e) {
            console.log('successNetwork');
            window.setTimeout(function() {
                getScanResult();
            }, 3000);
        }

        function failNetwork(e) {
            console.log('failNetwork');
            alert("Network Failure: " + e);
        }

        window.setTimeout(function() {
            console.log('scan');
            WifiWizard.startScan(successNetwork, failNetwork);
        }, 1000);

        return {
            list: function() {
                return unique_array;
            },
            scan: function(){
            	
            },
            connectionToWifi: function(name) {
                connectWifi(name);
            }
        };
    });