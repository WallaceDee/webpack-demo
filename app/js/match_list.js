const template = require('../template/match_list.art')
//#page height=100%
$(document).ready(function($) {
    var page = 1;
    var size = 10;

    var opt = {};
    opt.itemsPerLoad = size;
    opt.page = page;
    opt.maxItems = 0;
    opt.lastIndex = 0;
    opt.loading = false;
    opt.ele = $("#page-match-list.list-block");

    addItem(opt);

    $("#page-match-list.list-block").infinite().on("infinite", function() {
        var self = this;
        if (opt.loading) return;
        opt.loading = true;
        addItem(opt);
    });



    function addItem(opt) {
        $._ajax({
            type: "get",
            url: domain + "/api/v1/competition/begins",
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


$("#page-match-list").on('click', '.weui-btn_primary', function(event) {
    event.preventDefault();
    /* Act on the event */
    console.log(1);
    var $curr=$(this).parents("a.item-content");
    var curr_title=$curr.find('.item-title').text();
    var curr_id=$curr.find('button').data("id");
     $.confirm("您确定要报名参加 "+curr_title+" 这个赛事吗?", function() {
            $._ajax({
                url: domain + "/api/v1/competition/apply",
                data: {
                    id: curr_id
                },
                success: function(data) {
                    if (data.error_code === 0) {
                        $.toast("报名成功", function() {
                            console.log('报名成功');
                        });
                    }
                }
            });
        }, function() {
            //取消操作
        });
});

       
});