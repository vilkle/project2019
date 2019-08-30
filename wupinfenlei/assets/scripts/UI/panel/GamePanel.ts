import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager"
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import {DaAnData} from "../../Data/DaAnData";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";
import Set from "../../collections/Set";
import {OverTips} from '../Item/OverTips'

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node)
    private bg : cc.Node = null;
    @property(cc.Node)
    private progressNode : cc.Node = null;
    @property(cc.Prefab)
    private bigNode : cc.Prefab = null;
    @property(cc.Prefab)
    private smallNode : cc.Prefab = null;
    @property(cc.Prefab)
    private selectPrefab : cc.Prefab = null;
    @property(cc.Button)
    private backButton : cc.Button = null;
    @property(cc.Node)
    private touchNode : cc.Node = null;
    @property(cc.Node)
    private loudSpeaker : cc.Node = null;
    @property(cc.Layout)
    private loudspeakerBox : cc.Layout = null;
    private selectNode : cc.Node = null;
    private types : number = 0;
    private typetype : number[] = [];
    private checkpointsNum : number = 0;
    private typeDataArr : boolean[] = [];
    private sourceSFArr : cc.SpriteFrame[] = [];
    private animalSFArr : cc.SpriteFrame[] = [];
    private foodSFArr : cc.SpriteFrame[] = [];
    private stationerySFArr : cc.SpriteFrame[] = [];
    private clothesSFArr : cc.SpriteFrame[] = [];
    private ItemNodeArr : cc.Node[] = [];
    private AnswerBoardArr : cc.Node[] = [];
    private selectNodeArr : cc.Node[] = [];
    private selectNodeCenterArr : cc.Node[] = [];
    private selectPosArr : cc.Vec2[] = [];
    private answerArr : number[][] = [];
    private answer : number[] = [];
    private answer1 : number[] = [];
    private answer2 : number[] = [];
    private answer3 : number[] = [];
    private answer4 : number[] = [];
    private player1 : number[] = [];
    private player2 : number[] = [];
    private player3 : number[] = [];
    private player4 : number[] = [];
    private typeArr : any[] = [];
    private selectArr : boolean[] = [];
    private finishArr : boolean[] = [];
    private timeOutArr : any[] = [];
    private checkpoint : number = 1;
    private selectType : number = 0;
    private touchTarget : any = null;
    private isOver : number = 0;
    private selectMove : boolean = false;
    private overNum : number = 0;
    private progress: cc.Node = null;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }


    onLoad() {
        if(ConstValue.IS_TEACHER) {
            this.types = DaAnData.getInstance().types;
            this.typetype = DaAnData.getInstance().typetype;
            this.checkpointsNum = DaAnData.getInstance().checkpointsNum;
            this.typeDataArr = DaAnData.getInstance().typeDataArr;
            this.loadSourceSFArr();
            UIManager.getInstance().openUI(UploadAndReturnPanel,null,212);
        }else {
            this.getNet();
        }
    }

    start() {
       
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
            }
            if(this.isOver == 1 && this.types == 2) {
                for(let i = 0; i < this.timeOutArr.length; i++) {
                    clearTimeout(this.timeOutArr[i]);
                }
                for(let i = 0; i < this.selectNodeCenterArr.length; i++) {
                    this.selectNodeCenterArr[i].getChildByName('bubble').stopAllActions();
                    this.selectNodeCenterArr[i].getChildByName('bubble').setScale(0);
                }
            }
        });
        this.loudspeakerBox.node.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.loudSpeaker.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
            AudioManager.getInstance().stopAll();
            AudioManager.getInstance().playSound('把这些物品分类整理，并拖到对应区域内。', false);
        }); 
    }

    loadSourceSFArr() {
        if(this.types == 1) {
            cc.loader.loadResDir("images/gameUI/pic/animal", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        for(let j = 0; j < assets.length-1-i; j++) {
                            let len1 = assets[j].name.length;
                            let str1 = assets[j].name.substring(len1-1, len1);
                            let num1 = parseInt(str1);
                            let len2 = assets[j+1].name.length;
                            let str2 = assets[j+1].name.substring(len2-1, len2);
                            let num2 = parseInt(str2);
                            if(num1 > num2) {
                                let temp = assets[j+1];
                                assets[j+1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for(let i = 0; i < assets.length; i++) {
                        this.animalSFArr.push(assets[i]);
                        if(this.animalSFArr.length+this.foodSFArr.length+this.stationerySFArr.length+this.clothesSFArr.length == 20) {
                            this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/food", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        for(let j = 0; j < assets.length-1-i; j++) {
                            let len1 = assets[j].name.length;
                            let str1 = assets[j].name.substring(len1-1, len1);
                            let num1 = parseInt(str1);
                            let len2 = assets[j+1].name.length;
                            let str2 = assets[j+1].name.substring(len2-1, len2);
                            let num2 = parseInt(str2);
                            if(num1 > num2) {
                                let temp = assets[j+1];
                                assets[j+1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for(let i = 0; i < assets.length; i++) {
                        this.foodSFArr.push(assets[i]);
                        if(this.animalSFArr.length+this.foodSFArr.length+this.stationerySFArr.length+this.clothesSFArr.length == 20) {
                            this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/stationery", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        for(let j = 0; j < assets.length-1-i; j++) {
                            let len1 = assets[j].name.length;
                            let str1 = assets[j].name.substring(len1-1, len1);
                            let num1 = parseInt(str1);
                            let len2 = assets[j+1].name.length;
                            let str2 = assets[j+1].name.substring(len2-1, len2);
                            let num2 = parseInt(str2);
                            if(num1 > num2) {
                                let temp = assets[j+1];
                                assets[j+1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for(let i = 0; i < assets.length; i++) {
                        this.stationerySFArr.push(assets[i]);
                        if(this.animalSFArr.length+this.foodSFArr.length+this.stationerySFArr.length+this.clothesSFArr.length == 20) {
                            this.setPanel();
                        }
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/clothes", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        for(let j = 0; j < assets.length-1-i; j++) {
                            let len1 = assets[j].name.length;
                            let str1 = assets[j].name.substring(len1-1, len1);
                            let num1 = parseInt(str1);
                            let len2 = assets[j+1].name.length;
                            let str2 = assets[j+1].name.substring(len2-1, len2);
                            let num2 = parseInt(str2);
                            if(num1 > num2) {
                                let temp = assets[j+1];
                                assets[j+1] = assets[j];
                                assets[j] = temp;
                            }
                        }
                    }
                    for(let i = 0; i < assets.length; i++) {
                        this.clothesSFArr.push(assets[i]);
                        if(this.animalSFArr.length+this.foodSFArr.length+this.stationerySFArr.length+this.clothesSFArr.length == 20) {
                            this.setPanel();
                        }
                    }
                }
            });
            
        }else if(this.types == 2) {
            if(this.typetype[0] == 1) {
                cc.loader.loadResDir("images/gameUI/pic/cookies", cc.SpriteFrame, (err, assets, urls)=>{
                    if(!err) {
                        for(let i = 0; i < assets.length; i++) {
                            for(let j = 0; j < assets.length-1-i; j++) {
                                let len1 = assets[j].name.length;
                                let str1 = assets[j].name.substring(len1-1, len1);
                                let num1 = parseInt(str1);
                                let len2 = assets[j+1].name.length;
                                let str2 = assets[j+1].name.substring(len2-1, len2);
                                let num2 = parseInt(str2);
                                if(num1 > num2) {
                                    let temp = assets[j+1];
                                    assets[j+1] = assets[j];
                                    assets[j] = temp;
                                }
                            }
                        }
                        for(let i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                            if(this.sourceSFArr.length == 9) { 
                                this.setPanel();
                            }
                        }
                    }
                });
            }else if(this.typetype[0] == 2) {
                cc.loader.loadResDir("images/gameUI/pic/figure", cc.SpriteFrame, (err, assets, urls)=>{
                    if(!err) {
                        for(let i = 0; i < assets.length; i++) {
                            for(let j = 0; j < assets.length-1-i; j++) {
                                let len1 = assets[j].name.length;
                                let str1 = assets[j].name.substring(len1-1, len1);
                                let num1 = parseInt(str1);
                                let len2 = assets[j+1].name.length;
                                let str2 = assets[j+1].name.substring(len2-1, len2);
                                let num2 = parseInt(str2);
                                if(num1 > num2) {
                                    let temp = assets[j+1];
                                    assets[j+1] = assets[j];
                                    assets[j] = temp;
                                }
                            }
                        }
                        for(let i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                            if(this.sourceSFArr.length== 9) {
                               this.setPanel();
                            }
                        }
                    }
                });
            }
        }
       
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting.isRepeatReport = false;
        }
        if(this.eventvalue.isResult == 1) {
            this.isOver = 1;
        }else {
            if(this.eventvalue.levelData.length == 0) {
                this.isOver = 0;
            }
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {
        if(this.types==1) {
            for(let i = 0; i < 5; i++) {
                this.sourceSFArr[i] = this.animalSFArr[i];
                this.sourceSFArr[5+i] = this.foodSFArr[i];
                this.sourceSFArr[10+i] = this.stationerySFArr[i];
                this.sourceSFArr[15+i] = this.clothesSFArr[i];
            }
            for(let i = 0; i < this.checkpointsNum; i++) {
                this.finishArr.push(false);
            }
        }
        for(let i = 0; i < this.checkpointsNum; i++) {
            this.eventvalue.levelData.push({
                subject: [],
                answer: [],
                result: 4
            });
        }
        this.initAnswerArr(1);
    }

    initAnswerArr(checkpoint:number) {
        if(this.types == 1) {
            var long = 20;
        }else if(this.types == 2) {
            var long = 27;
        }
        this.answer = [];
        for(let i = 0; i < this.checkpointsNum; i++) {
            for(let j = i*long; j < (i+1)*long; j++) {
                if(this.typeDataArr[j]) {
                    this.answer.push(j);
                }
            }
        }
        
        if(this.types ==1) {
            this.answer = [];
            for(let j = (checkpoint-1)*long; j < checkpoint*long; j++) {
                if(this.typeDataArr[j]) {
                    this.answer.push(j);
                }
            }
        }
        //开始初始化
        this.progressBar(checkpoint, this.checkpointsNum);
        this.createItem(checkpoint);
        this.postItem();
    }

    setTag(item : cc.Node, tagName : string, size ?:number, rotation ?: number) {
        let big = item.getChildByName('bigTag').getChildByName(tagName);
        let small = item.getChildByName('smallTag').getChildByName(tagName);
        if(size) {
            big.setScale(size);
            small.setScale(size);
        }
        if(rotation) {
            big.angle = rotation
            small.angle = rotation
        }
        if(big) {
            big.active = true;
        }
        if(small) {
            small.active = true;
        }
    }

    centerSelectNode() {
        for(let i = 0; i < 3; i++) {
            if(this.selectNodeArr[i]) {
                this.selectNodeCenterArr.push(this.selectNodeArr[i]);
            }
        }
        let num = this.selectNodeCenterArr.length;
        let space = 600;
        let long = (num - 1)*space;
        let starX =  - long/2;
        AudioManager.getInstance().playSound('sfx_casemove', false);
        for(let i = 0; i < num; i++) {
            this.selectNodeCenterArr[i].setPosition(cc.v2(starX + i * space - 2000, -300));
            this.selectPosArr[i] = cc.v2(starX + i * space - 2000, -300);
            setTimeout(() => {
                this.selectNodeCenterArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
            }, 100* (num-1-i));
        }
    }
s
    createSelectBoard() {
        this.finishArr = [false , true ,false];
        this.selectNode = cc.instantiate(this.selectPrefab);
        this.selectNode.setPosition(cc.v2(0,0));
        cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.selectNode);
        this.selectNodeArr = [];
        if(this.checkColor(this.checkpoint) > 1) {
            this.selectNode.getChildByName('colorNode').active = true;
            this.selectNode.getChildByName('colorNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[0] = true;
            this.finishArr[0] = false;
            this.selectNodeArr[0] = this.selectNode.getChildByName('colorNode');
        }else {
            this.selectNode.getChildByName('colorNode').active = false;
            this.selectArr[0] = false;
            this.finishArr[0] = true;
        }
        if(this.checkFigure(this.checkpoint) > 1) {
            this.selectNode.getChildByName('figureNode').active = true;
            this.selectNode.getChildByName('figureNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[1] = true;
            this.finishArr[1] = false;
            this.selectNodeArr[1] = this.selectNode.getChildByName('figureNode');
        }else {
            this.selectNode.getChildByName('figureNode').active = false;
            this.selectArr[1] = false;
            this.finishArr[1] = true;
        }
        if(this.checkSize(this.checkpoint) > 1) {
            this.selectNode.getChildByName('sizeNode').active = true;
            this.selectNode.getChildByName('sizeNode').getChildByName('bubble').scaleX = 0;
            this.selectArr[2] = true;
            this.finishArr[2] = false;
            this.selectNodeArr[2] = this.selectNode.getChildByName('sizeNode');
        }else {
            this.selectNode.getChildByName('sizeNode').active = false;
            this.selectArr[2] = false;
            this.finishArr[2] = true;
        } 
        this.centerSelectNode();
        for(let i = 0; i < this.selectNode.children.length; i++) {
            this.selectNode.children[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.selectMove) {
                    return;
                }
                if(this.finishArr[i]) {
                    if(this.isOver == 1 && this.types == 2) {
                        for(let k = 0; k < this.timeOutArr.length; k++) {
                            clearTimeout(this.timeOutArr[i]);
                        }
                    }
                    this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, true, true), false);
                    this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                        if(trackEntry.animation.name == this.getSelectAnimationName(i, true, true)) {
                            this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, true, false), true);
                        }
                    });
                    if( this.selectNode.children[i].getChildByName('bubble').scale == 1) {
                        this.selectNode.children[i].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0,0));
                    }else{
                        for(let j = 0; j < 3; j ++) {
                            if(this.selectNodeArr[j]) {
                                if(this.selectNodeArr[j].getChildByName('bubble').scale != 0) {
                                    this.selectNodeArr[j].getChildByName('bubble').stopAllActions()
                                    this.selectNodeArr[j].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0,0));
                                }
                            }
                        }
                        this.selectNode.children[i].getChildByName('bubble').runAction(cc.scaleTo(0.3, 1,1));
                        this.selectNode.children[i].getChildByName('fireworks').opacity = 255;
                        AudioManager.getInstance().playSound('sfx_flowerfly', false);
                        this.selectNode.children[i].getChildByName('fireworks').getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
                        this.selectNode.children[i].getChildByName('fireworks').getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                            if(trackEntry.animation.name == 'animation') {
                                this.selectNode.children[i].getChildByName('fireworks').opacity = 0;
                            }
                        });
                    }
                    if(this.isOver == 1 && this.types == 2) {
                        for(let k = 0; k < this.timeOutArr.length; k++) {
                            clearTimeout(this.timeOutArr[i]);
                        }
                    }
                }else {
                    this.selectMove = true;
                    this.selectType = i + 1;
                    if(this.selectType == 1) {
                        AudioManager.getInstance().playSound('sfx_selogic', false);
                    }else if(this.selectType == 2) {
                        AudioManager.getInstance().playSound('sfx_seneo', false);
                    }else if(this.selectType == 3) {
                        AudioManager.getInstance().playSound('sfx_semia', false);
                    }
                    for(let j = 0; j < 3; j ++) {
                        if(this.selectNodeArr[j]) {
                            if(this.selectNodeArr[j].getChildByName('bubble').scale == 1) {
                                this.selectNodeArr[j].getChildByName('bubble').runAction(cc.scaleTo(0.3, 0,0));
                            }
                        }
                    }
                    this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, this.finishArr[i], true), false);
                    this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                        if(trackEntry.animation.name == this.getSelectAnimationName(i, false, true)) {
                            this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, this.finishArr[i], false), true);
                            AudioManager.getInstance().playSound('sfx_casemove', false);
                            for(let i = 0; i < this.selectNodeCenterArr.length; i ++) {
                                setTimeout(()=>{
                                    if(i < this.selectNodeCenterArr.length - 1) {
                                        this.selectNodeCenterArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
                                    }else {
                                        this.selectNodeCenterArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(()=>{
                                            this.selectMove = false;
                                            this.createAnswerBoard(this.checkpoint);
                                        })) );
                                    }
                                }, (this.selectNodeCenterArr.length-1-i)*100);     
                            }
                        }
                    });
                }
            });
            this.selectNode.children[i].on(cc.Node.EventType.TOUCH_END, (e)=>{
               
            });
            this.selectNode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
              
            });
        }
    }

     resetSelect() {
        this.selectMove = true;
        this.selectNode.getChildByName('colorNode').stopAllActions();
        this.selectNode.getChildByName('figureNode').stopAllActions();
        this.selectNode.getChildByName('sizeNode').stopAllActions();
        for(let i = 0; i < this.selectNodeCenterArr.length; i++) {
            this.selectNodeCenterArr[i].setPosition(cc.v2(this.selectPosArr[i].x, -300));
        }

        this.selectNode.active = true;
        AudioManager.getInstance().playSound('sfx_casemove', false);
        for(let i = 0; i < this.selectNodeCenterArr.length; i++) {
            if(this.finishArr[i]) {
                if(this.selectNodeCenterArr[i].active) {
                    this.selectNodeCenterArr[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, true, false), true);
                } 
            }else {
                if(this.selectNodeCenterArr[i].active) {
                    this.selectNodeCenterArr[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, false, false), true);
                }  
            }
            setTimeout(()=>{
                if(this.selectNodeCenterArr[i].active) {
                    if(i == this.selectNodeCenterArr.length-1) {
                        this.selectNodeCenterArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(()=>{
                            this.selectMove = false;
                            if(this.isOver == 1) {
                                this.showHow();
                            }
                        })));
                    }else {
                        this.selectNodeCenterArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(()=>{
                            this.selectMove = false;
                        })));
                    }
                }
            },100*(this.selectNodeCenterArr.length-1-i));
        }
    }

    showHow() {
        for(let i = 0; i < this.selectNodeCenterArr.length; i++) { 
            let index = setTimeout(() => {
                this.selectNodeCenterArr[i].getChildByName('bubble').runAction(cc.sequence(cc.scaleTo(0.3, 1,1), cc.delayTime(1), cc.scaleTo(0.3, 0, 0)) );
                this.selectNodeCenterArr[i].getChildByName('fireworks').opacity = 255;
                AudioManager.getInstance().playSound('sfx_flowerfly', false);
                this.selectNodeCenterArr[i].getChildByName('fireworks').getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
                this.selectNodeCenterArr[i].getChildByName('fireworks').getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                    if(trackEntry.animation.name == 'animation') {
                        this.selectNode.children[i].getChildByName('fireworks').opacity = 0;
                    }
                });
            }, 1600 * i);   
            this.timeOutArr.push(index);
        }
    }

    backButtonCallBack() {
        AudioManager.getInstance().playSound('sfx_casemove', false);
        for(let i = 0; i < this.AnswerBoardArr.length; i++) {
            setTimeout(()=>{
                if(i < this.AnswerBoardArr.length -1) {
                    this.AnswerBoardArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
                }else {
                    this.AnswerBoardArr[i].runAction(cc.sequence(cc.moveBy(0.5, cc.v2(2000, 0)), cc.callFunc(()=>{
                        if(i == this.AnswerBoardArr.length-1) {
                            this.resetSelect();
                            this.removeListenerOnItem();
                            this.player1 = [];
                            this.player2 = [];
                            this.player3 = [];
                            this.player4 = [];
                            this.answerArr = [];
                            this.AnswerBoardArr = [];
                            this.backButton.node.active = false;
                            let len = this.AnswerBoardArr.length;
                            for(let i = 0; i < len; i++) {
                                this.AnswerBoardArr[i].removeFromParent();
                                this.AnswerBoardArr[i].destroy();
                            } 
                        }
                    })));
                }
            }, (this.AnswerBoardArr.length-i-1)*100); 
        }
    }
    
    removeListenerOnItem() {
        for(let i = 0; i < this.ItemNodeArr.length; i++) {
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_START);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_MOVE);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_END);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_CANCEL);
            this.ItemNodeArr[i].parent.opacity = 255;
        }
    }

    addListenerOnItem() {
        for(let i = 0; i < this.ItemNodeArr.length; i++) {
            cc.log(this.ItemNodeArr[i])
            this.ItemNodeArr[i].getChildByName('node').on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget) {
                    return;
                }
                AudioManager.getInstance().playSound('sfx_buttn', false)
                this.touchTarget = e.target;
                this.touchNode.active = true;
                this.touchNode.zIndex = 100;
                e.target.parent.opacity = 0;
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                this.touchNode.setScale(e.target.parent.scale + 0.1);
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;
                this.touchNode.scale = e.target.parent.scale-0.1;
            });
            this.ItemNodeArr[i].getChildByName('node').on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
               if(this.touchTarget != e.target) {
                    return;
               }
               var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
               this.touchNode.setPosition(point);
               for(let i = 0; i < this.AnswerBoardArr.length; i++) {
                    if(this.AnswerBoardArr[i].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[i].convertToNodeSpaceAR(e.currentTouch._point))) {
                        this.AnswerBoardArr[i].getChildByName('box').active = true;
                        for(let j = 0; j < this.AnswerBoardArr.length; j++) {
                            if(j != i) {
                                this.AnswerBoardArr[j].getChildByName('box').active = false;
                            }
                        }
                    }else {
                        this.overNum++;
                    }
                    if(i == this.AnswerBoardArr.length-1) {
                        if(this.overNum == this.AnswerBoardArr.length) {
                            for(let k = 0; k < this.AnswerBoardArr.length; k++) {
                                this.AnswerBoardArr[k].getChildByName('box').active = false;
                            }
                        }
                        this.overNum = 0;
                    }
               }

            });
            this.ItemNodeArr[i].getChildByName('node').on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
               }
                AudioManager.getInstance().playSound('sfx_buttn', false)
                this.touchNode.active = false;
                e.target.parent.opacity = 255;
                this.touchTarget = null;
            });
            this.ItemNodeArr[i].getChildByName('node').on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
                }
                AudioManager.getInstance().playSound('sfx_buttn', false)
                let rightNum = 0;
               if(this.AnswerBoardArr[0]) {
                    if(this.AnswerBoardArr[0].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[0].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.answerArr[0].indexOf(this.answer[i]) != -1) {
                            this.AnswerBoardArr[0].getChildByName('answerNode').children[this.player1.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            this.AnswerBoardArr[0].getChildByName('answerNode').children[this.player1.length].setScale(e.target.parent.scale);
                            if(this.types == 2) {
                                this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer1').children[this.player1.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer1').children[this.player1.length].setScale(e.target.parent.scale/2);
                            }
                            this.player1.push(this.answer[i]);
                            this.touchNode.active = false;
                        }else {
                            if(this.types == 1) {
                                AudioManager.getInstance().stopAll()
                                AudioManager.getInstance().playSound('这好像不是动物哦~', false);
                            }
                            this.touchNode.active = false;
                            e.target.parent.opacity = 255;
                        }
                        this.touchTarget = null;
                        this.eventvalue.levelData[this.checkpoint-1].answer[0] = this.answerArr[0];
                        this.eventvalue.levelData[this.checkpoint-1].subject[0] = this.player1;
                        this.eventvalue.levelData[this.checkpoint-1].result = 2;
                        this.eventvalue.result = 2;
                        rightNum ++;
                    }
               }
               if(this.AnswerBoardArr[1]) {
                   if(this.AnswerBoardArr[1].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[1].convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(this.answerArr[1].indexOf(this.answer[i])  != -1) {
                        this.AnswerBoardArr[1].getChildByName('answerNode').children[this.player2.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                        this.AnswerBoardArr[1].getChildByName('answerNode').children[this.player2.length].setScale(e.target.parent.scale);
                        if(this.types == 2) {
                            this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer2').children[this.player2.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer2').children[this.player2.length].setScale(e.target.parent.scale/2);
                        }
                        this.player2.push(this.answer[i]);
                        this.touchNode.active = false;
                    }else {
                        if(this.types == 1) {
                            AudioManager.getInstance().stopAll()
                            AudioManager.getInstance().playSound('这好像不是食物哦~', false);
                        }
                        this.touchNode.active = false;
                        e.target.parent.opacity = 255;
                    }
                    this.touchTarget = null;
                    this.eventvalue.levelData[this.checkpoint-1].answer[1] = this.answerArr[1];
                    this.eventvalue.levelData[this.checkpoint-1].subject[1] = this.player2;
                    this.eventvalue.levelData[this.checkpoint-1].result = 2;
                    this.eventvalue.result = 2;
                    rightNum ++;
                   }
               }
               if(this.AnswerBoardArr[2]) {
                   if(this.AnswerBoardArr[2].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[2].convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(this.answerArr[2].indexOf(this.answer[i])  != -1) {
                        this.AnswerBoardArr[2].getChildByName('answerNode').children[this.player3.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                        this.AnswerBoardArr[2].getChildByName('answerNode').children[this.player3.length].setScale(e.target.parent.scale);
                        if(this.types == 2) {
                            this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer3').children[this.player3.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer3').children[this.player3.length].setScale(e.target.parent.scale/2);
                        }
                        this.player3.push(this.answer[i]);
                        this.touchNode.active = false;
                    }else {
                        if(this.types == 1) {
                            AudioManager.getInstance().stopAll()
                            AudioManager.getInstance().playSound('这好像不是文具哦~', false);
                        }
                        this.touchNode.active = false;
                        e.target.parent.opacity = 255;
                    }
                    this.touchTarget = null;
                    this.eventvalue.levelData[this.checkpoint-1].answer[2] = this.answerArr[2];
                    this.eventvalue.levelData[this.checkpoint-1].subject[2] = this.player3;
                    this.eventvalue.levelData[this.checkpoint-1].result = 2;
                    this.eventvalue.result = 2;
                    rightNum ++;
                   }
               }
               if(this.AnswerBoardArr[3]) {
                    if(this.AnswerBoardArr[3].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[3].convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.answerArr[3].indexOf(this.answer[i])  != -1) {
                            this.AnswerBoardArr[3].getChildByName('answerNode').children[this.player4.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                            this.AnswerBoardArr[3].getChildByName('answerNode').children[this.player4.length].setScale(e.target.parent.scale);
                            if(this.types == 2) {
                                this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer3').children[this.player3.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                                this.selectNode.children[this.selectType-1].getChildByName('bubble').getChildByName('answer3').children[this.player3.length].setScale(e.target.parent.scale/2);
                            }
                            this.player4.push(this.answer[i]);
                            this.touchNode.active = false;
                        }else {
                            if(this.types == 1) {
                                AudioManager.getInstance().stopAll()
                                AudioManager.getInstance().playSound('这好像不是衣服哦~', false);
                            }
                            this.touchNode.active = false;
                            e.target.parent.opacity = 255;
                        }
                        this.touchTarget = null;
                        this.eventvalue.levelData[this.checkpoint-1].answer[3] = this.answerArr[3];
                        this.eventvalue.levelData[this.checkpoint-1].subject[3] = this.player4;
                        this.eventvalue.levelData[this.checkpoint-1].result = 2;
                        this.eventvalue.result = 2;
                        rightNum ++;
                    }
                }
                if(rightNum == 0){
                    this.touchNode.active = false;
                    e.target.parent.opacity = 255;
                    this.touchTarget = null;
                }
               if(this.isSuccess()) {
                    var finishNum:number = 0;
                    if(this.types == 1) {
                        this.finishArr[this.checkpoint-1] = true;
                    }else if(this.types == 2) {
                        this.finishArr[this.selectType - 1] = true;
                    } 
                    for(let i = 0; i < this.finishArr.length; i++) {
                        if(this.finishArr[i]) {
                            finishNum++;
                        }
                    }
                    if(finishNum == this.finishArr.length) {
                        this.eventvalue.levelData[this.checkpoint-1].result = 1;
                        this.eventvalue.result = 1;
                        this.isOver = 1;
                        this.success();
                    }else {
                        this.eventvalue.levelData[this.checkpoint-1].result = 1;
                        this.nextCheckPoint();
                    }
               }
               for(let k = 0; k < this.AnswerBoardArr.length; k++) {
                this.AnswerBoardArr[k].getChildByName('box').active = false;
                }
            });
        }
    }

    nextCheckPoint() {
        if(this.types == 1) {
            AudioManager.getInstance().stopAll();
            UIHelp.showOverTip(1,'答对啦！你真棒～', '下一关', ()=>{
                AudioManager.getInstance().playSound('答对啦！你真棒~', false);
            }, ()=>{
                AudioManager.getInstance().stopAll();
                this.checkpoint++;
                for(let i = 0; i < this.ItemNodeArr.length; i++) {
                    this.ItemNodeArr[i].removeFromParent();
                    this.ItemNodeArr[i].destroy();
                }
                this.ItemNodeArr = [];
                for(let i = 0; i < this.AnswerBoardArr.length; i++) {
                    this.AnswerBoardArr[i].removeFromParent();
                    this.AnswerBoardArr[i].destroy();
                }
                this.AnswerBoardArr = [];
                this.player1 = [];
                this.player2 = [];
                this.player3 = [];
                this.player4 = [];
                this.answer1 = [];
                this.answer2 = [];
                this.answer3 = [];
                this.answer4 = [];
                this.answerArr = [];
                this.initAnswerArr(this.checkpoint);
                UIManager.getInstance().closeUI(OverTips);
            });
        }else if(this.types == 2) {
            AudioManager.getInstance().stopAll();
            UIHelp.showOverTip(1,'做对啦！你真棒！试试其他办法吧～','再试试',()=>{
                AudioManager.getInstance().playSound('做对啦！你真棒！试试其他办法吧~', false);
            },()=>{
                this.backButtonCallBack();
                UIManager.getInstance().closeUI(OverTips);
            });
        }
    }

    success() {
        DaAnData.getInstance().submitEnable = true;
         DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        if(this.types == 1) {
            AudioManager.getInstance().stopAll()
            this.progressBar(this.checkpointsNum, this.checkpointsNum);
            UIHelp.showOverTip(2, '闯关成功，你真棒～', '重玩一次', ()=>{
                AudioManager.getInstance().playSound('闯关成功，你真棒~', false);
            }, ()=>{
                this.checkpoint = 1;
                for(let i = 0; i < this.ItemNodeArr.length; i++) {
                    this.ItemNodeArr[i].removeFromParent();
                    this.ItemNodeArr[i].destroy();
                }
                this.ItemNodeArr = [];
                for(let i = 0; i < this.AnswerBoardArr.length; i++) {
                    this.AnswerBoardArr[i].removeFromParent();
                    this.AnswerBoardArr[i].destroy();
                }
                this.AnswerBoardArr = [];
                this.player1 = [];
                this.player2 = [];
                this.player3 = [];
                this.player4 = [];
                this.answer1 = [];
                this.answer2 = [];
                this.answer3 = [];
                this.answer4 = [];
                this.answerArr = [];
                this.finishArr = [];
                this.setPanel();
                UIManager.getInstance().closeUI(OverTips);
            });
        }else if(this.types == 2) {
            AudioManager.getInstance().stopAll()
            UIHelp.showOverTip(2,'你真棒！等等还没做完的同学吧','看看结果',()=>{ 
                AudioManager.getInstance().playSound('闯关成功，你真棒~', false);
            },()=>{
                this.backButtonCallBack(); 
                UIManager.getInstance().closeUI(OverTips);
            });
        }
        
    }

    getSelectAnimationName(id : number, finish:boolean, click:boolean):string {
        var name : string;
        if(click) {
            if(finish) {
                if(id == 0) {
                    name = 'luoqi_daan_dianji';
                }else if(id == 1) {
                    name = 'paipai_daan_dianji';
                }else if(id == 2) {
                    name = 'miya_daan_dianji';
                }
            }else {
                if(id == 0) {
                    name = 'luoqi_dianji';
                }else if(id == 1) {
                    name = 'paipai_dianji';
                }else if(id == 2) {
                    name = 'miya_dianji';
                }
            }
        }else {
            if(finish) {
                if(id == 0) {
                    name = 'luoqi_daan_idle';
                }else if(id == 1) {
                    name = 'paipai_daan_idle';
                }else if(id == 2) {
                    name = 'miya_daan_idle';
                }
            }else {
                if(id == 0) {
                    name = 'luoqi_idle';
                }else if(id == 1) {
                    name = 'paipai_idle';
                }else if(id == 2) {
                    name = 'miya_idle';
                }
            }
        }
       
        return name;
    }
    
    addListenerOnSelect() {
        if(this.selectNode) {
            for(let i = 0; i < this.selectNode.children.length; i++) {
                this.selectNode.children[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                    this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, this.finishArr[i], true), false);
                    this.selectNode.children[i].getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                        if(trackEntry.animation.name == this.getSelectAnimationName(i, this.finishArr[i], true)) {
                            this.selectNode.children[i].getComponent(sp.Skeleton).setAnimation(0, this.getSelectAnimationName(i, this.finishArr[i], false), true);
                        }
                    });
                });
        
                this.selectNode.children[i].on(cc.Node.EventType.TOUCH_END, (e)=>{
                    
                });
                this.selectNode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                   
                });
            }
        }
    }

    createAnswerBoard(checkpoint : number) {
        var typeSet = new Set();
        typeSet.clear();
        if(this.types == 1) {
            for(let j = 20 * (checkpoint - 1); j < 20 * checkpoint; j ++) {
                if(this.typeDataArr[j]) {
                    let index = j - 20 * (checkpoint - 1);
                    typeSet.add(Math.floor(index/5));
                }
            }
            for(let i = 0; i < typeSet.size(); i++) {
                let node = cc.instantiate(this.smallNode);
                this.AnswerBoardArr.push(node);
            }   
            this.typeArr = [...typeSet.toArray()];
            for(let i = 0; i < this.typeArr.length; i++) {
                if(this.typeArr[i]==0) {
                    this.setTag(this.AnswerBoardArr[i], 'animal');
                }else if(this.typeArr[i]==1) {
                    this.setTag(this.AnswerBoardArr[i], 'food');
                }else if(this.typeArr[i]==2) {
                    this.setTag(this.AnswerBoardArr[i], 'stationery');
                }else if(this.typeArr[i]==3) {
                    this.setTag(this.AnswerBoardArr[i], 'clothe');
                }
            }
            for(let i = 0; i < this.answer.length; i++) {
                if(this.answer[i] < (this.checkpoint - 1) * 20 + 5) {
                    this.answer1.push(this.answer[i]);
                }else if(this.answer[i] >= (this.checkpoint - 1) * 20 + 5 && this.answer[i] < (this.checkpoint - 1) * 20 + 10) {
                    this.answer2.push(this.answer[i]);
                }else if(this.answer[i] >= (this.checkpoint - 1) * 20 + 10 && this.answer[i] < (this.checkpoint - 1) * 20 + 15) {
                    this.answer3.push(this.answer[i]);
                }else if(this.answer[i] >= (this.checkpoint - 1) * 20 + 15 && this.answer[i] < (this.checkpoint - 1) * 20 + 20) {
                    this.answer4.push(this.answer[i]);
                }
            }
            if(this.answer1.length) {
                this.answerArr.push(this.answer1);
            }
            if(this.answer2.length) {
                this.answerArr.push(this.answer2);
            }
            if(this.answer3.length) {
                this.answerArr.push(this.answer3);
            }
            if(this.answer4.length) {
                this.answerArr.push(this.answer4);
            }
        }else if(this.types == 2) {
            if(this.selectType) {
               switch(this.selectType) {
                    case 1: {
                        this.checkColor(this.checkpoint);
                        if(this.answer1.length){
                            let node  = cc.instantiate(this.bigNode);
                            this.setTag(node, 'blue');
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer2.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'red');
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer3.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'yellow');
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    case 2: {
                        this.checkFigure(this.checkpoint);
                        if(this.answer1.length) {
                            let node = cc.instantiate(this.bigNode);
                            if(this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieSquare');
                            }else if(this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureSquare');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer2.length) {
                            let node = cc.instantiate(this.bigNode);
                            if(this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieTriangle');
                            }else if(this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureTriangle');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer3.length) {
                            let node = cc.instantiate(this.bigNode);
                            if(this.typetype[this.checkpoint - 1] == 1) {
                                this.setTag(node, 'cookieCircle');
                            }else if(this.typetype[this.checkpoint - 1] == 2) {
                                this.setTag(node, 'figureCircle');
                            }
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    case 3: {
                        this.checkSize(this.checkpoint);
                        if(this.answer1.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node ,'figureSquare', 1, -20);
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer2.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.8, -40);
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer3.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.6, -60);
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    default: {
                        break;
                    }
               }
            }
            if(this.answer1.length) {
                this.answerArr.push(this.answer1);
            }
            if(this.answer2.length) {
                this.answerArr.push(this.answer2);
            }
            if(this.answer3.length) {
                this.answerArr.push(this.answer3);
            }
            this.backButton.node.active = true;
        }
        this.postAnswerBoard();
        this.addListenerOnItem();
    }

    checkColor(checkpoint:number) : number {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        var typeNum = 0;
        for(let i = 0; i < this.answer.length; i++) {
            if(this.answer[i] < (checkpoint - 1) * 27 + 9) {
                this.answer1.push(this.answer[i]);
            }else if(this.answer[i] < (checkpoint -1)* 27 + 18 && this.answer[i] >= (checkpoint - 1) * 27 + 9) {
                this.answer2.push(this.answer[i]);
            }else if(this.answer[i] < (checkpoint -1)* 27 + 27 && this.answer[i] >= (checkpoint -1)* 27 + 18) {
                this.answer3.push(this.answer[i]);
            }
        }
        if(this.answer1.length) {
            typeNum++;
        }
        if(this.answer2.length) {
            typeNum++;
        }
        if(this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    }

    checkFigure(checkpoint:number):number {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        let standard1 = [0,1,2,9,10,11,18,19,20];
        let standard2 = [3,4,5,12,13,14,21,22,23];
        let standard3 = [6,7,8,15,16,17,24,25,26];
        var typeNum = 0;
        for(let i = 0; i < this.answer.length; i++) {
           let index = this.answer[i] - (checkpoint - 1)*27;
            if(standard1.indexOf(index)!=-1) {
                this.answer1.push(this.answer[i]);
            }else if(standard2.indexOf(index)!=-1) {
                this.answer2.push(this.answer[i]);
            }else if(standard3.indexOf(index)!=-1) {
                this.answer3.push(this.answer[i]);
            }
        }
        if(this.answer1.length) {
            typeNum++;
        }
        if(this.answer2.length) {
            typeNum++;
        }
        if(this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    }

    checkSize(checkpoint:number) {
        this.answer1 = [];
        this.answer2 = [];
        this.answer3 = [];
        var typeNum = 0;
        for(let i = 0; i < this.answer.length; i++) {
            if(this.answer[i]%3==0) {
                this.answer1.push(this.answer[i]);
            }else if(this.answer[i]%3 == 1) {
                this.answer2.push(this.answer[i]);
            }else if(this.answer[i]%3 == 2) {
                this.answer3.push(this.answer[i]);
            }
        }
        if(this.answer1.length) {
            typeNum ++;
        }
        if(this.answer2.length) {
            typeNum++;
        }
        if(this.answer3.length) {
            typeNum++;
        }
        return typeNum;
    }

    createItem(checkpoint : number) {
        if(this.types == 1) {
            for(let j = 20 * (checkpoint - 1); j < 20 * checkpoint; j++) {
                if(this.typeDataArr[j]) {
                    let nodeParent = new cc.Node();
                    let node = new cc.Node();
                    let sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = this.sourceSFArr[j%20];
                    let nodeShadow = new cc.Node();
                    let spriteShadow = nodeShadow.addComponent(cc.Sprite)
                    spriteShadow.spriteFrame = this.sourceSFArr[j%20];
                    nodeShadow.color = cc.color(0,0,0);
                    nodeShadow.opacity = 100;
                    nodeShadow.setPosition(cc.v2(-10, -10))
                    node.zIndex = 1
                    nodeShadow.zIndex = 0
                    node.name = 'node'
                    nodeShadow.name = 'nodeShadow'
                    nodeParent.addChild(node)
                    nodeParent.addChild(nodeShadow)
                    this.ItemNodeArr.push(nodeParent);
                } 
            }
        }else if(this.types == 2) {
            for(let i = 27 * (checkpoint - 1); i < 27 * checkpoint; i++) {
                if(this.typeDataArr[i]) {
                    let nodeParent = new cc.Node();
                    let node = new cc.Node();
                    let sprite = node.addComponent(cc.Sprite);
                    let index = i % 27 + 1;
                    sprite.spriteFrame = this.sourceSFArr[Math.ceil(index/3) - 1];
                    let nodeShadow = new cc.Node();
                    let spriteShadow = nodeShadow.addComponent(cc.Sprite)
                    spriteShadow.spriteFrame = this.sourceSFArr[Math.ceil(index/3) - 1];
                    nodeShadow.color = cc.color(0,0,0);
                    nodeShadow.setPosition(cc.v2(-10, -10))
                    nodeShadow.opacity = 100
                    node.zIndex = 1
                    nodeShadow.zIndex = 0
                    node.name = 'node'
                    nodeShadow.name = 'nodeShadow'
                    nodeParent.addChild(node)
                    nodeParent.addChild(nodeShadow)
                    let size = index % 3;
                    if(size == 2) {
                        nodeParent.scale = 0.8;
                    }else if(size == 0) {
                        nodeParent.scale = 0.6;
                    }
                    this.ItemNodeArr.push(nodeParent);
                }
            }
        }
    }

    postAnswerBoard() {
        let num = this.AnswerBoardArr.length;
        let Y = -91;
        var space = 450 + 100 * (4-num);
        var startX = -(num-1) * space / 2 + 80;
        if(this.types == 2) {
            space = 610;
            startX = -(num-1) * space / 2 +80;
        }
        AudioManager.getInstance().playSound('sfx_casemove', false);
        for(let i = 0; i < num; i++) {
            cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.AnswerBoardArr[i]);
            this.AnswerBoardArr[i].setPosition(cc.v2(startX + i * space - 2000, Y));
            setTimeout(()=>{
                this.AnswerBoardArr[i].runAction(cc.moveBy(0.5, cc.v2(2000, 0)));
            }, 100 * (num -1-i));   
        }
    }

    postItem() {
        let num = this.ItemNodeArr.length;
        let upNum = Math.ceil(num/2);
        let downNum = Math.floor(num/2);
        let upY = 360;
        let downY = 210;
        let space = 210;
        let upStartX = -(upNum - 1) * space / 2 - 50;
        let downStartX = -(downNum - 1) * space / 2 - 50;
        AudioManager.getInstance().playSound('sfx_ciopn', false,1,null, ()=>{
            if(this.checkpoint == 1) {
                AudioManager.getInstance().playSound('把这些物品分类整理，并拖到对应区域内。', false);
            }
        });
        if(upNum == downNum) {
            for(let i = 0; i < num; i++) {
                this.ItemNodeArr[i].opacity = 0;
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.ItemNodeArr[i]);
                if(i < upNum){
                    this.ItemNodeArr[i].setPosition(cc.v2(upStartX + i*space,upY));
                }else {
                    this.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum)*space,downY));
                }
                setTimeout(() => {
                    this.ItemNodeArr[i].runAction(cc.sequence(cc.spawn(cc.moveBy(0.8, cc.v2(50,0)), cc.fadeIn(0.8)), cc.callFunc(()=>{
                        if(i == num - 1) {
                            if(this.types == 1) {
                                this.createAnswerBoard(this.checkpoint);
                            }else if(this.types == 2) { 
                                this.createSelectBoard()
                            }
                        }
                    })));
                }, 50*i);
            }
        }else{
            for(let i = 0; i < num; i++) {
                this.ItemNodeArr[i].opacity = 0;
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.ItemNodeArr[i]);
                if(i < upNum) {
                    this.ItemNodeArr[i].setPosition(cc.v2(upStartX + i*space,upY));
                }else {
                    this.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum)*space,downY));
                }
                setTimeout(() => {
                    this.ItemNodeArr[i].runAction(cc.sequence(cc.spawn(cc.moveBy(0.8, cc.v2(50,0)), cc.fadeIn(0.8)), cc.callFunc(()=>{
                        if(i == num - 1) {
                            if(this.types == 1) {
                                this.createAnswerBoard(this.checkpoint);
                            }else if(this.types == 2) {   
                                this.createSelectBoard()
                            }
                        }
                    })) );
                }, 50*i);
            }
        }
    }

    progressBar(index : number, totalNum : number) {
        if(this.types == 1) {
            if(totalNum == 2) {
                this.progressNode.getChildByName('progress2').active = true;
                this.progress = this.progressNode.getChildByName('progress2');
            }else if(totalNum == 3) {
                this.progressNode.getChildByName('progress3').active = true;
                this.progress = this.progressNode.getChildByName('progress3');
            }else if(totalNum == 4) {
                this.progressNode.getChildByName('progress4').active = true;
                this.progress = this.progressNode.getChildByName('progress4');
            }else if(totalNum == 5) {
                this.progressNode.getChildByName('progress5').active = true;
                this.progress = this.progressNode.getChildByName('progress5');
            }else if(totalNum == 1) {
                return
            }
            this.progressNode.active = true;
            for(let i = 0; i < totalNum; i++) {
                this.progress.children[i].getChildByName('bar1').zIndex = 1;
                this.progress.children[i].getChildByName('bar2').zIndex = 2;
                this.progress.children[i].getChildByName('bar3').zIndex = 3;
                if(i > index-1) {

                }else if(i < index-1) {
                    this.progress.children[i].getChildByName('bar1').zIndex = 3;
                    this.progress.children[i].getChildByName('bar2').zIndex = 2;
                    this.progress.children[i].getChildByName('bar3').zIndex = 1;
                }else if(i == index-1) {
                    this.progress.children[i].getChildByName('bar1').zIndex = 1;
                    this.progress.children[i].getChildByName('bar2').zIndex = 3;
                    this.progress.children[i].getChildByName('bar3').zIndex = 2;
                }
            }
        }else if(this.types == 2) {
            this.progressNode.active = false;
        }
    }

    isSuccess():boolean {
        for(let i = 0; i < 4; i++) {
            if(!this.answerArr[i]) {
                this.answerArr.push([]);
            }
        }
        this.answerArr[0].sort();
        this.answerArr[1].sort();
        this.answerArr[2].sort();
        this.answerArr[3].sort();
        this.player1.sort();
        this.player2.sort();
        this.player3.sort();
        this.player4.sort();
   
        let result1 = this.isEqual(this.answerArr[0], this.player1);
        let result2 = this.isEqual(this.answerArr[1], this.player2);
        let result3 = this.isEqual(this.answerArr[2], this.player3);
        let result4 = this.isEqual(this.answerArr[3], this.player4);
        if(result1&&result2&&result3&&result4) {
            return true;
        }else {
            return false;
        }
    }

    isEqual(answer:number[], player:number[]):boolean {
        var answerLen = answer.length;
        var equalNum = 0;
        for(let i = 0; i < answer.length; i++) {
            if(player.indexOf(answer[i]) != -1) {
                equalNum++;
            }
        }
        if(equalNum == answerLen) {
            return true;
        }else {
            return false;
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
                    if(content.types) {
                        this.types = content.types;
                    }else{
                        console.log('getNet中返回的types的值为空');
                    }
                    if(content.typetype) {
                       this.typetype = content.typetype;
                    }else{
                        console.log('getNet中返回的typetype的值为空');
                    }
                    if(content.checkpointsNum){
                        this.checkpointsNum = content.checkpointsNum;
                    }else{
                        console.log('getNet中返回的checkpointsNum的值为空');
                    }
                    if(content.typeDataArr) {
                        this.typeDataArr = content.typeDataArr;
                    }else{
                        console.log('getNet中返回的typeDataArr的值为空');
                    }
                    this.loadSourceSFArr();
                }   
            } else {
                //this.setPanel();
            }
        }.bind(this), null);
    }
}
