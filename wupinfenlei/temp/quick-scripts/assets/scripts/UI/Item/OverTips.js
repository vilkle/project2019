(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/Item/OverTips.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd402btyepNJObcDSUkLUQcr', 'OverTips', __filename);
// scripts/UI/Item/OverTips.ts

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
var BaseUI_1 = require("../BaseUI");
var Tools_1 = require("../../UIComm/Tools");
var UIManager_1 = require("../../Manager/UIManager");
var AudioManager_1 = require("../../Manager/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var OverTips = /** @class */ (function (_super) {
    __extends(OverTips, _super);
    function OverTips() {
        var _this = _super.call(this) || this;
        _this.label_tip = null;
        _this.spine_false = null;
        _this.spine_true = null;
        _this.spine_complete = null;
        _this.node_close = null;
        _this.button = null;
        _this.callback = null;
        return _this;
    }
    OverTips_1 = OverTips;
    OverTips.prototype.start = function () {
        this.node_close.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    };
    OverTips.prototype.onDisable = function () {
        this.node_close.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    };
    /**
     设置显示内容
     @param {number} type          0: 错误  1：答对了  2：闯关成功(一直显示不会关闭)
     @param {string} str           提示内容
     */
    OverTips.prototype.init = function (type, str, btnStr, callback, btnCallback) {
        var _this = this;
        if (str === void 0) { str = ""; }
        if (btnStr === void 0) { btnStr = ''; }
        this.callback = callback;
        this.spine_false.node.active = type == 0;
        this.spine_true.node.active = type == 1;
        this.spine_complete.node.active = type == 2;
        this.label_tip.string = str;
        //this.label_tip.node.active = type != 2;
        if (btnStr) {
            this.button.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = btnStr;
            this.button.on('click', btnCallback, this);
        }
        else {
            this.button.active = false;
        }
        switch (type) {
            case 0:
                Tools_1.Tools.playSpine(this.spine_false, "false", false, this.delayClose.bind(this));
                AudioManager_1.AudioManager.getInstance().playSound("sfx_genneg", false, 1);
                break;
            case 1:
                Tools_1.Tools.playSpine(this.spine_true, "true", false, this.delayClose.bind(this));
                AudioManager_1.AudioManager.getInstance().playSound("sfx_genpos", false, 1);
                setTimeout(function () {
                    _this.callback();
                }, 1500);
                break;
            case 2:
                Tools_1.Tools.playSpine(this.spine_complete, "in", false, function () {
                    Tools_1.Tools.playSpine(this.spine_complete, "stand", true, this.delayClose.bind(this));
                }.bind(this));
                AudioManager_1.AudioManager.getInstance().playSound("sfx_geupgrd", false, 1);
                setTimeout(function () {
                    _this.callback();
                }, 1500);
                break;
        }
        var endPos = this.label_tip.node.position;
        var framePos_1 = cc.v2(endPos.x, endPos.y - 72.8);
        var framePos_2 = cc.v2(endPos.x, endPos.y + 12);
        var framePos_3 = cc.v2(endPos.x, endPos.y - 8);
        var framePos_4 = cc.v2(endPos.x, endPos.y + 7.3);
        this.label_tip.node.position = framePos_1;
        this.label_tip.node.runAction(cc.sequence(cc.moveTo(0.08, framePos_2), cc.moveTo(0.08, framePos_3), cc.moveTo(0.08, framePos_4), cc.moveTo(0.06, endPos)));
    };
    OverTips.prototype.delayClose = function () {
        //this.scheduleOnce(()=>{this.callback()}, 0);
    };
    OverTips.prototype.onClickClose = function (event, customEventData) {
        if (event)
            AudioManager_1.AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        if (this.callback)
            this.callback();
        UIManager_1.UIManager.getInstance().closeUI(OverTips_1);
    };
    var OverTips_1;
    OverTips.className = "OverTips";
    __decorate([
        property(cc.Label)
    ], OverTips.prototype, "label_tip", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "spine_false", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "spine_true", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "spine_complete", void 0);
    __decorate([
        property(cc.Node)
    ], OverTips.prototype, "node_close", void 0);
    __decorate([
        property(cc.Node)
    ], OverTips.prototype, "button", void 0);
    OverTips = OverTips_1 = __decorate([
        ccclass
    ], OverTips);
    return OverTips;
}(BaseUI_1.BaseUI));
exports.OverTips = OverTips;

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
        //# sourceMappingURL=OverTips.js.map
        