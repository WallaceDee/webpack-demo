import 'video.js/dist/video-js.css'
import 'video.js/dist/video.js'
import 'video.js/dist/lang/zh-CN.js'
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper/dist/js/swiper.min.js'
$(document).ready(function() {

    window.player = videojs("video", {
        language: "zh-CN",
        techOrder: ["html5"],
        children: ["mediaLoader", "loadingSpinner", "bigPlayButton", "controlBar"],
        controlBar: {
            children: ["playToggle", "progressControl", "liveDisplay", "fullscreenToggle"]
        }
    });

    var emoji_list = [{
        code: 'wx',
        name: "微笑",
        path: 'emoji/1.gif'
    }, {
        code: 'pz',
        name: "撇嘴",
        path: 'emoji/2.gif'
    }, {
        code: 'se',
        name: "色",
        path: 'emoji/3.gif'
    }, {
        code: 'fd',
        name: "发呆",
        path: 'emoji/4.gif'
    }, {
        code: 'dy',
        name: "得意",
        path: 'emoji/5.gif'
    }, {
        code: 'll',
        name: "流泪",
        path: 'emoji/6.gif'
    }, {
        code: 'hx',
        name: "害羞",
        path: 'emoji/7.gif'
    }, {
        code: 'bz',
        name: "闭嘴",
        path: 'emoji/8.gif'
    }, {
        code: 'shui',
        name: "睡",
        path: 'emoji/9.gif'
    }, {
        code: 'dk',
        name: "大哭",
        path: 'emoji/10.gif'
    }, {
        code: 'gg',
        name: "尴尬",
        path: 'emoji/11.gif'
    }, {
        code: 'fn',
        name: "发怒",
        path: 'emoji/12.gif'
    }, {
        code: 'tp',
        name: "调皮",
        path: 'emoji/13.gif'
    }, {
        code: 'cy',
        name: "呲牙",
        path: 'emoji/14.gif'
    }, {
        code: 'jy',
        name: "惊讶",
        path: 'emoji/15.gif'
    }, {
        code: 'ng',
        name: "难过",
        path: 'emoji/16.gif'
    }, {
        code: 'kuk',
        name: "酷",
        path: 'emoji/17.gif'
    }, {
        code: 'lengh',
        name: "冷汗",
        path: 'emoji/18.gif'
    }, {
        code: 'zk',
        name: "抓狂",
        path: 'emoji/19.gif'
    }, {
        code: 'tuu',
        name: "吐",
        path: 'emoji/20.gif'
    }, {
        code: 'tx',
        name: "偷笑",
        path: 'emoji/21.gif'
    }, {
        code: 'ka',
        name: "可爱",
        path: 'emoji/22.gif'
    }, {
        code: 'baiy',
        name: "白眼",
        path: 'emoji/23.gif'
    }, {
        code: 'am',
        name: "傲慢",
        path: 'emoji/24.gif'
    }, {
        code: 'jie',
        name: "饥饿",
        path: 'emoji/25.gif'
    }, {
        code: 'kun',
        name: "困",
        path: 'emoji/26.gif'
    }, {
        code: 'jk',
        name: "惊恐",
        path: 'emoji/27.gif'
    }, {
        code: 'lh',
        name: "流汗",
        path: 'emoji/28.gif'
    }, {
        code: 'hanx',
        name: "憨笑",
        path: 'emoji/29.gif'
    }, {
        code: 'db',
        name: "大兵",
        path: 'emoji/30.gif'
    }, {
        code: 'fendou',
        name: "奋斗",
        path: 'emoji/31.gif'
    }, {
        code: 'zhm',
        name: "咒骂",
        path: 'emoji/32.gif'
    }, {
        code: 'yiw',
        name: "疑问",
        path: 'emoji/33.gif'
    }, {
        code: 'xu',
        name: "嘘..",
        path: 'emoji/34.gif'
    }, {
        code: 'yun',
        name: "晕",
        path: 'emoji/35.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }, {
        code: 'zhem',
        name: "折磨",
        path: 'emoji/36.gif'
    }];

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
        temp += '<li data-emoji="['+emoji_list[i].name+']"><span><img src="src/' + emoji_list[i].path + '" alt="" /></span></li>';
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

        $(".emoji-wrapper").toggleClass('open');
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

            setHeight( $('textarea')[0]);

    });

 function Hashtable() {
    this._hash = new Object();
    this.put = function(key, value) {
        if (typeof (key) != "undefined") {
            if (this.containsKey(key) == false) {
                this._hash[key] = typeof (value) == "undefined" ? null : value;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    this.containsKey = function(key) { return typeof (this._hash[key]) != "undefined"; }
    this.get = function(key) { return this._hash[key]; }
}

//替换表情
function analyticEmotion(str) {
	if(typeof (str) != "undefined") {
		var sArr = str.match(/\[.*?\]/g);
		for(var i = 0; i < sArr.length; i++){
			var k=sArr[i].replace(/\[|]/g,'')
			if(emojiHT.containsKey(k)) {
				var reStr = "<img src=\"src/" + emojiHT.get(k)+"\"/>";
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
        if ($(".emoji-wrapper").hasClass('open'))
      $scroller.scrollTop(h);
        $(".emoji-wrapper").removeClass('open');
    });;




$(".send-btn").click(function(event) {
	/* Act on the event */
var temp=analyticEmotion($("textarea").val());
console.log(temp);
});



});