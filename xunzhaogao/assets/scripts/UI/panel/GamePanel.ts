/*
 * @Author: 马超
 * @Date: 2020-04-27 11:26:32
 * @LastEditTime: 2020-05-11 13:54:37
 * @Description: 游戏脚本
 * @FilePath: \xunzhaogao\assets\scripts\UI\panel\GamePanel.ts
 */
import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
//import DataReporting from "../../Data/DataReporting";
import ErrorPanel from "./ErrorPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { ListenerType } from "../../Data/ListenerType";
import { ListenerManager } from "../../Manager/ListenerManager";
import { AnswerResult } from "../../Data/ConstValue";
import GameMsg from "../../Data/GameMsg";
import { GameMsgType } from "../../Data/GameMsgType";
import { Tools } from "../../UIComm/Tools";
import {ReportManager}from "../../Manager/ReportManager";
import {OverTips} from "../Item/OverTips";
import { AffirmTips } from "../Item/affirmTips";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private mask: cc.Node = null
    @property(cc.Node)
    private bg:cc.Node = null;
    @property(cc.Node)
    private paipai: cc.Node = null
    @property(cc.Node)
    private left: cc.Node = null
    @property(cc.Node)
    private right: cc.Node = null
    @property(cc.Label)
    private progressLabel: cc.Label = null
    @property(sp.Skeleton)
    private caozuoban: sp.Skeleton = null
    @property(sp.Skeleton)
    private tiban: sp.Skeleton = null
    @property(cc.Node)
    private guanzi: cc.Node = null
    @property(cc.Node)
    private quanquan: cc.Node = null
    @property(cc.Node)
    private operationPanel: cc.Node = null
    @property(cc.Node)
    private ruler: cc.Node = null
    @property(cc.Graphics)
    private gl: cc.Graphics = null
    @property(cc.Graphics)
    private gc: cc.Graphics = null
    @property(cc.Node)
    private broadNode: cc.Node = null
    @property(cc.Node)
    private round1Node: cc.Node = null
    @property(cc.Node)
    private round3Node: cc.Node = null
    @property(cc.Node)
    private gao:cc.Node = null
    @property(cc.Node)
    private di: cc.Node = null
    @property(cc.Vec2)
    private weiyi: cc.Vec2 = null //点击位置和锚点之间的距离
   
    private intervalId = null
    private intervalId1 = null
    private xuxianId = null
    private isRightBtn: boolean = false
    private isLeftBtn: boolean = false
    private isRotation: boolean = false
    private standardNum: number = 3
    private rulerPos: cc.Vec2 = cc.v2(-30, -117)
    private timeoutArr: number[] = []
    private isOver: boolean = false
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private actionId: number = 0
    private isAction: boolean = false
    private isBreak: boolean = false
    private isAudio: boolean = false
    private archival = {
        answerdata: null,
        level: null,
        angle: null,
        pos: null,
        rightNum: null,
        totalNum: null,
        standardNum: this.standardNum
    }
 

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        cc.loader.loadRes('atlas/paipai-01', sp.SkeletonData, null)
        cc.loader.loadRes('atlas/tiban', sp.SkeletonData, (err, spine)=>{
            if(!err) {
                console.log('load spine err1')
            }
        })
        cc.loader.loadRes('atlas/caozuoban', sp.SkeletonData, (err, spine)=>{
            if(!err) {
                console.log('load spine err2')
            }
        })
        this.initGame()
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
        })
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, 212)
          
            //this.setPanel()
        }else {
            this.getNet()
        }
    }

    start() {
         //监听新课堂发出的消息
         this.addSDKEventListener()
         //新课堂上报
         GameMsg.getInstance().gameStart()
        //添加上报result数据
        ReportManager.getInstance().addResult(3)
        this.standardNum = 3
        ReportManager.getInstance().setStandardNum(this.standardNum)
        ReportManager.getInstance().setQuestionInfo(0, '一起动手，挑战下面的关卡吧！')
        ReportManager.getInstance().setQuestionInfo(1, '一起动手，挑战下面的关卡吧！')
        ReportManager.getInstance().setQuestionInfo(2, '一起动手，挑战下面的关卡吧！')
        let id = setTimeout(() => {
            console.log('start action')
            this.startAction()
            let index = this.timeoutArr.indexOf(id)
            this.timeoutArr.splice(index, 1)
        }, 500);
        this.timeoutArr[this.timeoutArr.length] = id
        this.round1()
        this.paipaiAction('idle-01')
    }

    paipaiAction(str: string) {
        let spine = this.paipai.getComponent(sp.Skeleton)
        spine.setAnimation(0, str, false)
        spine.setCompleteListener(trackEntry=>{
            let index = Math.random() * 10
            if(index >= 7) {
                spine.setAnimation(0, 'idle-01', false)
            }else {
                spine.setAnimation(0, 'idle-02', false)
            }
        })
    }

    onDestroy() {
        if(this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        if(this.intervalId1) {
            clearInterval(this.intervalId1)
            this.intervalId1= null
        }
        if(this.xuxianId) {
            clearInterval(this.xuxianId)
            this.xuxianId = null
        }
       for (const key in this.timeoutArr) {
           clearTimeout(this.timeoutArr[key])
       }
    }

    initGame() {
        this.broadNode.opacity = 0
        this.tiban.node.active = false
        this.caozuoban.node.active = false
        this.quanquan.setPosition(cc.v2(1090, 435)) 
        this.paipai.setPosition(cc.v2(1252, -172))
        this.operationPanel.setPosition(cc.v2(1238, -371))
        this.guanzi.setPosition(cc.v2(1060, -444))
        this.guanzi.active = false
        this.addlistenerOnRuler()
        this.onBtnLeft()
        this.onBtnRight()
    }

    round1() {
        this.round1Node.active = true
        this.round3Node.active = false
        this.setprogress(1)
        this.resetInterface()
    }

    round2() {
        this.round1Node.active = true
        this.round3Node.active = false
        this.setprogress(2)
        this.resetInterface()
    }
    
    round3() {
        this.round1Node.active = false
        this.round3Node.active = true
        this.setprogress(3)
        this.resetInterface()
    }

    resetInterface() {
        this.mask.active = false
        this.drawLine(cc.v2(-680, -120), cc.v2(360, -120), this.gl)
        this.ruler.setPosition(this.rulerPos)
        this.ruler.angle = 0
        this.gao.active = false
        this.di.active = false
        this.gl.clear()
        this.gc.clear()
    }

    starAction(pos: cc.Vec2) {
        AudioManager.getInstance().playSound('点击', false)
        let ruler = this.ruler
        this.gl.clear()
        ruler.getChildByName('box').active = true
        pos = this.resetPos(pos)
        ruler.setPosition(pos)
    }

    moveAction(pos: cc.Vec2) {
        let ruler = this.ruler
        pos = this.resetPos(pos)
        ruler.setPosition(pos)
        //this.point(pos)
        this.yanchangxian(pos)
    }

    endAction() {
        let ruler = this.ruler
        ruler.opacity = 255
        ruler.getChildByName('box').active = false
        let num = this.isRight(this.ruler.position)
        if(num == 1) {
            //AudioManager.getInstance().playSound('正确提醒', false)
            this.mask.active = true
            let level = ReportManager.getInstance().getLevel()
            ReportManager.getInstance().answerRight() 
            //ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
            this.paipaiAction('correct-01')  
            if(level == 1) {
                ReportManager.getInstance().levelEnd(AnswerResult.AnswerRight)
                let id = setTimeout(() => {
                    this.round2()
                    clearTimeout(id)
                    let index = this.timeoutArr.indexOf(id)
                    this.timeoutArr.splice(index, 1)
                }, 4000);
                this.timeoutArr[this.timeoutArr.length] = id
            }else if(level == 2) {
                ReportManager.getInstance().levelEnd(AnswerResult.AnswerRight)
                let id = setTimeout(() => {
                    this.round3()
                    clearTimeout(id)
                    let index = this.timeoutArr.indexOf(id)
                    this.timeoutArr.splice(index, 1)
                }, 4000);
                this.timeoutArr[this.timeoutArr.length] = id
            }else if(level == 3) {
                ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                if(!this.isAction) {
                    GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                }
                this.isOver = true
                let id = setTimeout(() => {
                    UIHelp.showOverTip(2,'你真棒！等等还没做完的同学吧~', '', null, null, '挑战成功')
                    clearTimeout(id)
                    let index = this.timeoutArr.indexOf(id)
                    this.timeoutArr.splice(index, 1)
                }, 3000);
            }
        }else if(num == 2){
            //ReportManager.getInstance().answerWrong()
            this.paipaiAction('flase-01')
            AudioManager.getInstance().playSound('错误提醒', false)
        }
        if(!this.isAction) {
            GameMsg.getInstance().actionSynchro({type: 3})
            this.actionId++
            this.archival.answerdata = ReportManager.getInstance().getAnswerData()
            this.archival.angle = this.ruler.angle
            this.archival.pos = this.ruler.position
            this.archival.level = ReportManager.getInstance().getLevel()
            this.archival.rightNum = ReportManager.getInstance().getRightNum()
            this.archival.totalNum = ReportManager.getInstance().getTotalNum()
            GameMsg.getInstance().dataArchival(this.actionId ,this.archival)
        }
    }

    addlistenerOnRuler() {
        let ruler = this.ruler
        ruler.on(cc.Node.EventType.TOUCH_START, (e)=>{
            let pos = this.broadNode.convertToNodeSpaceAR(e.currentTouch._point)
            this.weiyi = this.ruler.convertToNodeSpaceAR(e.currentTouch._point)
            let angle = this.ruler.angle
            let x = Math.sin((angle-Math.atan(this.weiyi.x/this.weiyi.y)*180 / Math.PI)*Math.PI/180)*Math.sqrt(Math.pow(this.weiyi.x,2) + Math.pow(this.weiyi.y,2))
            let y = Math.cos((angle-Math.atan(this.weiyi.x/this.weiyi.y)*180 / Math.PI)*Math.PI/180)*Math.sqrt(Math.pow(this.weiyi.x,2) + Math.pow(this.weiyi.y,2))
            let posReal = cc.v2(pos.x + x, pos.y - y)
            this.gameResult = AnswerResult.AnswerHalf
            if(!ReportManager.getInstance().isStart()) {
                ReportManager.getInstance().levelStart(this.isBreak)
            }
            ReportManager.getInstance().touchStart()
           //ReportManager.getInstance().answerHalf()
            ReportManager.getInstance().setAnswerNum(1)
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 1, pos: posReal})
            }
            this.starAction(posReal)
        })
        ruler.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            let pos = this.broadNode.convertToNodeSpaceAR(e.currentTouch._point)
            let angle = this.ruler.angle
            let x = Math.sin((angle-Math.atan(this.weiyi.x/this.weiyi.y)*180 / Math.PI)*Math.PI/180)*Math.sqrt(Math.pow(this.weiyi.x,2) + Math.pow(this.weiyi.y,2))
            let y = Math.cos((angle-Math.atan(this.weiyi.x/this.weiyi.y)*180 / Math.PI)*Math.PI/180)*Math.sqrt(Math.pow(this.weiyi.x,2) + Math.pow(this.weiyi.y,2))
            let posReal = cc.v2(pos.x + x, pos.y - y)
            this.moveAction(posReal)
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 2, pos: posReal})
            }
        })
        ruler.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.endAction()
        })
        ruler.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            this.endAction()
        })
    }

    startAction() {
        AudioManager.getInstance().playSound('入场', false)
        this.tiban.node.active = true
        this.caozuoban.node.active = true
        this.tiban.setAnimation(0, 'chuchang-01', false)
        this.caozuoban.setAnimation(0, 'ruchang-01', false)
        let t = new cc.Tween();
        t.target(this.quanquan)
        .to(0.5, {position: cc.v2(938, 435)}, {easing:"easeSineOut", progress:null})
        .by(0.3, {position: cc.v2(30, 0)}, {easing:"easeSineOut", progress:null})
        .by(0.3, {position: cc.v2(-10, 0)}, {easing:"easeSineOut", progress:null})
        .start();

        let t1 = new cc.Tween()
        t1.target(this.paipai)
        .to(0.7, {position: cc.v2(824, -172)}, {easing:"easeSineOut", progress:null})
        .by(0.1, {position: cc.v2(20, 0)}, {easing:"easeSineOut", progress:null})
        .start()

        let t2 = new cc.Tween()
        t2.target(this.operationPanel)
        .to(0.7, {position: cc.v2(809, -371)}, {easing:"easeSineOut", progress:null})
        .by(0.3, {position: cc.v2(30, 0)}, {easing:"easeSineOut", progress:null})
        .by(0.3, {position: cc.v2(-10, 0)}, {easing:"easeSineOut", progress:null})
        .call(()=>{
            this.broadNode.runAction(cc.fadeIn(0.3))
            let fun = cc.callFunc(()=>{
                this.faguangtiAction()
            }) 
            this.guanzi.active = true
            let seq = cc.sequence(cc.moveTo(1, cc.v2(600, -444)), fun)
            this.guanzi.runAction(seq)
        })
        .start()
    }

    point(pos: cc.Vec2) {
        let level = ReportManager.getInstance().getLevel()
        console.log('00--------level', level)
        let angle = this.ruler.angle%360
        if(angle<0) {
            angle = 360 - Math.abs(angle)
        }
        let cos = Math.cos(angle * Math.PI / 180)
        let sin = Math.sin(angle * Math.PI / 180)
        let width = 332
        let height = 522
        let sideArr = this.round1Node.getChildByName('side').children
        let sideArr1 = this.round3Node.getChildByName('side').children
        for(let i = 0; i < sideArr.length; ++i) {
            sideArr[i].active = false
        }
        for(let i = 0; i < sideArr1.length; ++i) {
            sideArr1[i].active = false
        }
        if(level == 1 || level == 2) {
            if(angle <= 10 || angle >= 350) {
                if(pos.x + width >= -611 && pos.x <= -148 && pos.y >=-137 && pos.y <= -97) {
                    //sideArr[2].active = true
                }else if(pos.x + width >= -529 && pos.x <= -67 && pos.y >= 162 && pos.y <= 202) {
                    sideArr[0].active = true
                }
            }else if(angle <= 85 && angle >= 65) {
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                let long1 = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(pos.y <= 182 && pos.y + width*sin >= -117 && long <= 10) {
                    //sideArr[1].active = true
                }else if(pos.y <= 182 && pos.y + width*sin >= -117 && long1 <= 10) {
                    sideArr[3].active = true
                }
            }else if(angle <= 190 && angle >= 170) {
                if(pos.x >= -529 && pos.x-width <= -67 && pos.y >=162 && pos.y <= 202) {
                    //sideArr[0].active = true
                }else if(pos.x >= -611 && pos.x-width <= -148 && pos.y >=-137 && pos.y <= -97) {
                    sideArr[2].active = true
                }
            }else if(angle <= 265 && angle >= 245) {
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                let long1 = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(pos.y-width*-sin <= 182 && pos.y >= -117 && long <= 10) {
                    //sideArr[3].active = true
                }else if(pos.y-width*-sin <= 182 && pos.y >= -117 && long1 <= 10) {
                    sideArr[1].active = true
                }
            }else if(angle <= 280 && angle >= 260) {
                if(pos.x+height >= -529 && pos.x <= -67 && pos.y >=162 && pos.y <= 202) {
                    //sideArr[0].active = true
                }else if(pos.x+height >= -611 && pos.x <= -148 && pos.y >= -137 && pos.y <= -97) {
                    sideArr[2].active = true
                }
            }else if(angle <= 100 && angle >= 80) {
                if(pos.x >= -611 && pos.x-height <= -148 && pos.y >=-137 && pos.y <= -97) {
                    //sideArr[2].active = true
                }else if(pos.x >= -529 && pos.x-height <= -67 && pos.y >= 162 && pos.y <= 202) {
                    sideArr[0].active = true
                }
            }else if(angle <= 175 && angle >= 155) {
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                let long1 = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(pos.y >= -117 && pos.y-height*-cos <= 182 && long <= 10) {
                   sideArr[1].active = true
                }else if(pos.y >= -117 && pos.y-height*-cos <= 182 && long1 <= 10) {
                    sideArr[3].active = true
                }
            }else if(angle <= 355 && angle >= 335) {
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                let long1 = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(pos.y <= 182 && pos.y+height*cos >= -117 && long <= 10) {
                    sideArr[3].active = true
                }else if(pos.y <= 182 && pos.y+height*cos >= -117 && long1 <= 10) {
                    sideArr[1].active = true
                }
            }
        }else if(level == 3) {
            if(angle <= 10 || angle >= 350) {
                if(pos.x+width >= -619 && pos.x <= -59 && pos.y <= -97 && pos.y >= -137) {
                    //sideArr1[1].active = true
                }else if(pos.x+width >= -517 && pos.x <= -241 && pos.y <= 149 && pos.y >= 109) {
                    sideArr1[0].active = true
                }
            }else if(angle <= 100 && angle >= 80) {
                if(pos.x >= -619 && pos.x-height <= -59 && pos.y <= -97 && pos.y >= -137){
                    //sideArr1[1].active = true
                }else if(pos.x >= -517 && pos.x-height <= -241 && pos.y <= 149 && pos.y >= 109) {
                    sideArr1[0].active = true
                }
            }else if(angle <= 190 && angle >= 170) {
                if(pos.x >= -517 && pos.x-width <= -241 && pos.y <= 149 && pos.y >= 109) {
                    //sideArr1[0].active = true
                }else if(pos.x >= -619 && pos.x-width <= -59 && pos.y <= -97 && pos.y >= -137) {
                    sideArr1[1].active = true
                }
            }else if(angle <= 280 && angle >= 260) {
                if(pos.x+height >= -517 && pos.x <= -241 && pos.y <= 149 && pos.y >= 109) {
                    //sideArr1[0].active = true
                }else if(pos.x+height >= -619 && pos.x <= -241 && pos.y <= -97 && pos.y >= -137) {
                    sideArr1[1].active = true
                } 
            }else if(angle <= 56.4 && angle >= 16.4) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y <= 129 && pos.y + height*cos >= -117) {
                    sideArr1[2].active = true
                }
            }else if(angle <= 146 && angle >= 106) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y <= 129 && pos.y + width*sin >= -117) {
                    sideArr1[2].active = true
                }
            }else if(angle <= 237 && angle >= 197) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y-height*-cos <= 129 && pos.y >= -117) {
                    sideArr1[2].active = true
                }
            }else if(angle <= 326 && angle >= 286) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y-width*-sin <= 129 && pos.y >= -117) {
                    sideArr1[2].active = true
                }
            }else if(angle <= 269 && angle >= 229) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y >= -117 && pos.y - width*-sin <= 129) {
                    sideArr1[3].active = true
                }
            }else if(angle <= 357 && angle >= 317) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y + height*cos >= -117 && pos.y  <= 129) {
                    sideArr1[3].active = true
                }
            }else if(angle <= 88 && angle >= 48) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y + width*sin >= -117 && pos.y  <= 129) {
                    sideArr1[3].active = true
                }
            }else if(angle <= 177 && angle >= 137) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y >= -117 && pos.y - height*-cos <= 129) {
                    sideArr1[3].active = true
                }
            }
        }
    }

    isRight(pos: cc.Vec2):any {
        let level = ReportManager.getInstance().getLevel()
        let angle = this.ruler.angle%360
        if(angle<0) {
            angle = 360 - Math.abs(angle)
        }
        let width = 332
        let height = 522
        let sideArr = this.round1Node.getChildByName('side').children
        let sideArr1 = this.round3Node.getChildByName('side').children
        for(let i = 0; i < sideArr.length; ++i) {
            sideArr[i].active = false
        }
        for(let i = 0; i < sideArr1.length; ++i) {
            sideArr1[i].active = false
        }
        this.gl.clear()
        this.gc.clear()
        if(level == 1 || level == 2) {
            if(angle <= 10 || angle >= 350) {//
                this.ruler.angle = 0
                if(pos.x >= -549 && pos.x <= -47 && pos.y >=-137 && pos.y <= -97) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = cc.v2(pos.x, -117)
                    this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                    if(pos.x <= -47 && pos.x >= -87) {
                        this.ruler.setPosition(cc.v2(-67, -117))
                        this.drawLine(cc.v2(-67, -117), cc.v2(-67, 455), this.gc)
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x - 50, 50))
                        this.di.setPosition(cc.v2(pos.x + 100, -167))
                        this.gc.clear()
                        if(pos.x <= -47 && pos.x >= -87) {
                            this.drawLine2(cc.v2(-67, -117), cc.v2(-67, 182), this.gc)
                        }else {
                            this.drawLine2(cc.v2(pos.x, -117), cc.v2(pos.x, 182), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 85 && angle >= 65) {//
                let angle = 74.3%360
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let cos = Math.cos(angle * Math.PI / 180)
                let sin = Math.sin(angle * Math.PI / 180)
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(this.segmentsIntr(cc.v2(-529, 182), cc.v2(-611, -117), pos, cc.v2(pos.x-height*sin, pos.y + height*cos)) && long <= 10) {
                    this.ruler.angle = 74.3
                    let jiaodian1 = this.segmentsIntr(cc.v2(-529, 182), cc.v2(-611, -117), pos, cc.v2(pos.x-height*sin, pos.y + height*cos))
                    let jiaodian2 = this.zhixianjiaodian(cc.v2(-67, 182), cc.v2(-148, -117), pos, cc.v2(pos.x-height*sin, pos.y + height*cos))
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = jiaodian2
                    if(pos.y <= 202 && pos.y+width*sin >= -137 && long <= 10) {
                        this.drawLine(cc.v2(-197, -282), cc.v2(-50, 238), this.gl)
                        if(pos.y >= -257 && pos.y <= -217){
                            this.ruler.setPosition(cc.v2(-183, -237))
                            this.drawLine(cc.v2(-183, -237), cc.v2(-183-(height+150)*sin, -237+(height+150)*cos), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(-360, jiaodian2.y - 10))
                        this.di.setPosition(cc.v2(-50, jiaodian2.y + 60))
                        this.gc.clear()
                        if(pos.y >= -257 && pos.y <= -217) {
                            this.drawLine2(cc.v2(-183, -237), cc.v2(-611, -117), this.gc)
                        }else {
                            this.drawLine2(jiaodian2, jiaodian1, this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 190 && angle >= 170) {//
                this.ruler.angle = 180
                if(pos.x >= -631 && pos.x <= -128 && pos.y >=162 && pos.y <= 202) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = cc.v2(pos.x, 182)
                    if(pos.x >= -631 && pos.x-width <= -87 && pos.y >=162 && pos.y <= 202) {
                        this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                        if(pos.x >= -631 && pos.x <= -591) {
                            this.ruler.setPosition(cc.v2(-611, 182))
                            this.drawLine(cc.v2(-611, 182), cc.v2(-611, -390), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x + 50, 10))
                        this.di.setPosition(cc.v2(pos.x - 100, 230))
                        this.gc.clear()
                        if(pos.x >= -631 && pos.x <= -591) {
                            this.drawLine2(cc.v2(-611, 182), cc.v2(-611, -117), this.gc)
                        }else  {
                            this.drawLine2(cc.v2(pos.x, 182), cc.v2(pos.x, -117), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 265 && angle >= 245) {//
                let angle =254.3%360
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let cos = Math.cos(angle * Math.PI / 180)
                let sin = Math.sin(angle * Math.PI / 180)
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(this.segmentsIntr(cc.v2(-67, 182), cc.v2(-148, -117), pos, cc.v2(pos.x+height*-sin, pos.y - height*-cos)) && long <= 10) {
                    this.ruler.angle = 254.3
                    let jiaodian1 = this.segmentsIntr(cc.v2(-67, 182), cc.v2(-148, -117), pos, cc.v2(pos.x+height*-sin, pos.y - height*-cos))
                    let jiaodian2 = this.zhixianjiaodian(cc.v2(-529, 182), cc.v2(-611, -117), pos, cc.v2(pos.x+height*-sin, pos.y - height*-cos))
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = jiaodian2
                    if(pos.y >= -137 && pos.y- width*-sin && long <= 10) {
                        this.drawLine(cc.v2(-493, 311), cc.v2(-639, -208), this.gl)
                        if(pos.y >= 276 && pos.y <= 316) {
                            this.ruler.setPosition(cc.v2(-498, 296))
                            this.drawLine(cc.v2(-498, 296), cc.v2(-498+(height+150)*-sin, 296 - (height+150)*-cos), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(-300, jiaodian2.y + 10))
                        this.di.setPosition(cc.v2(jiaodian2.x - 80, jiaodian2.y - 100))
                        this.gc.clear()
                        if(pos.y >= 276 && pos.y <= 316) {
                            this.drawLine2(cc.v2(-498, 296), cc.v2(-67, 182), this.gc)
                        }else {
                            this.drawLine2(jiaodian2, jiaodian1, this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 280 && angle >= 260) {//
                this.ruler.angle = 270
                if(pos.x >= -631 && pos.x <= -128 && pos.y >=162 && pos.y <= 202) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = cc.v2(pos.x, 182)
                    if(pos.x+height >= -549 && pos.x <= -47 && pos.y >=162 && pos.y <= 202) {
                        this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                        if(pos.x >= -631 && pos.x <= -591) {
                            this.ruler.setPosition(cc.v2(-611, 182))
                            this.drawLine(cc.v2(-611, 182), cc.v2(-611, -260), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x - 30, 50))
                        this.di.setPosition(cc.v2(pos.x + 200, 240))
                        this.gc.clear()
                        if(pos.x >= -631 && pos.x <= -591) {
                            this.drawLine2(cc.v2(-611, 182), cc.v2(-611, -117), this.gc)
                        }else {
                            this.drawLine2(cc.v2(pos.x, 182), cc.v2(pos.x, -117), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 100 && angle >= 80) {//
                this.ruler.angle = 90
                if(pos.x >= -549 && pos.x <= -47 && pos.y >=-137 && pos.y <= -97) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = cc.v2(pos.x, -117)
                    if(pos.x >= -631 && pos.x-height <= -128 && pos.y >=-137 && pos.y <= -97) {
                        this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                        if(pos.x >= -87 && pos.x <= -47) {
                            this.ruler.setPosition(cc.v2(-67, -117))
                            this.drawLine(cc.v2(-67, -117), cc.v2(-67, 290), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x + 30, 50))
                        this.di.setPosition(cc.v2(pos.x - 300, -147))
                        this.gc.clear()
                        if(pos.x >= -87 && pos.x <= -47) {
                            this.drawLine2(cc.v2(-67, -117), cc.v2(-67, 182), this.gc)
                        }else {
                            this.drawLine2(cc.v2(pos.x, -117), cc.v2(pos.x, 182), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 175 && angle >= 155) {
                this.ruler.angle = 165
                let angle = this.ruler.angle%360
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let cos = Math.cos(angle * Math.PI / 180)
                let sin = Math.sin(angle * Math.PI / 180)
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(long <= 10) {
                    let jiaodian2 = this.zhixianjiaodian(cc.v2(-67, 182), cc.v2(-148, -117), pos, cc.v2(pos.x-width*-cos, pos.y + width*sin))
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = jiaodian2
                    UIHelp.showTip('画出图形的高')
                    return 2
                }
            }else if(angle <= 355 && angle >= 335) {
                this.ruler.angle = 345
                let angle = this.ruler.angle%360
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let cos = Math.cos(angle * Math.PI / 180)
                let sin = Math.sin(angle * Math.PI / 180)
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(long <= 10) {
                    let jiaodian2 = this.zhixianjiaodian(cc.v2(-529, 182), cc.v2(-611, -117), pos, cc.v2(pos.x-width*cos, pos.y - width*-sin))
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position = jiaodian2
                    UIHelp.showTip('画出图形的高')
                    return 2
                }
            }
        }else if(level == 3) {
            if(angle <= 10 || angle >= 350) {
                this.ruler.angle = 0
                if(pos.x >= -537 && pos.x <= -221 && pos.y < -97 && pos.y > -137) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position= cc.v2(pos.x, -117)
                    if(pos.x <= -39 && pos.x+width >= -639 && pos.y < -97 && pos.y > -137) {
                        this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x - 50, 40))
                        this.di.setPosition(cc.v2(pos.x + 200, -150))
                        this.gc.clear()
                        this.drawLine2(cc.v2(pos.x, -117), cc.v2(pos.x, 129), this.gc)
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 100 && angle >= 80) {
                this.ruler.angle = 90
                if(pos.x >= -537 && pos.x <= -221 && pos.y < -97 && pos.y > -137) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position= cc.v2(pos.x, -117)
                    if(pos.x-height <= -39 && pos.x >= -639 && pos.y < -97 && pos.y > -137) {
                        this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x + 50, 40))
                        this.di.setPosition(cc.v2(pos.x - 100, -150))
                        this.gc.clear()
                        this.drawLine2(cc.v2(pos.x, -117), cc.v2(pos.x, 129), this.gc)
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 190 && angle >= 170) {//
                this.ruler.angle = 180
                if(pos.x >= -639 && pos.x < -39 && pos.y < 149 && pos.y > 109) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position= cc.v2(pos.x, 129)
                    if(pos.x >= -639 && pos.x-width <= -221 && pos.y <= 149 && pos.y >= 109) {
                        this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                        if(pos.x >= -79 && pos.x <= -39) {
                            this.ruler.setPosition(cc.v2(-59, 129))
                            this.drawLine(cc.v2(-59, 129), cc.v2(-59, -420), this.gc)
                        }else if(pos.x >= -639 && pos.x <= -599) {
                            this.ruler.setPosition(cc.v2(-619, 129))
                            this.drawLine(cc.v2(-619, 129), cc.v2(-619, -420), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x + 30, 0))
                        this.di.setPosition(cc.v2(pos.x - 30, 160))
                        this.gc.clear()
                        if(pos.x >= -79 && pos.x <= -39) {
                            this.drawLine2(cc.v2(-59, 129), cc.v2(-59, -117), this.gc)
                        }else if(pos.x >= -639 && pos.x <= -599) {
                            this.drawLine2(cc.v2(-619, 129), cc.v2(-619, -117), this.gc)
                        }else {
                            this.drawLine2(cc.v2(pos.x, 129), cc.v2(pos.x, -117), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }else if(angle <= 280 && angle >= 260) {//
                this.ruler.angle = 270
                if(pos.x > -639 && pos.x < -39 && pos.y < 149 && pos.y > 109) {
                    AudioManager.getInstance().playSound('吸附', false)
                    this.ruler.position= cc.v2(pos.x, 129)
                    if(pos.x+height > -537 && pos.x < -39 && pos.y < 149 && pos.y > 109) {
                        this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                        if(pos.x >= -79 && pos.x <= -39) {
                            this.ruler.setPosition(cc.v2(-59, 129))
                            this.drawLine(cc.v2(-59, 129), cc.v2(-59, -300), this.gc)
                        }else if(pos.x >= -639 && pos.x <= -599) {
                            this.ruler.setPosition(cc.v2(-619, 129))
                            this.drawLine(cc.v2(-619, 129), cc.v2(-619, -300), this.gc)
                        }
                    }
                    let id = setTimeout(() => {
                        this.gao.active = true
                        this.di.active = true
                        this.gao.setPosition(cc.v2(pos.x - 30, 0))
                        this.di.setPosition(cc.v2(pos.x + 50, 160))
                        this.gc.clear()
                        if(pos.x >= -79 && pos.x <= -39) {
                            this.drawLine2(cc.v2(-59, 129), cc.v2(-59, -117), this.gc)
                        }else if(pos.x >= -639 && pos.x <= -599) {
                            this.drawLine2(cc.v2(-619, 129), cc.v2(-619, -117), this.gc)
                        }else {
                            this.drawLine2(cc.v2(pos.x, 129), cc.v2(pos.x, -117), this.gc)
                        }
                        clearTimeout(id)
                        let index = this.timeoutArr.indexOf(id)
                        this.timeoutArr.splice(index, 1)
                    }, 800);
                    this.timeoutArr[this.timeoutArr.length] = id
                    return 1
                }
            }
        }
        return 3
    } 

    yanchangxian(pos: cc.Vec2):any {
        let level = ReportManager.getInstance().getLevel()
        let angle = this.ruler.angle%360
        if(angle<0) {
            angle = 360 - Math.abs(angle)
        }
        let width = 332
        let height = 522
        let cos = Math.cos(angle * Math.PI / 180)
        let sin = Math.sin(angle * Math.PI / 180)
        this.gl.clear()
        this.gc.clear()
        if(level == 1 || level == 2) {
            if(angle <= 10 || angle >= 350) {
                if(pos.y >=-137 && pos.y <= -97 && pos.x <= -47 && pos.x+width >= -631) {
                    this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                    if(pos.x <= -47 && pos.x >= -87) {
                        this.drawLine(cc.v2(-67, -117), cc.v2(-67, 455), this.gc)
                    }
                }else if(pos.x + width >= -529 && pos.x <= -67 && pos.y >= 162 && pos.y <= 202) {
                   this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                }
            }else if(angle <= 85 && angle >= 65) {
                let angle = 74.3
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                let long1 = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(pos.y <= 202 && pos.y+width*sin >= -137 && long <= 10) {
                    this.drawLine(cc.v2(-197, -282), cc.v2(-50, 238), this.gl)
                    if(pos.y >= -257 && pos.y <= -217) {
                        this.drawLine(cc.v2(-183, -237), cc.v2(-183-(height+150)*sin, -237+(height+150)*cos), this.gc)
                    }
                }else if(pos.y <= 182 && pos.y + width*sin >= -117 && long1 <= 10) {
                    this.drawLine(cc.v2(-493, 311), cc.v2(-639, -208), this.gl)
                }
            }else if(angle <= 190 && angle >= 170) {//
                if(pos.x >= -631 && pos.x-width <= -87 && pos.y >=162 && pos.y <= 202) {
                    this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                    if(pos.x >= -631 && pos.x <= -591) {
                        this.drawLine(cc.v2(-611, 182), cc.v2(-611, -390), this.gc)
                    }
                }else if(pos.x >= -611 && pos.x-width <= -148 && pos.y >=-137 && pos.y <= -97) {
                    this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                }
            }else if(angle <= 265 && angle >= 245) {
                let angle = 254.3
                if(angle<0) {
                    angle = 360 - Math.abs(angle)
                }
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                let long1 = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(pos.y >= -137 && pos.y- width*-sin && long <= 10) {
                    this.drawLine(cc.v2(-493, 311), cc.v2(-639, -208), this.gl)
                    if(pos.y >= 276 && pos.y <= 316) {
                        this.drawLine(cc.v2(-498, 296), cc.v2(-498+(height+150)*-sin, 296- (height+150)*-cos), this.gc)
                    }
                }else if(pos.y-width*-sin <= 182 && pos.y >= -117 && long1 <= 10) {
                    this.drawLine(cc.v2(-197, -282), cc.v2(-50, 238), this.gl)
                }
            }else if(angle <= 280 && angle >= 260) {
                if(pos.x+height >= -529 && pos.x <= -67 && pos.y >=162 && pos.y <= 202) {
                    this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                    if(pos.x >= -631 && pos.x <= -591) {
                        this.drawLine(cc.v2(-611, 182), cc.v2(-611, -260), this.gc)
                    }
                }else if(pos.x+height >= -611 && pos.x <= -148 && pos.y >= -137 && pos.y <= -97) {
                    this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                }
            }else if(angle <= 100 && angle >= 80) {
                if(pos.x >= -611 && pos.x-height <= -148 && pos.y >=-137 && pos.y <= -97) {
                    this.drawLine(cc.v2(-680, -117), cc.v2(360, -117), this.gl)
                    if(pos.x >= -87 && pos.x <= -47) {
                        this.drawLine(cc.v2(-67, -117), cc.v2(-67, 290), this.gc)
                    }
                }else if(pos.x >= -529 && pos.x-height <= -67 && pos.y >= 162 && pos.y <= 202) {
                    this.drawLine(cc.v2(100, 182), cc.v2(-690, 182), this.gl)
                }
            }else if(angle <= 175 && angle >= 155) {
                let long = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                let long1 = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                if(pos.y >= -117 && pos.y-height*-cos <= 182 && long <= 10) {
                    this.drawLine(cc.v2(-197, -282), cc.v2(-50, 238), this.gl)
                }else if(pos.y >= -117 && pos.y-height*-cos <= 182 && long1 <= 10) {
                    this.drawLine(cc.v2(-493, 311), cc.v2(-639, -208), this.gl)
                }
            }else if(angle <= 355 && angle >= 335) {
                let long = this.getJuLi(pos, cc.v2(-529, 182), cc.v2(-611, -117))
                let long1 = this.getJuLi(pos, cc.v2(-67, 182), cc.v2(-148, -117))
                if(pos.y <= 182 && pos.y+height*cos >= -117 && long <= 10) {
                    this.drawLine(cc.v2(-493, 311), cc.v2(-639, -208), this.gl)
                }else if(pos.y <= 182 && pos.y+height*cos >= -117 && long1 <= 10) {
                    this.drawLine(cc.v2(-197, -282), cc.v2(-50, 238), this.gl)
                }
            }
        }else if(level == 3) {
            if(angle <= 10 || angle >= 350) {
                if(pos.x <= -39 && pos.x+width >= -639 && pos.y < -97 && pos.y > -137) {
                    this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                }else if(pos.x+width >= -517 && pos.x <= -241 && pos.y <= 149 && pos.y >= 109) {
                    this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                }
            }else if(angle <= 100 && angle >= 80) {
                if(pos.x-height <= -39 && pos.x >= -639 && pos.y < -97 && pos.y > -137) {
                    this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                }else if(pos.x >= -517 && pos.x-height <= -241 && pos.y <= 149 && pos.y >= 109) {
                    this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                }
            }else if(angle <= 190 && angle >= 170) {//
                if(pos.x >= -639 && pos.x-width <= -221 && pos.y <= 149 && pos.y >= 109) {
                    this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                    if(pos.x >= -79 && pos.x <= -39) {
                        this.drawLine(cc.v2(-59, 129), cc.v2(-59, -420), this.gc)
                    }else if(pos.x >= -639 && pos.x <= -599) {
                        this.drawLine(cc.v2(-619, 129), cc.v2(-619, -420), this.gc)
                    }
                }else if(pos.x >= -619 && pos.x-width <= -59 && pos.y <= -97 && pos.y >= -137) {
                    this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                }
            }else if(angle <= 280 && angle >= 260) {
                if(pos.x+height > -537 && pos.x < -39 && pos.y < 149 && pos.y > 109) {
                    this.drawLine(cc.v2(-750, 129), cc.v2(100, 129), this.gl)
                    if(pos.x >= -79 && pos.x <= -39) {
                        this.drawLine(cc.v2(-59, 129), cc.v2(-59, -300), this.gc)
                    }else if(pos.x >= -639 && pos.x <= -599) {
                        this.drawLine(cc.v2(-619, 129), cc.v2(-619, -300), this.gc)
                    }
                }else if(pos.x+height >= -619 && pos.x <= -241 && pos.y <= -97 && pos.y >= -137) {
                    this.drawLine(cc.v2(-760, -117), cc.v2(100, -117), this.gl)
                } 
            }else if(angle <= 56.4 && angle >= 16.4) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y <= 129 && pos.y + height*cos >= -117) {
                    this.drawLine(cc.v2(-310, 231), cc.v2(5, -204), this.gl)
                }
            }else if(angle <= 146 && angle >= 106) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y <= 129 && pos.y + width*sin >= -117) {
                    this.drawLine(cc.v2(-310, 231), cc.v2(5, -204), this.gl)
                }
            }else if(angle <= 237 && angle >= 197) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y-height*-cos <= 129 && pos.y >= -117) {
                    this.drawLine(cc.v2(-310, 231), cc.v2(5, -204), this.gl)
                }
            }else if(angle <= 326 && angle >= 286) {
                let long = this.getJuLi(pos, cc.v2(-241, 129), cc.v2(-59, -117))
                if(long <= 10 && pos.y-width*-sin <= 129 && pos.y >= -117) {
                    this.drawLine(cc.v2(-310, 231), cc.v2(5, -204), this.gl)
                }
            }else if(angle <= 269 && angle >= 229) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y >= -117 && pos.y - width*-sin <= 129) {
                    this.drawLine(cc.v2(-474, 242), cc.v2(-660, -218), this.gl)
                }
            }else if(angle <= 357 && angle >= 317) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y + height*cos >= -117 && pos.y  <= 129) {
                    this.drawLine(cc.v2(-474, 242), cc.v2(-660, -218), this.gl)
                }
            }else if(angle <= 88 && angle >= 48) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y + width*sin >= -117 && pos.y  <= 129) {
                    this.drawLine(cc.v2(-474, 242), cc.v2(-660, -218), this.gl)
                }
            }else if(angle <= 177 && angle >= 137) {
                let long = this.getJuLi(pos, cc.v2(-517, 129), cc.v2(-619, -117))
                if(long <= 10 && pos.y >= -117 && pos.y - height*-cos <= 129) {
                    this.drawLine(cc.v2(-474, 242), cc.v2(-660, -218), this.gl)
                }
            }
        }
    } 

    setprogress(num: number) {
        this.progressLabel.string = `${num}/3`
    }

    faguangtiAction() {
        let faguangti = this.guanzi.getChildByName('faguangti')
        let func = cc.callFunc(()=>{
            faguangti.setPosition(cc.v2(208, 0))
        }) 
        let moveBy = cc.moveTo(1.5, cc.v2(-430, 0))
        let seq = cc.sequence(moveBy, func)
        let forever = cc.repeatForever(seq)
        faguangti.runAction(forever)
    }

    drawLine(start:cc.Vec2, end: cc.Vec2, gl: cc.Graphics){
        //获得组件
        var com = gl
        com.clear()
        com.strokeColor.fromHEX('#FFFFFF')
        com.lineWidth = 10
        //获得从start到end的向量
        var line=end.sub(start)
        //获得这个向量的长度
        var lineLength=line.mag()
        //设置虚线中每条线段的长度
        var length=20
        //根据每条线段的长度获得一个增量向量
        var increment=line.normalize().mul(length)
        //确定现在是画线还是留空的bool
        var drawingLine=true
        //
        let canvas = cc.director.getScene().getChildByName('Canvas')
        let width = canvas.width / 2
        let height = canvas.height / 2
        start = cc.v2(start.x + width, start.y + height)
        end = cc.v2(end.x + width, end.y + height)
        //临时变量
        var pos=start.clone()
        //com.strokeColor=cc.color(255,255,255)
        //只要线段长度还大于每条线段的长度
        for(;lineLength>length;lineLength-=length)
        {
            //画线
            if(drawingLine)
            {
                com.moveTo(pos.x,pos.y)
                pos.addSelf(increment)
                com.lineTo(pos.x,pos.y)
                com.stroke()
            }
            //留空
            else
            {
                
                pos.addSelf(increment)
            }
            //取反
            drawingLine=!drawingLine
        }
        //最后一段
        if(drawingLine)
        {
            com.moveTo(pos.x,pos.y)
            com.lineTo(end.x,end.y)
            com.stroke()
        }
    }

    getJuLi(point: cc.Vec2, line1:cc.Vec2, line2:cc.Vec2){
        let p1 = line1
        let p2 = line2
        let p3 = point
        var len;
    
        //如果p1.x==p2.x 说明是条竖着的线
        if(p1.x-p2.x==0)
        {
            len=Math.abs(p3.x-p1.x)
        }
        else
        {
            var A=(p1.y-p2.y)/(p1.x-p2.x)
            var B=p1.y-A*p1.x
            
            len=Math.abs((A*p3.x+B-p3.y)/Math.sqrt(A*A+1))
        }
        
        return len
    }
    
    drawLine2(start:cc.Vec2, end: cc.Vec2, gl: cc.Graphics){
        //获得组件
        var com = gl
        com.clear()
        com.strokeColor.fromHEX('#FFFFFF')
        com.lineWidth = 10
        //获得从start到end的向量
        var line=end.sub(start)
        //获得这个向量的长度
        var lineLength=line.mag()
        //设置虚线中每条线段的长度
        var length=20
        //根据每条线段的长度获得一个增量向量
        var increment=line.normalize().mul(length)
        //确定现在是画线还是留空的bool
        var drawingLine=true
        //
        let canvas = cc.director.getScene().getChildByName('Canvas')
        let width = canvas.width / 2
        let height = canvas.height / 2
        start = cc.v2(start.x + width, start.y + height)
        end = cc.v2(end.x + width, end.y + height)
        //临时变量
        var pos=start.clone()
        //com.strokeColor=cc.color(255,255,255)
        //只要线段长度还大于每条线段的长度
        AudioManager.getInstance().playSound('连线', false)
        let xuxianId = setInterval(()=>{
            if(lineLength>length) {
                   //画线
                if(drawingLine)
                {
                    com.moveTo(pos.x,pos.y)
                    pos.addSelf(increment)
                    com.lineTo(pos.x,pos.y)
                    com.stroke()
                }
                //留空
                else
                {
                    
                    pos.addSelf(increment)
                }
                //取反
                drawingLine=!drawingLine
                lineLength-=length
            }else {
                clearInterval(xuxianId)
                    //最后一段
                    if(drawingLine)
                    {
                        com.moveTo(pos.x,pos.y)
                        com.lineTo(end.x,end.y)
                        com.stroke()
                    }
            }
        }, 50)
    }

     zhixianjiaodian(a:cc.Vec2,b:cc.Vec2,c:cc.Vec2,d:cc.Vec2):any{
        var k0 = (b.y-a.y)/(b.x-a.x)
    
        var e = (b.y - k0*b.x)
  
        var k1 = (d.y-c.y)/(d.x-c.x)
   
        var e1 = (d.y - k1*d.x)
  
        var x = (e1-e)/(k0-k1)

        var y = k0*x + e
                                          
        return cc.v2((e1-e)/(k0-k1), k0*x + e)
    }
   
    segmentsIntr(a:cc.Vec2,b:cc.Vec2,c:cc.Vec2,d:cc.Vec2): any{
        /**1解线性方程组,求线段交点.**/
        //如果分母为0则平行或共线,不相交
        var denominator=(b.y-a.y)*(d.x-c.x)-(a.x-b.x)*(c.y-d.y);
        if(denominator==0){
        return false;
        }
        //线段所在直线的交点坐标(x,y)
        var x=((b.x-a.x)*(d.x-c.x)*(c.y-a.y)
        +(b.y-a.y)*(d.x-c.x)*a.x
        -(d.y-c.y)*(b.x-a.x)*c.x)/denominator;
        var y=-((b.y-a.y)*(d.y-c.y)*(c.x-a.x)
        +(b.x-a.x)*(d.y-c.y)*a.y
        -(d.x-c.x)*(b.y-a.y)*c.y)/denominator;
        /**2判断交点是否在两条线段上**/
        if(
        //交点在线段1上
        (x-a.x)*(x-b.x)<=0&&(y-a.y)*(y-b.y)<=0
        //且交点也在线段2上
        &&(x-c.x)*(x-d.x)<=0&&(y-c.y)*(y-d.y)<=0
        ){
        //返回交点p
        return cc.v2(x, y)
        
        }
        //否则不相交
        return false
    }

    rightStartAction() {
        AudioManager.getInstance().playSound('点击', false)
        this.isRightBtn = true
        this.intervalId = setInterval(()=>{
            let is = this.isRotation
            if(is) {
                return
            }
            this.isRotation = true
            this.ruler.stopAllActions()
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 4})
            }
            this.ruler.runAction(cc.sequence(cc.rotateBy(0.1, 5), cc.callFunc(()=>{this.isRotation = false; this.ruler.setPosition(this.resetPos(this.ruler.position))})))
        }, 200)
    }

    rightEndAction() {
        this.isRightBtn = false 
        if(this.intervalId) {
            clearInterval(this.intervalId) 
            this.intervalId = null
        }
        if(!this.isRotation){
            let is = this.isRotation
            if(is) {
                return
            }
            this.isRotation = true
            this.ruler.stopAllActions()
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 5})
            }
            this.ruler.runAction(cc.sequence(cc.rotateBy(0.1, 5), cc.callFunc(()=>{this.isRotation = false; this.ruler.setPosition(this.resetPos(this.ruler.position))})))
        }
    }

    leftStartAction() {
        AudioManager.getInstance().playSound('点击', false)
        this.isLeftBtn = true
        this.intervalId1 = setInterval(()=>{
            let is = this.isRotation
            if(is) {
                return
            }
            this.isRotation = true
            this.ruler.stopAllActions()
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 6})
            }
            this.ruler.runAction(cc.sequence(cc.rotateBy(0.1, -5), cc.callFunc(()=>{this.isRotation = false; this.ruler.setPosition(this.resetPos(this.ruler.position))})))
        }, 200)
    }

    leftEndAction() {
        this.isLeftBtn = false 
        if(this.intervalId1) {
            clearInterval(this.intervalId1) 
            this.intervalId1 = null
        } 
        if(!this.isRotation){
            let is = this.isRotation
            if(is) {
                return
            }
            this.isRotation = true
            this.ruler.stopAllActions()
            if(!this.isAction) {
                GameMsg.getInstance().actionSynchro({type: 7})
            }
            this.ruler.runAction(cc.sequence(cc.rotateBy(0.1, -5), cc.callFunc(()=>{this.isRotation = false; this.ruler.setPosition(this.resetPos(this.ruler.position))})))
        }
    }

    onBtnRight() {
        let button = this.right
        button.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.rightStartAction()
        })
        button.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.rightEndAction()
        })
        button.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            this.rightEndAction()
        })
    }

    onBtnLeft() {
        let button = this.left
        button.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.leftStartAction()
        })
        button.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.leftEndAction()
        })
        button.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            this.leftEndAction()
        })
    }
    resetPos(oriPos: cc.Vec2):cc.Vec2{
        let pos = oriPos
        let rotation = this.ruler.angle%360
        if(rotation < 0) {
            rotation = 360 - Math.abs(rotation)
        }
        let cos = Math.cos(rotation * Math.PI / 180)
        let sin = Math.sin(rotation * Math.PI / 180)
        let width = 332
        let height = 522
        let angle = Math.abs(rotation) % 360
        if(angle<90 && angle>=0) {
            if(pos.x + width * cos > 460) {  
                pos.x = 460  - width * cos
            }else if(pos.x - height * sin < -855) {
                pos.x = height * sin - 855
            }
            if(pos.y + width*sin > 440 || pos.y + height*cos > 440) {
                if(width*sin > height*cos) {
                    pos.y = 440 - width*sin
                }else {
                    pos.y = 440 - height*cos
                }
            }else if(pos.y < -430) {
                pos.y = - 430
            }
        }else if(angle<180 && angle>=90) {
            if(pos.x  > 460) {  
                pos.x = 460 
            }else if(pos.x - height*sin < -855 || pos.x - width*-cos < -855) {
                if(height*sin > width*-cos) {
                    pos.x = height*sin - 855
                }else {
                    pos.x = width*-cos -855
                }
            }
            if(pos.y + width*sin > 440) {
                pos.y = 440 - width*sin
            }else if(pos.y - height*-cos < -430) {
                pos.y = height*-cos - 430
            }
        }else if(angle<270 && angle>=180) {
            if(pos.x + height * -sin > 460) {  
                pos.x = 460  - height * -sin
            }else if(pos.x - width * -cos < -855) {
                pos.x = width * -cos - 855
            }
            if(pos.y > 440) {
                pos.y = 440
            }else if(pos.y - height*-cos < -430 || pos.y - width*-sin < -430) {
               if(height*-cos > width*-sin) {
                    pos.y = height*-cos - 430
               }else {
                   pos.y = width*-sin - 430
               }
            }
        }else if(angle<360 && angle>=270) {
            if(pos.x + width * cos > 460 || pos.x + height*-sin > 460) {  
                if(width*cos > height*-sin) {
                    pos.x = 460 - width * cos
                }else {
                    pos.x = 460 - height*-sin
                }
            }else if(pos.x < -855) {
                pos.x = - 855
            }
            if(pos.y + height*cos > 440) {
                pos.y = 440 - height*cos
            }else if(pos.y - width*-sin< -430) {
                pos.y = width*-sin - 430
            }
        }

        return pos
    }

    private onInit() {
        this.actionId = 0
        this.archival.angle = null
        this.archival.answerdata = null
        this.archival.level = null
        this.archival.rightNum = null
        this.archival.totalNum = null
        this.archival.pos = null
        this.isOver = false
        ReportManager.getInstance().answerReset()
        UIManager.getInstance().closeUI(OverTips)
        this.mask.active = true
        this.isAudio = true
        this.initGame()
        this.paipaiAction('idle-01')
        let id = setTimeout(() => {
            console.log('start action')
            this.startAction()
            let index = this.timeoutArr.indexOf(id)
            this.timeoutArr.splice(index, 1)
        }, 500);
        this.timeoutArr[this.timeoutArr.length] = id
        this.round1()
    }

    private onRecovery(data: any) {
        this.isBreak = true
        this.isOver = false
        let answerdata = data.answerdata
        let level = data.level
        let pos = data.pos
        let angle = data.angle
        let rightNum = data.rightNum
        let totalNum = data.totalNum
        if(level == 1) {
            this.round1()
        }else if(level == 2) {
            this.round2()
        }else if(level == 3) {
            this.round3()
        }
        ReportManager.getInstance().setLevel(level)
        ReportManager.getInstance().setAnswerData(answerdata)
        this.ruler.angle = angle
        this.ruler.position = pos
        ReportManager.getInstance().setRightNum(rightNum)
        ReportManager.getInstance().setTotalNum(totalNum)
    }

    addSDKEventListener() {
        GameMsg.getInstance().addEvent(GameMsgType.ACTION_SYNC_RECEIVE, this.onSDKMsgActionReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.DISABLED, this.onSDKMsgDisabledReceived.bind(this));
        //GameMsg.getInstance().addEvent(GameMsgType.DATA_RECOVERY, this.onSDKMsgRecoveryReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.STOP, this.onSDKMsgStopReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.INIT, this.onSDKMsgInitReceived.bind(this));
    }

     //动作同步消息监听
     onSDKMsgActionReceived(data: any) {
        this.isAction = true
        data = eval(data).action
        if (data.type == 1) {
            let pos = data.pos
            this.starAction(pos)
        }else if(data.type == 2) {
            let pos = data.pos
            this.moveAction(pos)
        }else if(data.type == 3) {
            this.endAction()
        }else if(data.type == 4) {
            this.rightStartAction()
        }else if(data.type == 5) {
            this.rightEndAction()
        }else if(data.type == 6) {
            this.leftStartAction()
        }else if(data.type == 7) {
            this.leftEndAction()
        }
    }
    //禁用消息监听
    onSDKMsgDisabledReceived() {
        //交互游戏暂不处理此消息
    }
    //数据恢复消息监听
    onSDKMsgRecoveryReceived(data: any) {
        data = eval(data)
        this.onRecovery(data.data);
    }
    //游戏结束消息监听
    onSDKMsgStopReceived() {
        if (!this.isOver) {
            if (!ReportManager.getInstance().isStart()) {
                ReportManager.getInstance().addLevel()
            }
            ReportManager.getInstance().gameOver(this.gameResult)
            //新课堂上报
            GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData());
        }

        GameMsg.getInstance().finished();
    }
    //初始化消息监听
    onSDKMsgInitReceived() {
        this.onInit();
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.coursewareId, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                if (Array.isArray(response.data)) {
                    //this.setPanel()
                    UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                        (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                            "CoursewareKey错误,请联系客服！",
                            "", "", "确定");
                    });
                    return;
                }
                let content = JSON.parse(response.data.courseware_content);
                if (content != null) {
                    if (content.CoursewareKey == ConstValue.CoursewareKey) {
                       
                        //this.setPanel();
                    } else {
                        UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                            (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                                "CoursewareKey错误,请联系客服！",
                                "", "", "确定");
                        });
                        return;
                    }
                }else {
                    //this.setPanel();
                }
            }
        }.bind(this), null);
    }


}
