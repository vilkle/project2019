/*
 * @Author: 马超
 * @Date: 2020-02-29 14:55:20
 * @LastEditTime: 2020-03-24 15:27:00
 * @Description: 游戏脚本
 * @FilePath: \guanchalifangti\assets\scripts\UI\panel\GamePanel.ts
 */

import {
    BaseUI
} from "../BaseUI";
import {
    NetWork
} from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {
    ConstValue
} from "../../Data/ConstValue";
import {
    UIHelp
} from "../../Utils/UIHelp";
import {
    UIManager
} from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import {
    TipUI
} from "./TipUI";
import {
    OverTips
} from "../Item/OverTips";
import {
    ListenerType
} from "../../Data/ListenerType";
import {
    ListenerManager
} from "../../Manager/ListenerManager";
import SubmissionPanel from "./SubmissionPanel";
import ErrorPanel from "./ErrorPanel";
import {
    AnswerResult
} from "../../Data/ConstValue";
import GameMsg from "../../Data/GameMsg";
import {
    GameMsgType
} from "../../Data/GameMsgType";
import {
    Tools
} from "../../UIComm/Tools";
import {
    ReportManager
} from "../../Manager/ReportManager";
import {
    DaAnData
} from "../../Data/DaAnData";
import {
    AudioManager
} from "../../Manager/AudioManager";
import { GameData } from "../../Data/GameData";

const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node) private bg: cc.Node = null
    @property(cc.Node) private title: cc.Node = null
    @property(cc.Node) private mask: cc.Node = null
    @property(cc.Node) private errNode: cc.Node = null
    @property(cc.Node) private starNode: cc.Node = null
    @property(cc.Node) private optionNode: cc.Node = null
    @property(cc.Node) private laba: cc.Node = null
    private optionArr: cc.Node[] = []
    private starArr: cc.Node[] = []
    private isBreak: boolean = false
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private timeoutIdArr: number[] = []
    private audioIdArr: number[] = []
    private actionId: number = 0
    private rightNum: number = 0
    private isOver: boolean = false
    private isAudio: boolean = false
    private archival = {
        answerdata: null,
        level: null,
        gamedata: []
    }

    onLoad() {
        if (ConstValue.IS_TEACHER) {
            DaAnData.getInstance().submitEnable = true //没有教师端直接提交
            UIManager.getInstance().openUI(UploadAndReturnPanel, 212)
        } else {
            this.getNet()
        }
        this.bg.on(cc.Node.EventType.TOUCH_START, () => {
            // this.gameResult = AnswerResult.AnswerHalf
            // ReportManager.getInstance().answerHalf()
        }, this)
        this.title.on(cc.Node.EventType.TOUCH_START, this.audioCallback, this)
        this.laba.on(cc.Node.EventType.TOUCH_START, this.audioCallback, this)
        this.mask.active = true
        this.optionArr = this.optionNode.children
        this.starArr = this.starNode.children
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
        cc.loader.loadRes("prefab/ui/panel/OverTips", cc.Prefab, function (err, prefab) {})
        //添加上报result数据
        ReportManager.getInstance().addResult(1)
        ReportManager.getInstance().setQuestionInfo(0, '仔细观察,选出正确的立方体吧。')
        //初始化游戏
        this.initGame()
        let id = setTimeout(() => {
            let spine = this.laba.getChildByName('spine').getComponent(sp.Skeleton)
            spine.setAnimation(0, 'click', false)
            spine.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'click') {
                    spine.setAnimation(0, 'speak', true)
                }
            })
            this.isAudio = true
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, () => {
                spine.setAnimation(0, 'null', true) 
                this.mask.active = false
                this.isAudio = false
            })
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500)
        this.timeoutIdArr.push(id)
    }

    initGame() {
        this.addListenerOnOptions([this.bg])
    }

    actionCallback(e: any, pos: cc.Vec2, isAction: boolean) {
        if(pos.x == -1) {
            this.audioCallback()
            return
        }
        if(!isAction) {
            this.gameResult = AnswerResult.AnswerHalf
            if (!ReportManager.getInstance().isStart()) {
                ReportManager.getInstance().levelStart(this.isBreak)
                this.isBreak = false
            }
            ReportManager.getInstance().touchStart()
            ReportManager.getInstance().answerHalf()
            ReportManager.getInstance().setAnswerNum(1)
            pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            GameMsg.getInstance().actionSynchro([pos.x, pos.y])
        }
        this.errNode.active = false
        let touchNum: number = 0
        for (let j = 0; j < this.optionArr.length; ++j) {
            if (this.optionArr[j].getBoundingBox().contains(pos)) {
                touchNum++
                if(!this.optionArr[j].getChildByName('box').active) {
                    if(!isAction) {
                        this.actionId++
                        ReportManager.getInstance().updateTime()
                        this.archival.answerdata = ReportManager.getInstance().getAnswerData()
                        this.archival.gamedata.push(j)
                        this.archival.level = ReportManager.getInstance().getLevel()
                        this.gameResult = AnswerResult.AnswerRight
                        GameMsg.getInstance().dataArchival(this.actionId, this.archival)
                        ReportManager.getInstance().answerHalf()
                        GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                    }
                    this.mask.active = true
                    this.rightNum++
                    ReportManager.getInstance().setPercentage(((this.rightNum / 6) * 100).toFixed(2))
                    let option = this.optionArr[j]
                    option.getChildByName('sp').active = false
                    option.getChildByName('box').active = true
                    let box = option.getChildByName('box')
                    let scale1 = cc.scaleTo(0.4, 1.2, 1.2)
                    let scale2 = cc.scaleTo(0.3, 1, 1)
                    let fun = cc.callFunc(() => {
                        for (let n: number = 0; n < this.starArr.length; ++n) {
                            if (!this.starArr[n].getChildByName('star').active) {
                                AudioManager.getInstance().playSound('dada', false)
                                let sprite = this.starArr[n].getChildByName('star')
                                let spine: cc.Node = this.starArr[n].getChildByName('spine')
                                spine.active = true
                                spine.getComponent(sp.Skeleton).setAnimation(0, 'xingxing', false)
                                let id = setTimeout(() => {
                                    AudioManager.getInstance().playSound('star', false)
                                    let index = this.timeoutIdArr.indexOf(id)
                                    this.timeoutIdArr.splice(index, 1)
                                    clearTimeout(id)
                                }, 800);
                                this.timeoutIdArr.push(id)
                                spine.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                                    if (trackEntry.animation.name == 'xingxing') {
                                        spine.active = false
                                        sprite.active = true
                                        if(!this.isAudio) {
                                            this.mask.active = false
                                        }
                                        if (this.rightNum == 6) {
                                            if(!isAction) {
                                                ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                                                GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
                                                GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                                            }
                                            UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧~', '', null, null, '挑战成功')
                                        }
                                    }
                                })
                                break
                            }
                        }
                    })
                    let seq = cc.sequence(scale1, scale2, fun)
                    box.runAction(seq)
                    AudioManager.getInstance().playSound(this.touchStr(), false) 
                }
            }
        }
        if (touchNum == 0) {
            //this.mask.active = true
            ReportManager.getInstance().answerWrong()
            GameMsg.getInstance().answerSyncSend(ReportManager.getInstance().getAnswerData())
            this.gameResult = AnswerResult.AnswerError
            ReportManager.getInstance().setPercentage(((this.rightNum / 6) * 100).toFixed(2))
            this.errNode.stopAllActions()
            this.errNode.setPosition(pos)
            this.errNode.active = true
            this.errNode.opacity = 0
            this.errNode.scale = 1.25
            let fadein = cc.fadeIn(0.5)
            let scale1 = cc.scaleTo(0.38, 0.8, 0.8)
            let scale2 = cc.scaleTo(0.2, 1, 1)
            let seq1 = cc.sequence(cc.delayTime(0.12), scale1)
            let spaw = cc.spawn(fadein, seq1)
            let fun = cc.callFunc(() => {
                //this.mask.active = false
                this.errNode.active = false
            })
            let seq2 = cc.sequence(spaw, scale2, fun)
            this.errNode.runAction(seq2)
            AudioManager.getInstance().playSound('wrong', false)
        }
    }

    addListenerOnOptions(arr: cc.Node[]) {
        for (let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e) => {
                this.actionCallback(e, cc.v2(0, 0), false)
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e) => {

            })
            node.on(cc.Node.EventType.TOUCH_END, (e) => {

            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e) => {

            })
        }
    }
    removeListenerOnOptions(arr: cc.Node[]) {
        for (let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    touchStr(): string {
        let num = Math.round(Math.random()*10)
        if(num % 3 == 0) {
            return 'touch1'
        }else if(num % 3 == 1) {
            return 'touch2'
        }else if(num % 3 == 2) {
            return 'touch3'
        }
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
        if (!ReportManager.getInstance().isStart()) {
            ReportManager.getInstance().levelStart(false)
        }
        ReportManager.getInstance().touchStart()
        ReportManager.getInstance().answerHalf()
        ReportManager.getInstance().setAnswerNum(1)
        GameMsg.getInstance().actionSynchro([-1, -1])
        this.mask.active = true
        this.isAudio = true
        let spine = this.laba.getChildByName('spine').getComponent(sp.Skeleton)
        spine.setAnimation(0, 'click', false)
        spine.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'click') {
                spine.setAnimation(0, 'speak', true)
            }
        })
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('title', false, 1, null, () => {
            this.mask.active = false
            this.isAudio = false
            spine.setAnimation(0, 'null', true)
        })
    }

    /**
     * 初始化界面
     *
     * @private
     * @memberof GamePanel
     */
    private onInit() {
        ReportManager.getInstance().answerReset()
        UIManager.getInstance().closeUI(OverTips)
        for (const key in this.optionArr) {
            this.optionArr[key].getChildByName('sp').active = true
            this.optionArr[key].getChildByName('box').active = false
        }
        for (const key in this.starArr) {
            this.starArr[key].getChildByName('star').active = false
            this.starArr[key].getChildByName('spine').active = false
        }
        this.rightNum = 0
        this.errNode.active = false
        this.mask.active = true
        this.isAudio = true
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('title', false, 1, null, () => {
            this.mask.active = false
            this.isAudio = false
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
        //初始化
        ReportManager.getInstance().answerReset()
        UIManager.getInstance().closeUI(OverTips)
        for (const key in this.optionArr) {
            this.optionArr[key].getChildByName('sp').active = true
            this.optionArr[key].getChildByName('box').active = false
        }
        for (const key in this.starArr) {
            this.starArr[key].getChildByName('star').active = false
            this.starArr[key].getChildByName('spine').active = false
        }
        this.errNode.active = false
        this.mask.active = false
        //恢复上报数据
        let level = data.level
        let answerdata = data.answerdata
        let gamedata = data.gamedata
        this.rightNum = gamedata.length
        ReportManager.getInstance().setPercentage(((this.rightNum / 6) * 100).toFixed(2))
        ReportManager.getInstance().setAnswerData(answerdata)
        ReportManager.getInstance().setLevel(level)
        //重置界面
        for(let i = 0; i < gamedata.length; ++i) {
            this.optionArr[gamedata[i]].getChildByName('box').active = true
            this.optionArr[gamedata[i]].getChildByName('sp').active = true
            this.starArr[i].getChildByName('star').active = true
        }
        this.isBreak = true
    }

    addSDKEventListener() {
        GameMsg.getInstance().addEvent(GameMsgType.ACTION_SYNC_RECEIVE, this.onSDKMsgActionReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.DISABLED, this.onSDKMsgDisabledReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.DATA_RECOVERY, this.onSDKMsgRecoveryReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.STOP, this.onSDKMsgStopReceived.bind(this));
        GameMsg.getInstance().addEvent(GameMsgType.INIT, this.onSDKMsgInitReceived.bind(this));
    }
    //动作同步消息监听
    onSDKMsgActionReceived(data: any) {
        data = eval(data)
        let x = data.action[0]
        let y = data.action[1]
        this.actionCallback(null, cc.v2(x, y), true)
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
        this.actionId = 0
        this.archival.gamedata = [
            [],
            []
        ]
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