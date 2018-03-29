const template = require('../template/match_list.art')
const no_data_tips_html = require('../template/no_data_tips.art')
//#page height=100%
$(document).ready(function($) {
    var buttons = [{
            text: "去开通",
            onClick: function() {
                location.href = "vip.html";
            }
        },
        {
            text: "返回",
            onClick: function() {
                history.back();
            }
        }
    ];
    if (!hasMobile) {
        buttons.splice(1, 0, {
            text: "绑定手机",
            onClick: function() {
                location.href = "bind.html";
            }
        });

    }
    if (!is_member) {
        $.modal({
            text: "您目前还不是建东会员，暂无球员数据分析",
            buttons: buttons
        });
        return false;
    }

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
                if (data.total === 0) {
                    opt.ele.html(no_data_tips_html());
                    return false;
                }
            }
        });
    }


    $("#page-match-list").on('click', '.weui-btn_primary', function(event) {
        event.preventDefault();
        /* Act on the event */
        var $curr = $(this).parents("a.item-content");
        var curr_title = $curr.find('.item-title').text();
        var curr_id = $curr.find('button').data("id");
        var $btn = $(this);
        if (!$btn.hasClass("weui-btn_disabled")) {
            $.confirm("您确定要报名参加 " + curr_title + " 这个赛事吗?", function() {
                $._ajax({
                    url: domain + "/api/v1/competition/apply/commit",
                    data: {
                        id: curr_id
                    },
                    success: function(data) {
                        if (data.error_code === 0) {
                            $.toast("报名成功", function() {
                                $btn.html("取消").addClass("weui-btn_disabled");
                                console.log('报名成功');
                            });
                        }
                    }
                });
            }, function() {
                //取消操作
            });
        } else {

            $.confirm("您确定要取消参加 " + curr_title + " 这个赛事吗?", function() {
                $._ajax({
                    url: domain + "/api/v1/competition/apply/cancel",
                    data: {
                        id: curr_id
                    },
                    success: function(data) {
                        if (data.error_code === 0) {
                            $.toast("取消成功", function() {
                                $btn.html("报名").removeClass("weui-btn_disabled");
                                console.log('取消报名成功');
                            });
                        }
                    }
                });
            }, function() {
                //取消操作
            });

        }




    });


});