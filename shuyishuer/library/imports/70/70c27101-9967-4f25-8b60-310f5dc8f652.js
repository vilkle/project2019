"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel');
// scripts/UI/panel/TeacherPanel.ts

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
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var UIHelp_1 = require("../../Utils/UIHelp");
var DaAnData_1 = require("../../Data/DaAnData");
var GamePanel_1 = require("./GamePanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggleContainer = [];
        _this.judgeEditBox = null;
        _this.numEditBox = null;
        _this.eiditBoxNode = null;
        _this.editBoxPrefab = null;
        _this.type = 1;
        _this.judgeNum = null;
        _this.num = 8;
        _this.numArr = [];
        _this.editBoxArr = [];
        return _this;
    }
    TeacherPanel.prototype.onLoad = function () {
        this.type = 1;
        DaAnData_1.DaAnData.getInstance().type = 1;
        this.num = 8;
        DaAnData_1.DaAnData.getInstance().num = 8;
        this.initEditBoxArr(8);
    };
    TeacherPanel.prototype.start = function () {
        this.getNet();
    };
    TeacherPanel.prototype.setPanel = function () {
        switch (this.type) {
            case 1:
                this.toggleContainer[0].isChecked = true;
                break;
            case 2:
                this.toggleContainer[1].isChecked = true;
                break;
            case 3:
                this.toggleContainer[2].isChecked = true;
                break;
            case 4:
                this.toggleContainer[3].isChecked = true;
                break;
        }
        this.judgeEditBox.string = this.judgeNum.toString();
        this.numEditBox.string = this.num.toString();
        this.initEditBoxArr(this.num);
    };
    TeacherPanel.prototype.initEditBoxArr = function (num) {
        this.eiditBoxNode.removeAllChildren();
        this.editBoxArr = [];
        for (var i = 0; i < num; ++i) {
            var node = cc.instantiate(this.editBoxPrefab);
            this.eiditBoxNode.addChild(node);
            this.editBoxArr[i] = node.getComponent(cc.EditBox);
            if (this.numArr[i]) {
                this.editBoxArr[i].string = this.numArr[i].toString();
            }
            node.on('editing-did-ended', function (editbox) {
                var str = editbox.string;
                var rex = /^[0-9]{1,2}$/;
                if (!rex.test(str)) {
                    editbox.string = '';
                }
            }.bind(this));
        }
    };
    TeacherPanel.prototype.onToggleContainer = function (toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                this.type = 1;
                DaAnData_1.DaAnData.getInstance().type = 1;
                break;
            case 1:
                this.type = 2;
                DaAnData_1.DaAnData.getInstance().type = 2;
                break;
            case 2:
                this.type = 3;
                DaAnData_1.DaAnData.getInstance().type = 3;
                break;
            case 3:
                this.type = 4;
                DaAnData_1.DaAnData.getInstance().type = 4;
                break;
        }
    };
    TeacherPanel.prototype.judgeEditBoxCallback = function (sender) {
        var str = this.judgeEditBox.string;
        var num = parseInt(str);
        var rex = /^[0-9]{1,2}$/;
        if (!rex.test(str)) {
            if (str = '') {
                num = null;
                this.judgeEditBox.string = '';
                this.judgeEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = true;
            }
            else {
                if (this.judgeNum != null) {
                    num = this.judgeNum;
                    this.judgeEditBox.string = this.judgeNum.toString();
                    this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = false;
                }
            }
        }
        this.judgeNum = num;
        DaAnData_1.DaAnData.getInstance().judgeNum = this.judgeNum;
    };
    TeacherPanel.prototype.numEditBoxCallback = function (sender) {
        var str = this.numEditBox.string;
        var num = parseInt(str);
        var rex = /^[0-9]{1,2}$/;
        if (!rex.test(str)) {
            if (str == '') {
                num = null;
                this.numEditBox.string = '';
                this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = true;
            }
            else {
                num = this.num;
                this.numEditBox.string = this.num.toString();
                this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = false;
            }
        }
        if (this.num != num) {
            this.initEditBoxArr(num);
        }
        this.num = num;
        DaAnData_1.DaAnData.getInstance().num = this.num;
    };
    TeacherPanel.prototype.check = function () {
        if (this.judgeNum == null) {
            UIHelp_1.UIHelp.showTip('题干标准为空，请输入题干标准。');
            return false;
        }
        if (this.num == null) {
            UIHelp_1.UIHelp.showTip('选数区域的数量为空，请输入选数区域数量。');
            return false;
        }
        if (this.judgeNum > 30 || this.judgeNum < 0) {
            UIHelp_1.UIHelp.showTip('题干标准不是不大于30的整数，请重新输入题干标准');
            return false;
        }
        if (this.num < 8 || this.num > 15) {
            UIHelp_1.UIHelp.showTip('选数区域数量不是8～15的整数，请重新输入选数区域数量');
            return false;
        }
        this.numArr = [];
        for (var i = 0; i < this.editBoxArr.length; ++i) {
            if (this.editBoxArr[i].string == '') {
                this.numArr[i] = null;
            }
            else {
                this.numArr[i] = parseInt(this.editBoxArr[i].string);
            }
        }
        for (var i = 0; i < this.editBoxArr.length; ++i) {
            if (this.numArr[i] == null) {
                UIHelp_1.UIHelp.showTip("\u8BF7\u8F93\u5165\u7B2C\u4E00\u9898\u7B2C" + (i + 1) + "\u4E2A\u53EF\u9009\u6570\u3002");
                return false;
            }
            if (this.numArr[i] < 0 || this.numArr[i] > 50) {
                UIHelp_1.UIHelp.showTip("\u7B2C\u4E00\u9898\u7B2C" + (i + 1) + "\u4E2A\u53EF\u9009\u6570\u4E0D\u7B26\u54080\uFF5E50\u7684\u89C4\u5219\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u3002");
                return false;
            }
        }
        DaAnData_1.DaAnData.getInstance().numArr = this.numArr.slice();
        console.log(this.type);
        console.log(this.judgeNum);
        console.log(this.num);
        console.log(this.numArr);
        return true;
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        if (this.check()) {
            UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, null, function () {
                ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
            });
        }
    };
    TeacherPanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                var res = response;
                if (Array.isArray(res.data)) {
                    return;
                }
                var content = JSON.parse(res.data.courseware_content);
                NetWork_1.NetWork.courseware_id = res.data.courseware_id;
                if (NetWork_1.NetWork.empty) { //如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                }
                else {
                    if (content != null) {
                        if (content.type) {
                            this.type = content.type;
                            DaAnData_1.DaAnData.getInstance().type = content.type;
                        }
                        else {
                            console.error('content.type is null');
                            return;
                        }
                        if (content.judgeNum) {
                            this.judgeNum = content.judgeNum;
                            DaAnData_1.DaAnData.getInstance().judgeNum = content.judgeNum;
                        }
                        else {
                            console.error('content.judgeNum is null');
                            return;
                        }
                        if (content.num) {
                            this.num = content.num;
                            DaAnData_1.DaAnData.getInstance().num = content.num;
                        }
                        else {
                            console.error('content.num is null');
                            return;
                        }
                        if (content.numArr) {
                            this.numArr = content.numArr;
                            DaAnData_1.DaAnData.getInstance().numArr = content.numArr;
                        }
                        else {
                            console.error('content.numArr is null');
                            return;
                        }
                        this.setPanel();
                    }
                    else {
                        return;
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
        property([cc.Toggle])
    ], TeacherPanel.prototype, "toggleContainer", void 0);
    __decorate([
        property(cc.EditBox)
    ], TeacherPanel.prototype, "judgeEditBox", void 0);
    __decorate([
        property(cc.EditBox)
    ], TeacherPanel.prototype, "numEditBox", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "eiditBoxNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "editBoxPrefab", void 0);
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

cc._RF.pop();