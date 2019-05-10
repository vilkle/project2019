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
    chongzhi : cc.Button;
    @property(cc.Button)
    tijiao : cc.Button;
    @property(cc.Label)
    minutes : cc.Label;
    @property(cc.Label)
    second : cc.Label;
    @property(cc.Label)
    numberStr : cc.Label;
    @property(cc.Sprite)
    bubble_none1 : cc.Sprite;
    @property(cc.Sprite)
    bubble_none2 : cc.Sprite;
    @property(cc.Node)
    gunNode : cc.Node;
    @property(cc.Node)
    garbageNode : cc.Node;
    @property(cc.Node)
    mask : cc.Node;
   
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
       
        var StrArr = String(DaAnData.getInstance().number) + '=';
        var YZ =  this.decompose(DaAnData.getInstance().number);
        cc.log(YZ);
        for(let i = 0; i < YZ.length; i++) {
            if(i < YZ.length - 1) {
                StrArr = StrArr + String(YZ[i]) + '*';
            }else {
                StrArr = StrArr + String(YZ[i]);
            }
        }
        this.numberStr.getComponent(cc.Label).string = StrArr;


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
        var index = 0;
        var YZ = [];
        var i=2;
        
		if (num==1||num==2||num==3) {
			YZ[index++]=num;
			return YZ;
		}
		for(;i<=num/2;i++){
			if(num%i==0){
				YZ[index++]=i;//每得到一个质因数就存进YZ
				this.decompose(num/i);
				break;
			}
		}
		if (i>num/2) {
				YZ[index++]=num;//存放最后一次结果
			}
        
       return YZ;
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
