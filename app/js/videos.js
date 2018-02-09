import 'video.js/dist/video-js.css'
import videojs from 'video.js/dist/video.min.js'
// import 'video.js/dist/lang/zh-CN.js'
import 'imports-loader?videojs=video.js/dist/video.cjs.js!video.js/dist/lang/zh-CN'

const template = require('../template/videos.art')
$(document).ready(function() {
    var curr_id = $.getParameter("id");
    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/competitionvideo/" + curr_id
    }).responseJSON;
    console.log(data);
    var curr_type = data.type == 3 ? 2 : 1;
    $("#page-videos").html(template(data));


    window.player = videojs("video", {
        language: "zh-CN",
        techOrder: ["html5"],
        children: ["mediaLoader", "loadingSpinner", "bigPlayButton", "controlBar"],
        controlBar: {
            children: ["playToggle", "progressControl", "liveDisplay", "fullscreenToggle"]
        }
    });

    player.on("firstplay", function(e) {
        console.log(e);
        $._ajax({
            url: domain + "/api/v1/competition/play_notify",
            data: {
                id: curr_id,
                type: curr_type
            }
        });
    });

});