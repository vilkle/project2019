"use strict";
cc._RF.push(module, '0fe09CVpZpE96/+aPUom1lS', 'OverTips');
// scripts/UI/Item/OverTips.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var Tools_1 = require("../../UIComm/Tools");
var UIManager_1 = require("../../Manager/UIManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var OverTips = /** @class */ (function (_super) {
    __extends(OverTips, _super);
    function OverTips() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.NodeDes = null; //描述节点
        _this.des = null;
        _this.close = null;
        _this.sp_BgAnimator = null; // 背景动画
        _this.sp_lightAnimator = null; // 光动画
        _this.callback = null;
        return _this;
        // update (dt) {}
    }
    OverTips_1 = OverTips;
    OverTips.prototype.start = function () {
    };
    //type 成功 1 失败 2
    OverTips.prototype.init = function (type, str, callback) {
        this.type = type;
        this.callback = callback;
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.NodeDes.setScale(0.001, 0.001);
        this.callback = callback;
        if (type == 1) {
            this.Successful(str);
            this.close.node.active = false;
        }
        else if (type == 2) {
            this.failure(str);
            this.close.node.active = true;
        }
        this.TipsAnimatorScale(this.NodeDes);
    };
    //成功
    OverTips.prototype.Successful = function (str) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = true;
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "fault", false);
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "right_1", false, function () {
            // console.log("播发完成");
        });
        Tools_1.Tools.playSpine(this.sp_lightAnimator, "light", false, function () {
        }.bind(this));
        this.des.string = str;
        this.des.node.color = new cc.Color(39, 178, 187);
    };
    //失败
    OverTips.prototype.failure = function (str) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = false;
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string = str;
        // this.des.node.color = new cc.Color(39, 178, 187);
    };
    OverTips.prototype.OnClickClose = function () {
        if (this.type == 1) {
            //界面不关闭
        }
        else {
            UIManager_1.UIManager.getInstance().closeUI(OverTips_1);
        }
        // this.node.active = false;
    };
    //通用动画
    OverTips.prototype.TipsAnimatorScale = function (nodeObj) {
        nodeObj.stopAllActions();
        var seq = cc.sequence(cc.delayTime(1), cc.scaleTo(0.2, 1, 1));
        nodeObj.runAction(seq);
        // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));
    };
    var OverTips_1;
    OverTips.className = "OverTips";
    __decorate([
        property(cc.Node)
    ], OverTips.prototype, "NodeDes", void 0);
    __decorate([
        property(cc.Label)
    ], OverTips.prototype, "des", void 0);
    __decorate([
        property(cc.Button)
    ], OverTips.prototype, "close", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "sp_BgAnimator", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "sp_lightAnimator", void 0);
    OverTips = OverTips_1 = __decorate([
        ccclass
    ], OverTips);
    return OverTips;
}(BaseUI_1.BaseUI));
exports.OverTips = OverTips;

cc._RF.pop();