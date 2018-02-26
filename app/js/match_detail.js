const template = require('../template/match_detail.art')

$(document).ready(function($) {

    if (!is_member) {
        $.modal({
            text: "您目前还不是建东会员，无法报名参赛！",
            buttons: [{
                    text: "去开通",
                    onClick: function() {
                        location.href = "vip.html";
                    }
                },
                {
                    text: "绑定手机",
                    onClick: function() {
                        location.href = "bind.html";
                    }
                },
                {
                    text: "返回",
                    onClick: function() {
                        history.back();
                    }
                }
            ]
        });
        return false;
    }


    var curr_id = $.getParameter("id");
    $._ajax({
        type: "get",
        url: domain + "/api/v1/competition/" + curr_id,
        success: function(data) {
            $("#page-match-detail").html(template(data));
        }
    });

    $(document).on('click', '.weui-btn_primary', function(event) {
        event.preventDefault();
        /* Act on the event */
        $.confirm("您确定要报名参加这个赛事?", function() {
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