(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/TeacherPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel', __filename);
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
var UIHelp_1 = require("../../Utils/UIHelp");
var DaAnData_1 = require("../../Data/DaAnData");
var Set_1 = require("../../collections/Set");
var GamePanel_1 = require("./GamePanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoOptionNode = null;
        _this.manualOptionNode = null;
        _this.cookieNode = null;
        _this.figureNode = null;
        _this.content = null;
        _this.buttonNode = null;
        _this.pullNode = null;
        _this.checkpointButton = null;
        _this.toggleContainer = [];
        _this.tipLabel = null;
        _this.tipNode = null;
        _this.typeArr = [];
        _this.typeDataArr = [];
        _this.typetype = [];
        _this.toggleArr = [];
        _this.imageArr = [];
        return _this;
    }
    // onLoad () {}
    TeacherPanel.prototype.start = function () {
        this.getNet();
    };
    TeacherPanel.prototype.onToggleContainer = function (toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                DaAnData_1.DaAnData.getInstance().types = 1;
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 0;
                this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '选择关卡数';
                this.content.getChildByName('label1').active = true;
                this.checkpointButton.node.active = true;
                this.updateTypes();
                break;
            case 1:
                this.typetype = [1];
                DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
                DaAnData_1.DaAnData.getInstance().types = 2;
                DaAnData_1.DaAnData.getInstance().checkpointsNum = 1;
                this.content.getChildByName('label1').active = false;
                this.checkpointButton.node.active = false;
                this.updateTypes();
                break;
            default:
                break;
        }
    };
    TeacherPanel.prototype.onToggleCallBack = function (e) {
        var toggle = e;
        var index = this.typeArr.indexOf(toggle.node.parent.parent);
        var typeNum = DaAnData_1.DaAnData.getInstance().checkpointsNum;
        if (toggle.node.parent.children[0].getComponent(cc.Toggle).isChecked) {
            if (this.typetype[index] == 2) {
                this.typetype[index] = 1;
                this.typeArr[index].getChildByName('imageNode').getChildByName('Node').destroy();
                this.typeArr[index].getChildByName('imageNode').removeAllChildren();
                var optionNode = cc.instantiate(this.cookieNode);
                this.typeArr[index].getChildByName('imageNode').addChild(optionNode);
            }
        }
        else if (toggle.node.parent.children[1].getComponent(cc.Toggle).isChecked) {
            if (this.typetype[index] == 1) {
                this.typetype[index] = 2;
                this.typeArr[index].getChildByName('imageNode').getChildByName('Node').destroy();
                this.typeArr[index].getChildByName('imageNode').removeAllChildren();
                var optionNode = cc.instantiate(this.figureNode);
                this.typeArr[index].getChildByName('imageNode').addChild(optionNode);
            }
        }
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.toggleArr = [];
        this.imageArr = [];
        for (var i = 0; i < typeNum; i++) {
            for (var j = 0; j < 27; j++) {
                this.toggleArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle);
            }
        }
        this.addToggleCallBack();
    };
    TeacherPanel.prototype.one = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 1;
        this.typetype = [1];
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '1   关';
        this.pullUp();
        this.updateTypes();
    };
    TeacherPanel.prototype.two = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 2;
        this.typetype = [1, 1];
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '2   关';
        this.pullUp();
        this.updateTypes();
    };
    TeacherPanel.prototype.three = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 3;
        this.typetype = [1, 1, 1];
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '3   关';
        this.pullUp();
        this.updateTypes();
    };
    TeacherPanel.prototype.four = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 4;
        this.typetype = [1, 1, 1, 1];
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '4   关';
        this.pullUp();
        this.updateTypes();
    };
    TeacherPanel.prototype.five = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 5;
        this.typetype = [1, 1, 1, 1, 1];
        DaAnData_1.DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '5   关';
        this.pullUp();
        this.updateTypes();
    };
    TeacherPanel.prototype.pullUp = function () {
        this.pullNode.runAction(cc.moveTo(0.1, cc.v2(0, 150)));
        this.checkpointButton.interactable = true;
        this.checkpointButton.node.getChildByName('layout').off(cc.Node.EventType.TOUCH_START);
    };
    TeacherPanel.prototype.pullDown = function () {
        var _this = this;
        this.pullNode.runAction(cc.moveBy(0.1, cc.v2(0, -150)));
        this.checkpointButton.interactable = false;
        this.checkpointButton.node.getChildByName('layout').on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
            if (_this.pullNode.getPosition() != cc.v2(0, 150)) {
                _this.pullNode.runAction(cc.moveTo(0.1, cc.v2(0, 150)));
                _this.checkpointButton.interactable = true;
                _this.checkpointButton.node.getChildByName('layout').off(cc.Node.EventType.TOUCH_START);
            }
        });
    };
    TeacherPanel.prototype.updateTypes = function () {
        for (var i = 0; i < this.typeArr.length; i++) {
            this.typeArr[i].destroy();
        }
        this.typeArr = [];
        var typeNum = DaAnData_1.DaAnData.getInstance().checkpointsNum;
        if (DaAnData_1.DaAnData.getInstance().types == 1) {
            for (var i = 0; i < typeNum; i++) {
                var optionNode = cc.instantiate(this.autoOptionNode);
                optionNode.getChildByName('title').getComponent(cc.Label).string = this.titleChange(i + 1);
                this.content.addChild(optionNode);
                this.typeArr.push(optionNode);
            }
            //获取所有toggle
            this.toggleArr = [];
            for (var i = 0; i < typeNum; i++) {
                for (var j = 0; j < 5; j++) {
                    this.toggleArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.imageArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getComponent(cc.Sprite);
                }
            }
            this.addToggleCallBack();
        }
        else if (DaAnData_1.DaAnData.getInstance().types == 2) {
            for (var i = 0; i < typeNum; i++) {
                var optionNode = cc.instantiate(this.manualOptionNode);
                var cookieNode = cc.instantiate(this.cookieNode);
                optionNode.getChildByName('imageNode').addChild(cookieNode);
                optionNode.getChildByName('Types').getChildByName('toggle1').on('toggle', this.onToggleCallBack, this);
                optionNode.getChildByName('Types').getChildByName('toggle2').on('toggle', this.onToggleCallBack, this);
                //optionNode.getChildByName('title').getComponent(cc.Label).string = this.titleChange(i + 1);
                this.content.addChild(optionNode);
                this.typeArr.push(optionNode);
            }
            //获取所有的sprite
            this.toggleArr = [];
            for (var i = 0; i < typeNum; i++) {
                for (var j = 0; j < 27; j++) {
                    this.toggleArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle);
                    this.imageArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getComponent(cc.Sprite);
                }
            }
            this.addToggleCallBack();
        }
        this.buttonNode.zIndex = 100;
    };
    TeacherPanel.prototype.addToggleCallBack = function () {
        var _this = this;
        for (var i = 0; i < this.toggleArr.length; i++) {
            this.toggleArr[i].node.off('toggle');
        }
        var _loop_1 = function (i) {
            this_1.toggleArr[i].node.on('toggle', function (e) {
                var checkPointNum = 0;
                if (DaAnData_1.DaAnData.getInstance().types == 1) {
                    checkPointNum = Math.floor(i / 20);
                }
                else if (DaAnData_1.DaAnData.getInstance().types == 2) {
                    checkPointNum = Math.floor(i / 27);
                }
                var alreadyCheck = 0;
                var typeNum = 0;
                if (DaAnData_1.DaAnData.getInstance().types == 1) {
                    for (var j = 20 * checkPointNum; j < 20 * (checkPointNum + 1); j++) {
                        if (_this.toggleArr[j].isChecked) {
                            alreadyCheck++;
                        }
                    }
                    typeNum = 20;
                }
                else if (DaAnData_1.DaAnData.getInstance().types == 2) {
                    for (var j = 27 * checkPointNum; j < 27 * (checkPointNum + 1); j++) {
                        if (_this.toggleArr[j].isChecked) {
                            alreadyCheck++;
                        }
                    }
                    typeNum = 27;
                }
                if (alreadyCheck > 10) {
                    _this.toggleArr[i].isChecked = false;
                }
                if (alreadyCheck >= 10) {
                    for (var i_1 = typeNum * checkPointNum; i_1 < typeNum * (checkPointNum + 1); i_1++) {
                        if (_this.toggleArr[i_1].isChecked == false) {
                            _this.imageArr[i_1].setState(1);
                        }
                    }
                }
                else {
                    for (var i_2 = typeNum * checkPointNum; i_2 < typeNum * (checkPointNum + 1); i_2++) {
                        _this.imageArr[i_2].setState(0);
                    }
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.toggleArr.length; i++) {
            _loop_1(i);
        }
    };
    TeacherPanel.prototype.updateTypesData = function () {
        this.typeDataArr = [];
        if (DaAnData_1.DaAnData.getInstance().types == 1) {
            for (var i = 0; i < this.typeArr.length; i++) {
                for (var j = 0; j < 5; j++) {
                    this.typeDataArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                }
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().types == 2) {
            for (var i = 0; i < this.typeArr.length; i++) {
                for (var j = 0; j < 27; j++) {
                    this.typeDataArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle).isChecked;
                }
            }
        }
        DaAnData_1.DaAnData.getInstance().typeDataArr = this.typeDataArr.slice();
    };
    TeacherPanel.prototype.titleChange = function (index) {
        var str;
        if (index == 1) {
            str = '第一关：';
        }
        else if (index == 2) {
            str = '第二关：';
        }
        else if (index == 3) {
            str = '第三关：';
        }
        else if (index == 4) {
            str = '第四关：';
        }
        else if (index == 5) {
            str = '第五关：';
        }
        return str;
    };
    TeacherPanel.prototype.setPanel = function () {
        this.updateTypes();
        if (DaAnData_1.DaAnData.getInstance().types == 1) {
            this.toggleContainer[0].isChecked = true;
            this.typeDataArr = DaAnData_1.DaAnData.getInstance().typeDataArr.slice();
            for (var i = 0; i < this.typeArr.length; i++) {
                for (var j = 0; j < 5; j++) {
                    for (var j_1 = 0; j_1 < 5; j_1++) {
                        this.typeArr[i].getChildByName('label1').children[j_1].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + j_1];
                        this.typeArr[i].getChildByName('label2').children[j_1].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 5 + j_1];
                        this.typeArr[i].getChildByName('label3').children[j_1].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 10 + j_1];
                        this.typeArr[i].getChildByName('label4').children[j_1].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 15 + j_1];
                    }
                }
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().types == 2) {
            this.toggleContainer[1].isChecked = true;
            this.typetype = DaAnData_1.DaAnData.getInstance().typetype;
            for (var i = 0; i < this.typeArr.length; i++) {
                if (this.typetype[i] == 1) {
                    this.typeArr[i].getChildByName('Types').getChildByName('toggle1').getComponent(cc.Toggle).isChecked = true;
                }
                else if (this.typetype[i] == 2) {
                    this.typeArr[i].getChildByName('Types').getChildByName('toggle2').getComponent(cc.Toggle).isChecked = true;
                }
            }
            this.typeDataArr = DaAnData_1.DaAnData.getInstance().typeDataArr.slice();
            for (var i = 0; i < this.typeArr.length; i++) {
                for (var j = 0; j < 27; j++) {
                    this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 27 + j];
                }
            }
        }
        this.addToggleCallBack();
        if (DaAnData_1.DaAnData.getInstance().checkpointsNum != 0) {
            this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = DaAnData_1.DaAnData.getInstance().checkpointsNum.toString() + '   关';
        }
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        this.updateTypesData();
        if (this.errorChecking()) {
            UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, function () {
                ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
            });
        }
    };
    TeacherPanel.prototype.tipButtonCallBack = function () {
        this.tipNode.active = false;
    };
    TeacherPanel.prototype.tip = function () {
        this.tipNode.active = true;
        this.tipNode.getChildByName('layout').on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
        });
    };
    TeacherPanel.prototype.errorChecking = function () {
        if (DaAnData_1.DaAnData.getInstance().checkpointsNum == 0) {
            this.tipLabel.string = '请填写关卡数量，不能为空。';
            this.tip();
            return false;
        }
        else if (DaAnData_1.DaAnData.getInstance().typeDataArr.length == 0) {
            this.tipLabel.string = '物品种类不能为空，请选择物品种类。';
            this.tip();
            return false;
        }
        var alreadyCheck = 0;
        if (DaAnData_1.DaAnData.getInstance().types == 1) {
            var typeSet = new Set_1.default();
            for (var i = 0; i < DaAnData_1.DaAnData.getInstance().checkpointsNum; i++) {
                for (var j = 20 * i; j < 20 * (i + 1); j++) {
                    if (this.toggleArr[j].isChecked) {
                        alreadyCheck++;
                        typeSet.add(Math.floor(j / 5));
                    }
                }
                if (alreadyCheck < 4) {
                    this.tipLabel.string = this.titleChange(i + 1) + '选择物品不足四个，每关选择物品数至少四个，请继续选择物品。';
                    this.tip();
                    return false;
                }
                if (typeSet.size() < 2) {
                    this.tipLabel.string = this.titleChange(i + 1) + '选择物品种类不足两个，每关选择物品种类至少两个，请继续选择物品。';
                    this.tip();
                    return false;
                }
                alreadyCheck = 0;
                typeSet.clear();
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().types == 2) {
            for (var i = 0; i < DaAnData_1.DaAnData.getInstance().checkpointsNum; i++) {
                for (var j = 27 * i; j < 27 * (i + 1); j++) {
                    if (this.toggleArr[j].isChecked) {
                        alreadyCheck++;
                    }
                }
                if (alreadyCheck < 4) {
                    this.tipLabel.string = this.titleChange(i + 1) + '选择物品不足四个，每关选择物品数至少四个，请继续选择物品。';
                    this.tip();
                    return false;
                }
                if (alreadyCheck > 10) {
                    var num = alreadyCheck - 10;
                    this.tipLabel.string = this.titleChange(i + 1) + ("\u9009\u62E9" + alreadyCheck + "\u4E2A\u7269\u54C1\u8D85\u8FC7\u5341\u4E2A\uFF0C\u6BCF\u5173\u9009\u62E9\u7269\u54C1\u6570\u6700\u591A\u5341\u4E2A\uFF0C\u8BF7\u5220\u9664" + num + "\u4E2A\u7269\u54C1\u3002");
                    this.tip();
                    return false;
                }
                alreadyCheck = 0;
            }
        }
        return true;
    };
    TeacherPanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                var res = response;
                if (Array.isArray(res.data)) {
                    this.setPanel();
                    return;
                }
                var content = JSON.parse(res.data.courseware_content);
                NetWork_1.NetWork.courseware_id = res.data.courseware_id;
                if (NetWork_1.NetWork.empty) { //如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                }
                else {
                    if (content != null) {
                        if (content.types) {
                            DaAnData_1.DaAnData.getInstance().types = content.types;
                        }
                        else {
                            console.log('getNet中返回的types的值为空');
                        }
                        if (content.typetype) {
                            DaAnData_1.DaAnData.getInstance().typetype = content.typetype;
                            cc.log(DaAnData_1.DaAnData.getInstance().typetype);
                        }
                        else {
                            console.log('getNet中返回的typetype的值为空');
                        }
                        if (content.checkpointsNum) {
                            DaAnData_1.DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                            cc.log(content.checkpointsNum);
                        }
                        else {
                            console.log('getNet中返回的checkpointsNum的值为空');
                        }
                        if (content.typeDataArr) {
                            DaAnData_1.DaAnData.getInstance().typeDataArr = content.typeDataArr;
                        }
                        else {
                            console.log('getNet中返回的typeDataArr的值为空');
                        }
                        this.setPanel();
                    }
                    else {
                        console.log('getNet中返回的content是null');
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
        property(cc.Prefab)
    ], TeacherPanel.prototype, "autoOptionNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "manualOptionNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "cookieNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "figureNode", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "content", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "buttonNode", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "pullNode", void 0);
    __decorate([
        property(cc.Button)
    ], TeacherPanel.prototype, "checkpointButton", void 0);
    __decorate([
        property([cc.Toggle])
    ], TeacherPanel.prototype, "toggleContainer", void 0);
    __decorate([
        property(cc.Label)
    ], TeacherPanel.prototype, "tipLabel", void 0);
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
        