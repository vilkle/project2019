"use strict";
cc._RF.push(module, '8a2a4ho4VlCloJCvzPCR9a/', 'UploadAndReturnPanel');
// scripts/UI/panel/UploadAndReturnPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var SubmissionPanel_1 = require("./SubmissionPanel");
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UploadAndReturnPanel = /** @class */ (function (_super) {
    __extends(UploadAndReturnPanel, _super);
    function UploadAndReturnPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UploadAndReturnPanel.prototype.start = function () {
    };
    UploadAndReturnPanel.prototype.onFanHui = function () {
        // UIManager.getInstance().closeUI(GamePanel);
        // UIManager.getInstance().closeUI(UploadAndReturnPanel);
        // DaAnData.getInstance().submitEnable = false;
        // cc.log('22222222222222222');
    };
    UploadAndReturnPanel.prototype.onTiJiao = function () {
        if (DaAnData_1.DaAnData.getInstance().submitEnable) {
            UIManager_1.UIManager.getInstance().showUI(SubmissionPanel_1.default);
        }
        else {
            UIHelp_1.UIHelp.showTip('请通关后进行保存。');
        }
    };
    UploadAndReturnPanel.className = "UploadAndReturnPanel";
    UploadAndReturnPanel = __decorate([
        ccclass
    ], UploadAndReturnPanel);
    return UploadAndReturnPanel;
}(BaseUI_1.BaseUI));
exports.default = UploadAndReturnPanel;

cc._RF.pop();