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
        ReportManager.getInstance().addResult(1)
        this.standardNum = 1
        ReportManager.getInstance().setStandardNum(this.standardNum)
        ReportManager.getInstance().setQuestionInfo(0, '一起动手，挑战下面的关卡吧！')
        let id = setTimeout(() => {
            console.log('start action')
            this.startAction()
            let index = this.timeoutArr.indexOf(id)
            this.timeoutArr.splice(index, 1)
        }, 500);
        this.timeoutArr[this.timeoutArr.length] = id
        
    }

    onDestroy() {
       for (const key in this.timeoutArr) {
           clearTimeout(this.timeoutArr[key])
       }
    }

    initGame() {
        this.tiban.node.active = false
        this.caozuoban.node.active = false
        this.quanquan.setPosition(cc.v2(1090, 435)) 
        this.paipai.setPosition(cc.v2(1252, -172))
        this.operationPanel.setPosition(cc.v2(1238, -371))
        this.guanzi.setPosition(cc.v2(1060, -444))
        this.guanzi.active = false
    }

    startAction() {
        // let func = cc.callFunc(()=>{
        //     let fun = cc.callFunc(()=>{
        //         this.faguangtiAction()
        //     }) 
        //     this.guanzi.active = true
        //     let seq = cc.sequence(cc.moveTo(1, cc.v2(600, -444)), fun)
        //     this.guanzi.runAction(seq)
        // })
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
            let fun = cc.callFunc(()=>{
                this.faguangtiAction()
            }) 
            this.guanzi.active = true
            let seq = cc.sequence(cc.moveTo(1, cc.v2(600, -444)), fun)
            this.guanzi.runAction(seq)
        })
        .start()
        // this.quanquan.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(938, 435)).easing(cc.easeSineOut()), cc.moveBy(0.3, cc.v2(30, 0)).easing(cc.easeSineOut()), cc.moveBy(0.3, cc.v2(-10, 0)).easing(cc.easeSineOut())))
        // this.paipai.runAction(cc.sequence(cc.moveTo(0.7, cc.v2(824, -172)).easing(cc.easeSineOut()), cc.moveBy(0.1, cc.v2(20, 0)).easing(cc.easeSineOut()) ))
        // this.operationPanel.runAction(cc.sequence(cc.moveTo(0.7, cc.v2(809, -371)).easing(cc.easeSineOut()), cc.moveBy(0.3, cc.v2(30, 0)).easing(cc.easeSineOut()), cc.moveBy(0.3, cc.v2(-10, 0)).easing(cc.easeSineOut()), func))
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
