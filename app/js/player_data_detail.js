const template = require('../template/player_data_detail.art')

$(document).ready(function($) {

    var curr_id = $.getParameter("id");
    $._ajax({
        type: "get",
        url: domain + "/api/v1/competition/" + curr_id,
        success: function(data) {
            $("#page-player-data-detail").html(template(data));
        }
    });



});