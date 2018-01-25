import 'art-template-filter'
const template = require('../template/user_center.art')
// const template = require('../template/index.art')
// const text = 'Hello World!'
// document.getElementById('wrapper').innerHTML = template({ text: text });

$(document).ready(function($) {

    $._ajax({
        type: "get",
        url: domain + "/api/v1/user/info",
        success: function(data) {
            console.log(data);
            $("#page-user-center").html(template(data));
        }
    });
});