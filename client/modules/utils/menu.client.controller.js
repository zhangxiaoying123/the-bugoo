'use strict';

angular.module('MainModule').controller('MainMenuController', ['$scope', '$http', function ($scope, $http) {

    // 鼠标滑动事件
    $(".mainMenu .menuList>li").hover(function (e) {
        $(this).find(".menuListName").addClass("hover");
    }, function () {
        $(this).find(".menuListName").removeClass("hover");
    });

    // 鼠标点击手风琴
    $(".mainMenu .menuList>li").click(function (e) {
        if (e.target.className.indexOf("menuListName") !== -1) {
            if (!$(this).find("ul").attr("class")) {
                $(this).addClass("hover");
                $(this).siblings("li.hover").removeClass("hover");
                $(this).find("ul").addClass("ulBlock").slideDown("slow");
                $(this).siblings("li").find("ul.ulBlock").removeClass("ulBlock").slideUp("slow");
            } else {
                $(this).removeClass("hover");
                $(this).find("ul").removeClass("ulBlock").slideUp("slow");
            }
        }
    });
    $(".mainMenu .menuList>li li a").click(function (e) {
        $(".mainMenu .menuList>li li a").removeClass("hover");
        $(this).addClass("hover");
    });


}]);