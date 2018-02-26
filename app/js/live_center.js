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
    //恢复缓存html，滚动高度，
     var tabCache = $.getCache("live_center", true);
     //ios直接跳过
     if (tabCache !== null&&device.ios!==true) {
         $(".weui-bar__item--on").removeClass("weui-bar__item--on");
         $(".weui-tab__bd-item--active").removeClass('weui-tab__bd-item--active');
         $(".weui-navbar__item[href='" + tabCache.activeTab + "']").addClass("weui-bar__item--on");
         $(tabCache.activeTab).addClass("weui-tab__bd-item--active");
         //each循环初始化
         $(".weui-tab__bd-item").each(function(index, el) {
             tab_setting[index] = tabCache.tabs[index];
             //添加缓存html
             $(el).find(".cards-list>ul").html(tabCache.tabs[index].tempHtml);
             //滚动到历史高度
             setTimeout(function() { $(el).scrollTop(tabCache.tabs[index].scrollTop); }, 100);
         });
         $(".weui-tab__bd-item").infinite().on("infinite", function() {
             var index = $(this).index();
             var self = tabCache.tabs[index];
             self.ele = $(this);
             if (self.loading) return;
             self.loading = true;
             addItem(self);
         });
     } else {
         //each循环初始化
         $(".weui-tab__bd-item").each(function(index, el) {
             tab_setting[index] = creatTabSetting($(this));
             addItem(tab_setting[index]);
         });
         $(".weui-tab__bd-item").infinite().on("infinite", function() {
             var index = $(this).index();
             var self = tab_setting[index];
             if (self.loading) return;
             self.loading = true;
             addItem(self);
         });
     }

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
                 }
                 opt.page++;
                 opt.loading = false;
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
         $searchInput.on('blur', function() {
             if (!this.value.length) cancelSearch();
         }).on('input', function() {
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
                 event.preventDefault();　　
                 event.stopPropagation();
                 window.location.href = "search.html?keyword=" + $searchInput.val();
             }
         });
     });


     //安卓记录tab状态，active和相应的高度
     $("#page-live-center").on("click", ".card", function() {
        if(device.ios!==true){
          var currTab = $(".weui-bar__item--on").attr("href");
         var tabs = tab_setting;
         $(".weui-tab__bd-item").each(function(index, el) {
             tabs[index].tempHtml = $(el).find(".cards-list.content>ul").html();
             tabs[index].scrollTop = $(el).scrollTop();
         });
         $.setCache("live_center", { activeTab: currTab, tabs: tabs }, true);  
        }
         window.location.href = $(this).children("a").attr("data-href");
     });

     if (performance.navigation.type === 1) {
         $.setCache("live_center", null, true);
     }

 });