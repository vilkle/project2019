"use strict";
cc._RF.push(module, '9cd01aQNbFMUY4sUMN0yYH5', 'NetWork');
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
    };
    NetWork.isOnlineEnv = /\/\/static\.haibian\.com/.test(window['location'].href);
    NetWork.isProtocol = /http:/.test(window['location'].protocol);
    NetWork.isLocal = /localhost/.test(window['location'].href) || NetWork.isProtocol;
    NetWork.BASE = NetWork.isOnlineEnv ? '//courseware.haibian.com' : NetWork.isLocal ? '//ceshi.courseware.haibian.com' : '//ceshi_courseware.haibian.com';
    NetWork.GET_QUESTION = NetWork.BASE + '/get';
    NetWork.GET_USER_PROGRESS = NetWork.BASE + '/get/answer';
    NetWork.GET_TITLE = NetWork.BASE + "/get/title";
    NetWork.ADD = NetWork.BASE + "/add";
    NetWork.MODIFY = NetWork.BASE + "/modify";
    NetWork.courseware_id = 0;
    NetWork.title_id = null;
    NetWork.user_id = null;
    return NetWork;
}());
exports.NetWork = NetWork;

cc._RF.pop();