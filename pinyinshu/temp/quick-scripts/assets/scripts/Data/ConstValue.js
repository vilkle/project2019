(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/ConstValue.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '66b51obcd1Mi4dcboc3fwIs', 'ConstValue', __filename);
// scripts/Data/ConstValue.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue = /** @class */ (function () {
    function ConstValue() {
    }
    ConstValue.IS_EDITIONS = false; //是否为发布版本，用于数据上报
    ConstValue.IS_TEACHER = false; //是否为教师端版本
    ConstValue.CONFIG_FILE_DIR = "config/";
    ConstValue.PREFAB_UI_DIR = "prefab/ui/panel/";
    ConstValue.AUDIO_DIR = "audio/";
    return ConstValue;
}());
exports.ConstValue = ConstValue;

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
        //# sourceMappingURL=ConstValue.js.map
        