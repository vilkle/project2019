(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/TeacherPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel', __filename);
// scripts/UI/panel/TeacherPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var DaAnData_1 = require("../../Data/DaAnData");
var GamePanel_1 = require("./GamePanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeacherPanel.prototype.onLoad = function () {
        this.getNet();
    };
    TeacherPanel.prototype.start = function () {
    };
    TeacherPanel.prototype.update = function () {
    };
    TeacherPanel.prototype.initData = function () {
        this.checkpointsEditBox.string = String(DaAnData_1.DaAnData.getInstance().checkpointsNum);
        this.NumEditBox.string = String(DaAnData_1.DaAnData.getInstance().number);
    };
    TeacherPanel.prototype.ShowTips = function (tipString) {
        this.tipNode.active = true;
        this.tipNode.getChildByName("label").getComponent(cc.Label).string = tipString;
        this.tipNode.getChildByName("layout").on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
        });
    };
    TeacherPanel.prototype.closeTip = function () {
        this.tipNode.active = false;
    };
    TeacherPanel.prototype.button = function () {
        cc.log("checkpoint num", DaAnData_1.DaAnData.getInstance().checkpointsNum, DaAnData_1.DaAnData.getInstance().number);
        if (this.errorChecking()) {
            UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, function () {
                ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
            });
        }
    };
    TeacherPanel.prototype.checkpointEditingEnd = function (sender) {
        var text = this.checkpointsEditBox.string;
        switch (text) {
            case "1":
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 1;
                break;
            case "2":
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 2;
                break;
            case "3":
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 3;
                break;
            case "4":
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 4;
                break;
            default:
                this.checkpointsEditBox.string = '';
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 0;
                break;
        }
    };
    TeacherPanel.prototype.numberEditingEnd = function (sender) {
        DaAnData_1.DaAnData.getInstance().number = 0;
        var text = this.NumEditBox.string;
        var num = Number(text);
        if (num > 0) {
            DaAnData_1.DaAnData.getInstance().number = num;
        }
        else {
            this.NumEditBox.string = '';
            DaAnData_1.DaAnData.getInstance().number = 0;
        }
    };
    TeacherPanel.prototype.errorChecking = function () {
        if (DaAnData_1.DaAnData.getInstance().checkpointsNum == 0) {
            this.ShowTips("关卡数不能为空，请输入关卡数。");
            return false;
        }
        else if (DaAnData_1.DaAnData.getInstance().number == 0) {
            this.ShowTips("被分解质因数的数不能为空。");
            return false;
        }
        else {
            return true;
        }
    };
    TeacherPanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var data = JSON.parse(response_data.data.courseware_content);
                    DaAnData_1.DaAnData.getInstance().number = data.number;
                    DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    cc.log("number is", DaAnData_1.DaAnData.getInstance().number);
                    cc.log("checkpointsNum is ", DaAnData_1.DaAnData.getInstance().checkpointsNum);
                    this.initData();
                }
            }
        }.bind(this), null);
    };
    TeacherPanel.className = "TeacherPanel";
    __decorate([
        property(cc.EditBox)
    ], TeacherPanel.prototype, "checkpointsEditBox", void 0);
    __decorate([
        property(cc.EditBox)
    ], TeacherPanel.prototype, "NumEditBox", void 0);
    __decorate([
        property(cc.Button)
    ], TeacherPanel.prototype, "submissonButton", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "tipNode", void 0);
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

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
        //# sourceMappingURL=TeacherPanel.js.map
        