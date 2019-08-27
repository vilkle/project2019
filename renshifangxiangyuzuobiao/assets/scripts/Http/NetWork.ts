import { ConstValue } from "../Data/ConstValue";
import { UIManager } from "../Manager/UIManager";
import ErrorPanel from "../UI/panel/ErrorPanel";
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
        if (ConstValue.IS_TEACHER && !NetWork.title_id) {//教师端没有titleId的情况
            UIManager.getInstance().openUI(ErrorPanel, null, 1000, () => {
                (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                    "URL参数错误,请联系技术人员！",
                    "", "", "确定");
            });
            return;
        } else if (!ConstValue.IS_TEACHER && (!NetWork.courseware_id || !NetWork.user_id)) {//学生端没有userid或coursewareId的情况
            UIManager.getInstance().openUI(ErrorPanel, null, 1000, () => {
                (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                    "异常编号为001,请联系客服！",
                    "", "", "确定");
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
                let response = JSON.parse(xhr.responseText);
                if (callback && response.errcode == 0) {
                    callback(false, response);
                } else {
                    if (ConstValue.IS_EDITIONS) {
                        UIManager.getInstance().openUI(ErrorPanel, null, 1000, () => {
                            (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(response.errmsg + ",请联系客服！", "", "", "确定", () => {
                                NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                            }, false);
                        });
                    }
                }
            }
        };

        //超时回调
        xhr.ontimeout = function (event) {
            if (ConstValue.IS_EDITIONS) {
                UIManager.getInstance().openUI(ErrorPanel, null, 1000, () => {
                    (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel("网络不佳，请稍后重试", "", "若重新连接无效，请联系客服", "重新连接", () => {
                        NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                    }, true);
                });
            }
            console.log('httpRequest timeout');
            callback && callback(true, null);
        };

        //出错
        xhr.onerror = function (error) {
            if (ConstValue.IS_EDITIONS) {
                UIManager.getInstance().openUI(ErrorPanel, null, 1000, () => {
                    (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel("网络出错，请稍后重试", "若重新连接无效，请联系客服", "", "重新连接", () => {
                        NetWork.getInstance().httpRequest(url, openType, contentType, callback, params);
                    }, true);
                });
            }
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
        console.log('11111gaolei', NetWork.courseware_id, '           ', NetWork.theRequest['id'], '           ', JSON.stringify(NetWork.theRequest));
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
        if (ConstValue.IS_EDITIONS) {
            var img = new Image();
            img.src = (NetWork.isOnlineEnv ? 'https://logserver.haibian.com/statistical/?type=7&' : 'https://ceshi-statistical.haibian.com/?type=7&') +
                'course_id=' + this.GetRequest()["id"] +
                "&chapter_id=" + this.GetRequest()["chapter_id"] +
                "&user_id=" + this.GetRequest()["user_id"] +
                "&subject=" + this.GetRequest()["subject"] +
                "&event=" + errorType +
                "&identity=1" +
                "&extra=" + JSON.stringify({ url: location, CoursewareKey: ConstValue.CoursewareKey, empty: this.GetRequest()["empty"], CoursewareName: 'renshifangxiangyuzuobiao', data: data });
        }
    }
}