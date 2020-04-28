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
  
    private standardNum: number = 1
  
    private answer: number[] = []
    private subject: number[] = []
   
    private timeoutArr: number[] = []
    private isOver: boolean = false
    private gameResult: AnswerResult = AnswerResult.NoAnswer
    private actionId: number = 0
    private rightNum: number = 0
    private isBreak: boolean = null
    private isAudio: boolean = false
    private archival = {
        answerdata: null,
        gamedata: [],
        wrong: [],
        rightNum: null,
        totalNum: null,
        standardNum: this.standardNum
    }
 

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
       
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
        })
       
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, 212)
          
            this.setPanel()
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
        ReportManager.getInstance().addResult(1)
        this.standardNum = 1
        ReportManager.getInstance().setStandardNum(this.standardNum)
        ReportManager.getInstance().setQuestionInfo(0, '一起动手，挑战下面的关卡吧！')
       
    }

    onDestroy() {
       for (const key in this.timeoutArr) {
           clearTimeout(this.timeoutArr[key])
       }
    }

  

    private onInit() {
        this.isOver = false
      
        ReportManager.getInstance().answerReset()
        UIManager.getInstance().closeUI(OverTips)
        this.rightNum = 0
        this.mask.active = true
        this.isAudio = true
      
    }

    private onRecovery(data: any) {
        this.isOver = false

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
           
        }else if(data.action == -2) {
           
        }else if(data.action == -3) {
           
        }else if(data.action == -4) {
           
        }else if(data.action == -5) {
           
        }else if(data.action == -6) {
            
        } else {
           
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
           
        ]
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
