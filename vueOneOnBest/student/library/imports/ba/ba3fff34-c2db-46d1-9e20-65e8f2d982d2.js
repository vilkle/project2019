"use strict";
cc._RF.push(module, 'ba3ff80wttG0Z4gZejy2YLS', 'dot');
// scripts/UI/dot.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dot_1 = null;
        _this.duration = 5;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.setDotAction_1 = function () {
        var up = cc.moveBy(this.duration, 20, 100).easing(cc.easeQuinticActionIn());
        // 不断重复
        return cc.repeatForever(up);
    };
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    NewClass.prototype.start = function () {
        // this.dot_1.runAction(this.setDotAction_1());
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "dot_1", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();