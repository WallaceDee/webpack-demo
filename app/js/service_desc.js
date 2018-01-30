const template = require('../template/service_desc.art')

$(document).ready(function($) {
    $._ajax({
        type: "get",
        url: domain + "/api/v1/business/joinus",
        success:function(data){
        	console.log(data);
        	$("#page-service-desc").html(template(data));
        }
    })



});