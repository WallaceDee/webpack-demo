 const template = require('../template/live_center.art')

 $(document).ready(function() {


     function loadmoreReInit($ele) {
         $ele.destroyInfinite();
         if ($ele.find('.weui-loadmore').length === 0) {
             var loadmore_html = '<div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span></div>';
             $ele.append(loadmore_html);
         }
         $ele.infinite();
     }


     var page = 1;
     var size = 5;

     //生成单个的tab上拉加载初始参数
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
     //each循环初始化
     $(".weui-tab__bd-item").each(function(index, el) {
         tab_setting[index] = creatTabSetting($(this));
         addItem(tab_setting[index]);
     });

     $(".weui-tab__bd-item").infinite().on("infinite", function() {

         var i = $(this).index();
         var self = tab_setting[i];
         if (self.loading) return;
         self.loading = true;
         addItem(self);
     });




     function addItem(opt, callback1, callback2) {
         $._ajax({
             url: domain + opt.ele.data("url") + "?page=" + opt.page + "&size=" + opt.itemsPerLoad,
             data: {
                 type: opt.ele.data("type")
             },
             success: function(data) {
                 if (callback1 !== undefined) {
                     callback1();
                 }

                 opt.ele.find('.cards-list>ul').append(template(data));
                 console.log(data);
                 if (callback2 !== undefined) {
                     callback2();
                 }

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
         var i = $(self).index();
         tab_setting[i] = creatTabSetting($(self));

         addItem(tab_setting[i], function() {
                 console.log(1);
                 $(self).find(".cards-list.content>ul").html("");
             },
             function() {
                 loadmoreReInit($(self));
                 $(self).pullToRefreshDone();
             });

     });


     $(function() {
         var $searchBar = $('#searchBar'),
             $searchResult = $('#searchResult'),
             $searchText = $('#searchText'),
             $searchInput = $('#searchInput'),
             $searchClear = $('#searchClear'),
             $searchCancel = $('#searchCancel');

         function hideSearchResult() {
             $searchResult.hide();
             $searchInput.val('');
         }

         function cancelSearch() {
             hideSearchResult();
             $searchBar.removeClass('weui-search-bar_focusing');
             $searchText.show();
         }

         $searchText.on('click', function() {
             $searchBar.addClass('weui-search-bar_focusing');
             $searchInput.focus();
         });
         $searchInput
             .on('blur', function() {
                 if (!this.value.length) cancelSearch();
             })
             .on('input', function() {
                 if (this.value.length) {
                     $searchResult.show();
                 } else {
                     $searchResult.hide();
                 }
             });
         $searchClear.on('click', function() {
             hideSearchResult();
             $searchInput.focus();
         });
         $searchCancel.on('click', function() {
             cancelSearch();
             $searchInput.blur();
         });



         $searchInput.on('keypress', function(event) {

             if (event.keyCode == 13) {
                 alert('你输入的内容为1：');
                 event.preventDefault();　　
                 event.stopPropagation();
             }
         });
     });

 });