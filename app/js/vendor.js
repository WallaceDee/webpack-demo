// import 'weui/dist/style/weui.css' //使用require导入css文件
// import 'jquery-weui/dist/css/jquery-weui.css' //使用require导入css文件
// import '../css/style.css' //使用require导入css文件
import 'jquery-weui/dist/js/jquery-weui.min.js'
import { domain } from 'config'
const no_data_tips_html = require('../template/no_data_tips.art')

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




;
(function($) {
    "use strict";
    $.extend($.fn, {
        validate: function() {
            var is_pass = true;
            this.each(function() {
                if ($(this).attr("required") !== undefined) { //html的pattern要注意转义
                    if ($(this).val() === "") {
                        $.toptip($(this).attr("emptyTips"), "error");
                        is_pass = false;
                        return false;
                    }
                }
                if ($(this).attr("pattern") !== undefined && $(this).val() !== "") { //html的pattern要注意转义  斜杠 转义
                    var reg = new RegExp($(this).attr("pattern"));
                    console.log(reg);
                    console.log(reg.test($(this).val()));
                    if (!reg.test($(this).val())) {
                        $.toptip($(this).attr("notMatchTips"), "error");
                        is_pass = false;
                        return false;
                    }
                }
            });
            return is_pass;
        }
    });
    $.device = function() {
        var device = {};
        var ua = navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
        if (android) {
            device.os = 'android';
            device.osVersion = android[2];
            device.android = true;
            device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
        }
        if (ipad || iphone || ipod) {
            device.os = 'ios';
            device.ios = true;
        }
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.');
            device.iphone = true;
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.');
            device.ipad = true;
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            device.iphone = true;
        }
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }
        device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        if (device.os && device.os === 'ios') {
            var osVersionArr = device.osVersion.split('.');
            device.minimalUi = !device.webView &&
                (ipod || iphone) &&
                (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
        }
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        device.statusBar = false;
        if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
            device.statusBar = true;
        } else {
            device.statusBar = false;
        }
        var classNames = [];
        device.pixelRatio = window.devicePixelRatio || 1;
        classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
        if (device.pixelRatio >= 2) {
            classNames.push('retina');
        }
        if (device.os) {
            classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
            if (device.os === 'ios') {
                var major = parseInt(device.osVersion.split('.')[0], 10);
                for (var i = major - 1; i >= 6; i--) {
                    classNames.push('ios-gt-' + i);
                }
            }
        }
        if (device.statusBar) {
            classNames.push('with-statusbar-overlay');
        } else {
            $('html').removeClass('with-statusbar-overlay');
        }
        if (classNames.length > 0) $('html').addClass(classNames.join(' '));
        device.isWeixin = /MicroMessenger/i.test(ua);
        return device;
    };
    $.getCache = function(name, isSession) {
        var result = null;
        if (isSession === true) {
            result = JSON.parse(sessionStorage.getItem(name));
        } else {
            result = JSON.parse(localStorage.getItem(name));
        }
        return result;
    }

    $.setCache = function(name, object, isSession) {
        if (isSession === true) {
            sessionStorage.setItem(name, JSON.stringify(object));
        } else {
            localStorage.setItem(name, JSON.stringify(object));
        }
    }
    /**
     * 设置cookie
     * @param {[type]} key   [键名]
     * @param {[type]} value [键值]
     * @param {[type]} ms  [保存的时间（天）]
     */
    $.setCookie = function(key, value, es) {
        // 设置过期原则
        if (!value) {
            localStorage.removeItem(key);
        } else {
            var expires = es || 7 * 24 * 60 * 60 * 1000; // 默认保留7天
            var exp = new Date();
            localStorage.setItem(key, JSON.stringify({ value, expires: exp.getTime() + expires,createtime:exp.getTime() }));
        }
    }
    $.getCookie = function(name) {
        if (localStorage.getItem(name) !== null) {
            var o = JSON.parse(localStorage.getItem(name));
            if (!o || o.expires < Date.now()) {
                localStorage.removeItem(name);
                return null;
            } else {
                return o.value;
            }
        } else {
            return null;
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

            },
            error: function(data) {

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
			cache:false,
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
                console.log(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                opt.error(XMLHttpRequest);
                //统一处理错误
                var data = XMLHttpRequest.responseJSON;
                var error_code = data.error_code;
                var msg = data.msg;
                //token过期
                if (XMLHttpRequest.status === 401) {
                    if (error_code === 10003) {
                        $.setCache("token", null);
                        window.location.href = get_code_url;
                    }


                }
                //
                if (XMLHttpRequest.status === 404) {
                    if (error_code === 30003 && $("#page-player-data").length === 1) {
                        $.toptip(msg, "warning");
                        $("#page-player-data").html(no_data_tips_html());
                    }
                    if (error_code === 10004 && $("#page-service-desc").length === 1) {
                        $.toast(msg, "text", function() {
                            window.location.href = "bind.html";
                        });
                    }
                }
                console.error(XMLHttpRequest.status + "-" + XMLHttpRequest.readyState + "-" + textStatus + "-" + errorThrown);
            }
        });
    }
})($);
window.device = $.device();
// window.onpageshow = function(e) {
//     if (e.persisted) {
//         window.location.reload(true)
//     }
// }




window.token = "";

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
window.is_member = $._ajax({
    async: false,
    type: "get",
    url: domain + "/api/v1/user/info"
}).responseJSON.member_status === 1;

$("body").append('<div class="actGotop"><a href="javascript:;" title="返回顶部"><i class="icon-top"></i></a></div>');

$("#page-live-center .weui-tab__bd-item").scroll(function() {		
		if($(this).scrollTop() >= 100){
			$('.actGotop').fadeIn(300); 
		}else{    
			$('.actGotop').fadeOut(300);    
		}  
	});
	$('.actGotop').click(function(){
	$("#page-live-center .weui-tab__bd-item").animate({scrollTop: '0px'}, 800);});	




$._ajax({
    url: domain + "/api/v1/wxconfig",
    async: false,
    data: {
        cur_url: encodeURIComponent(curr_url),
    },
    success: function(data) {
        console.log(data);
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
    }
});