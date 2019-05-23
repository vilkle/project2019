"use strict";
cc._RF.push(module, 'c44e6cLg85JzaIFNvBdsH7x', 'UIHelp');
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
    UIHelp.showOverTips = function (type, time, str, callback1, callback2) {
        var overTips = UIManager_1.UIManager.getInstance().getUI(OverTips_1.OverTips);
        if (!overTips) {
            UIManager_1.UIManager.getInstance().openUI(OverTips_1.OverTips, 200, function () {
                UIHelp.showOverTips(type, time, str, callback1, callback2);
            });
        }
        else {
            overTips.init(type, time, str, callback1, callback2);
        }
    };
    UIHelp.showAffirmTips = function (type, des, callback1, callback2) {
        var affirmTips = UIManager_1.UIManager.getInstance().getUI(AffirmTips_1.AffirmTips);
        if (!affirmTips) {
            UIManager_1.UIManager.getInstance().openUI(AffirmTips_1.AffirmTips, 200, function () {
                UIHelp.showAffirmTips(type, des, callback1, callback2);
            });
        }
        else {
            affirmTips.init(type, des, callback1, callback2);
        }
    };
    return UIHelp;
}());
exports.UIHelp = UIHelp;

cc._RF.pop();