(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Http/NetWork.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '02d5e2ARSBEI7y61P5ArYZu', 'NetWork', __filename);
// scripts/Http/NetWork.ts

Object.defineProperty(exports, "__esModule", { value: true });
var NetWork = /** @class */ (function () {
    function NetWork() {
    }
    NetWork.getInstance = function () {
        if (this.instance == null) {
            this.instance = new NetWork();
        }
        return this.instance;
    };
    /**
     * 请求网络Post 0成功 1超时
     * @param url
     * @param openType
     * @param contentType
     * @param callback
     * @param params
     */
    NetWork.prototype.httpRequest = function (url, openType, contentType, callback, params) {
        if (callback === void 0) { callback = null; }
        if (params === void 0) { params = ""; }
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
        };
        xhr.send(params);
    };
    /**
     * 获取url参数
     */
    NetWork.prototype.GetRequest = function () {
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
        this.LogJournalReport('CoursewareLogEvent', '');
        console.log('gaolei', NetWork.courseware_id, '           ', NetWork.theRequest['id'], '           ', JSON.stringify(NetWork.theRequest));
        return NetWork.theRequest;
    };
    NetWork.prototype.GetIsOnline = function () {
        var isOnline = 1;
        if (this.GetRequest()["isOnline"]) {
            isOnline = this.GetRequest()["isOnline"];
        }
        return isOnline;
    };
    NetWork.prototype.LogJournalReport = function (errorType, data) {
        var img = new Image();
        img.src = (NetWork.isOnlineEnv ? 'https://logserver.haibian.com/statistical/?type=7&' : 'https://ceshi-statistical.haibian.com/?type=7&') +
            'course_id=' + this.GetRequest()["id"] +
            "&chapter_id=" + this.GetRequest()["chapter_id"] +
            "&user_id=" + this.GetRequest()["user_id"] +
            "&subject=" + this.GetRequest()["subject"] +
            "&event=" + errorType +
            "&identity=1" +
            "&extra=" + JSON.stringify({ url: location, empty: this.GetRequest()["empty"], CoursewareName: 'shuYiShuEr_gaolei', data: data });
    };
    //判断是否是线上
    NetWork.isOnlineEnv = location.host.indexOf('ceshi-') < 0 && location.host.indexOf('localhost') < 0 && NetWork.getInstance().GetIsOnline() == 1;
    NetWork.isProtocol = /http:/.test(window['location'].protocol);
    //判断协议是否为http
    NetWork.isLocal = /localhost/.test(window['location'].href) || NetWork.isProtocol;
    //判断是否是pc预加载的协议
    NetWork.isOwcr = location.protocol == 'owcr:' || location.protocol == 'file:';
    NetWork.BASE = NetWork.isOnlineEnv ? 'https://courseware.haibian.com' : NetWork.isLocal ? 'http://ceshi.courseware.haibian.com' : 'https://ceshi_courseware.haibian.com';
    NetWork.GET_QUESTION = NetWork.BASE + '/get';
    NetWork.GET_USER_PROGRESS = NetWork.BASE + '/get/answer';
    NetWork.GET_TITLE = NetWork.BASE + "/get/title";
    NetWork.ADD = NetWork.BASE + "/add";
    NetWork.MODIFY = NetWork.BASE + "/modify";
    NetWork.CLEAR = NetWork.BASE + "/clear";
    NetWork.courseware_id = null;
    NetWork.title_id = null;
    NetWork.user_id = null;
    NetWork.empty = false; //清理脏数据的开关，在URL里面拼此参数 = true；
    NetWork.chapter_id = null;
    NetWork.subject = null;
    /*isLive参数已添加，直播课参数传YES，回放传NO  */
    NetWork.isLive = null;
    NetWork.theRequest = null;
    return NetWork;
}());
exports.NetWork = NetWork;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=NetWork.js.map
        