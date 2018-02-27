$(document).ready(function($) {
    var $phone = $("input[name='telephone']");
    var $code = $("input[name='code']");
    $(document).on('click', '.weui-vcode-btn', function(event) {
        event.preventDefault();
        /* Act on the event */
        var btn = $(this);
        var flag = $phone.validate();
        if (flag) {
            $._ajax({
                url: domain + "/api/v1/identify/code",
                data: {
                    phone: $phone.val()
                },
                success: function(data) {
                    console.log(data);
                    if (data.error_code === 0) {
                        $.toptip(data.msg, "success");
                        var count = 60;
                        btn.addClass('disabled');
                        var resend = setInterval(function() {
                            count--;
                            if (count > 0) {
                                btn.html(count + "s后重新获取");
                                $.setCookie("captcha", count, count * 1000);
                            } else {
                                clearInterval(resend);
                                btn.html("获取验证码").removeClass('disabled').removeAttr('disabled');
                            }
                        }, 1000);
                        btn.prop('disabled', true);
                    }
                }
            });
        }
    });

    $(document).on('click', '.weui-btn_primary', function(event) {
        event.preventDefault();
        /* Act on the event */
        var flag = $("input[name='telephone'],input[name='code']").validate();
        if (flag) {
            $._ajax({
                url: domain + "/api/v1/user/bind",
                data: {
                    phone: $phone.val(),
                    code: $code.val()
                },
                success: function(data) {
                    console.log(data);
                    if (data.error_code === 0) {
                        $.toptip(data.msg, "success");
                    }
                    setTimeout(function() { history.back(); }, 3000);
                }
            });
        }
    });

    /*防止刷新：检测是否存在cookie*/
    if ($.getCookie("captcha")) {
        //bug 修复 关闭浏览器倒计时继续，
        // var count = $.getCookie("captcha");
        var real = JSON.parse(localStorage.getItem("captcha"));
        var count = Math.ceil((real.expires - new Date().getTime()) / 1000);

        var btn = $('.weui-vcode-btn');
        btn.addClass('disabled');
        btn.html(count + 's后重新获取').prop('disabled', true);
        var resend = setInterval(function() {
            count--;
            if (count > 0) {
                btn.html(count + 's后重新获取').prop('disabled', true);
                $.setCookie("captcha", count, count * 1000);
            } else {
                clearInterval(resend);
                btn.html("获取验证码").removeClass('disabled').removeAttr('disabled');
            }
        }, 1000);
    }


});