"use strict";
cc._RF.push(module, '6a93cVTR3pJrpapom9vowVf', 'TimeManager');
// scripts/Manager/TimeManager.ts

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