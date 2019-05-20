(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Manager/TimeManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6a93cVTR3pJrpapom9vowVf', 'TimeManager', __filename);
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
        