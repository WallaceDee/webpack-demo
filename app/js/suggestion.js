function count(inputEle) {
    var r = $(inputEle).val().length;
    return r;
}

$(document).ready(function() {
    $(document).on('click', '.weui-btn_primary', function(event) {
        event.preventDefault();
        /* Act on the event */
        var $type = $("input[name='type']");
        var $phone = $("input[name='phone']");
        var $title = $("input[name='title']");
        var $content = $("textarea[name='content']");
        var flag = $("textarea[name='content'],input[name='phone']").validate();
        if (flag) {
            $._ajax({
                url: domain + "/api/v1/feeds",
                data: {
                    type: $type.val(),
                    phone: $phone.val(),
                    title: $title.val(),
                    content: $content.val()
                },
                success: function(data) {
                    console.log(data);
                    if (data.error_code === 0) {
                        $.toast("提交成功");
                        setTimeout(function() { history.back(); }, 3000);
                    }
                }
            });
        }
    });

    $(".weui-textarea").on('keyup blur', function(event) {
        event.preventDefault();
        var r = count($(".weui-textarea"));
        if (r <= 200) {
            $(".weui-textarea-counter span").html(r);
        } else {
            $(".weui-textarea").val($(".weui-textarea").val().substring(0, 200));
        }
        /* Act on the event */
    });
});