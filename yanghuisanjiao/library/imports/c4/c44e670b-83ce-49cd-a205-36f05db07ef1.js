"use strict";
cc._RF.push(module, 'c44e6cLg85JzaIFNvBdsH7x', 'UIHelp');
// scripts/Utils/UIHelp.ts

"use strict";
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
            UIManager_1.UIManager.getInstance().openUI(TipUI_1.TipUI, null, 200, function () {
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
    UIHelp.showOverTip = function (type, str, callback, endTitle) {
        if (str === void 0) { str = ""; }
        if (callback === void 0) { callback = null; }
        var overTips = UIManager_1.UIManager.getInstance().getUI(OverTips_1.OverTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(OverTips_1.OverTips, null, 210, function () {
                UIHelp.showOverTip(type, str, callback, endTitle);
            });
        }
        else {
            overTips.init(type, str, callback, endTitle);
        }
    };
    /**
    * 二次确认框
    * @param message tips文字内容
    * @param type tips类型  0:内容tips   1:系统tips
    */
    UIHelp.AffirmTip = function (type, des, callback, btnCloselDes, btnOkDes) {
        var overTips = UIManager_1.UIManager.getInstance().getUI(affirmTips_1.AffirmTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(affirmTips_1.AffirmTips, null, 210, function () {
                UIHelp.AffirmTip(type, des, callback, btnCloselDes, btnOkDes);
            });
        }
        else {
            overTips.init(type, des, callback, btnCloselDes, btnOkDes);
        }
    };
    return UIHelp;
}());
exports.UIHelp = UIHelp;

cc._RF.pop();