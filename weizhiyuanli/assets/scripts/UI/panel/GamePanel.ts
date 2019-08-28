import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";

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
    @property(sp.Skeleton)
    private light2: sp.Skeleton = null;
    @property(cc.Node)
    private goods: cc.Node = null;
    @property(cc.Node)
    private goodAct: cc.Node = null;
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
    @property(cc.Button)
    private button: cc.Button = null
    @property(cc.Node)
    private placementArea: cc.Node = null
    @property(cc.Node)
    private bagNode: cc.Node = null
    @property(cc.Node)
    private bg: cc.Node = null
    private checkpointsNum: number = 0;
    private countsArr: number[] = [];
    private goodsArr: number[] = [];
    private slotArr: cc.Node[] = [];
    private answerArr: number[] = [];
    private timeoutArr: number[] = [];
    private checkpointIndex: number = 1;
    private diamondArr: cc.Node[][] = [[],[],[],[]];
    private touchTarget: any = null;
    private overNum: number = 0;
    private overState: number = 2;
    private buttonEnable: boolean = true

    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    start() {
        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.overState = 2;
        });
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.checkpointsNum = DaAnData.getInstance().checkpointsNum
            this.countsArr = DaAnData.getInstance().countsArr
            this.goodsArr = DaAnData.getInstance().goodsArr
            this.getDiamond()
            this.startAction();
            this.addSlot()
            this.addData()
        }else {
            this.getDiamond()
            this.getNet();
        }
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    addData() {
        for(let i = 0; i < this.checkpointsNum; i++) {
            this.eventvalue.levelData.push({
                answer: this.countsArr[i],
                subject: null,
                result: 4
            })
        }
    }

    onLoad() {
        
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
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.overState });
    }

    startAction() {
        for(let i = 0; i < this.diamondArr.length; i++) {
            for(let j = 0; j < this.diamondArr[i].length; j++) {
                this.diamondArr[i][j].active = true
                this.diamondArr[i][j].children[0].active = true
                this.diamondArr[i][j].opacity = 0 
            }
        }
        for(let i = 0; i < this.diamondArr.length; i++) {
            for(let j = 0; j < this.diamondArr[i].length; j++) {
                let id:number = setTimeout(() => {
                    this.diamondArr[i][j].runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(0.2),cc.callFunc(()=>{
                       this.diamondArr[i][j].children[0].active = false; 
                    })))
                }, j * 100);
                this.timeoutArr.push(id)
            }
        }
        this.magic()
    }

    getDiamond() {
        this.diamondArr = [[],[],[],[]]
        for(let i = 0; i < this.diamondNode.children.length; i++) {
            for(let j = 0; j < this.diamondNode.children[i].children.length; j++) {
                this.diamondArr[i][j] = this.diamondNode.children[i].children[j]
            }
        }
    }

    magic() {
        this.bubble.scale = 0
        this.goods.active = false
        this.goods.setPosition(cc.v2(0, -101))
        if(this.goodsArr[this.checkpointIndex-1] == 0) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.ball
        }else if(this.goodsArr[this.checkpointIndex-1] == 1) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.bottle
        }else if(this.goodsArr[this.checkpointIndex-1] == 2) {
            this.goods.getComponent(cc.Sprite).spriteFrame = this.crown
        }
        AudioManager.getInstance().playSound('sfx_eoopn', false)
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
        let id:number = setTimeout(() => {
            this.light1.node.active = true
            this.light1.setAnimation(0, 'magic_01', false)
            this.light1.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'magic_01') {
                    this.light1.node.active = false;     
                }
            })
        }, 1000)
        let id1:number = setTimeout(() => {
            this.goods.active = true
            this.countLabel.string = this.countsArr[this.checkpointIndex-1].toString()
            this.addListenerOnDiamond()
            this.addListenerOnSlot()
        }, 1500);
        this.timeoutArr.push(id)
        this.timeoutArr.push(id1)
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
        this.slotArr = []
        var temp = this.countsArr[this.checkpointIndex-1]
        var result =  temp / 10
        var sum = temp % 10
        while(result >= 1.0){
            temp = Math.floor(temp / 10) 
            result = temp / 10
            let num = temp % 10
            sum += num
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
                this.answerArr[i] = null
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
                this.answerArr[i] = null
            }
        }
    }
    removeListenerOnDiamond() {
        for(let i = 0; i < this.diamondArr.length; i++) {
            for(let j = 0; j < this.diamondArr[i].length; j++) {
                let node = this.diamondArr[i][j]
                node.off(cc.Node.EventType.TOUCH_START)
                node.off(cc.Node.EventType.TOUCH_MOVE)
                node.off(cc.Node.EventType.TOUCH_END)
                node.off(cc.Node.EventType.TOUCH_CANCEL)
            }
        }
    }

    addListenerOnDiamond() {
        for(let i = 0; i < this.diamondArr.length; i++) {
            for(let j = 0; j < this.diamondArr[i].length; j++) {
                let node = this.diamondArr[i][j]
                node.zIndex = j+1
                node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                    if(this.touchTarget||e.target.opacity==0) {
                        return
                    }
                    this.touchTarget = e.target
                    this.touchNode.active = true;
                    this.touchNode.zIndex = 100;
                    e.target.zIndex = 0
                    e.target.opacity = 0
                    var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                    this.touchNode.setPosition(point);
                    this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;
                });
                node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                    if(this.touchTarget != e.target) {
                        return
                    }
                    var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                    this.touchNode.setPosition(point);
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
                            this.overNum = 0
                        }
                    }
                });
                node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                    if(e.target != this.touchTarget) {
                        return
                    }
                    this.touchNode.active = false
                    e.target.zIndex = j+1
                    e.target.opacity = 255
                    this.touchTarget = null
                });
                node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                    if(e.target != this.touchTarget) {
                        return
                    }
                    let rightNum = 0
                    let isSame:boolean = false
                    for(let k = 0; k < this.slotArr.length; k++) {
                        if(this.slotArr[k].getChildByName('slot').getBoundingBox().contains(this.slotArr[k].convertToNodeSpaceAR(e.currentTouch._point))) {
                            if(this.slotArr[k].getChildByName('diamond').active) {
                                let lastDiamonArr = this.diamondArr[this.answerArr[k]]                               
                                for(let o = 0; o < lastDiamonArr.length; o++) {
                                    if(lastDiamonArr[o].opacity == 0) {
                                        AudioManager.getInstance().playSound('sfx_dimndst', false)
                                        lastDiamonArr[o].opacity = 255
                                        lastDiamonArr[o].zIndex = o+1
                                        this.touchNode.active = false
                                        o = lastDiamonArr.length
                                        this.answerArr[k] = 0
                                    }
                                }
                                let diamond = this.slotArr[k].getChildByName('diamond')
                                diamond.getComponent(cc.Sprite).spriteFrame = this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame
                                this.answerArr[k] = i
                                if(this.answerArr[k] == i) {
                                    isSame = true
                                }
                                rightNum++
                            }else {
                                let diamond = this.slotArr[k].getChildByName('diamond')
                                diamond.active = true
                                diamond.getComponent(cc.Sprite).spriteFrame = this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame
                                this.answerArr[k] = i
                                rightNum++
                            }
                        }
                    }
                    if(rightNum > 0) {
                        AudioManager.getInstance().playSound('sfx_dimndst', false)
                        this.touchNode.active = false
                        if(!isSame) {
                            e.target.zIndex = 0
                        }
                        this.isOver()
                    }else{
                        AudioManager.getInstance().playSound('sfx_wrngdmd', false)
                        this.touchNode.active = false
                        e.target.zIndex = j+1
                        e.target.opacity = 255
                    }
                    for(let o = 0; o < this.slotArr.length; o ++) {
                        this.slotArr[o].getChildByName('light').active = false
                    }
                    this.touchTarget = null
                });
            }
        }
    }

    removeListenerOnSlot() {
        for(let i = 0; i < this.slotArr.length; i++) {
            let node = this.slotArr[i].getChildByName('slot')
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    addListenerOnSlot() {
        for(let i = 0; i < this.slotArr.length; i++) {
            let node = this.slotArr[i].getChildByName('slot')
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget||!this.slotArr[i].getChildByName('diamond').active) {
                    return
                }
                this.touchTarget = e.target
                this.touchNode.active = true
                this.touchNode.zIndex = 100
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                this.touchNode.getChildByName('diamond').getComponent(cc.Sprite).spriteFrame = this.slotArr[i].getChildByName('diamond').getComponent(cc.Sprite).spriteFrame;
                this.slotArr[i].getChildByName('diamond').active = false
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(point)
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
                        this.overNum = 0
                    }
                }
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchNode.active = false
                this.slotArr[i].getChildByName('diamond').active = true
                this.touchTarget = null
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                let index = this.answerArr[i]
                if(this.placementArea.children[index].getBoundingBox().contains(this.placementArea.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let j = 0; j < this.diamondArr[index].length; j++) {
                        if(this.diamondArr[index][j].opacity == 0) {
                            AudioManager.getInstance().playSound('sfx_dimndst', false)
                            this.diamondArr[index][j].opacity = 255
                            this.diamondArr[index][j].zIndex = j+1
                            this.touchNode.active = false
                            j = this.diamondArr[index].length
                            this.answerArr[i] = null
                            this.isOver()
                        }
                    }
                }else {
                    let isChange = false
                    for(let k = 0; k < this.slotArr.length; k++) {
                        if(this.slotArr[k].getChildByName('slot').getBoundingBox().contains(this.slotArr[k].convertToNodeSpaceAR(e.currentTouch._point))) {
                            let targetDiamond =  this.slotArr[k].getChildByName('diamond')
                            let originDiamond = this.slotArr[i].getChildByName('diamond')
                            if(targetDiamond.active) {
                                originDiamond.active = true
                                isChange = true
                                AudioManager.getInstance().playSound('sfx_dimndst', false)
                                let temp = this.answerArr[k]
                                this.answerArr[k] = this.answerArr[i]
                                this.answerArr[i] = temp
                                let spFrame: cc.SpriteFrame = targetDiamond.getComponent(cc.Sprite).spriteFrame
                                targetDiamond.getComponent(cc.Sprite).spriteFrame = originDiamond.getComponent(cc.Sprite).spriteFrame
                                originDiamond.getComponent(cc.Sprite).spriteFrame = spFrame
                            }else {
                                isChange = true
                                AudioManager.getInstance().playSound('sfx_dimndst', false)
                                this.answerArr[k] = this.answerArr[i]
                                this.answerArr[i] = null
                                targetDiamond.getComponent(cc.Sprite).spriteFrame = originDiamond.getComponent(cc.Sprite).spriteFrame
                                originDiamond.active = false
                                targetDiamond.active = true
                            }
                        }
                    }
                    if(!isChange) {
                        AudioManager.getInstance().playSound('sfx_wrngdmd', false)
                        this.slotArr[i].getChildByName('diamond').active = true
                    }
                }
                for(let o = 0; o < this.slotArr.length; o ++) {
                    this.slotArr[o].getChildByName('light').active = false
                }
                this.touchNode.active = false
                this.touchTarget = null
            })
        }
    }

    isOver() {
        let answerNum = 0
        for(let i = 0; i < this.slotArr.length; i++) {
            if(this.slotArr[i].getChildByName('diamond').active) {
                answerNum++
            }
        }
        if(answerNum == this.slotArr.length) {
            this.button.interactable = true
        }else {
            this.button.interactable = false
        }
       
    }

    isRight() {
        if(!this.buttonEnable) {
            return
        }
        let count = 0
        for(let i = 0; i < this.answerArr.length; i ++) {
            if(this.answerArr[i] == 0) {
                count += 1000
            }else if(this.answerArr[i] == 1) {
                count += 100
            }else if(this.answerArr[i] == 2) {
                count += 10
            }else if(this.answerArr[i] == 3) {
                count += 1
            }
        }
        this.eventvalue.levelData[this.checkpointIndex-1].subject = count
        this.eventvalue.result = 2
        console.log('--', this.eventvalue);
        if(count == this.countsArr[this.checkpointIndex-1]) {
            this.buttonEnable = false
            this.eventvalue.levelData[this.checkpointIndex-1].result = 1
            if(this.checkpointIndex == this.checkpointsNum) {
                this.eventvalue.result = 1
                this.overState = 1
                console.log('--', this.eventvalue);
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
            }
            this.removeListenerOnDiamond()
            this.removeListenerOnSlot()
            this.bagNode.setPosition(cc.v2(-375, -454))
            this.goodAct.getComponent(cc.Sprite).spriteFrame = this.goods.getComponent(cc.Sprite).spriteFrame
            let spawn1 = cc.spawn(cc.moveBy(0.2, cc.v2(30, 30)), cc.scaleTo(0.2,1.1, 1))
            let spawn2 = cc.spawn(cc.moveBy(0.2, cc.v2(-60, -60)), cc.scaleTo(0.2, 0.9, 1))
            let spawn3 = cc.spawn(cc.moveBy(0.2, cc.v2(30, 30)), cc.scaleTo(0.2, 1, 1))
            this.bagNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(200, 200)), spawn1, spawn2, spawn3, cc.callFunc(()=>{}) ))
            let fun = cc.callFunc(()=>{
                this.goodAct.active = false
                this.goodAct.setPosition(cc.v2(669, -499))
                this.bubble.runAction(cc.scaleTo(0.3, 0,0)) 
                this.bagNode.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(40, 40)), cc.moveBy(0.2, cc.v2(-40, -40)), cc.moveBy(0.3, cc.v2(-200, -200)), fun3 ))
            })
            let fun1 = cc.callFunc(()=>{
                this.light2.node.active = true
                this.light2.setAnimation(0, 'line_01', false)
                this.light2.setCompleteListener(trackEntry=>{
                    this.light2.node.active = false
                })
            })
            let fun2 = cc.callFunc(()=>{
                this.goods.active = false
                this.goodAct.active = true
                this.goodAct.runAction(cc.sequence( fun1, cc.moveTo(0.8, cc.v2(-219,22)).easing(cc.easeSineInOut()), fun ))
            })
            let fun3 = cc.callFunc(()=>{
                if(this.checkpointIndex == this.checkpointsNum) {
                    if(this.checkpointsNum == 1) {
                        DaAnData.getInstance().submitEnable = true
                        UIHelp.showOverTip(2,'答题好快呦，请等待老师收题吧。', false,'', null, null, '挑战成功')
                    }else {
                        DaAnData.getInstance().submitEnable = true
                        UIHelp.showOverTip(2,'答题好快呦，请等待老师收题吧。', false,'', null, null, '闯关成功')
                    }
                }else {
                    
                    UIHelp.showOverTip(1,'过关成功！', true,'下一关', null, ()=>{this.nextCheckpoint()})
                }
            })
            this.goods.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, 80)), cc.moveBy(0.2, cc.v2(0, -10)), cc.moveBy(0.2, cc.v2(0, 10)),cc.moveBy(0.2, cc.v2(0, -10)),cc.moveBy(0.2, cc.v2(0, 10)), fun2 ))
            this.light1.node.active = true
            this.light1.setAnimation(0, 'magic_02', false)
            this.light1.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'magic_02') {
                    this.light1.node.active = false
                }
            })
            AudioManager.getInstance().playSound('sfx_gtcrwn', false)
            this.miya.setAnimation(0, 'true_01', false)
            this.miya.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'true_01') {
                    this.miya.setAnimation(0, 'idle', true)
                }
            })
        }else {
            this.buttonEnable = true
            this.eventvalue.levelData[this.checkpointIndex-1].result = 2
            this.miya.setAnimation(0, 'false_01', false)
                this.miya.setCompleteListener(trackEntry=>{
                    if(trackEntry.animation.name == 'true_01') {
                        this.miya.setAnimation(0, 'idle', true)
                    }
                })
            UIHelp.showTip('再想一想吧')
        }
    }

    nextCheckpoint() {
        for(let i = 0; i < this.diamondArr.length; i++) {
            for(let j = 0; j < this.diamondArr[i].length; j++) {
                this.diamondArr[i][j].zIndex = j+1
            }
        }
        this.checkpointIndex++
        this.button.interactable = false
        this.buttonEnable = true
        this.countLabel.string = '0'
        for(let i = 0; i < this.slotArr.length; i++) {
            this.slotArr[i].destroy()
        }
        this.slotArr = []
        this.answerArr = []
        this.startAction()
        this.addSlot()
    }

    onDestroy() {
        for(let i = 0; i < this.timeoutArr.length; i++) {
            clearTimeout(this.timeoutArr[i])
        }
        this.timeoutArr = []
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
                    this.addData()
                }
            } else {
               
            }
        }.bind(this), null);
    }
}
