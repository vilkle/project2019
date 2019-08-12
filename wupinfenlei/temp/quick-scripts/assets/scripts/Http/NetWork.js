(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Http/NetWork.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9cd01aQNbFMUY4sUMN0yYH5', 'NetWork', __filename);
// scripts/Http/NetWork.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue_1 = require("../Data/ConstValue");
var UIManager_1 = require("../Manager/UIManager");
var ErrorPanel_1 = require("../UI/panel/ErrorPanel");
var NetWork = /** @class */ (function () {
    function NetWork() {
        this.theRequest = null;
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
        if (ConstValue_1.ConstValue.IS_TEACHER && !NetWork.title_id) { //教师端没有titleId的情况
            UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, null, 1000, function () {
                UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("URL参数错误,请联系技术人员！", "", "", "确定");
            });
            return;
        }
        else if (!ConstValue_1.ConstValue.IS_TEACHER && (!NetWork.courseware_id || !NetWork.user_id)) { //学生端没有userid或coursewareId的情况
            UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, null, 1000, function () {
                UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("异常编号为001,请联系客服！", "", "", "确定");
            });
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open(openType, url);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.withCredentials = true;
        //回调
        xhr.onreadystatechange = function () {
            console.log("httpRequest rsp status", xhr.status, "        xhr.readyState", xhr.readyState, "        xhr.responseText", xhr.responseText);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 400)) {
                var response_1 = JSON.parse(xhr.responseText);
                if (callback && response_1.errcode == 0) {
                    callback(false, response_1);
                }
                else {
                    if (ConstValue_1.ConstValue.IS_EDITIONS) {
                        UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, null, 1000, function () {
                            UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel(response_1.errmsg + ",请联系客服！", "", "", "确定", function () {
                                NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                            }, false);
                        });
                    }
                }
            }
        };
        //超时回调
        xhr.ontimeout = function (event) {
            if (ConstValue_1.ConstValue.IS_EDITIONS) {
                UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, null, 1000, function () {
                    UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("网络不佳，请稍后重试", "", "若重新连接无效，请联系客服", "重新连接", function () {
                        NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                    }, true);
                });
            }
            console.log('httpRequest timeout');
            callback && callback(true, null);
        };
        //出错
        xhr.onerror = function (error) {
            if (ConstValue_1.ConstValue.IS_EDITIONS) {
                UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, null, 1000, function () {
                    UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("网络出错，请稍后重试", "若重新连接无效，请联系客服", "", "重新连接", function () {
                        NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                    }, true);
                });
            }
            console.log('httpRequest error');
            callback && callback(true, null);
        };
        xhr.send(params);
    };
    /**
     * 获取url参数
     */
    NetWork.prototype.GetRequest = function () {
        if (this.theRequest != null) {
            return this.theRequest;
        }
        this.theRequest = new Object();
        var url = location.search; //获取url中"?"符后的字串
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                this.theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        NetWork.courseware_id = this.theRequest["id"];
        NetWork.title_id = this.theRequest["title_id"];
        NetWork.user_id = this.theRequest["user_id"];
        NetWork.empty = this.theRequest["empty"];
        NetWork.isLive = this.theRequest['isLive'];
        this.LogJournalReport('CoursewareLogEvent', '');
        return this.theRequest;
    };
    NetWork.prototype.LogJournalReport = function (errorType, data) {
        if (ConstValue_1.ConstValue.IS_EDITIONS) {
            var img = new Image();
            img.src = (NetWork.isOnlineEnv ? 'https://logserver.haibian.com/statistical/?type=7&' : 'https://ceshi-statistical.haibian.com/?type=7&') +
                'course_id=' + this.GetRequest()["id"] +
                "&chapter_id=" + this.GetRequest()["chapter_id"] +
                "&user_id=" + this.GetRequest()["user_id"] +
                "&subject=" + this.GetRequest()["subject"] +
                "&event=" + errorType +
                "&identity=1" +
                "&extra=" + JSON.stringify({ url: location, CoursewareKey: ConstValue_1.ConstValue.CoursewareKey, empty: this.GetRequest()["empty"], CoursewareName: 'wupinfenlei', data: data });
        }
    };
    NetWork.isOnlineEnv = location.host.indexOf('ceshi-') < 0 && location.host.indexOf('localhost') < 0;
    NetWork.isProtocol = /http:/.test(window['location'].protocol);
    NetWork.isLocal = /localhost/.test(window['location'].href) || NetWork.isProtocol;
    NetWork.BASE = NetWork.isOnlineEnv ? '//courseware.haibian.com' : NetWork.isLocal ? '//ceshi.courseware.haibian.com' : '//ceshi_courseware.haibian.com';
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
        