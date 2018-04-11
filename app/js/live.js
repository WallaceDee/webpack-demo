import 'video.js/dist/video-js.css'
import videojs from 'video.js/dist/video.min.js'
// import 'video.js/dist/lang/zh-CN.js'
import 'imports-loader?videojs=video.js/dist/video.cjs.js!video.js/dist/lang/zh-CN'
//loader
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper/dist/js/swiper.min.js'
import webSocketInit from '../lib/webSocketInit.js'
import { emojiData } from 'config'
import { emojiPath } from 'config'
import { webSocketUrl } from 'config'
import 'art-template-filter'
const template = require('../template/live.art')
const msg_template = require('../template/message.art')

$(document).ready(function() {
    //curr_room当前房间号
    var curr_room = $.getParameter("id");

    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/competitionlive/" + curr_room
    }).responseJSON;
    data.isAndroid = $.device().android;
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
        url: webSocketUrl,
        onOpen: function(e) {
            console.log(e);
            console.log("链接成功");
            var msg = {
                type: "SEND_ALL",
                room_id: "99999999",
                // connect_id: userInfo.mobile,
                content: "6",
            };
            console.log(msg);
            ws.send(JSON.stringify(msg));

        },
        onMessage: function(MessageEvent) {
            var msg = MessageEvent.data;
            console.log(typeof(MessageEvent.data));
            console.log(msg === "@heart");
            if (msg === "@heart") {

            } else {
                console.log(msg);
                //todo 
                var received_data = JSON.parse(msg);
                if (received_data.onlinenum!==undefined) {
                    $("#page-live .online-nums span,#page-live .android-nums").html(received_data.onlinenum);
                }
                if (received_data.room_id === curr_room && received_data.type != "OnLine") {
                    $("#page-live .messages-auto-layout").append(msg_template(received_data));
                    $("#page-live .messages-wrapper").finish().animate({ "scrollTop": $('#page-live .messages-wrapper')[0].scrollHeight }, 1000);
                    var $temp = $("#page-live .messages-wrapper .message-appear-from-bottom");
                    setTimeout(function() {
                        $temp.removeClass("message-appear-from-bottom");
                    }, 1000);
                    if ($("#page-live .messages-auto-layout").children().length > 200) {
                        $("#page-live .messages-auto-layout").children().eq(0).remove();
                    }
                    var temp = []; //
                    if ($.getCache("message") !== null) {
                        temp = JSON.parse($.getCache("message"));
                    }
                    temp.push(received_data);
                    $.setCache("message", JSON.stringify(temp));

                } else {
                    //不是当前房间号的对话
                }
            }

        }
    });
    // $("#page-live .message").on('click', '.selector', function(event) {
    //     event.preventDefault();
    //     /* Act on the event */
    // });
    var heartCheck = {
        timeout: 20000, //计时器设定为20s
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function() {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            this.start();
        },
        start: function() {
            var self = this;
            this.timeoutObj = setTimeout(function() {
                //向服务器发送ping消息
                pingToServer();
                //计算答复的超时时间
                self.serverTimeoutObj = setTimeout(function() {
                    //如果调用onclose会执行reconnect，导致重连两次，因此直接调用close()关闭连接
                    websocket.close();
                }, self.timeout);
            }, this.timeout);
        }
    };

    $(".send-btn").click(function(event) {
        /* Act on the event */
        // var msg=$("textarea").val();
        // {“type”:”SEND_ONE”,”room_id”:”1”,”connect_id”:”1”,”content”:”扑街”,”username”:”caicaizi”,”head_img”:”http://www.michellelee.top/tmp/upload/20180105/dsfadfafadfa.jpg”}
        var msg = {
            type: "SEND_ALL",
            room_id: curr_room,
            // connect_id: userInfo.mobile,
            content: analyticEmotion($("textarea").val()),
            user: {
                username: userInfo.username,
                head_img: userInfo.head_img
            }
        };
        console.log(msg);
        ws.send(JSON.stringify(msg));
        $("textarea").val("");
        // var temp = analyticEmotion(msg);
        // console.log(temp);
    });

    //表情插件
    var emojiHT = new Hashtable();
    var temp = "";
    var result = "";
    for (var i = 0; i < emojiData.length; i++) {
        emojiHT.put(emojiData[i].name, emojiData[i].path);
        if (i === 0) {
            temp += '<div class="swiper-slide"><ul>';
        } else if (i % 24 === 0) {
            temp += '</ul></div><div class="swiper-slide"><ul>';
        }
        temp += '<li data-emoji="[' + emojiData[i].name + ']"><span><em style="background-position: 0px ' + -2 * i + 'em;"></em></span></li>';
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
        // if ($("#page-live").hasClass('opened-emoji-wrapper')) {
        //     $("#page-live .messages-wrapper").finish().animate({ "scrollTop": $('#page-live .messages-wrapper')[0].scrollHeight }, 1000);
        // }
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
        if (str !== "") {
            var sArr = str.match(/\[.*?\]/g);
            if (sArr !== null) {
                for (var i = 0; i < sArr.length; i++) {
                    var k = sArr[i].replace(/\[|]/g, '')
                    if (emojiHT.containsKey(k)) {
                        var reStr = '<img class="emoji" src="' + emojiPath + emojiHT.get(k) + '"/>';
                        str = str.replace(sArr[i], reStr);
                    }
                }
            }
        }
        return str;
    }

    function setHeight(element) {
        $(element).css("height", $(element).data("origin-height") + "px"); //不可逆的特征检测，只能每次重置，修改高度
        if (element.scrollHeight < $(element).data("origin-height") + 1) {
            return false;
        }
        $(element).css({ 'height': 'auto', 'overflow-y': 'hidden' }).height(element.scrollHeight);
    }
    $('textarea').each(function() {
        setHeight(this);
    }).on('input', function() {
        setHeight(this);
    }).on('focus', function() {
        var $scroller = $(document);
        var h = $(document).height();
        if ($("#page-live").hasClass('opened-emoji-wrapper')) {
            $scroller.scrollTop(h);
        }
        $("#page-live").removeClass('opened-emoji-wrapper');
    });;
    //endof表情插件

    if ($.getCache("message") !== null) {
        var message = JSON.parse($.getCache("message"));
        for (var i = 0; i < message.length; i++) {
            $("#page-live .messages-auto-layout").append(msg_template(message[i]));
            $("#page-live .messages-wrapper").finish().animate({ "scrollTop": $('#page-live .messages-wrapper')[0].scrollHeight }, 1000);
            var $temp = $("#page-live .messages-wrapper .message-appear-from-bottom");
            setTimeout(function() {
                $temp.removeClass("message-appear-from-bottom");
            }, 1000);
        }
    }
    // checkOnline();
    // setInterval(checkOnline, 30000);
    // function checkOnline() {
    //     $._ajax({
    //         type:'get',
    //         url: domain + "/api/v1/competition/online/"+curr_room,
    //         success: function(data) {
    //             console.log(data.TotalUserNumber);
    //             if(Number(ata.TotalUserNumber)>0){
    //             $("#page-live .online-nums span,#page-live.android-nums").html(data.TotalUserNumber);
    //             }
    //         }
    //     });
    // }
    //

});