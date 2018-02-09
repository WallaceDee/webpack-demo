 const template = require('../template/player_data.art')

 $(document).ready(function($) {
     var is_member = $._ajax({
         async: false,
         type: "get",
         url: domain + "/api/v1/user/info"
     }).responseJSON.member_status === 1;

     if (!is_member) {
         $.modal({
             text: "您目前还不是建东会员，暂无球员数据分析",
             buttons: [{
                     text: "去开通",
                     onClick: function() {
                         location.href = "vip.html";
                     }
                 },
                 {
                     text: "绑定手机",
                     onClick: function() {
                         location.href = "bind.html";
                     }
                 },
                 {
                     text: "返回",
                     onClick: function() {
                         history.back();
                     }
                 }
             ]
         });
         return false;
     }


     var data = $._ajax({
         async: false,
         type: "get",
         url: domain + "/api/v1/competition/by_member"
     }).responseJSON;

     console.log(template({ data }));
     $("#page-player-data .content ul").html(template({ data }));

     var winH = $(window).height();
     var categorySpace = 10;


     $('.js_category').on('click', function() {
         var $this = $(this),
             $inner = $this.next('.js_categoryInner'),
             $page = $this.parents('#page-player-data'),
             $parent = $(this).parent('li');
         var innerH = $inner.data('height');


         if (!innerH) {
             $inner.css('height', 'auto');
             innerH = $inner.height();
             $inner.removeAttr('style');
             $inner.data('height', innerH);
         }

         if ($parent.hasClass('js_show')) {
             $parent.removeClass('js_show');
         } else {
             $parent.siblings().removeClass('js_show');

             $parent.addClass('js_show');
             if (this.offsetTop + this.offsetHeight + innerH > $page.scrollTop() + winH) {
                 var scrollTop = this.offsetTop + this.offsetHeight + innerH - winH + categorySpace;

                 if (scrollTop > this.offsetTop) {
                     scrollTop = this.offsetTop - categorySpace;
                 }
                 $page.scrollTop(scrollTop);
             }
         }
     });

 });