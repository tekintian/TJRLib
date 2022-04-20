/**
 * TJRLib Tekin Javascript Net Request lib
 * JS网络请求库封装
 * 支持GWT auth授权方式请求API,
 * 支持URL智能路由拼接
 * 支持自定义插件
 * 支持 POST , GET, PUT , DELETE等所有AJAX支持的请求方式
 * 支持自定义回调
 * 支持捕获请求异常 直接在请求时的 error: function(e) {}中处理即可
 * 等等......
 * 使用方法:
 * 初始化数据
data=[];
//注意 auth_url为完整的借口访问地址 POST方式
data["auth_url"]="http://rap2api.taobao.org/app/mock/300755/user/login"; 
//api请求基础地址  最终形式 {base_url}/{api地址}
data["base_url"]="http://rap2api.taobao.org/app/mock/300755";

// token强制刷新时间 不配置 默认 1天, 可以自行设置 单位 天 只支持整数
data["force_refresh_days"]=2; 
TJRLib.initialize(data);
使用: 
TJRLib.tapi.jsonRequest({
    type: "POST",
    url: "/TJRLib/demoPost",
    data: {
        km: "tapi"
    },
    success: function(e) {
       //
    },
    error: function(e) {
       console.log(e)
    }
});
 * @author Tekintian@gmail.com
 * @link https://github.com/tekintian
 */
TJRLib = function() {
    // 存储
    const ss = {};
    ss.get = function(name) {
       return sessionStorage.getItem(name);
    }
    ss.set = function(name, val) {
        sessionStorage.setItem(name, val);
    }
    ss.remove = function(name) {
        sessionStorage.removeItem(name);
    }
    // base64编解码
    var Base64 = {
        _bs64KeyStr:  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            let t = "";
            let n, r, i, s, o, u, a;
            let f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + Base64._bs64KeyStr.charAt(s) + Base64._bs64KeyStr.charAt(o) + Base64._bs64KeyStr.charAt(u) + Base64._bs64KeyStr.charAt(a);
            }
            return t
        },
        decode: function(e) {
            let t = "";
            let n, r, i;
            let s, o, u, a;
            let f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = Base64._bs64KeyStr.indexOf(e.charAt(f++));
                o = Base64._bs64KeyStr.indexOf(e.charAt(f++));
                u = Base64._bs64KeyStr.indexOf(e.charAt(f++));
                a = Base64._bs64KeyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function(e) {
            e = e.replace(/rn/g, "n");
            let t = "";
            for (let n = 0; n < e.length; n++) {
                let r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function(e) {
            let t = "";
            let n = 0;
            let r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    };
    // 变量定义
    var r = null, o = null, i, a,  s,
    //错误处理
    f = function(e, t) {
        try {
            K.logException(e);
        } catch (e) {}
        if (e instanceof L ? l(t, e.message) : l(t), TJRLib.throwExceptions) throw e;
    },
    l = function(e, t) {
        e && e.error && e.error(t);
    }, 
     // json解析
    x = function(n, o) {
        return function(e, t) {
            var r;
            try {
                r = JSON.parse(e.responseText);
            } catch (e) {
                return void l(o, "invalidjson");
            }
            y(n, o, r.code, r) || l(o, r.message);
        };
    }, 
    // request请求数据处理
    u = function(e, t) {
        if (4 === e.readyState) if (200 === e.status) switch (t.dataType) {
          case "xml":
            t.success(e.responseXML, e.responseText);
            break;
          case "json":
            var r = null;
            try {
                r = JSON.parse(e.responseText);
            } catch (e) {}
            t.success(r, e.responseText);
            break;

          default:
            t.success(e.responseText);
        } else t.error && t.error(e, e.statusText);
    }, 
    // 处理请求URL地址
    c = (i = function(e) {
        var t = {};
            for (var r in e) {
                var n = e[r];
                if (null == n && (n = ""), "object" == typeof n) for (var o in n) n.hasOwnProperty(o) && (t[r + "[" + o + "]"] = n[o]); else t[r] = n;
            }
          return t;
        }, 
        a = function(e, t) {
          e = i(e), t = t || "";
          var r = [];
          for (var n in e) {
            var o = e[n];
            "object" == typeof o ? r = r.concat(a(o, n)) : (t && (n = t + "[" + n + "]"), r.push(n + "=" + encodeURIComponent(o)));
          }
          return r;
        },  function(e) {
      return a(e).join("&");
    }), 
    // XMLHttpRequest网络请求头封装
    e = function(t) {
        var e = new XMLHttpRequest(), r = t.contentType || "application/x-www-form-urlencoded";
        t.success && (e.onload = function() {
            u(e, t);
        }), t.error && (e.onerror = function() {
            t.error(e, e.statusText);
        });
        var n = function(e) {
            if ("application/json" !== r) return c(t.data);
            if ("GET" === e) return "";
            try {
                return JSON.parse(t.data), t.data;
            } catch (e) {
                return JSON.stringify(t.data);
            }
        }, o = t.url;
        if ("GET" === t.type) {
            var i = n(t.type);
            o = t.url + (0 < i.length ? "?" + i : "");
        }
        if (e.open(t.type || "GET", o, !0), t.headers){
            for (var a in t.headers) {
                t.headers.hasOwnProperty(a) && e.setRequestHeader(a, t.headers[a]);
            }
        } 
        if("POST" === t.type){
            try{
                e.setRequestHeader("Content-Type", r);
                t.beforeSend && t.beforeSend(e, t);
                e.send(n());
            }catch (e) {
                f(e, o);
            }
        }else{
            (t.beforeSend && t.beforeSend(e, t), e.send())
        }
    }, 
    // 在发起AP请求之前会先调用这个接口获取请求token信息
    t = function(t, e) {
        let authStr = ss.get(["TJRLib_AUTH_INFO"]);
        let authInfo = Object;
        if(authStr){
           authInfo = JSON.parse(Base64.decode(authStr));
        }
        let token = authInfo.access_token ? authInfo.access_token : false;
        // token过期时间
        let expireTime = authInfo.expire_time ? authInfo.expire_time :"2000-01-01T19:18:38";
        //token更新时间 用于弥补过期时间设置过长导致问题 ,强制用户每 24小时刷新一次token
        let updateTime = authInfo.update_time ? authInfo.update_time :"2022-01-01T21:49:31";

        let d1 = new Date(); //取今天的日期  
        let d2 = new Date(Date.parse(expireTime));
        let cdt = new Date(Date.parse(updateTime));
        let _frdays = (o && o.force_refresh_days) ? o.force_refresh_days : 1; //从配置中读取强制刷新天数
        cdt.setDate(cdt.getDate()+_frdays); // 默认每隔1天刷新一次token, 可通过 初始化时传入 force_refresh_days 修改
        let isRefresh = (cdt.getTime()) <= d1.getTime();

         if (isRefresh || d2.getTime() < d1.getTime() || !token || !authStr) {
           //重新获取token
            K.ajax({
                type: "POST",
                url: K.getAuthURL(),
                data: K.getAuthJsonParams(),
                success: function(e) {
                    //清理用户登录数据
                    if( o && o.auth_json_params ){
                      o.auth_json_params = null;
                    }
                    var resp = JSON.parse(e);
                    //console.log(resp)
                    if(resp.code==0){
                        ss.set("TJRLib_AUTH_INFO",Base64.encode(JSON.stringify(resp.data)));
                        t(r = resp.data || null);//将返回的数据回调
                    }else{
                        ss.remove("TJRLib_AUTH_INFO");
                        return void l(o, resp.msg);
                    }
                },
                beforeSend: function(e) {
                   e.setRequestHeader("APP", "TJRLib/v1");
                 },
                error: n(e)
            });
        }else{
            t(r = authInfo || null);
        }
    }, 
    n = function(n) {
        return function(e, t, r) {
            "function" == typeof n ? n() : console.log(r);
        };
    }, 
    d = function(e, t, r, n) {
        y(e, t, r, n) || l(t, r);
    }, 
    y = (s = function(e, t, r, n) {
        if (e) {
            var o = e[r];
            if ("function" == typeof o) return o(n, t), !0;
        }
        return !1;
      }, function(e, t, r, n) {
        var o = s(e, t, r, n);
        return o = s(t.callbacks, t, r, n) || o;
    }),
    p = function(n, o) {
        return function(e, t) {
            try {
                if (y(n, o, t)) return;
                if (null === e && t && "undefined" != typeof DOMParser) try {
                    var r;
                    e = new DOMParser().parseFromString(t, "application/xml");
                } catch (e) {}
                null === e ? l(o, "invalidxml") : g(e, n, o);
            } catch (e) {
                f(e, o);
            }
        };
    }, 
    v = function(e, t) {
        return e.getElementsByTagName(t);
    }, 
    S = function(e, t) {
        var r = v(e, t);
        return 0 < r.length ? r[0] : null;
    }, 
    b = function(e, t) {
        var r = S(e, t);
        return r ? r.textContent : "";
    }, 
    g = function(e, t, r) {
        var n = S(e, "result"), o = S(e, "ok"), i = S(e, "error"), a = S(e, "failed");
        if (n) {
            var u = n.getAttribute("rc"), c = n.getAttribute("msg"), s = n.getAttribute("success"), f = n.getAttribute("ok");
            if (u) return void d(t, r, u, n);
            if (c) return void d(t, r, c, n);
            if (s) return void d(t, r, s, n);
            if (f) return void d(t, r, "ok");
            var p = n.textContent.trim();
            if ("ok" === p) return void (y(t, r, "ok") || d(t, r, b(e, "status")));
            if ("bad" === p) return void l(r, b(e, "message"));
        } else {
            if (o) return void d(t, r, "ok", o);
            if (i) return void (y(t, r, i.getAttribute("cause"), i) || d(t, r, i.getAttribute("message"), i));
            if (a) return void d(t, r, a.getAttribute("reason"), a);
        }
        l(r);
    }, 
    //插件
    k = function(r, n) {
        return function(e, t) {
            try {
                if (null === e && t) l(n, "invalidjson"); else {
                    if (e.error) return void (y(r, n, e.error, e) || l(n, e.errortxt || e.error));
                    if (e.hasOwnProperty("success")) {
                        if (e.success && y(r, n, "success", e)) return;
                        if (!e.success) return void l(n);
                    } else if (e.res) {
                        if ("success" !== e.res) return void (y(r, n, e.res, e) || l(n, e.errortxt));
                        if (y(r, n, e.res, e)) return;
                    } else {
                        if (y(r, n, e.reason, e)) return;
                        if (y(r, n, e.status, e)) return;
                        if (y(r, n, e.cmd, e)) return;
                    }
                }
                r && "function" == typeof r.default ? r.default(e, n) : "function" == typeof n.success && n.success(e);
            } catch (e) {
                f(e, n);
            }
        };
    }, 
   // 请求URL拼接
    m = function(e) {
        e.userSupplied = e.userSupplied || {}, 
        e.type = void 0 === e.type ? "POST" : e.type, 
        e.url = K.getBaseURL(e.url), 
        e.data = P(e.data, e.userSupplied.requestArgs), 
        e.data && void 0 === e.data.tversion && "undefined" != typeof tversion && (e.data.tversion = tversion), 
        void 0 === e.error && e.userSupplied.error && (e.error = n(e.userSupplied.error)), 
        !e.data || void 0 !== e.data.token || void 0 !== e.Token && !e.Token || null !== r ? K.ajax(e) : t(function() {
            K.ajax(e);
        }, e.userSupplied.error);
    }, 
    T = function(e, t) {
        var r = {}, n = t.userSupplied;
        switch ("object" != typeof n && (n = t.userSupplied = {}), typeof t.success) {
          case "string":
            return r[t.success] = n.success, e(r, n);

          case "function":
            return r.default = t.success, e(r, n);

          default:
            if (t.callbacks || n.success || n.callbacks) return e(t.callbacks, n);
        }
        return null;
    }, 
    A = function(e, t, r) {
        for (var n in r = r || [], t) {
            var o = e[n], i = t[n];
            if ("object" == typeof i) A(o, i, r.concat(n)); else if (typeof o !== i) throw r.push(n), 
            "Extension is missing the following property: " + r.join(".") + " (" + i + ")";
        }
    },
    //初始化方法 
    init = function(e, t) {
        // for (var r in A(e, q), t) K[r] = t[r];
        for (var r in A(e,q), t) {
             K[r] = t[r];
        }
        for (var n in F){
             K[n] = e[n];
        }
        o = e;
    }, 
    C = function(e, t, r) {
        var n = e.getAttribute(t);
        return void 0 === n ? r : n;
    }, 
    O = function(e, t, r) {
        var n = parseInt(C(e, t, r));
        return isNaN(n) ? r : n;
    }, 
    P = function(e) {
        e = e || {};
        for (var t = 1, r = arguments.length; t < r; ++t) {
            var n = arguments[t];
            for (var o in n) e[o] = n[o];
        }
        return e;
    },
    N = function(t, r) {
        return t ? function() {
            var e = r.apply(window, arguments);
            t.apply(window, e || arguments);
        } : r;
    }, 
    q = {
         // 函数注册 这里注册后, 必须在初始化的时候传入相应的函数,否则无法运行!
       // 如: data["get_random_password"]=getRandomPassword;  
       // TJRLib.initialize(data,data);

       // get_random_password: "function"
    }, 
    F = {
        RSAKey: !0
    }, 
    // 取默认数据
     _ = function(e, t) {
        t.data && void 0 === t.data.token && (void 0 === t.Token || t.Token) && (t.data.token = r);
    }, 
    // json请求
    R = function(e) {
        e.dataType = "json", e.beforeSend = N(e.beforeSend, _), e.success = T(k, e), m(e);
    }, 
    // xml请求
    w = function(e) {
        e.dataType = "xml", e.beforeSend = N(e.beforeSend, _), e.success = T(p, e), m(e);
    }, 
    // text请求
    j = function(e) {
        e.dataType = "text", e.beforeSend = N(e.beforeSend, _), m(e);
    }, 
    // 获取响应值列表
    h = function(e, t, r) {
        for (var list = [], o = 0; o < r; ++o) {
            list.push(C(e, t + o));
        }
        return list;
    }, 
    //
    K = {
        ajax: e,
        getAuthURL: function() {
            return (o && o.auth_url) ? o.auth_url : window.location.href+"/user/login";
        },
        getAuthJsonParams: function() {
            return (o && o.auth_json_params) ? o.auth_json_params : {username:"admin",password:"admin888"};
        },
        getBaseURL: function(url) {
            //如果用户传递的是http开头的URL则直接返回URL  
            if(url && url.startsWith("http")){
                return url;
            }
            return (o && o.base_url) ? o.base_url+url : window.location.href+"/user/login"+url;
        },
        getLocalKey: function() {
            return (o && o.g_local_key) ? o.g_local_key : "";
        },
        setLocalKey: function(e) {
            if(o) {
                o.g_local_key = e;
            }else{
                l(o,"请先初始化后在设置对象!");
            }
        },
        logException: function(e) {
            console.log(e);
        },
        makeRandomPassword: function() {
            let pwd=o.get_random_password;
            if(pwd){
               return pwd.apply(o, arguments);
            }
            return "";
        }
    }, 
    L = function(e) {
        this.message = e, this.stack = new Error().stack;
    };
    L.prototype = Object.create(Error.prototype), L.prototype.name = "ClientException", 
    L.prototype.constructor = L;
    //设置请求头信息
    var jsonReq = (J = function(req) {
        //设置请求头信息
        req.setRequestHeader("X-TOKEN", r.access_token);
        req.setRequestHeader("Authorization", "Bearer " + r.access_token);
        }, 
        {
          jsonRequest: function(req) {
             req.dataType = "json", 
             req.contentType = "application/json", 
             req.beforeSend = N(req.beforeSend, J), 
             req.error = x(req.callbacks, req.userSupplied || {}), 
             m(req);
           }
        }
     ), J;
    return {
        ajax: e,
        base64Encode: Base64.encode,
        base64Decode: Base64.decode,
        getRecordsFromResponse: h,
        jsonRequest: R,
        xmlRequest: w,
        textRequest: j,
        initialize: init,
        ext: K,
        getNodes: v,
        getNode: S,
        getNodeText: b,
        getAttr: C,
        getAttrInt: O,
        extend: P,
        extendCallback: N,
        ClientException: L,
        clearToken: function() {
           if( o && o.auth_json_params ){
               o.auth_json_params = null; //清理用户登录数据=null; 
           }
            ss.remove("TJRLib_AUTH_INFO");
            r = null;
        },
        getToken: t,
        callback: function(e, t) {
            e.callbacks && "function" == typeof e.callbacks[t] && e.callbacks[t].apply(window, Array.prototype.slice.call(arguments, 2));
        },
        tapi: jsonReq
    };
}();