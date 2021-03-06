"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

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
var NetWork_1 = require("../../Http/NetWork");
var DataReporting_1 = require("../../Data/DataReporting");
var ConstValue_1 = require("../../Data/ConstValue");
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
var UIManager_1 = require("../../Manager/UIManager");
var UploadAndReturnPanel_1 = require("./UploadAndReturnPanel");
var AudioManager_1 = require("../../Manager/AudioManager");
var ItemType_1 = require("../../Data/ItemType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ruleNode = null;
        _this.subjectNode = null;
        _this.answerNode = null;
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
        _this.squareLight = null;
        _this.sexangleLight = null;
        _this.octagonLight = null;
        _this.lineLight = null;
        _this.arrowLight = null;
        _this.touchNode = null;
        _this.bg = null;
        _this.ruleItemArr = [];
        _this.subjectItemArr = [];
        _this.answerItemArr = [];
        _this.type = 0;
        _this.figure = 0;
        _this.sameType = null;
        _this.diffType = null;
        _this.type1 = null;
        _this.type2 = null;
        _this.arrow1 = null;
        _this.arrow2 = null;
        _this.typeNull = null;
        _this.arrowNull = null;
        _this.typeLight = null;
        _this.handLight = null;
        _this.ruleDataArr = [];
        _this.subjectDataArr = [];
        _this.answerDataArr = [];
        _this.intervalArr = [];
        _this.audioId = null;
        _this.touchTarget = null;
        _this.touchEnable = true;
        _this.overNum = 0;
        _this.isOver = 0;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 0,
            levelData: [
                {
                    subject: null,
                    answer: null,
                    result: 4
                }
            ],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.start = function () {
        var _this = this;
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (_this.isOver != 1) {
                _this.isOver = 2;
                _this.eventvalue.result = 2;
                _this.eventvalue.levelData[0].result = 2;
            }
        });
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            this.type = DaAnData_1.DaAnData.getInstance().type;
            this.figure = DaAnData_1.DaAnData.getInstance().figure;
            this.ruleDataArr = DaAnData_1.DaAnData.getInstance().ruleDataArr;
            this.subjectDataArr = DaAnData_1.DaAnData.getInstance().subjectDataArr;
            this.initGame();
            UIManager_1.UIManager.getInstance().openUI(UploadAndReturnPanel_1.default, null, 212);
        }
        else {
            this.getNet();
        }
    };
    GamePanel.prototype.intervalPoint = function () {
        var _this = this;
        for (var i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i]);
        }
        this.intervalArr = [];
        var index = setTimeout(function () {
            _this.point();
            _this.intervalPoint();
        }, 15000);
        this.intervalArr.push(index);
    };
    GamePanel.prototype.stopIntervalPoint = function () {
        for (var i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i]);
        }
        for (var i = 0; i < this.answerDataArr.length; ++i) {
            for (var j = 0; j < this.answerDataArr[i].length; ++j) {
                var node = this.subjectItemArr[i][j].getChildByName('light');
                node.active = false;
                node.opacity = 255;
                node.scale = 1;
                node.stopAllActions();
            }
        }
    };
    GamePanel.prototype.point = function () {
        for (var i = 0; i < this.answerDataArr.length; ++i) {
            var _loop_1 = function (j) {
                if (this_1.answerDataArr[i][j] == null) {
                    var node_1 = this_1.subjectItemArr[i][j].getChildByName('light');
                    node_1.active = true;
                    node_1.opacity = 1;
                    node_1.scale = 0.5;
                    var func = cc.callFunc(function () {
                        node_1.active = false;
                        node_1.opacity = 255;
                        node_1.scale = 1;
                        cc.log('------point');
                    });
                    var func1 = cc.callFunc(function () {
                        node_1.opacity = 1;
                        node_1.scale = 0.5;
                    });
                    var spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1));
                    var spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2));
                    var seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func);
                    node_1.stopAllActions();
                    node_1.runAction(seq);
                }
            };
            var this_1 = this;
            for (var j = 0; j < this.answerDataArr[i].length; ++j) {
                _loop_1(j);
            }
        }
    };
    GamePanel.prototype.initGame = function () {
        var _this = this;
        this.eventvalue.levelData[0].answer = DaAnData_1.DaAnData.getInstance().answerDataArr;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_itchopn');
        AudioManager_1.AudioManager.getInstance().playSound('请按规则把图形放在正确的位置上吧！', false, 1, function (id) { _this.audioId = id; }, null);
        this.initData();
        this.intervalPoint();
        this.initType();
        this.initRule();
        this.initAnswer();
    };
    GamePanel.prototype.initData = function () {
        if (DaAnData_1.DaAnData.getInstance().figure == 1) {
            this.type1 = ItemType_1.ItemType.triangle_green;
            this.type2 = ItemType_1.ItemType.circle_yellow;
            this.arrow1 = ItemType_1.ItemType.line_curve;
            this.arrow2 = ItemType_1.ItemType.line_dotted;
            this.typeNull = ItemType_1.ItemType.square_black;
            this.arrowNull = ItemType_1.ItemType.line_black;
            this.typeLight = this.squareLight;
            this.handLight = this.lineLight;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
            this.type1 = ItemType_1.ItemType.sexangle_orange;
            this.type2 = ItemType_1.ItemType.sexangle_purple;
            this.arrow1 = ItemType_1.ItemType.hand_blue;
            this.arrow2 = ItemType_1.ItemType.hand_green;
            this.typeNull = ItemType_1.ItemType.sexangle_black;
            this.arrowNull = ItemType_1.ItemType.hand_black;
            this.typeLight = this.sexangleLight;
            this.handLight = this.arrowLight;
        }
        else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
            this.type1 = ItemType_1.ItemType.octagon_yellow;
            this.type2 = ItemType_1.ItemType.octagon_green;
            this.arrow1 = ItemType_1.ItemType.arrow_blue;
            this.arrow2 = ItemType_1.ItemType.arrow_orange;
            this.typeNull = ItemType_1.ItemType.octagon_black;
            this.arrowNull = ItemType_1.ItemType.arrow_black;
            this.typeLight = this.octagonLight;
            this.handLight = this.arrowLight;
        }
        for (var i = 0; i < this.subjectDataArr.length; i++) {
            this.answerDataArr[i] = [];
            for (var j = 0; j < this.subjectDataArr[i].length; j++) {
                if (this.subjectDataArr[i][j] == this.typeNull || this.subjectDataArr[i][j] == this.arrowNull) {
                    this.answerDataArr[i][j] = null;
                }
                else {
                    this.answerDataArr[i][j] = this.subjectDataArr[i][j];
                }
            }
        }
    };
    GamePanel.prototype.initType = function () {
        if (this.subjectNode.children[0]) {
            this.subjectNode.children[0].destroy();
        }
        this.subjectNode.removeAllChildren();
        var node = null;
        if (this.type == 1) {
            node = cc.instantiate(this.treePrefab);
            node.setScale(0.9);
            node.setPosition(cc.v2(-300, 0));
        }
        else if (this.type == 2) {
            node = cc.instantiate(this.singlePrefab);
            node.setScale(1);
            node.setPosition(cc.v2(-500, 0));
        }
        this.subjectNode.addChild(node);
        for (var i = 0; i < node.children.length; i++) {
            this.subjectItemArr[i] = [];
            for (var j = 0; j < node.children[i].children.length; j++) {
                this.subjectItemArr[i][j] = node.children[i].children[j];
                this.setState(this.subjectItemArr[i][j], this.subjectDataArr[i][j]);
                if (this.type == 1) {
                    if (i % 2 == 1) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.handLight;
                    }
                    else if (i % 2 == 0) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.typeLight;
                    }
                }
                else if (this.type == 2) {
                    if (j % 2 == 1) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.handLight;
                    }
                    else if (j % 2 == 0) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.typeLight;
                    }
                }
            }
        }
    };
    GamePanel.prototype.initRule = function () {
        for (var i = 0; i < this.ruleNode.children.length; i++) {
            this.ruleItemArr[i] = [];
            for (var j = 0; j < this.ruleNode.children[i].children.length; j++) {
                this.ruleItemArr[i][j] = this.ruleNode.children[i].children[j];
            }
        }
        for (var i = 0; i < this.ruleItemArr.length; i++) {
            for (var j = 0; j < this.ruleItemArr[i].length; j++) {
                this.ruleItemArr[i][j].getChildByName('blank').opacity = 255;
                this.ruleItemArr[i][j].getChildByName('sprite').active = false;
                this.setState(this.ruleItemArr[i][j], this.ruleDataArr[i][j]);
            }
        }
        if (this.figure == 1) {
            this.sameType = this.ruleDataArr[0][1];
            this.diffType = this.ruleDataArr[2][1];
        }
        else {
            this.sameType = this.ruleDataArr[2][1];
            this.diffType = this.ruleDataArr[0][1];
        }
    };
    GamePanel.prototype.initAnswer = function () {
        if (this.type == 1) {
            var totalNum = 0;
            var arrowNum = 0;
            for (var i = 0; i < this.subjectDataArr.length; i++) {
                for (var j = 0; j < this.subjectDataArr[i].length; j++) {
                    if (i % 2 == 1) {
                        totalNum++;
                        if (this.subjectDataArr[i][j] != this.arrowNull) {
                            arrowNum++;
                        }
                    }
                }
            }
            if (totalNum == arrowNum) {
                this.answerNode.getChildByName('arrow1').removeFromParent();
                this.answerNode.getChildByName('arrow2').removeFromParent();
            }
            else {
                this.setState(this.answerNode.getChildByName('arrow1'), this.arrow1);
                this.setState(this.answerNode.getChildByName('arrow2'), this.arrow2);
                this.answerItemArr[2] = this.answerNode.getChildByName('arrow1');
                this.answerItemArr[3] = this.answerNode.getChildByName('arrow2');
            }
        }
        else if (this.type == 2) {
            var totalNum = 0;
            var arrowNum = 0;
            for (var i = 0; i < this.subjectDataArr.length; i++) {
                for (var j = 0; j < this.subjectDataArr[i].length; j++) {
                    if (j % 2 == 1) {
                        totalNum++;
                        if (this.subjectDataArr[i][j] != this.arrowNull) {
                            arrowNum++;
                        }
                    }
                }
            }
            if (totalNum == arrowNum) {
                this.answerNode.getChildByName('arrow1').removeFromParent();
                this.answerNode.getChildByName('arrow2').removeFromParent();
            }
            else {
                this.setState(this.answerNode.getChildByName('arrow1'), this.arrow1);
                this.setState(this.answerNode.getChildByName('arrow2'), this.arrow2);
                this.answerItemArr[2] = this.answerNode.getChildByName('arrow1');
                this.answerItemArr[3] = this.answerNode.getChildByName('arrow2');
            }
        }
        this.setState(this.answerNode.getChildByName('figure1'), this.type1);
        this.setState(this.answerNode.getChildByName('figure2'), this.type2);
        this.answerItemArr[0] = this.answerNode.getChildByName('figure1');
        this.answerItemArr[1] = this.answerNode.getChildByName('figure2');
        this.addListenerOnAnswer();
    };
    GamePanel.prototype.getRandomNum = function (min, max) {
        var range = max - min;
        var rand = Math.random();
        return (min + Math.round(rand * range));
    };
    GamePanel.prototype.addListenerOnAnswer = function () {
        var _this = this;
        var _loop_2 = function (i) {
            var node = this_2.answerItemArr[i].getChildByName('blank');
            node.on(cc.Node.EventType.TOUCH_START, function (e) {
                if (_this.touchTarget || !_this.touchEnable) {
                    return;
                }
                _this.stopIntervalPoint();
                var rn = _this.getRandomNum(1, 4);
                AudioManager_1.AudioManager.getInstance().stopAll();
                if (rn == 1) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }
                else if (rn == 2) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }
                else if (rn == 3) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }
                else if (rn == 4) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                _this.touchTarget = e.target;
                var type = _this.answerType(i);
                _this.touchNode.active = true;
                _this.touchNode.zIndex = 100;
                _this.setState(_this.touchNode, type);
                var point = _this.node.convertToNodeSpaceAR(e.currentTouch._point);
                _this.touchNode.setPosition(point);
            });
            node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                if (_this.touchTarget != e.target || !_this.touchEnable) {
                    return;
                }
                var point = _this.node.convertToNodeSpaceAR(e.currentTouch._point);
                _this.touchNode.setPosition(point);
                var totalNum = 0;
                for (var n = 0; n < _this.subjectItemArr.length; n++) {
                    for (var m = 0; m < _this.subjectItemArr[n].length; m++) {
                        var node_2 = _this.subjectItemArr[n][m];
                        if (!node_2.getChildByName('sprite').active) {
                            totalNum++;
                            if (node_2.getChildByName('blank').getBoundingBox().contains(node_2.convertToNodeSpaceAR(e.currentTouch._point)) && _this.isSame(n, m, i)) {
                                node_2.getChildByName('light').active = true;
                                for (var p = 0; p < _this.subjectItemArr.length; p++) {
                                    for (var q = 0; q < _this.subjectItemArr[p].length; q++) {
                                        if (p != n || q != m) {
                                            _this.subjectItemArr[p][q].getChildByName('light').active = false;
                                        }
                                    }
                                }
                            }
                            else {
                                _this.overNum++;
                            }
                        }
                        if (n == _this.subjectItemArr.length - 1 && m == _this.subjectItemArr[n].length - 1) {
                            if (totalNum == _this.overNum) {
                                for (var p = 0; p < _this.subjectItemArr.length; p++) {
                                    for (var q = 0; q < _this.subjectItemArr[p].length; q++) {
                                        _this.subjectItemArr[p][q].getChildByName('light').active = false;
                                    }
                                }
                            }
                            _this.overNum = 0;
                        }
                    }
                }
            });
            node.on(cc.Node.EventType.TOUCH_END, function (e) {
                if (e.target != _this.touchTarget || !_this.touchEnable) {
                    return;
                }
                _this.intervalPoint();
                var rn = _this.getRandomNum(1, 4);
                AudioManager_1.AudioManager.getInstance().stopAll();
                if (rn == 1) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }
                else if (rn == 2) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }
                else if (rn == 3) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }
                else if (rn == 4) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                _this.touchTarget = null;
                _this.touchNode.active = false;
                for (var p = 0; p < _this.subjectItemArr.length; p++) {
                    for (var q = 0; q < _this.subjectItemArr[p].length; q++) {
                        _this.subjectItemArr[p][q].getChildByName('light').active = false;
                    }
                }
            });
            node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
                if (e.target != _this.touchTarget || !_this.touchEnable) {
                    return;
                }
                _this.intervalPoint();
                var rn = _this.getRandomNum(1, 4);
                AudioManager_1.AudioManager.getInstance().stopAll();
                if (rn == 1) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }
                else if (rn == 2) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }
                else if (rn == 3) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }
                else if (rn == 4) {
                    AudioManager_1.AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                var _loop_3 = function (n) {
                    var _loop_4 = function (m) {
                        var node_3 = _this.subjectItemArr[n][m];
                        if (node_3.getChildByName('blank').getBoundingBox().contains(node_3.convertToNodeSpaceAR(e.currentTouch._point)) && !_this.subjectItemArr[n][m].getChildByName('sprite').active) {
                            if (_this.isSame(n, m, i)) {
                                var result = _this.judge(n, m, i);
                                if (result == 1) {
                                    _this.answerDataArr[n][m] = _this.answerType(i);
                                    _this.setState(node_3, _this.answerType(i));
                                    _this.adsorbAction(node_3);
                                    _this.eventvalue.levelData[0].result = 2;
                                    _this.isOver = 2;
                                    _this.eventvalue.levelData[0].subject = _this.answerDataArr;
                                    if (_this.success()) {
                                        DaAnData_1.DaAnData.getInstance().submitEnable = true;
                                        _this.eventvalue.levelData[0].result = 1;
                                        _this.isOver = 1;
                                        _this.eventvalue.levelData[0].subject = _this.answerDataArr;
                                        console.log(_this.eventvalue);
                                        DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                                            eventType: 'clickSubmit',
                                            eventValue: JSON.stringify(_this.eventvalue)
                                        });
                                        UIHelp_1.UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧～', null, '挑战成功');
                                    }
                                }
                                else if (result == 2) {
                                    _this.answerDataArr[n][m] = _this.answerType(i);
                                    _this.setState(node_3, _this.answerType(i));
                                    _this.adsorbAction(node_3);
                                    _this.eventvalue.levelData[0].result = 2;
                                    _this.isOver = 2;
                                    _this.eventvalue.levelData[0].answer = _this.answerDataArr;
                                    _this.touchEnable = false;
                                    AudioManager_1.AudioManager.getInstance().stopAudio(_this.audioId);
                                    AudioManager_1.AudioManager.getInstance().playSound('再仔细看看规则哦~', false, 1, null, function () {
                                        _this.touchEnable = true;
                                        _this.setState(node_3, _this.defaultType(i));
                                        _this.answerDataArr[n][m] = null;
                                    });
                                    _this.touchTarget = null;
                                    _this.touchNode.active = false;
                                }
                                else if (result == 3) {
                                    _this.answerDataArr[n][m] = _this.answerType(i);
                                    _this.setState(node_3, _this.answerType(i));
                                    _this.adsorbAction(node_3);
                                    _this.eventvalue.levelData[0].result = 2;
                                    _this.isOver = 2;
                                    _this.eventvalue.levelData[0].answer = _this.answerDataArr;
                                    _this.touchEnable = false;
                                    AudioManager_1.AudioManager.getInstance().stopAudio(_this.audioId);
                                    AudioManager_1.AudioManager.getInstance().playSound('目前无法判断这个位置哦~~', false, 1, null, function () {
                                        _this.touchEnable = true;
                                        _this.setState(node_3, _this.defaultType(i));
                                        _this.answerDataArr[n][m] = null;
                                    });
                                    _this.touchTarget = null;
                                    _this.touchNode.active = false;
                                }
                            }
                        }
                    };
                    for (var m = 0; m < _this.subjectItemArr[n].length; m++) {
                        _loop_4(m);
                    }
                };
                for (var n = 0; n < _this.subjectItemArr.length; n++) {
                    _loop_3(n);
                }
                for (var p = 0; p < _this.subjectItemArr.length; p++) {
                    for (var q = 0; q < _this.subjectItemArr[p].length; q++) {
                        if (_this.subjectItemArr[p][q].getChildByName('light').opacity == 255) {
                            _this.subjectItemArr[p][q].getChildByName('light').active = false;
                        }
                    }
                }
                _this.touchTarget = null;
                _this.touchNode.active = false;
                _this.intervalPoint();
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.answerItemArr.length; i++) {
            _loop_2(i);
        }
    };
    GamePanel.prototype.adsorbAction = function (node) {
        node = node.getChildByName('sprite');
        var seq = cc.sequence(cc.scaleTo(0.2, 0.8), cc.scaleTo(0.1, 1));
        node.runAction(seq);
    };
    GamePanel.prototype.success = function () {
        var rightNum = 0;
        var totalNum = 0;
        for (var i = 0; i < this.answerDataArr.length; i++) {
            for (var j = 0; j < this.answerDataArr[i].length; j++) {
                totalNum++;
                if (this.answerDataArr[i][j]) {
                    rightNum++;
                }
            }
        }
        if (totalNum == rightNum) {
            return true;
        }
        else {
            return false;
        }
    };
    GamePanel.prototype.isSame = function (i, j, indexOfAnswer) {
        if (this.type == 1) {
            if (indexOfAnswer == 0 || indexOfAnswer == 1) {
                if (i % 2 == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (indexOfAnswer == 2 || indexOfAnswer == 3) {
                if (i % 2 == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else if (this.type == 2) {
            if (indexOfAnswer == 0 || indexOfAnswer == 1) {
                if (j % 2 == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (indexOfAnswer == 2 || indexOfAnswer == 3) {
                if (j % 2 == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
    GamePanel.prototype.answerType = function (index) {
        var type = null;
        switch (index) {
            case 0:
                type = this.type1;
                break;
            case 1:
                type = this.type2;
                break;
            case 2:
                type = this.arrow1;
                break;
            case 3:
                type = this.arrow2;
                break;
        }
        return type;
    };
    GamePanel.prototype.defaultType = function (index) {
        var type = null;
        switch (index) {
            case 0:
                type = this.typeNull;
                break;
            case 1:
                type = this.typeNull;
                break;
            case 2:
                type = this.arrowNull;
                break;
            case 3:
                type = this.arrowNull;
                break;
        }
        return type;
    };
    GamePanel.prototype.judge = function (i, j, indexOfAnswer) {
        var type = this.answerType(indexOfAnswer);
        if (this.type == 1) {
            if (indexOfAnswer == 0 || indexOfAnswer == 1) {
                if (i > 4) {
                    if (this.answerDataArr[i - 1][j] && this.answerDataArr[i - 2][Math.floor(j / 2)]) {
                        return this.correct(this.answerDataArr[i - 2][Math.floor(j / 2)], type, this.answerDataArr[i - 1][j], 3);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i - 1][j], this.subjectItemArr[i - 2][Math.floor(j / 2)]);
                        return 3;
                    }
                }
                else if (i < 2) {
                    if (this.answerDataArr[i + 1][j * 2] && this.answerDataArr[i + 2][j * 2]) {
                        return this.correct(type, this.answerDataArr[i + 2][j * 2], this.answerDataArr[i + 1][j * 2], 1);
                    }
                    else if (this.answerDataArr[i + 1][j * 2 + 1] && this.answerDataArr[i + 2][j * 2 + 1]) {
                        return this.correct(type, this.answerDataArr[i + 2][j * 2 + 1], this.answerDataArr[i + 1][j * 2 + 1], 1);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i + 1][j * 2], this.subjectItemArr[i + 2][j * 2]);
                        this.noAnswerPoint(this.subjectItemArr[i + 1][j * 2 + 1], this.subjectItemArr[i + 2][j * 2 + 1]);
                        return 3;
                    }
                }
                else if (i <= 4 && i >= 2) {
                    if (this.answerDataArr[i - 1][j] && this.answerDataArr[i - 2][Math.floor(j / 2)]) {
                        return this.correct(this.answerDataArr[i - 2][Math.floor(j / 2)], type, this.answerDataArr[i - 1][j], 3);
                    }
                    else if (this.answerDataArr[i + 1][j * 2] && this.answerDataArr[i + 2][j * 2]) {
                        return this.correct(type, this.answerDataArr[i + 2][j * 2], this.answerDataArr[i + 1][j * 2], 1);
                    }
                    else if (this.answerDataArr[i + 1][j * 2 + 1] && this.answerDataArr[i + 2][j * 2 + 1]) {
                        return this.correct(type, this.answerDataArr[i + 2][j * 2 + 1], this.answerDataArr[i + 1][j * 2 + 1], 1);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i + 1][j * 2], this.subjectItemArr[i + 2][j * 2]);
                        this.noAnswerPoint(this.subjectItemArr[i + 1][j * 2 + 1], this.subjectItemArr[i + 2][j * 2 + 1]);
                        this.noAnswerPoint(this.subjectItemArr[i - 1][j], this.subjectItemArr[i - 2][Math.floor(j / 2)]);
                        return 3;
                    }
                }
            }
            else if (indexOfAnswer == 2 || indexOfAnswer == 3) {
                if (this.answerDataArr[i - 1][Math.floor(j / 2)] && this.answerDataArr[i + 1][j]) {
                    return this.correct(this.answerDataArr[i - 1][Math.floor(j / 2)], this.answerDataArr[i + 1][j], type, 2);
                }
                else {
                    this.noAnswerPoint(this.subjectItemArr[i - 1][Math.floor(j / 2)], this.subjectItemArr[i + 1][j]);
                    return 3;
                }
            }
        }
        else if (this.type == 2) {
            if (indexOfAnswer == 0 || indexOfAnswer == 1) {
                if (j > 6) {
                    if (this.answerDataArr[i][j - 1] && this.answerDataArr[i][j - 2]) {
                        return this.correct(this.answerDataArr[i][j - 2], type, this.answerDataArr[i][j - 1], 3);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i][j - 1], this.subjectItemArr[i][j - 2]);
                        return 3;
                    }
                }
                else if (j < 2) {
                    if (this.answerDataArr[i][j + 1] && this.answerDataArr[i][j + 2]) {
                        return this.correct(type, this.answerDataArr[i][j + 2], this.answerDataArr[i][j + 1], 1);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i][j + 1], this.subjectItemArr[i][j + 2]);
                        return 3;
                    }
                }
                else if (j >= 2 && j <= 6) {
                    if (this.answerDataArr[i][j + 1] && this.answerDataArr[i][j + 2]) {
                        return this.correct(type, this.answerDataArr[i][j + 2], this.answerDataArr[i][j + 1], 1);
                    }
                    else if (this.answerDataArr[i][j - 1] && this.answerDataArr[i][j - 2]) {
                        return this.correct(this.answerDataArr[i][j - 2], type, this.answerDataArr[i][j - 1], 3);
                    }
                    else {
                        this.noAnswerPoint(this.subjectItemArr[i][j - 1], this.subjectItemArr[i][j - 2]);
                        this.noAnswerPoint(this.subjectItemArr[i][j + 1], this.subjectItemArr[i][j + 2]);
                        return 3;
                    }
                }
            }
            else if (indexOfAnswer == 2 || indexOfAnswer == 3) {
                if (this.answerDataArr[i][j - 1] && this.answerDataArr[i][j + 1]) {
                    return this.correct(this.answerDataArr[i][j - 1], this.answerDataArr[i][j + 1], type, 2);
                }
                else {
                    this.noAnswerPoint(this.subjectItemArr[i][j - 1], this.subjectItemArr[i][j + 1]);
                    return 3;
                }
            }
        }
    };
    GamePanel.prototype.correct = function (type1, type2, arrow, answerType) {
        if (arrow == this.sameType) {
            if (type1 == type2) {
                return 1;
            }
            else {
                this.rulePoint(type1, type2, arrow, answerType);
                return 2;
            }
        }
        else if (arrow == this.diffType) {
            if (type1 != type2) {
                return 1;
            }
            else {
                this.rulePoint(type1, type2, arrow, answerType);
                return 2;
            }
        }
    };
    GamePanel.prototype.noAnswerPoint = function (item1, item2) {
        cc.log(item1, item2);
        if (!item1.getChildByName('sprite').active) {
            var node1_1 = item1.getChildByName('light');
            node1_1.active = true;
            node1_1.opacity = 1;
            node1_1.scale = 0.5;
            var func = cc.callFunc(function () {
                node1_1.active = false;
                node1_1.opacity = 255;
                node1_1.scale = 1;
                cc.log('-------noAnswerPoint');
            });
            var func1 = cc.callFunc(function () {
                node1_1.opacity = 1;
                node1_1.scale = 0.5;
            });
            var spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1));
            var spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2));
            var seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func);
            node1_1.stopAllActions();
            node1_1.runAction(seq);
        }
        if (!item2.getChildByName('sprite').active) {
            var node_4 = item2.getChildByName('light');
            node_4.active = true;
            node_4.opacity = 1;
            node_4.scale = 0.5;
            var func = cc.callFunc(function () {
                node_4.active = false;
                node_4.opacity = 255;
                node_4.scale = 1;
            });
            var func1 = cc.callFunc(function () {
                node_4.opacity = 1;
                node_4.scale = 0.5;
            });
            var spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1));
            var spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2));
            var seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func);
            node_4.stopAllActions();
            node_4.runAction(seq);
        }
    };
    GamePanel.prototype.rulePoint = function (type1, type2, arrow, answerType) {
        for (var i = 0; i < this.ruleItemArr.length; ++i) {
            for (var j = 0; j < this.ruleItemArr[i].length; ++j) {
                if (answerType == 1) {
                    if (this.ruleDataArr[i][j] == arrow && this.ruleDataArr[i][j + 1] == type2) {
                        this.ruleItemArr[i][j - 1].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j + 1].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                    }
                }
                else if (answerType == 2) {
                    if (this.ruleDataArr[i][j] == type1 && this.ruleDataArr[i][j + 2] == type2) {
                        this.ruleItemArr[i][j + 2].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j + 1].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                    }
                }
                else if (answerType == 3) {
                    if (this.ruleDataArr[i][j + 1] == arrow && this.ruleDataArr[i][j] == type1) {
                        this.ruleItemArr[i][j + 2].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                        this.ruleItemArr[i][j + 1].runAction(cc.sequence(cc.moveBy(0.2, 20, 0), cc.moveBy(0.2, -40, 0), cc.moveBy(0.2, 40, 0), cc.moveBy(0.2, -20, 0)));
                    }
                }
            }
        }
    };
    GamePanel.prototype.setRuleDefault = function (i, j, type) {
        this.setState(this.ruleItemArr[i][j], type);
    };
    GamePanel.prototype.setState = function (node, state) {
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
    GamePanel.prototype.getSpriteframe = function (state) {
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
    GamePanel.prototype.onEndGame = function () {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting_1.default.isRepeatReport) {
            DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting_1.default.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    };
    GamePanel.prototype.onDestroy = function () {
        for (var i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i]);
        }
        this.intervalArr = [];
    };
    GamePanel.prototype.onShow = function () {
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                var content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if (content.type) {
                        DaAnData_1.DaAnData.getInstance().type = content.type;
                        this.type = content.type;
                    }
                    else {
                        console.error('网络请求数据content.type为空');
                        return;
                    }
                    if (content.figure) {
                        DaAnData_1.DaAnData.getInstance().figure = content.figure;
                        this.figure = content.figure;
                    }
                    else {
                        console.error('网络请求数据content.figure为空');
                        return;
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
                    if (content.answerDataArr) {
                        DaAnData_1.DaAnData.getInstance().answerDataArr = content.answerDataArr;
                    }
                    else {
                        console.error('网络请求数据content.answerDataArr为空');
                        return;
                    }
                    this.initGame();
                }
            }
            else {
                console.error('网络请求数据失败');
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "ruleNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "subjectNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "answerNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "singlePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "treePrefab", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "squareBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "circleYellow", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "triangleGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "sexangleBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "sexangleOrange", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "sexanglePurple", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "octagonBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "octagonGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "octagonYellow", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "arrowBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "arrowBlue", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "arrowOrange", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "handGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "lineBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "lineCurve", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "lineDotted", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "squareLight", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "sexangleLight", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "octagonLight", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "lineLight", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "arrowLight", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "touchNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bg", void 0);
    GamePanel = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();