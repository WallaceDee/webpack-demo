$(document).ready(function($) {
    var $phone = $("input[name='telephone']");
    var $code = $("input[name='code']");
    $(document).on('click', '.weui-vcode-btn', function(event) {
        event.preventDefault();
        /* Act on the event */
        var flag = $phone.validate();
        if (flag) {
            $._ajax({
                url: domain + "/api/v1/identify/code",
                data: {
                    phone: $phone.val()
                },
                success: function(data) {
                    console.log(data);
                    if (data.error_code === 0) {
                        $.toptip(data.msg, "success");
                    }
                }
            });
        }
    });

    $(document).on('click', '.weui-btn_primary', function(event) {
        event.preventDefault();
        /* Act on the event */
        var flag = $("input[name='telephone'],input[name='code']").validate();
        if (flag) {
            $._ajax({
                url: domain + "/api/v1/user/bind",
                data: {
                    phone: $phone.val(),
                    code: $code.val()
                },
                success: function(data) {
                    console.log(data);
                    if (data.error_code === 0) {
                        $.toptip(data.msg, "success");
                    }
                    setTimeout(function(){history.back();},3000);
                }
            });
        }
    });
});