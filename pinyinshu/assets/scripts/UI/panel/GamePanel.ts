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
    @property(cc.Node)
    minuteHand : cc.Node;
    @property(cc.Node)
    secondHand : cc.Node;
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
    ballArr : Array<cc.Node> = Array<cc.Node>();
    answerArr : Array<cc.Node> = Array<cc.Node>();
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
        
    }
 
    createBall(num : number) : cc.Node {
        var ballNode : cc.Node;
        cc.loader.loadRes('prefab/ui/Item/ballNode', function(err, prefab){
            if(!err){
                ballNode = cc.instantiate(prefab);
                var label = ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
                var ball = ballNode.getChildByName('ball').getComponent(cc.Sprite);

                switch(num){
                    case 1:
                    cc.loader.loadRes('images/gameUI/bubble_1', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 2:
                    cc.loader.loadRes('images/gameUI/bubble_2', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 3:
                    cc.loader.loadRes('images/gameUI/bubble_3', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 5:
                    cc.loader.loadRes('images/gameUI/bubble_4', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 7:
                    cc.loader.loadRes('images/gameUI/bubble_5', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 11:
                    cc.loader.loadRes('images/gameUI/bubble_6', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    case 13:
                    cc.loader.loadRes('images/gameUI/bubble_7', cc.SpriteFrame, function(err, spriteframe){
                        ball.spriteFrame = spriteframe;
                    });
                    break;
                    default:
                        if(num.toString().length == 2||num.toString().length == 1) {
                            cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function(err, spriteframe){
                                ball.spriteFrame = spriteframe;
                            }) ;
                        }else if(num.toString().length == 3) {
                            cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function(err, spriteframe){
                                ball.spriteFrame = spriteframe;
                            });
                        }
                    break;

                }
            }
        });
        return ballNode;
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
          var num1 = num;
            var li = [];
            var i = 1;
            while (i<num1) {
                i += 1;
                while (num1 % i == 0) {
                    num1/=i;
                    li.push(i);
                }
            }
        var str = String(num) + '  =  ';
        for(let i = 0; i < li.length; i++) {
            if(i < li.length - 1) {
                str += String(li[i]) + '  *  ';
            }else {
                str += String(li[i]) + '  =  ';
            }
        }
            this.numberStr.getComponent(cc.Label).string = str;
            var x = this.numberStr.node.width + this.numberStr.node.x;
            var y = this.numberStr.node.y;
            var space = 150;
            for(let i = 0; i < li.length; i++) {
                let item = this.createBall(li[i]);
                if(i%2) {
                    item.x = x + 150 * (i + 2);
                }else {
                    item.x = x + 150 * (i + 1);
                }
                item.y = y;
                item.parent = this.node;
            }

            cc.log(str);
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
            this.minuteHand.rotation = minutes * 6;
            this.secondHand.rotation = second * 6;
            this.minutes.getComponent(cc.Label).string = this.minStr;
            this.second.getComponent(cc.Label).string = this.secStr;
            if(minutes == 60) {
                clearInterval(this.intervalIndex)
            }
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
