/*
 * @Author: 马超
 * @Date: 2020-02-29 14:55:20
 * @LastEditTime: 2020-04-03 20:51:11
 * @Description: 游戏脚本
 * @FilePath: \guluhuahua\assets\scripts\UI\panel\GamePanel.ts
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
import {
    GameData
} from "../../Data/GameData";

const {
    ccclass,
    property
} = cc._decorator;
const standardNum: number = 11
@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node) private bg: cc.Node = null
    @property(cc.Node) private title: cc.Node = null
    @property(cc.Node) private mask: cc.Node = null
    @property(cc.Node) private laba: cc.Node = null
    @property(cc.Node) private node1: cc.Node = null
    @property(cc.Node) private node2: cc.Node = null
    @property(cc.Node) private node3: cc.Node = null
    @property(cc.Node) private node4: cc.Node = null
    @property(sp.Skeleton) private gulu: sp.Skeleton = null
    private roundNode: cc.Node = null
    private optionArr: cc.Node[] = []
    private boardArr: cc.Node[] = []
    private drawArr: number[] = []
    private isBreak: boolean = false
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private timeoutIdArr: number[] = []
    private pointId: number = null
    private audioIdArr: number[] = []
    private actionId: number = 0
    private rightNum: number = 0
    private isOver: boolean = false
    private isAudio: boolean = false
    private archival = {
        answerdata: null,
        level: null,
        gamedata: [
            [],
            [],
            [],
            []
        ],
        rightNum: null,
        totalNum: null,
        standardNum: standardNum
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
        this.gulu.setAnimation(0, 'idle1', false)
        this.gulu.setCompleteListener(trackEntry => {
            let index = Math.floor(Math.random() * 10)
            if (index >= 8) {
                this.gulu.setAnimation(0, 'idle2', false)
            } else {
                this.gulu.setAnimation(0, 'idle1', false)
            }
        })
    }

    onDestroy() {
        ReportManager.getInstance().answerReset()
        this.bg.off(cc.Node.EventType.TOUCH_START)
        //this.title.off(cc.Node.EventType.TOUCH_START)
        clearTimeout(this.pointId)
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
        ReportManager.getInstance().addResult(4)
        ReportManager.getInstance().setStandardNum(standardNum)
        ReportManager.getInstance().setQuestionInfo(0, '咕噜咕噜画了谁？找一找')
        ReportManager.getInstance().setQuestionInfo(1, '咕噜咕噜画了谁？找一找')
        ReportManager.getInstance().setQuestionInfo(2, '咕噜咕噜画了谁？找一找')
        ReportManager.getInstance().setQuestionInfo(3, '咕噜咕噜画了谁？找一找')
        
        //初始化游戏
        this.initGame(1)
        let id = setTimeout(() => {
            // let spine = this.laba.getChildByName('spine').getComponent(sp.Skeleton)
            // spine.setAnimation(0, 'click', false)
            // spine.setCompleteListener(trackEntry=>{
            //     if(trackEntry.animation.name == 'click') {
            //         spine.setAnimation(0, 'speak', true)
            //     }
            // })
            this.isAudio = true
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('题干', false, 1, null, () => {
                // spine.setAnimation(0, 'null', true) 
                this.mask.active = false
                this.isAudio = false
            })
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500)
        this.timeoutIdArr.push(id)
    }

    initGame(level: number) {
        if (this.pointId != null) {
            clearTimeout(this.pointId)
        }
        this.pointId = null
        this.rightNum = 0
        if (this.optionArr.length > 0) {
            this.removeListenerOnOptions(this.optionArr)
        }
        this.resetGame(level)
        if (level == 1) {
            this.roundNode = this.node1
            this.drawArr = [-1, 0, 1]
        } else if (level == 2) {
            this.roundNode = this.node2
            this.drawArr = [0, -1, 1, 2]
        } else if (level == 3) {
            this.roundNode = this.node3
            this.drawArr = [0, 1, -1, 2]
        } else if (level == 4) {
            this.roundNode = this.node4
            this.drawArr = [-1, 0, 1, 2]
        }
        this.optionArr = this.roundNode.getChildByName('options').children
        this.boardArr = this.roundNode.getChildByName('board').children
        this.addListenerOnOptions(this.optionArr)
    }

    resetGame(level: number) {
        let node = null
        for (let i = 0; i < 4; ++i) {
            if (i == 0) {
                node = this.node1
            } else if (i == 1) {
                node = this.node2
            } else if (i == 2) {
                node = this.node3
            } else if (i == 3) {
                node = this.node4
            }
            let boardArr = node.getChildByName('board').children
            for (let n = 0; n < boardArr.length; ++n) {
                boardArr[n].active = false
            }
            let optionArr = node.getChildByName('options').children
            for (let m = 0; m < optionArr.length; ++m) {
                optionArr[m].getChildByName('sprite').active = true
                optionArr[m].getChildByName('spine').active = false
            }
        }
        this.node1.active = false
        this.node2.active = false
        this.node3.active = false
        this.node4.active = false
        if (level == 1) {
            this.node1.active = true
        } else if (level == 2) {
            this.node2.active = true
        } else if (level == 3) {
            this.node3.active = true
        } else if (level == 4) {
            this.node4.active = true
        }
    }

    point() {
        if (this.pointId != null) {
            clearTimeout(this.pointId)
        }
        this.pointId = setTimeout(() => {
            AudioManager.getInstance().playSound('还没找完哦', false)
        }, 8000);
    }

    actionCallback(i: number, isAction: boolean, level ? : number) {
        let node = this.optionArr[i]
        if (!isAction) {
            this.gameResult = AnswerResult.AnswerHalf
            if (!ReportManager.getInstance().isStart()) {
                ReportManager.getInstance().levelStart(false)
            }
            ReportManager.getInstance().touchStart()
            ReportManager.getInstance().touchHalf()
            ReportManager.getInstance().setAnswerNum(1)
            GameMsg.getInstance().actionSynchro({
                index: i,
                level: ReportManager.getInstance().getLevel()
            })
        } else {
            ReportManager.getInstance().setLevel(level)
        }

        this.point()
        let sprite = node.getChildByName('sprite')
        if (!sprite.active) {
            return
        }
        this.mask.active = true
        let spine = node.getChildByName('spine')
        spine.active = true
        sprite.active = false
        let str = node.name
        spine.getComponent(sp.Skeleton).setAnimation(0, str, false)
        if (this.drawArr[i] >= 0) {
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('是我是我', false)
            this.rightNum++
            sprite.active = false
            for (let n = 0; n < this.boardArr.length; ++n) {
                this.boardArr[n].active = false
            }
            this.boardArr[this.drawArr[i]].active = true
            if (this.isSuccess()) {
                let level = ReportManager.getInstance().getLevel()
                if (level == 4) {
                    if (!isAction) {
                        ReportManager.getInstance().answerRight()
                        ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
                        console.log('syncSend-------', ReportManager.getInstance().getAnswerData())
                        console.log('gameOver-------', ReportManager.getInstance().getAnswerData())
                        GameMsg.getInstance().gameOver(ReportManager.getInstance().getAnswerData())
                    }
                    if (this.pointId != null) {
                        clearTimeout(this.pointId)
                        this.pointId = null
                    }
                    let id = setTimeout(() => {
                        UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧~', '', null, null, '闯关成功')
                        let index = this.timeoutIdArr.indexOf(id)
                        this.timeoutIdArr.splice(index, 1)
                        clearTimeout(id)
                    }, 2000);
                    this.timeoutIdArr[this.timeoutIdArr.length] = id
                } else {
                    if (!isAction) {
                        ReportManager.getInstance().answerRight()
                        ReportManager.getInstance().levelEnd(AnswerResult.AnswerRight)
                        console.log('syncSend-------', ReportManager.getInstance().getAnswerData())
                    }
                    let id0 = setTimeout(() => {
                        UIHelp.showOverTip(1, '', '', null, ()=>{UIManager.getInstance().closeUI(OverTips)})
                        let index = this.timeoutIdArr.indexOf(id0)
                        this.timeoutIdArr.splice(index, 1)
                        clearTimeout(id0)
                    }, 1000);
                    this.timeoutIdArr[this.timeoutIdArr.length] = id0
                    let id = setTimeout(() => {
                        this.initGame(level + 1)
                        this.mask.active = false
                        let index = this.timeoutIdArr.indexOf(id)
                        this.timeoutIdArr.splice(index, 1)
                        clearTimeout(id)
                    }, 5000);
                    this.timeoutIdArr[this.timeoutIdArr.length] = id
                }
            } else {
                if (!isAction) {
                    this.actionId++
                    this.archival.answerdata = ReportManager.getInstance().getAnswerData()
                    this.archival.level = ReportManager.getInstance().getLevel()
                    this.archival.gamedata[this.archival.level - 1].push(i)
                    this.archival.rightNum = ReportManager.getInstance().getRightNum()
                    this.archival.totalNum = ReportManager.getInstance().getTotalNum()
                    ReportManager.getInstance().answerHalf()
                    console.log('syncSend-------', ReportManager.getInstance().getAnswerData())
                    GameMsg.getInstance().dataArchival(this.actionId, this.archival)
                }
                this.mask.active = false
            }
        } else {
            if (!isAction) {
                ReportManager.getInstance().answerWrong()
                console.log('syncSend-------', ReportManager.getInstance().getAnswerData())
            }
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('不是我哦', false)
            spine.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                if (trackEntry.animation.name == str) {
                    this.mask.active = false
                    spine.active = false
                    sprite.active = true
                }
            })
        }
    }

    addListenerOnOptions(arr: cc.Node[]) {
        for (let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e) => {
                this.actionCallback(i, false)
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

    isSuccess() {
        let level = ReportManager.getInstance().getLevel()
        if (level == 1 && this.rightNum == 2) {
            return true
        } else if (level == 2 && this.rightNum == 3) {
            return true
        } else if (level == 3 && this.rightNum == 3) {
            return true
        } else if (level == 4 && this.rightNum == 3) {
            return true
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
    audioCallback(isAction ? : number) {
        this.point()
        if (isAction == 1) {

        } else {
            console.log('adfasdfsadfasdfasdfas')
            this.gameResult = AnswerResult.AnswerHalf
            if (!ReportManager.getInstance().isStart()) {
                ReportManager.getInstance().levelStart(false)
            }
            ReportManager.getInstance().touchStart()
            ReportManager.getInstance().touchHalf()
            ReportManager.getInstance().setAnswerNum(1)
            GameMsg.getInstance().actionSynchro(-1)
        }
        this.mask.active = true
        this.isAudio = true
        // let spine = this.laba.getChildByName('spine').getComponent(sp.Skeleton)
        // spine.setAnimation(0, 'click', false)
        // spine.setCompleteListener(trackEntry=>{
        //     if(trackEntry.animation.name == 'click') {
        //         spine.setAnimation(0, 'speak', true)
        //     }
        // })
        ReportManager.getInstance().gameOver(AnswerResult.AnswerRight)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('题干', false, 1, null, () => {
            this.mask.active = false
            this.isAudio = false
            //spine.setAnimation(0, 'null', true)
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
        this.rightNum = 0
        this.mask.active = true
        this.isAudio = true
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('title', false, 1, null, () => {
            this.mask.active = false
            this.isAudio = false
        })
        this.initGame(1)
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
        this.mask.active = false
        //恢复上报数据
        let level = data.level
        let answerdata = data.answerdata
        let gamedata = data.gamedata
        this.rightNum = gamedata.length
        ReportManager.getInstance().setRightNum(data.rightNum)
        ReportManager.getInstance().setTotalNum(data.totalNum)
        ReportManager.getInstance().setStandardNum(data.standardNum)
        ReportManager.getInstance().setAnswerData(answerdata)
        ReportManager.getInstance().setLevel(level - 1)
        //重置界面
        this.isBreak = true
        this.initGame(level)
        this.rightNum = gamedata[level - 1].length
        for (let i = 0; i < gamedata[level - 1].length; ++i) {
            this.optionArr[gamedata[level - 1][i]].getChildByName('spine').active = true
            this.optionArr[gamedata[level - 1][i]].getChildByName('sprite').active = false
        }
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
        data = eval(data)
        if (data.action == -1) {
            console.log('-----action', data.action)
            this.audioCallback(1)
        } else {
            let index = data.action.index
            let level = data.action.level
            this.actionCallback(index, true, level)
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