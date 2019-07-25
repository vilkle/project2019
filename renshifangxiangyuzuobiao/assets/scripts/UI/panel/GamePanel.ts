import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
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


    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        if(ConstValue.IS_TEACHER) {
            this.types = DaAnData.getInstance().types;
            cc.log('=-=-=0=0=0', DaAnData.getInstance().types);
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
        }else if(this.types == 2) {
            this.vegetableNode.active = true;
            this.parentNode = this.vegetableNode;
            this.touchNode = this.touchSprite;
            this.answerArr = [1,3,5,8,2,7,4,0,6];
        }else if(this.types == 3) {
            this.directionNode.active = true;
            this.parentNode = this.directionNode;
            this.touchNode = this.touchSpine;
            this.answerArr = [6,6,1,5,6,4,6,6,2,0,3,6,6,6,6,6];
        }

        cc.log('----------', this.types)
        if(this.parentNode) {
            if(this.types == 1) {
                this.gridNode = this.parentNode.getChildByName('carNode').getChildByName('gridNode');
                this.tuopanNode = this.parentNode.getChildByName('tuopanNode');
                cc.log('=====',this.parentNode, this.tuopanNode);
                this.initFruit();
            }else if(this.types == 2) {

                this.initVegetable();
            }else if(this.types == 3) {
                this.gridNode = this.parentNode.getChildByName('leftNode').getChildByName('gridNode');
                this.tuopanNode = this.parentNode.getChildByName('rightNode').getChildByName('tuopanNode');
                this.initDirection();
            }
        }
        //cc.log('---tuopanNode', this.tuopanNode.children);
        //this.addListenerOnItem();
    }

    initFruit() {
        let car = this.fruitNode.getChildByName('carNode');
        for(let i = 0; i < this.tuopanNode.children.length; i++) {
            this.tuopanNode.children[i].scale = 0;
        }
        car.setPosition(cc.v2(-1250, 0));
        car.runAction(cc.moveBy(0.8, cc.v2(1250, 0)));
        cc.log(this.tuopanNode.children);
        for(let i = 0; i < this.answerArr.length; i++) {
            cc.log(this.answerArr[i])
            let seq = cc.sequence(cc.scaleTo(0.56, 1.2,1.2), cc.scaleTo(0.12, 0.8, 0.8), cc.scaleTo(0.12, 1.1,1.1), cc.scaleTo(0.12, 0.9, 0.9), cc.scaleTo(0.24, 1, 1));
            if(this.answerArr[i] != 8) {
                setTimeout(() => {
                    this.tuopanNode.children[this.answerArr[i]].runAction(seq);
                }, 40* i);
            }
        }
    }

    initVegetable() {

    }

    initDirection() {
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
                        console.log('------i answerArr[j]', i, this.answerArr[j]);
                        if(i == this.answerArr[j]) {
                           this.gridNode.children[j].getChildByName('sprite').active = true; 
                           this.touchRight = true;
                        }
                    }
                }
                if(!this.touchRight) {
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

    onDestroy() {

    }

    onShow() {
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
