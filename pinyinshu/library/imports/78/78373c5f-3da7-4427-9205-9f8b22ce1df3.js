"use strict";
cc._RF.push(module, '78373xfPadEJ5IFn4sizh3z', 'ErrorPanel');
// scripts/UI/panel/ErrorPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var AudioManager_1 = require("../../Manager/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ErrorPanel = /** @class */ (function (_super) {
    __extends(ErrorPanel, _super);
    function ErrorPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.biaoTi = null;
        _this.shuoMing = null;
        _this.tiShi = null;
        _this.btnLab = null;
        _this.btn = null;
        _this.isClose = false;
        return _this;
    }
    ErrorPanel_1 = ErrorPanel;
    ErrorPanel.prototype.start = function () {
        // cc.director.pause();
    };
    ErrorPanel.prototype.onLoad = function () {
    };
    /**
     * 设置错误弹窗数据
     * @param shuoMing 错误说明
     * @param biaoTi 标题文字
     * @param tiShi 提示文字
     * @param btnLab 按钮文字
     * @param callBack 回调函数
     * @param isClose 是否可关闭
     */
    ErrorPanel.prototype.setPanel = function (shuoMing, biaoTi, tiShi, btnLab, callBack, isClose) {
        if (isClose === void 0) { isClose = false; }
        AudioManager_1.AudioManager.getInstance().playSound("sfx_erro", false, 1);
        this.shuoMing.string = shuoMing;
        this.isClose = isClose;
        this.callback = callBack;
        this.biaoTi.string = biaoTi ? biaoTi : this.biaoTi.string;
        this.tiShi.string = tiShi ? tiShi : this.tiShi.string;
        this.btnLab.string = btnLab ? btnLab : this.btnLab.string;
        this.btn.interactable = this.isClose;
    };
    ErrorPanel.prototype.onBtnClick = function () {
        AudioManager_1.AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        if (this.callback) {
            this.callback();
        }
        if (this.isClose) {
            UIManager_1.UIManager.getInstance().closeUI(ErrorPanel_1);
        }
    };
    var ErrorPanel_1;
    ErrorPanel.className = "ErrorPanel";
    __decorate([
        property(cc.Label)
    ], ErrorPanel.prototype, "biaoTi", void 0);
    __decorate([
        property(cc.Label)
    ], ErrorPanel.prototype, "shuoMing", void 0);
    __decorate([
        property(cc.Label)
    ], ErrorPanel.prototype, "tiShi", void 0);
    __decorate([
        property(cc.Label)
    ], ErrorPanel.prototype, "btnLab", void 0);
    __decorate([
        property(cc.Button)
    ], ErrorPanel.prototype, "btn", void 0);
    ErrorPanel = ErrorPanel_1 = __decorate([
        ccclass
    ], ErrorPanel);
    return ErrorPanel;
}(BaseUI_1.BaseUI));
exports.default = ErrorPanel;

cc._RF.pop();