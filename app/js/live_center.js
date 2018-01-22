 $(document).ready(function() {

     function loadmoreReInit(ele) {
          $(ele).destroyInfinite();
         if ($(ele).find('.weui-loadmore').length === 0) {
             var loadmore_html = '<div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span></div>';
             $(ele).append(loadmore_html);
         }
         $(ele).infinite();
     }


     $(".weui-tab__bd-item").infinite().on("infinite", function() {
         var self = this;
         self.itemsPerLoad = 20;
         self.maxItems = 10;
         self.lastIndex = $(self).find('.cards-list li.card').length;

         if (self.loading) return;
         self.loading = true;
         setTimeout(function() {

             $(self).find(".content ul").append('<li class="card">\
                                <div class="card-header">卡头</div>\
                                <div class="card-content">\
                                    <div class="card-content-inner">卡内容</div>\
                                </div>\
                                <div class="card-footer">卡脚</div>\
                            </li>');

             self.loading = false;
             self.lastIndex = $(self).find('.cards-list li.card').length;
             console.log(self.lastIndex + "---------------");
             console.log(self.maxItems + "---------------");
             console.log("---------------");
             console.log(self.lastIndex >= self.maxItems);
             console.log("---------------");
             if (self.lastIndex >= self.maxItems) {
                 // 加载完毕，则注销无限加载事件，以防不必要的加载
                 $(self).destroyInfinite();
                 // 删除加载提示符
                 $(self).find(".weui-loadmore").remove();
                 return;
             }

         }, 1000); //模拟延迟
     });


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

         }, 2000)
     })

 });