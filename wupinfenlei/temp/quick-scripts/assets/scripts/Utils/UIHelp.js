(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/UIHelp.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c44e6cLg85JzaIFNvBdsH7x', 'UIHelp', __filename);
// scripts/Utils/UIHelp.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UIManager_1 = require("../Manager/UIManager");
var TipUI_1 = require("../UI/panel/TipUI");
var affirmTips_1 = require("../UI/Item/affirmTips");
var OverTips_1 = require("../UI/Item/OverTips");
var UIHelp = /** @class */ (function () {
    function UIHelp() {
    }
    /**
     *
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    UIHelp.showTip = function (message) {
        var tipUI = UIManager_1.UIManager.getInstance().getUI(TipUI_1.TipUI);
        if (!tipUI) {
            UIManager_1.UIManager.getInstance().openUI(TipUI_1.TipUI, 211, null, function () {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    };
    /**
    * 结束tip
    * @param message tips文字内容
    * @param type tips类型  0:内容tips   1:系统tips
    */
    UIHelp.showOverTip = function (type, str, btnStr, callback, btnCallBack) {
        if (str === void 0) { str = ""; }
        if (btnStr === void 0) { btnStr = ""; }
        if (callback === void 0) { callback = null; }
        if (btnCallBack === void 0) { btnCallBack = null; }
        var overTips = UIManager_1.UIManager.getInstance().getUI(OverTips_1.OverTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(OverTips_1.OverTips, 210, null, function () {
                UIHelp.showOverTip(type, str, btnStr, callback, btnCallBack);
            });
        }
        else {
            overTips.init(type, str, btnStr, callback, btnCallBack);
        }
    };
    /**
    * 二次确认框
    * @param message tips文字内容
    * @param type tips类型  0:内容tips   1:系统tips
    */
    UIHelp.AffirmTip = function (type, des, callbackClose, callbackOk, btnCloselDes, btnOkDes, num) {
        var overTips = UIManager_1.UIManager.getInstance().getUI(affirmTips_1.AffirmTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(affirmTips_1.AffirmTips, 210, null, function () {
                UIHelp.AffirmTip(type, des, callbackClose, callbackOk, btnCloselDes, btnOkDes, num);
            });
        }
        else {
            overTips.init(type, des, callbackClose, callbackOk, btnCloselDes, btnOkDes, num);
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
        