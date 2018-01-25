$(document).ready(function($) {

    $._ajax({
        type: "get",
        url: domain + "/api/v1/member/info",
        success: function(data) {
            console.log(data);
        }
    });
});