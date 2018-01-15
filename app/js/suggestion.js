function count(inputEle) {

    var r = $(inputEle).val().length;
    return r;
}

$(document).ready(function() {

    $("#submit-btn").click(function(event) {
        /* Act on the event */
        var r = count($(".weui-textarea"));
        console.log(r);
    });

    $(".weui-textarea").on('keyup', function(event) {
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