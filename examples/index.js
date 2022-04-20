var mylib = require('tjrlib');

data=[];
//注意 auth_url为完整的借口访问地址 POST方式
data["auth_url"]="http://rap2api.taobao.org/app/mock/300755/user/login"; 
data["auth_json_params"]={ //这里根据你的后端的登录逻辑传递参数
        auth: "tekin",
        pwd: "888888"
    }; 
//api请求基础地址  最终形式 {base_url}/{api地址}
data["base_url"]="http://rap2api.taobao.org/app/mock/300755";

mylib.TJRLib.initialize(data);


TJRLib.tapi.jsonRequest({
    type: "POST",
    url: "/TJRLib/demoPost",
    data: {
        km: "tapi"
    },
    success: function(e) {
       console.log(e)
    },
    error: function(e) {
       console.log(e)
    }
});