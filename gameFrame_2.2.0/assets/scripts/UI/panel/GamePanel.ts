/*
 * @Author: 马超
 * @Date: 2020-02-26 13:52:34
 * @LastEditTime: 2020-02-27 20:28:40
 * @Description: 游戏脚本
 * @FilePath: \gameFrame_2.2.0\assets\scripts\UI\panel\GamePanel.ts
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

    @property(cc.Node) private bg: cc.Node = null;
    @property(cc.Node) private title: cc.Node = null;
    @property(cc.Node) private mask: cc.Node = null;


    private ANSWER_COUNT: number = 6;      //正确答案个数

    private audioID: number = -1;           //播放的背景音乐ID
    private arrCorrectIndex: number[] = [];   //答对的下表

    private playCount: number = 0;      //统计作答次数  以通关为维度
    //private startTime: number = 0;      //每关开始时间
    //private coastTimes: number[] = [];  //每关作答耗时
    private tryCounts: number[] = [];   //每关尝试次数
    bFinished = false;
    bFirstStart = true;
    private answerResult: AnswerResult = AnswerResult.NoAnswer
   




    
  
    onLoad() {

        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{}, this);
        this.title.on(cc.Node.EventType.TOUCH_START, ()=>{});
    }


    onDestroy() {

        this.bg.off(cc.Node.EventType.TOUCH_START);
        this.title.off(cc.Node.EventType.TOUCH_START);
    }

    start() {
        //监听新课堂发出的消息
        this.addSDKEventListener();
        //新课堂上报
        GameMsg.getInstance().gameStart();
        this.playCount += 1;
        //数据通信
        this.getRemoteDataByCoursewareID(function () {}.bind(this));

        //预加载OverTip资源
        cc.loader.loadRes("prefab/ui/panel/OverTips", cc.Prefab, function (err, prefab) { });

      
    }


    private onNodeAudioTouchEnd(event: cc.Event.EventTouch) {

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
        ReportManager.getInstance().gameOver(this.answerResult)
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
