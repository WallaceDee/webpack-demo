const template = require('../template/search.art')

$(document).ready(function() {
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

            curr_keyword=$searchInput.val();
     window.location.href = "search.html?keyword=" + $searchInput.val();

        }
    });


    var curr_keyword = $.getParameter("keyword");
    if (curr_keyword !== null) {
        $searchInput.val(curr_keyword);
        $searchBar.addClass('weui-search-bar_focusing');
    }

    var page = 1;
    var size = 10;

    var opt = {};
    opt.itemsPerLoad = size;
    opt.page = page;
    opt.maxItems = 0;
    opt.lastIndex = 0;
    opt.loading = false;
    opt.ele=$("#page-search.list-block");

    addItem(opt);

    $("#page-search.list-block").infinite().on("infinite", function() {
        var self = this;
        if (opt.loading) return;
        opt.loading = true;
        addItem( opt);
    });



    function addItem(opt) {
        $._ajax({
            url: domain + "/api/v1/competition/play"+ "?page=" + opt.page + "&size=" + opt.itemsPerLoad,
            data: {
               search :curr_keyword,
            },
            success: function(data) {
                 opt.ele.find("ul").append(template(data));
                console.log(data);
                opt.lastIndex = opt.ele.find('ul>li').length;
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





});