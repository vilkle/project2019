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
    private touchNode : cc.Node = null;
    @property(cc.Node)
    private
    private parentNode : cc.Node = null;
    private tuopanNode : cc.Node = null;
    private gridNode : cc.Node = null;
    private types : number = 0;
    private answerArr : number[] = [];
    private touchTarget : any = null;


    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        if(ConstValue.IS_TEACHER) {
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
            this.answerArr = [1,3,5,2,8,7,6,4,0];
            this.initFruit();
        }else if(this.types == 2) {
            this.vegetableNode.active = true;
            this.parentNode = this.vegetableNode;
            this.answerArr = [1,3,5,8,2,7,4,0,6];
            this.initVegetable();
        }else if(this.types == 3) {
            this.directionNode.active = true;
            this.parentNode = this.directionNode;
            this.initDirection();
        }
        if(this.parentNode) {
            // this.gridNode = this.parentNode.getChildByName('gridNode');
            // this.tuopanNode = this.parentNode.getChildByName('tuopanNode');
        }
        //this.addListenerOnItem();
    }

    initFruit() {

    }

    initVegetable() {

    }

    initDirection() {

    }

    addListenerOn() {
        for(let i = 0; i < this.tuopanNode.children.length; i++) {
            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget) {
                    return;
                }
                this.touchTarget = e.target;
                this.touchNode.active = true;
                this.touchNode.zIndex = 100;
                e.target.opacity = 0;
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                this.touchNode.scale = e.target.scale - 0.1;
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;

            });
            this.tuopanNode.children[i].on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                if(this.gridNode.children[0].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 0) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[0].getChildByName('box').active = true;
                }else if(this.gridNode.children[1].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 1) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[1].getChildByName('box').active = true;
                }else if(this.gridNode.children[2].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 2) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[2].getChildByName('box').active = true;
                }else if(this.gridNode.children[3].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 3) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[3].getChildByName('box').active = true;
                }else if(this.gridNode.children[4].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 4) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[4].getChildByName('box').active = true;
                }else if(this.gridNode.children[5].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 5) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[5].getChildByName('box').active = true;
                }else if(this.gridNode.children[6].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 6) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[6].getChildByName('box').active = true;
                }else if(this.gridNode.children[7].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 7) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[7].getChildByName('box').active = true;
                }else if(this.gridNode.children[8].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            if(i != 8) {
                                this.gridNode.children[i].getChildByName('box').active = false;
                            }
                        }
                    }
                    this.gridNode.children[8].getChildByName('box').active = true;
                }else {
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            this.gridNode.children[i].getChildByName('box').active = false;
                        }
                    }
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
                if(this.gridNode.children[0].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[0]) {
                       this.gridNode.children[0].getChildByName('sprite').active = true; 
                    }
                }else if(this.gridNode.children[1].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[1]) {
                        this.gridNode.children[1].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[2].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[2]) {   
                        this.gridNode.children[2].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[3].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[3]) {
                        this.gridNode.children[3].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[4].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[4]) {
                        this.gridNode.children[4].getChildByName('sprite').active = true;
                    }   
                }else if(this.gridNode.children[5].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[5]) {
                        this.gridNode.children[5].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[6].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[6]) {
                        this.gridNode.children[6].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[7].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[7]) {
                        this.gridNode.children[7].getChildByName('sprite').active = true;
                    }
                }else if(this.gridNode.children[8].getBoundingBox().contains(this.gridNode.convertToNodeSpaceAR(e.currentTouch))) {
                    if(i == this.answerArr[8]) {
                        this.gridNode.children[8].getChildByName('sprite').active = true;
                    }
                }else {
                    e.target.opacity = 255;
                    this.touchNode.active = false;
                    for(let i = 0; i < this.gridNode.children.length; i ++) {
                        if(this.gridNode.children[i].getChildByName('box').active) {
                            this.gridNode.children[i].getChildByName('box').active = false;
                        }
                    }
                }
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
