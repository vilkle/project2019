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
var Type_Tile;
(function (Type_Tile) {
    Type_Tile[Type_Tile["ZuoDaJieShu"] = 0] = "ZuoDaJieShu";
    Type_Tile[Type_Tile["ChuangGuanChengGong"] = 1] = "ChuangGuanChengGong";
    Type_Tile[Type_Tile["TiaoZhanJieShu"] = 2] = "TiaoZhanJieShu";
    Type_Tile[Type_Tile["TiaoZhanChengGong"] = 3] = "TiaoZhanChengGong";
    Type_Tile[Type_Tile["ChuangGuanJieShu"] = 4] = "ChuangGuanJieShu";
})(Type_Tile = exports.Type_Tile || (exports.Type_Tile = {}));
exports.DefalutTitle = ["作答结束", "闯关成功", "挑战结束", "挑战成功", "闯关结束"];
var FontMap = {
    "作": "img_zuo",
    "答": "img_da",
    "结": "img_jie",
    "束": "img_shu",
    "成": "img_cheng",
    "功": "img_gong",
    "挑": "img_tiao",
    "战": "img_zhan",
    "闯": "img_chuang",
    "关": "img_guan",
};
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
        _this.callback = null;
        _this.endInAnimationOver = false;
        _this.img_titles = [];
        return _this;
    }
    OverTips_1 = OverTips;
    OverTips.prototype.onLoad = function () {
        cc.loader.loadRes("images/OverTips/word", cc.SpriteAtlas, function (err, atlas) { });
    };
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
    OverTips.prototype.init = function (type, str, callback, endTitle) {
        if (str === void 0) { str = ""; }
        this.callback = callback;
        this.spine_false.node.active = type == 0;
        this.spine_true.node.active = type == 1;
        this.spine_complete.node.active = type == 2;
        this.label_tip.string = str;
        this.label_tip.node.active = type == 2;
        switch (type) {
            case 0:
                Tools_1.Tools.playSpine(this.spine_false, "false", false, this.delayClose.bind(this));
                AudioManager_1.AudioManager.getInstance().playSound("sfx_genneg", false, 1);
                break;
            case 1:
                Tools_1.Tools.playSpine(this.spine_true, "true", false, this.delayClose.bind(this));
                AudioManager_1.AudioManager.getInstance().playSound("sfx_genpos", false, 1);
                break;
            case 2:
                this.spine_complete.node.active = false;
                if (!endTitle)
                    endTitle = exports.DefalutTitle[0];
                if (endTitle.length != 4)
                    return;
                for (var index = 0; index < 4; index++) {
                    this.createTitleImage(endTitle[index]);
                }
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
    OverTips.prototype.onClickClose = function (event, customEventData) {
        if (event)
            AudioManager_1.AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        if (this.callback)
            this.callback();
        UIManager_1.UIManager.getInstance().closeUI(OverTips_1);
    };
    OverTips.prototype.createTitleImage = function (titleName) {
        cc.loader.loadRes("images/OverTips/word", cc.SpriteAtlas, function (err, atlas) {
            var _this = this;
            if (err) {
                console.log(err.message || err);
                return;
            }
            var spriteFrame = atlas.getSpriteFrame(FontMap[titleName]);
            var imageNode = new cc.Node();
            var image = imageNode.addComponent(cc.Sprite);
            image.spriteFrame = spriteFrame;
            imageNode.parent = this.node;
            this.img_titles.push(imageNode);
            if (this.img_titles.length == 4) {
                this.endInAnimationOver = true;
                this.spine_complete.node.active = true;
                Tools_1.Tools.playSpine(this.spine_complete, "in", false, function () {
                    Tools_1.Tools.playSpine(_this.spine_complete, "stand", true);
                    _this.endInAnimationOver = false;
                });
                AudioManager_1.AudioManager.getInstance().playSound("sfx_geupgrd", false, 1);
            }
        }.bind(this));
    };
    OverTips.prototype.update = function () {
        if (!this.endInAnimationOver)
            return;
        var bone = this.spine_complete.findBone("paipai");
        var bone1 = this.spine_complete.findBone("xiaoU");
        var bone2 = this.spine_complete.findBone("mimiya");
        var bone3 = this.spine_complete.findBone("doudou");
        this.img_titles[0].position = cc.v2(bone.worldX - 139, bone.worldY - 135);
        this.img_titles[1].position = cc.v2(bone1.worldX - 139, bone1.worldY - 135);
        this.img_titles[2].position = cc.v2(bone2.worldX - 139, bone2.worldY - 135);
        this.img_titles[3].position = cc.v2(bone3.worldX - 139, bone3.worldY - 135);
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
        