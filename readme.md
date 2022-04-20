# TJRLib  JS http request lib 

不依赖任何第三方库的纯JS原生http JSON auth JWT  token网络请求库

TJRLib Tekin Javascript Net Request lib
JS网络请求库封装
支持GWT auth授权方式请求API,
支持自定义插件
支持 POST , GET, PUT , DELETE等所有AJAX支持的请求方式
支持自定义回调
支持捕获请求异常 直接在请求时的 error: function(e) {}中处理即可
等等......
@author Tekintian@gmail.com
@link https://github.com/tekintian


## TJRLib 初始化 用户认证登录
~~~js
data=[];
//用户登录认证接口配置 注意 auth_url为完整的借口访问地址 POST方式
data["auth_url"]="http://rap2api.taobao.org/app/mock/300755/user/login"; 
data["auth_json_params"]={ //这里根据你的后端的登录逻辑传递参数
        auth: "tekin",
        pwd: "888888"
    }; 
// 系统默认内置用户为 {username:"admin",password:"admin888"}
// 返回参数必须是 

//api请求基础地址  最终形式 {base_url}/{api地址}
data["base_url"]="http://rap2api.taobao.org/app/mock/300755";

// token强制刷新时间 不配置 默认 1天, 可以自行设置 单位 天 只支持整数
data["force_refresh_days"]=2; 

// 初始化TJRLib插件
TJRLib.initialize(data);
~~~


- 登录认证接口返回示例:
~~~json
{
  "code": 0,
  "msg": "OK",
  "data": {
    "access_token": "aaaaa999999999",
    "expired_at": "2022-10-22T19:03:08",
    "updated_at": "2022-04-12 21:43:41"
  }
}
~~~
 code  0 表示成功, 非0表示失败
data 成功时必须返回的3个数据, updated_at 每次刷新token时需要同步更新


TJRLib.tapi.jsonRequest


授权接口
http://rap2api.taobao.org/app/mock/300755/user/login

需要授权的接口请求,自动添加一下2个头部变量
X-TOKEN  XXXXXXXXXXXXXXX
Authorization Bearer XXXXXXXXXXXXXXX


base_url
http://rap2api.taobao.org/app/mock/300755

~~~txt
示例接口
接口ID：2236901
地址：/TJRLib/demoPost
类型：POST
状态码：200


Get Demo
接口ID：2236903
地址：/TJRLib/demoGet
类型：GET
状态码：200


api/user/hasAccount
接口ID：2241754
地址：/api/user/hasAccount
类型：GET
状态码：200

showLicensing
接口ID：2241758
地址：/api/company/showLicensing
类型：GET
状态码：200

isExpired
接口ID：2241759
地址：/api/company/isExpired
类型：POST
状态码：200
~~~


