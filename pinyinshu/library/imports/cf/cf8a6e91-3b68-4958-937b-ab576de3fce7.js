"use strict";
cc._RF.push(module, 'cf8a66RO2hJWJN7q1dt4/zn', 'LoadingUI');
// scripts/UI/panel/LoadingUI.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var ConstValue_1 = require("../../Data/ConstValue");
var TeacherPanel_1 = require("./TeacherPanel");
var GamePanel_1 = require("./GamePanel");
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoadingUI = /** @class */ (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.progressBar = null;
        _this.progressLabel = null;
        _this.dragonNode = null;
        return _this;
    }
    LoadingUI.prototype.onLoad = function () {
        var _this = this;
        NetWork_1.NetWork.getInstance().GetRequest();
        var onProgress = function (completedCount, totalCount, item) {
            _this.progressBar.progress = completedCount / totalCount;
            var value = Math.round(completedCount / totalCount * 100);
            if (ConstValue_1.ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('loading', value);
            }
            _this.progressLabel.string = value.toString() + '%';
            var posX = completedCount / totalCount * 609 - 304;
            _this.dragonNode.x = posX;
        };
        if (ConstValue_1.ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('load start');
        }
        var openPanel = ConstValue_1.ConstValue.IS_TEACHER ? TeacherPanel_1.default : GamePanel_1.default;
        UIManager_1.UIManager.getInstance().openUI(openPanel, 0, function () {
            if (ConstValue_1.ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('load end');
                courseware.page.sendToParent('start');
            }
            _this.node.active = false;
        }, onProgress);
    };
    LoadingUI.className = "LoadingUI";
    __decorate([
        property(cc.ProgressBar)
    ], LoadingUI.prototype, "progressBar", void 0);
    __decorate([
        property(cc.Label)
    ], LoadingUI.prototype, "progressLabel", void 0);
    __decorate([
        property(cc.Node)
    ], LoadingUI.prototype, "dragonNode", void 0);
    LoadingUI = __decorate([
        ccclass
    ], LoadingUI);
    return LoadingUI;
}(BaseUI_1.BaseUI));
exports.LoadingUI = LoadingUI;

cc._RF.pop();