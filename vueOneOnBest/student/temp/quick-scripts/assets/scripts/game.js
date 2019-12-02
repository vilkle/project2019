(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7384bGn8U5JVZApf54dkmn1', 'game', __filename);
// scripts/game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DataReporting_1 = require("./Data/DataReporting");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.countLabel = null;
        _this.egg = null;
        _this.messageBox = null;
        _this.layoutTop = null;
        _this.layoutBottom = null;
        _this.btnSure = null;
        _this.audioLoad = null;
        _this.audioBtnSure = null;
        _this.audioAllRight = null;
        _this.audioError = null;
        _this.audioCancel = null;
        _this.audioSelect_1 = null;
        _this.audioSelect_2 = null;
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
        _this.kaiShiZuoDa = false;
        _this.daTiData = [];
        _this.gameOver = false;
        //当前操作过的游戏回合
        _this.caoZuoRound = 0;
        return _this;
        // update (dt) {}
    }
    //初始化
    Game.prototype.handleInitItems = function (num) {
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
    Game.prototype.getAnswerCount = function () {
        var num = 0;
        for (var i in this.items) {
            if (~~i > (this.itemNumber - 1))
                continue;
            this.checkAnswer(this.items[i]) && num++;
        }
        return num;
    };
    //计算元素之间的间距
    Game.prototype.setSpacingX = function (n) {
        return 5 * n * n - 105 * n + 495;
    };
    // 向 layout 中添加 item
    Game.prototype.addLayoutItem = function (min, max, layout) {
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
    Game.prototype.handleItemSelect = function (event) {
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
            var audioName = this.audioCount ? 'audioSelect_1' : 'audioSelect_2';
            cc.audioEngine.playEffect(this[audioName], false);
            this.audioCount = !this.audioCount;
            // 选中
            this.selection.push(event.target);
            item.bingo = this.checkAnswer(item.text);
            if (!item.bingo)
                this.errorAnswer++;
        }
        else {
            cc.audioEngine.playEffect(this.audioCancel, false);
            // 取消选中
            var i = this.selection.indexOf(event.target);
            i > -1 && this.selection.splice(i, 1);
            if (!item.bingo)
                this.errorAnswer--;
        }
        this.showButton();
    };
    //切换按钮状态
    Game.prototype.showButton = function () {
        this.btnSure.interactable = this.selection.length > 0 && !this.roundOver;
    };
    //确认选择
    Game.prototype.handleButtonClick = function (event) {
        var _this = this;
        // 防止多次点击
        if (this.disabled)
            return;
        this.disabled = true;
        // 播放按钮音效
        cc.audioEngine.playEffect(this.audioBtnSure, false);
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
        var audioName = bingo ? 'audioAllRight' : 'audioError';
        cc.audioEngine.playEffect(this[audioName], false);
        var delay = bingo ? 2000 : 700;
        //动画结束后弹出机器人
        setTimeout(function () {
            _this.disabled = false;
            _this.handleRoundOver(bingo);
        }, delay);
    };
    //回合结束
    Game.prototype.handleRoundOver = function (bingo) {
        if (bingo) {
            // Toast 弹窗，并进入下一回合
            if (this.totalRound > this.round) {
                this.round++;
                this.resetItems();
                this.setToast('答对了！你真棒！\n再尝试一下吧 ', 0);
                this.daTiData.push('1');
            }
            else {
                this.daTiData.push('1');
                this.gameOver = true;
                this.setToast('你真棒！闯关成功！', 1, true);
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
            this.setToast('啊哦，请再试一试～', 2);
        }
    };
    //关闭弹窗
    Game.prototype.handleBoxClose = function (event) { };
    //软重置 - 只重置动画
    Game.prototype.softResetItems = function () {
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
    Game.prototype.resetItems = function () {
        this.roundOver = false;
        this.selection = [];
        this.layoutBottom.node.removeAllChildren();
        this.layoutTop.node.removeAllChildren();
        this.items = this.initItemNumer();
        this.handleInitItems(this.itemNumber);
    };
    //验证答案是否正确
    Game.prototype.checkAnswer = function (text) {
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
    Game.prototype.initItemNumer = function () {
        var arr = {};
        for (var i = 0; i < this.itemNumber; i++) {
            // 生成一个 0 ~ 50 的随机数
            var item = this.setRangeRandom(0, 50);
            arr[i] = item;
        }
        //设置标准数
        var norm = this.initNormItem();
        arr[norm.index] = norm.value;
        return arr;
    };
    //设置题干标准数
    Game.prototype.initNormItem = function () {
        // 生成一个 1 ~ 8 的随机数作为标准数的波动范围
        var range = this.norm > 8 ? this.setRangeRandom(1, 8) : 1;
        var value = this.type & 1 ? this.norm + range : this.norm - range;
        var index = this.setRangeRandom(0, this.itemNumber);
        // 返回一个随机 index 的正确答案 value
        return { index: index, value: value };
    };
    //修改回合数
    Game.prototype.setCountRound = function (round) {
        this.countLabel.string = this.round + "/" + this.totalRound;
    };
    //在范围内生成随机数
    Game.prototype.setRangeRandom = function (min, max) {
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
    //创建tips
    Game.prototype.setToast = function (str, right, buXuGuanBi) {
        if (right === void 0) { right = 0; }
        var m = cc.instantiate(this.messageBox);
        m.getComponent('box').text = str;
        m.getComponent('box').right = right;
        m.getComponent('box').buXuGuanBi = buXuGuanBi;
        this.node.addChild(m);
    };
    // LIFE-CYCLE CALLBACKS:
    Game.prototype.onLoad = function () {
        cc.audioEngine.playMusic(this.audioLoad, false);
    };
    Game.prototype.shuJuShangBao = function () {
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
    Game.prototype.onEndGame = function () {
        this.shuJuShangBao();
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.kaiShiZuoDa ? (this.gameOver ? 1 : 2) : 0 });
    };
    Game.prototype.start = function () {
        var _this = this;
        DataReporting_1.default.getInstance().dispatchEvent("start");
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
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
    __decorate([
        property(cc.Label)
    ], Game.prototype, "countLabel", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "egg", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "messageBox", void 0);
    __decorate([
        property(cc.Layout)
    ], Game.prototype, "layoutTop", void 0);
    __decorate([
        property(cc.Layout)
    ], Game.prototype, "layoutBottom", void 0);
    __decorate([
        property(cc.Button)
    ], Game.prototype, "btnSure", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioLoad", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioBtnSure", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioAllRight", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioError", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioCancel", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioSelect_1", void 0);
    __decorate([
        property(cc.audioEngine)
    ], Game.prototype, "audioSelect_2", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

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
        //# sourceMappingURL=game.js.map
        