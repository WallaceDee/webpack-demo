//api/v1/order/by_user
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
            	console.log(666666666666666666666);
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
});