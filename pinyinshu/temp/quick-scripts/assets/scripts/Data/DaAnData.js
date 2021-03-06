(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/DaAnData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f1ec1bM8JGb4L5TI7iWW47', 'DaAnData', __filename);
// scripts/Data/DaAnData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skinStrEnum;
(function (skinStrEnum) {
    skinStrEnum[skinStrEnum["ballb_01"] = 1] = "ballb_01";
    skinStrEnum[skinStrEnum["ballb_02"] = 2] = "ballb_02";
    skinStrEnum[skinStrEnum["ballb_03"] = 3] = "ballb_03";
    skinStrEnum[skinStrEnum["ballb_04"] = 5] = "ballb_04";
    skinStrEnum[skinStrEnum["ballb_05"] = 7] = "ballb_05";
    skinStrEnum[skinStrEnum["ballb_06"] = 11] = "ballb_06";
    skinStrEnum[skinStrEnum["ballb_07"] = 13] = "ballb_07";
    skinStrEnum[skinStrEnum["ballb_08"] = 8] = "ballb_08";
    skinStrEnum[skinStrEnum["ballb_09"] = 9] = "ballb_09";
})(skinStrEnum = exports.skinStrEnum || (exports.skinStrEnum = {}));
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.submitEnable = false;
        this.checkpointsNum = 0; //关卡数目
        this.numberArr = new Array(); //被分解质因数
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
        