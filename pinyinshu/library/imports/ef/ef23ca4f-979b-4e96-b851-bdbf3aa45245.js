"use strict";
cc._RF.push(module, 'ef23cpPl5tOlrhRvb86pFJF', 'affirmTips');
// scripts/UI/Item/affirmTips.ts

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
var UIManager_1 = require("../../Manager/UIManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AffirmTips = /** @class */ (function (_super) {
    __extends(AffirmTips, _super);
    function AffirmTips() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.NodeDes = null; //描述节点
        _this.title = null;
        _this.des = null;
        _this.close = null;
        _this.ok = null;
        _this.btnCloseLabel = null;
        _this.btnOkLabel = null;
        _this.win = null; //描述节点
        _this.fail = null; //描述节点
        _this.callbackClose = null;
        _this.callbackOk = null;
        return _this;
        // update (dt) {}
    }
    AffirmTips_1 = AffirmTips;
    AffirmTips.prototype.start = function () {
    };
    //type 成功 1 失败 2
    AffirmTips.prototype.init = function (type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk) {
        this.title.node.active = true;
        this.des.node.active = false;
        cc.log(type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk);
        if (time >= 0) {
            this.des.node.active = true;
            var minutes = 0;
            var second = 0;
            minutes = time / 60 >> 0;
            second = time % 60;
            var minStr = String(minutes);
            var secStr = String(second);
            if (minutes < 10) {
                minStr = "0" + minStr;
            }
            if (second < 10) {
                secStr = "0" + secStr;
            }
            var timeStr = minStr + ' : ' + secStr;
            this.des.string = timeStr;
        }
        this.win.active = type == 1;
        this.fail.active = type == 2;
        this.type = type;
        this.callbackClose = callbackClose;
        //console.log("到了初始化");
        //Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.title.string = des;
        this.callbackOk = callbackOk;
        if (btnCloselDes) {
            btnCloselDes == "" ? "取消" : btnCloselDes;
            this.btnCloseLabel.string = btnCloselDes;
        }
        if (btnOkDes) {
            btnOkDes == "" ? "确定" : btnOkDes;
            this.btnOkLabel.string = btnOkDes;
        }
    };
    AffirmTips.prototype.setOnlyOneBtnType = function (btnOkDes) {
        this.close.node.active = false;
        this.ok.node.active = true;
        this.ok.node.position = cc.v2(0, this.ok.node.position.y);
        if (btnOkDes) {
            btnOkDes == "" ? "确定" : btnOkDes;
            this.btnOkLabel.string = btnOkDes;
            if (btnOkDes.length > 4)
                this.btnOkLabel.fontSize = 40;
        }
    };
    AffirmTips.prototype.OnClickClose = function () {
        //console.log("关闭");
    };
    //通用动画
    AffirmTips.prototype.TipsAnimatorScale = function (nodeObj) {
        nodeObj.stopAllActions();
        var seq = cc.sequence(cc.delayTime(1), cc.scaleTo(0.2, 1, 1));
        nodeObj.runAction(seq);
        // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));
    };
    //ok 1 确认 0 取消
    AffirmTips.prototype.OnClickOk = function () {
        console.log("确认");
        UIManager_1.UIManager.getInstance().closeUI(AffirmTips_1);
        if (this.callbackOk) {
            this.callbackOk();
        }
    };
    AffirmTips.prototype.OnClickCancel = function () {
        console.log("取消");
        UIManager_1.UIManager.getInstance().closeUI(AffirmTips_1);
        if (this.callbackClose) {
            this.callbackClose();
        }
    };
    var AffirmTips_1;
    AffirmTips.className = "AffirmTips";
    __decorate([
        property(cc.Node)
    ], AffirmTips.prototype, "NodeDes", void 0);
    __decorate([
        property(cc.Label)
    ], AffirmTips.prototype, "title", void 0);
    __decorate([
        property(cc.Label)
    ], AffirmTips.prototype, "des", void 0);
    __decorate([
        property(cc.Button)
    ], AffirmTips.prototype, "close", void 0);
    __decorate([
        property(cc.Button)
    ], AffirmTips.prototype, "ok", void 0);
    __decorate([
        property(cc.Label)
    ], AffirmTips.prototype, "btnCloseLabel", void 0);
    __decorate([
        property(cc.Label)
    ], AffirmTips.prototype, "btnOkLabel", void 0);
    __decorate([
        property(cc.Node)
    ], AffirmTips.prototype, "win", void 0);
    __decorate([
        property(cc.Node)
    ], AffirmTips.prototype, "fail", void 0);
    AffirmTips = AffirmTips_1 = __decorate([
        ccclass
    ], AffirmTips);
    return AffirmTips;
}(BaseUI_1.BaseUI));
exports.AffirmTips = AffirmTips;

cc._RF.pop();