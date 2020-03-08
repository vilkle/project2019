/*
 * @Author: 马超
 * @Date: 2020-02-29 14:55:20
 * @LastEditTime: 2020-03-07 15:20:55
 * @Description: 游戏脚本
 * @FilePath: \wucaibinfenbang\assets\scripts\UI\panel\GamePanel.ts
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
    @property(cc.Node) private trumpet: cc.Node = null
    @property(cc.Node) private mask: cc.Node = null
    @property(cc.Node) private touchNode: cc.Node = null
    @property(cc.Node) private node1: cc.Node = null
    @property(cc.Node) private node2: cc.Node = null
    @property(cc.Node) private showNode: cc.Node = null
    @property(cc.Node) private spine: cc.Node = null
    @property(cc.SpriteFrame) private title1: cc.SpriteFrame = null
    @property(cc.SpriteFrame) private title2: cc.SpriteFrame = null
    private trumpetId: number = null
    private touchTarget: any = null
    private slotsArr: cc.Node[] = []
    private sticksArr: cc.Node[] = []
    private slotupsArr: cc.Node[] = []
    private boundingBox: cc.Node = null
    private roundNode: cc.Node = null
    private rightNum: number = 0 //没关答对的数量
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private isPlay: boolean = false
    private timeoutIdArr: number[] = []
    private audioIdArr: number[] = []
    private nodeArr: number[] = [] //节点对应信息
    private actionId: number = 0
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
            this.gameResult = AnswerResult.AnswerHalf
            ReportManager.getInstance().answerHalf()
            ReportManager.getInstance().touchStart()
        }, this)
        this.title.on(cc.Node.EventType.TOUCH_START, this.audioCallback, this)
        this.trumpet.on(cc.Node.EventType.TOUCH_START, this.audioCallback, this)
        let id = setTimeout(()=>{
            AudioManager.getInstance().stopAll()
            //缤纷棒能拼出什么，动手试一试
            this.trumpetActionStart()
            AudioManager.getInstance().playSound('缤纷棒能拼出什么，动手试一试', false, 1, null, ()=>{
                AudioManager.getInstance().playSound('四根缤纷棒能拼出什么', false, 1, null, ()=>{
                    this.trumpetActionStop()
                    this.mask.active = false
                    ReportManager.getInstance().levelStart(false)
                })
            })
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500)
        this.timeoutIdArr.push(id)
    }

    onDestroy() {
        this.removeListenerOnOptions()
        this.bg.off(cc.Node.EventType.TOUCH_START)
        this.title.off(cc.Node.EventType.TOUCH_START)
        if(this.trumpetId != null) {
            clearInterval(this.trumpetId)
            this.trumpetId = null
        }
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
        ReportManager.getInstance().addResult(2)
        ReportManager.getInstance().setQuestionInfo(0, '四根缤纷棒能拼出什么?')
        ReportManager.getInstance().setQuestionInfo(1, '五根缤纷棒能拼出什么?')
        //播放题干
        this.mask.active = true
        //题型初始化
        this.round1()
    }

    round1() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title1
        this.rightNum = 0
        this.node1.active = true
        this.node2.active = false
        this.roundNode = this.node1
        this.slotsArr = this.roundNode.getChildByName('slots').children
        this.nodeArr = [3,2,1,0]
        this.resetInterface()
        this.removeListenerOnOptions()
        this.addListenerOnOptions()
    }

    round2() {
        this.mask.active = false
        this.title.getComponent(cc.Sprite).spriteFrame = this.title2
        this.rightNum = 0
        this.node2.active = true
        this.node1.active = false
        this.roundNode = this.node2
        this.slotsArr = this.roundNode.getChildByName('slots').children
        this.nodeArr = [0,1,2,3,4]
        this.resetInterface()
        this.removeListenerOnOptions()
        this.addListenerOnOptions()
    }

    resetInterface() {
        this.roundNode.getChildByName('slots').active = true
        this.roundNode.getChildByName('slotups').active = true
        this.roundNode.getChildByName('example').active = true
        this.boundingBox = this.roundNode.getChildByName('BoundingBox')
        this.slotupsArr = this.roundNode.getChildByName('slotups').children
        this.sticksArr = this.roundNode.getChildByName('sticks').children
        for (const key in this.slotsArr) {
            this.slotsArr[key].getChildByName('slot').active = true
            this.slotupsArr[key].getChildByName('stick').active = false
         }
         for (const key in this.sticksArr) {
             this.sticksArr[key].active = true
         }
    }

    addListenerOnOptions() {
        for(let i = 0; i < this.sticksArr.length; ++i) {
            let node = this.sticksArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                ReportManager.getInstance().touchStart()
                ReportManager.getInstance().setAnswerNum(1)
                if(this.touchTarget || e.target.opacity == 0) {
                    return
                }
                this.gameResult = AnswerResult.AnswerHalf
                ReportManager.getInstance().answerHalf()
                this.touchTarget = e.target
                e.target.opacity = 0
                this.touchNode.active = true
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
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
                let boxArr: cc.Node[] = this.boundingBox.children
                let overNum = 0
                for(let j = 0; j < boxArr.length; ++j) {
                    if(boxArr[j].getBoundingBox().contains(this.boundingBox.convertToNodeSpaceAR(e.currentTouch._point)) && this.mate1(i, j) && this.slotupsArr[this.nodeArr[j]].getChildByName('stick').active == false) {
                        boxArr[j].getChildByName('box').active = true
                        for(let m = 0; m < boxArr.length; ++m) {
                            if(m != j) {
                                boxArr[m].getChildByName('box').active = false
                            }
                        }
                    }else {
                        overNum ++
                    }
                    if(j == boxArr.length - 1) {
                        if(overNum == boxArr.length) {
                            for(let n = 0; n < boxArr.length; ++n) {
                                boxArr[n].getChildByName('box').active = false
                            }
                        }
                    }
                }
                
            }) 
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchTarget = null
                this.touchNode.active = false
                e.target.opacity = 255
                let boxArr: cc.Node[] = this.boundingBox.children
                for(let n = 0; n < boxArr.length; ++n) {
                    boxArr[n].getChildByName('box').active = false
                }
            }) 
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                let num = 0
                let boxArr: cc.Node[] = this.boundingBox.children
                let skipIndex = 100
                for(let j = 0; j < boxArr.length; ++j) {
                    if(boxArr[j].getBoundingBox().contains(this.boundingBox.convertToNodeSpaceAR(e.currentTouch._point)) && this.mate1(i, j)) {
                        if(this.mate2(i)) {
                            if(this.isRight(i, j)) {
                                let level = ReportManager.getInstance().getLevel() - 1
                                this.actionId++
                                this.archival.gamedata[level].push(i)
                                this.archival.answerdata = ReportManager.getInstance().getAnswerData()
                                GameMsg.getInstance().dataArchival(this.actionId, this.archival)
                                this.stopAudio()
                                AudioManager.getInstance().playSound('棒棒棒', false, 1, (id)=>{this.audioIdArr.push(id)})
                                this.slotupsArr[this.nodeArr[this.rightNum]].getChildByName('stick').active = true
                                this.slotsArr[this.nodeArr[this.rightNum]].getChildByName('slot').active = false
                                this.rightNum++
                                if(this.isSuccess(this.rightNum)) {
                                    this.mask.active = true
                                    if(level == 0) {
                                        ReportManager.getInstance().levelEnd(AnswerResult.AnswerRight)
                                        GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                                    }else if(level == 1) {
                                        this.gameResult = AnswerResult.AnswerRight
                                        this.isOver = true
                                        ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                                        GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                                    } 
                                    this.showAction(level)
                                }
                                num ++
                            }else {
                                //顺序不对
                                let node = boxArr[this.rightNum].getChildByName('box')
                                skipIndex = this.rightNum
                                node.active = true
                                node.opacity = 0
                                let fadein = cc.fadeIn(0.3)
                                let fadeout = cc.fadeOut(0.3)
                                let fun = cc.callFunc(()=>{this.mask.active = false; node.opacity = 255; node.active = false})
                                let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                                this.mask.active = true
                                this.stopAudio()
                                AudioManager.getInstance().playSound('dingdingding', false, 1, (id)=>{this.audioIdArr.push(id)})
                                node.runAction(seq)
                                e.target.opacity = 255
                            }
                        }else {
                            //与正确答案形状不匹配
                            this.stopAudio()
                            AudioManager.getInstance().playSound('还没轮到我', false, 1, (id)=>{this.audioIdArr.push(id)})
                            e.target.opacity = 255
                        }
                    }
                }
                if(num == 0) {
                    //slot和stick不匹配
                    e.target.opacity = 255
                }
                this.touchTarget = null
                this.touchNode.active = false
                for(let n = 0; n < boxArr.length; ++n) {
                    if(n != skipIndex) {
                        boxArr[n].getChildByName('box').active = false
                    }
                }
            }) 
        }
    }
    removeListenerOnOptions() {
        for(let i = 0; i < this.sticksArr.length; ++i) {
            let node = this.sticksArr[i]
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    } 

    mate2(stickIndex: number) {
        let level = ReportManager.getInstance().getLevel() - 1
        if(level == 0) {
            if(this.rightNum < 3 && [1,2,3].indexOf(stickIndex) != -1) {
                return true
            }else if(this.rightNum ==3 && stickIndex == 0){
                return true
            }
        }else if(level == 1) {
            if([0,1,2].indexOf(stickIndex) != -1 && [0,2,4].indexOf(this.rightNum) != -1) {
                return true
            }else if([3,4].indexOf(stickIndex) != -1 && [1,3].indexOf(this.rightNum) != -1) {
                return true
            }
        }
        return false
    }

    mate1(stickIndex: number, boxIndex: number): boolean {
        let level = ReportManager.getInstance().getLevel() - 1
        if(level == 0) {
            if(stickIndex == 0 && boxIndex == 3) {
                return true
            }else if([1,2,3].indexOf(stickIndex) != -1 && [0,1,2].indexOf(boxIndex) != -1){
                return true
            }
        }else if(level == 1) {
            if([0,1,2].indexOf(stickIndex) != -1 && [0,2,4].indexOf(boxIndex) != -1) {
                return true
            }else if([3,4].indexOf(stickIndex) != -1 && [1,3].indexOf(boxIndex) != -1) {
                return true
            }
        }
        return false
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

    showAction(level: number) {
        this.roundNode.getChildByName('slots').active = false
        this.roundNode.getChildByName('slotups').active = false
        this.roundNode.getChildByName('example').active = false
        let node: cc.Node = null
        let fadein = cc.fadeIn(0.2)
        let fadeout = cc.fadeOut(0.2)
        let time = cc.delayTime(0.2)
        let fun = cc.callFunc(()=>{
            node.active = false
            this.spine.active = true
            if(level == 0) {
                this.spine.getComponent(sp.Skeleton).setAnimation(0, 'qz', false)
                this.spine.getComponent(sp.Skeleton).addAnimation(0, 'qz', false)                
            }else if(level == 1) {
                this.spine.getComponent(sp.Skeleton).setAnimation(0, 'cz', false)
                this.spine.getComponent(sp.Skeleton).addAnimation(0, 'cz', false)
            }
        })
        let id = setTimeout(() => {
            this.spine.active = false
            if(level == 0) {
                //UIHelp.showOverTip(1,'', '下一关', ()=>{
                    this.round2()
                    this.mask.active = true
                    AudioManager.getInstance().stopAll()
                    this.trumpetActionStart()
                    AudioManager.getInstance().playSound('五个缤纷棒能拼出什么', false, 1, null, ()=>{
                        this.trumpetActionStop()
                        this.mask.active = false
                        ReportManager.getInstance().levelStart(false)
                    })
                //}, null, null)
            }else if(level == 1) {
                    UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧~', '', null, null, '闯关成功')
            }
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 4000);
        this.timeoutIdArr.push(id)
        
        if(level == 0) {
            node = this.showNode.getChildByName('show1')  
        }else if(level == 1) {
            node = this.showNode.getChildByName('show2')
        }
        node.active = true
        node.opacity = 0
        let seq = cc.sequence(fadein, fadeout, fadein, fadeout, time,fun)
        AudioManager.getInstance().playSound('正确', false)
        node.runAction(seq)
    }

    isSuccess(rightNum: number):boolean {
        let level = ReportManager.getInstance().getLevel() - 1
        if(level == 0 && rightNum >= 4) {
            return true
        }else if(level == 1 && rightNum >= 5) {
            return true
        }
        return false
    }

    isRight(stickIndex: number, boxIndex: number):boolean {
        let level = ReportManager.getInstance().getLevel() - 1
        if(level == 0) {
            if(this.rightNum < 3 && [1,2,3].indexOf(stickIndex) != -1 && this.rightNum == boxIndex) {
                return true
            }else if(this.rightNum == 3 && stickIndex == 0) {
                return true
            }
        }else if(level == 1) {
            if([0,2,4].indexOf(this.rightNum) != -1 && [0,1,2].indexOf(stickIndex) != -1 && this.rightNum == boxIndex) {
                return true
            }else if([1,3].indexOf(this.rightNum) != -1 && [3,4].indexOf(stickIndex) != -1 && this.rightNum == boxIndex) {
                return true
            }
        }
        return false
    }

    trumpetActionStart() {
        let index = 0
        this.trumpetId = setInterval(()=>{
            index++
            if(index % 3 == 1) {
                this.trumpet.children[0].active = true
                this.trumpet.children[2].active = false
            }else if(index % 3 == 2) {
                this.trumpet.children[1].active = true
                this.trumpet.children[0].active = false
            }else if(index % 3 == 0) {
                this.trumpet.children[2].active = true
                this.trumpet.children[1].active = false
            }
        }, 300)
    }

    trumpetActionStop() {
        clearInterval(this.trumpetId)
        this.trumpetId = null
        this.trumpet.children[0].active = false
        this.trumpet.children[1].active = false
        this.trumpet.children[2].active = true
    }
    /**
     * @description: 题干按钮语音结束回调
     * @param {type} 
     * @return: 
     */
    audioCallback() {
        ReportManager.getInstance().touchStart()
        //ReportManager.getInstance().gameOver(AnswerResult.NoAnswer)
        if(this.isPlay) {
            return
        }
        this.mask.active = true
        this.isPlay = true
        this.trumpetActionStart()
        let level = ReportManager.getInstance().getLevel() - 1
        if(level == 0) {
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('四根缤纷棒能拼出什么', false, 1, null, ()=>{
                this.mask.active = false
                this.isPlay = false
                this.trumpetActionStop()
            })
        }else if(level == 1) {
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('五个缤纷棒能拼出什么', false, 1, null, ()=>{
                this.mask.active = false
                this.isPlay = false
                this.trumpetActionStop()
            })
        }
    }

    /**
     * 初始化界面
     *
     * @private
     * @memberof GamePanel
     */
    private onInit() {
        ReportManager.getInstance().answerReset()
        this.round1()
        this.mask.active = true
        let id = setTimeout(() => {
            AudioManager.getInstance().stopAll()
            this.trumpetActionStart()
            AudioManager.getInstance().playSound('缤纷棒能拼出什么，动手试一试', false, 1, null, ()=>{
                this.trumpetActionStop()
                this.mask.active = false
                this.title.active = true
                this.trumpet.active = true
                ReportManager.getInstance().answerReset()
                ReportManager.getInstance().levelStart(false)
            })
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500)
        this.timeoutIdArr.push(id)
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
       if(data.gamedata[0].length < 4){
            this.round1()
            let len = data.gamedata[0].length
            for(let i = 0; i < len; ++i) {
                this.slotsArr[i].getChildByName('slot').active = false
                this.slotupsArr[i].getChildByName('stick').active = true
                this.sticksArr[data.gamedata[0][i]].active = false
            }
            ReportManager.getInstance().setAnswerData(data.answerdata)
            ReportManager.getInstance().levelStart(true)
       }else if(data.gamedata[0].length == 4 && data.gamedata[1].length < 5){
            this.round2()
            let len = data.gamedata[1].length
            for(let i = 0; i < len; ++i) {
                this.slotsArr[i].getChildByName('slot').active = false
                this.slotupsArr[i].getChildByName('stick').active = true
                this.sticksArr[data.gamedata[1][i]].active = false
            }
            ReportManager.getInstance().setAnswerData(data.answerdata)
            ReportManager.getInstance().levelStart(true)
       }else if(data.gamedata[0].length == 4 && data.gamedata[1].length == 5) {

       }

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
