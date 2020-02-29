/*
 * @Author: 马超
 * @Date: 2020-02-26 13:52:34
 * @LastEditTime: 2020-02-29 20:19:42
 * @Description: 游戏脚本
 * @FilePath: \wucaibinfenbang\assets\scripts\UI\panel\GamePanel.ts
 */

import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { ConstValue } from "../../Data/ConstValue";
import { UIHelp } from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
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
    private trumpetId: number = null
    private touchTarget: any = null
    private slotsArr: cc.Node[] = []
    private sticksArr: cc.Node[] = []
    private boundingBox: cc.Node = null
    private roundNode: cc.Node = null
    private rightNum: number = 0 //没关答对的数量
    private gameResult: AnswerResult = AnswerResult.NoAnswer
   




    
  
    onLoad() {

        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.gameResult = AnswerResult.AnswerHalf
            ReportManager.getInstance().answerHalf()
        }, this);
        this.title.on(cc.Node.EventType.TOUCH_START, ()=>{});
    }


    onDestroy() {

        this.bg.off(cc.Node.EventType.TOUCH_START);
        this.title.off(cc.Node.EventType.TOUCH_START);
        if(this.trumpetId != null) {
            clearInterval(this.trumpetId)
            this.trumpetId = null
        }
    }

    start() {
        //监听新课堂发出的消息
        this.addSDKEventListener();
        //新课堂上报
        GameMsg.getInstance().gameStart();
        //数据通信
        this.getRemoteDataByCoursewareID(function () {}.bind(this));

        //预加载OverTip资源
        cc.loader.loadRes("prefab/ui/panel/OverTips", cc.Prefab, function (err, prefab) { });
        ReportManager.getInstance().addResult(2)
        this.round1()
    }

    round1() {
        this.rightNum = 0
        this.node1.active = true
        this.node2.active = false
        this.roundNode = this.node1
        this.boundingBox = this.node1.getChildByName('BoundingBox')
        this.slotsArr = this.node1.getChildByName('slots').children
        this.sticksArr = this.node1.getChildByName('sticks').children
        this.resetInterface()
        this.removeListenerOnOptions()
        this.addListenerOnOptions()
        ReportManager.getInstance().levelStart(false)
    }

    round2() {
        this.rightNum = 0
        this.node2.active = true
        this.node1.active = false
        this.roundNode = this.node2
        this.boundingBox = this.node2.getChildByName('BoundingBox')
        this.slotsArr = this.node2.getChildByName('slots').children
        this.sticksArr = this.node2.getChildByName('sticks').children
        this.resetInterface()
        this.removeListenerOnOptions()
        this.addListenerOnOptions()
        ReportManager.getInstance().levelStart(false)
    }

    resetInterface() {
        for (const key in this.slotsArr) {
            this.slotsArr[key].getChildByName('slot').active = true
            this.slotsArr[key].getChildByName('stick').active = false
         }
         for (const key in this.sticksArr) {
             this.sticksArr[key].active = true
         }
    }

    addListenerOnOptions() {
        for(let i = 0; i < this.sticksArr.length; ++i) {
            let node = this.sticksArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
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
            }) 
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchTarget = null
                this.touchNode.active = false
                e.target.opacity = 255
            }) 
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                if(this.boundingBox.getBoundingBox().contains(this.roundNode.convertToNodeSpaceAR(e.currentTouch._point)) && this.isRight(i)) {
                    console.log('====')
                    this.slotsArr[this.rightNum].getChildByName('stick').active = true
                    this.slotsArr[this.rightNum].getChildByName('slot').active = false
                    this.rightNum++
                    if(this.isSuccess(this.rightNum)) {
                        let level = ReportManager.getInstance().getLevel()
                        if(level == 0) {
                            ReportManager.getInstance().levelEnd(AnswerResult.AnswerRight)
                            GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                            UIHelp.showOverTip(1,'答对了', '下一关', ()=>{this.round2()}, null, null)
                        }else if(level == 1) {
                            this.gameResult = AnswerResult.AnswerRight
                            ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                            GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                            UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧~', '', null, null, '闯关成功')
                        } 
                    }
                }else {
                    e.target.opacity = 255
                }
                this.touchTarget = null
                this.touchNode.active = false
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

    isSuccess(rightNum: number):boolean {
        let level = ReportManager.getInstance().getLevel()
        if(level == 0 && rightNum >= 4) {
            return true
        }else if(level == 1 && rightNum >= 5) {
            return true
        }
        return false
    }

    isRight(stickIndex: number):boolean {
        let level = ReportManager.getInstance().getLevel()
        if(level == 0) {
            if(this.rightNum < 3 && [1,2,3].indexOf(stickIndex) != -1) {
                return true
            }else if(this.rightNum == 3 && stickIndex == 0) {
                return true
            }
        }else if(level == 1) {
            if([0,2,4].indexOf(this.rightNum) != -1 && [0,1,2].indexOf(stickIndex) != -1) {
                return true
            }else if([1,3].indexOf(this.rightNum) != -1 && [3,4].indexOf(stickIndex) != -1) {
                return true
            }
        }
        return false
    }


    private onNodeAudioTouchEnd(event: cc.Event.EventTouch) {

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
        }, 1000)
    }

    trumpetActionStop() {
        clearInterval(this.trumpetId)
        this.trumpetId = null
        this.trumpet.children[0].active = true
        this.trumpet.children[1].active = true
        this.trumpet.children[2].active = true
    }

    /**
     * 初始化界面
     *
     * @private
     * @memberof GamePanel
     */
    private onInit() {

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
        ReportManager.getInstance().gameOver(this.gameResult)
        //新课堂上报
        GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData());
        GameMsg.getInstance().finished();
    }
    //初始化消息监听
    onSDKMsgInitReceived() {
        this.onInit();
    }

    getRemoteDataByCoursewareID(callback: Function) {
        if (ConstValue.IS_TEACHER) {
            callback();
            return;
        }

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
                        callback();
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
