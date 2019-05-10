"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var DaAnData_1 = require("../../Data/DaAnData");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ballArr = Array();
        _this.answerArr = Array();
        return _this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        this.isTecher();
        this.initData();
    };
    GamePanel.prototype.start = function () {
        this.openClock();
        this.decompose(DaAnData_1.DaAnData.getInstance().number);
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
    };
    GamePanel.prototype.createBall = function (num) {
        var ballNode;
        cc.loader.loadRes('prefab/ui/Item/ballNode', function (err, prefab) {
            if (!err) {
                ballNode = cc.instantiate(prefab);
                var label = ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
                var ball = ballNode.getChildByName('ball').getComponent(cc.Sprite);
                switch (num) {
                    case 1:
                        cc.loader.loadRes('images/gameUI/bubble_1', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 2:
                        cc.loader.loadRes('images/gameUI/bubble_2', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 3:
                        cc.loader.loadRes('images/gameUI/bubble_3', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 5:
                        cc.loader.loadRes('images/gameUI/bubble_4', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 7:
                        cc.loader.loadRes('images/gameUI/bubble_5', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 11:
                        cc.loader.loadRes('images/gameUI/bubble_6', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    case 13:
                        cc.loader.loadRes('images/gameUI/bubble_7', cc.SpriteFrame, function (err, spriteframe) {
                            ball.spriteFrame = spriteframe;
                        });
                        break;
                    default:
                        if (num.toString().length == 2 || num.toString().length == 1) {
                            cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function (err, spriteframe) {
                                ball.spriteFrame = spriteframe;
                            });
                        }
                        else if (num.toString().length == 3) {
                            cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function (err, spriteframe) {
                                ball.spriteFrame = spriteframe;
                            });
                        }
                        break;
                }
            }
        });
        return ballNode;
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
        var li = [];
        var i = 1;
        while (i < num1) {
            i += 1;
            while (num1 % i == 0) {
                num1 /= i;
                li.push(i);
            }
        }
        var str = String(num) + '  =  ';
        for (var i_1 = 0; i_1 < li.length; i_1++) {
            if (i_1 < li.length - 1) {
                str += String(li[i_1]) + '  *  ';
            }
            else {
                str += String(li[i_1]) + '  =  ';
            }
        }
        this.numberStr.getComponent(cc.Label).string = str;
        var x = this.numberStr.node.width + this.numberStr.node.x;
        var y = this.numberStr.node.y;
        var space = 150;
        for (var i_2 = 0; i_2 < li.length; i_2++) {
            var item = this.createBall(li[i_2]);
            if (i_2 % 2) {
                item.x = x + 150 * (i_2 + 2);
            }
            else {
                item.x = x + 150 * (i_2 + 1);
            }
            item.y = y;
            item.parent = this.node;
        }
        cc.log(str);
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
    };
    GamePanel.prototype.backButton = function () {
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1);
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 0 });
    };
    GamePanel.prototype.submitButton = function () {
        this.decompose(DaAnData_1.DaAnData.getInstance().number);
        //UIManager.getInstance().openUI(SubmissionPanel);
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
    ], GamePanel.prototype, "gunNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "garbageNode", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "mask", void 0);
    GamePanel = GamePanel_1 = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();