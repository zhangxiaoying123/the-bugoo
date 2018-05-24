'use strict';

angular.module('MainModule').controller("LogoutController",['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
    var adminVipArray = ['超级管理员', '管理员', '运营'];
    $scope.adminInfo = {
        adminId: UTIL_FACTORY.getCookie('adminId'),
        adminName: UTIL_FACTORY.getCookie('adminName'),
        adminIcon: UTIL_FACTORY.getCookie('adminIcon'),
        adminVip: adminVipArray[UTIL_FACTORY.getCookie('adminVip')]
    }

    var client = new OSS.Wrapper({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAI6SYHFprTPO91',
        accessKeySecret: 'F5uMqOl5ygfDd2e0vLnji6LylcA1IS',
        bucket: 'gamgapk'
    });

    // 打开退出登录弹窗
    $scope.openLogoutPromptModel = function () {
        var text = '是否退出登录？'
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'logout.html',
            controller: 'LogOutModelCtrl',
            backdrop: 'static',
            size:'sm',//弹出框的大小
            resolve: {
                textInfo: function () {
                    return text;
                }
            }
        });
        // 窗口内容填写正常后,关闭,则向服务器提交表单
        function onModalClose(info) {
            $http.post(UTIL_FACTORY.IP + '/api/admin/loginout', $.param({id: $scope.adminInfo.adminId}), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
                .then(function (res) {
                    window.location.href = '/client/views/main/login.html';
                }), function(err) {
                    console.log('server error:' + err);
                }
        };
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        }
        modalInstance.result.then(onModalClose, onModalDismiss);
    };
}]);

// 退出弹窗
angular.module('MainModule').controller('LogOutModelCtrl', function ($scope, $uibModalInstance, textInfo) {

    $scope.alertText = textInfo;
    $scope.submitlogout = function () {
        $uibModalInstance.close(true);
    };

    $scope.cancelLogOutModel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});