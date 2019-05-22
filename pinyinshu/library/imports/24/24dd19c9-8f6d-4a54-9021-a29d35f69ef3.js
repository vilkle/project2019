"use strict";
cc._RF.push(module, '24dd1nJj21KVJAhop019p7z', 'AffirmTips');
// scripts/UI/Item/AffirmTips.ts

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
        _this.sp_BgAnimator = null; // 背景动画
        _this.sp_lightAnimator = null; // 光动画
        _this.callback = null;
        return _this;
        // update (dt) {}
    }
    AffirmTips_1 = AffirmTips;
    AffirmTips.prototype.start = function () {
    };
    //type 成功 1 失败 2
    AffirmTips.prototype.init = function (type, des, callback) {
        this.title.node.active = false;
        this.des.node.active = true;
        this.type = type;
        this.callback = callback;
        //console.log("到了初始化");
        //Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string = des;
        this.callback = callback;
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
        this.callback(1);
    };
    AffirmTips.prototype.OnClickCancel = function () {
        console.log("取消");
        UIManager_1.UIManager.getInstance().closeUI(AffirmTips_1);
        this.callback(0);
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
        property(cc.Button),
        property(sp.Skeleton)
    ], AffirmTips.prototype, "sp_BgAnimator", void 0);
    __decorate([
        property(sp.Skeleton)
    ], AffirmTips.prototype, "sp_lightAnimator", void 0);
    AffirmTips = AffirmTips_1 = __decorate([
        ccclass
    ], AffirmTips);
    return AffirmTips;
}(BaseUI_1.BaseUI));
exports.AffirmTips = AffirmTips;

cc._RF.pop();