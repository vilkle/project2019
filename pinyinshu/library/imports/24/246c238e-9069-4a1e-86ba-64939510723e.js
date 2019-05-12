"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var DaAnData_1 = require("../../Data/DaAnData");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var SubmissionPanel_1 = require("./SubmissionPanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.decomposeArr = Array();
        _this.answerArr = Array();
        _this.progressArr = Array();
        _this.li = Array(); //需要重置
        return _this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        DaAnData_1.DaAnData.getInstance().checkpointsNum = 3;
        DaAnData_1.DaAnData.getInstance().number = 24;
        this.isTecher();
        this.initData();
    };
    GamePanel.prototype.start = function () {
        this.openClock();
        this.decompose(this.decoposeNum);
        this.createDecomposeBall();
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.update = function (dt) {
    };
    GamePanel.prototype.isTecher = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
        }
        else {
        }
    };
    GamePanel.prototype.initData = function () {
        this.timer = 0;
        this.decoposeNum = DaAnData_1.DaAnData.getInstance().number;
        this.checkpoint = 3;
        this.checkpointsNum = 3; //DaAnData.getInstance().checkpointsNum;
        this.defaultValue();
        this.initProgress(this.checkpointsNum);
    };
    GamePanel.prototype.initProgress = function (checkpointsNum) {
        var long = 200;
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
        var parent = this.node.getChildByName('1');
        var pos = parent.getPosition();
        this.createBall(1, pos.x, pos.y, parent, true);
    };
    GamePanel.prototype.createBall = function (num, x, y, parent, isAnswer) {
        var ballNode;
        cc.loader.loadRes('prefab/ui/Item/ballNode', function (err, prefab) {
            if (!err) {
                ballNode = cc.instantiate(prefab);
                ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
                var ball = ballNode.getChildByName('ball').getComponent(cc.Sprite);
                ballNode.x = x;
                ballNode.y = y;
                ballNode.parent = parent;
                if (isAnswer) {
                    this.answerArr.push(ballNode);
                    this.addListenerOnAnswerBall(ballNode);
                }
                else {
                    this.decomposeArr.push(ballNode);
                    this.addListenerOnDecomposeBall(ballNode);
                }
                switch (num) {
                    case 1:
                        cc.loader.loadRes('images/gameUI/bubble_1', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe1 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 2:
                        cc.loader.loadRes('images/gameUI/bubble_2', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe2 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 3:
                        cc.loader.loadRes('images/gameUI/bubble_3', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe3 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 5:
                        cc.loader.loadRes('images/gameUI/bubble_4', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe4 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 7:
                        cc.loader.loadRes('images/gameUI/bubble_5', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe5 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 11:
                        cc.loader.loadRes('images/gameUI/bubble_6', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe6 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    case 13:
                        cc.loader.loadRes('images/gameUI/bubble_7', cc.SpriteFrame, function (err, spriteframe) {
                            this.spriteframe7 = spriteframe;
                            ball.spriteFrame = spriteframe;
                        }.bind(this));
                        break;
                    default:
                        if (num.toString().length == 2 || num.toString().length == 1) {
                            cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function (err, spriteframe) {
                                this.spriteframe8 = spriteframe;
                                ball.spriteFrame = spriteframe;
                            }.bind(this));
                        }
                        else if (num.toString().length == 3) {
                            cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function (err, spriteframe) {
                                this.spriteframe9 = spriteframe;
                                ball.spriteFrame = spriteframe;
                            }.bind(this));
                        }
                        break;
                }
            }
        }.bind(this));
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var data = JSON.parse(response_data.data.courseware_content);
                    if (data.number) {
                        DaAnData_1.DaAnData.getInstance().number = data.number;
                    }
                    if (data.checkpointsNum) {
                        DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    }
                }
            }
        }.bind(this), null);
    };
    GamePanel.prototype.decompose = function (num) {
        var num1 = num;
        //var li = [];
        var i = 1;
        while (i < num1) {
            i += 1;
            while (num1 % i == 0) {
                num1 /= i;
                this.li.push(i);
            }
        }
        var str = String(num) + '  =  ';
        for (var i_1 = 0; i_1 < this.li.length; i_1++) {
            if (i_1 < this.li.length - 1) {
                str += String(this.li[i_1]) + '  *  ';
            }
            else {
                str += String(this.li[i_1]) + '  =  ';
            }
        }
        this.numberStr.getComponent(cc.Label).string = str;
    };
    GamePanel.prototype.createDecomposeBall = function () {
        var x = this.numberStr.node.getContentSize().width + 100;
        var y = 0;
        var space = 150;
        for (var i = 0; i < this.li.length; i++) {
            cc.log(this.li[i]);
            var ballx = 0;
            ballx = x + 200 * i;
            cc.log(x);
            this.createBall(this.li[i], ballx, y, this.numberStr.node.parent, false);
        }
        for (var i = 0; i < this.li.length - 1; i++) {
            var node = new cc.Node("label");
            var labelX = node.addComponent(cc.Label);
            labelX.string = "0";
            labelX.font = this.font;
            node.x = x + 100 + 200 * i;
            node.y = y;
            node.parent = this.numberStr.node.parent;
        }
    };
    GamePanel.prototype.addListenerOnDecomposeBall = function (ballNode) {
        cc.log(ballNode);
        var ball = ballNode.getChildByName('ball');
        ball.on(cc.Node.EventType.TOUCH_START, function (e) {
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            var num = ballNode.getChildByName('label').getComponent(cc.Label).string;
            this.bubble.getChildByName('label').getComponent(cc.Label).string = num;
            this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = ball.getComponent(cc.Sprite).spriteFrame;
            this.bubble.active = true;
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            if (this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.garbageNode.getChildByName('light').active = true;
                this.garbageNode.getChildByName('iconLight').active = true;
            }
            else {
                if (this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                    this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function () {
            if (this.bubble.active == true) {
                this.bubble.active = false;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            if (this.bubble.active == true) {
                this.bubble.active = false;
            }
            if (this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                if (this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                    this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
            if (this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if (this.gunNode.getChildByName('ballNode').opacity) {
                    this.bubble_2.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_2.opacity = 255;
                    var gunBall = this.gunNode.getChildByName('ballNode');
                    gunBall.opacity = 0;
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }
                else {
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }
            }
            else if (this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if (this.gunNode.getChildByName('ballNode').opacity) {
                    var gunBall = this.gunNode.getChildByName('ballNode');
                    gunBall.opacity = 0;
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }
                this.bubble_2.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_2.opacity = 255;
            }
            if (this.bubble_1.opacity && this.bubble_2.opacity) {
                var gunBall_1 = this.gunNode.getChildByName('ballNode');
                gunBall_1.runAction(cc.fadeIn(2));
                this.bubble_1.runAction(cc.fadeOut(2));
                this.bubble_2.runAction(cc.fadeOut(2));
                var num1 = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
                var num2 = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
                var num = num1 * num2;
                if (num > this.decoposeNum) {
                    num = this.decoposeNum;
                }
                gunBall_1.getChildByName('label').getComponent(cc.Label).string = num.toString();
                if (num.toString().length == 2 || num.toString().length == 1) {
                    cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function (err, spriteframe) {
                        gunBall_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteframe;
                    }.bind(this));
                }
                else if (num.toString().length == 3) {
                    cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function (err, spriteframe) {
                        gunBall_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteframe;
                    }.bind(this));
                }
            }
        }.bind(this), this);
    };
    GamePanel.prototype.addListenerOnAnswerBall = function (ballNode) {
        var ball = ballNode.getChildByName('ball');
        ball.on(cc.Node.EventType.TOUCH_START, function (e) {
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            ballNode.setPosition(ballNode.parent.convertToNodeSpaceAR(e.currentTouch._point));
            if (this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.garbageNode.getChildByName('light').active = true;
                this.garbageNode.getChildByName('iconLight').active = true;
            }
            else {
                if (this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                    this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (this.garbageNode.getChildByName('light').active == true) {
                this.garbageNode.getChildByName('light').active = false;
                this.garbageNode.getChildByName('iconLight').active = false;
                cc.log(this.answerArr);
                var index = this.answerArr.indexOf(ballNode);
                cc.log("index is ", index);
                this.answerArr.splice(index, 1);
                this.answerArr.filter(function (item) { return item !== ballNode; });
                cc.log(this.answerArr);
                this.updatePos();
                ballNode.destroy();
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
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
        if (this.gunNode.getChildByName('ballNode').opacity == 255 && this.answerArr.length < 25) {
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
            this.bullet.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
            this.bullet.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
            var shootStart = cc.callFunc(function () {
                gunBall.opacity = 0;
                this.bullet.setPosition(oriPos);
                cc.log(oriPos);
                this.bullet.opacity = 255;
                this.bullet.setScale(0.5);
                this.bullet.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, dirPos).easing(cc.easeIn(0.5))), shootEnd));
            }.bind(this), this);
            var shootEnd = cc.callFunc(function () {
                this.bullet.opacity = 0;
                this.createBall(parseInt(num), 0, 0, parent, true);
                this.gunNode.runAction(cc.rotateTo(0.5, 0));
            }.bind(this), this);
            this.gunNode.runAction(cc.sequence(cc.rotateBy(0.5, angle), shootStart));
        }
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
        cc.log(x, '============', y);
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
    GamePanel.prototype.reset = function () {
        //重置时间
        this.closeClock();
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        //销毁实例
        for (var i = 0; i < this.decomposeArr.length; i++) {
            this.decompose[i].destroy();
        }
        for (var i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].destroy();
        }
        //清空数组
        this.decomposeArr = [];
        this.answerArr = [];
        //重置ui
        this.bubble.active = false;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        this.openClock();
    };
    GamePanel.prototype.isRight = function () {
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
    GamePanel.prototype.backButton = function () {
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1);
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 0 });
    };
    GamePanel.prototype.submitButton = function () {
        UIManager_1.UIManager.getInstance().openUI(SubmissionPanel_1.default);
    };
    var GamePanel_1;
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "back", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "submit", void 0);
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
    ], GamePanel.prototype, "garbageNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "mask", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "progressNode", void 0);
    __decorate([
        property(cc.BitmapFont)
    ], GamePanel.prototype, "font", void 0);
    GamePanel = GamePanel_1 = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();