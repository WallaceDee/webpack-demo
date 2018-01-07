import '../css/cropper.min.css';//使用require导入css文件
var cropper=require('../lib/cropper.min.js');
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
                $("#crop-image").cropper("replace",imgFile);
               // cutter.reset().replace(imgFile);
                $.hideLoading();
                //重置input值，避免重复上传同一的图片不触发onchange事件
                $("[name='uploadAvatar']").val("");

            }
            reader.readAsDataURL(simpleFile);
        });
   