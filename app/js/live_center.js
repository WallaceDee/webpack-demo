 const template = require('../template/live_center.art')

 $(document).ready(function() {



     function loadmoreReInit(ele) {
         $(ele).destroyInfinite();
         if ($(ele).find('.weui-loadmore').length === 0) {
             var loadmore_html = '<div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span></div>';
             $(ele).append(loadmore_html);
         }
         $(ele).infinite();
     }


     var page = 1;
     var size = 5;


     function creatTabSetting($ele) {

         var opt = {};
         opt.itemsPerLoad = size;
         opt.page = page;
         opt.maxItems = 0;
         opt.lastIndex = 0;
         opt.loading = false;
         opt.ele = $ele;
         return opt;
     }

     var tab_setting = [];

     $(".weui-tab__bd-item").each(function(index, el) {
         tab_setting[index] = creatTabSetting($(this));
         addItem(tab_setting[index]);
     });


     $(".weui-tab__bd-item").infinite().on("infinite", function() {
         var self = this;
         self.opt = creatTabSetting($(self));

         var self = this;
         if (self.opt.loading) return;
         self.opt.loading = true;
         addItem(self.opt);


     });




     function addItem(opt) {
         $._ajax({
             async: false,
             type: "get",
             url: domain + "/api/v1/competition/begins",
             data: {
                 page: opt.page,
                 size: opt.itemsPerLoad
             },
             success: function(data) {
                 opt.ele.find('.cards-list>ul').append(template(data));
                 console.log(data);

                 opt.lastIndex = opt.ele.find('.cards-list>ul>li').length;
                 opt.maxItems = data.total;

                 if (opt.lastIndex >= opt.maxItems) {
                     // 加载完毕，则注销无限加载事件，以防不必要的加载
                     opt.ele.destroyInfinite();
                     // 删除加载提示符
                     opt.ele.find(".weui-loadmore").remove();
                 } else {
                     opt.page++;
                     opt.loading = false;
                 }
             }
         });
     }


     $('.weui-tab__bd-item').pullToRefresh().on('pull-to-refresh', function(done) {
         var self = this;

         setTimeout(function() {
             $(self).find('.cards-list li.card').each(function(index, el) {
                 if (index > 5) {
                     $(el).remove();
                 }
             });
             loadmoreReInit(self);
             $(self).pullToRefreshDone();
         }, 2000);
     })

 });