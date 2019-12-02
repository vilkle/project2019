export class NetWork {
    private static instance: NetWork;

    //判断是否是线上
    public static readonly isOnlineEnv = location.host.indexOf('ceshi-') < 0 && location.host.indexOf('localhost') < 0 && NetWork.getInstance().GetIsOnline() == 1;
    public static readonly isProtocol = /http:/.test(window['location'].protocol);
    //判断协议是否为http
    public static readonly isLocal = /localhost/.test(window['location'].href) || NetWork.isProtocol;
    //判断是否是pc预加载的协议
    public static readonly isOwcr = location.protocol == 'owcr:' || location.protocol == 'file:';
    public static readonly BASE = NetWork.isOnlineEnv ? 'https://courseware.haibian.com' : NetWork.isLocal ? 'http://ceshi.courseware.haibian.com' : 'https://ceshi_courseware.haibian.com';


    public static readonly GET_QUESTION = NetWork.BASE + '/get';
    public static readonly GET_USER_PROGRESS = NetWork.BASE + '/get/answer';
    public static readonly GET_TITLE = NetWork.BASE + "/get/title";
    public static readonly ADD = NetWork.BASE + "/add";
    public static readonly MODIFY = NetWork.BASE + "/modify";
    public static readonly CLEAR = NetWork.BASE + "/clear";

    public static courseware_id = null;
    public static title_id = null;
    public static user_id = null;

    public static empty: boolean = false;//清理脏数据的开关，在URL里面拼此参数 = true；

    public static chapter_id = null;
    public static subject = null;
    /*isLive参数已添加，直播课参数传YES，回放传NO  */
    public static isLive = null;
    private static theRequest = null;

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
        if (NetWork.theRequest != null) {
            return NetWork.theRequest;
        }
        NetWork.theRequest = new Object();
        var url = location.search; //获取url中"?"符后的字串
        // var url = location.href;

        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                NetWork.theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        NetWork.courseware_id = NetWork.theRequest["id"];
        NetWork.title_id = NetWork.theRequest["title_id"];
        NetWork.user_id = NetWork.theRequest["user_id"];
        NetWork.empty = NetWork.theRequest["empty"];
        NetWork.isLive = NetWork.theRequest['isLive'];
        this.LogJournalReport('CoursewareLogEvent', '')
        console.log('gaolei', NetWork.courseware_id, '           ', NetWork.theRequest['id'], '           ', JSON.stringify(NetWork.theRequest));
        return NetWork.theRequest;

    }

    GetIsOnline() {
        let isOnline = 1;
        if (this.GetRequest()["isOnline"]) {
            isOnline = this.GetRequest()["isOnline"]
        }
        return isOnline;
    }

    LogJournalReport(errorType, data) {
        var img = new Image();
        img.src = (NetWork.isOnlineEnv ? 'https://logserver.haibian.com/statistical/?type=7&' : 'https://ceshi-statistical.haibian.com/?type=7&') +
            'course_id=' + this.GetRequest()["id"] +
            "&chapter_id=" + this.GetRequest()["chapter_id"] +
            "&user_id=" + this.GetRequest()["user_id"] +
            "&subject=" + this.GetRequest()["subject"] +
            "&event=" + errorType +
            "&identity=1" +
            "&extra=" + JSON.stringify({ url: location, empty: this.GetRequest()["empty"], CoursewareName: 'shuYiShuEr_gaolei', data: data });
    }
}