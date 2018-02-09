$(document).ready(function($) {
    var webInfo = {};
    webInfo = $._ajax({
        async: false,
        url: domain + "/api/v1/config/value",
        data: {
            code: ["copyright", "ICP","index_title","description", "seo_title"],
            tags: 0
        }
    }).responseJSON;


    $("#page-index").html(template(webInfo));

});