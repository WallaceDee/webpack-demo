import 'art-template-filter'
const template = require('../template/player_info.art')

$(document).ready(function($) {
    var is_member = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/user/info"
    }).responseJSON.member_status===1;

    if (!is_member) {
        $.modal({
            text: "您目前还不是建东会员，暂无球员信息",
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


    $._ajax({
        type: "get",
        url: domain + "/api/v1/member/info",
        success: function(data) {
            console.log(data);
            $("#page-player-info").html(template(data));
        }
    });
});