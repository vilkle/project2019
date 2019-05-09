(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/GamePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel', __filename);
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var DaAnData_1 = require("../../Data/DaAnData");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.YZ = new Array();
        return _this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        this.isTecher();
        this.initData();
    };
    GamePanel.prototype.start = function () {
        this.openClock();
        this.decompose(DaAnData_1.DaAnData.getInstance().number);
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.update = function (dt) {
    };
    GamePanel.prototype.isTecher = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
        }
        else {
        }
    };
    GamePanel.prototype.initData = function () {
        this.timer = 0;
        cc.loader.loadRes("");
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var data = JSON.parse(response_data.data.courseware_content);
                    if (data.number) {
                        DaAnData_1.DaAnData.getInstance().number = data.number;
                    }
                    if (data.checkpointsNum) {
                        DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    }
                }
            }
        }.bind(this), null);
    };
    GamePanel.prototype.decompose = function (num) {
        DaAnData_1.DaAnData.getInstance().number = 266;
        var index = 0;
        var i = 2;
        var a = String(DaAnData_1.DaAnData.getInstance().number) + '=';
        if (num == 1 || num == 2 || num == 3) {
            this.YZ[index++] = num;
            return this.YZ;
        }
        for (; i <= num / 2; i++) {
            if (num % i == 0) {
                this.YZ[index++] = i; //每得到一个质因数就存进YZ
                this.decompose(num / i);
                break;
            }
        }
        if (i > num / 2) {
            this.YZ[index++] = num; //存放最后一次结果
        }
        var StrArr = '';
        for (var i_1 = 0; i_1 < this.YZ.length; i_1++) {
            if (i_1 < this.YZ.length - 1) {
                StrArr = StrArr + String(this.YZ[i_1]) + '*';
            }
            else {
                StrArr = StrArr + String(this.YZ[i_1]);
            }
        }
        cc.log(this.YZ);
        this.numberStr.getComponent(cc.Label).string = StrArr;
    };
    GamePanel.prototype.openClock = function () {
        this.intervalIndex = setInterval(function () {
            this.timer = this.timer + 1;
            var minutes = this.timer / 60 >> 0;
            var second = this.timer % 60;
            this.minStr = String(minutes);
            this.secStr = String(second);
            if (minutes < 10) {
                this.minStr = "0" + this.minStr;
            }
            if (second < 10) {
                this.secStr = "0" + this.secStr;
            }
            this.minutes.getComponent(cc.Label).string = this.minStr;
            this.second.getComponent(cc.Label).string = this.secStr;
        }.bind(this), 1000);
    };
    GamePanel.prototype.closeClock = function () {
    };
    GamePanel.prototype.backButton = function () {
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1);
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 0 });
    };
    GamePanel.prototype.submitButton = function () {
        this.decompose(DaAnData_1.DaAnData.getInstance().number);
        //UIManager.getInstance().openUI(SubmissionPanel);
    };
    var GamePanel_1;
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "back", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "submit", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "queren", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "quxiao", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "chongzhi", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "tijiao", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "minutes", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "second", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "numberStr", void 0);
    GamePanel = GamePanel_1 = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

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
        //# sourceMappingURL=GamePanel.js.map
        