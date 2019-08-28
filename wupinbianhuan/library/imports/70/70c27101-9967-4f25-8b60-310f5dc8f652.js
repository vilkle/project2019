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
        _this.squareBlack = null;
        _this.circleYellow = null;
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
        _this.handGreen = null;
        _this.lineBlack = null;
        _this.lineCurve = null;
        _this.lineDotted = null;
        _this.tipLabel = null;
        _this.tipNode = null;
        _this.ruleItemArr = [];
        _this.subjectItemArr = [];
        _this.ruleDataArr = [];
        _this.subjectDataArr = [];
        _this.answerDataArr = [];
        _this.currentType = 1; //当前的题目类型
        _this.currentFigure = 2;
        _this.sameType = null; //相同类型之间变换的规则
        _this.diffType = null;
        _this.type1 = null;
        _this.type2 = null;
        _this.arrow1 = null;
        _this.arrow2 = null;
        _this.arrowNull = null;
        return _this;
    }
    // onLoad () {}
    TeacherPanel.prototype.start = function () {
        this.getNet();
    };
    TeacherPanel.prototype.setPanel = function () {
        if (DaAnData_1.DaAnData.getInstance().type == 0) {
            DaAnData_1.DaAnData.getInstance().type = 1;
        }
        if (DaAnData_1.DaAnData.getInstance().figure == 0) {
            DaAnData_1.DaAnData.getInstance().figure = 2;
            this.sameType = ItemType_1.ItemType.arrow_orange;
            this.diffType = ItemType_1.ItemType.arrow_blue;
            this.type1 = ItemType_1.ItemType.sexangle_orange;
            this.type2 = ItemType_1.ItemType.sexangle_purple;
        }
        this.typeToggleContainer[DaAnData_1.DaAnData.getInstance().type - 1].isChecked = true;
        this.figureToggleContainer[DaAnData_1.DaAnData.getInstance().figure - 1].isChecked = true;
        this.initType();
        this.initFigure();
        this.getItem();
        if (DaAnData_1.DaAnData.getInstance().ruleDataArr) {
            this.setRule();
        }
        else {
            this.defaultRule();
        }
        if (DaAnData_1.DaAnData.getInstance().subjectDataArr) {
            this.setSubject();
        }
        else {
            this.defaultSubject(DaAnData_1.DaAnData.getInstance().type == 1);
        }
    };
    TeacherPanel.prototype.setRule = function () {
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            for (var j = 0; j < this.ruleItemArr[i].length; j++) {
                this.setState(this.ruleItemArr[i][j], DaAnData_1.DaAnData.getInstance().ruleDataArr[i][j]);
                this.ruleDataArr[i][j] = DaAnData_1.DaAnData.getInstance().ruleDataArr[i][j];
            }
        }
    };
    TeacherPanel.prototype.setSubject = function () {
        for (var i = 0; i < this.subjectItemArr.length; i++) {
            for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                this.setState(this.subjectItemArr[i][j], DaAnData_1.DaAnData.getInstance().subjectDataArr[i][j]);
                this.subjectDataArr[i][j] = DaAnData_1.DaAnData.getInstance().subjectDataArr[i][j];
            }
        }
    };
    TeacherPanel.prototype.defaultRule = function () {
        var type1 = null;
        var type2 = null;
        var arrow1 = null;
        var arrow2 = null;
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            type1 = ItemType_1.ItemType.triangle_green;
            type2 = ItemType_1.ItemType.circle_yellow;
            arrow1 = ItemType_1.ItemType.line_curve;
            arrow2 = ItemType_1.ItemType.line_dotted;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            type1 = ItemType_1.ItemType.sexangle_orange;
            type2 = ItemType_1.ItemType.sexangle_purple;
            arrow1 = ItemType_1.ItemType.hand_blue;
            arrow2 = ItemType_1.ItemType.hand_green;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            type1 = ItemType_1.ItemType.octagon_green;
            type2 = ItemType_1.ItemType.octagon_yellow;
            arrow1 = ItemType_1.ItemType.arrow_blue;
            arrow2 = ItemType_1.ItemType.arrow_orange;
        }
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            for (var j = 0; j < this.ruleItemArr[i].length; j++) {
                this.ruleItemArr[i][j].getChildByName('blank').opacity = 255;
                this.ruleItemArr[i][j].getChildByName('sprite').active = false;
            }
        }
        this.setRuleDefault(0, 0, type1);
        this.setRuleDefault(1, 2, type1);
        this.setRuleDefault(2, 0, type1);
        this.setRuleDefault(2, 2, type1);
        this.setRuleDefault(0, 2, type2);
        this.setRuleDefault(1, 0, type2);
        this.setRuleDefault(3, 0, type2);
        this.setRuleDefault(3, 2, type2);
        this.setRuleDefault(0, 1, arrow1);
        this.setRuleDefault(1, 1, arrow1);
        this.setRuleDefault(2, 1, arrow2);
        this.setRuleDefault(3, 1, arrow2);
        this.sameType = arrow1;
        this.diffType = arrow2;
    };
    TeacherPanel.prototype.defaultSubject = function (isTree) {
        var type1 = null;
        var type2 = null;
        var arrow1 = null;
        var arrow2 = null;
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            type1 = ItemType_1.ItemType.triangle_green;
            type2 = ItemType_1.ItemType.circle_yellow;
            arrow1 = ItemType_1.ItemType.line_curve;
            arrow2 = ItemType_1.ItemType.line_dotted;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            type1 = ItemType_1.ItemType.sexangle_orange;
            type2 = ItemType_1.ItemType.sexangle_purple;
            arrow1 = ItemType_1.ItemType.hand_blue;
            arrow2 = ItemType_1.ItemType.hand_green;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            type1 = ItemType_1.ItemType.octagon_green;
            type2 = ItemType_1.ItemType.octagon_yellow;
            arrow1 = ItemType_1.ItemType.arrow_blue;
            arrow2 = ItemType_1.ItemType.arrow_orange;
        }
        for (var i = 0; i < this.subjectItemArr.length; i++) {
            for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').opacity = 255;
                this.subjectItemArr[i][j].getChildByName('sprite').active = false;
            }
        }
        if (isTree) {
            this.setState(this.subjectItemArr[0][0], type2);
            this.subjectDataArr[0][0] = type2;
            this.answerDataArr[0][0] = type2;
            for (var i = 0; i < this.subjectItemArr.length; i++) {
                for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                    if (i % 2 == 1) {
                        if (j % 2 == 1) {
                            this.setState(this.subjectItemArr[i][j], arrow1);
                            this.subjectDataArr[i][j] = arrow1;
                            this.answerDataArr[i][j] = arrow1;
                        }
                        else {
                            this.setState(this.subjectItemArr[i][j], arrow2);
                            this.subjectDataArr[i][j] = arrow2;
                            this.answerDataArr[i][j] = arrow2;
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
            this.setSubjectDefault(0, 1, arrow1);
            this.setSubjectDefault(0, 3, arrow1);
            this.setSubjectDefault(2, 5, arrow1);
            this.setSubjectDefault(2, 7, arrow1);
            this.setSubjectDefault(3, 1, arrow1);
            this.setSubjectDefault(3, 5, arrow1);
            this.setSubjectDefault(0, 5, arrow2);
            this.setSubjectDefault(1, 3, arrow2);
            this.setSubjectDefault(1, 7, arrow2);
            this.setSubjectDefault(2, 1, arrow2);
            this.setSubjectDefault(3, 7, arrow2);
        }
    };
    TeacherPanel.prototype.setRuleDefault = function (i, j, type) {
        this.setState(this.ruleItemArr[i][j], type);
        this.ruleDataArr[i][j] = type;
    };
    TeacherPanel.prototype.setSubjectDefault = function (i, j, type) {
        this.setState(this.subjectItemArr[i][j], type);
        this.subjectDataArr[i][j] = type;
        this.answerDataArr[i][j] = type;
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
                return ItemType_1.ItemType.square_black;
            }
            else {
                return ItemType_1.ItemType.line_black;
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            if (state % 2 == 0) {
                return ItemType_1.ItemType.sexangle_black;
            }
            else {
                return ItemType_1.ItemType.hand_black;
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
        return next;
    };
    TeacherPanel.prototype.getItem = function () {
        this.ruleItemArr = [];
        this.subjectItemArr = [];
        this.ruleDataArr = [];
        this.subjectDataArr = [];
        this.answerDataArr = [];
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.ruleItemArr[i] = [];
                this.ruleDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.ruleItemArr[i][j] = nodeArr[i].children[j];
                    this.ruleDataArr[i][j] = this.getItemData(i, j, 1);
                }
            }
        }
        if (this.subjectNode.children[0]) {
            var nodeArr = this.subjectNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.subjectItemArr[i] = [];
                this.subjectDataArr[i] = [];
                this.answerDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.subjectItemArr[i][j] = nodeArr[i].children[j];
                    this.subjectDataArr[i][j] = this.getItemData(i, j, 2, DaAnData_1.DaAnData.getInstance().type);
                }
            }
        }
        this.addListenerOnItem();
    };
    TeacherPanel.prototype.setState = function (node, state) {
        if (state == 1 || state == 4 || state == 7 || state == 10 || state == 13 || state == 16) {
            node.getChildByName('sprite').active = false;
            node.getChildByName('blank').opacity = 255;
            node.getChildByName('blank').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(state);
        }
        else {
            node.getChildByName('sprite').active = true;
            node.getChildByName('blank').opacity = 0;
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
                return this.lineBlack;
                break;
            case 5:
                return this.lineCurve;
                break;
            case 6:
                return this.lineDotted;
                break;
            case 7:
                return this.arrowBlack;
                break;
            case 8:
                return this.arrowBlue;
                break;
            case 9:
                return this.handGreen;
                break;
            case 10:
                return this.squareBlack;
                break;
            case 11:
                return this.triangleGreen;
                break;
            case 12:
                return this.circleYellow;
                break;
            case 13:
                return this.sexangleBlack;
                break;
            case 14:
                return this.sexangleOrange;
                break;
            case 15:
                return this.sexanglePurple;
                break;
            case 16:
                return this.octagonBlack;
                break;
            case 17:
                return this.octagonGreen;
                break;
            case 18:
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
            this.ruleItemArr[i][1].getChildByName('blank').off(cc.Node.EventType.TOUCH_START);
        }
        for (var i = 0; i < this.subjectItemArr.length; i++) {
            for (var j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').off(cc.Node.EventType.TOUCH_START);
            }
        }
        var _loop_1 = function (i) {
            this_1.ruleItemArr[i][1].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, function () {
                _this.ruleDataArr[i][1] = _this.nextType(_this.ruleDataArr[i][1]);
                _this.setState(_this.ruleItemArr[i][1], _this.ruleDataArr[i][1]);
                //相同排的同步变化
                if (i == 0) {
                    _this.diffType = _this.ruleDataArr[0][1];
                    _this.ruleDataArr[1][1] = _this.ruleDataArr[0][1];
                    _this.setState(_this.ruleItemArr[1][1], _this.ruleDataArr[1][1]);
                }
                else if (i == 1) {
                    _this.diffType = _this.ruleDataArr[1][1];
                    _this.ruleDataArr[0][1] = _this.ruleDataArr[1][1];
                    _this.setState(_this.ruleItemArr[0][1], _this.ruleDataArr[0][1]);
                }
                else if (i == 2) {
                    _this.sameType = _this.ruleDataArr[2][1];
                    _this.ruleDataArr[3][1] = _this.ruleDataArr[2][1];
                    _this.setState(_this.ruleItemArr[3][1], _this.ruleDataArr[3][1]);
                }
                else if (i == 3) {
                    _this.sameType = _this.ruleDataArr[3][1];
                    _this.ruleDataArr[2][1] = _this.ruleDataArr[3][1];
                    _this.setState(_this.ruleItemArr[2][1], _this.ruleDataArr[2][1]);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            _loop_1(i);
        }
        var _loop_2 = function (i) {
            var _loop_3 = function (j) {
                this_2.subjectItemArr[i][j].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, function () {
                    _this.subjectDataArr[i][j] = _this.nextType(_this.subjectDataArr[i][j]);
                    _this.setState(_this.subjectItemArr[i][j], _this.subjectDataArr[i][j]);
                });
            };
            for (var j = 0; j < this_2.subjectItemArr[i].length; j++) {
                _loop_3(j);
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
                node.setPosition(cc.v2(-513, 0));
                this.currentType = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().type == 2) {
                node = cc.instantiate(this.singlePrefab);
                node.setPosition(cc.v2(-545, 0));
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
                this.changeFigure(this.squareBlack, this.arrowBlack);
                this.currentFigure = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
                this.changeFigure(this.sexangleBlack, this.arrowBlack);
                this.currentFigure = 2;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
                this.changeFigure(this.octagonBlack, this.lineBlack);
                this.currentFigure = 3;
            }
        }
        this.getItem();
        this.defaultRule();
        this.defaultSubject(DaAnData_1.DaAnData.getInstance().type == 1);
    };
    TeacherPanel.prototype.changeFigure = function (frame, signFrame) {
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; i++) {
                for (var j = 0; j < nodeArr[i].children.length; j++) {
                    if (j % 2 == 0) {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                    }
                    else {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame;
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
                    else {
                        for (var j = 0; j < nodeArr[i].children.length; j++) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame;
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
                        else {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame;
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
                this.type1 = ItemType_1.ItemType.triangle_green;
                this.type2 = ItemType_1.ItemType.circle_yellow;
                this.arrow1 = ItemType_1.ItemType.line_curve;
                this.arrow2 = ItemType_1.ItemType.line_dotted;
                this.arrowNull = ItemType_1.ItemType.line_black;
                this.initFigure();
                break;
            case 1:
                DaAnData_1.DaAnData.getInstance().figure = 2;
                this.type1 = ItemType_1.ItemType.sexangle_orange;
                this.type2 = ItemType_1.ItemType.sexangle_purple;
                this.arrow1 = ItemType_1.ItemType.hand_blue;
                this.arrow2 = ItemType_1.ItemType.hand_green;
                this.arrowNull = ItemType_1.ItemType.hand_black;
                this.initFigure();
                break;
            case 2:
                DaAnData_1.DaAnData.getInstance().figure = 3;
                this.type1 = ItemType_1.ItemType.octagon_green;
                this.type2 = ItemType_1.ItemType.octagon_yellow;
                this.arrow1 = ItemType_1.ItemType.arrow_blue;
                this.arrow2 = ItemType_1.ItemType.arrow_orange;
                this.arrowNull = ItemType_1.ItemType.arrow_black;
                this.initFigure();
                break;
            default:
                console.error("the " + index + " figure toggle have error.");
                break;
        }
    };
    TeacherPanel.prototype.checking = function () {
        if (this.ruleDataArr[0][1] == this.arrowNull) {
            this.showTip('相同颜色的变换规则不能为空，请重新选择。');
            return false;
        }
        if (this.ruleDataArr[2][1] == this.arrowNull) {
            this.showTip('不同颜色的变换规则不能为空，请重新选择。');
            return false;
        }
        if (this.ruleDataArr[0][1] == this.ruleDataArr[2][1]) {
            this.showTip('相同颜色之间变换与不同颜色相互变换规则一样，相同颜色之间变换和不同颜色相互变换之间规则不能相同。');
            return false;
        }
        if (DaAnData_1.DaAnData.getInstance().type == 1) {
            if (!this.checkTree(this.subjectDataArr)) {
                this.showTip('题目已知条件不能导出所有答案，请重新配题。');
                return false;
            }
        }
        else if (DaAnData_1.DaAnData.getInstance().type == 2) {
            if (!this.checkSingle(this.subjectDataArr)) {
                this.showTip('题目已知条件不能导出所有答案，请重新配题。');
                return false;
            }
        }
        return true;
    };
    TeacherPanel.prototype.checkTree = function (arr) {
        for (var i = 0; i < this.answerDataArr.length; i++) {
            for (var j = 0; j < this.answerDataArr[i].length; j++) {
                if (i % 2 == 1) {
                    if (this.answerDataArr[i][j] == this.sameType) {
                        if (this.answerDataArr[i - 1][Math.floor(j / 2)]) {
                            this.answerDataArr[i + 1][j] = this.answerDataArr[i - 1][Math.floor(j / 2)];
                        }
                        if (this.answerDataArr[i + 1][j]) {
                            this.answerDataArr[i - 1][Math.floor(j / 2)] = this.answerDataArr[i + 1][j];
                        }
                    }
                    else if (this.answerDataArr[i][j] == this.diffType) {
                        if (this.answerDataArr[i - 1][Math.floor(j / 2)] == this.type1) {
                            this.answerDataArr[i + 1][j] = this.type2;
                        }
                        else if (this.answerDataArr[i - 1][Math.floor(j / 2)] == this.type2) {
                            this.answerDataArr[i + 1][j] = this.type1;
                        }
                        if (this.answerDataArr[i + 1][j] == this.type1) {
                            this.answerDataArr[i - 1][Math.floor(j / 2)] = this.type2;
                        }
                        else if (this.answerDataArr[i + 1][j] == this.type2) {
                            this.answerDataArr[i - 1][Math.floor(j / 2)] = this.type1;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.answerDataArr.length; i++) {
            for (var j = 0; j < this.answerDataArr[i].length; j++) {
                if (i % 2 == 0) {
                    if (this.answerDataArr[i + 2]) {
                        if (this.answerDataArr[i][j] && this.answerDataArr[i + 2][j * 2]) {
                            if (this.answerDataArr[i][j] == this.answerDataArr[i + 2][j * 2]) {
                                this.answerDataArr[i + 1][j * 2] = this.sameType;
                            }
                            else if (this.answerDataArr[i][j] != this.answerDataArr[i + 2][j * 2]) {
                                this.answerDataArr[i + 1][j * 2] = this.diffType;
                            }
                        }
                        if (this.answerDataArr[i][j] && this.answerDataArr[i + 2][j * 2 + 1]) {
                            if (this.answerDataArr[i][j] == this.answerDataArr[i + 2][j * 2 + 1]) {
                                this.answerDataArr[i + 1][j * 2 + 1] = this.sameType;
                            }
                            else if (this.answerDataArr[i][j] != this.answerDataArr[i + 2][j * 2 + 1]) {
                                this.answerDataArr[i + 1][j * 2 + 1] = this.diffType;
                            }
                        }
                    }
                }
            }
        }
        var answerNum = 0;
        var totalNum = 0;
        for (var i = 0; i < this.subjectDataArr.length; i++) {
            for (var j = 0; j < this.subjectDataArr[i].length; j++) {
                totalNum++;
                if (this.answerDataArr[i][j]) {
                    answerNum++;
                }
            }
        }
        if (answerNum != totalNum) {
            return false;
        }
        return true;
    };
    TeacherPanel.prototype.checkSingle = function (arr) {
        for (var i = 0; i < this.answerDataArr.length; i++) {
            for (var j = 0; j < this.answerDataArr[i].length; j++) {
                if (j % 2 == 1) {
                    if (this.answerDataArr[i][j] == this.sameType) {
                        if (this.answerDataArr[i][j - 1]) {
                            this.answerDataArr[i][j + 1] = this.answerDataArr[i][j - 1];
                        }
                        if (this.answerDataArr[i][j + 1]) {
                            this.answerDataArr[i][j - 1] = this.answerDataArr[i][j + 1];
                        }
                    }
                    else if (this.answerDataArr[i][j] == this.diffType) {
                        if (this.answerDataArr[i][j - 1] == this.type1) {
                            this.answerDataArr[i][j + 1] = this.type2;
                        }
                        else if (this.answerDataArr[i][j - 1] == this.type2) {
                            this.answerDataArr[i][j + 1] = this.type1;
                        }
                        if (this.answerDataArr[i][j + 1] == this.type1) {
                            this.answerDataArr[i][j - 1] = this.type2;
                        }
                        else if (this.answerDataArr[i][j + 1] == this.type2) {
                            this.answerDataArr[i][j - 1] = this.type1;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.answerDataArr.length; i++) {
            for (var j = 0; j < this.answerDataArr[i].length; j++) {
                if (j % 2 == 0) {
                    if (this.answerDataArr[i][j] && this.answerDataArr[i][j + 2]) {
                        if (this.answerDataArr[i][j] == this.answerDataArr[i][j + 2]) {
                            this.answerDataArr[i][j + 1] = this.sameType;
                        }
                        else {
                            this.answerDataArr[i][j + 1] = this.diffType;
                        }
                    }
                }
            }
        }
        var answerNum = 0;
        var totalNum = 0;
        for (var i = 0; i < this.subjectDataArr.length; i++) {
            for (var j = 0; j < this.subjectDataArr[i].length; j++) {
                totalNum++;
                if (this.answerDataArr[i][j]) {
                    answerNum++;
                }
            }
        }
        if (answerNum != totalNum) {
            return false;
        }
        return true;
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        DaAnData_1.DaAnData.getInstance().ruleDataArr = this.ruleDataArr;
        DaAnData_1.DaAnData.getInstance().subjectDataArr = this.subjectDataArr;
        if (this.checking()) {
            //UIManager.getInstance().showUI(SubmissionPanel)
            UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, function () {
                ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
            });
        }
    };
    TeacherPanel.prototype.showTip = function (str) {
        this.tipLabel.string = str;
        this.tipNode.active = true;
    };
    TeacherPanel.prototype.tipButtonCallback = function () {
        this.tipNode.active = false;
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
                        if (content.ruleDataArr) {
                            DaAnData_1.DaAnData.getInstance().ruleDataArr = content.ruleDataArr;
                            this.ruleDataArr = content.ruleDataArr;
                        }
                        else {
                            console.error('网络请求数据content.ruleDataArr为空');
                            return;
                        }
                        if (content.subjectDataArr) {
                            DaAnData_1.DaAnData.getInstance().subjectDataArr = content.subjectDataArr;
                            this.subjectDataArr = content.subjectDataArr;
                        }
                        else {
                            console.error('网络请求数据content.subjectDataArr为空');
                            return;
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
    ], TeacherPanel.prototype, "squareBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "circleYellow", void 0);
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
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "handGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "lineBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "lineCurve", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "lineDotted", void 0);
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