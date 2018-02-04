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
            alert('你输入的内容为1：');

        }
    });


    var curr_keyword = $.getParameter("keyword");
    if (curr_keyword !== null) {
        $searchInput.val(curr_keyword);
        $searchBar.addClass('weui-search-bar_focusing');
    }
    $("#page-search .content").html(template({}));



});