(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Manager/TimeManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '67eebv5+7tOQal/AI0WZA12', 'TimeManager', __filename);
// scripts/Manager/TimeManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimeManager = /** @class */ (function () {
    //private timeDate = null;
    function TimeManager() {
        //this.timeDate = new Date();
    }
    TimeManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new TimeManager();
        }
        return this.instance;
    };
    TimeManager.prototype.getCurrentTime = function () {
        //return this.timeDate.getTime();
        var timeDate = new Date();
        return timeDate.getTime();
    };
    //加载时间上报
    TimeManager.prototype.getNowFormatDate = function () {
        var date = new Date();
        var seperator1 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        var hours = date.getHours(); //获取当前小时数(0-23)
        var minutes = date.getMinutes(); //获取当前分钟数(0-59)
        var seconds = date.getSeconds(); //获取当前秒数(0-59)
        var milliSceonds = date.getMilliseconds(); //获取当前毫秒数(0-999)
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        if (milliSceonds >= 0 && milliSceonds <= 9) {
            milliSceonds = "00" + milliSceonds;
        }
        if (milliSceonds >= 10 && milliSceonds <= 90) {
            milliSceonds = "0" + milliSceonds;
        }
        var currentdate = year + seperator1 + month + seperator1 + day + seperator1 + hours + seperator1 + minutes + seperator1 + seconds + seperator1 + milliSceonds;
        return currentdate;
    };
    TimeManager.instance = null;
    return TimeManager;
}());
exports.TimeManager = TimeManager;

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
        //# sourceMappingURL=TimeManager.js.map
        