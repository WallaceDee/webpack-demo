const template = require('../template/player_data_detail.art')

$(document).ready(function($) {

    var curr_id = $.getParameter("id");

    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/competition/" + curr_id
    }).responseJSON;

    $("#page-player-data-detail").html(template(data));

    $("#page-player-data-detail").on('click', 'img', function(event) {
        event.preventDefault();
        /* Act on the event */
        var preview_list = [];
        $("#page-player-data-detail img").each(function() {
            var path = $(this).attr("src");
            preview_list.push((path.indexOf("http") === -1 ? domain : "") + $(this).attr("src"));
        });
        var index = $("#page-player-data-detail img").index(this);
        console.log(JSON.stringify(preview_list));
        wx.previewImage({
            current: preview_list[index],
            urls: preview_list
        });

    });


});