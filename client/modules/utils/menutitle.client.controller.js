'use strict';

angular.module('MainModule').controller('PublicTitleController', ['$scope', '$http', function ($scope, $http) {
    $scope.adminInfo = {
        adminId: UTIL_FACTORY.getCookie('adminId'),
        adminName: UTIL_FACTORY.getCookie('adminName'),
        adminIcon: UTIL_FACTORY.getCookie('adminIcon'),
        adminVip: UTIL_FACTORY.getCookie('adminVip')
    }
    $scope.openAdministratorInfoModel = function () {
        window.location.href = '#/logout';
    };
}]);