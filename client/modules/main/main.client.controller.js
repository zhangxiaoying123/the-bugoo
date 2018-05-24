'use strict';

var app = angular.module('MainModule', ['ng', 'ngRoute','ui.bootstrap']);

app.config(['$locationProvider','$routeProvider', function ($locationProvider, $routeProvider) {

    $locationProvider.hashPrefix('');
    $routeProvider
        // 退出登录
        .when('/logout', {
            templateUrl: '/client/views/utils/logout.client.view.html'
        })

        // 发行人管理
        .when('/issuer', {
            templateUrl: '/client/views/issuer/issuer.client.view.html'
        })
        // 资料管理
        .when('/management', {
            templateUrl: '/client/views/issuer/issuerinfo.client.view.html'
        })

        //首次发行
        .when('/thefirstissuer', {
            templateUrl: '/client/views/issuer/issuerincomedetails.client.view.html'
        })

        //资金管理
        //总览
        .when('/overview', {
            templateUrl: '/client/views/money/theoverview.client.view.html'
        })
        //资金流水
        .when('/money', {
            templateUrl: '/client/views/money/flowingwater.client.view.html'
        })

        // 用户管理
        // 文章管理
        .when('/article', {
            templateUrl: '/client/views/usser/thearticle.client.view.html'
        })
        //首页Banner管理
        .when('/baner', {
            templateUrl: '/client/views/usser/thebaner.client.view.html'
        })

        // 编辑
        .when('/editormenu', {
            templateUrl: '/client/views/usser/theEditor.client.view.html'
        })


        .otherwise({
            redirectTo: '/'
        });

}]);
app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);
