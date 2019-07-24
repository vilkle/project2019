(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/GamePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel', __filename);
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var NetWork_1 = require("../../Http/NetWork");
var DataReporting_1 = require("../../Data/DataReporting");
var AudioManager_1 = require("../../Manager/AudioManager");
var UIHelp_1 = require("../../Utils/UIHelp");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Fish1 = null;
        _this.Fish2 = null;
        _this.questionLabel = null;
        _this.ALabel = null;
        _this.BLabel = null;
        _this.CLabel = null;
        _this.DLabel = null;
        _this.ASprite = null;
        _this.BSprite = null;
        _this.CSprite = null;
        _this.DSprite = null;
        _this.yellowFrame = null;
        _this.blueFrame = null;
        _this.redFrame = null;
        _this.yellowDotFrame = null;
        _this.greenDotFrame = null;
        _this.redDotFrame = null;
        _this.triangleNode = null;
        _this.bottomNode = null;
        _this.questionNode = null;
        _this.bg = null;
        _this.u_boat = null;
        _this.answerNodeArr = [];
        _this.checkpoint = 1;
        _this.questionIndex = 0;
        _this.answerIndex = 0;
        _this.isOver = 2;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 1,
            levelData: [],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.start = function () {
        var _this = this;
        this.bg.on(cc.Node.EventType.TOUCH_START, function () {
            _this.isOver = 2;
        });
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.answerNodeArr.push(this.ASprite.node);
        this.answerNodeArr.push(this.BSprite.node);
        this.answerNodeArr.push(this.CSprite.node);
        this.answerNodeArr.push(this.DSprite.node);
        this.stockOfFish();
        AudioManager_1.AudioManager.getInstance().playSound('bgm_underwater', true);
        this.initGame();
    };
    GamePanel.prototype.initGame = function () {
        this.eventvalue.levelData.push({
            subject: [],
            answer: null,
            result: null
        });
        this.u_boat.runAction(cc.moveTo(1, cc.v2(764, -236)));
        this.triangleNode.runAction(cc.fadeIn(0.5));
        this.bottomNode.runAction(cc.fadeIn(0.5));
        this.question1();
    };
    GamePanel.prototype.startAction = function () {
        var _this = this;
        this.questionNode.opacity = 255;
        var callback = cc.callFunc(function () {
            _this.ASprite.node.runAction(cc.fadeIn(0.3));
            _this.BSprite.node.runAction(cc.fadeIn(0.3));
            _this.CSprite.node.runAction(cc.fadeIn(0.3));
            _this.DSprite.node.runAction(cc.fadeIn(0.3));
            _this.touchEnable(true);
        });
        var seq = cc.sequence(cc.scaleTo(0.5, 1, 1).easing(cc.easeSineOut()), callback);
        this.questionNode.runAction(seq);
    };
    GamePanel.prototype.finishAction = function (func) {
        var _this = this;
        var callback = cc.callFunc(function () {
            _this.ASprite.node.opacity = 0;
            _this.BSprite.node.opacity = 0;
            _this.CSprite.node.opacity = 0;
            _this.DSprite.node.opacity = 0;
            _this.questionNode.scaleY = 0;
            func();
        });
        var seq = cc.sequence(cc.fadeOut(0.5), callback);
        this.questionNode.runAction(seq);
    };
    GamePanel.prototype.touchEnable = function (enable) {
        var _this = this;
        if (enable) {
            var _loop_1 = function (i) {
                this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_START, function () {
                    _this.answerNodeArr[i].setScale(0.95);
                    _this.answerIndex = i + 1;
                    _this.isOver = 2;
                });
                this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_END, function () {
                    _this.answerNodeArr[i].setScale(1);
                    _this.eventvalue.levelData[_this.checkpoint - 1].answer = _this.answerIndex;
                    _this.isRight(_this.questionIndex);
                });
                this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, function () {
                    _this.answerNodeArr[i].setScale(1);
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.answerNodeArr.length; i++) {
                _loop_1(i);
            }
        }
        else {
            for (var i = 0; i < this.answerNodeArr.length; i++) {
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_START);
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_END);
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_CANCEL);
            }
        }
    };
    GamePanel.prototype.stockOfFish = function () {
        var _this = this;
        var _loop_2 = function (i) {
            setTimeout(function () {
                _this.Fish1.children[i].getComponent(sp.Skeleton).setAnimation(0, 'fish_swim_01', true);
            }, 300 * i);
        };
        for (var i = 0; i < this.Fish1.children.length; i++) {
            _loop_2(i);
        }
        var _loop_3 = function (i) {
            setTimeout(function () {
                _this.Fish2.children[i].getComponent(sp.Skeleton).setAnimation(0, 'fish_swim_02', true);
            }, 300 * i);
        };
        for (var i = 0; i < this.Fish2.children.length; i++) {
            _loop_3(i);
        }
    };
    GamePanel.prototype.question1 = function () {
        this.checkpoint = 1;
        this.questionIndex = 1;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数字组成了什么图形？';
        this.ALabel.string = '三角形';
        this.BLabel.string = '圆形';
        this.CLabel.string = '平行四边形';
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question2 = function () {
        this.questionIndex = 2;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这个三角形有多大？';
        this.ALabel.string = '大约7cm';
        this.BLabel.string = '无限大';
        this.CLabel.string = '依屏幕大小而定';
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question3 = function () {
        this.questionIndex = 3;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数是有规律的，你最愿意怎样观察呢？';
        this.ALabel.string = '横着看';
        this.BLabel.string = '斜着看';
        this.CLabel.string = '竖着看';
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question4_1 = function () {
        this.questionIndex = 4;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.questionLabel.string = '仔细观察你发现了什么？';
        this.ALabel.string = '每一行左右两侧数字对称';
        this.BLabel.string = '每一行左右两侧数字不对称';
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question4_2 = function () {
        this.questionIndex = 5;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.DSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，以下哪项不是图中的规律？';
        this.ALabel.string = '左右两侧最外层都是1';
        this.BLabel.string = '第2行起，每一行第2个数从上到下可以组成一个等差数组';
        this.CLabel.string = '第2行起，每一行第2个数从上到下可以组成一个等差数组';
        this.DLabel.string = '第5行第2个数是4，则第20行第2个数是19';
        this.ALabel.fontSize = 30;
        this.BLabel.fontSize = 30;
        this.CLabel.fontSize = 30;
        this.DLabel.fontSize = 30;
        this.ALabel.lineHeight = 40;
        this.BLabel.lineHeight = 40;
        this.CLabel.lineHeight = 40;
        this.DLabel.lineHeight = 40;
        this.ASprite.node.height = 100;
        this.BSprite.node.height = 100;
        this.CSprite.node.height = 100;
        this.DSprite.node.height = 100;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question4_3 = function () {
        this.questionIndex = 6;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，发现了什么？';
        this.ALabel.string = '每个数等于肩上两个数的和';
        this.BLabel.string = '每个数等于上一行数的和';
        this.CLabel.string = '奇数行中间的数可组成等差数串';
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.question5_1 = function () {
        this.questionIndex = 7;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察有什么规律呢？';
        this.ALabel.string = '第n行有n个数';
        this.BLabel.string = '第n行有n+1个数';
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    };
    GamePanel.prototype.right1 = function () {
        var _this = this;
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: [],
            answer: null,
            result: null
        });
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                if (j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                }
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.greenDotFrame;
            }
        }
        setTimeout(function () {
            _this.ASprite.spriteFrame = _this.blueFrame;
            _this.finishAction(_this.question2.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.wrong1 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if (this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.redFrame;
        }
        else if (this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.redFrame;
        }
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                if (j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.redDotFrame;
            }
        }
        setTimeout(function () {
            if (_this.answerIndex == 2) {
                _this.BSprite.spriteFrame = _this.blueFrame;
            }
            else if (_this.answerIndex == 3) {
                _this.CSprite.spriteFrame = _this.blueFrame;
            }
            _this.finishAction(_this.question1.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.right2 = function () {
        var _this = this;
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: [],
            answer: null,
            result: null
        });
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.yellowFrame;
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.greenDotFrame;
            }
        }
        setTimeout(function () {
            _this.BSprite.spriteFrame = _this.blueFrame;
            _this.finishAction(_this.question3.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.wrong2 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if (this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.redFrame;
        }
        else if (this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.redFrame;
        }
        for (var i = 0; i < this.bottomNode.children.length; i++) {
            for (var j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.redDotFrame;
            }
        }
        setTimeout(function () {
            if (_this.answerIndex == 1) {
                _this.ASprite.spriteFrame = _this.blueFrame;
            }
            else if (_this.answerIndex == 3) {
                _this.CSprite.spriteFrame = _this.blueFrame;
            }
            _this.finishAction(_this.question2.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.right3 = function () {
        var _this = this;
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: [],
            answer: null,
            result: null
        });
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        if (this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.yellowFrame;
            for (var i = 0; i < this.triangleNode.children.length; i++) {
                if (i == 4) {
                    for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                    }
                }
            }
        }
        else if (this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.yellowFrame;
            for (var i = 0; i < this.triangleNode.children.length; i++) {
                for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if (j == 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                    }
                }
            }
        }
        else if (this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.yellowFrame;
            this.triangleNode.children[2].children[0].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[2].children[1].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[3].children[1].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[5].children[3].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[5].children[4].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[6].children[4].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
        }
        setTimeout(function () {
            if (_this.answerIndex == 1) {
                _this.ASprite.spriteFrame = _this.blueFrame;
                _this.finishAction(_this.question4_1.bind(_this));
            }
            else if (_this.answerIndex == 2) {
                _this.BSprite.spriteFrame = _this.blueFrame;
                _this.finishAction(_this.question4_2.bind(_this));
            }
            else if (_this.answerIndex == 3) {
                _this.CSprite.spriteFrame = _this.blueFrame;
                _this.finishAction(_this.question4_3.bind(_this));
            }
        }, 2000);
    };
    GamePanel.prototype.right4_1 = function () {
        var _this = this;
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: [],
            answer: null,
            result: null
        });
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(function () {
            _this.ASprite.spriteFrame = _this.blueFrame;
            _this.finishAction(_this.question5_1.bind(_this));
        }, 1000);
    };
    GamePanel.prototype.wrong4_1 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.redFrame;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            if (i == 4) {
                for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        setTimeout(function () {
            _this.BSprite.spriteFrame = _this.blueFrame;
            _this.finishAction(_this.question4_1.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.right4_2 = function () {
        var _this = this;
        this.checkpoint++;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.CSprite.spriteFrame = this.yellowFrame;
        setTimeout(function () {
            _this.success();
        }, 2000);
    };
    GamePanel.prototype.wrong4_2 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if (this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.redFrame;
        }
        else if (this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.redFrame;
        }
        else if (this.answerIndex == 4) {
            this.DSprite.spriteFrame = this.redFrame;
        }
        if (this.answerIndex == 1) {
            for (var i = 0; i < this.triangleNode.children.length; i++) {
                for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if (j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                    }
                }
            }
        }
        else if (this.answerIndex == 2 || this.answerIndex == 4) {
            for (var i = 0; i < this.triangleNode.children.length; i++) {
                for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if (j == 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                    }
                }
            }
        }
        setTimeout(function () {
            if (_this.answerIndex == 1) {
                _this.ASprite.spriteFrame = _this.blueFrame;
            }
            else if (_this.answerIndex == 2) {
                _this.BSprite.spriteFrame = _this.blueFrame;
            }
            else if (_this.answerIndex == 4) {
                _this.DSprite.spriteFrame = _this.blueFrame;
            }
            _this.finishAction(_this.question4_2.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.right4_3 = function () {
        var _this = this;
        this.checkpoint++;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(function () {
            _this.success();
        }, 2000);
    };
    GamePanel.prototype.wrong4_3 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if (this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.yellowFrame;
        }
        else if (this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.yellowFrame;
        }
        this.triangleNode.children[2].children[0].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[2].children[1].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[3].children[1].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[5].children[3].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[5].children[4].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[6].children[4].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        setTimeout(function () {
            if (_this.answerIndex == 2) {
                _this.BSprite.spriteFrame = _this.blueFrame;
            }
            else if (_this.answerIndex == 3) {
                _this.CSprite.spriteFrame = _this.blueFrame;
            }
            _this.finishAction(_this.question4_3.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.right5_1 = function () {
        var _this = this;
        this.checkpoint++;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(function () {
            _this.success();
        }, 2000);
    };
    GamePanel.prototype.wrong5_1 = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.yellowFrame;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            if (i == 4) {
                for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        setTimeout(function () {
            _this.BSprite.spriteFrame = _this.blueFrame;
            _this.finishAction(_this.question5_1.bind(_this));
        }, 2000);
    };
    GamePanel.prototype.success = function () {
        this.eventvalue.result = 1;
        DataReporting_1.default.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        AudioManager_1.AudioManager.getInstance().stopAll();
        UIHelp_1.UIHelp.showOverTip(2, '闯关成功，你真棒～');
    };
    GamePanel.prototype.isRight = function (questionIndex) {
        if (questionIndex == 1) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 1;
            this.eventvalue.result = 2;
            if (this.answerIndex == 1) {
                this.right1();
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
            }
            else {
                this.wrong1();
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            }
        }
        else if (questionIndex == 2) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 2;
            if (this.answerIndex == 2) {
                this.right2();
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
            }
            else {
                this.wrong2();
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            }
        }
        else if (questionIndex == 3) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = [1, 2, 3];
            this.eventvalue.levelData[this.checkpoint - 1].result = 1;
            this.right3();
        }
        else if (questionIndex == 4) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 1;
            if (this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
                this.right4_1();
            }
            else {
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
                this.wrong4_1();
            }
        }
        else if (questionIndex == 5) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 3;
            if (this.answerIndex == 3) {
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
                this.right4_2();
            }
            else {
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
                this.wrong4_2();
            }
        }
        else if (questionIndex == 6) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 1;
            if (this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
                this.right4_3();
            }
            else {
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
                this.wrong4_3();
            }
        }
        else if (questionIndex == 7) {
            this.eventvalue.levelData[this.checkpoint - 1].subject = 1;
            if (this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint - 1].result = 1;
                this.right5_1();
            }
            else {
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
                this.wrong5_1();
            }
        }
    };
    GamePanel.prototype.onEndGame = function () {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting_1.default.isRepeatReport) {
            DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting_1.default.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.onShow = function () {
    };
    GamePanel.prototype.setPanel = function () {
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
                    this.setPanel();
                }
            }
            else {
                this.setPanel();
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "Fish1", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "Fish2", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "questionLabel", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "ALabel", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "BLabel", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "CLabel", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "DLabel", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "ASprite", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "BSprite", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "CSprite", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "DSprite", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "yellowFrame", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "blueFrame", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "redFrame", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "yellowDotFrame", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "greenDotFrame", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], GamePanel.prototype, "redDotFrame", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "triangleNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bottomNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "questionNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bg", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "u_boat", void 0);
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
        