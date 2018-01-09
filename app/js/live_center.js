 $(document).ready(function() {

      $(".weui-tab__bd-item#tab1").infinite().on("infinite", function() {
        var self = this;
        if(self.loading) return;
        console.log(self)
        self.loading = true;
        console.log(self);
        setTimeout(function() {
          $(self).find(".content").append("<p>我是加载的新内容。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。我是加载的新内容。。。。。</p>");
          self.loading = false;
        }, 2000);   //模拟延迟
      });


      $('.weui-tab__bd-item#tab1').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        setTimeout(function() {
          $(self).pullToRefreshDone();
        }, 2000)
      })

 });