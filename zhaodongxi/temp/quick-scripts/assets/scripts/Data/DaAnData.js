(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/DaAnData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f1ec1bM8JGb4L5TI7iWW47', 'DaAnData', __filename);
// scripts/Data/DaAnData.ts

Object.defineProperty(exports, "__esModule", { value: true });
var picType;
(function (picType) {
    picType[picType["animal"] = 1] = "animal";
    picType[picType["food"] = 2] = "food";
    picType[picType["figure"] = 3] = "figure";
    picType[picType["dailyuse"] = 4] = "dailyuse";
    picType[picType["number"] = 5] = "number";
    picType[picType["stationery"] = 6] = "stationery";
    picType[picType["clothes"] = 7] = "clothes";
    picType[picType["letter"] = 8] = "letter";
})(picType = exports.picType || (exports.picType = {}));
var scopeRange;
(function (scopeRange) {
    scopeRange[scopeRange["4 * 4"] = 1] = "4 * 4";
    scopeRange[scopeRange["4 * 5"] = 2] = "4 * 5";
    scopeRange[scopeRange["4 * 6"] = 3] = "4 * 6";
    scopeRange[scopeRange["4 * 7"] = 4] = "4 * 7";
    scopeRange[scopeRange["4 * 8"] = 5] = "4 * 8";
    scopeRange[scopeRange["5 * 4"] = 6] = "5 * 4";
    scopeRange[scopeRange["5 * 5"] = 7] = "5 * 5";
    scopeRange[scopeRange["5 * 6"] = 8] = "5 * 6";
    scopeRange[scopeRange["5 * 7"] = 9] = "5 * 7";
    scopeRange[scopeRange["5 * 8"] = 10] = "5 * 8";
})(scopeRange = exports.scopeRange || (exports.scopeRange = {}));
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.types = 1; //单个1 组合2
        this.checkpointsNum = 0; //关卡数目
        this.picArr = new Array(); //图片种类
        this.range = 0; //选择区范围
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
        