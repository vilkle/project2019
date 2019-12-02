(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/count.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1beb7/vDWBCo6LmGSawpopS', 'count', __filename);
// scripts/UI/count.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Count = /** @class */ (function (_super) {
    __extends(Count, _super);
    function Count() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.countLabel = null;
        // 摆动角度
        _this.turnRotate = 10;
        // 摆动持续时间
        _this.turnDuration = 2;
        return _this;
    }
    Count.prototype.setRepeatAction = function () {
        // 设置摇摆动画
        var turnLeft = cc.rotateTo(this.turnDuration, this.turnRotate);
        var turnRight = cc.rotateTo(this.turnDuration, -this.turnRotate);
        // 不断重复
        this.node.runAction(cc.repeatForever(cc.sequence(turnLeft, turnRight)));
    };
    Count.prototype.setDownAction = function () {
        // 入场动画
        var itemIn = cc.moveBy(.3, 0, -10).easing(cc.easeCubicActionOut());
        var itemUp = cc.moveBy(.4, 0, 15).easing(cc.easeCubicActionOut());
        var itemDown = cc.moveBy(.6, 0, -10).easing(cc.easeCubicActionOut());
        // 入场之后开始摆动
        var callback = cc.callFunc(this.setRepeatAction, this);
        return cc.sequence(itemIn, itemUp, itemDown, callback);
    };
    Count.prototype.start = function () {
        this.node.runAction(this.setDownAction());
    };
    __decorate([
        property(cc.Label)
    ], Count.prototype, "countLabel", void 0);
    Count = __decorate([
        ccclass
    ], Count);
    return Count;
}(cc.Component));
exports.default = Count;

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
        //# sourceMappingURL=count.js.map
        