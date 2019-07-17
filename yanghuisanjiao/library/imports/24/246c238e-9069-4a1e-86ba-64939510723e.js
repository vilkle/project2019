"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var NetWork_1 = require("../../Http/NetWork");
var DataReporting_1 = require("../../Data/DataReporting");
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
        _this.triangleNode = null;
        _this.answerNodeArr = [];
        _this.checkpoint = 1;
        _this.questionIndex = 0;
        _this.answerIndex = 0;
        return _this;
    }
    GamePanel.prototype.start = function () {
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.answerNodeArr.push(this.ASprite.node);
        this.answerNodeArr.push(this.BSprite.node);
        this.answerNodeArr.push(this.CSprite.node);
        this.answerNodeArr.push(this.DSprite.node);
        this.stockOfFish();
        this.initGame();
    };
    GamePanel.prototype.initGame = function () {
        var _this = this;
        this.question1();
        var _loop_1 = function (i) {
            this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_START, function () {
                _this.answerNodeArr[i].setScale(0.95);
                _this.answerIndex = i + 1;
            });
            this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_END, function () {
                _this.answerNodeArr[i].setScale(1);
            });
            this_1.answerNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, function () {
                _this.answerNodeArr[i].setScale(1);
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.answerNodeArr.length; i++) {
            _loop_1(i);
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
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数字组成了什么图形？';
        this.ALabel.string = 'A  三角形';
        this.BLabel.string = 'B  圆形';
        this.CLabel.string = 'C  平行四边形';
        this.DSprite.node.active = false;
        for (var i = 0; i < this.triangleNode.children.length; i++) {
            for (var j = 0; j < this.triangleNode.children[i].children.length; j++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow', true);
            }
        }
    };
    GamePanel.prototype.question2 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这个三角形有多大？';
        this.ALabel.string = 'A  大约7cm';
        this.BLabel.string = 'B  无限大';
        this.CLabel.string = 'C  依屏幕大小而定';
        this.DSprite.node.active = false;
    };
    GamePanel.prototype.question3 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数是有规律的，你最愿意怎样观察呢？';
        this.ALabel.string = 'A  横着看';
        this.BLabel.string = 'B  斜着看';
        this.CLabel.string = 'C  竖着看';
        this.DSprite.node.active = false;
    };
    GamePanel.prototype.question4_1 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.questionLabel.string = '仔细观察你发现了什么？';
        this.ALabel.string = 'A  每一行左右两侧数字对称';
        this.BLabel.string = 'B  每一行左右两侧数字不对称';
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
    };
    GamePanel.prototype.question4_2 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.DSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，以下哪项不是图中的规律？';
        this.ALabel.string = 'A  左右两侧最外层都是1';
        this.BLabel.string = 'B  第2行起，每一行第2个数从上到下可以组成一个等差数组';
        this.CLabel.string = 'C  第2行起，每一行第2个数从上到下可以组成一个等差数组';
        this.DLabel.string = 'D  第5行第2个数是4，则第20行第2个数是19';
    };
    GamePanel.prototype.question4_3 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，发现了什么？';
        this.ALabel.string = 'A  每个数等于肩上两个数的和';
        this.BLabel.string = 'B  每个数等于上一行数的和';
        this.CLabel.string = 'C  奇数行中间的数可组成等差数串';
        this.DSprite.node.active = false;
    };
    GamePanel.prototype.question5_1 = function () {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察有什么规律呢？';
        this.ALabel.string = 'A  第n行有n个数';
        this.BLabel.string = 'B  第n行有n+1个数';
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
    };
    GamePanel.prototype.right1 = function () {
    };
    GamePanel.prototype.wrong1 = function () {
    };
    GamePanel.prototype.right2 = function () {
    };
    GamePanel.prototype.wrong2 = function () {
    };
    GamePanel.prototype.right4_1 = function () {
    };
    GamePanel.prototype.isRight = function (questionIndex) {
        if (questionIndex == 1) {
        }
        else if (questionIndex == 2) {
        }
        else if (questionIndex == 3) {
        }
        else if (questionIndex == 4) {
        }
        else if (questionIndex == 5) {
        }
        else if (questionIndex == 6) {
        }
        else if (questionIndex == 7) {
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
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
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
        property(cc.Node)
    ], GamePanel.prototype, "triangleNode", void 0);
    GamePanel = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();