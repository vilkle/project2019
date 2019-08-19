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
var ItemType_1 = require("../../Data/ItemType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeToggleContainer = [];
        _this.figureToggleContainer = [];
        _this.ruleNode = null;
        _this.subjectNode = null;
        _this.singlePrefab = null;
        _this.treePrefab = null;
        _this.triangleBlack = null;
        _this.triangleYellow = null;
        _this.triangleGreen = null;
        _this.sexangleBlack = null;
        _this.sexangleOrange = null;
        _this.sexanglePurple = null;
        _this.octagonBlack = null;
        _this.octagonGreen = null;
        _this.octagonYellow = null;
        _this.arrowBlack = null;
        _this.arrowBlue = null;
        _this.arrowOrange = null;
        _this.ruleItemArr = [];
        _this.subjectItemArr = [];
        _this.ruleDataArr = [];
        _this.subjectDataArr = [];
        _this.currentType = 1;
        _this.currentFigure = 2;
        return _this;
    }
    // onLoad () {}
    TeacherPanel.prototype.start = function () {
        DaAnData_1.DaAnData.getInstance().type = 1;
        DaAnData_1.DaAnData.getInstance().figure = 2;
        this.getNet();
    };
    TeacherPanel.prototype.setPanel = function () {
        this.typeToggleContainer[DaAnData_1.DaAnData.getInstance().type - 1].isChecked = true;
        this.figureToggleContainer[DaAnData_1.DaAnData.getInstance().figure - 1].isChecked = true;
        this.initType();
        this.initFigure();
        this.getItem();
        this.defaultRule();
        this.defaultSubject(DaAnData_1.DaAnData.getInstance().type == 1);
    };
    TeacherPanel.prototype.defaultRule = function () {
        var type1 = null;
        var type2 = null;
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            type1 = ItemType_1.ItemType.triangle_green;
            type2 = ItemType_1.ItemType.triangle_yellow;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            type1 = ItemType_1.ItemType.sexangle_orange;
            type2 = ItemType_1.ItemType.sexangle_purple;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            type1 = ItemType_1.ItemType.octagon_green;
            type2 = ItemType_1.ItemType.octagon_yellow;
        }
        this.setRuleDefault(0, 0, type1);
        this.setRuleDefault(1, 2, type1);
        this.setRuleDefault(2, 0, type1);
        this.setRuleDefault(2, 2, type1);
        this.setRuleDefault(0, 2, type2);
        this.setRuleDefault(1, 0, type2);
        this.setRuleDefault(3, 0, type2);
        this.setRuleDefault(3, 2, type2);
        this.setRuleDefault(0, 1, ItemType_1.ItemType.arrow_blue);
        this.setRuleDefault(1, 1, ItemType_1.ItemType.arrow_blue);
        this.setRuleDefault(2, 1, ItemType_1.ItemType.arrow_orange);
        this.setRuleDefault(3, 1, ItemType_1.ItemType.arrow_orange);
    };
    TeacherPanel.prototype.defaultSubject = function (isTree) {
        var type1 = null;
        var type2 = null;
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            type1 = ItemType_1.ItemType.triangle_green;
            type2 = ItemType_1.ItemType.triangle_yellow;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            type1 = ItemType_1.ItemType.sexangle_orange;
            type2 = ItemType_1.ItemType.sexangle_purple;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            type1 = ItemType_1.ItemType.octagon_green;
            type2 = ItemType_1.ItemType.octagon_yellow;
        }
        if (isTree) {
            this.setState(this.subjectItemArr[0][0], type2);
            for (var i = 0; i < this.subjectItemArr.length; i++) {
                for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                    if (i % 2 == 1) {
                        if (j % 2 == 1) {
                            this.setState(this.subjectItemArr[i][j], ItemType_1.ItemType.arrow_blue);
                            this.subjectDataArr[i][j] = ItemType_1.ItemType.arrow_blue;
                        }
                        else {
                            this.setState(this.subjectItemArr[i][j], ItemType_1.ItemType.arrow_orange);
                            this.subjectDataArr[i][j] = ItemType_1.ItemType.arrow_orange;
                        }
                    }
                }
            }
        }
        else {
            this.setSubjectDefault(0, 0, type1);
            this.setSubjectDefault(0, 2, type1);
            this.setSubjectDefault(1, 2, type1);
            this.setSubjectDefault(3, 0, type1);
            this.setSubjectDefault(3, 8, type1);
            this.setSubjectDefault(0, 8, type2);
            this.setSubjectDefault(1, 0, type2);
            this.setSubjectDefault(1, 6, type2);
            this.setSubjectDefault(2, 2, type2);
            this.setSubjectDefault(2, 4, type2);
            this.setSubjectDefault(0, 1, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(0, 3, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(2, 5, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(2, 7, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(3, 1, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(3, 5, ItemType_1.ItemType.arrow_blue);
            this.setSubjectDefault(0, 5, ItemType_1.ItemType.arrow_orange);
            this.setSubjectDefault(1, 3, ItemType_1.ItemType.arrow_orange);
            this.setSubjectDefault(1, 7, ItemType_1.ItemType.arrow_orange);
            this.setSubjectDefault(2, 1, ItemType_1.ItemType.arrow_orange);
            this.setSubjectDefault(3, 7, ItemType_1.ItemType.arrow_orange);
        }
    };
    TeacherPanel.prototype.setRuleDefault = function (i, j, type) {
        this.setState(this.ruleItemArr[i][j], type);
        this.ruleDataArr[i][j] = type;
    };
    TeacherPanel.prototype.setSubjectDefault = function (i, j, type) {
        this.setState(this.subjectItemArr[i][j], type);
        this.subjectDataArr[i][j] = type;
    };
    /**
    * 获取itemtype值
    * @param i
    * @param j
    * @param type 1、rule下节点 2、subject下节点
    * @param typetype 1、tree 2、single
    */
    TeacherPanel.prototype.getItemData = function (i, j, type, typetype) {
        var state = 1;
        if (type == 1) {
            state = j;
        }
        else if (type == 2) {
            if (typetype == 1) {
                state = i;
            }
            else if (typetype == 2) {
                state = j;
            }
        }
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            if (state % 2 == 0) {
                return ItemType_1.ItemType.triangle_black;
            }
            else {
                return ItemType_1.ItemType.arrow_black;
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            if (state % 2 == 0) {
                return ItemType_1.ItemType.sexangle_black;
            }
            else {
                return ItemType_1.ItemType.arrow_black;
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            if (state % 2 == 0) {
                return ItemType_1.ItemType.octagon_black;
            }
            else {
                return ItemType_1.ItemType.arrow_black;
            }
        }
    };
    TeacherPanel.prototype.nextType = function (type) {
        var highNum = Math.floor(type / 3) * 3 + 3;
        if (type % 3 == 0) {
            highNum -= 3;
        }
        var lowNum = highNum - 2;
        var next = type + 1;
        if (next > highNum) {
            next = lowNum;
        }
        console.log('hight', highNum);
        console.log('low', lowNum);
        console.log('next', next);
        return next;
    };
    TeacherPanel.prototype.getItem = function () {
        this.ruleItemArr = [];
        this.subjectItemArr = [];
        this.ruleDataArr = [];
        this.subjectDataArr = [];
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.ruleItemArr[i] = [];
                this.ruleDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.ruleItemArr[i][j] = nodeArr[i].children[j];
                    this.ruleItemArr[i][j].getChildByName('sprite').active = false;
                    this.ruleDataArr[i][j] = this.getItemData(i, j, 1);
                }
            }
        }
        if (this.subjectNode.children[0]) {
            var nodeArr = this.subjectNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.subjectItemArr[i] = [];
                this.subjectDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.subjectItemArr[i][j] = nodeArr[i].children[j];
                    this.subjectItemArr[i][j].getChildByName('sprite').active = false;
                    this.subjectDataArr[i][j] = this.getItemData(i, j, 2, DaAnData_1.DaAnData.getInstance().type);
                }
            }
        }
        this.addListenerOnItem();
        console.log(this.ruleItemArr);
        console.log(this.subjectItemArr);
        console.log(this.ruleDataArr);
        console.log(this.subjectDataArr);
    };
    TeacherPanel.prototype.setState = function (node, state) {
        if (state == 1 || state == 4 || state == 7 || state == 10) {
            node.getChildByName('sprite').active = false;
            node.getChildByName('blank').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(state);
        }
        else {
            node.getChildByName('sprite').active = true;
            node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(state);
        }
    };
    TeacherPanel.prototype.getSpriteframe = function (state) {
        switch (state) {
            case 1:
                return this.arrowBlack;
                break;
            case 2:
                return this.arrowBlue;
                break;
            case 3:
                return this.arrowOrange;
                break;
            case 4:
                return this.triangleBlack;
                break;
            case 5:
                return this.triangleGreen;
                break;
            case 6:
                return this.triangleYellow;
                break;
            case 7:
                return this.sexangleBlack;
                break;
            case 8:
                return this.sexangleOrange;
                break;
            case 9:
                return this.sexanglePurple;
                break;
            case 10:
                return this.octagonBlack;
                break;
            case 11:
                return this.octagonGreen;
                break;
            case 12:
                return this.octagonYellow;
                break;
            default:
                console.error('get wrong spriteframe');
                break;
        }
    };
    TeacherPanel.prototype.addListenerOnItem = function () {
        var _this = this;
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            for (var j = 0; j < this.ruleItemArr[i].length; j++) {
                if (j == 1) {
                    this.ruleItemArr[i][j].getChildByName('blank').off(cc.Node.EventType.TOUCH_START);
                }
            }
        }
        for (var i = 0; i < this.subjectItemArr.length; i++) {
            for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').off(cc.Node.EventType.TOUCH_START);
            }
        }
        var _loop_1 = function (i) {
            var _loop_3 = function (j) {
                if (j == 1) {
                    this_1.ruleItemArr[i][j].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, function () {
                        _this.ruleDataArr[i][j] = _this.nextType(_this.ruleDataArr[i][j]);
                        _this.setState(_this.ruleItemArr[i][j], _this.ruleDataArr[i][j]);
                    });
                }
            };
            for (var j = 0; j < this_1.ruleItemArr[i].length; j++) {
                _loop_3(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            _loop_1(i);
        }
        var _loop_2 = function (i) {
            var _loop_4 = function (j) {
                this_2.subjectItemArr[i][j].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, function () {
                    _this.subjectDataArr[i][j] = _this.nextType(_this.subjectDataArr[i][j]);
                    _this.setState(_this.subjectItemArr[i][j], _this.subjectDataArr[i][j]);
                });
            };
            for (var j = 0; j < this_2.subjectItemArr[i].length; j++) {
                _loop_4(j);
            }
        };
        var this_2 = this;
        for (var i = 0; i < this.subjectItemArr.length; i++) {
            _loop_2(i);
        }
    };
    TeacherPanel.prototype.initType = function () {
        if (DaAnData_1.DaAnData.getInstance().type != this.currentType) {
            if (this.subjectNode.children[0]) {
                this.subjectNode.children[0].destroy();
                this.subjectNode.removeAllChildren();
            }
            var node = null;
            if (DaAnData_1.DaAnData.getInstance().type == 1) {
                node = cc.instantiate(this.treePrefab);
                this.currentType = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().type == 2) {
                node = cc.instantiate(this.singlePrefab);
                this.currentType = 2;
            }
            this.subjectNode.addChild(node);
            this.currentFigure = 2;
            this.getItem();
            this.defaultRule();
            this.defaultSubject(DaAnData_1.DaAnData.getInstance().type == 1);
        }
    };
    TeacherPanel.prototype.initFigure = function () {
        if (this.currentFigure != DaAnData_1.DaAnData.getInstance().figure) {
            if (DaAnData_1.DaAnData.getInstance().figure == 1) {
                this.changeFigure(this.triangleBlack);
                this.currentFigure = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
                this.changeFigure(this.sexangleBlack);
                this.currentFigure = 2;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
                this.changeFigure(this.octagonBlack);
                this.currentFigure = 3;
            }
        }
        this.getItem();
        this.defaultRule();
        this.defaultSubject(DaAnData_1.DaAnData.getInstance().type == 1);
    };
    TeacherPanel.prototype.changeFigure = function (frame) {
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; i++) {
                for (var j = 0; j < nodeArr[i].children.length; j++) {
                    if (j % 2 == 0) {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                    }
                }
            }
        }
        if (this.subjectNode.children[0]) {
            var nodeArr = this.subjectNode.children[0].children;
            if (DaAnData_1.DaAnData.getInstance().type == 1) {
                for (var i = 0; i < nodeArr.length; i++) {
                    if (i % 2 == 0) {
                        for (var j = 0; j < nodeArr[i].children.length; j++) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                        }
                    }
                }
            }
            else if (DaAnData_1.DaAnData.getInstance().type == 2) {
                for (var i = 0; i < nodeArr.length; i++) {
                    for (var j = 0; j < nodeArr[i].children.length; j++) {
                        if (j % 2 == 0) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                        }
                    }
                }
            }
        }
    };
    TeacherPanel.prototype.onTypeToggle = function (toggle) {
        var index = this.typeToggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                DaAnData_1.DaAnData.getInstance().type = 1;
                this.initType();
                this.initFigure();
                break;
            case 1:
                DaAnData_1.DaAnData.getInstance().type = 2;
                this.initType();
                this.initFigure();
                break;
            default:
                console.error("the " + index + " type toggle have error.");
                break;
        }
    };
    TeacherPanel.prototype.onFigureToggle = function (toggle) {
        var index = this.figureToggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                DaAnData_1.DaAnData.getInstance().figure = 1;
                this.initFigure();
                break;
            case 1:
                DaAnData_1.DaAnData.getInstance().figure = 2;
                this.initFigure();
                break;
            case 2:
                DaAnData_1.DaAnData.getInstance().figure = 3;
                this.initFigure();
                break;
            default:
                console.error("the " + index + " figure toggle have error.");
                break;
        }
    };
    TeacherPanel.prototype.checking = function () {
        var ruleActiveNum = 0;
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            for (var j = 0; j < this.ruleItemArr.length; j++) {
                if (this.ruleItemArr[i][j].getChildByName('sprite').active) {
                    ruleActiveNum++;
                }
            }
        }
        if (ruleActiveNum < 12) {
            return false;
        }
        else if (ruleActiveNum == 12) {
        }
        return true;
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        DaAnData_1.DaAnData.getInstance().ruleDataArr = this.ruleDataArr;
        DaAnData_1.DaAnData.getInstance().subjectDataArr = this.subjectDataArr;
        UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, function () {
            ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
        });
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
                        if (content.type) {
                            DaAnData_1.DaAnData.getInstance().type = content.type;
                        }
                        else {
                            console.error('网络请求数据content.type为空');
                        }
                        if (content.figure) {
                            DaAnData_1.DaAnData.getInstance().figure = content.figure;
                        }
                        else {
                            console.error('网络请求数据content.figure为空');
                        }
                        this.setPanel();
                    }
                    else {
                        this.setPanel();
                        console.error('网络请求数据为空');
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
    ], TeacherPanel.prototype, "typeToggleContainer", void 0);
    __decorate([
        property([cc.Toggle])
    ], TeacherPanel.prototype, "figureToggleContainer", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "ruleNode", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "subjectNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "singlePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "treePrefab", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleYellow", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexangleBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexangleOrange", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexanglePurple", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonYellow", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "arrowBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "arrowBlue", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "arrowOrange", void 0);
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

cc._RF.pop();