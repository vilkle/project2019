"use strict";
cc._RF.push(module, '8a2a4ho4VlCloJCvzPCR9a/', 'UploadAndReturnPanel');
// scripts/UI/panel/UploadAndReturnPanel.ts

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
var GamePanel_1 = require("./GamePanel");
var SubmissionPanel_1 = require("./SubmissionPanel");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UploadAndReturnPanel = /** @class */ (function (_super) {
    __extends(UploadAndReturnPanel, _super);
    function UploadAndReturnPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UploadAndReturnPanel_1 = UploadAndReturnPanel;
    UploadAndReturnPanel.prototype.start = function () {
    };
    UploadAndReturnPanel.prototype.onFanHui = function () {
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1.default);
        UIManager_1.UIManager.getInstance().closeUI(UploadAndReturnPanel_1);
    };
    UploadAndReturnPanel.prototype.onTiJiao = function () {
        UIManager_1.UIManager.getInstance().showUI(SubmissionPanel_1.default);
    };
    var UploadAndReturnPanel_1;
    UploadAndReturnPanel.className = "UploadAndReturnPanel";
    UploadAndReturnPanel = UploadAndReturnPanel_1 = __decorate([
        ccclass
    ], UploadAndReturnPanel);
    return UploadAndReturnPanel;
}(BaseUI_1.BaseUI));
exports.default = UploadAndReturnPanel;

cc._RF.pop();