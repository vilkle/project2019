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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        this.isTecher();
        this.initData();
    };
    GamePanel.prototype.start = function () {
        this.openClock();
        var StrArr = String(DaAnData_1.DaAnData.getInstance().number) + '=';
        var YZ = this.decompose(DaAnData_1.DaAnData.getInstance().number);
        cc.log(YZ);
        for (var i = 0; i < YZ.length; i++) {
            if (i < YZ.length - 1) {
                StrArr = StrArr + String(YZ[i]) + '*';
            }
            else {
                StrArr = StrArr + String(YZ[i]);
            }
        }
        this.numberStr.getComponent(cc.Label).string = StrArr;
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
        var index = 0;
        var YZ = [];
        var i = 2;
        if (num == 1 || num == 2 || num == 3) {
            YZ[index++] = num;
            return YZ;
        }
        for (; i <= num / 2; i++) {
            if (num % i == 0) {
                YZ[index++] = i; //每得到一个质因数就存进YZ
                this.decompose(num / i);
                break;
            }
        }
        if (i > num / 2) {
            YZ[index++] = num; //存放最后一次结果
        }
        return YZ;
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
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "bubble_none1", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "bubble_none2", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "gunNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "garbageNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "mask", void 0);
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
        