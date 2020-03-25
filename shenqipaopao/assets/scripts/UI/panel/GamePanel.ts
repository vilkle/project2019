/*
 * @Author: 马超
 * @Date: 2020-02-29 14:55:20
 * @LastEditTime: 2020-03-19 12:02:32
 * @Description: 游戏脚本
 * @FilePath: \shenqipaopao\assets\scripts\UI\panel\GamePanel.ts
 */

import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { ConstValue } from "../../Data/ConstValue";
import { UIHelp } from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import { TipUI } from "./TipUI";
import { OverTips } from "../Item/OverTips";
import { ListenerType } from "../../Data/ListenerType";
import { ListenerManager } from "../../Manager/ListenerManager";
import SubmissionPanel from "./SubmissionPanel";
import ErrorPanel from "./ErrorPanel";
import { AnswerResult } from "../../Data/ConstValue";
import GameMsg from "../../Data/GameMsg";
import { GameMsgType } from "../../Data/GameMsgType";
import { Tools } from "../../UIComm/Tools";
import {ReportManager}from "../../Manager/ReportManager";
import { DaAnData } from "../../Data/DaAnData";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node) private bg: cc.Node = null
    @property(cc.Node) private title: cc.Node = null
    @property(cc.Node) private mask: cc.Node = null
    @property(cc.Node) private touchNode: cc.Node = null
    @property(cc.Node) private slots: cc.Node = null
    @property(cc.Node) private sticks: cc.Node = null
    private touchTarget: any = null
    private altas: cc.SpriteAtlas = null
    private audioOver: boolean = false
    private loadResOver: boolean = false
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private timeoutIdArr: number[] = []
    private audioIdArr: number[] = []
    private actionId: number = 0
    private rightNum: number = 0
    private isOver: boolean = false
    private archival = {
        answerdata: null,
        gamedata: [[],[]]
    }
    
    onLoad() {
        if(ConstValue.IS_TEACHER) {
            DaAnData.getInstance().submitEnable = true//没有教师端直接提交
            UIManager.getInstance().openUI(UploadAndReturnPanel, 212)
        }else {
            this.getNet()
        }
        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{
            // this.gameResult = AnswerResult.AnswerHalf
            // ReportManager.getInstance().answerHalf()
        }, this)
        this.title.on(cc.Node.EventType.TOUCH_START, this.audioCallback, this)
        this.mask.active = true
        
    }

    onDestroy() {
        ReportManager.getInstance().answerReset()
        this.bg.off(cc.Node.EventType.TOUCH_START)
        //this.title.off(cc.Node.EventType.TOUCH_START)
       
        for (const key in this.timeoutIdArr) {
           clearTimeout(this.timeoutIdArr[key])
        }
        this.timeoutIdArr = []
    }

    start() {
        //监听新课堂发出的消息
        this.addSDKEventListener()
        //新课堂上报
        GameMsg.getInstance().gameStart()
        //预加载OverTip资源
        cc.loader.loadRes("prefab/ui/panel/OverTips", cc.Prefab, function (err, prefab) { })
        //添加上报result数据
        ReportManager.getInstance().addResult(1)
        ReportManager.getInstance().setQuestionInfo(0, '仔细观察,选出正确的泡泡吧。')
        //初始化游戏
        this.initGame()
        let id = setTimeout(()=>{
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.audioOver = true
                //ReportManager.getInstance().levelStart(false)
                if(this.loadResOver) {
                    this.mask.active = false
                }
            })
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500)
        this.timeoutIdArr.push(id)
    }

    initGame() {
        cc.loader.loadRes("images/gameUI/bubble",cc.SpriteAtlas,function(err,Altas)
        {
            this.altas = Altas
            this.loadResOver = true
            
            this.addListenerOnOptions(this.sticks.children)
            ReportManager.getInstance().logAnswerdata()
            if(this.audioOver) {
                this.mask.active = false
            }
        }.bind(this))
    }


    addListenerOnOptions(arr: cc.Node[]) {
        for(let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                this.gameResult = AnswerResult.AnswerHalf
                if(!ReportManager.getInstance().isStart()) {
                    ReportManager.getInstance().levelStart(false)
                }
                ReportManager.getInstance().touchStart()
                ReportManager.getInstance().answerHalf()
                ReportManager.getInstance().setAnswerNum(1)
                if(this.touchTarget || !e.target.getChildByName('sprite').active) {
                    return
                }
                AudioManager.getInstance().playSound('touch', false, 1)
                ReportManager.getInstance().answerHalf()
                this.touchTarget = e.target
                this.touchNode.active = true
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame
                e.target.getChildByName('sprite').active = false
                e.target.getChildByName('box').active = true
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)

            }) 
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                let width = e.target.width / 2
                let height = e.target.height / 2
                let viewWidth = 2048 / 2
                let viewHeight = 1152 / 2
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                if(pos.x > viewWidth - width) {
                    pos.x = viewWidth - width
                }else if(pos.x < width -viewWidth) {
                    pos.x = width - viewWidth
                }
                if(pos.y > viewHeight - height) {
                    pos.y = viewHeight - height
                }else if(pos.y < height -viewHeight) {
                    pos.y = height - viewHeight
                }
                this.touchNode.setPosition(pos)
                
                let overNum = 0
                let arr = this.slots.children
                for(let j = 0; j < arr.length; ++j) {
                    if(arr[j].getBoundingBox().contains(this.slots.convertToNodeSpaceAR(e.currentTouch._point)) && arr[j].getChildByName('sprite').active == false) {
                        arr[j].getChildByName('bottom').active = true
                        arr[j].getChildByName('spine').active = false
                        for(let m = 0; m < arr.length; ++m) {
                            if(m != j) {
                                arr[m].getChildByName('spine').active = true
                                arr[m].getChildByName('bottom').active = false
                            }
                        }
                    }else {
                        overNum ++
                    }
                    if(j == arr.length - 1) {
                        if(overNum == arr.length) {
                            for(let n = 0; n < arr.length; ++n) {
                                arr[n].getChildByName('spine').active = true
                                arr[n].getChildByName('bottom').active = false
                            }
                        }
                    }
                }

            }) 
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchNode.active = false
                this.touchTarget = null
                e.target.getChildByName('box').active = false
                e.target.getChildByName('sprite').active = true
                let arr = this.slots.children
                for(let n = 0; n < arr.length; ++n) {
                    if(!arr[n].getChildByName('sprite').active) {
                        arr[n].getChildByName('spine').active = true
                    }
                    arr[n].getChildByName('bottom').active = false
                }
            }) 
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                let index :number = null
                let overNum: number = 0
                let arr = this.slots.children
                for(let j = 0; j < arr.length; ++j) {
                    if(arr[j].getBoundingBox().contains(this.slots.convertToNodeSpaceAR(e.currentTouch._point))) {
                        index = j
                        this.mask.active = true
                        if(this.isRight(i, j)) {
                            ReportManager.getInstance().answerRight()
                            GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                            AudioManager.getInstance().playSound('right', false, 1)
                            this.rightNum ++
                            arr[j].getChildByName('bottom').active = true
                            let sp = arr[j].getChildByName('sprite')
                            sp.active = true
                            sp.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(i + 1, 'green')
                            sp.opacity = 0
                            let fadein = cc.fadeIn(0.3)
                            let fadeout = cc.fadeOut(0.3)
                            let fun = cc.callFunc(()=>{
                                this.mask.active = false
                                arr[j].getChildByName('bottom').active = false
                                if([4, 5].indexOf(j) != -1) {
                                    sp.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(i + 1, 'yellow')
                                }else {
                                    sp.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(i + 1, 'blue')
                                }
                                sp.opacity = 255
                                if(this.rightNum == 6) {
                                    this.isOver = true
                                    ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                                    GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                                    UIHelp.showOverTip(2,'你真棒！等等还没做完的同学吧~', '', null, null, '挑战成功')
                                }
                            })
                            let seq = cc.sequence(fadein, cc.delayTime(0.2), fadeout, fun)
                            sp.runAction(seq)
                        }else {
                            ReportManager.getInstance().answerWrong()
                            GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                            AudioManager.getInstance().playSound('wrong', false, 1)
                            this.mask.active = true
                            AudioManager.getInstance().playSound('replay', false, 1, null, ()=>{this.mask.active = false})
                            arr[j].getChildByName('bottom').active = true
                            let sp = arr[j].getChildByName('sprite')
                            sp.active = true
                            sp.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(i + 1, 'red')
                            sp.opacity = 0
                            let fadein = cc.fadeIn(0.3)
                            let fadeout = cc.fadeOut(0.3)
                            let fun = cc.callFunc(()=>{
                                this.mask.active = false
                                arr[j].getChildByName('bottom').active = false
                                arr[j].getChildByName('spine').active = true
                                sp.getComponent(cc.Sprite).spriteFrame = null
                                sp.active = false
                                e.target.getChildByName('box').active = false
                                e.target.getChildByName('sprite').active = true
                            })
                            let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                            sp.runAction(seq)
                        }
                    }else {
                        overNum ++
                    }
                }
                if(overNum == arr.length) {
                    e.target.getChildByName('box').active = false
                    e.target.getChildByName('sprite').active = true       
                }
                this.touchNode.active = false
                this.touchTarget = null
                for(let n = 0; n < arr.length; ++n) {
                    if(!arr[n].getChildByName('sprite').active) {
                        arr[n].getChildByName('spine').active = true
                    }
                    if(n != index) {
                        arr[n].getChildByName('bottom').active = false
                    }
                }
            }) 
        }
    }
    removeListenerOnOptions(arr: cc.Node[]) {
        for(let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    } 

    isRight(stickIndex: number, slotIndex: number) {
        if([0, 1].indexOf(slotIndex) != -1) {
            if([2, 3].indexOf(stickIndex) != -1) {
                return true
            }
        }else if([2, 3].indexOf(slotIndex) != -1) {
            if([1, 4].indexOf(stickIndex) != -1) {
                return true
            }
        }else if([4, 5].indexOf(slotIndex) != -1) {
            if([0, 5].indexOf(stickIndex) != -1) {
                return true
            }
        }
        return false
    }

    getSpriteFrame(index: number, color: string): cc.SpriteFrame {
        let str = index.toString() + '_' + color
        return this.altas.getSpriteFrame(str)
    }

    /**
     * @description: 停止audioIdArr中的音频
     */
    stopAudio() {
        for (const key in this.audioIdArr) {
            AudioManager.getInstance().stopAudio(this.audioIdArr[key])
        }
        this.audioIdArr = []
    }


    /**
     * @description: 题干按钮语音结束回调
     * @param {type} 
     * @return: 
     */
    audioCallback() {
        this.gameResult = AnswerResult.AnswerHalf
        if(!ReportManager.getInstance().isStart()) {
            ReportManager.getInstance().levelStart(false)
        }
        ReportManager.getInstance().touchStart()
        ReportManager.getInstance().answerHalf()
        ReportManager.getInstance().setAnswerNum(1)
        this.mask.active = true
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('title', false, 1, null, ()=>{this.mask.active = false})
    }

    /**
     * 初始化界面
     *
     * @private
     * @memberof GamePanel
     */
    private onInit() {
        ReportManager.getInstance().answerReset()
        let stickArr = this.sticks.children
        let slotArr = this.slots.children
        for (const key in stickArr) {
           stickArr[key].getChildByName('sprite').active = true
           stickArr[key].getChildByName('box').active = false
        }
        for (const key in slotArr) {
            slotArr[key].getChildByName('spine').active = true
            slotArr[key].getChildByName('bottom').active = false
            slotArr[key].getChildByName('sprite').active = false
         }
        this.mask.active = true
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
            this.mask.active = false
            ReportManager.getInstance().levelStart(false)
           
        })
    }

    /**
     *  根据已有的消息重置界面
     *
     * @private
     * @param {*} data
     * @returns
     * @memberof GamePanel
     */
    private onRecovery(data: any) {
     
    }
    
    addSDKEventListener() {
        GameMsg.getInstance().addEvent(GameMsgType.ACTION_SYNC_RECEIVE, this.onSDKMsgActionReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.DISABLED, this.onSDKMsgDisabledReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.DATA_RECOVERY, this.onSDKMsgRecoveryReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.STOP, this.onSDKMsgStopReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.INIT, this.onSDKMsgInitReceived.bind(this));
    }
    //动作同步消息监听
    onSDKMsgActionReceived() {
        //交互游戏暂不处理此消息
    }
    //禁用消息监听
    onSDKMsgDisabledReceived() {
        //交互游戏暂不处理此消息
    }
    //数据恢复消息监听
    onSDKMsgRecoveryReceived(data: any) {
        //判断收到的data类型是否是JSON格式
        if (typeof (data) == 'string') {
            try {
                let obj = JSON.parse(data);
                if (typeof (obj) == 'object' && obj) {
                    this.onRecovery(obj.answer_data);
                }
            } catch (e) {
                console.log('onSDKMsgRecoveryReceived data type error!');
                console.log(e);
                return false;
            }
        } else {
            console.log('data type: JSON. : ', data);
            this.onRecovery(data.answer_data);
        }
    }
    //游戏结束消息监听
    onSDKMsgStopReceived() {
        if(!this.isOver) {
            if(!ReportManager.getInstance().isStart()) {
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
        this.actionId = 0
        this.archival.gamedata = [[],[]]
        this.onInit();
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.coursewareId, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                if (Array.isArray(response.data)) {
                    // callback()
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
                        // cc.log("拉取到数据：")
                        // cc.log(content);
                    } else {
                        UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                            (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                                "CoursewareKey错误,请联系客服！",
                                "", "", "确定");
                        });
                        return;
                    }
                }
            }
        }.bind(this), null);
    }

   
}
