(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/Item/AnswerItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4ba05Fi/cNBMZrV3KLSva50', 'AnswerItem', __filename);
// scripts/UI/Item/AnswerItem.ts

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
var ListenerType_1 = require("../../Data/ListenerType");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AnswerItem = /** @class */ (function (_super) {
    __extends(AnswerItem, _super);
    function AnswerItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.jiaBtn = null;
        _this.jieBtn = null;
        _this.btnNode = null;
        _this.textString = "";
        _this.lastString = "";
        _this.index = 0;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    AnswerItem.prototype.start = function () {
    };
    AnswerItem.prototype.onJiaBtnClick = function () {
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnDaAnZengJia, { index: this.index });
    };
    AnswerItem.prototype.onJieBtnClick = function () {
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnDaAnShanChu, { index: this.index, node: this.node });
    };
    /**
     *
     * @param type
     *  0= 全部按钮隐藏
     *  1= 添加按钮不可用
     *  2= 删除按钮不可用
     */
    AnswerItem.prototype.setBtn = function (type) {
        this.jiaBtn.interactable = true;
        this.jieBtn.interactable = true;
        this.btnNode.active = true;
        if (type == 1) {
            this.jiaBtn.interactable = false;
        }
        else if (type == 2) {
            this.jieBtn.interactable = false;
        }
        else if (type == 0) {
            this.btnNode.active = false;
        }
    };
    AnswerItem.prototype.editingEnded = function (event) {
        this.textString = this.label.string;
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEndOfInput, { text: this.textString, index: this.index });
    };
    AnswerItem.prototype.setText = function (str) {
        this.label.string = str;
    };
    AnswerItem.prototype.onDestroy = function () {
    };
    AnswerItem.className = "AnswerItem";
    __decorate([
        property(cc.EditBox)
    ], AnswerItem.prototype, "label", void 0);
    __decorate([
        property(cc.Button)
    ], AnswerItem.prototype, "jiaBtn", void 0);
    __decorate([
        property(cc.Button)
    ], AnswerItem.prototype, "jieBtn", void 0);
    __decorate([
        property(cc.Node)
    ], AnswerItem.prototype, "btnNode", void 0);
    AnswerItem = __decorate([
        ccclass
    ], AnswerItem);
    return AnswerItem;
}(BaseUI_1.BaseUI));
exports.default = AnswerItem;

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
        //# sourceMappingURL=AnswerItem.js.map
        