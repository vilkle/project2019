"use strict";
cc._RF.push(module, 'bf450g7cztIM6gPLVvcaP2I', 'tips');
// scripts/UI/Item/tips.ts

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
var Toast = /** @class */ (function (_super) {
    __extends(Toast, _super);
    function Toast() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.text = '';
        _this.close = true;
        return _this;
    }
    Toast.prototype.setAction = function () {
        var _this = this;
        // 设置显隐动画
        var big = cc.scaleTo(0.2, 1.8, 1.8).easing(cc.easeCubicActionOut());
        var small = cc.scaleTo(0.2, 1.5, 1.5).easing(cc.easeCubicActionOut());
        var delay = cc.delayTime(1.2);
        var fade = cc.fadeOut(0.6);
        var callback = cc.callFunc(function () {
            var t = setTimeout(function () {
                // 销毁节点
                _this.node.destroy();
                clearTimeout(t);
            }, 200);
        });
        return this.close ?
            cc.sequence(big, small, delay, fade, callback) :
            cc.sequence(big, small);
    };
    Toast.prototype.start = function () {
        this.label.string = this.text;
        this.node.setPosition(cc.v2(0, 0));
        this.node.runAction(this.setAction());
    };
    Toast.prototype.onDestroy = function () {
        // 通知 game.ts 提示将关闭
        var eventSelect = new cc.Event.EventCustom('close_tips', true);
        this.node.dispatchEvent(eventSelect);
    };
    __decorate([
        property(cc.Label)
    ], Toast.prototype, "label", void 0);
    Toast = __decorate([
        ccclass
    ], Toast);
    return Toast;
}(cc.Component));
exports.default = Toast;

cc._RF.pop();