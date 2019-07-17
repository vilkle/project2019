"use strict";
cc._RF.push(module, 'c7373SoEY5LDIC2BLTSmOq3', 'Tip');
// scripts/UI/Item/Tip.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Tip = /** @class */ (function (_super) {
    __extends(Tip, _super);
    function Tip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.neiRongNode = null;
        _this.tipLabel = null;
        _this.ready = true;
        return _this;
    }
    Tip.prototype.playTip = function (message) {
        this.neiRongNode.active = true;
        this.node.stopAllActions();
        this.ready = false;
        this.tipLabel.string = message;
        this.reset();
        var action0 = cc.moveTo(0.5, 0, 128);
        var action1 = cc.fadeIn(0.5);
        var action4 = cc.fadeOut(0.5);
        var action2 = cc.spawn(action0, action4);
        var action3 = cc.delayTime(1);
        var callback = cc.callFunc(function () {
            this.ready = true;
        }, this);
        var action = cc.sequence(action3, action2, callback);
        this.node.runAction(action);
    };
    Tip.prototype.isReady = function () {
        return this.ready;
    };
    Tip.prototype.reset = function () {
        this.node.setPosition(0, 0);
        this.node.opacity = 255;
    };
    __decorate([
        property(cc.Node)
    ], Tip.prototype, "neiRongNode", void 0);
    __decorate([
        property(cc.Label)
    ], Tip.prototype, "tipLabel", void 0);
    Tip = __decorate([
        ccclass
    ], Tip);
    return Tip;
}(cc.Component));
exports.Tip = Tip;

cc._RF.pop();