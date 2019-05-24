(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/UIHelp.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c44e6cLg85JzaIFNvBdsH7x', 'UIHelp', __filename);
// scripts/Utils/UIHelp.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UIManager_1 = require("../Manager/UIManager");
var TipUI_1 = require("../UI/panel/TipUI");
var OverTips_1 = require("../UI/Item/OverTips");
var AffirmTips_1 = require("../UI/Item/AffirmTips");
var UIHelp = /** @class */ (function () {
    function UIHelp() {
    }
    UIHelp.showTip = function (message) {
        var tipUI = UIManager_1.UIManager.getInstance().getUI(TipUI_1.TipUI);
        if (!tipUI) {
            UIManager_1.UIManager.getInstance().openUI(TipUI_1.TipUI, 200, function () {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    };
    UIHelp.showOverTips = function (type, str) {
        var overTips = UIManager_1.UIManager.getInstance().getUI(OverTips_1.OverTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(OverTips_1.OverTips, 200, function () {
                UIHelp.showOverTips(type, str);
            });
        }
        else {
            overTips.init(type, str);
        }
    };
    UIHelp.showAffirmTips = function (type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk) {
        var affirmTips = UIManager_1.UIManager.getInstance().getUI(AffirmTips_1.AffirmTips);
        if (!affirmTips) {
            UIManager_1.UIManager.getInstance().openUI(AffirmTips_1.AffirmTips, 200, function () {
                UIHelp.showAffirmTips(type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk);
            });
        }
        else {
            affirmTips.init(type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk);
        }
    };
    return UIHelp;
}());
exports.UIHelp = UIHelp;

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
        //# sourceMappingURL=UIHelp.js.map
        