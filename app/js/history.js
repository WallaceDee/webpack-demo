//api/v1/order/by_user
//订单状态 
//-1已关闭 ！
//0待支付！
//1已支付 ！
//2已超时 x
//3退款中 x
//4已退款x
//5已取消！

const template = require('../template/history.art')
$(document).ready(function($) {

    var page = 1;
    var size = 10;

    var opt = {};
    opt.itemsPerLoad = size;
    opt.page = page;
    opt.maxItems = 0;
    opt.lastIndex = 0;
    opt.loading = false;
    opt.ele = $("#page-history");

    addItem(opt);

    $("#page-history").infinite().on("infinite", function() {
        var self = this;
        if (opt.loading) return;
        opt.loading = true;
        addItem(opt);
    });



    function addItem(opt) {
        $._ajax({
            type: "get",
            url: domain + "/api/v1/order/by_user",
            data: {
                page: opt.page,
                size: opt.itemsPerLoad
            },
            success: function(data) {
                opt.ele.find("ul").append(template(data));
                console.log(data);
                opt.lastIndex = opt.ele.find('ul>li').length;
                opt.maxItems = data.total;
                if (opt.lastIndex >= opt.maxItems) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    opt.ele.destroyInfinite();
                    // 删除加载提示符
                    opt.ele.find(".weui-loadmore").remove();
                }
                opt.page++;
                opt.loading = false;

            }
        });
    }

    $(document).on('click', '#page-history .pay-btn', function(event) {
        event.preventDefault();
        /* Act on the event */
        var curr_id = $(this).parents(".weui-form-preview").data("id");
        $._ajax({
            url: domain + "/api/v1/pay/pre_order",
            data: { id: curr_id },
            success: function(data) {
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function(res) {
                        console.log(res);
                        $.toast("支付成功", function() {
                                window.location.href = "user_center.html"
                        });
                    }
                });
            }
        });
    });



    $(document).on('click', '#page-history .cancel-btn', function(event) {
        event.preventDefault();
        var curr_id = $(this).parents(".weui-form-preview").data("id");
        $._ajax({
            url: domain + "/api/v1/order/cancel",
            data: { id: curr_id },
            success: function(data) {
                console.log(data);
                $.toast("取消成功",function(){      window.location.reload();});
          
            }
        });

    });

    $(document).on('click', '#page-history .close-btn', function(event) {
        event.preventDefault();
        var curr_id = $(this).parents(".weui-form-preview").data("id");
        $._ajax({
            url: domain + "/api/v1/order/close",
            data: { id: curr_id },
            success: function(data) {
                console.log(data);
                  $.toast("关闭成功",function(){      window.location.reload();});
            }
        });

    });




});