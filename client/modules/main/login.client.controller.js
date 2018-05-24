'use strict';

var app = angular.module('SigninModule', ['angular-md5']);
app.controller('SigninController', ['$scope', '$http', 'md5', function ($scope, $http, md5) {

    $scope.formFields = {};

    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });

    // 提交表单
    $scope.submitForm = function () {
        // Email/Password 验证
        $scope.errorMsgs = [];
        if (!$scope.formFields.password || !$scope.formFields.username) {
            $scope.errorMsgs.push('账号或密码输入错误！');
            return;
        }
        $scope.formFields.password = md5.createHash($scope.formFields.password || '');

        $http.post(UTIL_FACTORY.IP + '/api/admin/login', $.param($scope.formFields), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
            .then(function (res) {
                if (res.data.status !== 1) {
                    alert('登录失败！');
                    return;
                }
                UTIL_FACTORY.setCookie('adminName', res.data.data.username, 30);
                UTIL_FACTORY.setCookie('adminId', res.data.data.id, 30);
                UTIL_FACTORY.setCookie('adminIcon', res.data.data.avatar, 30);
                UTIL_FACTORY.setCookie('adminVip', res.data.data.roleId, 30);
                window.location.href = '/client/views/main/main.client.view.html';
            },function (err) {
                console.log('server error:' + err);
            })
    };
}]);