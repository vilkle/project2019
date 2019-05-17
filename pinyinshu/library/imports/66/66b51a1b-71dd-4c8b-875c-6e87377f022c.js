"use strict";
cc._RF.push(module, '66b51obcd1Mi4dcboc3fwIs', 'ConstValue');
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