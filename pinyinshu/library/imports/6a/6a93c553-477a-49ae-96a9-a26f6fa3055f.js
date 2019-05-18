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
    TimeManager.instance = null;
    return TimeManager;
}());
exports.TimeManager = TimeManager;

cc._RF.pop();