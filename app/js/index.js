const template = require('../template/index.art')


$(document).ready(function($) {
    var webInfo = {};
    webInfo.copyright = $._ajax({
        async: false,
        url: domain + "/api/v1/config/value",
        data: {
            code: "copyright",
            tags: 0
        }
    }).responseJSON.value;

    webInfo.ICP = $._ajax({
        async: false,
        url: domain + "/api/v1/config/value",
        data: {
            code: "ICP",
            tags: 0
        }
    }).responseJSON.value;

    webInfo.description = $._ajax({
        async: false,
        url: domain + "/api/v1/config/value",
        data: {
            code: "description",
            tags: 0
        }
    }).responseJSON.value;

 $("#page-index").html(template(webInfo));

});