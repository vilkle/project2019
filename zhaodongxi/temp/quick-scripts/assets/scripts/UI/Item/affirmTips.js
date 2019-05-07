(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/Item/affirmTips.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '67e25WAGoRADq1zkpxqqwdF', 'affirmTips', __filename);
// scripts/UI/Item/affirmTips.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var affirmTips = /** @class */ (function (_super) {
    __extends(affirmTips, _super);
    function affirmTips() {
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
    affirmTips_1 = affirmTips;
    affirmTips.prototype.start = function () {
    };
    //type 成功 1 失败 2
    affirmTips.prototype.init = function (type, des, callback) {
        this.title.node.active = false;
        this.des.node.active = true;
        this.type = type;
        this.callback = callback;
        //console.log("到了初始化");
        //Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string = des;
        this.callback = callback;
    };
    affirmTips.prototype.OnClickClose = function () {
        //console.log("关闭");
    };
    //通用动画
    affirmTips.prototype.TipsAnimatorScale = function (nodeObj) {
        nodeObj.stopAllActions();
        var seq = cc.sequence(cc.delayTime(1), cc.scaleTo(0.2, 1, 1));
        nodeObj.runAction(seq);
        // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));
    };
    //ok 1 确认 0 取消
    affirmTips.prototype.OnClickOk = function () {
        console.log("确认");
        UIManager_1.UIManager.getInstance().closeUI(affirmTips_1);
        this.callback(1);
    };
    affirmTips.prototype.OnClickCancel = function () {
        console.log("取消");
        UIManager_1.UIManager.getInstance().closeUI(affirmTips_1);
        this.callback(0);
    };
    var affirmTips_1;
    affirmTips.className = "affirmTips";
    __decorate([
        property(cc.Node)
    ], affirmTips.prototype, "NodeDes", void 0);
    __decorate([
        property(cc.Label)
    ], affirmTips.prototype, "title", void 0);
    __decorate([
        property(cc.Label)
    ], affirmTips.prototype, "des", void 0);
    __decorate([
        property(cc.Button)
    ], affirmTips.prototype, "close", void 0);
    __decorate([
        property(cc.Button)
    ], affirmTips.prototype, "ok", void 0);
    __decorate([
        property(cc.Button),
        property(sp.Skeleton)
    ], affirmTips.prototype, "sp_BgAnimator", void 0);
    __decorate([
        property(sp.Skeleton)
    ], affirmTips.prototype, "sp_lightAnimator", void 0);
    affirmTips = affirmTips_1 = __decorate([
        ccclass
    ], affirmTips);
    return affirmTips;
}(BaseUI_1.BaseUI));
exports.affirmTips = affirmTips;

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
        //# sourceMappingURL=affirmTips.js.map
        