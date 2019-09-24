(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/Item/egg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0865aX1MshL97Lp1m8KOZRK', 'egg', __filename);
// scripts/UI/Item/egg.ts

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
var Egg = /** @class */ (function (_super) {
    __extends(Egg, _super);
    function Egg() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelDisplay = null;
        // 阴影节点，保证其 scaleY 始终为 1
        _this.shadowDisplay = null;
        _this.eggSp = null;
        _this.eggSelected = null;
        _this.eggBgAction = null;
        // @property(cc.audioEngine)
        // 蛋壳上的文字
        _this.text = '';
        // 是否选中
        _this.selected = false;
        // 是否正确答案
        _this.bingo = false;
        // 是否回合结束
        _this.end = false;
        return _this;
    }
    Egg.prototype.handleClick = function (event) {
        // 派发 select 事件
        var eventSelect = new cc.Event.EventCustom('select', true);
        this.node.dispatchEvent(eventSelect);
    };
    Egg.prototype.handleClickCallback = function () {
        //执行相关动画
        this.eggSelected.runAction(this.setBgSection(this.selected));
        this.labelDisplay.node.runAction(this.setShakeAction());
        if (this.selected) {
            this.eggBgAction.active = true;
            this.eggBgAction.runAction(this.setSelectBgAction());
        }
    };
    Egg.prototype.handleGameOver = function (bingo) {
        //回合结束
        if (bingo) {
            //答对时重置
            this.selected = false;
            this.eggSelected.opacity = 0;
        }
        var str = bingo ? 'Correct' : 'Error';
        this["set" + str + "AnswerSpine"]();
    };
    Egg.prototype.setSelectBgAction = function () {
        var _this = this;
        //设置背景被选中时候的动画
        var big = cc.scaleTo(0.3, 1.3, 1.3).easing(cc.easeCubicActionOut());
        var fade = cc.fadeOut(0.3);
        var callback = cc.callFunc(function () {
            _this.eggBgAction.active = false;
            _this.eggBgAction.opacity = 150;
            _this.eggBgAction.scale = 1;
        }, 100);
        return cc.sequence(big, fade, callback);
    };
    Egg.prototype.setBgSection = function (selected) {
        //选中状态
        var fade = selected ? 'fadeIn' : 'fadeOut';
        return cc[fade](0.2);
    };
    Egg.prototype.setShakeAction = function () {
        // 设置摇晃动画
        var turnLeft = cc.rotateTo(0.1, 7);
        var turnRight = cc.rotateTo(0.2, -7);
        var trunBack = cc.rotateTo(0.1, 0);
        return cc.sequence(turnLeft, turnRight, trunBack);
    };
    Egg.prototype.setCorrectAnswerSpine = function () {
        // 回答正确的动画
        this.eggSp.timeScale = 1;
        this.eggSp.setSkin('niao');
        this.eggSp.setAnimation(0, 'in', false);
        // 随机选择一个动画
        var index = (Math.random() * 4) >> 0;
        switch (index) {
            case 0:
                this.eggSp.addAnimation(0, 'guodu_B', false);
                this.eggSp.addAnimation(0, 'guodu_B_standby_loop', true);
                break;
            case 1:
                this.eggSp.addAnimation(0, 'guodu_A', false);
                this.eggSp.addAnimation(0, 'guodu_A_yaobai_loop', true);
                break;
            case 2:
                this.eggSp.addAnimation(0, 'standby3_loop', true);
                break;
            default:
                this.eggSp.addAnimation(0, 'standby4_loop', true);
                break;
        }
    };
    Egg.prototype.setErrorAnswerSpine = function () {
        //回答错误的动画
        this.labelDisplay.node.runAction(this.setShakeAction());
        this.eggSp.node.runAction(this.setShakeAction());
        this.eggSelected.runAction(this.setShakeAction());
    };
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    Egg.prototype.start = function () {
        this.labelDisplay.string = this.text;
        //注册点击事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleClick, this);
    };
    // update (dt) {}
    Egg.prototype.onDestroy = function () {
        // 取消监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.handleClick, this);
    };
    __decorate([
        property(cc.Label)
    ], Egg.prototype, "labelDisplay", void 0);
    __decorate([
        property(cc.Node)
    ], Egg.prototype, "shadowDisplay", void 0);
    __decorate([
        property(sp.Skeleton)
    ], Egg.prototype, "eggSp", void 0);
    __decorate([
        property(cc.Node)
    ], Egg.prototype, "eggSelected", void 0);
    __decorate([
        property(cc.Node)
    ], Egg.prototype, "eggBgAction", void 0);
    Egg = __decorate([
        ccclass
    ], Egg);
    return Egg;
}(cc.Component));
exports.default = Egg;

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
        //# sourceMappingURL=egg.js.map
        