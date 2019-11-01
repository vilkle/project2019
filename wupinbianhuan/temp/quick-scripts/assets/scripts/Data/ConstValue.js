(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/ConstValue.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '66b51obcd1Mi4dcboc3fwIs', 'ConstValue', __filename);
// scripts/Data/ConstValue.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue = /** @class */ (function () {
    function ConstValue() {
    }
    ConstValue.IS_EDITIONS = true; //是否为发布版本，用于数据上报 及 log输出控制
    ConstValue.IS_TEACHER = false; //是否为教师端版本
    ConstValue.CONFIG_FILE_DIR = "config/";
    ConstValue.PREFAB_UI_DIR = "prefab/ui/panel/";
    ConstValue.AUDIO_DIR = "audio/";
    ConstValue.CoursewareKey = "D#0GoXH&y!qJIfY81puGV7^U"; //每个课件唯一的key 24位随机字符串 可用随机密码生成器来生成。
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
        