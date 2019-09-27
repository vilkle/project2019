(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/GamePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel', __filename);
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
var DaAnData_1 = require("../../Data/DaAnData");
var UIHelp_1 = require("../../Utils/UIHelp");
var AudioManager_1 = require("../../Manager/AudioManager");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var UploadAndReturnPanel_1 = require("../panel/UploadAndReturnPanel");
var DataReporting_1 = require("../../Data/DataReporting");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.countLabel = null;
        _this.egg = null;
        _this.layoutTop = null;
        _this.layoutBottom = null;
        _this.btnSure = null;
        _this.bg = null;
        //元素数量
        _this.itemNumber = 10;
        //元素集合（编辑器设置的是类数组对象）
        _this.items = {};
        //正确答案的数量
        _this.answerCount = 0;
        //数量过多时的缩放比例
        _this.itemScale = 1;
        //当前游戏回合
        _this.round = 1;
        //游戏总回合
        _this.totalRound = 4;
        //回合结束
        _this.roundOver = false;
        //题干标准数
        _this.norm = 20;
        //题干类型 -> 大于:1, 小于:2, 不小于:3, 不大于:4
        _this.type = 1;
        //已选答案中的错误数量
        _this.errorAnswer = 0;
        //元素点击音效需要交叉播放
        _this.audioCount = true;
        //数据上报标记
        _this.submitCourse = true;
        //提交按钮是否禁用
        _this.disabled = false;
        //已选元素集合
        _this.selection = [];
        _this.answerArr = [];
        _this.subjectArr = [];
        _this.kaiShiZuoDa = false;
        _this.daTiData = [];
        _this.gameOver = false;
        //当前操作过的游戏回合
        _this.caoZuoRound = 0;
        _this.isOver = 2;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 1,
            levelData: [],
            result: 4
        };
        return _this;
    }
    //初始化
    GamePanel.prototype.handleInitItems = function (num) {
        this.setCountRound(this.round);
        // 区分奇偶
        var n = num & 1 ? (num + 1) / 2 : num / 2;
        this.itemScale = 15 - n > 10 ? 1 : (15 - n) / 10;
        this.layoutTop.spacingX = this.layoutBottom.spacingX = this.setSpacingX(n);
        this.addLayoutItem(0, n, this.layoutTop);
        this.addLayoutItem(n, this.itemNumber, this.layoutBottom);
        this.answerCount = this.getAnswerCount();
    };
    //计算正确答案的数量，用于判断是否漏选
    GamePanel.prototype.getAnswerCount = function () {
        this.answerArr = [];
        var num = 0;
        for (var i in this.items) {
            if (~~i > (this.itemNumber - 1))
                continue;
            this.checkAnswer(this.items[i]) && num++;
            if (this.checkAnswer(this.items[i])) {
                this.answerArr.push(this.items[i]);
            }
        }
        console.log(this.round);
        this.eventvalue.levelData[this.round - 1].answer = this.answerArr.slice();
        return num;
    };
    //计算元素之间的间距
    GamePanel.prototype.setSpacingX = function (n) {
        return 5 * n * n - 105 * n + 495;
    };
    // 向 layout 中添加 item
    GamePanel.prototype.addLayoutItem = function (min, max, layout) {
        for (var i = min; i < max; i++) {
            var item = cc.instantiate(this.egg);
            var egg = item.getComponent('egg');
            egg.text = this.items[i];
            // 根据数量缩放元素
            item.scale = this.itemScale;
            // 调整元素阴影的缩放 防止穿帮
            item.getComponent('egg').shadowDisplay.scaleY = 3.9 - 3 * this.itemScale;
            layout.node.addChild(item);
        }
    };
    //点击元素
    GamePanel.prototype.handleItemSelect = function (event) {
        this.caoZuoRound = this.round;
        if (this.roundOver)
            return;
        // 数据上报
        // if (this.submitCourse) {
        //     courseware.page.sendToParent('addLog', { eventType: 'clickStart' }) 
        //     this.submitCourse = false
        // }
        this.kaiShiZuoDa = true;
        var item = event.target.getComponent('egg');
        item.selected = !item.selected;
        item.handleClickCallback();
        //更新已选集合
        if (item.selected) {
            // 交叉播放音效
            var audioName = this.audioCount ? 'sfx_egg01' : 'sfx_egg02';
            AudioManager_1.AudioManager.getInstance().playSound(audioName);
            this.audioCount = !this.audioCount;
            // 选中
            this.selection.push(event.target);
            item.bingo = this.checkAnswer(item.text);
            if (!item.bingo)
                this.errorAnswer++;
        }
        else {
            AudioManager_1.AudioManager.getInstance().playSound('sfx_cancel');
            // 取消选中
            var i = this.selection.indexOf(event.target);
            i > -1 && this.selection.splice(i, 1);
            if (!item.bingo)
                this.errorAnswer--;
        }
        this.subjectArr = [];
        for (var _i = 0, _a = this.selection; _i < _a.length; _i++) {
            var it = _a[_i];
            this.subjectArr.push(it.getComponent('egg').text);
        }
        this.isOver = 2;
        this.eventvalue.result = 2;
        this.eventvalue.levelData[this.round - 1].result = 2;
        this.eventvalue.levelData[this.round - 1].subject = this.subjectArr.slice();
        console.log(this.eventvalue);
        this.showButton();
    };
    //切换按钮状态
    GamePanel.prototype.showButton = function () {
        this.btnSure.interactable = this.selection.length > 0 && !this.roundOver;
    };
    //确认选择
    GamePanel.prototype.handleButtonClick = function (event) {
        var _this = this;
        // 防止多次点击
        if (this.disabled)
            return;
        this.disabled = true;
        // 播放按钮音效
        AudioManager_1.AudioManager.getInstance().playSound('sfx_gou');
        this.roundOver = true;
        //根据答案数量和回答情况判断是否全对
        var count = this.answerCount == this.selection.length;
        var bingo = this.errorAnswer == 0 && count;
        for (var _i = 0, _a = this.selection; _i < _a.length; _i++) {
            var i = _a[_i];
            var item = i.getComponent('egg');
            item.handleGameOver(bingo);
        }
        this.btnSure.interactable = !bingo;
        //播放破蛋音效
        var audioName = bingo ? 'sfx_allright' : 'sfx_fewright';
        AudioManager_1.AudioManager.getInstance().playSound(audioName);
        var delay = bingo ? 2000 : 700;
        //动画结束后弹出机器人
        setTimeout(function () {
            _this.disabled = false;
            _this.handleRoundOver(bingo);
        }, delay);
    };
    //回合结束
    GamePanel.prototype.handleRoundOver = function (bingo) {
        if (bingo) {
            // Toast 弹窗，并进入下一回合
            if (this.totalRound > this.round) {
                this.eventvalue.levelData[this.round - 1].result = 1;
                this.round++;
                this.resetItems();
                UIHelp_1.UIHelp.showOverTip(1, '答对了！你真棒！\n再尝试一下吧 ', null, null, null, null);
                //this.setToast('答对了！你真棒！\n再尝试一下吧 ', 0);
                this.daTiData.push('1');
            }
            else {
                this.isOver = 1;
                this.eventvalue.result = 1;
                this.eventvalue.levelData[this.round - 1].result = 1;
                DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                console.log(this.eventvalue);
                this.daTiData.push('1');
                this.gameOver = true;
                DaAnData_1.DaAnData.getInstance().submitEnable = true;
                UIHelp_1.UIHelp.showOverTip(2, '你真棒！闯关成功！', null, null, null, '闯关成功');
                this.shuJuShangBao();
                // courseware.page.sendToParent('clickSubmit', 1);
                // courseware.page.sendToParent('addLog', { eventType: 'clickSubmit', eventValue: 1 });
                // 通知编辑器启用“提交”按钮
                var obj = { great: true };
                window.parent.postMessage(JSON.stringify(obj), '*');
            }
        }
        else {
            // Toast 弹窗，不重置继续操作
            this.roundOver = false;
            UIHelp_1.UIHelp.showOverTip(0, '啊哦，请再试一试～', null, null, null, null);
        }
    };
    //关闭弹窗
    GamePanel.prototype.handleBoxClose = function (event) { };
    //软重置 - 只重置动画
    GamePanel.prototype.softResetItems = function () {
        this.roundOver = false;
        // 重置动画
        for (var _i = 0, _a = this.selection; _i < _a.length; _i++) {
            var i = _a[_i];
            var item = i.getComponent('egg');
            item.eggSp.skeletonData = item.spineArr[0];
            item.eggSp.setAnimation(0, 'in', false);
            item.eggSp.timeScale = 0;
        }
        this.selection = [];
        this.node.off(cc.Node.EventType.TOUCH_START, this.softResetItems, this);
    };
    //重置
    GamePanel.prototype.resetItems = function () {
        this.roundOver = false;
        this.selection = [];
        this.layoutBottom.node.removeAllChildren();
        this.layoutTop.node.removeAllChildren();
        this.items = this.initItemNumer();
        this.handleInitItems(this.itemNumber);
        console.log(this.items);
    };
    //验证答案是否正确
    GamePanel.prototype.checkAnswer = function (text) {
        var ans = Number(text);
        var res = false;
        switch (this.type) {
            case 1:
                res = ans > this.norm;
                break;
            case 2:
                res = ans < this.norm;
                break;
            case 3:
                res = ans >= this.norm;
                break;
            case 4:
                res = ans <= this.norm;
                break;
            default: break;
        }
        return res;
    };
    //随机生成题目
    GamePanel.prototype.initItemNumer = function () {
        var arr = {};
        for (var i = 0; i < this.itemNumber; i++) {
            // 生成一个 0 ~ 50 的随机数
            var item = this.setRangeRandom(0, 50);
            arr[i] = item;
        }
        //设置标准数
        var norm = this.initNormItem();
        arr[norm.index] = norm.value;
        console.log(norm);
        return arr;
    };
    //设置题干标准数
    GamePanel.prototype.initNormItem = function () {
        // 生成一个 1 ~ 8 的随机数作为标准数的波动范围
        var range = this.norm > 8 ? this.setRangeRandom(1, 8) : 1;
        var value = this.type & 1 ? this.norm + range : this.norm - range;
        var index = this.setRangeRandom(0, this.itemNumber);
        // 返回一个随机 index 的正确答案 value
        return { index: index, value: value };
    };
    //修改回合数
    GamePanel.prototype.setCountRound = function (round) {
        this.countLabel.string = this.round + "/" + this.totalRound;
    };
    //在范围内生成随机数
    GamePanel.prototype.setRangeRandom = function (min, max) {
        var _a;
        var n = max - min;
        if (n == 0) {
            return max;
        }
        else if (n < 0) {
            _a = [min, max], max = _a[0], min = _a[1];
            n = Math.abs(n);
        }
        return ((Math.random() * ++n) >> 0) + min;
    };
    // LIFE-CYCLE CALLBACKS:
    GamePanel.prototype.onLoad = function () {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        AudioManager_1.AudioManager.getInstance().playSound('sfx_12opne');
        for (var i = 0; i < 4; i++) {
            this.eventvalue.levelData.push({
                subject: [],
                answer: [],
                result: 4
            });
        }
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            this.type = DaAnData_1.DaAnData.getInstance().type;
            this.norm = parseInt(DaAnData_1.DaAnData.getInstance().norm);
            this.itemNumber = DaAnData_1.DaAnData.getInstance().count;
            this.items = DaAnData_1.DaAnData.getInstance().question.map(Number);
            this.init();
            UIManager_1.UIManager.getInstance().openUI(UploadAndReturnPanel_1.default, null, 300);
        }
        else {
            this.getNet();
        }
    };
    GamePanel.prototype.shuJuShangBao = function () {
        if (DataReporting_1.default.isRepeatReport) {
            DataReporting_1.default.isRepeatReport = false;
            DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({
                    isResult: 1,
                    isLavel: 1,
                    levelData: [
                        { subject: JSON.stringify({}), answer: JSON.stringify({}), result: this.caoZuoRound >= 1 ? (this.daTiData[0] ? this.daTiData[0] : 2) : 4 },
                        { subject: JSON.stringify({}), answer: JSON.stringify({}), result: this.caoZuoRound >= 2 ? (this.daTiData[1] ? this.daTiData[1] : 2) : 4 },
                        { subject: JSON.stringify({}), answer: JSON.stringify({}), result: this.caoZuoRound >= 3 ? (this.daTiData[2] ? this.daTiData[2] : 2) : 4 },
                        { subject: JSON.stringify({}), answer: JSON.stringify({}), result: this.caoZuoRound >= 4 ? (this.daTiData[3] ? this.daTiData[3] : 2) : 4 }
                    ],
                    result: this.kaiShiZuoDa ? (this.gameOver ? 1 : 2) : 4
                })
            });
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
    GamePanel.prototype.start = function () {
        var _this = this;
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_START, function () {
            _this.isOver = 2;
            _this.eventvalue.result = 2;
            _this.eventvalue.levelData[_this.round - 1].result = 2;
        });
    };
    // update (dt) {}
    GamePanel.prototype.init = function () {
        var _this = this;
        // this.items = this.initItemNumer();
        this.handleInitItems(this.itemNumber);
        // 监听 item 的选中事件
        this.node.on('select', function (event) {
            _this.handleItemSelect(event);
            event.stopPropagation();
        });
        // 监听 messageBox 的关闭事件
        this.node.on('close', function (event) {
            _this.handleBoxClose(event);
            event.stopPropagation();
        });
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = response;
                if (Array.isArray(response_data.data)) {
                    console.error('response_data is empty.');
                    return;
                }
                var content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if (content.type) {
                        this.type = content.type;
                        DaAnData_1.DaAnData.getInstance().type = content.type;
                    }
                    else {
                        console.error('content.type is null');
                        return;
                    }
                    if (content.norm) {
                        this.norm = parseInt(content.norm);
                        DaAnData_1.DaAnData.getInstance().norm = content.norm;
                    }
                    else {
                        console.error('content.norm is null');
                        return;
                    }
                    if (content.count) {
                        this.itemNumber = content.count;
                        DaAnData_1.DaAnData.getInstance().count = content.count;
                    }
                    else {
                        console.error('content.count is null');
                        return;
                    }
                    if (content.question) {
                        this.items = [];
                        DaAnData_1.DaAnData.getInstance().question = [];
                        for (var i in content.question) {
                            var num = parseInt(content.question[i]);
                            this.items[i] = num;
                            DaAnData_1.DaAnData.getInstance().question[i] = num.toString();
                        }
                    }
                    else {
                        console.error('content.question is null');
                        return;
                    }
                    this.init();
                }
            }
            else {
                console.error('content is null');
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Label)
    ], GamePanel.prototype, "countLabel", void 0);
    __decorate([
        property(cc.Prefab)
    ], GamePanel.prototype, "egg", void 0);
    __decorate([
        property(cc.Layout)
    ], GamePanel.prototype, "layoutTop", void 0);
    __decorate([
        property(cc.Layout)
    ], GamePanel.prototype, "layoutBottom", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "btnSure", void 0);
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
        