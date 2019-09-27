import { BaseUI } from "../BaseUI";
import {DaAnData} from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager";
import {NetWork} from "../../Http/NetWork";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import {OverTips} from "../../UI/Item/OverTips"
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    protected static className = "GamePanel";
    @property(cc.Label)
    countLabel: cc.Label = null;

    @property(cc.Prefab)
    egg: cc.Prefab = null;

    @property(cc.Layout)
    layoutTop: cc.Layout = null;

    @property(cc.Layout)
    layoutBottom: cc.Layout = null;

    @property(cc.Button)
    btnSure: cc.Button = null;

    @property(cc.Node)
    bg: cc.Node = null
    //元素数量
    itemNumber: number = 10;
    //元素集合（编辑器设置的是类数组对象）
    items: Object | Array<number> = {};
    //正确答案的数量
    answerCount: number = 0;
    //数量过多时的缩放比例
    itemScale: number = 1;
    //当前游戏回合
    round: number = 1;
    //游戏总回合
    totalRound: number = 4;
    //回合结束
    roundOver: boolean = false;
    //题干标准数
    norm: number = 20;
    //题干类型 -> 大于:1, 小于:2, 不小于:3, 不大于:4
    type: number = 1;
    //已选答案中的错误数量
    errorAnswer: number = 0;
    //元素点击音效需要交叉播放
    audioCount: boolean = true;
    //数据上报标记
    submitCourse: boolean = true;
    //提交按钮是否禁用
    disabled: boolean = false;
    //已选元素集合
    selection: Array<cc.Node> = [];
    answerArr: number[] = []
    subjectArr: number[] = []
    kaiShiZuoDa: boolean = false;
    daTiData = [];
    gameOver: boolean = false;
    //当前操作过的游戏回合
    caoZuoRound: number = 0;
    private isOver : number = 2;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    //初始化
    handleInitItems(num: number) {
        this.setCountRound(this.round);
        // 区分奇偶
        let n = num & 1 ? (num + 1) / 2 : num / 2;
        this.itemScale = 15 - n > 10 ? 1 : (15 - n) / 10;
        this.layoutTop.spacingX = this.layoutBottom.spacingX = this.setSpacingX(n);
        this.addLayoutItem(0, n, this.layoutTop);
        this.addLayoutItem(n, this.itemNumber, this.layoutBottom);
        this.answerCount = this.getAnswerCount();
    }

    //计算正确答案的数量，用于判断是否漏选
    getAnswerCount() {
        this.answerArr = []
        let num = 0;
        for (let i in this.items) {
            if (~~i > (this.itemNumber - 1)) continue
            this.checkAnswer(this.items[i]) && num++;
            if(this.checkAnswer(this.items[i])) {
                this.answerArr.push(this.items[i])
            }
        }
        console.log(this.round)
        this.eventvalue.levelData[this.round-1].answer = [...this.answerArr]
    
        return num;
    }

    //计算元素之间的间距
    setSpacingX(n: number) {
        return 5 * n * n - 105 * n + 495;
    }

    // 向 layout 中添加 item
    addLayoutItem(min: number, max: number, layout: cc.Layout) {
        for (let i = min; i < max; i++) {
            let item = cc.instantiate(this.egg);
            let egg = item.getComponent('egg');
            egg.text = this.items[i];
            // 根据数量缩放元素
            item.scale = this.itemScale;
            // 调整元素阴影的缩放 防止穿帮
            item.getComponent('egg').shadowDisplay.scaleY = 3.9 - 3 * this.itemScale;
            layout.node.addChild(item);
        }
    }

    //点击元素
    handleItemSelect(event) {
        this.caoZuoRound = this.round;
        if (this.roundOver) return
        // 数据上报
        // if (this.submitCourse) {
        //     courseware.page.sendToParent('addLog', { eventType: 'clickStart' }) 
        //     this.submitCourse = false
        // }
        this.kaiShiZuoDa = true;

        let item = event.target.getComponent('egg');
        item.selected = !item.selected;
        item.handleClickCallback();
        //更新已选集合
        if (item.selected) {
            // 交叉播放音效
            let audioName = this.audioCount ? 'sfx_egg01' : 'sfx_egg02';
            AudioManager.getInstance().playSound(audioName)
            this.audioCount = !this.audioCount;
            // 选中
            this.selection.push(event.target);
            item.bingo = this.checkAnswer(item.text);
            if (!item.bingo) this.errorAnswer++;
        } else {
            AudioManager.getInstance().playSound('sfx_cancel')
            // 取消选中
            let i = this.selection.indexOf(event.target);
            i > -1 && this.selection.splice(i, 1);
            if (!item.bingo) this.errorAnswer--;
        }
        this.subjectArr = []
        for(let it of this.selection) {
            this.subjectArr.push(it.getComponent('egg').text)
        }
        this.isOver = 2
        this.eventvalue.result = 2
        this.eventvalue.levelData[this.round-1].result = 2
        this.eventvalue.levelData[this.round-1].subject = [...this.subjectArr]
        console.log(this.eventvalue)
        this.showButton();
    }

    //切换按钮状态
    showButton() {
        this.btnSure.interactable = this.selection.length > 0 && !this.roundOver;
    }

    //确认选择
    handleButtonClick(event) {
        // 防止多次点击
        if (this.disabled) return
        this.disabled = true;

        // 播放按钮音效
        AudioManager.getInstance().playSound('sfx_gou')
        this.roundOver = true;
        //根据答案数量和回答情况判断是否全对
        let count = this.answerCount == this.selection.length;
        let bingo: boolean = this.errorAnswer == 0 && count;
        for (let i of this.selection) {
            let item = i.getComponent('egg');
            item.handleGameOver(bingo);
        }
        this.btnSure.interactable = !bingo;
        //播放破蛋音效
        let audioName = bingo ? 'sfx_allright' : 'sfx_fewright';
        AudioManager.getInstance().playSound(audioName)
        let delay = bingo ? 2000 : 700;
        //动画结束后弹出机器人
        setTimeout(() => {
            this.disabled = false;
            this.handleRoundOver(bingo);
        }, delay)
    }

    //回合结束
    handleRoundOver(bingo: boolean) {
        if (bingo) {
            // Toast 弹窗，并进入下一回合
            if (this.totalRound > this.round) {
                this.eventvalue.levelData[this.round-1].result = 1
                this.round++;
                this.resetItems();
                UIHelp.showOverTip(1, '答对了！你真棒！\n再尝试一下吧 ', null, null, null, null)
                //this.setToast('答对了！你真棒！\n再尝试一下吧 ', 0);
                this.daTiData.push('1');
            } else {
                this.isOver = 1
                this.eventvalue.result = 1
                this.eventvalue.levelData[this.round-1].result = 1
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                console.log(this.eventvalue)
                this.daTiData.push('1');
                this.gameOver = true;
                DaAnData.getInstance().submitEnable = true
                UIHelp.showOverTip(2, '你真棒！闯关成功！',null, null, null, '闯关成功')
                this.shuJuShangBao();
                // courseware.page.sendToParent('clickSubmit', 1);
                // courseware.page.sendToParent('addLog', { eventType: 'clickSubmit', eventValue: 1 });
                // 通知编辑器启用“提交”按钮
                let obj = { great: true };
                window.parent.postMessage(JSON.stringify(obj), '*');
            }
        } else {
            // Toast 弹窗，不重置继续操作
            this.roundOver = false;
            UIHelp.showOverTip(0, '啊哦，请再试一试～',null, null, null, null )
        }
    }

    //关闭弹窗
    handleBoxClose(event) { }

    //软重置 - 只重置动画
    softResetItems() {
        this.roundOver = false;
        // 重置动画
        for (let i of this.selection) {
            let item = i.getComponent('egg');
            item.eggSp.skeletonData = item.spineArr[0];
            item.eggSp.setAnimation(0, 'in', false);
            item.eggSp.timeScale = 0;
        }
        this.selection = [];
        this.node.off(cc.Node.EventType.TOUCH_START, this.softResetItems, this);
    }

    //重置
    resetItems() {
        this.roundOver = false;
        this.selection = [];
        this.layoutBottom.node.removeAllChildren();
        this.layoutTop.node.removeAllChildren();
        this.items = this.initItemNumer();
        this.handleInitItems(this.itemNumber);
        console.log(this.items)
    }

    //验证答案是否正确
    checkAnswer(text: string | number) {
        let ans = Number(text);
        let res = false;
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
    }

    //随机生成题目
    initItemNumer() {
        let arr = {};
        for (let i = 0; i < this.itemNumber; i++) {
            // 生成一个 0 ~ 50 的随机数
            let item: number | string = this.setRangeRandom(0, 50);
            arr[i] = item;
        }
        //设置标准数
        let norm = this.initNormItem();
        arr[norm.index] = norm.value;
        console.log(norm)
        return arr;
    }

    //设置题干标准数
    initNormItem() {
        // 生成一个 1 ~ 8 的随机数作为标准数的波动范围
        let range = this.norm > 8 ? this.setRangeRandom(1, 8) : 1;
        let value: number = this.type & 1 ? this.norm + range : this.norm - range;
        let index = this.setRangeRandom(0, this.itemNumber);
        // 返回一个随机 index 的正确答案 value
        return { index, value }
    }

    //修改回合数
    setCountRound(round: number) {
        this.countLabel.string = `${this.round}\/${this.totalRound}`
    }

    //在范围内生成随机数
    setRangeRandom(min: number, max: number) {
        let n = max - min;
        if (n == 0) {
            return max
        } else if (n < 0) {
            [max, min] = [min, max];
            n = Math.abs(n);
        }

        return ((Math.random() * ++n) >> 0) + min;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        AudioManager.getInstance().playSound('sfx_12opne')
        for(let i = 0; i < 4; i++) {
            this.eventvalue.levelData.push({
                subject: [],
                answer: [],
                result: 4
            });
        }
        if(ConstValue.IS_TEACHER) {
            this.type = DaAnData.getInstance().type
            this.norm = parseInt(DaAnData.getInstance().norm) 
            this.itemNumber = DaAnData.getInstance().count
            this.items = DaAnData.getInstance().question.map(Number)
            this.init()
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 300)
        }else {
            this.getNet()
        }
    }

    shuJuShangBao() {
        if (DataReporting.isRepeatReport) {
            DataReporting.isRepeatReport = false;
            DataReporting.getInstance().dispatchEvent('addLog', {
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
            })
        }
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        
        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.isOver = 2;
            this.eventvalue.result = 2
            this.eventvalue.levelData[this.round-1].result = 2
        });
      
    }
    // update (dt) {}

    init() {
          // this.items = this.initItemNumer();
          this.handleInitItems(this.itemNumber);
          // 监听 item 的选中事件
          this.node.on('select', (event) => {
              this.handleItemSelect(event);
              event.stopPropagation();
          });
          // 监听 messageBox 的关闭事件
          this.node.on('close', (event) => {
              this.handleBoxClose(event);
              event.stopPropagation();
          });
    }

getNet() {
    NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
        if (!err) {
            let response_data = response;
            if (Array.isArray(response_data.data)) {
                console.error('response_data is empty.')
                return;
            }
            let content = JSON.parse(response_data.data.courseware_content);
            if (content != null) {
                if(content.type) {
                    this.type = content.type
                    DaAnData.getInstance().type = content.type
                }else {
                    console.error('content.type is null')
                    return
                }
                if(content.norm) {
                    this.norm = parseInt(content.norm)
                    DaAnData.getInstance().norm = content.norm
                }else {
                    console.error('content.norm is null')
                    return
                }
                if(content.count) {
                    this.itemNumber = content.count
                    DaAnData.getInstance().count = content.count
                }else {
                    console.error('content.count is null')
                    return
                }
                if(content.question) {
                    this.items = []
                    DaAnData.getInstance().question = []
                    for(let i in content.question) {
                        let num = parseInt(content.question[i])
                        this.items[i] = num
                        DaAnData.getInstance().question[i] = num.toString()
                    }
                }else {
                    console.error('content.question is null')
                    return
                }
                this.init()
            }
        } else {
           console.error('content is null')
        }
    }.bind(this), null);
}


}
