import { protocol } from 'config'
$(document).ready(function($) {
    //"protocol":[{"type":1,"title":"建东体育服务协议","code":"service_agreement"},{"type":2,"title":"建东体育网视频购买观看协议","code":"purchase_agreement"},{"type":3,"title":"建东体育尊享会员服务协议","code":"membership_agreement"}],
    var type = $.getParameter("type");
    var code = "";
    var title = "";
    var index = 0;

    for (var i = 0; i < protocol.length; i++) {
        if (type == protocol[i].type) {
            index = i;
            break;
        }
    }
    code = protocol[index].code;
    title = protocol[index].title;

    $._ajax({
        url: domain + "/api/v1/config/value",
        data: {
            code: [code],
            tags: 1
        },
        success: function(data) {
            document.title = title;
            $("#page-protocol article").html(data[code]);
        }
    });
});