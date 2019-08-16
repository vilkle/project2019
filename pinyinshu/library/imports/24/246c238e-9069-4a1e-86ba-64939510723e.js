"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
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
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
var AudioManager_1 = require("../../Manager/AudioManager");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var OverTips_1 = require("../../UI/Item/OverTips");
var UploadAndReturnPanel_1 = require("../panel/UploadAndReturnPanel");
var DataReporting_1 = require("../../Data/DataReporting");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queren = null;
        _this.chongzhi = null;
        _this.tijiao = null;
        _this.minutes = null;
        _this.second = null;
        _this.minuteHand = null;
        _this.secondHand = null;
        _this.numberStr = null;
        _this.bubble_none1 = null;
        _this.bubble_none2 = null;
        _this.bubble_1 = null;
        _this.bubble_2 = null;
        _this.bubble = null;
        _this.bullet = null;
        _this.gunNode = null;
        _this.miya = null;
        _this.mask = null;
        _this.numberNode = null;
        _this.signNode = null;
        _this.bg = null;
        _this.font = null;
        _this.ballNodeP = null;
        _this.decomposeArr = Array();
        _this.answerArr = Array();
        _this.labelArr = Array();
        _this.progressArr = Array();
        _this.placementBallArr = Array();
        _this.li = Array(); //质因数
        _this.an = Array(); //约数
        _this.pl = Array(); //玩家答案
        _this.updateNode = Array();
        _this.timer = null;
        _this.decoposeNum = null; //被分解的数
        _this.intervalIndex = null; //clock的interval的index值
        _this.minStr = null;
        _this.secStr = null;
        _this.checkpointsNum = null;
        _this.checkpoint = null;
        _this.cueNum = 0;
        _this.isReadyShoot = false;
        _this.isDoubleOver = true;
        _this.isSingleOver = true;
        _this.alreadyCourseware = false;
        _this.shooting = false;
        _this.multiply = false;
        _this.isOver = 0;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 1,
            levelData: [],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.onLoad = function () {
        //测试用
        // DaAnData.getInstance().checkpointsNum = 3;
        // DaAnData.getInstance().numberArr = [24, 2, 26];
        this.isTecher();
    };
    GamePanel.prototype.start = function () {
        var _this = this;
        AudioManager_1.AudioManager.getInstance().playSound('sfx_pysopn');
        this.bg.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (_this.isOver != 1) {
                _this.isOver = 2;
                _this.eventvalue.result = 2;
                _this.eventvalue.levelData[_this.checkpoint - 1].result = 2;
            }
        });
    };
    GamePanel.prototype.onDestroy = function () {
        this.closeClock();
    };
    GamePanel.prototype.update = function (dt) {
        for (var i = 0; i < this.updateNode.length; i++) {
            var scalex = this.updateNode[i].getChildByName('spine').getComponent(sp.Skeleton).findBone('bubble_11').scaleX;
            var scaley = this.updateNode[i].getChildByName('spine').getComponent(sp.Skeleton).findBone('bubble_11').scaleY;
            this.updateNode[i].getChildByName('label').setScale(cc.v2(scalex, scaley));
        }
        if (this.pl.length <= 1) {
            if (this.decoposeNum == 1) {
                if (this.tijiao.interactable == false && this.cueNum == 0) {
                    this.tijiao.interactable = true;
                }
                if (this.chongzhi.interactable == false) {
                    this.chongzhi.interactable = true;
                }
            }
            else {
                if (this.tijiao.interactable == true) {
                    this.tijiao.interactable = false;
                }
                if (this.chongzhi.interactable == true) {
                    this.chongzhi.interactable = false;
                }
            }
        }
        else {
            if (this.checkpoint >= this.checkpointsNum + 1) {
                return;
            }
            if (this.tijiao.interactable == false && this.cueNum == 0) {
                this.tijiao.interactable = true;
            }
            if (this.chongzhi.interactable == false) {
                this.chongzhi.interactable = true;
            }
        }
        if (this.cueNum > 0) {
            if (this.tijiao.interactable == true) {
                this.tijiao.interactable = false;
            }
        }
    };
    GamePanel.prototype.isTecher = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            UIManager_1.UIManager.getInstance().openUI(UploadAndReturnPanel_1.default, null, 211);
            this.initData();
        }
        else {
            this.getNet();
        }
    };
    GamePanel.prototype.initData = function () {
        this.timer = 0;
        this.checkpoint = 1;
        this.decoposeNum = DaAnData_1.DaAnData.getInstance().numberArr[this.checkpoint - 1];
        this.checkpointsNum = DaAnData_1.DaAnData.getInstance().checkpointsNum;
        this.defaultValue();
        this.initProgress(this.checkpointsNum);
        this.updateNode.push(this.bubble_1);
        this.updateNode.push(this.bubble_2);
        this.updateNode.push(this.gunNode.getChildByName('ballNode'));
        this.placementBallArr.push(this.gunNode.getChildByName('ballNode'));
        this.placementBallArr.push(this.bubble_1);
        this.placementBallArr.push(this.bubble_2);
        this.addListenerOnPlacement();
        this.mask.on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
        }.bind(this));
        this.mask.active = false;
        for (var i = 0; i < this.checkpointsNum; i++) {
            this.eventvalue.levelData.push({
                subject: null,
                answer: null,
                result: 4
            });
        }
        //开始游戏
        this.openClock();
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    };
    GamePanel.prototype.onEndGame = function () {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting_1.default.isRepeatReport && this.eventvalue.result != 1) {
            DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting_1.default.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    };
    GamePanel.prototype.initProgress = function (checkpointsNum) {
        var long = 200;
        if (this.checkpointsNum == 1) {
            return;
        }
        cc.loader.loadRes('prefab/ui/Item/progressNode', function (err, prefab) {
            if (!err) {
                for (var i = 0; i < checkpointsNum; i++) {
                    var progressNode = cc.instantiate(prefab);
                    this.progressArr[i] = progressNode;
                    var y = 350 - long * i;
                    progressNode.setPosition(cc.v2(-900, y));
                    progressNode.parent = this.node;
                    progressNode.getChildByName('ball').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    progressNode.getChildByName('bubble').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    progressNode.getChildByName('whiteball').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    if (i == checkpointsNum - 1) {
                        progressNode.getChildByName('line').active = false;
                        progressNode.getChildByName('lineup').active = false;
                    }
                }
                this.setprogress(this.checkpoint);
            }
        }.bind(this));
    };
    GamePanel.prototype.setprogress = function (checkpoints) {
        for (var i = 0; i < this.progressArr.length; i++) {
            if (i < checkpoints - 1) {
                this.progressArr[i].getChildByName('bubble').active = true;
                if (this.progressArr.length > 1) {
                    this.progressArr[i].getChildByName('lineup').active = true;
                }
            }
            else if (i == checkpoints - 1) {
                this.progressArr[i].getChildByName('bubble').active = true;
                this.progressArr[i].getChildByName('whiteball').active = true;
            }
            else {
                this.progressArr[i].getChildByName('bubble').active = false;
                this.progressArr[i].getChildByName('whiteball').active = false;
            }
        }
    };
    GamePanel.prototype.defaultValue = function () {
        var _this = this;
        this.bubble_1.opacity = 255;
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(DaAnData_1.skinStrEnum[1]);
        this.bubble_1.getChildByName('label').getComponent(cc.Label).string = '1';
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'idle', true);
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
            if (trackEntry.animation.name == 'ball_in') {
                _this.isReadyShoot = true;
                _this.shoot();
            }
        });
    };
    GamePanel.prototype.createBall = function (num, x, y, parent, isAnswer) {
        var ballNode = cc.instantiate(this.ballNodeP);
        ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
        if (num.toString().length == 3) {
            ballNode.getChildByName('label').getComponent(cc.Label).fontSize = 30;
        }
        var ball = ballNode.getChildByName('spine').getComponent(sp.Skeleton);
        ball.setAnimation(0, 'idle', true);
        ballNode.parent = parent;
        ball.setSkin(this.skinString(num));
        if (isAnswer) {
            ballNode.x = x;
            ballNode.y = y;
            ballNode.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
            this.answerArr.push(ballNode);
            this.updateNode.push(ballNode);
            this.addListenerOnAnswerBall(ballNode);
        }
        else {
            ballNode.y = 0;
            if (x != this.li.length - 1) {
                var node = new cc.Node("label");
                var labelX = node.addComponent(cc.Label);
                labelX.string = "*";
                labelX.font = this.font;
                labelX.fontSize = 50;
                labelX.node.y = 0;
                node.parent = parent;
                this.labelArr.push(node);
            }
            this.decomposeArr.push(ballNode);
            this.addListenerOnDecomposeBall(ballNode);
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
                    if (content.numberArr) {
                        DaAnData_1.DaAnData.getInstance().numberArr = content.numberArr;
                    }
                    if (content.checkpointsNum) {
                        DaAnData_1.DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                    }
                    this.initData();
                }
            }
            else {
            }
        }.bind(this), null);
    };
    GamePanel.prototype.answer = function (num) {
        for (var i = 1; i <= num; i++) {
            if (num % i == 0) {
                this.an.push(i);
            }
        }
        this.eventvalue.levelData[this.checkpoint - 1].answer = this.an;
    };
    GamePanel.prototype.decompose = function (num) {
        var num1 = num;
        var i = 1;
        while (i < num1) {
            i += 1;
            while (num1 % i == 0) {
                num1 /= i;
                this.li.push(i);
            }
        }
        if (num == 1) {
            this.li.push(1);
        }
        var str = String(num) + '  =  ';
        this.numberStr.getComponent(cc.Label).string = str;
        var repeat = 1;
        for (var i_1 = 0; i_1 < this.li.length; i_1++) {
            if (this.li[i_1] != this.li[i_1 + 1] && this.li[i_1] != this.li[i_1 - 1]) {
                repeat = 1;
                var node = new cc.Node();
                var label = node.addComponent(cc.Label);
                label.font = this.font;
                label.fontSize = 50;
                node.parent = this.numberNode;
                node.y = 10;
                this.labelArr.push(node);
                if (i_1 < this.li.length - 1) {
                    label.string = String(this.li[i_1]) + '  *  ';
                }
                else {
                    label.string = String(this.li[i_1]) + '  =  ';
                }
            }
            else {
                repeat++;
                if (this.li[i_1 + 1] != this.li[i_1 + 2] && this.li[i_1] == this.li[i_1 + 1]) {
                    var node0 = new cc.Node();
                    var label0 = node0.addComponent(cc.Label);
                    label0.font = this.font;
                    label0.fontSize = 50;
                    label0.string = this.li[i_1].toString();
                    node0.parent = this.numberNode;
                    node0.y = 10;
                    this.labelArr.push(node0);
                    var node = new cc.Node();
                    var label = node.addComponent(cc.Label);
                    label.string = repeat.toString();
                    label.font = this.font;
                    label.fontSize = 30;
                    node.parent = this.numberNode;
                    node.y = 40;
                    this.labelArr.push(node);
                    var node1 = new cc.Node();
                    var label1 = node1.addComponent(cc.Label);
                    label1.font = this.font;
                    label1.fontSize = 50;
                    this.labelArr.push(node1);
                    if (this.li[i_1 + 2]) {
                        label1.string = '  *  ';
                    }
                    else {
                        label1.string = '  =  ';
                    }
                    node1.parent = this.numberNode;
                    node1.y = 10;
                }
            }
        }
    };
    GamePanel.prototype.createDecomposeBall = function () {
        var x = this.numberStr.node.getContentSize().width + 100;
        var y = 0;
        var space = 100;
        for (var i = 0; i < this.li.length; i++) {
            var ballx = 0;
            ballx = 0; // x + 200 * i;
            this.createBall(this.li[i], i, y, this.numberNode, false);
        }
    };
    GamePanel.prototype.skinString = function (num) {
        if (DaAnData_1.skinStrEnum[num] && num != 8 && num != 9) {
            return DaAnData_1.skinStrEnum[num];
        }
        else {
            if (num.toString().length == 1) {
                return DaAnData_1.skinStrEnum[8];
            }
            else if (num.toString().length == 2 || num.toString().length == 3) {
                return DaAnData_1.skinStrEnum[9];
            }
        }
    };
    GamePanel.prototype.addListenerOnPlacement = function () {
        var bubble_none = null;
        var _loop_1 = function (i) {
            this_1.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_START, function (e) {
                if (this.placementBallArr[i].opacity == 0) {
                    return;
                }
                if (this.shooting) {
                    return;
                }
                if (this.multiply) {
                    return;
                }
                var num = parseInt(this.placementBallArr[i].getChildByName('label').getComponent(cc.Label).string);
                if (num == 1) {
                    return;
                }
                AudioManager_1.AudioManager.getInstance().stopAll();
                AudioManager_1.AudioManager.getInstance().playSound('sfx_wining');
                this.placementBallArr[i].opacity = 0;
                this.bubble.opacity = 255;
                if (this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.bubble_none1.node.opacity = 255;
                    bubble_none = 1;
                }
                else if (this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.bubble_none2.node.opacity = 255;
                    bubble_none = 2;
                }
                else {
                    bubble_none = null;
                }
                this.bubble.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
                this.bubble.getChildByName('label').getComponent(cc.Label).getComponent(cc.Label).string = num.toString();
                this.bubble.setPosition(this.node.convertToNodeSpaceAR(e.currentTouch._point));
                if (this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                }
                if (this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                }
            }.bind(this_1));
            this_1.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                if (this.bubble.opacity == 0) {
                    return;
                }
                if (this.shooting) {
                    return;
                }
                if (this.multiply) {
                    return;
                }
                var num = parseInt(this.placementBallArr[i].getChildByName('label').getComponent(cc.Label).string);
                if (num == 1) {
                    return;
                }
                var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                if (location.x > this.node.width / 2 - this.bubble.width / 2) {
                    this.bubble.x = this.node.width / 2 - this.bubble.width / 2;
                }
                else if (location.x < -this.node.width / 2 + this.bubble.width / 2) {
                    this.bubble.x = -this.node.width / 2 + this.bubble.width / 2;
                }
                else {
                    this.bubble.x = location.x;
                }
                if (location.y >= this.node.height / 2 - this.bubble.height / 2) {
                    this.bubble.y = this.node.height / 2 - this.bubble.height / 2;
                }
                else if (location.y <= -this.node.height / 2 + this.bubble.height / 2) {
                    this.bubble.y = -this.node.height / 2 + this.bubble.height / 2;
                }
                else {
                    this.bubble.y = location.y;
                }
                var touchPos = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                var distant = Math.sqrt(Math.pow((touchPos.x - this.miya.getPosition().x), 2) + Math.pow((touchPos.y - this.miya.getPosition().y), 2));
                if (distant < 400 && distant > 150) {
                    if (this.miya.getComponent(sp.Skeleton).animation == 'idle' && this.miya.getComponent(sp.Skeleton).animation != 'in_jump') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_jump', false);
                    }
                    if (this.miya.getComponent(sp.Skeleton).animation != 'jump') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump', true);
                    }
                }
                else if (distant < 150) {
                    if (this.miya.getComponent(sp.Skeleton).animation != 'jump_xuangz') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump_xuangz', true);
                    }
                }
                else if (distant > 400) {
                    if (this.miya.getComponent(sp.Skeleton).animation == 'jump' && this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                    }
                    if (this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                        this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                    }
                }
            }.bind(this_1));
            this_1.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_END, function (e) {
                if (this.bubble.opacity == 0) {
                    return;
                }
                if (this.shooting) {
                    return;
                }
                if (this.multiply) {
                    return;
                }
                var num = parseInt(this.placementBallArr[i].getChildByName('label').getComponent(cc.Label).string);
                if (num == 1) {
                    return;
                }
                if (this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_deleted');
                    this.bubble.opacity = 0;
                }
                else {
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
                    this.bubble.opacity = 0;
                    this.placementBallArr[i].opacity = 255;
                    if (bubble_none == 1) {
                        this.bubble_none1.node.opacity = 0;
                    }
                    else if (bubble_none == 2) {
                        this.bubble_none2.node.opacity = 0;
                    }
                }
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
                if (this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
                }
            }.bind(this_1));
            this_1.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
                if (this.bubble.opacity == 0) {
                    return;
                }
                if (this.shooting) {
                    return;
                }
                if (this.multiply) {
                    return;
                }
                var num = parseInt(this.placementBallArr[i].getChildByName('label').getComponent(cc.Label).string);
                if (num == 1) {
                    return;
                }
                if (this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz') {
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_deleted');
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                    this.bubble.opacity = 0;
                }
                else {
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
                    this.bubble.opacity = 0;
                    this.placementBallArr[i].opacity = 255;
                    if (bubble_none == 1) {
                        this.bubble_none1.node.opacity = 0;
                    }
                    else if (bubble_none == 2) {
                        this.bubble_none2.node.opacity = 0;
                    }
                    else {
                        this.bubble_none1.node.opacity = 255;
                        this.bubble_none2.node.opacity = 255;
                    }
                }
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
                if (this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
                }
            }.bind(this_1));
        };
        var this_1 = this;
        for (var i = 0; i < this.placementBallArr.length; i++) {
            _loop_1(i);
        }
    };
    GamePanel.prototype.addListenerOnDecomposeBall = function (ballNode) {
        var ball = ballNode.getChildByName('spine');
        ball.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            }
            AudioManager_1.AudioManager.getInstance().playSound('sfx_touchball');
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            var num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string);
            var skinStr = this.skinString(num);
            this.bubble.getChildByName('label').getComponent(cc.Label).string = num;
            this.bubble.opacity = 255;
            this.bubble.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr);
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            if (location.x > this.node.width / 2 - ball.width / 2) {
                this.bubble.x = this.node.width / 2 - ball.width / 2;
            }
            else if (location.x < -this.node.width / 2 + ball.width / 2) {
                this.bubble.x = -this.node.width / 2 + ball.width / 2;
            }
            else {
                this.bubble.x = location.x;
            }
            if (location.y >= this.node.height / 2 - ball.height / 2) {
                this.bubble.y = this.node.height / 2 - ball.height / 2;
            }
            else if (location.y <= -this.node.height / 2 + ball.height / 2) {
                this.bubble.y = -this.node.height / 2 + ball.height / 2;
            }
            else {
                this.bubble.y = location.y;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function () {
            AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
            if (this.bubble.opacity == 255) {
                this.bubble.opacity = 0;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            var _this = this;
            AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
            if (this.gunNode.rotation != 0) {
                if (this.bubble.opacity == 255) {
                    this.bubble.opacity = 0;
                    return;
                }
            }
            if (!this.isDoubleOver) {
                this.bubble.opacity = 0;
                return;
            }
            var num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string);
            var skinStr = this.skinString(num);
            if (this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if (this.gunNode.getChildByName('ballNode').opacity) {
                    this.multiply = true;
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    var gunballNum = parseInt(this.gunNode.getChildByName('ballNode').getChildByName("label").getComponent(cc.Label).string);
                    var bubbleNum = parseInt(this.bubble.getChildByName('label').getComponent(cc.Label).string);
                    if (gunballNum * bubbleNum > 999) {
                        this.bubble.opacity = 0;
                        UIHelp_1.UIHelp.showTip('数值过大！');
                        this.isReadyShoot = true;
                        this.isDoubleOver = true;
                        return;
                    }
                    this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(gunballNum));
                    this.bubble_2.getChildByName('label').getComponent(cc.Label).string = gunballNum.toString();
                    if (gunballNum.toString().length >= 3) {
                        this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 30;
                    }
                    else {
                        this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                    }
                    this.bubble_2.opacity = 255;
                    this.bubble_none2.node.opacity = 0;
                    this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    var gunBall_1 = this.gunNode.getChildByName('ballNode');
                    gunBall_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
                    gunBall_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == 'ball_out') {
                            gunBall_1.opacity = 0;
                        }
                    });
                }
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr);
                this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                this.bubble_1.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_1.opacity = 255;
                this.bubble_none1.node.opacity = 0;
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                if (this.bubble_1.opacity && this.bubble_2.opacity) {
                    this.multiply = true;
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_composing');
                    this.signNode.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.3), cc.fadeIn(0.2), cc.fadeOut(0.3)));
                }
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                    if (trackEntry.animation.name == 'ball_in') {
                        if (_this.bubble_1.opacity && _this.bubble_2.opacity) {
                            var skeleton1 = _this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton);
                            var skeleton2 = _this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton);
                            skeleton1.addAnimation(0, 'ball_out', false);
                            skeleton2.addAnimation(0, 'ball_out', false);
                        }
                    }
                    else if (trackEntry.animation.name == 'ball_out') {
                        if (_this.bubble_1.opacity && _this.bubble_2.opacity) {
                            _this.gunballIn();
                            _this.bubble_1.opacity = 0;
                            _this.bubble_2.opacity = 0;
                            _this.bubble_none1.node.opacity = 255;
                            _this.bubble_none2.node.opacity = 255;
                        }
                    }
                });
            }
            else if (this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if (this.gunNode.getChildByName('ballNode').opacity) {
                    this.multiply = true;
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    var gunballNum = parseInt(this.gunNode.getChildByName('ballNode').getChildByName("label").getComponent(cc.Label).string);
                    var bubbleNum = parseInt(this.bubble.getChildByName('label').getComponent(cc.Label).string);
                    if (gunballNum * bubbleNum > 999) {
                        this.bubble.opacity = 0;
                        UIHelp_1.UIHelp.showTip('数值过大！');
                        this.isReadyShoot = true;
                        this.isDoubleOver = true;
                        return;
                    }
                    var gunBall_2 = this.gunNode.getChildByName('ballNode');
                    this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(gunballNum));
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunballNum.toString();
                    if (gunballNum.toString().length >= 3) {
                        this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 30;
                    }
                    else {
                        this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                    }
                    this.bubble_1.opacity = 255;
                    this.bubble_none1.node.opacity = 0;
                    this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    gunBall_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
                    gunBall_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == 'ball_out') {
                            gunBall_2.opacity = 0;
                        }
                    });
                }
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr);
                this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_2.opacity = 255;
                this.bubble_none2.node.opacity = 0;
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                if (this.bubble_1.opacity && this.bubble_2.opacity) {
                    this.multiply = true;
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_composing');
                    this.signNode.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.3), cc.fadeIn(0.2), cc.fadeOut(0.3)));
                }
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                    if (trackEntry.animation.name == 'ball_in') {
                        if (_this.bubble_1.opacity && _this.bubble_2.opacity) {
                            var skeleton1 = _this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton);
                            var skeleton2 = _this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton);
                            skeleton1.addAnimation(0, 'ball_out', false);
                            skeleton2.addAnimation(0, 'ball_out', false);
                        }
                    }
                    else if (trackEntry.animation.name == 'ball_out') {
                        if (_this.bubble_1.opacity && _this.bubble_2.opacity) {
                            _this.gunballIn();
                            _this.bubble_1.opacity = 0;
                            _this.bubble_2.opacity = 0;
                            _this.bubble_none1.node.opacity = 255;
                            _this.bubble_none2.node.opacity = 255;
                        }
                    }
                });
            }
            if (this.bubble.opacity == 255) {
                this.bubble.opacity = 0;
            }
        }.bind(this), this);
    };
    GamePanel.prototype.gunballIn = function () {
        var _this = this;
        var gunBall = this.gunNode.getChildByName('ballNode');
        gunBall.opacity = 255;
        var num1 = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
        var num2 = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
        var num = num1 * num2;
        if (num > 999) {
            num = 999;
        }
        if (num.toString().length >= 3) {
            gunBall.getChildByName('label').getComponent(cc.Label).fontSize = 30;
        }
        else {
            gunBall.getChildByName('label').getComponent(cc.Label).fontSize = 40;
        }
        gunBall.getChildByName('label').getComponent(cc.Label).string = num.toString();
        gunBall.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
        AudioManager_1.AudioManager.getInstance().playSound('sfx_compgood');
        this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'in', false);
        if (gunBall.opacity) {
            gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
            gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                if (trackEntry.animation.name == 'ball_in') {
                    _this.isReadyShoot = true;
                    _this.isDoubleOver = true;
                    _this.multiply = false;
                }
            });
        }
    };
    GamePanel.prototype.addListenerOnAnswerBall = function (ballNode) {
        var ball = ballNode.getChildByName('spine');
        ball.on(cc.Node.EventType.TOUCH_START, function (e) {
            AudioManager_1.AudioManager.getInstance().stopAll();
            AudioManager_1.AudioManager.getInstance().playSound('sfx_wining');
            if (this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
            }
            if (this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var location = ballNode.parent.convertToNodeSpaceAR(e.currentTouch._point);
            if (location.x >= this.node.width / 2 - ball.width / 2 - ballNode.parent.x) {
                ballNode.x = this.node.width / 2 - ball.width / 2 - ballNode.parent.x;
            }
            else if (location.x <= -this.node.width / 2 + ball.width / 2 - ballNode.parent.x) {
                ballNode.x = -this.node.width / 2 + ball.width / 2 - ballNode.parent.x;
            }
            else {
                ballNode.x = location.x;
            }
            if (location.y >= this.node.height / 2 - ball.height / 2 - ballNode.parent.y) {
                ballNode.y = this.node.height / 2 - ball.height / 2 - ballNode.parent.y;
            }
            else if (location.y <= -this.node.height / 2 + ball.height / 2 - ballNode.parent.y) {
                ballNode.y = -this.node.height / 2 + ball.height / 2 - ballNode.parent.y;
            }
            else {
                ballNode.y = location.y;
            }
            var touchPos = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            var distant = Math.sqrt(Math.pow((touchPos.x - this.miya.getPosition().x), 2) + Math.pow((touchPos.y - this.miya.getPosition().y), 2));
            if (distant < 400 && distant > 150) {
                if (this.miya.getComponent(sp.Skeleton).animation == 'idle' && this.miya.getComponent(sp.Skeleton).animation != 'in_jump') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_jump', false);
                }
                if (this.miya.getComponent(sp.Skeleton).animation != 'jump') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump', true);
                }
            }
            else if (distant < 150) {
                if (this.miya.getComponent(sp.Skeleton).animation != 'jump_xuangz') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump_xuangz', true);
                }
            }
            else if (distant > 400) {
                if (this.miya.getComponent(sp.Skeleton).animation == 'jump' && this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                }
                if (this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                }
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz' && !this.shooting) {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                var num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string);
                if (num == 1) {
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
                    UIHelp_1.UIHelp.showAffirmTips(1, '质数1不能删除', -1, '取消', '确认', function () {
                        ballNode.setPosition(cc.v2(0, 0));
                    }.bind(this), function () {
                        ballNode.setPosition(cc.v2(0, 0));
                    }.bind(this));
                }
                else {
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_deleted');
                    var index = this.answerArr.indexOf(ballNode);
                    this.answerArr.splice(index, 1);
                    this.eventvalue.levelData[this.checkpoint - 1].subject = this.pl;
                    this.pl.splice(index, 1);
                    var updateIndex = this.updateNode.indexOf(ballNode);
                    this.updateNode.splice(updateIndex, 1);
                    this.updatePos();
                    ballNode.destroy();
                }
            }
            else {
                AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
                ballNode.setPosition(cc.v2(0, 0));
            }
            this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
            if (this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            AudioManager_1.AudioManager.getInstance().playSound('sfx_releaseball');
            ballNode.setPosition(cc.v2(0, 0));
        }.bind(this), this);
    };
    GamePanel.prototype.updatePos = function () {
        for (var i = 0; i < this.answerArr.length; i++) {
            var index = i + 1;
            var parent = this.node.getChildByName(index.toString());
            this.answerArr[i].parent = parent;
        }
    };
    GamePanel.prototype.shoot = function () {
        var _this = this;
        if (this.gunNode.rotation != 0) {
            return;
        }
        if (this.shooting) {
            return;
        }
        if (this.gunNode.getChildByName('ballNode').opacity == 0 && this.bubble_1.opacity && this.isDoubleOver) {
            this.shooting = true;
            var num = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
            var ballNode_1 = this.gunNode.getChildByName('ballNode');
            ballNode_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
            ballNode_1.getChildByName('label').getComponent(cc.Label).string = num.toString();
            ballNode_1.opacity = 255;
            ballNode_1.getChildByName('gun_bg').opacity = 0;
            this.bubble_none1.node.opacity = 255;
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                if (trackEntry.animation.name == 'ball_out') {
                    _this.bubble_1.opacity = 0;
                    ballNode_1.getChildByName('gun_bg').opacity = 255;
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_moveball');
                    ballNode_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    ballNode_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == 'ball_in') {
                            _this.bulletOut();
                        }
                    });
                }
            });
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).clearTracks();
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
        }
        else if (this.gunNode.getChildByName('ballNode').opacity == 0 && this.bubble_2.opacity && this.isDoubleOver) {
            this.shooting = true;
            var num = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
            var ballNode_2 = this.gunNode.getChildByName('ballNode');
            ballNode_2.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
            ballNode_2.getChildByName('label').getComponent(cc.Label).string = num.toString();
            ballNode_2.opacity = 255;
            ballNode_2.getChildByName('gun_bg').opacity = 0;
            this.bubble_none2.node.opacity = 255;
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                if (trackEntry.animation.name == 'ball_out') {
                    _this.bubble_2.opacity = 0;
                    ballNode_2.getChildByName('gun_bg').opacity = 255;
                    AudioManager_1.AudioManager.getInstance().playSound('sfx_moveball');
                    ballNode_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    ballNode_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == 'ball_in') {
                            _this.bulletOut();
                        }
                    });
                }
            });
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).clearTracks();
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
        }
        else if (this.gunNode.getChildByName('ballNode').opacity == 255 && this.answerArr.length < 25) {
            this.shooting = true;
            this.bulletOut();
        }
        this.isReadyShoot = false;
    };
    GamePanel.prototype.bulletOut = function () {
        var gunBall = this.gunNode.getChildByName('ballNode');
        var num = gunBall.getChildByName('label').getComponent(cc.Label).string;
        var answerIndex = this.answerArr.length + 1;
        var parent = this.node.getChildByName(answerIndex.toString());
        var dirPos = parent.getPosition();
        var pos1 = this.gunNode.getPosition();
        var xx = this.gunNode.getChildByName('gun1').getPosition().x + pos1.x;
        var yy = this.gunNode.getChildByName('gun1').getPosition().y + pos1.y;
        var pos3 = cc.v2(xx, yy);
        var anchorPos = this.gunNode.getPosition();
        var angle = this.getAngle(dirPos, anchorPos);
        var oriPos = this.getRotationPos(pos1, pos3, angle);
        var answerNum = parseInt(gunBall.getChildByName('label').getComponent(cc.Label).string);
        this.pl.push(answerNum);
        this.eventvalue.levelData[this.checkpoint - 1].subject = this.pl;
        this.bullet.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(answerNum));
        this.bullet.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
        var shootStart = cc.callFunc(function () {
            var _this = this;
            AudioManager_1.AudioManager.getInstance().playSound('sfx_shoot');
            this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'ready', false);
            // this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'go', false);
            this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                if (trackEntry.animation.name == 'ready') {
                    _this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'go', false);
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_fire', false);
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(function (trackEntry) {
                        if (trackEntry.animation.name == 'ball_fire') {
                            gunBall.opacity = 0;
                        }
                    });
                    _this.bullet.setPosition(oriPos);
                    _this.bullet.opacity = 255;
                    _this.bullet.setScale(0.5);
                    var time = 0.2;
                    if (answerIndex > 18) {
                        time = 0.1;
                    }
                    _this.bullet.runAction(cc.sequence(cc.spawn(cc.scaleTo(time, 1), cc.moveTo(time, dirPos).easing(cc.easeSineOut())), shootEnd));
                }
            });
        }.bind(this), this);
        var shootEnd = cc.callFunc(function () {
            var _this = this;
            this.bullet.opacity = 0;
            this.createBall(parseInt(num), 0, 0, parent, true);
            this.gunNode.runAction(cc.sequence(cc.rotateTo(0.5, 0), cc.callFunc(function () { _this.shooting = false; })));
        }.bind(this), this);
        this.gunNode.runAction(cc.sequence(cc.rotateBy(0.5, angle), shootStart));
    };
    GamePanel.prototype.getAngle = function (dirpos, oriPos) {
        var x = Math.abs(dirpos.x - oriPos.x);
        var y = Math.abs(dirpos.y - oriPos.y);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);
        var angle = Math.floor(180 / (Math.PI / radina));
        if (dirpos.x > oriPos.x) {
            angle = angle;
        }
        else {
            angle = -angle;
        }
        return angle;
    };
    GamePanel.prototype.getRotationPos = function (anchorPos, childPos, angle) {
        //var angle = Math.abs(angle);
        var z = Math.sqrt(Math.pow((anchorPos.x - childPos.x), 2) + Math.pow((anchorPos.y - childPos.y), 2));
        var radina = 2 * Math.PI / 360 * angle;
        var cos = Math.cos(radina);
        var y = z * cos;
        var x = Math.sqrt(Math.pow(z, 2) - Math.pow(y, 2));
        var posx = anchorPos.x + x;
        var posy = anchorPos.y + y;
        if (angle > 0) {
            posx = posx;
        }
        else {
            posx = anchorPos.x - x;
            ;
        }
        var pos = cc.v2(posx, posy);
        return pos;
    };
    GamePanel.prototype.nextCheckPoint = function (checkpoint) {
        //重置时间
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        this.openClock();
        //销毁实例
        this.updateNode = [];
        for (var i = 0; i < this.decomposeArr.length; i++) {
            this.decomposeArr[i].destroy();
        }
        for (var i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].destroy();
        }
        for (var i = 0; i < this.labelArr.length; i++) {
            this.labelArr[i].destroy();
        }
        //清空数组
        this.decomposeArr = [];
        this.answerArr = [];
        this.labelArr = [];
        this.pl = [];
        this.li = [];
        this.an = [];
        //重置ui
        this.bubble.opacity = 0;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        //初始化游戏
        this.decoposeNum = DaAnData_1.DaAnData.getInstance().numberArr[checkpoint - 1];
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
        this.initProgress(this.checkpoint);
        this.defaultValue();
        this.updateNode.push(this.bubble_1);
        this.updateNode.push(this.bubble_2);
        this.updateNode.push(this.gunNode.getChildByName('ballNode'));
        this.cueNum = 0;
        this.eventvalue.levelData[this.checkpoint - 1].answer = this.an;
    };
    GamePanel.prototype.reset = function () {
        if (this.gunNode.rotation != 0) {
            return;
        }
        //重置时间 重置时间继续
        // this.minuteHand.rotation = 0;
        // this.secondHand.rotation = 0;
        // this.timer = 0;
        // this.openClock();
        //销毁实例
        for (var i = 0; i < this.answerArr.length; i++) {
            if (this.updateNode.indexOf(this.answerArr[i]) != -1) {
                this.updateNode.splice(this.updateNode.indexOf(this.answerArr[i]), 1);
            }
            this.answerArr[i].destroy();
        }
        //清空数组
        this.answerArr = [];
        this.pl = [];
        //重置ui
        this.bubble.opacity = 0;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        this.cueNum = 0;
        this.defaultValue();
        this.mask.active = false;
    };
    GamePanel.prototype.cueAnswer = function () {
        for (var i = 0; i < this.pl.length; i++) {
            if (this.an.indexOf(this.pl[i]) == -1) {
                this.answerArr[i].getChildByName('err').active = true;
                var str = this.answerArr[i].getChildByName('label').getComponent(cc.Label).string;
                if (str.length < 3) {
                    this.answerArr[i].getChildByName('label').getComponent(cc.Label).fontSize = 50;
                }
                else {
                    this.answerArr[i].getChildByName('label').getComponent(cc.Label).fontSize = 40;
                }
            }
            else {
                for (var j = 0; j < i; j++) {
                    if (this.pl[j] == this.pl[i]) {
                        this.answerArr[i].getChildByName('err').active = true;
                        var str = this.answerArr[i].getChildByName('label').getComponent(cc.Label).string;
                        if (str.length < 3) {
                            this.answerArr[i].getChildByName('label').getComponent(cc.Label).fontSize = 50;
                        }
                        else {
                            this.answerArr[i].getChildByName('label').getComponent(cc.Label).fontSize = 40;
                        }
                    }
                }
            }
        }
    };
    GamePanel.prototype.isRight = function () {
        if (this.gunNode.rotation != 0) {
            return;
        }
        var rightNum = 0;
        for (var i = 0; i < this.an.length; i++) {
            if (this.pl.indexOf(this.an[i]) != -1) {
                rightNum++;
            }
        }
        this.eventvalue.levelData[this.checkpoint - 1].subject = this.pl;
        if (rightNum == this.an.length && this.pl.length == this.an.length) {
            this.isOver = 2;
            this.eventvalue.result = 2;
            this.checkpoint++;
            if (this.checkpoint >= this.checkpointsNum + 1) {
                this.closeClock();
                this.tijiao.interactable = false;
                this.chongzhi.interactable = false;
                this.eventvalue.levelData[this.checkpoint - 2].result = 1;
                this.eventvalue.result = 1;
                this.isOver = 1;
                DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                UIHelp_1.UIHelp.showAffirmTips(1, '恭喜全部通关', this.timer, '再次挑战', '关闭', function () {
                    UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
                    this.checkpoint--;
                    this.resetTime();
                    this.reset();
                }.bind(this), function () {
                    UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
                    this.mask.active = true;
                    if (ConstValue_1.ConstValue.IS_TEACHER) {
                        DaAnData_1.DaAnData.getInstance().submitEnable = true;
                    }
                }.bind(this));
            }
            else {
                this.closeClock();
                this.eventvalue.levelData[this.checkpoint - 2].result = 1;
                UIHelp_1.UIHelp.showAffirmTips(1, '挑战成功', this.timer, '再次挑战', '下一关', function () {
                    UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
                    this.checkpoint--;
                    this.resetTime();
                    this.reset();
                }.bind(this), function () {
                    UIManager_1.UIManager.getInstance().closeUI(OverTips_1.OverTips);
                    this.nextCheckPoint(this.checkpoint);
                }.bind(this));
            }
        }
        else {
            this.cueNum++;
            this.isOver = 2;
            this.eventvalue.result = 2;
            this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            this.mask.active = true;
            this.closeClock();
            this.cueAnswer();
            UIHelp_1.UIHelp.showAffirmTips(2, '挑战失败！点击重置后再次挑战', this.timer, '取消', '确认', function () { this.openClock(); }.bind(this), function () { this.openClock(); }.bind(this));
        }
    };
    GamePanel.prototype.chongzhiCallback = function () {
        UIHelp_1.UIHelp.showAffirmTips(1, '确认要重置本关，重新开始游戏吗？', -1, '取消', '确认', function () { }.bind(this), this.reset.bind(this));
    };
    GamePanel.prototype.tijiaoCallback = function () {
        this.closeClock();
        UIHelp_1.UIHelp.showAffirmTips(1, '确认提交答案吗？', -1, '取消', '确认', function () { this.openClock(); }.bind(this), this.isRight.bind(this));
    };
    GamePanel.prototype.resetTime = function () {
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        this.minStr = '00';
        this.secStr = '00';
        this.openClock();
    };
    GamePanel.prototype.openClock = function () {
        this.intervalIndex = setInterval(function () {
            this.timer = this.timer + 1;
            var minutes = this.timer / 60 >> 0;
            var second = this.timer % 60;
            this.minStr = String(minutes);
            this.secStr = String(second);
            if (minutes < 10) {
                this.minStr = "0" + this.minStr;
            }
            if (second < 10) {
                this.secStr = "0" + this.secStr;
            }
            this.minuteHand.rotation = minutes * 6;
            this.secondHand.rotation = second * 6;
            this.minutes.getComponent(cc.Label).string = this.minStr;
            this.second.getComponent(cc.Label).string = this.secStr;
            if (minutes == 60) {
                clearInterval(this.intervalIndex);
            }
        }.bind(this), 1000);
    };
    GamePanel.prototype.closeClock = function () {
        clearInterval(this.intervalIndex);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "queren", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "chongzhi", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "tijiao", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "minutes", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "second", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "minuteHand", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "secondHand", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "numberStr", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "bubble_none1", void 0);
    __decorate([
        property(cc.Sprite)
    ], GamePanel.prototype, "bubble_none2", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bubble_1", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bubble_2", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bubble", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bullet", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "gunNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "miya", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "mask", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "numberNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "signNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bg", void 0);
    __decorate([
        property(cc.BitmapFont)
    ], GamePanel.prototype, "font", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "ballNodeP", void 0);
    GamePanel = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();