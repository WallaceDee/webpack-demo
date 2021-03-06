import 'cropper/dist/cropper.min.css'; //使用require导入css文件
import 'cropper'
import { gender_list } from 'config'

const template = require('../template/user_info.art')

$(document).ready(function() {
    var data = $._ajax({
        async: false,
        type: "get",
        url: domain + "/api/v1/user/info"
    }).responseJSON;

    $("#page-user-info").html(template(data));

    $("#page-user-info").on("click", ".name-cell", function() {
        var ex_value = $(this).find(".weui-cell__ft").text();

        $.prompt({
            title: '修改昵称',
            input: ex_value,
            empty: false, // 是否允许为空
            onOK: function(value) {
                console.log(value);
                $._ajax({
                    url: domain + "/api/v1/user/save",
                    data: {
                        username: value
                    },
                    success: function(data) {
                        if (data.error_code === 0) {
                             $.toast("修改成功");
                            $("#page-user-info .name-cell .weui-cell__ft").html(value);
                        }
                    }
                });
            },
            onCancel: function() {
                //点击取消
                //todo
            }
        });
    });


    $("#crop-image").cropper({
        aspectRatio: 1,
        viewMode: 1
    });

    $(document).on("change", "[name='uploadAvatar']", function() {
        // 检查是否为图像类型
        var simpleFile = this.files[0];
        if (!/image\/\w+/.test(simpleFile.type)) {
            alert("请确保文件类型为图像类型");
            return false;
        }
        var reader = new FileReader();
        // 将文件以二进制文件读入页面中
        $.showLoading();
        reader.onload = function(e) {
            var imgFile = e.target.result;
            $("#cutter-popup").popup();
            $("#crop-image").cropper("reset");
            $("#crop-image").cropper("replace", imgFile);
            // cutter.reset().replace(imgFile);
            $.hideLoading();
            //重置input值，避免重复上传同一的图片不触发onchange事件
            $("[name='uploadAvatar']").val("");

        }
        reader.readAsDataURL(simpleFile);
    });
    $(document).on("click", "#cutter-popup .weui-btn_primary", function() {
        var src_data = $("#crop-image").cropper("getCroppedCanvas", {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg');;
        $._ajax({
            url: domain + "/api/v1/user/save",
            data: {
                head_img: src_data.replace("data:image/jpeg;base64,", "")
            },
            success: function(data) {
                if (data.error_code === 0) {
                      $.toast("修改成功",function(){
                          $.closePopup();
                           $("#page-user-info .avatar-cell .weui-cell__ft span").css("background-image", "url(" + src_data + ")");
                      });
                  
                }
            }
        });
    });


    $(document).on('click', '#page-user-info .gender-cell', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(".gender-input").picker("open");
    });


    $(".gender-input").picker({
        title: "请选择性别",
        toolbarTemplate: '<div class="toolbar">\
          <div class="toolbar-inner"><a href="javascript:;" class="picker-button close-picker">关闭</a>\
          <h1 class="title">{{title}}</h1>\
          </div>\
          </div>',
        cols: [{
            textAlign: 'center',
            values: ["保密", "男", "女"],
        }],
        onChange: function(picker) {
            var value = 0;
            for (var i = 0; i < gender_list.length; i++) {
                if (picker.value[0] === gender_list[i].name) {
                    value = gender_list[i].value;
                }
            }
            console.log(value);
            $._ajax({
                url: domain + "/api/v1/user/save",
                data: { sex: value }
            });
        }
    });

    // $(document).on('click', '#page-user-info .birthday-cell', function(event) {
    //     event.preventDefault();
    //     /* Act on the event */
    //     $(".birthday-input").calendar("open"); //打开弹窗

    // });
    // var today = new Date().getTime();
    // var ex_birthday = $(".birthday-input").val();
    // ex_birthday === "点击设置" ? ex_birthday = [today] : ex_birthday = [ex_birthday];
    // $(".birthday-input").calendar({
    //     value: ex_birthday,
    //     maxDate: today,
    //     dateFormat: 'yyyy-mm-dd',
    //     onChange: function(calendar) {
    //         console.log(calendar.value);
    //         var value = new Date(calendar.value[0]).format("yyyy-MM-dd");
    //         $.ajax({
    //             type: "post",
    //             url: "/users/modify",
    //             data: { userBirthday: value, userName: userInfo.userName, type: "userBirthday", token: token },
    //             success: function(data) {
    //                 if (data.code === 200) {
    //                     // userInfo.userGender = value;
    //                     // setCache("userInfo", userInfo);
    //                 }
    //             }
    //         });
    //     }
    // });

});