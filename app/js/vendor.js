import 'weui/dist/style/weui.min.css'; //使用require导入css文件
import 'jquery-weui/dist/css/jquery-weui.css'; //使用require导入css文件
import '../css/style.css'; //使用require导入css文件
import 'jquery-weui/dist/js/jquery-weui.min.js'
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
})($);