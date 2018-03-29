const template = require('../template/service_desc.art')

$(document).ready(function($) {
    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/business/joinus"
    }).responseJSON;
    data.is_member = is_member;
    $("#page-service-desc").html(template(data));

    $(document).on("click", "#page-service-desc .weui-btn_primary", function() {
        var isAgree = $("#page-service-desc #weuiAgree").prop("checked");
        if (!isAgree) {
            $.toptip("请先阅读《建东体育服务协议》及《视频购买观看协议》及《英东体育尊享会员服务协议》，同意上述协议", "warning");
            return false;
        }
        var order = $._ajax({
            async: false,
            url: domain + "/api/v1/order/commit",
            data: {
                business_id: data.id,
                name: data.title
            }
        }).responseJSON;
        if (order.error_code === 10011) {
            $.modal({
                text: "您还没绑定手机号码！",
                buttons: [{
                        text: "去绑定",
                        onClick: function() {
                            location.href = "bind.html";
                        }
                    },
                    {
                        text: "返回",
                        onClick: function() {
                        }
                    }
                ]
            });
        } else {
            $._ajax({
                url: domain + "/api/v1/pay/pre_order",
                data: { id: order.id },
                success: function(data) {
                    wx.chooseWXPay({
                        timestamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success: function(res) {
                            console.log(res);
                            $.toast("支付成功", function() {
                                window.location.href = "user_center.html"
                            });
                        }
                    });
                }
            });
        }

    });


});