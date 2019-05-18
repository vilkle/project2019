"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel');
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkpointsEditBox = null;
        _this.editBoxNode = null;
        _this.submissonButton = null;
        _this.tipNode = null;
        _this.editbox2 = null;
        _this.editboxArr = Array();
        return _this;
    }
    TeacherPanel.prototype.onLoad = function () {
        this.getNet();
        this.initData();
    };
    TeacherPanel.prototype.start = function () {
    };
    TeacherPanel.prototype.update = function () {
    };
    TeacherPanel.prototype.initData = function () {
        this.checkpointsEditBox.string = String(DaAnData_1.DaAnData.getInstance().checkpointsNum);
        this.checkpointEditingEnd(null);
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
        cc.log("checkpoint num", DaAnData_1.DaAnData.getInstance().checkpointsNum, DaAnData_1.DaAnData.getInstance().numberArr);
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
        for (var i = 0; i < this.editboxArr.length; i++) {
            this.editboxArr[i].destroy();
        }
        var _loop_1 = function (i) {
            var editbox = cc.instantiate(this_1.editbox2);
            editbox.x = 0;
            this_1.editboxArr.push(editbox);
            editbox.parent = this_1.editBoxNode;
            editbox.getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
            editbox.on('editing-did-ended', function (sender) {
                DaAnData_1.DaAnData.getInstance().numberArr[i] = parseInt(editbox.getComponent(cc.EditBox).string);
                cc.log(DaAnData_1.DaAnData.getInstance().numberArr);
            }.bind(this_1));
            if (DaAnData_1.DaAnData.getInstance().numberArr[i]) {
                editbox.getComponent(cc.EditBox).string = DaAnData_1.DaAnData.getInstance().numberArr[i].toString();
            }
        };
        var this_1 = this;
        for (var i = 0; i < parseInt(this.checkpointsEditBox.string); i++) {
            _loop_1(i);
        }
    };
    TeacherPanel.prototype.errorChecking = function () {
        if (DaAnData_1.DaAnData.getInstance().checkpointsNum == 0) {
            this.ShowTips("关卡数不能为空，请输入关卡数。");
            return false;
        }
        else if (DaAnData_1.DaAnData.getInstance().numberArr.length < DaAnData_1.DaAnData.getInstance().checkpointsNum) {
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
                    DaAnData_1.DaAnData.getInstance().numberArr = data.numberARR;
                    DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    cc.log("number is", DaAnData_1.DaAnData.getInstance().numberArr);
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
        property(cc.Node)
    ], TeacherPanel.prototype, "editBoxNode", void 0);
    __decorate([
        property(cc.Button)
    ], TeacherPanel.prototype, "submissonButton", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "tipNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "editbox2", void 0);
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

cc._RF.pop();