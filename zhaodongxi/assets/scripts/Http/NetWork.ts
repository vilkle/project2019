export class NetWork {
    private static instance: NetWork;

    public static readonly isOnlineEnv = /\/\/static\.haibian\.com/.test(window['location'].href)
    public static readonly isProtocol = /http:/.test(window['location'].protocol)
    public static readonly isLocal = /localhost/.test(window['location'].href) || NetWork.isProtocol
    public static readonly BASE = NetWork.isOnlineEnv ? '//courseware.haibian.com' : NetWork.isLocal ? '//ceshi.courseware.haibian.com' : '//ceshi_courseware.haibian.com'


    public static readonly GET_QUESTION = NetWork.BASE + '/get'
    public static readonly GET_USER_PROGRESS = NetWork.BASE + '/get/answer'
    public static readonly GET_TITLE = NetWork.BASE + "/get/title"
    public static readonly ADD = NetWork.BASE + "/add"
    public static readonly MODIFY = NetWork.BASE + "/modify"

    public static courseware_id = 0;
    public static title_id = null;
    public static user_id = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new NetWork();
        }
        return this.instance;
    }

    /**
     * 请求网络Post 0成功 1超时
     * @param url 
     * @param openType 
     * @param contentType 
     * @param callback 
     * @param params 
     */
    httpRequest(url, openType, contentType, callback = null, params = "") {
        var xhr = new XMLHttpRequest();
        xhr.open(openType, url);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.withCredentials = true;

        //回调
        xhr.onreadystatechange = function () {
            console.log("httpRequest rsp status", xhr.status, "        xhr.readyState", xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 400)) {
                callback && callback(false, xhr.responseText);
            }
        };

        //超时回调
        xhr.ontimeout = function (event) {
            console.log('httpRequest timeout');
            callback && callback(true, null);
        };

        //出错
        xhr.onerror = function (error) {
            console.log('httpRequest error');
            callback && callback(true, null);
        }

        xhr.send(params);
    }

    /**
     * 获取url参数
     */
    GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
}