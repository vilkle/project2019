(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/DaAnData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '51b14iJHt9I3YwEA9o1ciBe', 'DaAnData', __filename);
// scripts/Data/DaAnData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.checkpointsNum = 0; //关卡数目
        this.countsArr = [];
        this.goodsArr = [];
        this.submitEnable = false;
    }
    DaAnData.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    };
    return DaAnData;
}());
exports.DaAnData = DaAnData;

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
        //# sourceMappingURL=DaAnData.js.map
        