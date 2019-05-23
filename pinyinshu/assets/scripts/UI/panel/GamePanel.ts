import { BaseUI } from "../BaseUI";
import {DaAnData, skinStrEnum} from "../../Data/DaAnData";
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
    miya : cc.Node = null;
    @property(cc.Node)
    mask : cc.Node = null;
    @property(cc.Node)
    numberNode : cc.Node = null;
    @property(cc.Node)
    signNode : cc.Node = null;
    @property(cc.BitmapFont)
    font : cc.BitmapFont = null;
    @property(cc.Prefab)
    ballNodeP : cc.Prefab = null;
    decomposeArr : Array<cc.Node> = Array<cc.Node>();
    answerArr : Array<cc.Node> = Array<cc.Node>();
    labelArr : Array<cc.Node> = Array<cc.Node>();
    progressArr : Array<cc.Node> = Array<cc.Node>(); 
    placementBallArr : Array<cc.Node> = Array<cc.Node>();
    li : Array<number> = Array<number>();   //质因数
    an : Array<number> = Array<number>();   //约数
    pl : Array<number> = Array<number>();   //玩家答案
    updateNode : Array<cc.Node> = Array<cc.Node>(); 
    timer : number = null;
    decoposeNum : number = null;    //被分解的数
    intervalIndex : number = null;    //clock的interval的index值
    minStr : string = null;
    secStr : string = null;
    checkpointsNum : number = null;
    checkpoint : number = null;
    cueNum : number = 0;
    isReadyShoot : boolean = false;
    isDoubleOver : boolean = true;
     onLoad () {
        //测试用
        // DaAnData.getInstance().checkpointsNum = 3;
        // DaAnData.getInstance().numberArr = [24, 2, 26];
        this.isTecher();
       
    }

    start() {
      
    }
   

    onDestroy() {
       
    }

    update (dt) {
        for(let i = 0; i < this.updateNode.length; i++) {
                let scalex = this.updateNode[i].getChildByName('spine').getComponent(sp.Skeleton).findBone('bubble_11').scaleX;
                let scaley = this.updateNode[i].getChildByName('spine').getComponent(sp.Skeleton).findBone('bubble_11').scaleY;
                this.updateNode[i].getChildByName('label').setScale(cc.v2(scalex, scaley));
        }
        
        if(this.pl.length <= 1 ) {
            if(this.decoposeNum == 1) {
                if(this.tijiao.interactable == false && this.cueNum == 0) {
                    this.tijiao.interactable = true;
                }
                if(this.chongzhi.interactable == false) {
                    this.chongzhi.interactable = true;
                }
            }else {
                if(this.tijiao.interactable == true) {
                    this.tijiao.interactable = false;
                }
                if(this.chongzhi.interactable == true) {
                    this.chongzhi.interactable = false;
                }
            }
        }else {
            if(this.checkpoint >= this.checkpointsNum+1) {
                return
            }
            if(this.tijiao.interactable == false && this.cueNum == 0) {
                this.tijiao.interactable = true;
            }
            if(this.chongzhi.interactable == false) {
                this.chongzhi.interactable = true;
            }
        }
        if(this.cueNum > 0) {
            if(this.tijiao.interactable == true) {
                this.tijiao.interactable = false;
            } 
        }
   }

    isTecher() {
        if(ConstValue.IS_TEACHER) {
            this.submit.node.active = false;
            this.back.node.active = true;
            this.initData();
        }else {
            this.submit.node.active = false;
            this.back.node.active = false;
            this.getNet();
        }
    }

    initData() {
        cc.log('---------------------initdata');
        this.timer = 0;
        this.checkpoint = 1;
        this.decoposeNum = DaAnData.getInstance().numberArr[this.checkpoint - 1];
        this.checkpointsNum = DaAnData.getInstance().checkpointsNum;
        this.defaultValue();
        this.initProgress(this.checkpointsNum);
        this.updateNode.push(this.bubble_1);
        this.updateNode.push(this.bubble_2);
        this.updateNode.push(this.gunNode.getChildByName('ballNode'));
        this.placementBallArr.push(this.gunNode.getChildByName('ballNode'));
        this.placementBallArr.push(this.bubble_1);
        this.placementBallArr.push(this.bubble_2);
        this.addListenerOnPlacement();
        this.mask.on(cc.Node.EventType.TOUCH_START, function(e) {
            e.stopPropagation();
        }.bind(this));
        this.mask.active = false;
        //开始游戏
        this.openClock();
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
    }
    
    initProgress(checkpointsNum : number) {
        var long = 200;
        if(this.checkpointsNum == 1) {
            return;
        }
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
        this.bubble_1.opacity = 255;
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStrEnum[1]);
        this.bubble_1.getChildByName('label').getComponent(cc.Label).string = '1';
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'idle', true);
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
        this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
            if(trackEntry.animation.name == 'ball_in') {
            this.isReadyShoot = true;
               this.shoot();
            }
        });
       
    }

    createBall(num : number, x : number, y : number, parent : cc.Node, isAnswer : boolean){
       
        var ballNode = cc.instantiate(this.ballNodeP);
        ballNode.getChildByName('label').getComponent(cc.Label).string = String(num);
        if(num.toString().length == 3) {
            ballNode.getChildByName('label').getComponent(cc.Label).fontSize = 30;
        }
        var ball = ballNode.getChildByName('spine').getComponent(sp.Skeleton);
        ball.setAnimation(0, 'idle', true);
        ballNode.parent = parent;
        ball.setSkin(this.skinString(num));
        if(isAnswer) { 
            ballNode.x = x;
            ballNode.y = y;
            ballNode.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
            this.answerArr.push(ballNode);
            cc.log('push a answer ball', ballNode);
            this.updateNode.push(ballNode);
            this.addListenerOnAnswerBall(ballNode);
        }else {
            ballNode.y = 0;
            if(x != this.li.length - 1) {
                
                let node = new cc.Node("label");
                let labelX = node.addComponent(cc.Label);
                labelX.string = "*";
                labelX.font = this.font;
                labelX.fontSize = 50;
                labelX.node.y = 0;
                node.parent = parent;
                this.labelArr.push(node);
            }
            this.decomposeArr.push(ballNode);
            this.addListenerOnDecomposeBall(ballNode);
        }
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if(content.numberArr) {
                         DaAnData.getInstance().numberArr = content.numberArr;
                    }
                    if(content.checkpointsNum) {
                         DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                    }
                    cc.log('---------------------initdata');
                    this.initData();
                }
            } else {
                
            }
        }.bind(this), null);
    }

    answer(num : number) {
        for(let i = 1; i <= num; i++) {
            if(num % i == 0) {
                this.an.push(i);
            }
        }
        cc.log(this.an);
    }

    decompose(num: number) {
          var num1 = num;
            var i = 1;
            while (i<num1) {
                i += 1;
                while (num1 % i == 0) {
                    num1/=i;
                    this.li.push(i);
                }
            }
        if(num == 1) {
            this.li.push(1);
        }
        var str = String(num) + '  =  ';
        this.numberStr.getComponent(cc.Label).string = str;
        var repeat = 1;
        for(let i = 0; i < this.li.length; i++) {
            if(this.li[i] != this.li[i+1] && this.li[i] != this.li[i-1]) {
                repeat = 1;
                let node = new cc.Node();
                const label = node.addComponent(cc.Label);
                label.font = this.font;
                label.fontSize = 50;
                node.parent = this.numberNode;
                node.y = 10;
                this.labelArr.push(node);
                if(i < this.li.length - 1) {
                    label.string = String(this.li[i]) + '  *  ';
                }else {
                    label.string = String(this.li[i]) + '  =  ';
                }
            }else {
                repeat ++;
                if(this.li[i+1] != this.li[i+2] && this.li[i] == this.li[i+1]) {
                    let node0 = new cc.Node();
                    const label0 = node0.addComponent(cc.Label);
                    label0.font = this.font;
                    label0.fontSize = 50;
                    label0.string = this.li[i].toString();
                    node0.parent = this.numberNode;
                    node0.y = 10;
                    this.labelArr.push(node0);
                    let node = new cc.Node();
                    const label = node.addComponent(cc.Label);
                    label.string = repeat.toString();
                    label.font = this.font;
                    label.fontSize = 30;
                    node.parent = this.numberNode;
                    node.y = 40;
                    this.labelArr.push(node);
                    let node1 = new cc.Node();
                    const label1 = node1.addComponent(cc.Label);
                    label1.font = this.font;
                    label1.fontSize = 50;
                    this.labelArr.push(node1);
                    if(this.li[i + 2]) {
                        label1.string = '  *  ';
                    }else{
                        label1.string = '  =  '
                    }
                    node1.parent = this.numberNode;
                    node1.y = 10;
                }
            }    
        }
        cc.log('li is ', this.li);
        cc.log('numberStr is :', this.numberStr.getComponent(cc.Label).string);
    }

    createDecomposeBall() {
        var x = this.numberStr.node.getContentSize().width + 100;
        cc.log('numberstr width is ', this.numberStr.node.getContentSize().width);
        var y = 0;
        var space = 100;
        for(let i = 0; i < this.li.length; i++) {
            cc.log(this.li[i]);
            var ballx = 0;
            ballx = 0;// x + 200 * i;
            cc.log(x);
            this.createBall(this.li[i], i, y, this.numberNode, false);
        }
    }

    skinString(num : number):string {
        if(skinStrEnum[num] && num != 8 && num != 9) {
            return skinStrEnum[num];
        }else {
            if(num.toString().length == 1) {
                return skinStrEnum[8];
            }else if(num.toString().length == 2 || num.toString().length == 3) {
                return skinStrEnum[9];
            }
        }
    }

    addListenerOnPlacement(){
        var bubble_none = null;
        for(let i = 0; i < this.placementBallArr.length; i++) {
            this.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_START, function(e){
                this.placementBallArr[i].opacity = 0;
                this.bubble.opacity = 255;
                if(this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.bubble_none1.node.opacity = 255;
                    bubble_none = 1;
                }else if(this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.bubble_none2.node.opacity = 255; 
                    bubble_none = 2;
                }else{ 
                    bubble_none = null;
                }
                var num = parseInt(this.placementBallArr[i].getChildByName('label').getComponent(cc.Label).string);  
                this.bubble.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
                this.bubble.getChildByName('label').getComponent(cc.Label).getComponent(cc.Label).string = num.toString();
                this.bubble.setPosition(this.node.convertToNodeSpaceAR(e.currentTouch._point));
                if(this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                }
                if(this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                }
            }.bind(this));
            this.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_MOVE, function(e){
                var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                if(location.x > this.node.width /2 - this.bubble.width / 2) {
                    this.bubble.x = this.node.width /2 - this.bubble.width / 2;
                }else if(location.x < - this.node.width / 2 + this.bubble.width / 2){
                    this.bubble.x = - this.node.width / 2 + this.bubble.width / 2;
                }else {
                    this.bubble.x = location.x;
                }
                if(location.y >= this.node.height / 2 - this.bubble.height / 2) {
                    this.bubble.y = this.node.height / 2 - this.bubble.height / 2;
                }else if (location.y <= - this.node.height / 2 + this.bubble.height / 2){
                    this.bubble.y = - this.node.height / 2 + this.bubble.height / 2;
                }else {
                    this.bubble.y = location.y;
                }
                var touchPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                var distant = Math.sqrt(Math.pow((touchPos.x - this.miya.getPosition().x),2) + Math.pow((touchPos.y - this.miya.getPosition().y),2));
                if(distant < 400 && distant > 150) {
                    if(this.miya.getComponent(sp.Skeleton).animation == 'idle' && this.miya.getComponent(sp.Skeleton).animation != 'in_jump') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_jump', false);
                    }
                    if(this.miya.getComponent(sp.Skeleton).animation != 'jump') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump', true);
                    }  
                }else if(distant < 150) {
                    if(this.miya.getComponent(sp.Skeleton).animation != 'jump_xuangz') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump_xuangz', true);
                    }   
                }else if(distant > 400) {
                    if(this.miya.getComponent(sp.Skeleton).animation == 'jump' && this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                        this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                    }
                    if(this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                        this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                    }
                }
            }.bind(this));
            this.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_END, function(e){
                if(this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                  
                    this.bubble.opacity = 0;
                }else {
                    this.bubble.opacity = 0;
                    this.placementBallArr[i].opacity = 255;
                    if(bubble_none == 1) {
                        this.bubble_none1.node.opacity = 0;
                    }else if(bubble_none == 2) {
                        this.bubble_none2.node.opacity = 0;
                    }
                }
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
                if(this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
                }
            }.bind(this));
            this.placementBallArr[i].getChildByName('spine').on(cc.Node.EventType.TOUCH_CANCEL, function(e){
                if(this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                  
                    this.bubble.opacity = 0;
                }else {
                    this.bubble.opacity = 0;
                    this.placementBallArr[i].opacity = 255;
                    if(bubble_none == 1) {
                        this.bubble_none1.node.opacity = 0;
                    }else if(bubble_none == 2) {
                        this.bubble_none2.node.opacity = 0;
                    }else {
                        this.bubble_none1.node.opacity = 255;
                        this.bubble_none2.node.opacity = 255;
                    }
                }
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
                if(this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
                }
            }.bind(this));
        }
    }

    addListenerOnDecomposeBall(ballNode : cc.Node) {
        cc.log(ballNode);
        var ball = ballNode.getChildByName('spine');
        ball.on(cc.Node.EventType.TOUCH_START, function(e){
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.bubble.x = location.x;
            this.bubble.y = location.y;
            var num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string); 
            var skinStr = this.skinString(num);
            this.bubble.getChildByName('label').getComponent(cc.Label).string = num;
            this.bubble.opacity = 255;
            this.bubble.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr);
        }.bind(this), this);

        ball.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            if(location.x > this.node.width /2 - ball.width / 2) {
                this.bubble.x = this.node.width /2 - ball.width / 2;
            }else if(location.x < - this.node.width / 2 + ball.width / 2){
                this.bubble.x = - this.node.width / 2 + ball.width / 2;
            }else {
                this.bubble.x = location.x;
            }
            if(location.y >= this.node.height / 2 - ball.height / 2) {
                this.bubble.y = this.node.height / 2 - ball.height / 2;
            }else if (location.y <= - this.node.height / 2 + ball.height / 2){
                this.bubble.y = - this.node.height / 2 + ball.height / 2;
            }else {
                this.bubble.y = location.y;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function(){
            if(this.bubble.opacity == 255) {
                this.bubble.opacity = 0;
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
            if(this.gunNode.rotation != 0) {
                if(this.bubble.opacity == 255) {
                    this.bubble.opacity = 0;
                    return;
                }
            }
            var num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string);  
            var skinStr = this.skinString(num);
            if(this.bubble_none1.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if(this.gunNode.getChildByName('ballNode').opacity) {
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    let gunballNum = parseInt(this.gunNode.getChildByName('ballNode').getChildByName("label").getComponent(cc.Label).string); 
                    this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(gunballNum));
                    this.bubble_2.getChildByName('label').getComponent(cc.Label).string = gunballNum.toString();
                    if(gunballNum.toString().length >= 3) {
                        this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 30;
                    }else {
                        this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                    }
                    this.bubble_2.opacity = 255;
                    this.bubble_none2.node.opacity = 0;
                    this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    let gunBall = this.gunNode.getChildByName('ballNode');
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                        if(trackEntry.animation.name == 'ball_out') {
                            gunBall.opacity = 0;
                        }
                    });
                }
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr); 
                this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                this.bubble_1.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_1.opacity = 255;
                this.bubble_none1.node.opacity = 0;
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                if(this.bubble_1.opacity && this.bubble_2.opacity) {
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    this.signNode.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.2),cc.fadeIn(0.1),cc.fadeOut(0.2)));
                }
                this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                    if(trackEntry.animation.name == 'ball_in') {
                        if(this.bubble_1.opacity && this.bubble_2.opacity) {
                            var skeleton1 =  this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton);
                            var skeleton2 =  this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton);
                            skeleton1.addAnimation(0, 'ball_out', false);
                            skeleton2.addAnimation(0, 'ball_out', false);
                        }
                    }else if(trackEntry.animation.name == 'ball_out') {
                        if(this.bubble_1.opacity && this.bubble_2.opacity) {
                            this.gunballIn();
                            this.bubble_1.opacity = 0;
                            this.bubble_2.opacity = 0;
                            this.bubble_none1.node.opacity = 255;
                            this.bubble_none2.node.opacity = 255;
                        }  
                    }
                });
            
            }else if(this.bubble_none2.node.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                if(this.gunNode.getChildByName('ballNode').opacity) {
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    let gunballNum = parseInt(this.gunNode.getChildByName('ballNode').getChildByName("label").getComponent(cc.Label).string); 
                    let gunBall = this.gunNode.getChildByName('ballNode');
                    this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(gunballNum));
                    this.bubble_1.getChildByName('label').getComponent(cc.Label).string = gunballNum.toString();
                    if(gunballNum.toString().length >= 3) {
                        this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 30;
                    }else {
                        this.bubble_1.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                    }
                    this.bubble_1.opacity = 255;
                    this.bubble_none1.node.opacity = 0;
                    this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
                    gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                        if(trackEntry.animation.name == 'ball_out') {
                            gunBall.opacity = 0;
                        }
                    });
                }
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setSkin(skinStr); 
                this.bubble_2.getChildByName('label').getComponent(cc.Label).fontSize = 40;
                this.bubble_2.getChildByName('label').getComponent(cc.Label).string = this.bubble.getChildByName('label').getComponent(cc.Label).string;
                this.bubble_2.opacity = 255;
                this.bubble_none2.node.opacity = 0;
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                if(this.bubble_1.opacity && this.bubble_2.opacity) {
                    this.isReadyShoot = false;
                    this.isDoubleOver = false;
                    this.signNode.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.2),cc.fadeIn(0.1),cc.fadeOut(0.2)));
                }
                this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                    if(trackEntry.animation.name == 'ball_in') {
                        if(this.bubble_1.opacity && this.bubble_2.opacity) { 
                            var skeleton1 =  this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton);
                            var skeleton2 =  this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton);
                            skeleton1.addAnimation(0, 'ball_out', false);
                            skeleton2.addAnimation(0, 'ball_out', false);
                        }
                    }else if(trackEntry.animation.name == 'ball_out') {
                        if(this.bubble_1.opacity && this.bubble_2.opacity) { 
                            this.gunballIn();
                            this.bubble_1.opacity = 0;
                            this.bubble_2.opacity = 0;
                            this.bubble_none1.node.opacity = 255;
                            this.bubble_none2.node.opacity = 255;
                        } 
                    }
                });
            }
            if(this.bubble.opacity == 255) {
                this.bubble.opacity = 0;
            }
        }.bind(this), this);
    }

    gunballIn() {
        let gunBall = this.gunNode.getChildByName('ballNode');
        gunBall.opacity = 255;
        let num1 = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
        let num2 = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
        let num = num1 * num2;  
        if(num > 999) {
            num = 999;
        }
        if(num.toString().length >= 3) {
            gunBall.getChildByName('label').getComponent(cc.Label).fontSize = 30;
        }else {
            gunBall.getChildByName('label').getComponent(cc.Label).fontSize = 40;
        }
        gunBall.getChildByName('label').getComponent(cc.Label).string = num.toString();
        gunBall.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
        this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'in', false);
        if(gunBall.opacity) {
            gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
            gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                if(trackEntry.animation.name == 'ball_in') {
                   this.isReadyShoot = true;
                   this.isDoubleOver = true;
                }
            });
        }
    }

    addListenerOnAnswerBall(ballNode : cc.Node) {
        var ball = ballNode.getChildByName('spine');
        ball.on(cc.Node.EventType.TOUCH_START, function(e){
            if(this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
            }
            if(this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
            }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            var location = ballNode.parent.convertToNodeSpaceAR(e.currentTouch._point);
            if(location.x >= this.node.width /2 - ball.width/2 - ballNode.parent.x) {
                ballNode.x = this.node.width /2 - ball.width/2 - ballNode.parent.x;
            }else if(location.x <= - this.node.width / 2 + ball.width/2 - ballNode.parent.x){
                ballNode.x = - this.node.width / 2 + ball.width/2 - ballNode.parent.x;
            }else {
                ballNode.x = location.x;
            }
            if(location.y >= this.node.height / 2 - ball.height / 2 - ballNode.parent.y) {
                ballNode.y = this.node.height / 2 - ball.height / 2 - ballNode.parent.y;
            }else if (location.y <= - this.node.height / 2 + ball.height / 2 - ballNode.parent.y){
                ballNode.y = - this.node.height / 2 + ball.height / 2 - ballNode.parent.y;
            }else {
                ballNode.y = location.y;
            }
            //ballNode.setPosition(ballNode.parent.convertToNodeSpaceAR(e.currentTouch._point));
            var touchPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            var distant = Math.sqrt(Math.pow((touchPos.x - this.miya.getPosition().x),2) + Math.pow((touchPos.y - this.miya.getPosition().y),2));
            if(distant < 400 && distant > 150) {
                if(this.miya.getComponent(sp.Skeleton).animation == 'idle' && this.miya.getComponent(sp.Skeleton).animation != 'in_jump') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_jump', false);
                }
                if(this.miya.getComponent(sp.Skeleton).animation != 'jump') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump', true);
                }  
            }else if(distant < 150) {
                if(this.miya.getComponent(sp.Skeleton).animation != 'jump_xuangz') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump_xuangz', true);
                }   
            }else if(distant > 400) {
                if(this.miya.getComponent(sp.Skeleton).animation == 'jump' && this.miya.getComponent(sp.Skeleton).animation != 'kan') {
                    this.miya.getComponent(sp.Skeleton).setAnimation(0, 'kan', false);
                }
                if(this.miya.getComponent(sp.Skeleton).animation != 'kan_idle') {
                    this.miya.getComponent(sp.Skeleton).addAnimation(0, 'kan_idle', true);
                }
            }
            // if(this.miya.getChildByName('layout').getBoundingBox().contains(this.miya.convertToNodeSpaceAR(e.currentTouch._point))) {
            //     this.miya.getComponent(sp.Skeleton).setAnimation(0, 'jump_xuangz', true);
            // }else {
            //     if( this.miya.getComponent(sp.Skeleton).getAnimationState() == 'jump_xuangz') {
            //         this.miya.getComponent(sp.Skeleton).addAnimation(0, 'jump', true);
            //     }
            // }
        }.bind(this), this);
        ball.on(cc.Node.EventType.TOUCH_END, function(e){
            if(this.miya.getComponent(sp.Skeleton).animation == 'jump_xuangz') {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'in_idle', false);
                let num = parseInt(ballNode.getChildByName('label').getComponent(cc.Label).string);
                if(num == 1) {
                    UIHelp.showAffirmTips(1, '质数1不能删除', function(){
                        ballNode.setPosition(cc.v2(0, 0));
                    }.bind(this),function(){
                        ballNode.setPosition(cc.v2(0, 0));
                    }.bind(this));
                }else {
                    let index = this.answerArr.indexOf(ballNode);
                    this.answerArr.splice(index, 1);
                    this.pl.splice(index, 1);
                    let updateIndex = this.updateNode.indexOf(ballNode);
                    this.updateNode.splice(updateIndex, 1); 
                    //this.answerArr.filter(item => item !== ballNode);
                    this.updatePos();
                    ballNode.destroy();
                }
            }else {
                ballNode.setPosition(cc.v2(0, 0));
            }
            this.miya.getComponent(sp.Skeleton).setAnimation(0, 'in_idle', false);
           if(this.miya.getComponent(sp.Skeleton).animation != 'idle') {
                this.miya.getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
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
        if(this.gunNode.rotation != 0) {
            return;
        }  
        
        if(this.gunNode.getChildByName('ballNode').opacity == 0 && this.bubble_1.opacity && this.isDoubleOver) {
            let num = parseInt(this.bubble_1.getChildByName('label').getComponent(cc.Label).string);
            let ballNode =  this.gunNode.getChildByName('ballNode');
            ballNode.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
            ballNode.getChildByName('label').getComponent(cc.Label).string = num.toString();
            ballNode.opacity = 255;
            ballNode.getChildByName('gun_bg').opacity = 0;
            this.bubble_none1.node.opacity = 255;
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                if(trackEntry.animation.name == 'ball_out') {
                   this.bubble_1.opacity = 0; 
                   ballNode.getChildByName('gun_bg').opacity = 255;
                   ballNode.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                   cc.log('complete callback');
                }
            });
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).clearTracks();
            this.bubble_1.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false);
        }else if(this.gunNode.getChildByName('ballNode').opacity == 0 && this.bubble_2.opacity && this.isDoubleOver) {
            let num = parseInt(this.bubble_2.getChildByName('label').getComponent(cc.Label).string);
            let ballNode =  this.gunNode.getChildByName('ballNode');
            ballNode.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(num));
            ballNode.getChildByName('label').getComponent(cc.Label).string = num.toString();
            ballNode.opacity = 255;
            ballNode.getChildByName('gun_bg').opacity = 0;
            this.bubble_none2.node.opacity = 255;
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                if(trackEntry.animation.name == 'ball_out') {
                   this.bubble_2.opacity = 0; 
                   ballNode.getChildByName('gun_bg').opacity = 255;
                   ballNode.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_in', false);
                   cc.log('complete callback');
                }
            });
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).clearTracks();
            this.bubble_2.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_out', false); 
        }
       
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
            this.pl.push(answerNum);
            this.bullet.getChildByName('spine').getComponent(sp.Skeleton).setSkin(this.skinString(answerNum));
            this.bullet.getChildByName('label').getComponent(cc.Label).string = gunBall.getChildByName('label').getComponent(cc.Label).string;
            var shootStart = cc.callFunc(function(){
                this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'ready', false);
                // this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'go', false);
                this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                    if(trackEntry.animation.name == 'ready') {
                        this.gunNode.getChildByName('gun').getComponent(sp.Skeleton).setAnimation(0, 'go', false);
                        gunBall.getChildByName('spine').getComponent(sp.Skeleton).setAnimation(0, 'ball_fire', false);
                        gunBall.getChildByName('spine').getComponent(sp.Skeleton).setCompleteListener(trackEntry => { 
                           if(trackEntry.animation.name == 'ball_fire') {
                                gunBall.opacity = 0;
                            }  
                        });
                        this.bullet.setPosition(oriPos);
                        cc.log(oriPos);
                        this.bullet.opacity = 255;
                        this.bullet.setScale(0.5);
                        var time = 0.2;
                        if(answerIndex > 18) {
                            time = 0.1;
                        }
                        this.bullet.runAction(cc.sequence(cc.spawn(cc.scaleTo(time, 1), cc.moveTo(time, dirPos).easing(cc.easeSineOut())), shootEnd));
                    }
                });

               
            }.bind(this), this);   
            var shootEnd = cc.callFunc(function(){
                this.bullet.opacity = 0;
                this.createBall(parseInt(num), 0, 0, parent, true);
                cc.log('create a answer ball', this.answerArr);
                this.gunNode.runAction(cc.rotateTo(0.5, 0));
            }.bind(this), this);
            this.gunNode.runAction(cc.sequence(cc.rotateBy(0.5, angle), shootStart));
        }
        this.isReadyShoot = false;
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
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        this.openClock();
        //销毁实例
        this.updateNode = [];
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
        this.li = [];
        this.an = [];
        //重置ui
        this.bubble.opacity = 0;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        //初始化游戏
        this.decoposeNum = DaAnData.getInstance().numberArr[checkpoint - 1]
        cc.log('next point is ', checkpoint);
        cc.log('checkpointsnum is ', this.checkpointsNum);
        this.decompose(this.decoposeNum);
        this.answer(this.decoposeNum);
        this.createDecomposeBall();
        this.initProgress(this.checkpoint); 
        this.defaultValue();
        this.updateNode.push(this.bubble_1);
        this.updateNode.push(this.bubble_2);
        this.updateNode.push(this.gunNode.getChildByName('ballNode')); 
       
        this.cueNum = 0;
    }
    reset() {
        if(this.gunNode.rotation != 0) {
            return;
        }
        //重置时间
        this.minuteHand.rotation = 0;
        this.secondHand.rotation = 0;
        this.timer = 0;
        this.openClock();
        //销毁实例

        for(let i = 0; i < this.answerArr.length;  i++) {
            if(this.updateNode.indexOf(this.answerArr[i]) != -1) {
                this.updateNode.splice(this.updateNode.indexOf(this.answerArr[i]), 1);
            }
            this.answerArr[i].destroy();
        }
        //清空数组
        this.answerArr = [];
        this.pl = [];

        //重置ui
        this.bubble.opacity = 0;
        this.bubble_1.opacity = 0;
        this.bubble_2.opacity = 0;
        this.gunNode.getChildByName('ballNode').opacity = 0;
        this.bullet.opacity = 0;
        this.cueNum = 0; 
        this.defaultValue();
        this.mask.active = false;
    }

    cueAnswer() {
        for(let i = 0; i < this.pl.length; i++) {
            if(this.an.indexOf(this.pl[i]) == -1) {
                this.answerArr[i].getChildByName('err').active = true;
            }else {
                for(let j = 0; j < i; j ++) {
                    if(this.pl[j] == this.pl[i]) {
                        this.answerArr[i].getChildByName('err').active = true;
                    }
                }
            }
        }
    }

    isRight() {
        if(this.gunNode.rotation != 0) {
            return;

        }
        var rightNum = 0;
        for(let i = 0; i < this.an.length; i++) {
            if(this.pl.indexOf(this.an[i]) != -1) {
                rightNum ++;
            }
        }
        if(rightNum == this.an.length && this.pl.length == this.an.length) {
           this.checkpoint ++;
           if(this.checkpoint >= this.checkpointsNum + 1) {
               this.closeClock();
               this.tijiao.interactable = false;
               this.chongzhi.interactable = false;
                UIHelp.showOverTips(1, this.timer, '恭喜全部通关', function(){
                    UIManager.getInstance().closeUI(OverTips);
                    this.checkpoint --;
                    this.reset();
                }.bind(this), function(){
                    UIManager.getInstance().closeUI(OverTips);
                    this.mask.active = true;
                    if(ConstValue.IS_TEACHER) {
                        this.submit.node.active = true;
                    }
                }.bind(this));
           }else {
            this.closeClock();
            UIHelp.showOverTips(2, this.timer, '挑战成功', function(){
                UIManager.getInstance().closeUI(OverTips);
                this.checkpoint --;
                this.reset();
            }.bind(this), function(){
                UIManager.getInstance().closeUI(OverTips);
                this.nextCheckPoint(this.checkpoint);
            }.bind(this));
           }
        }else {
            this.cueNum ++;
            this.mask.active = true;
            this.closeClock();
           UIHelp.showOverTips(3, this.timer, '挑战失败！点击重置后再次挑战',this.cueAnswer.bind(this));
        }
    }

    chongzhiCallback() {
        UIHelp.showAffirmTips(1,'确认要重置本关，重新开始游戏吗？',this.reset.bind(this));
    }

    tijiaoCallback() {
        UIHelp.showAffirmTips(1,'确认提交答案吗？',this.isRight.bind(this));
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
        this.closeClock();
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
    }
    submitButton(){
        UIManager.getInstance().openUI(SubmissionPanel);
    }
}
