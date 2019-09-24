"use strict";
cc._RF.push(module, '1beb7/vDWBCo6LmGSawpopS', 'count');
// scripts/UI/Item/count.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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