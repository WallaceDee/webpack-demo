const template = require('../template/service_desc.art')

$(document).ready(function($) {
    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/business/joinus"
    }).responseJSON;
    $("#page-service-desc").html(template(data));



    $(document).on("click", "#page-service-desc .weui-btn_primary", function() {
        var order = $._ajax({
            async: false,
            url: domain + "/api/v1/order/commit",
            data: {
                business_id: data.id,
                name: data.title
            }
        }).responseJSON;
        $._ajax({
            url: "http://www.michellelee.top/api/v1/pay/pre_order",
            data: { id: order.id },
            success: function(data) {
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function(res) {
                        // 支付成功后的回调函数
                        //                        location.href = '';
                        console.log(res);
                        $.toast("支付成功", function() {
                                window.location.href = "user_center.html"
                        });
                    }
                });
            }
        });
    });


});