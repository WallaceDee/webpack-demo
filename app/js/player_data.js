 const template = require('../template/player_data.art')

 $(document).ready(function($) {
    var buttons = [{
            text: "去开通",
            onClick: function() {
                location.href = "vip.html";
            }
        },
        {
            text: "返回",
            onClick: function() {
                history.back();
            }
        }
    ];
    if (!hasMobile) {
        buttons.splice(1, 0, {
            text: "绑定手机",
            onClick: function() {
                location.href = "bind.html";
            }
        });

    }
    
    if (!is_member) {
        $.modal({
            text: "您目前还不是建东会员，暂无球员数据分析",
            buttons: buttons
        });
        return false;
    }

     var team = $._ajax({
         async: false,
         type: "get",
         url: domain + "/api/v1/team/by_user"
     }).responseJSON;
     team.data = team;
     team.type = 0;
     console.log(template(team));
     $("#page-player-data>ul").html(template(team));

     var winH = $(window).height();
     var categorySpace = 10;


     $('.js_category').on('click', function() {
         var $this = $(this),
             $inner = $this.next('.js_categoryInner'),
             $page = $this.parents('#page-player-data'),
             $parent = $(this).parent('li'),
             curr_id = $this.data("id");
         var innerH = $inner.data('height');
         
         //请求一次后，防止多余请求
         if ($this.attr("data-id") !== undefined) {
             var competitions = $._ajax({
                 async: false,
                 type: "get",
                 url: domain + "/api/v1/team/" + curr_id + "/competitions"
             }).responseJSON;
             competitions.data = competitions;
             competitions.type = 1;
             $this.next().find(".page__category-content").html(template(competitions));
             $this.removeAttr("data-id");
         }

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