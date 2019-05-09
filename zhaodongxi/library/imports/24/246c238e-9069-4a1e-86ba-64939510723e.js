"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
var AudioManager_1 = require("../../Manager/AudioManager");
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
        _this.sourceSFArr = [];
        _this.itemArr = [];
        _this.answerItemArr = [];
        _this.dirSFNumArr = new Array();
        _this.answerSFNumArr = new Array();
        _this.answerPosNumArr = new Array();
        _this.playerItemArr = new Array();
        _this.playerItemSFArr = new Array();
        _this.playerErroArr = new Array(); //位选中的正确答案
        return _this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        this.isTecher();
    };
    GamePanel.prototype.start = function () {
        //    this.creatPicBoard();
        //    this.creatAnswerBoard();
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.onShow = function () {
    };
    // update (dt) {}
    GamePanel.prototype.isTecher = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            this.back.node.active = true;
            this.submit.node.active = false;
            //this.submit.interactable = false;
            this.initData();
            this.loadSourcePFArr();
        }
        else {
            this.getNet();
            this.back.node.active = false;
            this.submit.node.active = false;
        }
    };
    GamePanel.prototype.action = function (loadItemNum) {
        if (loadItemNum == this.horizonNum * this.verticalNum + this.answerNum) {
            this.picBoard.runAction(cc.moveTo(1, cc.v2(-250, 0)));
            this.board.runAction(cc.moveTo(1, cc.v2(0, 0)));
            this.sure.node.runAction(cc.moveTo(1, cc.v2(720, -310)));
            AudioManager_1.AudioManager.getInstance().playSound("begin", false);
        }
    };
    GamePanel.prototype.initData = function () {
        switch (DaAnData_1.DaAnData.getInstance().range) {
            case 1:
                this.horizonNum = 4;
                this.verticalNum = 4;
                break;
            case 2:
                this.horizonNum = 5;
                this.verticalNum = 4;
                break;
            case 3:
                this.horizonNum = 6;
                this.verticalNum = 4;
                break;
            case 4:
                this.horizonNum = 7;
                this.verticalNum = 4;
                break;
            case 5:
                this.horizonNum = 8;
                this.verticalNum = 4;
                break;
            case 6:
                this.horizonNum = 4;
                this.verticalNum = 5;
                break;
            case 7:
                this.horizonNum = 5;
                this.verticalNum = 5;
                break;
            case 8:
                this.horizonNum = 6;
                this.verticalNum = 5;
                break;
            case 9:
                this.horizonNum = 7;
                this.verticalNum = 5;
                break;
            case 10:
                this.horizonNum = 8;
                this.verticalNum = 5;
                break;
            default:
                break;
        }
        switch (DaAnData_1.DaAnData.getInstance().types) {
            case 1:
                this.answerNum = 1;
                break;
            case 2:
                this.answerNum = 4;
                this.rightNum = 4;
                break;
            default:
                break;
        }
        this.creatItemNum = 0;
        this.cueNum = 0;
        this.checkpoints = 0;
        this.checkpointsNum = DaAnData_1.DaAnData.getInstance().checkpointsNum;
        this.label1.string = String(1);
        this.label2.string = String(this.checkpointsNum);
    };
    GamePanel.prototype.loadSourcePFArr = function () {
        var _this = this;
        var num = 0;
        DaAnData_1.DaAnData.getInstance().picArr.forEach(function (value, index, array) {
            switch (value) {
                case 1:
                    cc.loader.loadResDir("images/gameUI/pic/animal", cc.SpriteFrame, function (err, assets, urls) {
                        if (!err) {
                            for (var i = 0; i < assets.length; i++) {
                                this.sourceSFArr.push(assets[i]);
                            }
                            num++;
                            if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                                this.loadDirSFArr();
                            }
                        }
                    }.bind(_this));
                    break;
                case 2:
                    cc.loader.loadResDir("images/gameUI/pic/food", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 3:
                    cc.loader.loadResDir("images/gameUI/pic/figure", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 4:
                    cc.loader.loadResDir("images/gameUI/pic/dailyuse", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 5:
                    cc.loader.loadResDir("images/gameUI/pic/number", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 6:
                    cc.loader.loadResDir("images/gameUI/pic/stationery", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 7:
                    cc.loader.loadResDir("images/gameUI/pic/clothes", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                case 8:
                    cc.loader.loadResDir("images/gameUI/pic/letter", cc.SpriteFrame, function (err, assets, urls) {
                        for (var i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                        }
                        num++;
                        if (num == DaAnData_1.DaAnData.getInstance().picArr.length) {
                            this.loadDirSFArr();
                        }
                    }.bind(_this));
                    break;
                default:
                    break;
            }
        });
    };
    GamePanel.prototype.loadDirSFArr = function () {
        var totalNum = this.horizonNum * this.verticalNum;
        for (var i = 0; i < totalNum; i++) {
            var randomNum_1 = this.getRandomNum(0, this.sourceSFArr.length - 1);
            this.dirSFNumArr[i] = randomNum_1;
        }
        if (this.answerNum == 1) {
            var num = this.getRandomNum(0, totalNum - 1);
            var randomNum = this.dirSFNumArr[num];
            for (var i = 0; i < this.dirSFNumArr.length; i++) {
                if (this.dirSFNumArr[i] == randomNum) {
                    var sfNum = this.dirSFNumArr[i];
                    this.answerPosNumArr.push(i);
                    this.answerSFNumArr.push(sfNum);
                }
            }
            this.rightNum = this.answerPosNumArr.length;
        }
        else {
            var num = this.getRandomNum(0, totalNum - 1);
            var num1 = 0;
            var num2 = 0;
            var num3 = 0;
            if (num + this.horizonNum <= totalNum - 1) {
                num1 = num + this.horizonNum;
                if (num + 1 <= Math.ceil(num / this.horizonNum) * this.horizonNum - 1) {
                    num2 = num + this.horizonNum + 1;
                    num3 = num + 1;
                    this.answerPosNumArr[0] = num;
                    this.answerPosNumArr[1] = num3;
                    this.answerPosNumArr[2] = num1;
                    this.answerPosNumArr[3] = num2;
                }
                else {
                    num2 = num + this.horizonNum - 1;
                    num3 = num - 1;
                    this.answerPosNumArr[0] = num3;
                    this.answerPosNumArr[1] = num;
                    this.answerPosNumArr[2] = num2;
                    this.answerPosNumArr[3] = num1;
                }
            }
            else {
                num1 = num - this.horizonNum;
                if (num + 1 <= Math.ceil(num / this.horizonNum) * this.horizonNum - 1) {
                    num2 = num - this.horizonNum + 1;
                    num3 = num + 1;
                    this.answerPosNumArr[0] = num1;
                    this.answerPosNumArr[1] = num2;
                    this.answerPosNumArr[2] = num;
                    this.answerPosNumArr[3] = num3;
                }
                else {
                    num2 = num - this.horizonNum - 1;
                    num3 = num - 1;
                    this.answerPosNumArr[0] = num2;
                    this.answerPosNumArr[1] = num1;
                    this.answerPosNumArr[2] = num3;
                    this.answerPosNumArr[3] = num;
                }
            }
            this.answerSFNumArr[0] = this.dirSFNumArr[this.answerPosNumArr[0]];
            this.answerSFNumArr[1] = this.dirSFNumArr[this.answerPosNumArr[1]];
            this.answerSFNumArr[2] = this.dirSFNumArr[this.answerPosNumArr[2]];
            this.answerSFNumArr[3] = this.dirSFNumArr[this.answerPosNumArr[3]];
        }
        this.creatAnswerBoard();
        this.creatPicBoard();
    };
    GamePanel.prototype.getRandomNum = function (min, max) {
        var range = max - min;
        var rand = Math.random();
        return (min + Math.round(rand * range));
    };
    GamePanel.prototype.creatPicBoard = function () {
        this.creatBoard(this.horizonNum, this.verticalNum, this.picBoard, false);
    };
    GamePanel.prototype.creatAnswerBoard = function () {
        switch (this.answerNum) {
            case 1:
                this.creatBoard(1, 1, this.answerBoard, true);
                break;
            case 4:
                this.creatBoard(2, 2, this.answerBoard, true);
                break;
            default:
                break;
        }
    };
    GamePanel.prototype.creatBoard = function (horizonNum, verticalNum, board, isAnswer) {
        for (var v = 0; v < verticalNum; v++) {
            for (var h = 0; h < horizonNum; h++) {
                var item = void 0;
                var num = v * horizonNum + h;
                var x = h * 175 + 175 / 2;
                var y = v * 175 + 175 / 2;
                var ischange = false;
                if (horizonNum % 2) {
                    if (num % 2) {
                        ischange = true;
                    }
                }
                else {
                    if (v % 2) {
                        if (num % 2 == 0) {
                            ischange = true;
                        }
                    }
                    else {
                        if (num % 2 != 0) {
                            ischange = true;
                        }
                    }
                }
                this.creatItem(num, cc.v2(x, y), ischange, board, isAnswer);
            }
        }
        var width = horizonNum * 175;
        var height = verticalNum * 175;
        board.getChildByName("bg").width = width + 20;
        board.getChildByName("bg").height = height + 20;
        board.getChildByName("node").x = -width / 2;
        board.getChildByName("node").y = -height / 2;
    };
    GamePanel.prototype.creatItem = function (num, pos, isChange, board, isAnswer) {
        var item;
        cc.loader.loadRes("prefab/ui/Item/picItem", function (err, prefab) {
            if (err) {
            }
            else {
                item = cc.instantiate(prefab);
                if (isChange) {
                    cc.loader.loadRes("images/gameUI/shen", cc.SpriteFrame, function (err, spriteFrame) {
                        if (err) {
                        }
                        else {
                            item.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        }
                    }.bind(this));
                }
                if (isAnswer) {
                    this.answerItemArr[num] = item;
                    this.creatItemNum++;
                    this.action(this.creatItemNum);
                    item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.answerSFNumArr[num]];
                }
                else {
                    this.itemArr[num] = item;
                    this.creatItemNum++;
                    this.action(this.creatItemNum);
                    item.getChildByName("bg").on(cc.Node.EventType.TOUCH_START, function (t) {
                        var _this = this;
                        if (item.getChildByName("box").active == false) {
                            //if(this.playerItemArr.length < this.rightNum) {
                            //if(this.playerItemSFArr.indexOf(this.dirSFNumArr[num]) == -1) {
                            if (item.getChildByName("bg").getComponent(cc.Sprite).getState() != 1) {
                                AudioManager_1.AudioManager.getInstance().playSound("click", false);
                                item.getChildByName("box").active = true;
                                item.zIndex = 10;
                                this.playerItemArr.push(num);
                                this.playerItemSFArr.push(this.dirSFNumArr[num]);
                            }
                            //}
                            //}
                        }
                        else {
                            if (this.playerItemArr.length > 0) {
                                AudioManager_1.AudioManager.getInstance().playSound("click", false);
                                item.getChildByName("box").active = false;
                                item.zIndex = 0;
                                this.playerItemArr = this.playerItemArr.filter(function (item) { return item !== num; });
                                this.playerItemSFArr = this.playerItemSFArr.filter(function (item) { return item != _this.dirSFNumArr[num]; });
                            }
                        }
                    }.bind(this), this);
                    item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.dirSFNumArr[num]];
                }
                item.setPosition(pos);
                item.parent = board.getChildByName("node");
            }
        }.bind(this));
    };
    GamePanel.prototype.cueAnswer = function () {
        var _this = this;
        for (var i = 0; i < this.playerItemArr.length; i++) {
            if (this.answerPosNumArr.indexOf(this.playerItemArr[i]) == -1) {
                this.itemArr[this.playerItemArr[i]].getChildByName("bg").getComponent(cc.Sprite).setState(1);
                this.itemArr[this.playerItemArr[i]].getChildByName("pic").getComponent(cc.Sprite).setState(1);
            }
        }
        for (var i = 0; i < this.answerPosNumArr.length; i++) {
            if (this.playerItemArr.indexOf(this.answerPosNumArr[i]) == -1) {
                var seq;
                if (this.cueNum == 3) {
                    seq = cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2));
                }
                else if (this.cueNum > 3) {
                    seq = cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.2));
                }
                this.itemArr[this.answerPosNumArr[i]].runAction(seq);
            }
        }
        this.playerErroArr = this.answerSFNumArr;
        var _loop_1 = function (i) {
            this_1.playerErroArr = this_1.playerErroArr.filter(function (item) { return item != _this.dirSFNumArr[_this.playerItemArr[i]]; });
        };
        var this_1 = this;
        for (var i = 0; i < this.playerItemArr.length; i++) {
            _loop_1(i);
        }
        for (var i = 0; i < this.playerErroArr.length; i++) {
            var index = this.answerSFNumArr.indexOf(this.playerErroArr[i]);
            var seq;
            if (this.cueNum == 3) {
                seq = cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2));
            }
            else if (this.cueNum > 3) {
                seq = cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.2));
            }
            this.itemArr[this.answerPosNumArr[index]].runAction(seq);
            AudioManager_1.AudioManager.getInstance().playSound("erro", false);
        }
    };
    GamePanel.prototype.reset = function () {
        if (this.playerItemArr.length == 0) {
            return;
        }
        for (var i = 0; i < this.answerNum; i++) {
            this.itemArr[this.playerItemArr[i]].getChildByName("box").active = false;
            this.itemArr[this.playerItemArr[i]].zIndex = 0;
        }
        this.playerItemArr = [];
        this.cueNum = 0;
    };
    GamePanel.prototype.nextCheckPoints = function () {
        for (var i = 0; i < this.itemArr.length; i++) {
            this.itemArr[i].destroy();
        }
        for (var j = 0; j < this.answerItemArr.length; j++) {
            this.answerItemArr[j].destroy();
        }
        this.answerPosNumArr = [];
        this.answerSFNumArr = [];
        this.answerItemArr = [];
        this.itemArr = [];
        this.dirSFNumArr = [];
        this.playerItemArr = [];
        this.playerErroArr = [];
        this.playerItemSFArr = [];
        this.cueNum = 0;
        this.loadDirSFArr();
        this.creatPicBoard();
        this.creatAnswerBoard();
        this.label1.string = String(this.checkpoints + 1);
    };
    GamePanel.prototype.submisson = function () {
        if (this.playerItemArr.length == 0) {
            return;
        }
        var rightNum = 0;
        for (var i = 0; i < this.playerItemArr.length; i++) {
            if (this.answerPosNumArr.indexOf(this.playerItemArr[i]) != -1) {
                rightNum++;
            }
        }
        if (rightNum == this.rightNum && this.playerItemArr.length == this.rightNum) {
            this.checkpoints++;
            if (this.checkpoints < this.checkpointsNum) {
                UIHelp_1.UIHelp.showTip("答对了，你真棒！");
                this.nextCheckPoints();
            }
            else {
                UIHelp_1.UIHelp.showTip("闯关成功！");
                if (ConstValue_1.ConstValue.IS_TEACHER) {
                    this.submit.node.active = true;
                }
                this.layout.node.on(cc.Node.EventType.TOUCH_START, function (e) {
                    e.stopPropagation();
                });
                //this.submit.interactable = true;
            }
        }
        else {
            this.cueNum++;
            if (this.cueNum == 3) {
                //UIHelp.showTip("----------啊哦，请再试试吧。");
                this.cueAnswer();
            }
            else if (this.cueNum > 3) {
                this.cueAnswer();
            }
            else {
                UIHelp_1.UIHelp.showTip("啊哦，请再试试吧。");
            }
        }
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var data = JSON.parse(response_data.data.courseware_content);
                    if (data.types) {
                        DaAnData_1.DaAnData.getInstance().types = data.types;
                    }
                    if (data.checkpointsNum) {
                        DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    }
                    if (data.range) {
                        DaAnData_1.DaAnData.getInstance().range = data.range;
                    }
                    if (data.picArr) {
                        DaAnData_1.DaAnData.getInstance().picArr = data.picArr;
                    }
                    this.initData();
                    this.loadSourcePFArr();
                    this.creatPicBoard();
                    this.creatAnswerBoard();
                }
            }
        }.bind(this), null);
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
        property(cc.Label)
    ], GamePanel.prototype, "label1", void 0);
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "label2", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "back", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "submit", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "bg", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "picBoard", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "answerBoard", void 0);
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "board", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "sure", void 0);
    __decorate([
        property([cc.SpriteFrame])
    ], GamePanel.prototype, "sourceSFArr", void 0);
    __decorate([
        property([cc.Node])
    ], GamePanel.prototype, "itemArr", void 0);
    __decorate([
        property([cc.Node])
    ], GamePanel.prototype, "answerItemArr", void 0);
    __decorate([
        property(cc.Layout)
    ], GamePanel.prototype, "layout", void 0);
    GamePanel = GamePanel_1 = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();