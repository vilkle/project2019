(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/GamePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel', __filename);
// scripts/UI/panel/GamePanel.ts

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
var NetWork_1 = require("../../Http/NetWork");
var UIHelp_1 = require("../../Utils/UIHelp");
var AudioManager_1 = require("../../Manager/AudioManager");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var DaAnData_1 = require("../../Data/DaAnData");
var UploadAndReturnPanel_1 = require("../panel/UploadAndReturnPanel");
var DataReporting_1 = require("../../Data/DataReporting");
var Set_1 = require("../../collections/Set");
var OverTips_1 = require("../Item/OverTips");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bg = null;
        _this.progressNode = null;
        _this.bigNode = null;
        _this.smallNode = null;
        _this.selectPrefab = null;
        _this.backButton = null;
        _this.touchNode = null;
        _this.loudSpeaker = null;
        _this.loudspeakerBox = null;
        _this.selectNode = null;
        _this.types = 0;
        _this.typetype = [];
        _this.checkpointsNum = 0;
        _this.typeDataArr = [];
        _this.sourceSFArr = [];
        _this.animalSFArr = [];
        _this.foodSFArr = [];
        _this.stationerySFArr = [];
        _this.clothesSFArr = [];
        _this.ItemNodeArr = [];
        _this.AnswerBoardArr = [];
        _this.selectNodeArr = [];
        _this.selectNodeCenterArr = [];
        _this.selectPosArr = [];
        _this.answerArr = [];
        _this.answer = [];
        _this.answer1 = [];
        _this.answer2 = [];
        _this.answer3 = [];
        _this.answer4 = [];
        _this.player1 = [];
        _this.player2 = [];
        _this.player3 = [];
        _this.player4 = [];
        _this.typeArr = [];
        _this.selectArr = [];
        _this.finishArr = [];
        _this.timeOutArr = [];
        _this.checkpoint = 1;
        _this.selectType = 0;
        _this.touchTarget = null;
        _this.isOver = 0;
        _this.selectMove = false;
        _this.overNum = 0;
        _this.progress = null;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 1,
            levelData: [],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.onLoad = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            this.types = DaAnData_1.DaAnData.getInstance().types;
            this.typetype = DaAnData_1.DaAnData.getInstance().typetype;
            this.checkpointsNum = DaAnData_1.DaAnData.getInstance().checkpointsNum;
            this.typeDataArr = DaAnData_1.DaAnData.getInstance().typeDataArr;
            this.loadSourceSFArr();
            UIManager_1.UIManager.getInstance().openUI(UploadAndReturnPanel_1.default);
        }
        else {
            this.getNet();
        }
    };
    GamePanel.prototype.start = function () {
        var _this = this;
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (_this.isOver != 1) {
                _this.isOver = 2;
                _this.eventvalue.result = 2;
                _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
            }
            if (_this.isOver == 1 && _this.types == 2) {
                for (var i = 0; i < _this.timeOutArr.length; i++) {
                    clearTimeout(_this.timeOutArr[i]);
                }
                for (var i = 0; i < _this.selectNodeCenterArr.length; i++) {
                    _this.selectNodeCenterArr[i].getChildByName('bubble').stopAllActions();
                    _this.selectNodeCenterArr[i].getChildByName('bubble').setScale(0);
                }
            }
        });
        this.loudspeakerBox.node.on(cc.Node.EventType.TOUCH_START, function () {
            _this.loudSpeaker.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
            AudioManager_1.AudioManager.getInstance().stopAll();
            AudioManager_1.AudioManager.getInstance().playSound('把这些物品分类整理，并拖到对应区域内。', false);
        });
    };
    GamePanel.prototype.loadSourceSFArr = function () {
        var _this = this;
        if (this.types == 1) {
            cc.loader.loadResDir("images/gameUI/pic/animal", cc.SpriteFrame, function (err, assets, urls) {
                if (!err) {
                    for (var i = 0; i < assets.length; i++) {
                        for (var j = 0; j < assets.length - 1 - i; j++) {
                            var len1 = assets[j].name.length;
                            var str1 = assets[j].name.substring(len1 - 1, len1);
                            var num1 = parseInt(str1);
                            var len2 = assets[j + 1].name.length;
                            var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                            var num2 = parseInt(str2);
                            if (num1 > num2) {
                                var temp = assets[j + 1];
                                assets[j + 1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < assets.length; i++) {
                        _this.animalSFArr.push(assets[i]);
                        if (_this.animalSFArr.length + _this.foodSFArr.length + _this.stationerySFArr.length + _this.clothesSFArr.length == 20) {
                            _this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/food", cc.SpriteFrame, function (err, assets, urls) {
                if (!err) {
                    for (var i = 0; i < assets.length; i++) {
                        for (var j = 0; j < assets.length - 1 - i; j++) {
                            var len1 = assets[j].name.length;
                            var str1 = assets[j].name.substring(len1 - 1, len1);
                            var num1 = parseInt(str1);
                            var len2 = assets[j + 1].name.length;
                            var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                            var num2 = parseInt(str2);
                            if (num1 > num2) {
                                var temp = assets[j + 1];
                                assets[j + 1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < assets.length; i++) {
                        _this.foodSFArr.push(assets[i]);
                        if (_this.animalSFArr.length + _this.foodSFArr.length + _this.stationerySFArr.length + _this.clothesSFArr.length == 20) {
                            _this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/stationery", cc.SpriteFrame, function (err, assets, urls) {
                if (!err) {
                    for (var i = 0; i < assets.length; i++) {
                        for (var j = 0; j < assets.length - 1 - i; j++) {
                            var len1 = assets[j].name.length;
                            var str1 = assets[j].name.substring(len1 - 1, len1);
                            var num1 = parseInt(str1);
                            var len2 = assets[j + 1].name.length;
                            var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                            var num2 = parseInt(str2);
                            if (num1 > num2) {
                                var temp = assets[j + 1];
                                assets[j + 1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < assets.length; i++) {
                        _this.stationerySFArr.push(assets[i]);
                        if (_this.animalSFArr.length + _this.foodSFArr.length + _this.stationerySFArr.length + _this.clothesSFArr.length == 20) {
                            _this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/clothes", cc.SpriteFrame, function (err, assets, urls) {
                if (!err) {
                    for (var i = 0; i < assets.length; i++) {
                        for (var j = 0; j < assets.length - 1 - i; j++) {
                            var len1 = assets[j].name.length;
                            var str1 = assets[j].name.substring(len1 - 1, len1);
                            var num1 = parseInt(str1);
                            var len2 = assets[j + 1].name.length;
                            var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                            var num2 = parseInt(str2);
                            if (num1 > num2) {
                                var temp = assets[j + 1];
                                assets[j + 1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < assets.length; i++) {
                        _this.clothesSFArr.push(assets[i]);
                        if (_this.animalSFArr.length + _this.foodSFArr.length + _this.stationerySFArr.length + _this.clothesSFArr.length == 20) {
                            _this.setPanel();
                        }
                    }
                }
            });
        }
        else if (this.types == 2) {
            if (this.typetype[0] == 1) {
                cc.loader.loadResDir("images/gameUI/pic/cookies", cc.SpriteFrame, function (err, assets, urls) {
                    if (!err) {
                        for (var i = 0; i < assets.length; i++) {
                            for (var j = 0; j < assets.length - 1 - i; j++) {
                                var len1 = assets[j].name.length;
                                var str1 = assets[j].name.substring(len1 - 1, len1);
                                var num1 = parseInt(str1);
                                var len2 = assets[j + 1].name.length;
                                var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                                var num2 = parseInt(str2);
                                if (num1 > num2) {
                                    var temp = assets[j + 1];
                                    assets[j + 1] = assets[j];
                                    assets[j] = temp;
                                }
                            }
                        }
                        for (var i = 0; i < assets.length; i++) {
                            _this.sourceSFArr.push(assets[i]);
                            if (_this.sourceSFArr.length == 9) {
                                _this.setPanel();
                            }
                        }
                    }
                });
            }
            else if (this.typetype[0] == 2) {
                cc.loader.loadResDir("images/gameUI/pic/figure", cc.SpriteFrame, function (err, assets, urls) {
                    if (!err) {
                        for (var i = 0; i < assets.length; i++) {
                            for (var j = 0; j < assets.length - 1 - i; j++) {
                                var len1 = assets[j].name.length;
                                var str1 = assets[j].name.substring(len1 - 1, len1);
                                var num1 = parseInt(str1);
                                var len2 = assets[j + 1].name.length;
                                var str2 = assets[j + 1].name.substring(len2 - 1, len2);
                                var num2 = parseInt(str2);
                                if (num1 > num2) {
                                    var temp = assets[j + 1];
                                    assets[j + 1] = assets[j];
                                    assets[j] = temp;
                                }
                            }
                        }
                        for (var i = 0; i < assets.length; i++) {
                            _this.sourceSFArr.push(assets[i]);
                            if (_this.sourceSFArr.length == 9) {
                                _this.setPanel();
                            }
                        }
                    }
                });
            }
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
        if (this.eventvalue.isResult == 1) {
            this.isOver = 1;
        }
        else {
            if (this.eventvalue.levelData.length == 0) {
                this.isOver = 0;
            }
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.onShow = function () {
    };
    GamePanel.prototype.setPanel = function () {
        if (this.types == 1) {
            for (var i = 0; i < 5; i++) {
                this.sourceSFArr[i] = this.animalSFArr[i];
                this.sourceSFArr[5 + i] = this.foodSFArr[i];
                this.sourceSFArr[10 + i] = this.stationerySFArr[i];
                this.sourceSFArr[15 + i] = this.clothesSFArr[i];
            }
            for (var i = 0; i < this.checkpointsNum; i++) {
                this.finishArr.push(false);
            }
        }
        for (var i = 0; i < this.checkpointsNum; i++) {
            this.eventvalue.levelData.push({
                subject: [],
                answer: [],
                result: 4
            });
        }
        this.initAnswerArr(1);
    };
    GamePanel.prototype.initAnswerArr = function (checkpoint) {
        if (this.types == 1) {
            var long = 20;
        }
        else if (this.types == 2) {
            var long = 27;
        }
        this.answer = [];
        for (var i = 0; i < this.checkpointsNum; i++) {
            for (var j = i * long; j < (i + 1) * long; j++) {
                if (this.typeDataArr[j]) {
                    this.answer.push(j);
                }
            }
        }
        if (this.types == 1) {
            this.answer = [];
            for (var j = (checkpoint - 1) * long; j < checkpoint * long; j++) {
                if (this.typeDataArr[j]) {
                    this.answer.push(j);
                }
            }
        }
        //开始初始化
        this.progressBar(checkpoint, this.checkpointsNum);
        this.createItem(checkpoint);
        this.postItem();
    };
    GamePanel.prototype.setTag = function (item, tagName, size) {
        var big = item.getChildByName('bigTag').getChildByName(tagName);
        var small = item.getChildByName('smallTag').getChildByName(tagName);
        if (size) {
            big.setScale(size);
            small.setScale(size);
        }
        if (big) {
            big.active = true;
        }
        if (small) {
            small.active = true;
        }
    };
    GamePanel.prototype.centerSelectNode = function () {
        var _this = this;
        for (var i = 0; i < 3; i++) {
            if (this.selectNodeArr[i]) {
                this.selectNodeCenterArr.push(this.selectNodeArr[i]);
            }
        }
        var num = this.selectNodeCenterArr.length;
        var space = 600;
        var long = (num - 1) * space;
        var starX = -long / 2;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_casemove', false);
        var _loop_1 = function (i) {
            this_1.selectNodeCenterArr[i].setPosition(cc.v2(starX + i * space - 2000, -300));
            this_1.selectPosArr[i] = cc.v2(starX + i * space - 2000, -300);
            setTimeout(function () {
                _this.selectNodeCenterArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
            }, 100 * (num - 1 - i));
        };
        var this_1 = this;
        for (var i = 0; i < num; i++) {
            _loop_1(i);
        }
    };
    GamePanel.prototype.createSelectBoard = function () {
        var _this = this;
        this.finishArr = [false, true, false];
        this.selectNode = cc.instantiate(this.selectPrefab);
        this.selectNode.setPosition(cc.v2(0, 0));
        cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.selectNode);
        this.selectNodeArr = [];
        if (this.checkColor(this.checkpoint) > 1) {
            this.selectNode.getChildByName('colorNode').active = true;
            this.selectNode.getChildByName('colorNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[0] = true;
            this.finishArr[0] = false;
            this.selectNodeArr[0] = this.selectNode.getChildByName('colorNode');
        }
        else {
            this.selectNode.getChildByName('colorNode').active = false;
            this.selectArr[0] = false;
            this.finishArr[0] = true;
        }
        if (this.checkFigure(this.checkpoint) > 1) {
            this.selectNode.getChildByName('figureNode').active = true;
            this.selectNode.getChildByName('figureNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[1] = true;
            this.finishArr[1] = false;
            this.selectNodeArr[1] = this.selectNode.getChildByName('figureNode');
        }
        else {
            this.selectNode.getChildByName('figureNode').active = false;
            this.selectArr[1] = false;
            this.finishArr[1] = true;
        }
        if (this.checkSize(this.checkpoint) > 1) {
            this.selectNode.getChildByName('sizeNode').active = true;
            this.selectNode.getChildByName('sizeNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[2] = true;
            this.finishArr[2] = false;
            this.selectNodeArr[2] = this.selectNode.getChildByName('sizeNode');
        }
        else {
            this.selectNode.getChildByName('sizeNode').active = false;
            this.selectArr[2] = false;
            this.finishArr[2] = true;
        }
        this.centerSelectNode();
        var _loop_2 = function (i) {
            this_2.selectNode.children[i].on(cc.Node.EventType.TOUCH_START, function (e) {
                if (_this.selectMove) {
                    return;
                }
                if (_this.finishArr[i]) {
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, true, true), false);
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == _this.getSelectAnimationName(i, true, true)) {
                            _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, true, false), true);
                        }
                    });
                    if (_this.selectNode.children[i].getChildByName('bubble').scale == 1) {
                        _this.selectNode.children[i].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0, 0));
                    }
                    else {
                        for (var j = 0; j < 3; j++) {
                            if (_this.selectNodeArr[j]) {
                                if (_this.selectNodeArr[j].getChildByName('bubble').scale == 1) {
                                    _this.selectNodeArr[j].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0, 0));
                                }
                            }
                        }
                        _this.selectNode.children[i].getChildByName('bubble').runAction(cc.scaleTo(0.3, 1, 1));
                        _this.selectNode.children[i].getChildByName('fireworks').opacity = 255;
                        AudioManager_1.AudioManager.getInstance().playSound('sfx_flowerfly', false);
                        _this.selectNode.children[i].getChildByName('fireworks').getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
                        _this.selectNode.children[i].getChildByName('fireworks').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                            if (trackEntry.animation.name == 'animation') {
                                _this.selectNode.children[i].getChildByName('fireworks').opacity = 0;
                            }
                        });
                    }
                }
                else {
                    _this.selectMove = true;
                    _this.selectType = i + 1;
                    if (_this.selectType == 1) {
                        AudioManager_1.AudioManager.getInstance().playSound('sfx_selogic', false);
                    }
                    else if (_this.selectType == 2) {
                        AudioManager_1.AudioManager.getInstance().playSound('sfx_seneo', false);
                    }
                    else if (_this.selectType == 3) {
                        AudioManager_1.AudioManager.getInstance().playSound('sfx_semia', false);
                    }
                    for (var j = 0; j < 3; j++) {
                        if (_this.selectNodeArr[j]) {
                            if (_this.selectNodeArr[j].getChildByName('bubble').scale == 1) {
                                _this.selectNodeArr[j].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0, 0));
                            }
                        }
                    }
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, _this.finishArr[i], true), false);
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == _this.getSelectAnimationName(i, false, true)) {
                            _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, _this.finishArr[i], false), true);
                            AudioManager_1.AudioManager.getInstance().playSound('sfx_casemove', false);
                            var _loop_3 = function (i_1) {
                                setTimeout(function () {
                                    if (i_1 < _this.selectNode.children.length - 1) {
                                        _this.selectNode.children[i_1].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
                                    }
                                    else {
                                        _this.selectNode.children[i_1].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(function () {
                                            _this.selectMove = false;
                                            _this.createAnswerBoard(_this.checkpoint);
                                        })));
                                    }
                                }, (_this.selectNode.children.length - 1 - i_1) * 100);
                            };
                            for (var i_1 = 0; i_1 < _this.selectNode.children.length; i_1++) {
                                _loop_3(i_1);
                            }
                        }
                    });
                }
            });
            this_2.selectNode.children[i].on(cc.Node.EventType.TOUCH_END, function (e) {
            });
            this_2.selectNode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.selectNode.children.length; i++) {
            _loop_2(i);
        }
    };
    GamePanel.prototype.resetSelect = function () {
        var _this = this;
        this.selectMove = true;
        this.selectNode.getChildByName('colorNode').stopAllActions();
        this.selectNode.getChildByName('figureNode').stopAllActions();
        this.selectNode.getChildByName('sizeNode').stopAllActions();
        for (var i = 0; i < this.selectNodeCenterArr.length; i++) {
            this.selectNodeCenterArr[i].setPosition(cc.v2(this.selectPosArr[i].x, -300));
        }
        this.selectNode.active = true;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_casemove', false);
        var _loop_4 = function (i) {
            if (this_3.finishArr[i]) {
                if (this_3.selectNodeCenterArr[i].active) {
                    this_3.selectNodeCenterArr[i].getComponent(sp.Skeleton).setAnimation(0, this_3.getSelectAnimationName(i, true, false), true);
                }
            }
            else {
                if (this_3.selectNodeCenterArr[i].active) {
                    this_3.selectNodeCenterArr[i].getComponent(sp.Skeleton).setAnimation(0, this_3.getSelectAnimationName(i, false, false), true);
                }
            }
            setTimeout(function () {
                if (_this.selectNodeCenterArr[i].active) {
                    if (i == _this.selectNodeCenterArr.length - 1) {
                        _this.selectNodeCenterArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(function () {
                            _this.selectMove = false;
                            if (_this.isOver == 1) {
                                _this.showHow();
                            }
                        })));
                    }
                    else {
                        _this.selectNodeCenterArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(function () {
                            _this.selectMove = false;
                        })));
                    }
                }
            }, 100 * (this_3.selectNodeCenterArr.length - 1 - i));
        };
        var this_3 = this;
        for (var i = 0; i < this.selectNodeCenterArr.length; i++) {
            _loop_4(i);
        }
    };
    GamePanel.prototype.showHow = function () {
        var _this = this;
        var _loop_5 = function (i) {
            var index = setTimeout(function () {
                _this.selectNodeCenterArr[i].getChildByName('bubble').runAction(cc.sequence(cc.scaleTo(0.3, 1, 1), cc.delayTime(1), cc.scaleTo(0.3, 0, 0)));
                _this.selectNodeCenterArr[i].getChildByName('fireworks').opacity = 255;
                AudioManager_1.AudioManager.getInstance().playSound('sfx_flowerfly', false);
                _this.selectNodeCenterArr[i].getChildByName('fireworks').getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
                _this.selectNodeCenterArr[i].getChildByName('fireworks').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                    if (trackEntry.animation.name == 'animation') {
                        _this.selectNode.children[i].getChildByName('fireworks').opacity = 0;
                    }
                });
            }, 1600 * i);
            this_4.timeOutArr.push(index);
        };
        var this_4 = this;
        for (var i = 0; i < this.selectNodeCenterArr.length; i++) {
            _loop_5(i);
        }
    };
    GamePanel.prototype.backButtonCallBack = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_casemove', false);
        var _loop_6 = function (i) {
            setTimeout(function () {
                if (i < _this.AnswerBoardArr.length - 1) {
                    _this.AnswerBoardArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
                }
                else {
                    _this.AnswerBoardArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(function () {
                        if (i == _this.AnswerBoardArr.length - 1) {
                            _this.resetSelect();
                            _this.removeListenerOnItem();
                            _this.player1 = [];
                            _this.player2 = [];
                            _this.player3 = [];
                            _this.player4 = [];
                            _this.answerArr = [];
                            _this.AnswerBoardArr = [];
                            _this.backButton.node.active = false;
                            var len = _this.AnswerBoardArr.length;
                            for (var i_2 = 0; i_2 < len; i_2++) {
                                _this.AnswerBoardArr[i_2].removeFromParent();
                                _this.AnswerBoardArr[i_2].destroy();
                            }
                        }
                    })));
                }
            }, (this_5.AnswerBoardArr.length - i - 1) * 100);
        };
        var this_5 = this;
        for (var i = 0; i < this.AnswerBoardArr.length; i++) {
            _loop_6(i);
        }
    };
    GamePanel.prototype.removeListenerOnItem = function () {
        for (var i = 0; i < this.ItemNodeArr.length; i++) {
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_START);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_MOVE);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_END);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_CANCEL);
            this.ItemNodeArr[i].opacity = 255;
        }
    };
    GamePanel.prototype.addListenerOnItem = function () {
        var _this = this;
        var _loop_7 = function (i) {
            this_6.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_START, function (e) {
                if (_this.touchTarget) {
                    return;
                }
                _this.touchTarget = e.target;
                _this.touchNode.active = true;
                _this.touchNode.zIndex = 100;
                e.target.opacity = 0;
                var point = _this.node.convertToNodeSpaceAR(e.currentTouch._point);
                _this.touchNode.setPosition(point);
                _this.touchNode.setScale(e.target.scale + 0.1);
                _this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;
                _this.touchNode.scale = e.target.scale - 0.1;
            });
            this_6.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                if (_this.touchTarget != e.target) {
                    return;
                }
                var point = _this.node.convertToNodeSpaceAR(e.currentTouch._point);
                _this.touchNode.setPosition(point);
                for (var i_3 = 0; i_3 < _this.AnswerBoardArr.length; i_3++) {
                    if (_this.AnswerBoardArr[i_3].getChildByName('bigTag').getBoundingBox().contains(_this.AnswerBoardArr[i_3].convertToNodeSpaceAR(e.currentTouch._point))) {
                        _this.AnswerBoardArr[i_3].getChildByName('box').active = true;
                        for (var j = 0; j < _this.AnswerBoardArr.length; j++) {
                            if (j != i_3) {
                                _this.AnswerBoardArr[j].getChildByName('box').active = false;
                            }
                        }
                    }
                    else {
                        _this.overNum++;
                    }
                    if (i_3 == _this.AnswerBoardArr.length - 1) {
                        if (_this.overNum == _this.AnswerBoardArr.length) {
                            for (var k = 0; k < _this.AnswerBoardArr.length; k++) {
                                _this.AnswerBoardArr[k].getChildByName('box').active = false;
                            }
                        }
                        _this.overNum = 0;
                    }
                }
            });
            this_6.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                if (_this.touchTarget != e.target) {
                    return;
                }
                _this.touchNode.active = false;
                e.target.opacity = 255;
                _this.touchTarget = null;
            });
            this_6.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
                if (_this.touchTarget != e.target) {
                    return;
                }
                var rightNum = 0;
                if (_this.AnswerBoardArr[0]) {
                    if (_this.AnswerBoardArr[0].getChildByName('bigTag').getBoundingBox().contains(_this.AnswerBoardArr[0].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if (_this.answerArr[0].indexOf(_this.answer[i]) != -1) {
                            _this.AnswerBoardArr[0].getChildByName('answerNode').children[_this.player1.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            _this.AnswerBoardArr[0].getChildByName('answerNode').children[_this.player1.length].setScale(e.target.scale);
                            if (_this.types == 2) {
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer1').children[_this.player1.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer1').children[_this.player1.length].setScale(e.target.scale / 2);
                            }
                            _this.player1.push(_this.answer[i]);
                            _this.touchNode.active = false;
                        }
                        else {
                            if (_this.types == 1) {
                                AudioManager_1.AudioManager.getInstance().playSound('这好像不是动物哦~', false);
                            }
                            _this.touchNode.active = false;
                            e.target.opacity = 255;
                        }
                        _this.touchTarget = null;
                        _this.eventvalue.levelData[_this.checkpoint - 1].answer[0] = _this.answerArr[0];
                        _this.eventvalue.levelData[_this.checkpoint - 1].subject[0] = _this.player1;
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
                        _this.eventvalue.result = 2;
                        rightNum++;
                    }
                }
                if (_this.AnswerBoardArr[1]) {
                    if (_this.AnswerBoardArr[1].getChildByName('bigTag').getBoundingBox().contains(_this.AnswerBoardArr[1].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if (_this.answerArr[1].indexOf(_this.answer[i]) != -1) {
                            _this.AnswerBoardArr[1].getChildByName('answerNode').children[_this.player2.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            _this.AnswerBoardArr[1].getChildByName('answerNode').children[_this.player2.length].setScale(e.target.scale);
                            if (_this.types == 2) {
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer2').children[_this.player2.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer2').children[_this.player2.length].setScale(e.target.scale / 2);
                            }
                            _this.player2.push(_this.answer[i]);
                            _this.touchNode.active = false;
                        }
                        else {
                            if (_this.types == 1) {
                                AudioManager_1.AudioManager.getInstance().playSound('这好像不是食物哦~', false);
                            }
                            _this.touchNode.active = false;
                            e.target.opacity = 255;
                        }
                        _this.touchTarget = null;
                        _this.eventvalue.levelData[_this.checkpoint - 1].answer[1] = _this.answerArr[1];
                        _this.eventvalue.levelData[_this.checkpoint - 1].subject[1] = _this.player2;
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
                        _this.eventvalue.result = 2;
                        rightNum++;
                    }
                }
                if (_this.AnswerBoardArr[2]) {
                    if (_this.AnswerBoardArr[2].getChildByName('bigTag').getBoundingBox().contains(_this.AnswerBoardArr[2].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if (_this.answerArr[2].indexOf(_this.answer[i]) != -1) {
                            _this.AnswerBoardArr[2].getChildByName('answerNode').children[_this.player3.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            _this.AnswerBoardArr[2].getChildByName('answerNode').children[_this.player3.length].setScale(e.target.scale);
                            if (_this.types == 2) {
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer3').children[_this.player3.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer3').children[_this.player3.length].setScale(e.target.scale / 2);
                            }
                            _this.player3.push(_this.answer[i]);
                            _this.touchNode.active = false;
                        }
                        else {
                            if (_this.types == 1) {
                                AudioManager_1.AudioManager.getInstance().playSound('这好像不是文具哦~', false);
                            }
                            _this.touchNode.active = false;
                            e.target.opacity = 255;
                        }
                        _this.touchTarget = null;
                        _this.eventvalue.levelData[_this.checkpoint - 1].answer[2] = _this.answerArr[2];
                        _this.eventvalue.levelData[_this.checkpoint - 1].subject[2] = _this.player3;
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
                        _this.eventvalue.result = 2;
                        rightNum++;
                    }
                }
                if (_this.AnswerBoardArr[3]) {
                    if (_this.AnswerBoardArr[3].getChildByName('bigTag').getBoundingBox().contains(_this.AnswerBoardArr[3].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if (_this.answerArr[3].indexOf(_this.answer[i]) != -1) {
                            _this.AnswerBoardArr[3].getChildByName('answerNode').children[_this.player4.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            _this.AnswerBoardArr[3].getChildByName('answerNode').children[_this.player4.length].setScale(e.target.scale);
                            if (_this.types == 2) {
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer3').children[_this.player3.length].getComponent(cc.Sprite).spriteFrame = _this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                _this.selectNode.children[_this.selectType - 1].getChildByName('bubble').getChildByName('answer3').children[_this.player3.length].setScale(e.target.scale / 2);
                            }
                            _this.player4.push(_this.answer[i]);
                            _this.touchNode.active = false;
                        }
                        else {
                            if (_this.types == 1) {
                                AudioManager_1.AudioManager.getInstance().playSound('这好像不是衣服哦~', false);
                            }
                            _this.touchNode.active = false;
                            e.target.opacity = 255;
                        }
                        _this.touchTarget = null;
                        _this.eventvalue.levelData[_this.checkpoint - 1].answer[3] = _this.answerArr[3];
                        _this.eventvalue.levelData[_this.checkpoint - 1].subject[3] = _this.player4;
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
                        _this.eventvalue.result = 2;
                        rightNum++;
                    }
                }
                if (rightNum == 0) {
                    _this.touchNode.active = false;
                    e.target.opacity = 255;
                    _this.touchTarget = null;
                }
                if (_this.isSuccess()) {
                    var finishNum = 0;
                    if (_this.types == 1) {
                        _this.finishArr[_this.checkpoint - 1] = true;
                    }
                    else if (_this.types == 2) {
                        _this.finishArr[_this.selectType - 1] = true;
                    }
                    for (var i_4 = 0; i_4 < _this.finishArr.length; i_4++) {
                        if (_this.finishArr[i_4]) {
                            finishNum++;
                        }
                    }
                    if (finishNum == _this.finishArr.length) {
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 1;
                        _this.eventvalue.result = 1;
                        _this.isOver = 1;
                        _this.success();
                    }
                    else {
                        _this.eventvalue.levelData[_this.checkpoint - 1].result = 1;
                        _this.nextCheckPoint();
                    }
                }
                for (var k = 0; k < _this.AnswerBoardArr.length; k++) {
                    _this.AnswerBoardArr[k].getChildByName('box').active = false;
                }
            });
        };
        var this_6 = this;
        for (var i = 0; i < this.ItemNodeArr.length; i++) {
            _loop_7(i);
        }
    };
    GamePanel.prototype.nextCheckPoint = function () {
        var _this = this;
        if (this.types == 1) {
            AudioManager_1.AudioManager.getInstance().playSound('答对啦！你真棒~', false);
            UIHelp_1.UIHelp.showOverTip(1, '答对啦！你真棒～', '下一关', function () { }, function () {
                _this.checkpoint++;
                for (var i = 0; i < _this.ItemNodeArr.length; i++) {
                    _this.ItemNodeArr[i].removeFromParent();
                    _this.ItemNodeArr[i].destroy();
                }
                _this.ItemNodeArr = [];
                for (var i = 0; i < _this.AnswerBoardArr.length; i++) {
                    _this.AnswerBoardArr[i].removeFromParent();
                    _this.AnswerBoardArr[i].destroy();
                }
                _this.AnswerBoardArr = [];
                _this.player1 = [];
                _this.player2 = [];
                _this.player3 = [];
                _this.player4 = [];
                _this.answer1 = [];
                _this.answer2 = [];
                _this.answer3 = [];
                _this.answer4 = [];
                _this.answerArr = [];
                _this.initAnswerArr(_this.checkpoint);
                UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
            });
        }
        else if (this.types == 2) {
            AudioManager_1.AudioManager.getInstance().playSound('做对啦！你真棒！试试其他办法吧~', false);
            UIHelp_1.UIHelp.showOverTip(1, '做对啦！你真棒！试试其他办法吧～', '试试其他办法', function () { }, function () {
                _this.backButtonCallBack();
                UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
            });
        }
    };
    GamePanel.prototype.success = function () {
        var _this = this;
        DaAnData_1.DaAnData.getInstance().submitEnable = true;
        DataReporting_1.default.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        if (this.types == 1) {
            AudioManager_1.AudioManager.getInstance().playSound('闯关成功，你真棒~', false);
            this.progressBar(this.checkpointsNum, this.checkpointsNum);
            UIHelp_1.UIHelp.showOverTip(2, '闯关成功，你真棒～', '重玩一次', function () { }, function () {
                _this.checkpoint = 1;
                for (var i = 0; i < _this.ItemNodeArr.length; i++) {
                    _this.ItemNodeArr[i].removeFromParent();
                    _this.ItemNodeArr[i].destroy();
                }
                _this.ItemNodeArr = [];
                for (var i = 0; i < _this.AnswerBoardArr.length; i++) {
                    _this.AnswerBoardArr[i].removeFromParent();
                    _this.AnswerBoardArr[i].destroy();
                }
                _this.AnswerBoardArr = [];
                _this.player1 = [];
                _this.player2 = [];
                _this.player3 = [];
                _this.player4 = [];
                _this.answer1 = [];
                _this.answer2 = [];
                _this.answer3 = [];
                _this.answer4 = [];
                _this.answerArr = [];
                _this.finishArr = [];
                _this.setPanel();
                UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
            });
        }
        else if (this.types == 2) {
            AudioManager_1.AudioManager.getInstance().playSound('闯关成功，你真棒~', false);
            UIHelp_1.UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧', '查看分类结果', function () { }, function () {
                _this.backButtonCallBack();
                UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
            });
        }
    };
    GamePanel.prototype.getSelectAnimationName = function (id, finish, click) {
        var name;
        if (click) {
            if (finish) {
                if (id == 0) {
                    name = 'luoqi_daan_dianji';
                }
                else if (id == 1) {
                    name = 'paipai_daan_dianji';
                }
                else if (id == 2) {
                    name = 'miya_daan_dianji';
                }
            }
            else {
                if (id == 0) {
                    name = 'luoqi_dianji';
                }
                else if (id == 1) {
                    name = 'paipai_dianji';
                }
                else if (id == 2) {
                    name = 'miya_dianji';
                }
            }
        }
        else {
            if (finish) {
                if (id == 0) {
                    name = 'luoqi_daan_idle';
                }
                else if (id == 1) {
                    name = 'paipai_daan_idle';
                }
                else if (id == 2) {
                    name = 'miya_daan_idle';
                }
            }
            else {
                if (id == 0) {
                    name = 'luoqi_idle';
                }
                else if (id == 1) {
                    name = 'paipai_idle';
                }
                else if (id == 2) {
                    name = 'miya_idle';
                }
            }
        }
        return name;
    };
    GamePanel.prototype.addListenerOnSelect = function () {
        var _this = this;
        if (this.selectNode) {
            var _loop_8 = function (i) {
                this_7.selectNode.children[i].on(cc.Node.EventType.TOUCH_START, function (e) {
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, _this.finishArr[i], true), false);
                    _this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == _this.getSelectAnimationName(i, _this.finishArr[i], true)) {
                            _this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, _this.getSelectAnimationName(i, _this.finishArr[i], false), true);
                        }
                    });
                });
                this_7.selectNode.children[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                });
                this_7.selectNode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
                });
            };
            var this_7 = this;
            for (var i = 0; i < this.selectNode.children.length; i++) {
                _loop_8(i);
            }
        }
    };
    GamePanel.prototype.createAnswerBoard = function (checkpoint) {
        var typeSet = new Set_1.default();
        typeSet.clear();
        if (this.types == 1) {
            for (var j = 20 * (checkpoint - 1); j < 20 * checkpoint; j++) {
                if (this.typeDataArr[j]) {
                    var index = j - 20 * (checkpoint - 1);
                    typeSet.add(Math.floor(index / 5));
                }
            }
            for (var i = 0; i < typeSet.size(); i++) {
                var node = cc.instantiate(this.smallNode);
                this.AnswerBoardArr.push(node);
            }
            this.typeArr = typeSet.toArray().slice();
            for (var i = 0; i < this.typeArr.length; i++) {
                if (this.typeArr[i] == 0) {
                    this.setTag(this.AnswerBoardArr[i], 'animal');
                }
                else if (this.typeArr[i] == 1) {
                    this.setTag(this.AnswerBoardArr[i], 'food');
                }
                else if (this.typeArr[i] == 2) {
                    this.setTag(this.AnswerBoardArr[i], 'stationery');
                }
                else if (this.typeArr[i] == 3) {
                    this.setTag(this.AnswerBoardArr[i], 'clothe');
                }
            }
            for (var i = 0; i < this.answer.length; i++) {
                if (this.answer[i] < (this.checkpoint - 1) * 20 + 5) {
                    this.answer1.push(this.answer[i]);
                }
                else if (this.answer[i] >= (this.checkpoint - 1) * 20 + 5 && this.answer[i] < (this.checkpoint - 1) * 20 + 10) {
                    this.answer2.push(this.answer[i]);
                }
                else if (this.answer[i] >= (this.checkpoint - 1) * 20 + 10 && this.answer[i] < (this.checkpoint - 1) * 20 + 15) {
                    this.answer3.push(this.answer[i]);
                }
                else if (this.answer[i] >= (this.checkpoint - 1) * 20 + 15 && this.answer[i] < (this.checkpoint - 1) * 20 + 20) {
                    this.answer4.push(this.answer[i]);
                }
            }
            if (this.answer1.length) {
                this.answerArr.push(this.answer1);
            }
            if (this.answer2.length) {
                this.answerArr.push(this.answer2);
            }
            if (this.answer3.length) {
                this.answerArr.push(this.answer3);
            }
            if (this.answer4.length) {
                this.answerArr.push(this.answer4);
            }
        }
        else if (this.types == 2) {
            if (this.selectType) {
                switch (this.selectType) {
                    case 1: {
                        this.checkColor(this.checkpoint);
                        if (this.answer1.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'blue');
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer2.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'red');
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer3.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'yellow');
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    case 2: {
                        this.checkFigure(this.checkpoint);
                        if (this.answer1.length) {
                            var node = cc.instantiate(this.bigNode);
                            if (this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieSquare');
                            }
                            else if (this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureSquare');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer2.length) {
                            var node = cc.instantiate(this.bigNode);
                            if (this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieTriangle');
                            }
                            else if (this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureTriangle');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer3.length) {
                            var node = cc.instantiate(this.bigNode);
                            if (this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieCircle');
                            }
                            else if (this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureCircle');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    case 3: {
                        this.checkSize(this.checkpoint);
                        if (this.answer1.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 1);
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer2.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.8);
                            this.AnswerBoardArr.push(node);
                        }
                        if (this.answer3.length) {
                            var node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.6);
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
            if (this.answer1.length) {
                this.answerArr.push(this.answer1);
            }
            if (this.answer2.length) {
                this.answerArr.push(this.answer2);
            }
            if (this.answer3.length) {
                this.answerArr.push(this.answer3);
            }
            this.backButton.node.active = true;
        }
        this.postAnswerBoard();
        this.addListenerOnItem();
    };
    GamePanel.prototype.checkColor = function (checkpoint) {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        var typeNum = 0;
        for (var i = 0; i < this.answer.length; i++) {
            if (this.answer[i] < (checkpoint - 1) * 27 + 9) {
                this.answer1.push(this.answer[i]);
            }
            else if (this.answer[i] < (checkpoint - 1) * 27 + 18 && this.answer[i] >= (checkpoint - 1) * 27 + 9) {
                this.answer2.push(this.answer[i]);
            }
            else if (this.answer[i] < (checkpoint - 1) * 27 + 27 && this.answer[i] >= (checkpoint - 1) * 27 + 18) {
                this.answer3.push(this.answer[i]);
            }
        }
        if (this.answer1.length) {
            typeNum++;
        }
        if (this.answer2.length) {
            typeNum++;
        }
        if (this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    };
    GamePanel.prototype.checkFigure = function (checkpoint) {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        var standard1 = [0, 1, 2, 9, 10, 11, 18, 19, 20];
        var standard2 = [3, 4, 5, 12, 13, 14, 21, 22, 23];
        var standard3 = [6, 7, 8, 15, 16, 17, 24, 25, 26];
        var typeNum = 0;
        for (var i = 0; i < this.answer.length; i++) {
            var index = this.answer[i] - (checkpoint - 1) * 27;
            if (standard1.indexOf(index) != -1) {
                this.answer1.push(this.answer[i]);
            }
            else if (standard2.indexOf(index) != -1) {
                this.answer2.push(this.answer[i]);
            }
            else if (standard3.indexOf(index) != -1) {
                this.answer3.push(this.answer[i]);
            }
        }
        if (this.answer1.length) {
            typeNum++;
        }
        if (this.answer2.length) {
            typeNum++;
        }
        if (this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    };
    GamePanel.prototype.checkSize = function (checkpoint) {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        var typeNum = 0;
        for (var i = 0; i < this.answer.length; i++) {
            if (this.answer[i] % 3 == 0) {
                this.answer1.push(this.answer[i]);
            }
            else if (this.answer[i] % 3 == 1) {
                this.answer2.push(this.answer[i]);
            }
            else if (this.answer[i] % 3 == 2) {
                this.answer3.push(this.answer[i]);
            }
        }
        if (this.answer1.length) {
            typeNum++;
        }
        if (this.answer2.length) {
            typeNum++;
        }
        if (this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    };
    GamePanel.prototype.createItem = function (checkpoint) {
        if (this.types == 1) {
            for (var j = 20 * (checkpoint - 1); j < 20 * checkpoint; j++) {
                if (this.typeDataArr[j]) {
                    var node = new cc.Node();
                    var sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = this.sourceSFArr[j % 20];
                    this.ItemNodeArr.push(node);
                }
            }
        }
        else if (this.types == 2) {
            for (var i = 27 * (checkpoint - 1); i < 27 * checkpoint; i++) {
                if (this.typeDataArr[i]) {
                    var node = new cc.Node();
                    var sprite = node.addComponent(cc.Sprite);
                    var index = i % 27 + 1;
                    sprite.spriteFrame = this.sourceSFArr[Math.ceil(index / 3) - 1];
                    var size = index % 3;
                    if (size == 2) {
                        node.scale = 0.8;
                    }
                    else if (size == 0) {
                        node.scale = 0.6;
                    }
                    this.ItemNodeArr.push(node);
                }
            }
        }
    };
    GamePanel.prototype.postAnswerBoard = function () {
        var _this = this;
        var num = this.AnswerBoardArr.length;
        var Y = -91;
        var space = 450 + 100 * (4 - num);
        var startX = -(num - 1) * space / 2 + 80;
        if (this.types == 2) {
            space = 610;
            startX = -(num - 1) * space / 2 + 140;
        }
        AudioManager_1.AudioManager.getInstance().playSound('sfx_casemove', false);
        var _loop_9 = function (i) {
            cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this_8.AnswerBoardArr[i]);
            this_8.AnswerBoardArr[i].setPosition(cc.v2(startX + i * space - 2000, Y));
            setTimeout(function () {
                _this.AnswerBoardArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
            }, 100 * (num - 1 - i));
        };
        var this_8 = this;
        for (var i = 0; i < num; i++) {
            _loop_9(i);
        }
    };
    GamePanel.prototype.postItem = function () {
        var _this = this;
        var num = this.ItemNodeArr.length;
        var upNum = Math.ceil(num / 2);
        var downNum = Math.floor(num / 2);
        var upY = 360;
        var downY = 210;
        var space = 210;
        var upStartX = -(upNum - 1) * space / 2 - 50;
        var downStartX = -(downNum - 1) * space / 2 - 50;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_ciopn', false, 1, null, function () {
            AudioManager_1.AudioManager.getInstance().playSound('把这些物品分类整理，并拖到对应区域内。', false);
        });
        if (upNum == downNum) {
            var _loop_10 = function (i) {
                this_9.ItemNodeArr[i].opacity = 0;
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this_9.ItemNodeArr[i]);
                if (i < upNum) {
                    this_9.ItemNodeArr[i].setPosition(cc.v2(upStartX + i * space, upY));
                }
                else {
                    this_9.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum) * space, downY));
                }
                setTimeout(function () {
                    _this.ItemNodeArr[i].runAction(cc.sequence(cc.spawn(cc.moveBy(0.8, cc.v2(50, 0)), cc.fadeIn(0.8)), cc.callFunc(function () {
                        if (i == num - 1) {
                            if (_this.types == 1) {
                                _this.createAnswerBoard(_this.checkpoint);
                            }
                            else if (_this.types == 2) {
                                _this.createSelectBoard();
                            }
                        }
                    })));
                }, 50 * i);
            };
            var this_9 = this;
            for (var i = 0; i < num; i++) {
                _loop_10(i);
            }
        }
        else {
            var _loop_11 = function (i) {
                this_10.ItemNodeArr[i].opacity = 0;
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this_10.ItemNodeArr[i]);
                if (i < upNum) {
                    this_10.ItemNodeArr[i].setPosition(cc.v2(upStartX + i * space, upY));
                }
                else {
                    this_10.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum) * space, downY));
                }
                setTimeout(function () {
                    _this.ItemNodeArr[i].runAction(cc.sequence(cc.spawn(cc.moveBy(0.8, cc.v2(50, 0)), cc.fadeIn(0.8)), cc.callFunc(function () {
                        if (i == num - 1) {
                            if (_this.types == 1) {
                                _this.createAnswerBoard(_this.checkpoint);
                            }
                            else if (_this.types == 2) {
                                _this.createSelectBoard();
                            }
                        }
                    })));
                }, 50 * i);
            };
            var this_10 = this;
            for (var i = 0; i < num; i++) {
                _loop_11(i);
            }
        }
    };
    GamePanel.prototype.progressBar = function (index, totalNum) {
        if (this.types == 1) {
            if (totalNum == 2) {
                this.progressNode.getChildByName('progress2').active = true;
                this.progress = this.progressNode.getChildByName('progress2');
            }
            else if (totalNum == 3) {
                this.progressNode.getChildByName('progress3').active = true;
                this.progress = this.progressNode.getChildByName('progress3');
            }
            else if (totalNum == 4) {
                this.progressNode.getChildByName('progress4').active = true;
                this.progress = this.progressNode.getChildByName('progress4');
            }
            else if (totalNum == 5) {
                this.progressNode.getChildByName('progress5').active = true;
                this.progress = this.progressNode.getChildByName('progress5');
            }
            this.progressNode.active = true;
            for (var i = 0; i < totalNum; i++) {
                this.progress.children[i].getChildByName('bar1').zIndex = 1;
                this.progress.children[i].getChildByName('bar2').zIndex = 2;
                this.progress.children[i].getChildByName('bar3').zIndex = 3;
                if (i > index - 1) {
                }
                else if (i < index - 1) {
                    this.progress.children[i].getChildByName('bar1').zIndex = 3;
                    this.progress.children[i].getChildByName('bar2').zIndex = 2;
                    this.progress.children[i].getChildByName('bar3').zIndex = 1;
                }
                else if (i == index - 1) {
                    this.progress.children[i].getChildByName('bar1').zIndex = 1;
                    this.progress.children[i].getChildByName('bar2').zIndex = 3;
                    this.progress.children[i].getChildByName('bar3').zIndex = 2;
                }
            }
        }
        else if (this.types == 2) {
            this.progressNode.active = false;
        }
    };
    GamePanel.prototype.isSuccess = function () {
        for (var i = 0; i < 4; i++) {
            if (!this.answerArr[i]) {
                this.answerArr.push([]);
            }
        }
        this.answerArr[0].sort();
        this.answerArr[1].sort();
        this.answerArr[2].sort();
        this.answerArr[3].sort();
        this.player1.sort();
        this.player2.sort();
        this.player3.sort();
        this.player4.sort();
        var result1 = this.isEqual(this.answerArr[0], this.player1);
        var result2 = this.isEqual(this.answerArr[1], this.player2);
        var result3 = this.isEqual(this.answerArr[2], this.player3);
        var result4 = this.isEqual(this.answerArr[3], this.player4);
        if (result1 && result2 && result3 && result4) {
            return true;
        }
        else {
            return false;
        }
    };
    GamePanel.prototype.isEqual = function (answer, player) {
        var answerLen = answer.length;
        var equalNum = 0;
        for (var i = 0; i < answer.length; i++) {
            if (player.indexOf(answer[i]) != -1) {
                equalNum++;
            }
        }
        if (equalNum == answerLen) {
            return true;
        }
        else {
            return false;
        }
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
                    if (content.types) {
                        this.types = content.types;
                    }
                    else {
                        console.log('getNet中返回的types的值为空');
                    }
                    if (content.typetype) {
                        this.typetype = content.typetype;
                    }
                    else {
                        console.log('getNet中返回的typetype的值为空');
                    }
                    if (content.checkpointsNum) {
                        this.checkpointsNum = content.checkpointsNum;
                    }
                    else {
                        console.log('getNet中返回的checkpointsNum的值为空');
                    }
                    if (content.typeDataArr) {
                        this.typeDataArr = content.typeDataArr;
                    }
                    else {
                        console.log('getNet中返回的typeDataArr的值为空');
                    }
                    this.loadSourceSFArr();
                }
            }
            else {
                //this.setPanel();
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bg", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "progressNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "bigNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "smallNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "selectPrefab", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "backButton", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "touchNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "loudSpeaker", void 0);
    __decorate([
        property(cc.Layout)
    ], GamePanel.prototype, "loudspeakerBox", void 0);
    GamePanel = __decorate([
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
        