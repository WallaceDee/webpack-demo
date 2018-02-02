import 'video.js/dist/video-js.css'
import videojs from 'video.js/dist/video.min.js'
// import 'video.js/dist/lang/zh-CN.js'
import 'imports-loader?videojs=video.js/dist/video.cjs.js!video.js/dist/lang/zh-CN'
//loader
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper/dist/js/swiper.min.js'
import '../lib/webSocketInit.js'
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
        url: 'ws://120.79.146.180:19830',
        onOpen: function(e) {
            console.log("链接成功");
        },
        onMessage: function(e) {
            var received_msg = e.data;
            $(".messages-auto-layout").append('<div>' + received_msg + '</div>');

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
            content: $("textarea").val(),
            username: userInfo.username,
            head_img: userInfo.head_img
        };
        msg = JSON.stringify(msg);
        ws.send(msg);
        // var temp = analyticEmotion(msg);
        // console.log(temp);
    });

    //表情插件
    var emoji_list = [{ code: 'wx', name: "微笑", path: 'emoji/1.gif' }, { code: 'pz', name: "撇嘴", path: 'emoji/2.gif' }, { code: 'se', name: "色", path: 'emoji/3.gif' }, { code: 'fd', name: "发呆", path: 'emoji/4.gif' }, { code: 'dy', name: "得意", path: 'emoji/5.gif' }, { code: 'll', name: "流泪", path: 'emoji/6.gif' }, { code: 'hx', name: "害羞", path: 'emoji/7.gif' }, { code: 'bz', name: "闭嘴", path: 'emoji/8.gif' }, { code: 'shui', name: "睡", path: 'emoji/9.gif' }, { code: 'dk', name: "大哭", path: 'emoji/10.gif' }, { code: 'gg', name: "尴尬", path: 'emoji/11.gif' }, { code: 'fn', name: "发怒", path: 'emoji/12.gif' }, { code: 'tp', name: "调皮", path: 'emoji/13.gif' }, { code: 'cy', name: "呲牙", path: 'emoji/14.gif' }, { code: 'jy', name: "惊讶", path: 'emoji/15.gif' }, { code: 'ng', name: "难过", path: 'emoji/16.gif' }, { code: 'kuk', name: "酷", path: 'emoji/17.gif' }, { code: 'lengh', name: "冷汗", path: 'emoji/18.gif' }, { code: 'zk', name: "抓狂", path: 'emoji/19.gif' }, { code: 'tuu', name: "吐", path: 'emoji/20.gif' }, { code: 'tx', name: "偷笑", path: 'emoji/21.gif' }, { code: 'ka', name: "可爱", path: 'emoji/22.gif' }, { code: 'baiy', name: "白眼", path: 'emoji/23.gif' }, { code: 'am', name: "傲慢", path: 'emoji/24.gif' }, { code: 'jie', name: "饥饿", path: 'emoji/25.gif' }, { code: 'kun', name: "困", path: 'emoji/26.gif' }, { code: 'jk', name: "惊恐", path: 'emoji/27.gif' }, { code: 'lh', name: "流汗", path: 'emoji/28.gif' }, { code: 'hanx', name: "憨笑", path: 'emoji/29.gif' }, { code: 'db', name: "大兵", path: 'emoji/30.gif' }, { code: 'fendou', name: "奋斗", path: 'emoji/31.gif' }, { code: 'zhm', name: "咒骂", path: 'emoji/32.gif' }, { code: 'yiw', name: "疑问", path: 'emoji/33.gif' }, { code: 'xu', name: "嘘..", path: 'emoji/34.gif' }, { code: 'yun', name: "晕", path: 'emoji/35.gif' }, { code: 'zhem', name: "折磨", path: 'emoji/36.gif' }, { code: 'shuai', name: "衰", path: 'emoji/37.gif' }, { code: 'kl', name: "骷髅", path: 'emoji/38.gif' }, { code: 'qiao', name: "敲打", path: 'emoji/39.gif' }, { code: 'zj', name: "再见", path: 'emoji/40.gif' }, { code: 'ch', name: "擦汗", path: 'emoji/41.gif' }, { code: 'kb', name: "抠鼻", path: 'emoji/42.gif' }, { code: 'zhem', name: "鼓掌", path: 'emoji/43.gif' }, { code: 'qd', name: "糗大了", path: 'emoji/44.gif' }, { code: 'huaix', name: "坏笑", path: 'emoji/45.gif' }, { code: 'zhh', name: "左哼哼", path: 'emoji/46.gif' }, { code: 'yhh', name: "右哼哼", path: 'emoji/47.gif' }, { code: 'hq', name: "哈欠", path: 'emoji/48.gif' }, { code: 'bs', name: "鄙视", path: 'emoji/49.gif' }, { code: 'wq', name: "委屈", path: 'emoji/50.gif' }, { code: 'kk', name: "快哭了", path: 'emoji/51.gif' }, { code: 'yx', name: "阴险", path: 'emoji/52.gif' }, { code: 'qq', name: "亲亲", path: 'emoji/53.gif' }, { code: 'xia', name: "吓", path: 'emoji/54.gif' }, { code: 'kel', name: "可怜", path: 'emoji/55.gif' }, { code: 'cd', name: "菜刀", path: 'emoji/56.gif' }, { code: 'xig', name: "西瓜", path: 'emoji/57.gif' }, { code: 'pj', name: "啤酒", path: 'emoji/58.gif' }, { code: 'lq', name: "篮球", path: 'emoji/59.gif' }, { code: 'pp', name: "乒乓", path: 'emoji/60.gif' }, { code: 'kf', name: "咖啡", path: 'emoji/61.gif' }, { code: 'fan', name: "饭", path: 'emoji/62.gif' }, { code: 'zt', name: "猪头", path: 'emoji/63.gif' }, { code: 'mg', name: "玫瑰", path: 'emoji/64.gif' }, { code: 'dx', name: "凋谢", path: 'emoji/65.gif' }, { code: 'sa', name: "示爱", path: 'emoji/66.gif' }, { code: 'xin', name: "爱心", path: 'emoji/67.gif' }, { code: 'xs', name: "心碎", path: 'emoji/68.gif' }, { code: 'dg', name: "蛋糕", path: 'emoji/69.gif' }, { code: 'shd', name: "闪电", path: 'emoji/70.gif' }, { code: 'zhd', name: "炸弹", path: 'emoji/71.gif' }, { code: 'dao', name: "刀", path: 'emoji/72.gif' }, { code: 'zq', name: "足球", path: 'emoji/73.gif' }, { code: 'pch', name: "瓢虫", path: 'emoji/74.gif' }, { code: 'bb', name: "便便", path: 'emoji/75.gif' }, { code: 'yl', name: "月亮", path: 'emoji/76.gif' }, { code: 'ty', name: "太阳", path: 'emoji/77.gif' }, { code: 'lw', name: "礼物", path: 'emoji/78.gif' }, { code: 'yb', name: "拥抱", path: 'emoji/79.gif' }, { code: 'qiang', name: "强", path: 'emoji/80.gif' }, { code: 'ruo', name: "弱", path: 'emoji/81.gif' }, { code: 'ws', name: "握手", path: 'emoji/82.gif' }, { code: 'shl', name: "胜利", path: 'emoji/83.gif' }, { code: 'bq', name: "抱拳", path: 'emoji/84.gif' }, { code: 'gy', name: "勾引", path: 'emoji/85.gif' }, { code: 'qt', name: "拳头", path: 'emoji/86.gif' }, { code: 'cj', name: "差劲", path: 'emoji/87.gif' }, { code: 'aini', name: "爱你", path: 'emoji/88.gif' }, { code: 'bu', name: "NO", path: 'emoji/89.gif' }, { code: 'hd', name: "OK", path: 'emoji/90.gif' }, { code: 'aiq', name: "爱情", path: 'emoji/91.gif' }, { code: 'fw', name: "飞吻", path: 'emoji/92.gif' }, { code: 'tiao', name: "跳跳", path: 'emoji/93.gif' }, { code: 'fad', name: "发抖", path: 'emoji/94.gif' }, { code: 'oh', name: "怄火", path: 'emoji/95.gif' }, { code: 'zhq', name: "转圈", path: 'emoji/96.gif' }, { code: 'kt', name: "磕头", path: 'emoji/97.gif' }, { code: 'ht', name: "回头", path: 'emoji/98.gif' }, { code: 'tsh', name: "跳绳", path: 'emoji/99.gif' }, { code: 'hsh', name: "挥手", path: 'emoji/100.gif' }, { code: 'jd', name: "激动", path: 'emoji/101.gif' }, { code: 'jw', name: "街舞", path: 'emoji/102.gif' }, { code: 'xw', name: "献吻", path: 'emoji/103.gif' }, { code: 'zuotj', name: "左太极", path: 'emoji/104.gif' }, { code: 'youtj', name: "右太极", path: 'emoji/105.gif' }, { code: 'shx', name: "双喜", path: 'emoji/106.gif' }, { code: 'bp', name: "鞭炮", path: 'emoji/107.gif' }, { code: 'dl', name: "灯笼", path: 'emoji/108.gif' }, { code: 'fc', name: "发财", path: 'emoji/109.gif' }, { code: 'kg', name: "K歌", path: 'emoji/110.gif' }, { code: 'gw', name: "购物", path: 'emoji/111.gif' }, { code: 'yj', name: "邮件", path: 'emoji/112.gif' }, { code: 'zshuai', name: "主帅", path: 'emoji/113.gif' }, { code: 'hec', name: "喝彩", path: 'emoji/114.gif' }, { code: 'qidao', name: "祈祷", path: 'emoji/115.gif' }, { code: 'baojin', name: "爆筋", path: 'emoji/116.gif' }, { code: 'bangbangt', name: "棒棒糖", path: 'emoji/117.gif' }, { code: 'hn', name: "喝奶", path: 'emoji/118.gif' }, { code: 'xiam', name: "下面", path: 'emoji/119.gif' }, { code: 'xiangj', name: "吃蕉", path: 'emoji/120.gif' }, { code: 'fj', name: "飞机", path: 'emoji/121.gif' }, { code: 'jiaoc', name: "轿车", path: 'emoji/122.gif' }, { code: 'zuohc', name: "左火车", path: 'emoji/123.gif' }, { code: 'chex', name: "车厢", path: 'emoji/124.gif' }, { code: 'youhc', name: "右火车", path: 'emoji/125.gif' }, { code: 'dyun', name: "多云", path: 'emoji/126.gif' }, { code: 'xiayu', name: "下雨", path: 'emoji/127.gif' }, { code: 'cp', name: "钞票", path: 'emoji/128.gif' }, { code: 'xm', name: "熊猫", path: 'emoji/129.gif' }, { code: 'dengp', name: "灯泡", path: 'emoji/130.gif' }, { code: 'fengc', name: "风车", path: 'emoji/131.gif' }, { code: 'naoz', name: "闹钟", path: 'emoji/132.gif' }, { code: 'yus', name: "雨伞", path: 'emoji/133.gif' }, { code: 'qq', name: "气球", path: 'emoji/134.gif' }, { code: 'zuanj', name: "钻戒", path: 'emoji/135.gif' }, { code: 'sf', name: "沙发", path: 'emoji/136.gif' }, { code: 'zhij', name: "纸巾", path: 'emoji/137.gif' }, { code: 'yao', name: "药", path: 'emoji/138.gif' }, { code: 'shq', name: "手枪", path: 'emoji/139.gif' }, { code: 'qw', name: "青蛙", path: 'emoji/140.gif' }];
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
                    var reStr = "<img class=\"emoji\" src=\"src/" + emojiHT.get(k) + "\"/>";
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
            $scroller.scrollTop(h);
        $("#page-live").removeClass('opened-emoji-wrapper');
    });;
    //endof表情插件

});