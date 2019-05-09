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
    @property(cc.Label)
    numberStr : cc.Label;
   
    isStart : boolean;
    timer : number;
    intervalIndex : number;
    minStr : string;
    secStr : string;
    YZ : Array<number> = new Array<number>();
     onLoad () {
        this.isTecher();
        this.initData();
    }

    start() {
        this.openClock();
        this.decompose(DaAnData.getInstance().number);
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
        cc.loader.loadRes("")
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

    decompose(num: number) {
        DaAnData.getInstance().number = 266;
        var index = 0;
        var i=2;
        var a = String(DaAnData.getInstance().number) + '=';
		if (num==1||num==2||num==3) {
			this.YZ[index++]=num;
			return this.YZ;
		}
		for(;i<=num/2;i++){
			if(num%i==0){
				this.YZ[index++]=i;//每得到一个质因数就存进YZ
				this.decompose(num/i);
				break;
			}
		}
		if (i>num/2) {
				this.YZ[index++]=num;//存放最后一次结果
			}
        var StrArr = '';
        for(let i = 0; i < this.YZ.length; i++) {
            if(i < this.YZ.length - 1) {
                StrArr = StrArr + String(this.YZ[i]) + '*';
            }else {
                StrArr = StrArr + String(this.YZ[i]);
            }
        }
        cc.log(this.YZ);

        this.numberStr.getComponent(cc.Label).string = StrArr;
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
        this.decompose(DaAnData.getInstance().number);
        //UIManager.getInstance().openUI(SubmissionPanel);
    }
