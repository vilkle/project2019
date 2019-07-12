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

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

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
    private selectNode : cc.Node = null;
    private types : number = 0;
    private typetype : number[] = [];
    private checkpointsNum : number = 0;
    private typeDataArr : boolean[] = [];
    private sourceSFArr : cc.SpriteFrame[] = [];
    private ItemNodeArr : cc.Node[] = [];
    private AnswerBoardArr : cc.Node[] = [];
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
    private checkpoint : number = 1;
    private selectType : number = 0;
    private touchTarget : any = null;

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            this.types = DaAnData.getInstance().types;
            this.typetype = DaAnData.getInstance().typetype;
            this.checkpointsNum = DaAnData.getInstance().checkpointsNum;
            this.typeDataArr = DaAnData.getInstance().typeDataArr;
            this.loadSourceSFArr();
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }else {
            this.getNet();
        }
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        console.log(location);
        console.log(location.search);
    }

    loadSourceSFArr() {
        if(this.types == 1) {
            cc.loader.loadResDir("images/gameUI/pic/animal", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        this.sourceSFArr.push(assets[i]);
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/food", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        this.sourceSFArr.push(assets[i]);
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/stationery", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        this.sourceSFArr.push(assets[i]);
                    }
                }
            });
            cc.loader.loadResDir("images/gameUI/pic/clothes", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
                    for(let i = 0; i < assets.length; i++) {
                        this.sourceSFArr.push(assets[i]);
                        if(this.sourceSFArr.length == 20) {
                            cc.log('----------');
                            this.setPanel();
                        }
                    }
                }
            });
            
        }else if(this.types == 2) {
            cc.loader.loadResDir("images/gameUI/pic/cookies", cc.SpriteFrame, (err, assets, urls)=>{
                    if(!err) {
                        for(let i = 0; i < assets.length; i++) {
                            this.sourceSFArr.push(assets[i]);
                            if(this.sourceSFArr.length == 9) { 
                                this.setPanel();
                            }
                        }
                    }
                });
            cc.loader.loadResDir("images/gameUI/pic/figure", cc.SpriteFrame, (err, assets, urls)=>{
                if(!err) {
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
        cc.log('------', this.answer);
        //开始初始化
        this.progressBar(checkpoint, this.checkpointsNum);
        this.createItem(checkpoint);
        this.postItem();
        if(this.types == 1) {
            this.createAnswerBoard(checkpoint);
        }else if(this.types == 2) {
            this.createSelectBoard();
        } 
    }

    setTag(item : cc.Node, tagName : string, size ?:number) {
        let big = item.getChildByName('bigTag').getChildByName(tagName);
        let small = item.getChildByName('smallTag').getChildByName(tagName);
        if(size) {
            big.setScale(size);
            small.setScale(size);
        }
        if(big) {
            big.active = true;
        }
        if(small) {
            small.active = true;
        }
    }

    createSelectBoard() {
        this.selectNode = cc.instantiate(this.selectPrefab);
        this.selectNode.setPosition(cc.v2(0,0));
        cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.selectNode);
        if(this.checkColor(this.checkpoint) > 1) {
            this.selectNode.getChildByName('colorNode').active = true;
        }else {
            this.selectNode.getChildByName('colorNode').active = false;
        }
        if(this.checkFigure(this.checkpoint) > 1) {
            this.selectNode.getChildByName('figureNode').active = true;
        }else {
            this.selectNode.getChildByName('figureNode').active = false;
        }
        if(this.checkSize(this.checkpoint) > 1) {
            this.selectNode.getChildByName('sizeNode').active = true;
        }else {
            this.selectNode.getChildByName('sizeNode').active = false;
        }
        for(let i = 0; i < this.selectNode.children.length; i++) {
            this.selectNode.children[i].getChildByName('start').on(cc.Node.EventType.TOUCH_START, (e)=>{
                this.selectNode.children[i].getChildByName('start').setScale(0.9);
            });
            this.selectNode.children[i].getChildByName('start').on(cc.Node.EventType.TOUCH_END, (e)=>{
                this.selectNode.children[i].getChildByName('start').setScale(1);
                this.selectType = i + 1;
                this.selectNode.active = false;
                this.createAnswerBoard(this.checkpoint);
            });
            this.selectNode.children[i].getChildByName('start').on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                this.selectNode.children[i].getChildByName('start').setScale(1);
                this.selectType = i + 1;
                this.selectNode.active = false;
                this.createAnswerBoard(this.checkpoint);
            });
        }
    }

    backButtonCallBack() {
        let len = this.AnswerBoardArr.length;
        for(let i = 0; i < len; i++) {
            this.AnswerBoardArr[i].removeFromParent();
            this.AnswerBoardArr[i].destroy();
        }
        this.removeListenerOnItem();
        this.player1 = [];
        this.player2 = [];
        this.player3 = [];
        this.player4 = [];
        this.AnswerBoardArr = [];
        this.selectNode.active = true;
        this.backButton.node.active = false;
    }
    
    removeListenerOnItem() {
        for(let i = 0; i < this.ItemNodeArr.length; i++) {
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_START);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_MOVE);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_END);
            this.ItemNodeArr[i].off(cc.Node.EventType.TOUCH_CANCEL);
            this.ItemNodeArr[i].opacity = 255;
        }
    }

    addListenerOnItem() {
        for(let i = 0; i < this.ItemNodeArr.length; i++) {
            this.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget) {
                    return;
                }
                this.touchTarget = e.target;
                this.touchNode.active = true;
                this.touchNode.zIndex = 100;
                e.target.opacity = 0;
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.touchNode.setPosition(point);
                this.touchNode.setScale(e.target.scale + 0.1);
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame;
            });
            this.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
               if(this.touchTarget != e.target) {
                    return;
               }
               var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
               this.touchNode.setPosition(point);
            });
            this.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_END, (e)=>{
                cc.log(this.touchTarget, e.target);
                if(this.touchTarget != e.target) {
                    return;
               }
                this.touchNode.active = false;
                e.target.opacity = 255;
                this.touchTarget = null;
            });
            this.ItemNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return;
               }
               if(this.AnswerBoardArr[0].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[0].convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(this.answer1.indexOf(this.answer[i]) != -1) {
                        cc.log("player lenth is",this.player1.length);
                        this.AnswerBoardArr[0].getChildByName('answerNode').children[this.player1.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                        this.AnswerBoardArr[0].getChildByName('answerNode').children[this.player1.length].setScale(e.target.scale);
                        this.player1.push(this.answer[i]);
                        this.touchNode.active = false;
                    }else {
                        this.touchNode.active = false;
                        e.target.opacity = 255;
                    }
                    this.touchTarget = null;
               }else if(this.AnswerBoardArr[1].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[1].convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(this.answer2.indexOf(this.answer[i])  != -1) {
                        this.AnswerBoardArr[1].getChildByName('answerNode').children[this.player2.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                        this.AnswerBoardArr[1].getChildByName('answerNode').children[this.player2.length].setScale(e.target.scale);
                        this.player2.push(this.answer[i]);
                        this.touchNode.active = false;
                    }else {
                        this.touchNode.active = false;
                        e.target.opacity = 255;
                    }
                    this.touchTarget = null;
               }else if(this.AnswerBoardArr[2].getChildByName('bigTag').getBoundingBox().contains(this.AnswerBoardArr[2].convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(this.answer3.indexOf(this.answer[i])  != -1) {
                        this.AnswerBoardArr[2].getChildByName('answerNode').children[this.player3.length].getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame;
                        this.AnswerBoardArr[2].getChildByName('answerNode').children[this.player3.length].setScale(e.target.scale);
                        this.player3.push(this.answer[i]);
                        this.touchNode.active = false;
                    }else {
                        this.touchNode.active = false;
                        e.target.opacity = 255;
                    }
                    this.touchTarget = null;
               }else {
                    this.touchNode.active = false;
                    e.target.opacity = 255;
                    this.touchTarget = null;
               }
               if(this.isSuccess()) {
                    cc.log('----------------success');
                    this.next();
               }
            });
        }
    }

    next() {
        if(this.types == 1) {
            
        }else if(this.types == 2) {
            
        }
    }
    
    addTouchListenerOnSelect() {
        if(this.selectNode) {
            for(let i = 0; i < this.selectNode.children.length; i++) {
                this.selectNode.children[i].getChildByName('finish').on(cc.Node.EventType.TOUCH_START, (e)=>{
                    this.selectNode.children[i].getChildByName('finish').setScale(0,9);
                });
                this.selectNode.children[i].getChildByName('finish').on(cc.Node.EventType.TOUCH_END, (e)=>{
                    this.selectNode.children[i].getChildByName('finish').setScale(1);
                    if(this.selectNode.children[i].getChildByName('bubble').active) {
                        this.selectNode.children[i].getChildByName('bubble').active = false;
                    }else {
                        this.selectNode.children[i].getChildByName('bubble').active = true;
                    }
                });
                this.selectNode.children[i].getChildByName('finish').on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                    this.selectNode.children[i].getChildByName('finish').setScale(1);
                    if(this.selectNode.children[i].getChildByName('bubble').active) {
                        this.selectNode.children[i].getChildByName('bubble').active = false;
                    }else { 
                        this.selectNode.children[i].getChildByName('bubble').active = true;
                    }
                });
            }
        }
    }

    createAnswerBoard(checkpoint : number) {
        var typeSet = new Set();
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
         
        }else if(this.types == 2) {
            if(this.selectType) {
               switch(this.selectType) {
                    case 1: {
                        this.checkColor(this.checkpoint);
                        this.logAnswer();
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
                        this.logAnswer();
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
                        this.logAnswer();
                        if(this.answer1.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node ,'figureSquare', 1);
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer2.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.8);
                            this.AnswerBoardArr.push(node);
                        }
                        if(this.answer3.length) {
                            let node = cc.instantiate(this.bigNode);
                            this.setTag(node, 'figureSquare', 0.6);
                            this.AnswerBoardArr.push(node);
                        }
                        break;
                    }
                    default: {
                        break;
                    }
               }
            }
            this.backButton.node.active = true;
        }
        this.postAnswerBoard();
        this.addListenerOnItem();
    }

    logAnswer() {
        cc.log(this.answer1);
        cc.log(this.answer2);
        cc.log(this.answer3);
        cc.log(this.answer4);

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
        let standard1 = [0,1,2,9,10,11,17,18,19];
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
                    let node = new cc.Node();
                    let sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = this.sourceSFArr[j%20];
                    this.ItemNodeArr.push(node);
                } 
            }
        }else if(this.types == 2) {
            for(let i = 27 * (checkpoint - 1); i < 27 * checkpoint; i++) {
                if(this.typeDataArr[i]) {
                    let node = new cc.Node();
                    let sprite = node.addComponent(cc.Sprite);
                    let index = i % 27 + 1;
                    sprite.spriteFrame = this.sourceSFArr[Math.ceil(index/3) - 1];
                    let size = index % 3;
                    if(size == 2) {
                        node.scale = 0.8;
                    }else if(size == 0) {
                        node.scale = 0.6;
                    }
                    this.ItemNodeArr.push(node);
                }
            }
        }
    }

    postAnswerBoard() {
        let num = this.AnswerBoardArr.length;
        let Y = -91;
        var space = 450;
        var startX = -(num-1) * space / 2 + 80;
        if(DaAnData.getInstance().types == 2) {
            space = 610;
            startX = -(num-1) * space / 2 + 140;
        }
        for(let i = 0; i < num; i++) {
            cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.AnswerBoardArr[i]);
            this.AnswerBoardArr[i].setPosition(cc.v2(startX + i * space, Y));
        }
    }

    postItem() {
        let num = this.ItemNodeArr.length;
        let upNum = Math.ceil(num/2);
        let downNum = Math.floor(num/2);
        let upY = 360;
        let downY = 210;
        let space = 210;
        let upStartX = -(upNum - 1) * space / 2;
        let downStartX = -(downNum - 1) * space / 2
        if(upNum == downNum) {
            for(let i = 0; i < num; i++) {
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.ItemNodeArr[i]);
                if(i < upNum){
                    this.ItemNodeArr[i].setPosition(cc.v2(upStartX + i*space,upY));
                }else {
                    this.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum)*space,downY));
                }
            }
        }else{
            for(let i = 0; i < num; i++) {
                cc.director.getScene().getChildByName('Canvas').getChildByName('GamePanel').addChild(this.ItemNodeArr[i]);
                if(i < upNum) {
                    this.ItemNodeArr[i].setPosition(cc.v2(upStartX + i*space,upY));
                }else {
                    this.ItemNodeArr[i].setPosition(cc.v2(downStartX + (i - upNum)*space,downY));
                }
            }
        }
    }

    progressBar(index : number, totalNum : number) {
        for(let i = 0; i < 5; i++) {
            this.progressNode.children[i].getChildByName('bar1').zIndex = 1;
            this.progressNode.children[i].getChildByName('bar2').zIndex = 2;
            this.progressNode.children[i].getChildByName('bar3').zIndex = 3;
            if(i < totalNum) {
                if(i == index-1) {
                    this.progressNode.children[i].getChildByName('bar1').zIndex = 1;
                    this.progressNode.children[i].getChildByName('bar2').zIndex = 3;
                    this.progressNode.children[i].getChildByName('bar3').zIndex = 2;
                }else{
                    this.progressNode.children[i].getChildByName('bar1').zIndex = 3;
                    this.progressNode.children[i].getChildByName('bar2').zIndex = 2;
                    this.progressNode.children[i].getChildByName('bar3').zIndex = 1;
                }
            }
        }
    }

    isSuccess():boolean {
        this.answer1.sort();
        this.answer2.sort();
        this.answer3.sort();
        this.answer4.sort();
        this.player1.sort();
        this.player2.sort();
        this.player3.sort();
        this.player4.sort();
   
        let result1 = this.isEqual(this.answer1, this.player1);
        let result2 = this.isEqual(this.answer2, this.player2);
        let result3 = this.isEqual(this.answer3, this.player3);
        let result4 = this.isEqual(this.answer4, this.player4);
        cc.log(this.answer1, this.player1, this.answer2, this.player2, this.answer3, this.player3, this.answer4,this.player4);
        cc.log(result1, result2, result3, result4);
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
                    cc.log('-------content',content);
                    if(content.types) {
                        this.types = content.types;
                        cc.log(content.types);
                    }else{
                        console.log('getNet中返回的types的值为空');
                    }
                    if(content.typetype) {
                       this.typetype = content.typetype;
                        cc.log(content.typetype);
                    }else{
                        console.log('getNet中返回的typetype的值为空');
                    }
                    if(content.checkpointsNum){
                        this.checkpointsNum = content.checkpointsNum;
                        cc.log(content.checkpointsNum);
                    }else{
                        console.log('getNet中返回的checkpointsNum的值为空');
                    }
                    if(content.typeDataArr) {
                        this.typeDataArr = content.typeDataArr;
                        cc.log(content.typeDataArr);
                    }else{
                        console.log('getNet中返回的typeDataArr的值为空');
                    }
                    this.loadSourceSFArr();
                }   
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
