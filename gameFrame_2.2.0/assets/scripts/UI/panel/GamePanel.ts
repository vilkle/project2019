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

export class ReporteSubject {
    subjectData = [];
}
export class ReporteAnswer {
    answer = [];//学生作答信息
}
export class ReporteLevelData {
    subject = null;
    answer = null;
    result: number = null;// 1正确  2错误  3重复作答  4未作答  5已作答  
}

//上报新课堂
export class ReporteLevelDataNew {
    id = 0;
    question_info = '';
    answer_res = AnswerResult.NoAnswer;
    answer_num = 1;
    answer_time = '0s';
    doneSth = [];
}
export class GameOverData {
    percentage = '';
    answer_all_state = AnswerResult.NoAnswer;
    answer_all_time = '';
    complete_degree = '';
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node) private nodeBJ: cc.Node = null;
    @property(cc.Node) private nodeAudio: cc.Node = null;
    @property(cc.Node) private nodeMask: cc.Node = null;
    @property([cc.Button]) private arrBtns: cc.Button[] = [];
    @property([cc.Sprite]) private arrCylinders: cc.Sprite[] = [];

    //0答题
    @property({ type: [cc.AudioClip] }) private arrAudio: cc.AudioClip[] = [];
    //0正确 1错误
    @property({ type: [cc.AudioClip] }) private arrEffect: cc.AudioClip[] = [];

    private ANSWER_COUNT: number = 6;      //正确答案个数

    private audioID: number = -1;           //播放的背景音乐ID
    private arrCorrectIndex: number[] = [];   //答对的下表

    private playCount: number = 0;      //统计作答次数  以通关为维度
    private startTime: number = 0;      //每关开始时间
    private coastTimes: number[] = [];  //每关作答耗时
    private tryCounts: number[] = [];   //每关尝试次数
    bFinished = false;
    bFirstStart = true;

    onLoad() {
        ListenerManager.getInstance().add(ListenerType.OnClickReturn, this, this.onBtnBottomBackClicked);
        ListenerManager.getInstance().add(ListenerType.OnClicktijiao, this, this.onBtnBottomSavelicked);

        this.nodeBJ.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.nodeAudio.on(cc.Node.EventType.TOUCH_END, this.onNodeAudioTouchEnd, this);
    }

    onDestroy() {
        ListenerManager.getInstance().remove(ListenerType.OnClickReturn, this, this.onBtnBottomBackClicked);
        ListenerManager.getInstance().remove(ListenerType.OnClicktijiao, this, this.onBtnBottomSavelicked);

        this.nodeBJ.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.nodeAudio.off(cc.Node.EventType.TOUCH_END, this.onNodeAudioTouchEnd, this);
    }

    start() {
        //监听新课堂发出的消息
        this.addSDKEventListener();
        //新课堂上报
        GameMsg.getInstance().gameStart();
        this.playCount += 1;

        this.getRemoteDataByCoursewareID(function () {
        }.bind(this));

        //预加载OverTip资源
        cc.loader.loadRes("prefab/ui/panel/OverTips", cc.Prefab, function (err, prefab) { });

        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function () {
                    this.audioID = cc.audioEngine.playMusic(this.arrAudio[0], false);
                    cc.audioEngine.setFinishCallback(this.audioID, function () {
                        this.audioID = -1;
                        this.nodeMask.active = false;
                    }.bind(this))
                }.bind(this))
            )
        )
    }

    private onBtnClicked(event: cc.Event.EventTouch, data) {
        if (this.bFirstStart) {
            this.bFirstStart = false;
            this.startTime = Tools.getNowTimeS();
            this.tryCounts.push(1);
        }

        let index = parseInt(data);
        if (this.arrCorrectIndex.indexOf(index) < 0) {
            if (index > 5) {
                cc.audioEngine.playEffect(this.arrEffect[1], false);
                this.arrBtns[index].node.getChildByName('Background').stopAllActions();
                this.arrBtns[index].node.getChildByName('Background').opacity = 0;
                this.arrBtns[index].node.getChildByName('Background').runAction(cc.blink(1, 3));
            } else {
                this.arrCorrectIndex.push(index);

                cc.audioEngine.playEffect(this.arrEffect[0], false);
                this.arrBtns[index].node.getChildByName('Background').opacity = 255;

                this.arrCylinders[this.arrCorrectIndex.length - 1].node.active = true;

                //上报新课堂操作结果 用于数据恢复
                GameMsg.getInstance().dataArchival(this.arrCorrectIndex.length, this.reportDataNew());

                if (this.arrCorrectIndex.length == this.ANSWER_COUNT) {
                    cc.audioEngine.playEffect(this.arrAudio[1], false);
                    UIHelp.showOverTip(2, '挑战成功，你真棒~', null, false, 0, '挑战成功');
                    if (!this.bFinished) {
                        this.bFinished = true;
                        this.coastTimes.push(Tools.getNowTimeS() - this.startTime);
                    }
                    //新课堂数据上报
                    cc.log(this.reportDataNew())
                    GameMsg.getInstance().gameOver(this.reportDataNew());
                }
            }
        }
    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        if (this.bFirstStart) {
            this.bFirstStart = false;
            this.startTime = Tools.getNowTimeS();
            this.tryCounts.push(1);
        }

        let startPos = event.getStartLocation();
        let endPos = event.getLocation();
        let dis = Tools.getDisBetween2Points(startPos, endPos);
        if (dis > 2) {
            return;
        }

        cc.audioEngine.playEffect(this.arrEffect[1], false);
    }

    private onNodeAudioTouchEnd(event: cc.Event.EventTouch) {
        if (this.bFirstStart) {
            this.bFirstStart = false;
            this.startTime = Tools.getNowTimeS();
            this.tryCounts.push(1);
        }

        let startPos = event.getStartLocation();
        let endPos = event.getLocation();
        let dis = Tools.getDisBetween2Points(startPos, endPos);
        if (dis > 2) {
            return;
        }

        if (-1 == this.audioID) {
            this.audioID = cc.audioEngine.playMusic(this.arrAudio[0], false);
            cc.audioEngine.setFinishCallback(this.audioID, function () {
                this.audioID = -1;
            }.bind(this))
        }
    }

    /**
     * 初始化界面
     *
     * @private
     * @memberof GamePanel
     */
    private onInit() {
        this.arrCorrectIndex = [];
        for (let i = 0; i < this.arrCylinders.length; i++) {
            this.arrCylinders[i].node.active = false;
        }

        for (let i = 0; i < this.arrBtns.length; i++) {
            this.arrBtns[i].node.getChildByName('Background').stopAllActions();
            this.arrBtns[i].node.opacity = 0;
        }

        this.startTime = 0;
        this.tryCounts = [];
        this.coastTimes = [];
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
        let doneData = data.result[0].doneSth;
        for (let i = 0; i < doneData.length; i++) {
            this.arrCylinders[i].node.active = true;
            this.arrBtns[doneData[i]].node.getChildByName('Background').opacity = 255;
        }
    }

    //教师端  返回编辑器界面
    onBtnBottomBackClicked() {
        UIManager.getInstance().closeUI(TipUI);
        UIManager.getInstance().closeUI(OverTips);
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, { state: 0 });
    }
    //教师端  上传题目
    onBtnBottomSavelicked() {
        if (this.bFinished) {
            UIManager.getInstance().openUI(SubmissionPanel, 201);
        } else {
            UIHelp.showTip("请答对所有题目之后进行保存");
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
        //新课堂上报
        GameMsg.getInstance().gameOver(this.reportDataNew(true));
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

    reportDataNew(bReceiveStop?: boolean) {
        let type = 'txt';
        let index = this.playCount;//第几次作答  以通关为维度
        let result = [];
        let gameOver = null;//只有全部作答完成或者才进行赋值

        let levelData = new ReporteLevelDataNew();
        levelData.id = 1;
        levelData.question_info = '';
        if (this.bFinished || this.arrCorrectIndex.length == 6) {
            levelData.answer_res = AnswerResult.AnswerRight;
        } else if (this.bFirstStart == true) {
            levelData.answer_res = AnswerResult.NoAnswer;
        } else {
            levelData.answer_res = AnswerResult.AnswerHalf;
        } 
        levelData.answer_num = 1;
        levelData.answer_time = (this.coastTimes[0] ?  this.coastTimes[0] : (Tools.getNowTimeS() - this.startTime)) + 's';
        levelData.doneSth = this.arrCorrectIndex;

        result.push(levelData);


        if (this.bFinished || bReceiveStop) {
            gameOver = new GameOverData();
            gameOver.percentage = this.bFinished ? '100%' : '0%';
            gameOver.answer_all_state = levelData.answer_res;
            gameOver.complete_degree = levelData.answer_res == AnswerResult.AnswerRight ? '1/1' : '0/1';
            gameOver.answer_all_time = (this.coastTimes[0] ?  this.coastTimes[0] : (Tools.getNowTimeS() - this.startTime)) + 's';
        }

        return {
            type: type,
            index: index,
            result: result,
            gameOver: gameOver
        };
    }
}
