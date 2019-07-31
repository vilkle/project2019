import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { AudioManager } from "../../Manager/AudioManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Node)
    private fruitNode : cc.Node = null;
    @property(cc.Node)
    private vegetableNode : cc.Node = null;
    @property(cc.Node)
    private directionNode : cc.Node = null;
    @property(cc.Node)
    private touchSprite : cc.Node = null;
    @property(cc.Node)
    private duckNode : cc.Node = null;
    @property(cc.Node)
    private touchSpine : cc.Node = null;
    private bg : cc.Node = null;
    private touchNode : cc.Node = null;
    private laba : cc.Node = null;
    private parentNode : cc.Node = null;
    private tuopanNode : cc.Node = null;
    private gridNode : cc.Node = null;
    private types : number = 0;
    private answerArr : number[] = [];
    private touchTarget : any = null;
    private touchRight : boolean = false;
    private overNum : number = 0;
    private rightNum : number = 0;
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [

        ],
        result: 4
    }
    onLoad() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.eventvalue.levelData.push({
            subject: [],
            answer: [],
            result: 4
        });
    }

    start() {
        
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
            this.types = DaAnData.getInstance().types;
            this.initGame();
        }else {
            this.getNet();
        }
    }

    initGame() {
        if(this.types == 1) {
            this.fruitNode.active = true;
            this.parentNode = this.fruitNode;
            this.touchNode = this.touchSprite;
            this.answerArr = [1,3,5,2,8,7,6,4,0];
            this.eventvalue.levelData[0].answer = [...this.answerArr];
            this.eventvalue.levelData[0].subject = [-1,-1,-1,-1,8,-1,-1,-1,-1];
        }else if(this.types == 2) {
            this.vegetableNode.active = true;
            this.parentNode = this.vegetableNode;
            this.touchNode = this.touchSprite;
            this.answerArr = [1,3,5,8,2,7,4,0,6];
            this.eventvalue.levelData[0].answer = [...this.answerArr];
            this.eventvalue.levelData[0].subject = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        }else if(this.types == 3) {
            this.directionNode.active = true;
            this.parentNode = this.directionNode;
            this.touchNode = this.touchSpine;
            this.answerArr = [6,6,1,5,6,4,6,6,2,0,3,6,6,6,6,6];
            this.eventvalue.levelData[0].answer = [...this.answerArr];
            this.eventvalue.levelData[0].subject = [6,6,-1,-1,6,-1,6,6,-1,-1,-1,6,6,6,6,6];
        }
        if(this.parentNode) {
            if(this.types == 1) {
                this.gridNode = this.parentNode.getChildByName('carNode').getChildByName('gridNode');
                this.tuopanNode = this.parentNode.getChildByName('tuopanNode');
                this.initFruit();
            }else if(this.types == 2) {
                this.gridNode = this.parentNode.getChildByName('carNode').getChildByName('gridNode');
                this.tuopanNode = this.parentNode.getChildByName('tuopanNode');
                this.initVegetable();
            }else if(this.types == 3) {
                this.gridNode = this.parentNode.getChildByName('leftNode').getChildByName('gridNode');
                this.tuopanNode = this.parentNode.getChildByName('rightNode').getChildByName('tuopanNode');
                this.initDirection();
            }
            this.bg = this.parentNode.getChildByName('bg');
            this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.isOver != 1) {
                    this.isOver = 2;
                    this.eventvalue.result = 2;
                    this.eventvalue.levelData[0].result = 2;
                }
            });
        }
        this.addListenerOnItem();
    }


    initFruit() {
        AudioManager.getInstance().playSound('sfx_kpbopn', false);
        let car = this.fruitNode.getChildByName('carNode');
        for(let i = 0; i < this.tuopanNode.children.length; i++) {
            this.tuopanNode.children[i].scale = 0;
        }
        car.setPosition(cc.v2(-1250, 0));
        car.runAction(cc.moveBy(0.8, cc.v2(1250, 0)));
        let bubble = this.fruitNode.getChildByName('bubbleNode');
        bubble.setRotation(80);
        bubble.scale = 0;
        AudioManager.getInstance().playSound('sfx_1stfrt', false);
        for(let i = 0; i < this.answerArr.length; i++) {
            cc.log(this.answerArr[i])
            let seq = cc.sequence(cc.scaleTo(0.56, 1.2,1.2), cc.scaleTo(0.12, 0.8, 0.8), cc.scaleTo(0.12, 1.1,1.1), cc.scaleTo(0.12, 0.9, 0.9), cc.scaleTo(0.24, 1, 1), cc.callFunc(()=>{this.bubbleAction(this.rightNum)}));
            let seq1 = cc.sequence(cc.scaleTo(0.56, 1.2,1.2), cc.scaleTo(0.12, 0.8, 0.8), cc.scaleTo(0.12, 1.1,1.1), cc.scaleTo(0.12, 0.9, 0.9), cc.scaleTo(0.24, 1, 1));
            if(this.answerArr[i] != 8) {
                setTimeout(() => {
                    if(i == this.answerArr.length-1) {
                        this.tuopanNode.children[this.answerArr[i]].runAction(seq);
                    }else {
                        this.tuopanNode.children[this.answerArr[i]].runAction(seq1);
                    }
                }, 40* i);
            }
        }
    }

    bubbleAction(rightNum :number) {
        let bubble = this.parentNode.getChildByName('bubbleNode');
        var str = '';
        if(this.types == 1) {
            switch(rightNum) {
                case 0:
                    str = '橘子在香蕉上方';
                    break;
                case 1:
                    str = '梨在香蕉的右上方';
                    break;
                case 2:
                    str = '桃子在香蕉的左面，苹果的上面';
                    break;
                case 4:
                    str = '桃子在西瓜的左上方';
                    break;
                case 5:
                    str = '葡萄和梨不相邻';
                    break;
                case 6:
                    str = '橘子在草莓的后面';
                    break;
                case 7:
                    str = '最后一个水果放在哪里？';
                    break;
                default:
                    return;
                    break;
            }
        }else if(this.types == 2) {
            switch(rightNum) {
                case 0:
                    str = '土豆在最中央的位置';
                    break;
                case 1:
                    str = '黄瓜在土豆的左面';
                    break;
                case 2:
                    str = '西红柿在黄瓜的右下方';
                    break;
                case 3:
                    str = '西兰花在西红柿的右面，南瓜的下面';
                    break;
                case 5:
                    str = '菠菜在土豆的上方，白菜的右面';
                    break;
                case 7:
                    str = '大蒜和菠菜不相邻';
                    break;
                case 8:
                    str = '最后一个蔬菜放在哪里？';
                    break;
                default:
                    return;
                    break;
            }
        }
       
        bubble.getChildByName('label').getComponent(cc.Label).string = str;
        bubble.setRotation(80);
        bubble.scale = 0;
        let spaw1 = cc.spawn(cc.rotateTo(0.16, -13), cc.scaleTo(0.16, 1.2, 1.2));
        let spaw2 = cc.spawn(cc.rotateTo(0.12, 6), cc.scaleTo(0.12, 0.9, 0.9));
        let spaw3 = cc.spawn(cc.rotateTo(0.12, -6), cc.scaleTo(0.12, 1.1, 1.1));
        let spaw4 = cc.spawn(cc.rotateTo(0.28, 0), cc.scaleTo(0.12, 1, 1));
        let delay =cc.delayTime(5);
        let spaw5 = cc.spawn(cc.rotateTo(0.28, 78), cc.scaleTo(0.28, 0, 0));
        let seq = cc.sequence(spaw1, spaw2, spaw3, spaw4, delay, spaw5);
        bubble.stopAllActions();
        bubble.runAction(seq);
    }

    initVegetable() {
        AudioManager.getInstance().playSound('sfx_kpbopn', false);
        let car = this.vegetableNode.getChildByName('carNode');
        for(let i = 0; i < this.tuopanNode.children.length; i++) {
            this.tuopanNode.children[i].scale = 0;
        }
        car.setPosition(cc.v2(-1250, 0));
        car.runAction(cc.moveBy(0.8, cc.v2(1250, 0)));
        let bubble = this.vegetableNode.getChildByName('bubbleNode');
        bubble.setRotation(80);
        bubble.scale = 0;  
        AudioManager.getInstance().playSound('sfx_1stfrt', false);                          
        for(let i = 0; i < this.answerArr.length; i++) {
            let seq = cc.sequence(cc.scaleTo(0.56, 1.2,1.2), cc.scaleTo(0.12, 0.8, 0.8), cc.scaleTo(0.12, 1.1,1.1), cc.scaleTo(0.12, 0.9, 0.9), cc.scaleTo(0.24, 1, 1), cc.callFunc(()=>{this.bubbleAction(this.rightNum)}));
            let seq1 = cc.sequence(cc.scaleTo(0.56, 1.2,1.2), cc.scaleTo(0.12, 0.8, 0.8), cc.scaleTo(0.12, 1.1,1.1), cc.scaleTo(0.12, 0.9, 0.9), cc.scaleTo(0.24, 1, 1));
            if(this.types == 1) {
                if(this.answerArr[i] != 8) {
                    setTimeout(() => {
                        if(i == this.answerArr.length-1) {
                            this.tuopanNode.children[this.answerArr[i]].runAction(seq);
                        }else {
                            this.tuopanNode.children[this.answerArr[i]].runAction(seq1);
                        }
                    }, 40* i);
                }
            }else if(this.types == 2) {
                setTimeout(() => {
                    if(i == this.answerArr.length-1) {
                        this.tuopanNode.children[this.answerArr[i]].runAction(seq);
                    }else {
                        this.tuopanNode.children[this.answerArr[i]].runAction(seq1);
                    }
                }, 40* i);
            }           
        }
    }

    initDirection() {
        AudioManager.getInstance().playSound('sfx_txopn2',false);
        let left = this.directionNode.getChildByName('leftNode');
        let right = this.directionNode.getChildByName('rightNode');
        this.laba = right.getChildByName('laba');
        this.laba.opacity = 0;
        left.opacity = 100;
        right.opacity = 0;
        left.setPosition(cc.v2(-1500, 0));
        right.setPosition(cc.v2(1500, 0));
        let spaw1 = cc.spawn(cc.moveBy(1.9, cc.v2(0,12)), cc.rotateBy(1.9, -5));
        let spaw2 = cc.spawn(cc.moveBy(2.4, cc.v2(0,-12)), cc.rotateBy(2.4, 5));
        let seq = cc.sequence(spaw1, spaw2);
        let loop = cc.repeatForever(seq);
        this.duckNode.runAction(loop);
        let seq1 = cc.sequence(cc.spawn(cc.moveBy(1.5, cc.v2(-1500, 0)), cc.fadeIn(1.5)), cc.callFunc(()=>{this.laba.runAction(cc.fadeIn(0.8))}));
        left.runAction(cc.spawn(cc.moveBy(1.5, cc.v2(1500, 0)), cc.fadeIn(1.5)));
        right.runAction(seq1);
    
    }

    addListenerOnItem() {
        for(let i = 0; i < this.tuopanNode.children.length; i++) {
            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget) {
                    return;
                }
                this.touchTarget = e.target;
                e.target.opacity = 0;
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.active = true;
                this.touchNode.zIndex = 100;
                this.touchNode.setPosition(point);
                this.touchNode.scale = e.target.scale - 0.1;
                if(this.types == 3) {
                    this.touchNode.getComponent(sp.Skeleton).skeletonData = e.target.getComponent(sp.Skeleton).skeletonData;
                    this.touchNode.getComponent(sp.Skeleton).setAnimation(0, 'drag', true);
                }else {
                    AudioManager.getInstance().playSound('sfx_ctchfrt', false);
                    this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.children[0].getComponent(cc.Sprite).spriteFrame;
                }
            });


            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                for(let j = 0; j < this.gridNode.children.length; j++) {
                    if(this.gridNode.children[j].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                        for(let k = 0; k < this.gridNode.children.length; k ++) {
                            if(k != j) {
                                if(this.types == 3) {
                                    this.gridNode.children[k].getChildByName('red').active = false;
                                    this.gridNode.children[k].getChildByName('white').active = false;
                                }else { 
                                    if(this.gridNode.children[i].getChildByName('box').active) {
                                        this.gridNode.children[k].getChildByName('box').active = false;
                                    }
                                }
                            }
                        }
                        if(this.types == 3) {
                            if(i == this.answerArr[j]) {
                                this.gridNode.children[j].getChildByName('white').active = true;
                            }else {
                                this.gridNode.children[j].getChildByName('red').active = true;
                            }
                        }else {
                            this.gridNode.children[j].getChildByName('box').active = true;
                        }
                        this.overNum++;
                    }
                }
                if(this.overNum == 0) {
                    for(let k = 0; k < this.gridNode.children.length; k++) {
                        if(this.types == 3) {
                            this.gridNode.children[k].getChildByName('red').active = false;
                            this.gridNode.children[k].getChildByName('white').active = false;
                        }else {
                            this.gridNode.children[k].getChildByName('box').active = false;
                        }
                    }
                }else {
                    this.overNum = 0;
                }
            });
            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
                }
                this.touchNode.active = false;
                e.target.opacity = 255;
                this.touchTarget = null;

            });


            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
                }
                for(let j = 0; j < this.gridNode.children.length; j++) {
                    if(this.gridNode.children[j].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(i == this.answerArr[j]) {
                            
                            this.eventvalue.levelData[0].subject[j] = i;
                            this.gridNode.children[j].getChildByName('sprite').active = true; 
                            this.touchRight = true;
                            this.rightNum++;
                            if(this.types != 3) {
                                this.bubbleAction(this.rightNum);
                                AudioManager.getInstance().playSound('sfx_putfrt', false);
                            }else {
                                AudioManager.getInstance().playSound('sfx_kdmtched', false);
                            }
                            this.isRight();
                        }
                    }
                }
                if(!this.touchRight) {
                    if(this.types == 3) {
                        AudioManager.getInstance().playSound('sfx_kdclck', false);
                    }else {
                        AudioManager.getInstance().playSound('sfx_erro', false);
                    } 
                    e.target.opacity = 255;
                    if(this.types == 3) {
                        e.target.getComponent(sp.Skeleton).setAnimation(0,'drag_end', false);
                        e.target.getComponent(sp.Skeleton).setCompleteListener(
                            trackEntry=>{
                                if(trackEntry.animation.name == 'drag_end') {
                                    if(e.target.getComponent(sp.Skeleton).findAnimation('cry')) {
                                        e.target.getComponent(sp.Skeleton).setAnimation(0, 'cry', false);
                                        e.target.getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                                            if(trackEntry.animation.name == 'cry') {
                                                e.target.getComponent(sp.Skeleton).setAnimation(0, 'idle', true);
                                            }
                                        });
                                    }else {
                                        e.target.getComponent(sp.Skeleton).setAnimation(0, 'idle', true);
                                    }
                                }
                            }
                        );
                    }
                }
                
                for(let i = 0; i < this.gridNode.children.length; i ++) {
                    if(this.types == 3) {
                        if(this.gridNode.children[i].getChildByName('red').active) {
                            this.gridNode.children[i].getChildByName('red').active = false;
                        }
                        if(this.gridNode.children[i].getChildByName('white').active) {
                            this.gridNode.children[i].getChildByName('white').active = false;
                        }
                    }else {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            this.gridNode.children[i].getChildByName('box').active = false;
                        }
                    }
                    
                }
                this.touchRight = false;
                this.touchNode.active = false;
                this.touchTarget = null;
            });

        }
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    isRight() {
        if(this.types == 1) {
            if(this.rightNum == 8) {
                this.eventvalue.levelData[0].result = 1;
                this.eventvalue.result = 1;
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                DaAnData.getInstance().submitEnable = true;
                UIHelp.showOverTip(2);
            }
        }else if(this.types == 2) {
            if(this.rightNum == 9) {
                this.eventvalue.levelData[0].result = 1;
                this.eventvalue.result = 1;
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                DaAnData.getInstance().submitEnable = true;
                UIHelp.showOverTip(2);
            }
        }else if(this.types == 3) {
            if(this.rightNum == 6) {
                this.eventvalue.levelData[0].result = 1;
                this.eventvalue.result = 1;
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                DaAnData.getInstance().submitEnable = true;
                UIHelp.showOverTip(2);
            }
        }
    
    }

    setPanel() {

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
                    if(content.types) {
                        this.types = content.types;
                    }else {
                        console.log('getNet中返回types的值为空');
                    }
                    this.initGame();
                }
            } else {
    
            }
        }.bind(this), null);
    }
}
