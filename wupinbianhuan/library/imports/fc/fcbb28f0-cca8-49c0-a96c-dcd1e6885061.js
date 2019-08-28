"use strict";
cc._RF.push(module, 'fcbb2jwzKhJwKls3NHmiFBh', 'DataReporting');
// scripts/Data/DataReporting.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue_1 = require("./ConstValue");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DataReporting = /** @class */ (function () {
    function DataReporting() {
    }
    DataReporting_1 = DataReporting;
    DataReporting.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DataReporting_1();
        }
        return this.instance;
    };
    /**
     * 向课堂端派发事件
     * @param key 事件名字
     * @param value 事件参数
     */
    DataReporting.prototype.dispatchEvent = function (key, value) {
        if (value === void 0) { value = null; }
        if (ConstValue_1.ConstValue.IS_EDITIONS) {
            if (value) {
                courseware.page.sendToParent(key, value);
            }
            else {
                courseware.page.sendToParent(key);
            }
        }
    };
    /**
     * 监听课堂端发出的事件
     * @param key 事件名字
     * @param callBack 响应函数
     */
    DataReporting.prototype.addEvent = function (key, callBack) {
        if (ConstValue_1.ConstValue.IS_EDITIONS) {
            courseware.page.on(key, callBack);
        }
    };
    var DataReporting_1;
    DataReporting.isRepeatReport = true; //数据上报是否重复上报，如果已经上报过  则不能再上报
    DataReporting = DataReporting_1 = __decorate([
        ccclass
    ], DataReporting);
    return DataReporting;
}());
exports.default = DataReporting;

cc._RF.pop();