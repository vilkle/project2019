import { BaseUI } from "../BaseUI";
import {DaAnData} from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager";
import {NetWork} from "../../Http/NetWork";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

  
    @property(cc.Button)
    back : cc.Button;
    @property(cc.Button)
    submit : cc.Button;
    @property(cc.Button)
    queren : cc.Button;
    @property(cc.Button)
    quxiao : cc.Button;
    @property(cc.Button)
    chongzhi : cc.Button;
    @property(cc.Button)
    tijiao : cc.Button;
    @property(cc.Label)
    minutes : cc.Label;
    @property(cc.Label)
    second : cc.Label;
   
    isStart : boolean;
    timer : number;
    intervalIndex : number;
    minStr : string;
    secStr : string;
    
     onLoad () {
        this.isTecher();
        this.initData();
    }

    start() {
        this.openClock();
    }
   

    onDestroy() {
       
    }

   update (dt) {
    
   }

    isTecher() {
        if(ConstValue.IS_TEACHER) {
      
        }else {
            
        }
    }

    initData() {
        this.timer = 0;
    }
 

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                } else {
                   let data = JSON.parse(response_data.data.courseware_content);

                   if(data.number) {
                        DaAnData.getInstance().number = data.number;
                   }
                   if(data.checkpointsNum) {
                        DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                   }
                  
                }
            } 
        }.bind(this), null);
    }

    openClock() {
        this.intervalIndex = setInterval(function(){
            this.timer = this.timer + 1;
            let minutes = this.timer / 60 >> 0;
            let second = this.timer % 60;
            this.minStr = String(minutes);
            this.secStr = String(second);
            if(minutes < 10) {
                this.minStr = "0" + this.minStr;
            }
            if(second < 10) {
                this.secStr = "0" + this.secStr;
            }
            this.minutes.getComponent(cc.Label).string = this.minStr;
            this.second.getComponent(cc.Label).string = this.secStr;
        }.bind(this), 1000);
    }

    closeClock() {

    }

    backButton(){
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
    }
    submitButton(){
        this.openClock();
        //UIManager.getInstance().openUI(SubmissionPanel);
    }
