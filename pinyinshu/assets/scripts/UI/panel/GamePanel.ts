import { BaseUI } from "../BaseUI";
import {DaAnData} from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager";
import {NetWork} from "../../Http/NetWork";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import {OverTips} from "../../UI/Item/OverTips"
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

  
    @property(cc.Button)
    back : cc.Button = null;
    @property(cc.Button)
    submit : cc.Button = null;
    @property(cc.Button)
    queren : cc.Button = null;
    @property(cc.Button)
    chongzhi : cc.Button = null;
    @property(cc.Button)
    tijiao : cc.Button = null;
    @property(cc.Label)
    minutes : cc.Label = null;
    @property(cc.Label)
    second : cc.Label = null;
    @property(cc.Node)
    minuteHand : cc.Node = null;
    @property(cc.Node)
    secondHand : cc.Node = null;
    @property(cc.Label)
    numberStr : cc.Label = null;
    @property(cc.Sprite)
    bubble_none1 : cc.Sprite = null;
    @property(cc.Sprite)
    bubble_none2 : cc.Sprite = null;
    @property(cc.Node)
    bubble_1 : cc.Node = null;
    @property(cc.Node)
    bubble_2 : cc.Node = null;
    @property(cc.Node)
    bubble : cc.Node = null;
    @property(cc.Node)
    bullet : cc.Node = null;
    @property(cc.Node)
    gunNode : cc.Node = null;
    @property(cc.Node)
    garbageNode : cc.Node = null;
    @property(cc.Node)
    mask : cc.Node = null;
    @property(cc.Node)
    numberNode : cc.Node = null;
    @property(cc.BitmapFont)
    font : cc.BitmapFont = null;
    decomposeArr : Array<cc.Node> = Array<cc.Node>();
    answerArr : Array<cc.Node> = Array<cc.Node>();
    labelArr : Array<cc.Node> = Array<cc.Node>();
    progressArr : Array<cc.Node> = Array<cc.Node>(); 
    li : Array<number> = Array<number>();   //质因数
    an : Array<number> = Array<number>();   //约数
    pl : Array<number> = Array<number>();   //玩家答案
    timer : number = null;
    decoposeNum : number = null;    //被分解的数
    intervalIndex : number = null;    //clock的interval的index值
    minStr : string = null;
    secStr : string = null;
    spriteframe1 : cc.SpriteFrame = null;
    spriteframe2 : cc.SpriteFrame = null;
    spriteframe3 : cc.SpriteFrame = null;
    spriteframe4 : cc.SpriteFrame = null;
    spriteframe5 : cc.SpriteFrame = null; 
    spriteframe6 : cc.SpriteFrame = null;
    spriteframe7 : cc.SpriteFrame = null;
    spriteframe8 : cc.SpriteFrame = null;
    spriteframe9 : cc.SpriteFrame = null;
    checkpointsNum : number = null;
    checkpoint : number = null;

     onLoad () {
         DaAnData.getInstance().checkpointsNum = 3;
         DaAnData.getInstance().numberArr = [24, 25, 26];
        this.isTecher();
        this.initData();
    }

    start() {
        this.openClock();
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
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
        this.decoposeNum = DaAnData.getInstance().numberArr[0];
        this.checkpoint = 1;
        this.checkpointsNum = 3;//DaAnData.getInstance().checkpointsNum;
        this.defaultValue();
        this.initProgress(this.checkpointsNum);
    }
    
    initProgress(checkpointsNum : number) {
        var long = 200;
        
        cc.loader.loadRes('prefab/ui/Item/progressNode',function(err, prefab){
            if(!err) {
                for(let i = 0; i < checkpointsNum; i++) {
                    let progressNode = cc.instantiate(prefab);
                    this.progressArr[i] = progressNode;
                    let y = 350 - long * i;
                    progressNode.setPosition(cc.v2(-900, y));
                    progressNode.parent = this.node;
                    progressNode.getChildByName('ball').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    progressNode.getChildByName('bubble').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    progressNode.getChildByName('whiteball').getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
                    if(i == checkpointsNum - 1) {
                        progressNode.getChildByName('line').active = false;
                        progressNode.getChildByName('lineup').active = false;
                    }
                }
                this.setprogress(this.checkpoint);
            }
        }.bind(this));

    }

    setprogress(checkpoints : number) {
       for(let i = 0; i < this.progressArr.length; i++) {
           if(i < checkpoints - 1) {
                this.progressArr[i].getChildByName('bubble').active = true;
                if(this.progressArr.length > 1) {
                    this.progressArr[i].getChildByName('lineup').active = true;
                }
           }else if(i == checkpoints - 1) {
                this.progressArr[i].getChildByName('bubble').active = true;
                this.progressArr[i].getChildByName('whiteball').active = true;
           }else {
                this.progressArr[i].getChildByName('bubble').active = false;
                this.progressArr[i].getChildByName('whiteball').active = false;
           }
           
       }
    }

    defaultValue() {
        var parent = this.node.getChildByName('1');
        var pos = parent.getPosition();
        this.createBall(1, pos.x, pos.y, parent, true);
    }

    createBall(num : number, x : number, y : number, parent : cc.Node, isAnswer : boolean){
        var ballNode : cc.Node;
        cc.loader.loadRes("prefab/ui/Item/ballNode", function(err, prefab){
            if(!err){
                ballNode = cc.instantiate(prefab);
                ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
                var ball = ballNode.getChildByName('ball').getComponent(cc.Sprite);
                ballNode.x = x;
                    ballNode.y = y;
                ballNode.parent = parent;
                cc.log('add ball node');
                if(isAnswer) {
                   this.answerArr.push(ballNode);
                   this.addListenerOnAnswerBall(ballNode);
                }else {
                    if(num != this.li.length - 1) {
                        let node = new cc.Node("label");
                        let labelX = node.addComponent(cc.Label);
                        labelX.string = "*";
                        labelX.font = this.font;
                        labelX.node.y = 0;
                        node.parent = this.numberStr.node.parent;
                        this.labelArr.push(node);
                    }
                    this.decomposeArr.push(ballNode);
                    this.addListenerOnDecomposeBall(ballNode);
                }
                switch(num){
                    case 1:
                    cc.loader.loadRes('images/gameUI/bubble_1', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe1 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 2:
                    cc.loader.loadRes('images/gameUI/bubble_2', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe2 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 3:
                    cc.loader.loadRes('images/gameUI/bubble_3', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe3 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 5:
                    cc.loader.loadRes('images/gameUI/bubble_4', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe4 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 7:
                    cc.loader.loadRes('images/gameUI/bubble_5', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe5 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 11:
                    cc.loader.loadRes('images/gameUI/bubble_6', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe6 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    case 13:
                    cc.loader.loadRes('images/gameUI/bubble_7', cc.SpriteFrame, function(err, spriteframe){
                        this.spriteframe7 = spriteframe;
                        ball.spriteFrame = spriteframe;
                    }.bind(this));
                    break;
                    default:
                        if(num.toString().length == 2||num.toString().length == 1) {
                            cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function(err, spriteframe){
                                this.spriteframe8 = spriteframe;
                                ball.spriteFrame = spriteframe;
                            }.bind(this)) ;
                        }else if(num.toString().length == 3) {
                            cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function(err, spriteframe){
                                this.spriteframe9 = spriteframe;
                                ball.spriteFrame = spriteframe;
                            }.bind(this));
                        }
                    break;
                }
            }else {
                cc.log("load error");
            }
        }.bind(this));
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                } else {
                   let data = JSON.parse(response_data.data.courseware_content);

                   if(data.number) {
                        DaAnData.getInstance().numberArr = data.numberArr;
                   }
                   if(data.checkpointsNum) {
                        DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                   }
                  
                }
            } 
        }.bind(this), null);
    }

    answer(num : number) {
        for(let i = 1; i <= num; i++) {
            if(num % i == 0) {
                this.an.push(i);
            }
        }
    }

    decompose(num: number) {
          var num1 = num;
            //var li = [];
            var i = 1;
            while (i<num1) {
                i += 1;
                while (num1 % i == 0) {
                    num1/=i;
                    this.li.push(i);
                }
            }
        var str = String(num) + '  =  ';
        for(let i = 0; i < this.li.length; i++) {
            if(i < this.li.length - 1) {
                str += String(this.li[i]) + '  *  ';
            }else {
                str += String(this.li[i]) + '  =  ';
            }
        }
        this.numberStr.getComponent(cc.Label).string = str;
        cc.log('numberStr is :', this.numberStr.getComponent(cc.Label).string);
    }

    createDecomposeBall() {
        var x = this.numberStr.node.getContentSize().width + 100;
        cc.log('numberstr width is ', this.numberStr.node.getContentSize().width);
        var y = 0;
        var space = 150;
        for(let i = 0; i < this.li.length; i++) {
            cc.log(this.li[i]);
            var ballx = 0;
            ballx = x + 200 * i;
            cc.log(x);
            this.createBall(this.li[i], ballx, y, this.numberStr.node.parent, false);
        }
    }

    addListenerOnDecomposeBall(ballNode : cc.Node) {
        cc.log(ballNode);
        var ball = ballNode.getChildByName('ball');
        ball.on(cc.Node.EventType.TOUCH_START, function(e){
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            var num = ballNode.getChildByName('label').getComponent(cc.Label).string;  
            this.bubble.getChildByName('label').getComponent(cc.Label).string = num;
            this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = ball.getComponent(cc.Sprite).spriteFrame;
            this.bubble.active = true;
        }.bind(this), this);

        ball.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            if(this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.garbageNode.getChildByName('light').active = true;
                this.garbageNode.getChildByName('iconLight').active = true;
            }else {
                if( this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function(){
            if(this.bubble.active == true) {
                this.bubble.active = false;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
            if(this.bubble.active == true) {
                this.bubble.active = false;
            }
            if(this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                if( this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
            if(this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if(this.gunNode.getChildByName('ballNode').opacity) {
                    this.bubble_2.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_2.opacity = 255;
                    let gunBall = this.gunNode.getChildByName('ballNode');
                    gunBall.opacity = 0;
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }else {
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }
            }else if(this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if(this.gunNode.getChildByName('ballNode').opacity) {
                    let gunBall = this.gunNode.getChildByName('ballNode');
                    gunBall.opacity = 0;
                    this.bubble_1.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
                    this.bubble_1.opacity = 255;
                }
                this.bubble_2.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = this.bubble.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
                this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_2.opacity = 255;
            }
            if(this.bubble_1.opacity && this.bubble_2.opacity) {
                let gunBall = this.gunNode.getChildByName('ballNode');
                gunBall.runAction(cc.fadeIn(2));
                this.bubble_1.runAction(cc.fadeOut(2));
                this.bubble_2.runAction(cc.fadeOut(2));
                let num1 = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
                let num2 = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
                let num = num1 * num2;
                if(num > this.decoposeNum) {
                    num = this.decoposeNum;
                }
                gunBall.getChildByName('label').getComponent(cc.Label).string = num.toString();
                if(num.toString().length == 2||num.toString().length == 1) {
                    cc.loader.loadRes('images/gameUI/bubble_8', cc.SpriteFrame, function(err, spriteframe){
                        gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteframe;
                    }.bind(this)) ;
                }else if(num.toString().length == 3) {
                    cc.loader.loadRes('images/gameUI/bubble_9', cc.SpriteFrame, function(err, spriteframe){
                        gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteframe;
                    }.bind(this));
                }
            }
        }.bind(this), this);
    }

    addListenerOnAnswerBall(ballNode : cc.Node) {
        var ball = ballNode.getChildByName('ball');
        ball.on(cc.Node.EventType.TOUCH_START, function(e){

        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function(e){

            ballNode.setPosition(ballNode.parent.convertToNodeSpaceAR(e.currentTouch._point));
            if(this.garbageNode.getChildByName('bg').getBoundingBox().contains(this.garbageNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.garbageNode.getChildByName('light').active = true;
                this.garbageNode.getChildByName('iconLight').active = true;
            }else {
                if( this.garbageNode.getChildByName('light').active == true) {
                    this.garbageNode.getChildByName('light').active = false;
                    this.garbageNode.getChildByName('iconLight').active = false;
                }
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function(e){
            if(this.garbageNode.getChildByName('light').active == true) {
                this.garbageNode.getChildByName('light').active = false;
                this.garbageNode.getChildByName('iconLight').active = false;
                cc.log(this.answerArr);
                let index = this.answerArr.indexOf(ballNode);
                cc.log("index is ",  index);
                this.answerArr.splice(index, 1);
                this.answerArr.filter(item => item !== ballNode);
                cc.log(this.answerArr);
                this.updatePos();
                ballNode.destroy();
            }

        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function(e){

        }.bind(this), this);
    }

    updatePos() {
        for(let i = 0; i < this.answerArr.length; i++) {
            let index = i + 1;
            let parent = this.node.getChildByName(index.toString());
            this.answerArr[i].parent = parent;
        }
    }

    shoot() { 
        if(this.gunNode.getChildByName('ballNode').opacity == 255 && this.answerArr.length < 25) {
            var gunBall = this.gunNode.getChildByName('ballNode');
            var num = gunBall.getChildByName('label').getComponent(cc.Label).string;
            var answerIndex = this.answerArr.length + 1;
            var parent = this.node.getChildByName(answerIndex.toString());
            var dirPos = parent.getPosition();
            var pos1 = this.gunNode.getPosition();
            var xx = this.gunNode.getChildByName('gun1').getPosition().x + pos1.x;
            var yy = this.gunNode.getChildByName('gun1').getPosition().y + pos1.y;
            var pos3 = cc.v2(xx, yy);
            var anchorPos = this.gunNode.getPosition();
            var angle = this.getAngle(dirPos, anchorPos); 
            var oriPos = this.getRotationPos(pos1, pos3, angle);
            var answerNum = parseInt(gunBall.getChildByName('label').getComponent(cc.Label).string);
            if(this.pl.indexOf(answerNum) == -1) {
                this.pl.push(answerNum);
            }     
            this.bullet.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = gunBall.getChildByName('ball').getComponent(cc.Sprite).spriteFrame;
            this.bullet.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
            var shootStart = cc.callFunc(function(){
                gunBall.opacity = 0;
                this.bullet.setPosition(oriPos);
                cc.log(oriPos);
                this.bullet.opacity = 255;
                this.bullet.setScale(0.5);
                this.bullet.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, dirPos).easing(cc.easeIn(0.5))), shootEnd));
            }.bind(this), this);   
            var shootEnd = cc.callFunc(function(){
                this.bullet.opacity = 0;
                this.createBall(parseInt(num), 0, 0, parent, true);
                this.gunNode.runAction(cc.rotateTo(0.5, 0));
            }.bind(this), this);
            this.gunNode.runAction(cc.sequence(cc.rotateBy(0.5, angle), shootStart));
        }
    }

    getAngle(dirpos : cc.Vec2, oriPos : cc.Vec2) : number {
        var x = Math.abs(dirpos.x - oriPos.x);
        var y = Math.abs(dirpos.y - oriPos.y);
        var z = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);
        var angle = Math.floor(180/(Math.PI/radina));
        if(dirpos.x > oriPos.x) {
            angle = angle;
        }else {
            angle = - angle; 
        }
        return angle;
    }
    getRotationPos(anchorPos : cc.Vec2, childPos : cc.Vec2, angle : number) : cc.Vec2 {
        //var angle = Math.abs(angle);
        var z = Math.sqrt(Math.pow((anchorPos.x - childPos.x), 2) + Math.pow((anchorPos.y - childPos.y), 2));
        var radina = 2 * Math.PI / 360 * angle; 
        var cos = Math.cos(radina);
        var y = z * cos;
        var x = Math.sqrt(Math.pow(z,2) - Math.pow(y,2));
        cc.log(x, '============',y);
        var posx = anchorPos.x + x;
        var posy = anchorPos.y + y;
        if(angle > 0){
            posx = posx;
        }else {
           posx = anchorPos.x - x;;
        }
        var pos = cc.v2(posx,posy);
        return pos;
    }
    nextCheckPoint(checkpoint : number) {
        //重置时间
        this.closeClock();
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        //销毁实例
        for(let i = 0; i < this.decomposeArr.length;  i++) {
            this.decomposeArr[i].destroy();
        }
        for(let i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].destroy();
        }
        for(let i = 0; i < this.labelArr.length; i++) {
            this.labelArr[i].destroy();
        }
        //清空数组
        this.decomposeArr = [];
        this.answerArr = [];
        this.labelArr = [];
        this.pl = [];
        //重置ui
        this.bubble.active = false;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        //初始化游戏
        this.checkpointsNum = DaAnData.getInstance().numberArr[checkpoint - 1]
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
        this.openClock();
    }
    reset() {
        //重置时间
        this.closeClock();
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        //销毁实例
        for(let i = 0; i < this.answerArr.length;  i++) {
            this.answerArr[i].destroy();
        }
        //清空数组
        this.answerArr = [];
        this.pl = [];


        //重置ui
        this.bubble.active = false;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;

        this.openClock();
    }

    cueAnswer() {
        for(let i = 0; i < this.pl.length; i++) {
            
        }
    }

    isRight() {
        var rightNum = 0;
        for(let i = 0; i < this.pl.length; i++) {
            if(this.an.indexOf(this.an[i]) != -1) {
                rightNum ++;
            }
        }
        if(rightNum == this.an.length) {
           this.checkpoint ++;
           if(this.checkpoint == this.checkpointsNum + 1) {
               this.closeClock();
                UIHelp.showOverTips(1, this.timer, '恭喜全部通关', function(){
                    this.reset();
                }.bind(this), function(){
                    UIManager.getInstance().closeUI(OverTips);
                }.bind(this));
           }else {
            this.closeClock();
            UIHelp.showOverTips(2, this.timer, '挑战成功', function(){
                this.reset();
            }.bind(this), function(){
                this.nextCheckPoint(this.checkpoint);
            }.bind(this));
           }
        }else {
            this.closeClock();
           UIHelp.showOverTips(3, this.timer, '挑战失败！点击重置后再次挑战');
        }



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
        clearInterval(this.intervalIndex);
    }

    backButton(){
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
    }
    submitButton(){
        UIManager.getInstance().openUI(SubmissionPanel);
    }
