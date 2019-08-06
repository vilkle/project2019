import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Node)
    private diamondNode: cc.Node = null;
    @property(cc.Node)
    private touchNode: cc.Node = null;
    @property(sp.Skeleton)
    private miya: sp.Skeleton = null;
    @property(sp.Skeleton)
    private light1: sp.Skeleton = null;
    @property(cc.Node)
    private goods: cc.Node = null;
    @property(cc.Prefab)
    private slotPrefab = null;
    @property(cc.Node)
    private slotNode: cc.Node = null;
    @property(cc.SpriteFrame)
    private ball: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bottle: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private crown: cc.SpriteFrame = null;
    @property(cc.Node)
    private bubble: cc.Node = null;
    @property(cc.Label)
    private countLabel: cc.Label = null
   

    private checkpointsNum: number = 0;
    private countsArr: number[] = [];
    private goodsArr: number[] = [];
    private slotArr: cc.Node[] = [];
    private answerArr: number[] = [];
    private checkpointIndex: number = 1;
    private touchTarget: any = null;
    private overNum: number = 0;

    start() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel)
            this.checkpointsNum = DaAnData.getInstance().checkpointsNum
            this.countsArr = DaAnData.getInstance().countsArr
            this.goodsArr = DaAnData.getInstance().goodsArr
            this.startAction();
            this.addSlot()
        }else {
            this.getNet();
        }
        for(let i = 0; i < this.diamondNode.children.length; i++) {
            for(let j = 0; j < this.diamondNode.children[i].children.length; j++) {
              this.diamondNode.children[i].children[j].opacity = 0;
            }
        }
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        DaAnData.getInstance().submitEnable = true;
    }

    onLoad() {
       
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    startAction() {
        for(let i = 0; i < this.diamondNode.children.length; i++) {
            for(let j = 0; j < this.diamondNode.children[i].children.length; j++) {
                this.diamondNode.children[i].children[j].active = true
                setTimeout(() => {
                    this.diamondNode.children[i].children[j].runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(0.2),cc.callFunc(()=>{
                       this.diamondNode.children[i].children[j].children[0].active = false; 
                    })))
                }, j * 100);
            }
        }
        this.addListenerOnDiamond()
        this.magic()
    }

    magic() {
        this.goods.active = false
        if(this.goodsArr[this.checkpointIndex-1] == 0) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.ball
        }else if(this.goodsArr[this.checkpointIndex-1] == 1) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.bottle
        }else if(this.goodsArr[this.checkpointIndex-1] == 2) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.crown
        }
        this.miya.setAnimation(0, 'boom', false)
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'boom') {
                if(this.goodsArr[this.checkpointIndex-1]==0) {
                    this.talk(`想要皮球么？给我${this.countsArr[this.checkpointIndex-1]}个钻石吧！`)
                }else if(this.goodsArr[this.checkpointIndex-1]==1) {
                    this.talk(`想要酒瓶么？给我${this.countsArr[this.checkpointIndex-1]}个钻石吧！`)
                }else if(this.goodsArr[this.checkpointIndex-1]==2) {
                    this.talk(`想要王冠么？给我${this.countsArr[this.checkpointIndex-1]}个钻石吧！`)
                }
            }
        })
        setTimeout(() => {
            this.light1.node.active = true
            this.light1.setAnimation(0, 'magic_01', false)
            this.light1.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'magic_01') {
                    this.light1.node.active = false;     
                }
            })
        }, 500)
        setTimeout(() => {
            this.goods.active = true
            this.countLabel.string = this.countsArr[this.checkpointIndex-1].toString()
        }, 1000);
    }

    talk(str: string){
        this.bubble.getChildByName('label').getComponent(cc.Label).string = str
        this.miya.setAnimation(0, 'talk_02', false)
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'talk_02') {
                this.miya.setAnimation(0, 'idle', true)
            }
        })
        this.bubble.runAction(cc.scaleTo(0.3, 1,1)) 
    }

    addSlot() {
        var temp = this.countsArr[this.checkpointIndex]
        var result =  temp / 10
        var sum = temp % 10
        while(result >= 1.0){
            temp = Math.floor(temp / 10) 
            result = temp / 10
            sum += temp % 10
        }

        var space = 190 
        var midX = 350

        if(sum <= 7) {
            let y = -27
            let startX = midX - sum * space / 2
            for(let i = 0; i < sum; i++) {
                let node = cc.instantiate(this.slotPrefab)
                this.slotArr.push(node)
                this.slotNode.addChild(node)
                let x = startX + i * space
                node.setPosition(cc.v2(x, y))
            }
        }else {
            let yUp = 70
            let yDown = -155
            for(let i = 0; i < sum; i++) {
                let node = cc.instantiate(this.slotPrefab)
                this.slotArr.push(node)
                this.slotNode.addChild(node)
                if(i < 7) {
                    let startX = midX - 7 * space / 2
                    let x = startX + i * space
                    node.setPosition(cc.v2(x, yUp))
                }else {
                    let startX = midX - (sum - 7) * space / 2
                    let x = startX + (i - 7) * space
                    node.setPosition(cc.v2(x, yDown))
                }
            }
        }
    }

    addListenerOnDiamond() {
        for(let i = 0; i < this.diamondNode.children.length; i++) {
            for(let j = 0; j < this.diamondNode.children[i].children.length; j++) {
                let node = this.diamondNode.children[i].children[j]
                node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                    if(this.touchTarget) {
                        return
                    }
                    this.touchTarget = e.target
                    this.touchNode.active = true;
                    this.touchNode.zIndex = 100;
                    e.target.active = false
                    var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                    this.touchNode.setPosition(point);
                    this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;
                })
                node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                    console.log(this.touchTarget, e.target)
                    if(this.touchTarget != e.target) {
                        return
                    }
                    var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                    this.touchNode.setPosition(point);
                    console.log('--------', point)
                    for(let k = 0; k < this.slotArr.length; k++) {
                        if(this.slotArr[k].getChildByName('slot').getBoundingBox().contains(this.slotArr[k].convertToNodeSpaceAR(e.currentTouch._point))) {
                            this.slotArr[k].getChildByName('light').active = true
                            for(let p = 0; p < this.slotArr.length; p++) {
                                if(p != k) {
                                    this.slotArr[p].getChildByName('light').active = false
                                }
                            }
                        }else {
                            this.overNum++
                        }
                        if(k == this.slotArr.length-1) {
                            if(this.overNum == this.slotArr.length) {
                                for(let o = 0; o < this.slotArr.length; o ++) {
                                    this.slotArr[o].getChildByName('light').active = false
                                }
                            }
                        }
                    }
                })
                node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                    if(e.target != this.touchTarget) {
                        return
                    }
                    this.touchNode.active = false
                    e.target.active = true
                    this.touchTarget = null
                })
                node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                    if(e.target != this.touchTarget) {
                        return
                    }
                    let rightNum = 0
                    for(let k = 0; k < this.slotArr.length; k++) {
                        if(this.slotArr[k].getChildByName('slot').getBoundingBox().contains(this.slotArr[k].convertToNodeSpaceAR(e.currentTouch._point))) {
                            let diamond = this.slotArr[k].getChildByName('diamond')
                            diamond.active = true
                            diamond.getComponent(cc.Sprite).spriteFrame = this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame
                            this.answerArr[k] = i+1
                            rightNum++
                        }
                    }
                    if(rightNum > 0) {
                        this.touchNode.active = false
                    }else{
                        this.touchNode.active = false
                        e.target.active = true
                    }
                    this.touchTarget = null
                })
            }
        }
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {

    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if(content.checkpointsNum) {
                        this.checkpointsNum = content.checkpointsNum
                    }else {
                        console.log('网络请求数据checkpointsNum为空')
                    }
                    if(content.countsArr) {
                        this.countsArr = content.countsArr
                    }else {
                        console.log('网络请求数据countsArr为空')
                    }
                    if(content.goodsArr) {
                        this.goodsArr = content.goodsArr
                    }else {
                        console.log('网络请求数据goodsArr为空')
                    }
                    this.startAction()
                    this.addSlot()
                }
            } else {
               
            }
        }.bind(this), null);
    }
}
