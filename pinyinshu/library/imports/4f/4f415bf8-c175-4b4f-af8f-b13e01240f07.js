"use strict";
cc._RF.push(module, '4f415v4wXVLT6+PsT4BJA8H', 'LoadingUI');
// scripts/UI/panel/LoadingUI.ts

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
var ConstValue_1 = require("../../Data/ConstValue");
var TeacherPanel_1 = require("./TeacherPanel");
var GamePanel_1 = require("./GamePanel");
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var DataReporting_1 = require("../../Data/DataReporting");
var TimeManager_1 = require("../../Manager/TimeManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoadingUI = /** @class */ (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.progressBar = null;
        _this.progressLabel = null;
        _this.dragonNode = null;
        _this.isLoadStart = false;
        return _this;
    }
    LoadingUI.prototype.onLoad = function () {
        var _this = this;
        NetWork_1.NetWork.getInstance().GetRequest();
        var onProgress = function (completedCount, totalCount, item) {
            if (!_this.isLoadStart) {
                _this.isLoadStart = true;
                NetWork_1.NetWork.getInstance().LogJournalReport("ResLoadStart", { curTime: TimeManager_1.TimeManager.getInstance().getNowFormatDate() });
            }
            _this.progressBar.progress = completedCount / totalCount;
            var value = Math.round(completedCount / totalCount * 100);
            DataReporting_1.default.getInstance().dispatchEvent('loading', value);
            _this.progressLabel.string = value.toString() + '%';
            var posX = completedCount / totalCount * 609 - 304;
            _this.dragonNode.x = posX;
        };
        DataReporting_1.default.getInstance().dispatchEvent('load start');
        var openPanel = ConstValue_1.ConstValue.IS_TEACHER ? TeacherPanel_1.default : GamePanel_1.default;
        UIManager_1.UIManager.getInstance().openUI(openPanel, null, 0, function () {
            NetWork_1.NetWork.getInstance().LogJournalReport("ResLoadEnd", { curTime: TimeManager_1.TimeManager.getInstance().getNowFormatDate() });
            DataReporting_1.default.getInstance().dispatchEvent('load end');
            DataReporting_1.default.getInstance().dispatchEvent('start');
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