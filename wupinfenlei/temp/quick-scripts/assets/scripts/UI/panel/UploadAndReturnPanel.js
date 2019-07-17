(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/UploadAndReturnPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8a2a4ho4VlCloJCvzPCR9a/', 'UploadAndReturnPanel', __filename);
// scripts/UI/panel/UploadAndReturnPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var GamePanel_1 = require("./GamePanel");
var SubmissionPanel_1 = require("./SubmissionPanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
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
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 0 });
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1.default);
        UIManager_1.UIManager.getInstance().closeUI(UploadAndReturnPanel_1);
    };
    UploadAndReturnPanel.prototype.onTiJiao = function () {
        if (DaAnData_1.DaAnData.getInstance().submitEnable) {
            UIManager_1.UIManager.getInstance().showUI(SubmissionPanel_1.default);
        }
        else {
            UIHelp_1.UIHelp.showTip('请通关后进行保存。');
        }
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
        //# sourceMappingURL=UploadAndReturnPanel.js.map
        