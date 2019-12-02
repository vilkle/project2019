(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/dot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba3ff80wttG0Z4gZejy2YLS', 'dot', __filename);
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
        //# sourceMappingURL=dot.js.map
        