const template = require('../template/vip.art')

$(document).ready(function() {
    var is_member = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/user/info"
    }).responseJSON.is_member;

    $._ajax({
        type: "get",
        url: domain + "/api/v1/member/info",
        success: function(data) {
            console.log(data);
            data.is_member=is_member;
            $("#page-vip").html(template(data));
        }
    });
});