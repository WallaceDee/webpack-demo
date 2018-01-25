import 'weui/dist/style/weui.css' //使用require导入css文件
import 'jquery-weui/dist/css/jquery-weui.css' //使用require导入css文件
import '../css/style.css' //使用require导入css文件
import 'jquery-weui/dist/js/jquery-weui.min.js'
import { domain } from 'config'
window.domain = domain;
var curr_url = window.location.href.split('#')[0];
var get_code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxba58edcce1726b50&redirect_uri=" + curr_url + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

(function($) {
    "use strict";
    $.extend($.fn, {
        validate: function() {
            var is_pass = true;
            this.each(function() {
                if ($(this).attr("required") !== undefined) { //html的pattern要注意转义
                    if ($(this).val() === "") {
                        $.toast($(this).attr("emptyTips"), "cancel");
                        is_pass = false;
                        return false;
                    } else {
                        if ($(this).attr("pattern") !== undefined) { //html的pattern要注意转义
                            var reg = new RegExp($(this).attr("pattern"));
                            if (!reg.test($(this).val())) {
                                $.toast($(this).attr("notMatchTips"), "cancel");
                                is_pass = false;
                                return false;
                            }
                        }
                    }
                }
            });
            return is_pass;
        }
    });
    //    $.getScript = function(url, callback) {
    //    };

    $.getCache = function(name, isSession) {
        var result = null;
        if (isSession === undefined || isSession === false) {
            result = JSON.parse(localStorage.getItem(name));
        } else {
            result = JSON.parse(sessionStorage.getItem(name));
        }
        return result;
    }

    $.setCache = function(name, object, isSession) {
        if (isSession === undefined || isSession === false) {
            localStorage.setItem(name, JSON.stringify(object));
        } else {
            sessionStorage.setItem(name, JSON.stringify(object));
        }
    }

    $.getParameter = function(key) {
        var url = window.location.search;
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = url.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }
    $._ajax = function(option) {
        var default_opt = {
            type: "post",
            url: "",
            data: null,
            dataType: "json",
            async: true,
            success: function(data) {
                console.log(data);
            },
            showLoader: false
        };
        var opt = $.extend(default_opt, option);
        return $.ajax({
            type: opt.type,
            url: opt.url,
            headers: { token: token },
            data: opt.data,
            dataType: opt.dataType,
            async: opt.async,
            beforeSend: function() {
                if (opt.showLoader) {
                    $.showLoading();
                }
            },
            success: function(data) {
                opt.success(data);
                if (opt.showLoader) {
                    $.hideLoading();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status === 401) { //统一处理token过期
                    console.log(11111111111111111111);
                    $.setCache("token", null);
                    window.location.href = get_code_url;
                }
                console.error(XMLHttpRequest.status + "-" + XMLHttpRequest.readyState + "-" + textStatus + "-" + errorThrown);
            }
        });
    }
})($);







var token = "";

if ($.getCache("token") !== null) {
    token = $.getCache("token");
} else {
    var code = $.getParameter("code");
    if (code === null) {
        window.location.href = get_code_url;
    }
    console.log(code);
    token = $._ajax({
        url: domain + "/api/v1/token/user",
        async: false,
        data: {
            code: code
        },
        success: function(data) {
            if (data.token !== undefined) {
                $.setCache("token", data.token);
            }
        }
    }).responseJSON.token;

    console.log("window.token=" + token);
}