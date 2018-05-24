'use strict';

angular.module('MainModule').controller("IssuerController",['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {

    $scope.typeArray = [
        {id: 0, name: '全部'},
        {id: 1, name: '颜值'},
        {id: 2, name: '达人'}
    ];

    $scope.category = $scope.typeArray[0].id;

    $scope.thArray = [
        {id: 3, name: '当前价', enName: 'price', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 4, name: '涨跌幅', enName: 'fluctuation', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 5, name: '今日成交量', enName: 'success_count', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 6, name: '发行价', enName: 'base_price', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 7, name: '上市时间', enName: 'created_at', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 8, name: '流通量', enName: 'circulation', sortAsc: 'asc',sortDesc: 'desc'},
        {id: 9, name: '发行总量', enName: 'quantity', sortAsc: 'asc',sortDesc: 'desc'}
    ];

    // 发行人状态
    $scope.issuerType = [
        {id: 1, name: "申购中"},
        {id: 2, name: "即将申购"},
        {id: 3, name: "已上市"},
        {id: 4, name: "即将上市"},
        {id: 5, name: "未激活"}
    ];

    // 发行人分页信息
    $scope.issuerPagination = {
        totalIssuer: 0, // 所有发行人的数量
        maxSize: 5,         // 页面显示个数
        currPage: 1,        // 当前页码
        issuerLimit: 30   // 每个页面中显示的发行人数量
    };

    // 请求发行人列表
    $scope.requestPosts = function (offset, category, type, plusOrMinus, searchValue ) {
        var queryDoc = {
            offset: offset,
            limit: $scope.issuerPagination.issuerLimit
        };
        $scope.category = category;
        if (category != 0) {
            queryDoc.category = category;
        }
        if (type) {
            queryDoc.type = type;
            $scope.type = type;
        }
        if (searchValue) {
            queryDoc.name = searchValue;
            $scope.searchValue = searchValue;
        }
        if (plusOrMinus) {
            queryDoc.sort = plusOrMinus;
            $scope.plusOrMinus = plusOrMinus;
        }

        $http.post(UTIL_FACTORY.IP + '/api/admin/searchissuer', $.param(queryDoc), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
            .then(function(res) {
                if (res.data.status !== 1) {
                    return;
                }
                $scope.issuerList = res.data.data.list;
                $scope.issuerList.forEach(function (item) {
                    item.lanuch_time = item.lanuch_time * 1000;
                });
                $scope.issuerPagination.totalIssuer = res.data.data.total;
            }, function(err) {
                console.log('server error:' + err);
            });
    };

    // 进入界面，从0开始来获取相应的发行人列表
    $scope.requestPosts(0, 0);

    // 更新当前页面的发行人列表
    $scope.updateCurrPageissuer = function () {
        var from = ($scope.issuerPagination.currPage - 1) * $scope.issuerPagination.issuerLimit;
        $scope.requestPosts(from, $scope.category, $scope.type, $scope.plusOrMinus, $scope.searchValue);
    };

    // 搜索
    $scope.searchIssuer = function (searchValue) {
        $scope.requestPosts(0, $scope.categor, $scope.type, $scope.plusOrMinus, searchValue);
    };

    // 清空搜索
    $scope.clearSearchValue = function () {
        $scope.searchValue = '';
        $scope.requestPosts(0, 0);
    };

    // 激活账号
    $scope.activation = function (issuerId) {
        var text = '是否确认激活该发行人？';
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
            $http.post(UTIL_FACTORY.IP + '/api/admin/activatepublish', $.param({id: issuerId}), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
                .then(function(res) {
                    if (res.data.status !== 1) {
                        alert(res.data.msg + '!');
                        return;
                    }
                    $scope.updateCurrPageissuer();
                }, function(err) {
                    console.log('server error:' + err);
                });
        }
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        }
        modalInstance.result.then(onModalClose, onModalDismiss);
    };

    // 资料管理
    $scope.openIssuerInfoModel = function (issuerInfo) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'issuerinfo.html',
            controller: 'IssuerInfoModelCtrl',
            backdrop: 'static',
            size:'lg',//弹出框的大小
            resolve: {
                issuerInfo: function () {
                    return issuerInfo;
                }
            }   
        });
        // 显示  隐藏
        $scope.isshow = false;
        // 窗口内容填写正常后,关闭,则向服务器提交表单
        function onModalClose(info) {
            $http.post(UTIL_FACTORY.IP + '/api/admin/saveinfo', $.param(info), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
                .then(function (res) {
                    if (res.data.status !== 1) {
                        alert("保存失败！");
                        return;
                    }
                    $scope.updateCurrPageissuer();
                    alert("保存成功！");
                },function (err) {
                    console.log('server error:' + err);
                });
        }
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        }
        modalInstance.result.then(onModalClose, onModalDismiss);
    };


     // 文章管理   发布
    //  $scope.openReleaseModel = function (issuerInfo) {
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'postBox.html',
    //         controller: 'ArticleMenuController',
    //         backdrop: 'static',
    //         size:'lg',//弹出框的大小
    //         resolve: {
    //             issuerInfo: function () {
    //                 return issuerInfo;
    //             }
    //         }
    //     });
    // }


    //发行管理----->首次发行 
    // $scope.openForTheFirstTimeToIssueModel = function(issuerincomedetails){
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'issuerincomedetails.html',
    //         controller: 'IssuerPublishInfoModelCtrl',
    //         backdrop: 'static',
    //         resolve: {
    //             issuerincomedetails: function () {
    //                 return {
    //                     smallImage: issuerPublishInfo.smallImage,
    //                     username: issuerPublishInfo.username,
    //                     id: issuerPublishInfo.id
    //                 };
    //             }
    //         }
    //     });
    // }

    // 发行管理
    $scope.openIssuerPublishModel = function (issuerPublishInfo) {
        // 获取发行人的发行管理信息
        if (issuerPublishInfo.total_circulation <= 0) {
            var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'issuerpublishinfo.html',
                    controller: 'IssuerPublishInfoModelCtrl',
                    backdrop: 'static',
                    size:'lg',//弹出框的大小
                    resolve: {
                        issuerPublishInfo: function () {
                            return {
                                smallImage: issuerPublishInfo.smallImage,
                                username: issuerPublishInfo.username,
                                id: issuerPublishInfo.id
                            };
                        }
                    }
                });
                modalInstance.result.then(onModalClose, onModalDismiss);
        } else {
            $http.get(UTIL_FACTORY.IP + '/api/admin/issueinfo', {params:{id: issuerPublishInfo.id}})
                .then(function (res) {
                    if (res.data.status !== 1) {
                        return;
                    }
                    res.data.data.smallImage = issuerPublishInfo.smallImage;
                    res.data.data.username = issuerPublishInfo.username;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'issuerpublishinfo.html',
                        controller: 'IssuerPublishInfoModelCtrl',
                        backdrop: 'static',
                        size:'lg',//弹出框的大小
                        resolve: {
                            issuerPublishInfo: function () {
                                return res.data.data;
                            }
                        }
                    });
                    modalInstance.result.then(onModalClose, onModalDismiss);
                }),function (err) {
                    console.log('server error:' + err);
                }
        }
        // 窗口内容填写正常后,关闭,则向服务器提交表单
        function onModalClose(info) {
            if (info.circulation > 0) {
                // 修改发行人的发行管理信息
                $http.post(UTIL_FACTORY.IP + '/api/admin/updateissue', $.param(info), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
                    .then(function (res) {
                        if (res.data.status !== 1) {
                            alert(res.data.msg + "!");
                            return;
                        }
                        alert("修改成功！");
                        $scope.updateCurrPageissuer();
                    },function (err) {
                        console.log('server error:' + err);
                    })
            } else {
                // 编辑发行人的发行管理信息
                $http.post(UTIL_FACTORY.IP + '/api/admin/savepublish', $.param(info), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
                    .then(function (res) {
                        if (res.data.status !== 1) {
                            alert("编辑失败！");
                            return;
                        }
                        alert("编辑成功！");
                        $scope.updateCurrPageissuer();
                    },function (err) {
                        console.log('server error:' + err);
                    })
            }
        };
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        };
        
    };

}]);

// 发行管理
angular.module('MainModule').controller('IssuerPublishInfoModelCtrl', function ($http, $scope, $uibModal, $uibModalInstance, issuerPublishInfo) {
    $scope.issuerPublishInfo = {
        launch: (issuerPublishInfo.launch - issuerPublishInfo.launch%86400 + 48600)*1000 || '',
        start: new Date((issuerPublishInfo.start - issuerPublishInfo.start%86400 - 28800)*1000),
        end: new Date((issuerPublishInfo.end - issuerPublishInfo.end%86400 - 28800)*1000),
        quantity: issuerPublishInfo.quantity || 0,
        price: issuerPublishInfo.price,
        smallImage: issuerPublishInfo.smallImage,
        username: issuerPublishInfo.username
    };
    var getIssuerDataListinfo = function () {
        $http.post(UTIL_FACTORY.IP + '/api/admin/applycount', $.param({id: issuerPublishInfo.id}), UTIL_FACTORY.CROSS_ORIGIN_HEADER)
            .then(function (res) {
                if (res.data.status !== 1) {
                    return;
                }
                $scope.getIssuerDataListinfo = res.data.data;
                $scope.getIssuerDataListinfo.issuer_id = issuerPublishInfo.issuer_id;
                $scope.getIssuerDataListinfo.username = issuerPublishInfo.username;
                $scope.getIssuerDataListinfo.smallImage = issuerPublishInfo.smallImage;
            },function (err) {
                console.log('server error:' + err);
            })
    }
    getIssuerDataListinfo();

    // 打开数据明细
    $scope.openDateListModel = function () {
        if (!issuerPublishInfo.issuer_id) {
            return
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'issuerdatalistinfo.html',
            controller: 'IssuerDataListInfoModelCtrl',
            backdrop: 'static',
            size:'lg',//弹出框的大小
            resolve: {
                IssuerDataListInfo: function () {
                    return $scope.getIssuerDataListinfo;
                }
            }
        });
        // 窗口内容填写正常后,关闭,则向服务器提交表单
        function onModalClose(info) {

        };
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        }
        modalInstance.result.then(onModalClose, onModalDismiss);
    };

    // 生成上市时间
    $scope.getMarketTime = function () {
        $scope.issuerPublishInfo.launch = +new Date($scope.issuerPublishInfo.end) + 77400000;
    };

    $scope.submitlogout = function () {
        var info = {
            id: issuerPublishInfo.id,
            lanuch_time: +new Date($scope.issuerPublishInfo.launch)/1000,
            start_apply: (+new Date($scope.issuerPublishInfo.start) + 75600000)/1000,
            end_apply: (+new Date($scope.issuerPublishInfo.end) + 75600000)/1000,
            circulation: $scope.issuerPublishInfo.quantity,
            price: $scope.issuerPublishInfo.price
        }
        if (issuerPublishInfo.issuer_id) {
            info.id = issuerPublishInfo.issuer_id
        }
        // console.log(new Date(info.end_apply*1000));
        // return
        $uibModalInstance.close(info);
    };

    $scope.cancelLogOutModel = function () {
        $uibModalInstance.dismiss('cancel');
        // $scope.isshow = !isshow;
    };
});

// 申购明细
angular.module('MainModule').controller('IssuerDataListInfoModelCtrl', function ($scope, $uibModalInstance, $http, IssuerDataListInfo) {
    $scope.issuerData = IssuerDataListInfo;
    // 申购订单分页信息
    $scope.issuerSubscribeOrderPagination = {
        totalIssuerSubscribeOrder: 0, // 所有申购订单的数量
        maxSize: 3,         // 页面显示个数
        currPage: 1,        // 当前页码
        issuerSubscribeOrderLimit: 30   // 每个页面中显示的申购订单数量
    };

    // 请求申购订单列表
    var requireIssuerSubscribeOrderList = function (offset) {
        var queryDoc = {
            id: IssuerDataListInfo.issuer_id,
            offset: offset,
            limit: $scope.issuerSubscribeOrderPagination.issuerSubscribeOrderLimit
        };
        $http.get(UTIL_FACTORY.IP + '/api/admin/issuerdetail', {params: queryDoc})
            .then(function (res) {
                if (res.data.status !== 1) {
                    return;
                }
                $scope.issuerSubscribeOrderList = res.data.data.list;
            },function (err) {
                console.log('server error:' + err);
            })
    };

    // 进入界面，从0开始来获取相应的申购订单列表
    requireIssuerSubscribeOrderList(0);

    // 更新当前页面的申购订单列表
    $scope.updateCurrPageIssuerOrder = function () {
        var from = ($scope.issuerSubscribeOrderPagination.currPage - 1) * $scope.issuerSubscribeOrderPagination.issuerSubscribeOrderLimit;
        requireIssuerSubscribeOrderList(from);
    };

    // 申购用户分页信息
    $scope.issuerSubscribeUserPagination = {
        totalissuer: 0, // 所有申购用户的数量
        maxSize: 3,         // 页面显示个数
        currPage: 1,        // 当前页码
        issuerSubscribeUserLimit: 30   // 每个页面中显示的申购用户数量
    };

     // 请求申购用户列表
    var requireIssuerSubscribeUserList = function (offset) {
        var queryDoc = {
            id: IssuerDataListInfo.issuer_id,
            offset: offset,
            limit: $scope.issuerSubscribeUserPagination.issuerSubscribeUserLimit
        };
        $http.get(UTIL_FACTORY.IP + '/api/admin/issuercount', {params: queryDoc})
            .then(function (res) {
                if (res.data.status !== 1) {
                    return;
                }
                $scope.issuerSubscribeUserList = res.data.data.list;
            },function (err) {
                console.log('server error:' + err);
            })
    };

    // 进入界面，从0开始来获取相应的申购订单列表
    requireIssuerSubscribeUserList(0);

    // 更新当前页面的申购订单列表
    $scope.updateCurrPageIssuerUser = function () {
        var from = ($scope.issuerSubscribeUserPagination.currPage - 1) * $scope.issuerSubscribeUserPagination.issuerSubscribeUserLimit;
        requireIssuerSubscribeUserList(from);
    };

    $scope.cancelLogOutModel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

// 资料管理
angular.module('MainModule').controller('IssuerInfoModelCtrl', function ($scope, $uibModalInstance, issuerInfo) {

    var setNumber = function (a,b) {
        return a-b;
    };
    $scope.issuer = {
        smallImage: issuerInfo.smallImage,
        username: issuerInfo.username,
        category: issuerInfo.category.toString(),
        birthday: new Date(issuerInfo.birthday*1000),
        gender: issuerInfo.gender.toString(),
        nation: issuerInfo.nation,
        city: issuerInfo.city,
        job: issuerInfo.job,
        attestation: issuerInfo.attestation,
        hobby: issuerInfo.hobby,
        presentation: issuerInfo.presentation,
        experience: issuerInfo.experience,
        achievement: issuerInfo.achievement,
        id: issuerInfo.id
    };
    $scope.typeArray = [
        {id: 0, name: '请选择'},
        {id: 2, name: '颜值'},
        {id: 1, name: '达人'}
    ];
    $scope.sexArray = [
        {id: 1, name: '男'},
        {id: 0, name: '女'}
    ];
    $scope.tags = issuerInfo.reservationList;//返回时间适用范围的数组  看电影 吃饭 唱歌
    $scope.selected = [];
    if (!issuerInfo.range_ids) {//每次点击资料管理的时间
        issuerInfo.range_ids = [];
    }
    issuerInfo.range_ids.forEach(function (item) {//资料管理每次取消更改的时间
        $scope.selected.push(item - 0);
    });
    //实际操作数组的方法
    var updateSelected = function (action, id, name) {
        if (action === 'add' && $scope.selected.indexOf(id) == -1) {  
            $scope.selected.push(id);
        }
        if (action === 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
        }
        return $scope.selected;
    };

    //根据传入的动作和要操作的id更新Array
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, checkbox.name);//时间适用范围的内容  看电影  
    };

    //返回true false
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    $scope.submitlogout = function () {
        if ($scope.issuer.category == 0) {
            alert("分类未选择");
            return;
        }
        if (!$scope.issuer.birthday) {
            alert("生日不能未空");
            return;
        }
        if (!$scope.issuer.gender) {
            alert("性别未选择");
            return;
        }
        if ($scope.selected.length === 0) {
            alert("使用范围未选择");
            return;
        }
        var info = {
            id: issuerInfo.id,
            category: parseInt($scope.issuer.category),
            birthday: +new Date($scope.issuer.birthday)/1000,
            gender: parseInt($scope.issuer.gender),
            range_ids: $scope.selected.sort(setNumber).join(","),
            username: $scope.issuer.username,
            nation: $scope.issuer.nation,
            city: $scope.issuer.city,
            job: $scope.issuer.job,
            attestation: $scope.issuer.attestation,
            presentation: $scope.issuer.presentation,
            experience: $scope.issuer.experience,
            achievement: $scope.issuer.achievement,
            hobby: $scope.issuer.hobby
        }
        $uibModalInstance.close(info);
    };

    $scope.cancelLogOutModel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log($scope.issuer.presentation);
        console.log($scope.issuer);
    };
});


// $scope.openIssuerInfoModel = function (issuerInfo) {
//     var modalInstance = $uibModal.open({
//         animation: true,
//         templateUrl: 'issuerinfo.html',
//         controller: 'IssuerInfoModelCtrl',
//         backdrop: false,
//         size:'lg',//弹出框的大小
//         resolve: {
//             issuerInfo: function () {
//                 return issuerInfo;
//             }
//         }
//     });


// 内容管理
angular.module('MainModule').controller('ArticleMenuController', function ($scope, $uibModalInstance, $http, IssuerDataListInfo) {
    // // 文章管理   发布
    // $scope.releaseModel = function (releaseInfo) {
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'postBox.html',
    //         controller: 'ArticleMenuController',
    //         backdrop: 'static',
    //         size:'lg',//弹出框的大小
    //         resolve: {
    //             issuerInfo: function () {
    //                 return releaseInfo;
    //             }
    //         }
    //     });
    // }
});
