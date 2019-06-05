"use strict";
cc._RF.push(module, '66b51obcd1Mi4dcboc3fwIs', 'ConstValue');
// scripts/Data/ConstValue.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue = /** @class */ (function () {
    function ConstValue() {
    }
    ConstValue.IS_EDITIONS = false; //是否为发布版本，用于数据上报
    ConstValue.IS_TEACHER = true; //是否为教师端版本
    ConstValue.CONFIG_FILE_DIR = "config/";
    ConstValue.PREFAB_UI_DIR = "prefab/ui/panel/";
    ConstValue.AUDIO_DIR = "audio/";
    ConstValue.CoursewareKey = "w5grXEO2d$*c7UcmA1v&p^AD"; //每个课件唯一的key 24位随机字符串 可用随机密码生成器来生成。
    return ConstValue;
}());
exports.ConstValue = ConstValue;

cc._RF.pop();