import 'video.js/dist/video-js.css'
import videojs from 'video.js/dist/video.min.js'
// import 'video.js/dist/lang/zh-CN.js'
import 'imports-loader?videojs=video.js/dist/video.cjs.js!video.js/dist/lang/zh-CN'
//loader
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper/dist/js/swiper.min.js'
import webSocketInit from '../lib/webSocketInit.js'
import { emoji as emoji_list } from 'config'

const template = require('../template/live.art')
const msg_template = require('../template/message.art')

$(document).ready(function() {
    var curr_id = $.getParameter("id");
    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/competitionlive/" + curr_id
    }).responseJSON;
    console.log(data);
    $("#page-live").html(template(data));


    window.player = videojs("video", {
        language: "zh-CN",
        techOrder: ["html5"],
        children: ["mediaLoader", "loadingSpinner", "bigPlayButton", "controlBar"],
        controlBar: {
            children: ["playToggle", "progressControl", "liveDisplay", "fullscreenToggle"]
        }
    });

    var userInfo = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/user/info"
    }).responseJSON;

    var ws = webSocketInit({
        url: 'ws://120.79.146.180:19840',
        onOpen: function(e) {
            console.log(e);
            console.log("链接成功");
        },
        onMessage: function(e) {
            var received_data = JSON.parse(e.data);
            $("#page-live .messages-auto-layout").append(msg_template(received_data));
        }
    })


    $(".send-btn").click(function(event) {
        /* Act on the event */
        // var msg=$("textarea").val();
        // {“type”:”SEND_ONE”,”room_id”:”1”,”connect_id”:”1”,”content”:”扑街”,”username”:”caicaizi”,”head_img”:”http://www.michellelee.top/tmp/upload/20180105/dsfadfafadfa.jpg”}
        var msg = {
            type: "SEND_ALL",
            room_id: curr_id,
            connect_id: userInfo.mobile,
            content:analyticEmotion($("textarea").val()),
            username: userInfo.username,
            head_img: userInfo.head_img
        };
        msg = JSON.stringify(msg);
        ws.send(msg);
        $("textarea").val("");
        // var temp = analyticEmotion(msg);
        // console.log(temp);
    });

    //表情插件
    var emojiHT = new Hashtable();
    var temp = "";
    var result = "";
    for (var i = 0; i < emoji_list.length; i++) {
        emojiHT.put(emoji_list[i].name, emoji_list[i].path);
        if (i === 0) {
            temp += '<div class="swiper-slide"><ul>';
        } else if (i % 24 === 0) {
            temp += '</ul></div><div class="swiper-slide"><ul>';
        }
        temp += '<li data-emoji="[' + emoji_list[i].name + ']"><span><em style="background-position: 0px ' + -2 * i + 'em;"></em></span></li>';
    }
    temp += '</ul></div>';
    $(".swiper-wrapper").append(temp);
    var swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
        },
    });

    $(".emoji-btn").click(function(event) {
        /* Act on the event */
        $("#page-live").toggleClass('opened-emoji-wrapper');
    });


    $(".emoji-wrapper").on("click", "li", function(event) {　
        event.preventDefault();　　
        event.stopPropagation();
        console.log($(this).data("emoji"));
        var txtArea = $("textarea")[0];
        var content = txtArea.value;
        var start = txtArea.selectionStart; //初始位置
        txtArea.value = content.substring(0, txtArea.selectionStart) + $(this).data("emoji") + content.substring(txtArea.selectionEnd, content.length);
        var position = start + $(this).data("emoji").length;
        txtArea.setSelectionRange(position, position);
        setHeight($('textarea')[0]);
    });

    function Hashtable() {
        this._hash = new Object();
        this.put = function(key, value) {
            if (typeof(key) != "undefined") {
                if (this.containsKey(key) == false) {
                    this._hash[key] = typeof(value) == "undefined" ? null : value;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        this.containsKey = function(key) { return typeof(this._hash[key]) != "undefined"; }
        this.get = function(key) { return this._hash[key]; }
    }
    //替换表情
    function analyticEmotion(str) {
        if (typeof(str) != "undefined") {
            var sArr = str.match(/\[.*?\]/g);
            for (var i = 0; i < sArr.length; i++) {
                var k = sArr[i].replace(/\[|]/g, '')
                if (emojiHT.containsKey(k)) {
                    var reStr = "<img class=\"emoji\" src=\"/h5/images/" + emojiHT.get(k) + "\"/>";
                    str = str.replace(sArr[i], reStr);
                }
            }
        }
        return str;
    }

    function setHeight(element) {
        if (element.scrollHeight < $(element).data("origin-height") + 1) return;
        $(element).css({ 'height': 'auto', 'overflow-y': 'hidden' }).height(element.scrollHeight);
    }
    $('textarea').each(function() {
        setHeight(this);
    }).on('input', function() {
        setHeight(this);
    }).on('focus', function() {
        var $scroller = $(document);
        var h = $(document).height();
        if ($("#page-live").hasClass('opened-emoji-wrapper'))
        {
            $scroller.scrollTop(h);
        }
        $("#page-live").removeClass('opened-emoji-wrapper');
    });;
    //endof表情插件

});