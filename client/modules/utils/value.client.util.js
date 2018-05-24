// 域名解析
var isDomain = function (host) {
    if (host.indexOf(':') !== -1) {
        if (host === 'localhost:3017' || host === '192.168.4.151:3017') {
            host = 'http://47.95.226.243';
        } else {
            host = 'http://' + host.split(':')[0] + ':3011';
        }
    } else {
        // host = 'https://lhapi.idoool.com';
    }
    return host;
};

// 获取当前页面URl里面的参数
var parseUrl2Obj = function (url) {
    var ret = {};
    if (url.indexOf("?") !== -1) {
        url = url.substr(url.indexOf("?") + 1);
        var strs = url.split("&");
        strs.forEach(function (str) {
            var paramStr = str.split("=");
            ret[paramStr[0]] = (paramStr[1]);
        });
    }
    return ret;
};

// 跨域head设置
var CROSS_ORIGIN_HEADER = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
};

// 获取cookie
var getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
        return decodeURIComponent(document.cookie.substring(c_start, c_end));
        }
    }
    return;
};

// 设置cookie
var setCookie = function (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/client";
};

//返回的值
var UTIL_FACTORY = {
    IP: isDomain(window.location.host),
    parseUrl2Obj: parseUrl2Obj(window.location.href),
    CROSS_ORIGIN_HEADER: CROSS_ORIGIN_HEADER,
    getCookie: getCookie,
    setCookie: setCookie
};