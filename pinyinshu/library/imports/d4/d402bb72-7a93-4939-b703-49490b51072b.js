"use strict";
cc._RF.push(module, 'd402btyepNJObcDSUkLUQcr', 'OverTips');
// scripts/UI/Item/OverTips.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
    OverTips.prototype.init = function (type, str) {
        if (str === void 0) { str = ""; }
        this.spine_false.node.active = type == 0;
        this.spine_true.node.active = type == 1;
        this.spine_complete.node.active = type == 2;
        this.label_tip.string = str;
        this.label_tip.node.active = type != 2;
        switch (type) {
            case 0:
                Tools_1.Tools.playSpine(this.spine_false, "false", false, this.delayClose.bind(this));
                break;
            case 1:
                Tools_1.Tools.playSpine(this.spine_true, "true", false, this.delayClose.bind(this));
                break;
            case 2:
                Tools_1.Tools.playSpine(this.spine_complete, "in", false, function () {
                    Tools_1.Tools.playSpine(this.spine_complete, "stand", true, this.delayClose.bind(this));
                }.bind(this));
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
        this.scheduleOnce(function () { this.onClickClose(); }.bind(this), 0);
    };
    OverTips.prototype.onClickClose = function () {
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
    OverTips = OverTips_1 = __decorate([
        ccclass
    ], OverTips);
    return OverTips;
}(BaseUI_1.BaseUI));
exports.OverTips = OverTips;

cc._RF.pop();