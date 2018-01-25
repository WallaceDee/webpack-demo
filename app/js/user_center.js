 import { domin } from 'config'
 $._ajax({
     type: "get",
     url: domin + "/api/v1/user/info",
     success: function(data) {
         console.log(data);
     }
 });