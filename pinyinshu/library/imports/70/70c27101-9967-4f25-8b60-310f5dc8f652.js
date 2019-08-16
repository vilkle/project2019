"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel');
// scripts/UI/panel/TeacherPanel.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var DaAnData_1 = require("../../Data/DaAnData");
var GamePanel_1 = require("./GamePanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var UIHelp_1 = require("../../Utils/UIHelp");
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
        if (DaAnData_1.DaAnData.getInstance().checkpointsNum) {
            this.checkpointsEditBox.string = String(DaAnData_1.DaAnData.getInstance().checkpointsNum);
            this.checkpointEditingEnd(null);
        }
        cc.log('checkpointsnum is =', DaAnData_1.DaAnData.getInstance().checkpointsNum);
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
        this.editboxArr = [];
        var _loop_1 = function (i) {
            var editbox = cc.instantiate(this_1.editbox2);
            editbox.x = 0;
            this_1.editboxArr.push(editbox);
            editbox.parent = this_1.editBoxNode;
            editbox.getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
            editbox.on('editing-did-ended', function (sender) {
                if (parseInt(editbox.getComponent(cc.EditBox).string) > 200 || parseInt(editbox.getComponent(cc.EditBox).string) <= 1) {
                    editbox.getComponent(cc.EditBox).string = '';
                    this.ShowTips('请输入正确的数字喔！');
                    editbox.getChildByName('PLACEHOLDER_LABEL').active = true;
                    cc.log(editbox.getChildByName('PLACEHOLDER_LABEL'));
                }
                else if (editbox.getComponent(cc.EditBox).string == '') {
                    this.ShowTips('还没有输入数字啦～');
                }
                else {
                    DaAnData_1.DaAnData.getInstance().numberArr[i] = parseInt(editbox.getComponent(cc.EditBox).string);
                    cc.log(DaAnData_1.DaAnData.getInstance().numberArr);
                }
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
        var repeatNum = 0;
        for (var i = 0; i < parseInt(this.checkpointsEditBox.string); i++) {
            if (this.editboxArr[i].getComponent(cc.EditBox).string == '') {
                cc.log('edit box is null');
                repeatNum++;
            }
        }
        if (repeatNum > 0) {
            this.ShowTips('还没有输入数字啦～');
            return false;
        }
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
                var response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                cc.log('response_data is ', response_data);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var content = JSON.parse(response_data.data.courseware_content);
                    NetWork_1.NetWork.courseware_id = response_data.data.courseware_id;
                    if (NetWork_1.NetWork.empty) { //如果URL里面带了empty参数 并且为true  就立刻清除数据
                        this.ClearNet();
                    }
                    else {
                        if (content != null) {
                            if (content.numberArr) {
                                DaAnData_1.DaAnData.getInstance().numberArr = content.numberArr;
                            }
                            if (content.checkpointsNum) {
                                DaAnData_1.DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                            }
                            this.initData();
                        }
                        else {
                        }
                    }
                }
            }
        }.bind(this), null);
    };
    //删除课件数据  一般为脏数据清理
    TeacherPanel.prototype.ClearNet = function () {
        var jsonData = { courseware_id: NetWork_1.NetWork.courseware_id };
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp_1.UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
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