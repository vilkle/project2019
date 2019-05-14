(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/Item/OverTips.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0fe09CVpZpE96/+aPUom1lS', 'OverTips', __filename);
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
        _this.time = null;
        _this.close = null;
        _this.sp_BgAnimator = null; // 背景动画
        _this.sp_lightAnimator = null; // 光动画
        _this.rightButton = null;
        _this.leftButton = null;
        _this.closeButton = null;
        _this.layout = null;
        _this.callback = null;
        return _this;
        // update (dt) {}
    }
    OverTips_1 = OverTips;
    OverTips.prototype.start = function () {
    };
    //type 通关1 成功 2 失败 3
    OverTips.prototype.init = function (type, time, str, callback1, callback2) {
        this.type = type;
        //this.callback = callback;
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "fault", false);
        var minutes = time / 60 >> 0;
        var second = time % 60;
        var timestr = '用时 ' + minutes.toString() + ':' + second.toString();
        this.time.string = timestr;
        this.NodeDes.setScale(0.001, 0.001);
        //this.callback = callback;
        this.layout.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
        });
        if (type == 1) {
            this.Successful(str, 1);
            this.close.node.active = false;
            this.leftButton.node.active = false;
            this.closeButton.node.active = false;
            this.rightButton.node.active = false;
            this.leftButton.node.on('click', callback1, this);
            this.rightButton.node.on('click', callback2, this);
        }
        else if (type == 2) {
            this.Successful(str, 2);
            this.close.node.active = false;
            this.leftButton.node.active = false;
            this.rightButton.node.active = false;
            this.closeButton.node.active = false;
        }
        else if (type == 3) {
            this.failure(str);
            this.time.node.active = false;
            this.closeButton.node.active = false;
            this.rightButton.node.active = false;
            this.leftButton.node.active = false;
            this.time.node.active = false;
            this.close.node.active = true;
        }
        this.TipsAnimatorScale(this.NodeDes);
    };
    //成功
    OverTips.prototype.Successful = function (str, type) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = true;
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "fault", false);
        Tools_1.Tools.playSpine(this.sp_BgAnimator, "right_1", false, function () {
            if (type == 1) {
                this.leftButton.node.active = true;
                this.closeButton.node.active = true;
            }
            else if (type == 2) {
                this.leftButton.node.active = true;
                this.rightButton.node.active = true;
            }
        }.bind(this));
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
        UIManager_1.UIManager.getInstance().closeUI(OverTips_1);
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
        property(cc.Label)
    ], OverTips.prototype, "time", void 0);
    __decorate([
        property(cc.Button)
    ], OverTips.prototype, "close", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "sp_BgAnimator", void 0);
    __decorate([
        property(sp.Skeleton)
    ], OverTips.prototype, "sp_lightAnimator", void 0);
    __decorate([
        property(cc.Button)
    ], OverTips.prototype, "rightButton", void 0);
    __decorate([
        property(cc.Button)
    ], OverTips.prototype, "leftButton", void 0);
    __decorate([
        property(cc.Button)
    ], OverTips.prototype, "closeButton", void 0);
    __decorate([
        property(cc.Layout)
    ], OverTips.prototype, "layout", void 0);
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
        