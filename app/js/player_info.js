import 'art-template-filter'
const template = require('../template/player_info.art')

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
            text: "您目前还不是建东会员，暂无球员信息",
            buttons: buttons
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