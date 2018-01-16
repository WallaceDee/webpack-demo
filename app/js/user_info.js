import 'cropper/dist/cropper.min.css'; //使用require导入css文件
import cropper from 'cropper/dist/cropper.min.js'
import {gender_list} from '../config/config.json'

$(document).ready(function() {

    $(document).on("click", "#page-user-info .name-cell", function() {
        var ex_value = $(this).find(".weui-cell__ft").text();

        $.prompt({
            title: '修改昵称',
            input: ex_value,
            empty: false, // 是否允许为空
            onOK: function(value) {
                console.log(value);
                $.ajax({
                    type: "post",
                    url: "/users/modify",
                    data: { userNickName: value, userName: userInfo.userName, type: "userNickName", token: token },
                    success: function(data) {
                        if (data.code === 200) {
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
        var src_data = cropper.getCroppedCanvas({
            with: 200,
            height: 200
        }).toDataURL('image/jpeg');
        $.ajax({
            type: "post",
            url: "/users/modify",
            data: { base64: src_data, userName: userInfo.userName, type: "userAvatar", token: token },
            success: function(data) {
                if (data.code === 200) {
                    $(".page-user-info .avatar-cell .weui-cell__ft span").css("background-image", "url(" + src_data + ")");
                    $.closePopup();
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
          <div class="toolbar-inner">\
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
                // $.ajax({
                //     type: "post",
                //     url: "/users/modify",
                //     data: { userGender: value, userName: userInfo.userName, type: "userGender", token: token },
                //     success: function(data) {
                //         if (data.code === 200) {
                //             // userInfo.userGender = value;
                //             // setCache("userInfo", userInfo);
                //         }
                //     }
                // });
            }
        });

        $(document).on('click', '#page-user-info .birthday-cell', function(event) {
            event.preventDefault();
            /* Act on the event */
            $(".birthday-input").calendar("open");  //打开弹窗
  
        });
        var today = new Date().getTime();
        var ex_birthday = $(".birthday-input").val();
        ex_birthday === "点击设置" ? ex_birthday = [today] : ex_birthday = [ex_birthday];
        $(".birthday-input").calendar({
            value: ex_birthday,
            maxDate: today,
            dateFormat: 'yyyy-mm-dd',
            onChange: function(calendar) {
                console.log(calendar.value);
                var value = new Date(calendar.value[0]).format("yyyy-MM-dd");
                $.ajax({
                    type: "post",
                    url: "/users/modify",
                    data: { userBirthday: value, userName: userInfo.userName, type: "userBirthday", token: token },
                    success: function(data) {
                        if (data.code === 200) {
                            // userInfo.userGender = value;
                            // setCache("userInfo", userInfo);
                        }
                    }
                });
            }
        });

});