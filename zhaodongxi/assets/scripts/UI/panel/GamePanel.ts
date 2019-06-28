import { BaseUI } from "../BaseUI";
import {DaAnData} from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import {OverTips} from "../../UI/Item/OverTips"
import {AudioManager} from "../../Manager/AudioManager";
import {NetWork} from "../../Http/NetWork";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel";
import DataReporting from "../../Data/DataReporting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Label)
    label1 : cc.Label = null;
    @property(cc.Label)
    label2 : cc.Label = null;
    @property(cc.Node)
    bg : cc.Node = null;
    @property(cc.Node)
    picBoard : cc.Node = null;
    @property(cc.Node)
    answerBoard : cc.Node = null;
    @property(cc.Node)
    board : cc.Node = null;
    @property(cc.Button)
    sure : cc.Button = null;
    @property([cc.SpriteFrame])
    sourceSFArr : cc.SpriteFrame[] = [];
    @property([cc.Node])
    itemArr : cc.Node[] = [];
    @property([cc.Node])
    answerItemArr : cc.Node[] = [];
    @property(cc.Layout)
    layout : cc.Layout = null;
    @property(cc.Node)
    labaBoundingBox : cc.Node = null;
    @property(sp.Skeleton)
    laba : sp.Skeleton = null;

    dirSFNumArr : Array<number> = new Array<number>();
    answerSFNumArr : Array<number> = new Array<number>();
    answerPosNumArr : Array<number> = new Array<number>();
    playerItemArr : Array<number> = new Array<number>();
    playerItemSFArr : Array<number> = new Array<number>();
    playerErroArr : Array<number> = new Array<number>();//位选中的正确答案
    SoundArr : Array<number> = new Array<number>();
    answerNum : number = null;
    checkpointsNum : number = null;
    checkpoints : number = null;
    horizonNum : number = null;
    verticalNum : number = null;
    cueNum : number = null;
    creatItemNum : number = null;
    rightNum : number = null;
    isOver : number = 0;

    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }


     onLoad () {
        this.isTecher();
        
    }

    start() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpoints].result = 2;
            }
        });

        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, function(e){
            if(this.labaBoundingBox.getBoundingBox().contains(this.board.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.laba.setAnimation(0, 'animation', false);
                this.stopAll();
                AudioManager.getInstance().playSound('找一找目标图形',false ,1,function(id){this.SoundArr.push(id)}.bind(this), function(id){this.SoundArr.filter(item => item !== id)}.bind(this));
            }

        }.bind(this));
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport && this.eventvalue.result != 1) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        if (this.eventvalue.isResult == 1) {
            this.isOver = 1;
        }else{
            if(this.eventvalue.levelData.length == 0) {
                this.isOver = 0
            }
        }

        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

   
    stopAll() {
        for(let i = 0; i < this.SoundArr.length; i++) {
            AudioManager.getInstance().stopAudio(this.SoundArr[i]);
        }
        this.SoundArr = [];
    }

    onDestroy() {
       
    }

    onShow() {
    }
    // update (dt) {}

    isTecher() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
            this.initData();
            this.loadSourcePFArr(); 
        }else {
            this.getNet();
        }
    }

    action(loadItemNum : number) {
        if(loadItemNum == this.horizonNum * this.verticalNum + this.answerNum) {
            this.picBoard.runAction(cc.moveTo(1, cc.v2(-250, 0)));
            this.board.runAction(cc.moveTo(1, cc.v2(0, 0)));
            this.sure.node.runAction(cc.moveTo(1, cc.v2(720, -310)));
            AudioManager.getInstance().stopAll();
            AudioManager.getInstance().playSound("begin", false,1,function(){}, function(){AudioManager.getInstance().stopAll(); AudioManager.getInstance().playSound('找一找目标图形',false ,1,function(id){this.SoundArr.push(id)}.bind(this), function(id){this.SoundArr.filter(item => item !== id)}.bind(this));}.bind(this));
        }
    }

    initData() {
        switch(DaAnData.getInstance().range) {
            case 1:
               this.horizonNum = 4;
               this.verticalNum = 4;
                break;
            case 2:
                this.horizonNum = 5;
                this.verticalNum = 4;
                break;
            case 3:
                this.horizonNum = 6;
                this.verticalNum = 4;
                break;
            case 4:
                this.horizonNum = 7;
                this.verticalNum = 4;
                break;
            case 5:
                this.horizonNum = 8;
                this.verticalNum = 4;
                break;
            case 6:
                this.horizonNum = 4;
                this.verticalNum = 5;
                break;
            case 7:
                this.horizonNum = 5;
                this.verticalNum = 5;
                break;
            case 8:
                this.horizonNum = 6;
                this.verticalNum = 5;
                break;
            case 9:
                this.horizonNum = 7;
                this.verticalNum = 5;
                break;
            case 10:
                this.horizonNum = 8;
                this.verticalNum = 5;
                break;
            default:
                break;
        }  
        switch(DaAnData.getInstance().types) {
            case 1:
               this.answerNum = 1;
                break;
            case 2:
                this.answerNum = 4;
                this.rightNum = 4;
                break;
            default:
                break;
        }
        this.creatItemNum = 0;
        this.cueNum = 0;
        this.checkpoints = 0;
        this.checkpointsNum = DaAnData.getInstance().checkpointsNum;
        this.label1.string = String(1);
        this.label2.string = String(this.checkpointsNum);
        for(let i = 0; i < this.checkpointsNum; i++) {
            this.eventvalue.levelData.push({
                subject: null,
                answer: null,
                result: 4
            });
        }
    }

    loadSourcePFArr() {
        var num = 0;
        DaAnData.getInstance().picArr.forEach((value, index, array) => {
            switch(value) {
                case 1:
                   cc.loader.loadResDir("images/gameUI/pic/animal", cc.SpriteFrame, function (err, assets, urls) {
                    if(!err){
                        for(var i = 0; i < assets.length; i++){
                                this.sourceSFArr.push(assets[i]);
                            }
                            num ++;
                            if(num == DaAnData.getInstance().picArr.length)
                            {
                                this.loadDirSFArr(); 
                            }
                        }
                    }.bind(this));
                    break;
                case 2:
                    cc.loader.loadResDir("images/gameUI/pic/food", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 3:
                    cc.loader.loadResDir("images/gameUI/pic/figure", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 4:
                    cc.loader.loadResDir("images/gameUI/pic/dailyuse", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 5:
                    cc.loader.loadResDir("images/gameUI/pic/number", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 6:
                    cc.loader.loadResDir("images/gameUI/pic/stationery", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 7:
                    cc.loader.loadResDir("images/gameUI/pic/clothes", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                case 8:
                    cc.loader.loadResDir("images/gameUI/pic/letter", cc.SpriteFrame, function (err, assets, urls) {
                        for(var i = 0; i < assets.length; i++){
                            this.sourceSFArr.push(assets[i]);
                        }
                        num ++;
                        if(num == DaAnData.getInstance().picArr.length)
                        {
                            this.loadDirSFArr();
                        }
                    }.bind(this));
                    break;
                default:
                    break;
            }
        });
    }

    repeatNum(num : number):number {
        var repeatNum = 0;
        for(let i = 0; i < this.dirSFNumArr.length; i++) {
            if(num == this.dirSFNumArr[i]) {
                repeatNum += 1;
            }
       }
        return repeatNum;
    }

    loadDirSFArr() {
        if(ConstValue.IS_TEACHER) {
            var totalNum = this.horizonNum * this.verticalNum;
            for(let i = 0; i < totalNum; i ++) {
                let randomNum = this.getRandomNum(0, this.sourceSFArr.length - 1);
                if(DaAnData.getInstance().picArr.length >= 2) {
                    while(this.repeatNum(randomNum) >= 3) {
                        randomNum = this.getRandomNum(0, this.sourceSFArr.length - 1);
                    }
                }
                this.dirSFNumArr[i] = randomNum;
                DaAnData.getInstance().dirSFArr.push(randomNum);
            }
            if(this.answerNum == 1) {
                var num = this.getRandomNum(0, totalNum - 1);
                var randomNum = this.dirSFNumArr[num];
                for(let i = 0; i < this.dirSFNumArr.length; i++) {
                    if(this.dirSFNumArr[i] == randomNum) {
                        var sfNum = this.dirSFNumArr[i];
                        this.answerPosNumArr.push(i);
                        this.answerSFNumArr.push(sfNum);
                        
                        DaAnData.getInstance().answerSFArr.push(sfNum);
                        DaAnData.getInstance().answerPosArr.push(i);
                    }
                }
                DaAnData.getInstance().answerOneNum.push(this.answerPosNumArr.length);
                this.rightNum = this.answerPosNumArr.length;
            }else {
                DaAnData.getInstance().answerOneNum = [];
                var num = this.getRandomNum(0, totalNum - 1);
                var num1 = 0;
                var num2 = 0;
                var num3 = 0;
                if(num + this.horizonNum <= totalNum - 1) {
                    num1 = num + this.horizonNum;
                    if(num + 1 <= Math.ceil((num + 1) / this.horizonNum) * this.horizonNum - 1) {
                        num2 = num + this.horizonNum + 1;
                        num3 = num + 1;
                        this.answerPosNumArr[0] = num;
                        this.answerPosNumArr[1] = num3;
                        this.answerPosNumArr[2] = num1;
                        this.answerPosNumArr[3] = num2;
                    }else {
                        num2 = num + this.horizonNum - 1;
                        num3 = num - 1;
                        this.answerPosNumArr[0] = num3;
                        this.answerPosNumArr[1] = num;
                        this.answerPosNumArr[2] = num2;
                        this.answerPosNumArr[3] = num1;
                    }
                }else {
                    num1 = num - this.horizonNum;
                    if(num + 1 <= Math.ceil((num + 1) / this.horizonNum) * this.horizonNum - 1) {
                        num2 = num - this.horizonNum + 1;
                        num3 = num + 1;
                        this.answerPosNumArr[0] = num1;
                        this.answerPosNumArr[1] = num2;
                        this.answerPosNumArr[2] = num;
                        this.answerPosNumArr[3] = num3;
                    }else {
                        num2 = num - this.horizonNum - 1;
                        num3 = num - 1;
                        this.answerPosNumArr[0] = num2;
                        this.answerPosNumArr[1] = num1;
                        this.answerPosNumArr[2] = num3;
                        this.answerPosNumArr[3] = num;
                    }
                }
                this.answerSFNumArr[0] = this.dirSFNumArr[this.answerPosNumArr[0]];
                this.answerSFNumArr[1] = this.dirSFNumArr[this.answerPosNumArr[1]];
                this.answerSFNumArr[2] = this.dirSFNumArr[this.answerPosNumArr[2]];
                this.answerSFNumArr[3] = this.dirSFNumArr[this.answerPosNumArr[3]];
                DaAnData.getInstance().answerSFArr.push(this.answerSFNumArr[0]);
                DaAnData.getInstance().answerSFArr.push(this.answerSFNumArr[1]);
                DaAnData.getInstance().answerSFArr.push(this.answerSFNumArr[2]);
                DaAnData.getInstance().answerSFArr.push(this.answerSFNumArr[3]);
                DaAnData.getInstance().answerPosArr.push(this.answerPosNumArr[0]);
                DaAnData.getInstance().answerPosArr.push(this.answerPosNumArr[1]);
                DaAnData.getInstance().answerPosArr.push(this.answerPosNumArr[2]);
                DaAnData.getInstance().answerPosArr.push(this.answerPosNumArr[3]);
            }
        }else {
            var totalNum = this.horizonNum * this.verticalNum;
            for(let i = 0; i < totalNum; i ++) {
                this.dirSFNumArr[i] = DaAnData.getInstance().dirSFArr[(this.checkpoints) * totalNum + i];
            }
            if(this.answerNum == 1) {
                let startIndx = 0;
                let endIndex = 0;
                for(let i = 0; i < DaAnData.getInstance().answerOneNum.length; i++) {
                    if(i < this.checkpoints) {
                        startIndx = startIndx + DaAnData.getInstance().answerOneNum[i];
                    }
                    if(i <= this.checkpoints) {
                        endIndex = endIndex + DaAnData.getInstance().answerOneNum[i];
                    }
                }
                for(let i = 0; i < DaAnData.getInstance().answerPosArr.length; i++) {
                    if(i >= startIndx && i <= endIndex - 1) {
                        this.answerPosNumArr.push(DaAnData.getInstance().answerPosArr[i]);
                    }
                }
                for(let i = 0; i < DaAnData.getInstance().answerSFArr.length; i++) {
                    if(i >= startIndx && i <= endIndex - 1) {
                        this.answerSFNumArr.push(DaAnData.getInstance().answerSFArr[i]);
                    }
                }
            }else {
                for(let i = 0; i < 4; i++) {
                    this.answerSFNumArr[i] = DaAnData.getInstance().answerSFArr[(this.checkpoints) * 4 + i];
                    this.answerPosNumArr[i] = DaAnData.getInstance().answerPosArr[(this.checkpoints) * 4 + i];
                }
            }
        }
        this.creatAnswerBoard();
        this.creatPicBoard();
    }

    getRandomNum(min : number, max : number):number {
        var range = max - min;
        var rand = Math.random();
        return(min + Math.round(rand * range));
    }

    creatPicBoard() {
        this.creatBoard(this.horizonNum, this.verticalNum, this.picBoard, false);
    }

    creatAnswerBoard() {
        switch(this.answerNum) {
            case 1:
                this.creatBoard(1, 1, this.answerBoard, true);
                break;
            case 4:
                this.creatBoard(2, 2, this.answerBoard, true);
                break;
            default:
                break;
        }
    }


    creatBoard(horizonNum : number, verticalNum : number, board : cc.Node, isAnswer ?: any ){
        for(let v = 0; v < verticalNum; v++) {
            for(let h = 0; h < horizonNum; h++) {
                let item : cc.Node; 
                let num = v * horizonNum + h;
                let x = h * 175 + 175 / 2;
                let y = v * 175 + 175 / 2;
                let ischange = false;
                if(this.answerNum == 4) {
                    if(horizonNum%2) {
                        if(num%2) {
                            ischange = true;
                        }
                    }else {
                        if(v%2){
                            if(num%2 == 0) {
                                ischange = true;
                            }
                        }
                        else{
                            if(num%2 != 0) {
                                ischange = true;
                            }
                        }
                    }
                }else {
                    ischange = true;
                }
                this.creatItem( num, cc.v2(x,y), ischange, board, isAnswer); 
            }
        }
        var width = horizonNum * 175;
        var height = verticalNum * 175;
        board.getChildByName("bg").width = width + 20;
        board.getChildByName("bg").height = height + 20;
        board.getChildByName("node").x = - width / 2;
        board.getChildByName("node").y = - height / 2;
    }

    creatItem(num : number, pos : cc.Vec2, isChange : boolean, board : cc.Node, isAnswer ?: any) {
        var item : cc.Node; 
        cc.loader.loadRes("prefab/ui/Item/picItem", function(err, prefab){
            if(err) {

            }else{
                item = cc.instantiate(prefab);
                if(isChange){
                    cc.loader.loadRes("images/gameUI/shen", cc.SpriteFrame, function(err, spriteFrame){
                        if(err){
                            
                        }else {
                            item.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        }
                    }.bind(this));
                }
                if(isAnswer){
                    this.answerItemArr[num] = item;
                    this.creatItemNum++;
                    this.action(this.creatItemNum);
                    if(this.answerNum == 1) {
                        item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.answerSFNumArr[0]];
                    }else {
                        item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.answerSFNumArr[num]];
                    }
                }else{
                    this.itemArr[num] = item;
                    this.creatItemNum++;
                    this.action(this.creatItemNum);
                    item.getChildByName("bg").on(cc.Node.EventType.TOUCH_START, function(t){
                        if(this.eventvalue.result != 1) {
                            this.eventvalue.result = 2;
                            this.isOver = 2;
                            this.eventvalue.levelData[this.checkpoints].result = 2;
                        }
                        if (item.getChildByName("box").active == false) {
                            if(item.getChildByName("mask").opacity == 0) {
                                if(this.sure.interactable == false && this.cueNum < 3) {
                                    this.sure.interactable = true;
                                }
                                let rn = this.getRandomNum(1, 3);
                                AudioManager.getInstance().stopAll();
                                if(rn == 1) {
                                    AudioManager.getInstance().playSound("sfx_tchopt1", false);
                                }else if(rn == 2) {
                                    AudioManager.getInstance().playSound("sfx_tchopt2", false);
                                }else if(rn == 3) {
                                    AudioManager.getInstance().playSound("sfx_tchopt3", false);
                                }
                                item.getChildByName("box").active = true;
                                item.zIndex = 10;
                                this.playerItemArr.push(num);
                                this.playerItemSFArr.push(this.dirSFNumArr[num]);
                                if(this.isAllRight()) {
                                    if(this.sure.interactable == false) {
                                        this.sure.interactable = true;
                                    }
                                }
                            }
                        }else {
                            if(this.playerItemArr.length > 0) {
                                if(item.getChildByName('right').opacity != 0) {
                                    return;
                                }
                                AudioManager.getInstance().stopAll();
                                AudioManager.getInstance().playSound("sfx_cancel", false);
                                item.getChildByName("box").active = false;
                                item.zIndex = 0;
                                this.playerItemArr = this.playerItemArr.filter(item => item !== num);
                                this.playerItemSFArr = this.playerItemSFArr.filter(item => item != this.dirSFNumArr[num]);
                                if(this.cueNum >= 3) {
                                    item.getChildByName('mask').opacity = 255;
                                }
                                if(this.isAllRight()) {
                                    if(this.sure.interactable == false) {
                                        this.sure.interactable = true;
                                    }
                                }
                            }else {
                                this.sure.interactable = false;
                            }
                        }   
                    }.bind(this), this);
                    item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.dirSFNumArr[num]];
                }
                item.setPosition(pos);
                item.parent = board.getChildByName("node");
             }    
        }.bind(this));
    }

    cueAnswer() {
      
         for(let j = 0; j < this.itemArr.length; j++) {
            if(this.answerPosNumArr.indexOf(j) == -1 && this.itemArr[j].getChildByName('box').active == false) {
                this.itemArr[j].getChildByName('mask').opacity = 255;
            }
        }
        for(let i = 0; i < this.answerPosNumArr.length; i++) {
            this.itemArr[this.answerPosNumArr[i]].zIndex = 100;
            let rightBox = this.itemArr[this.answerPosNumArr[i]].children[4];
            rightBox.opacity = 255;
            rightBox.stopAllActions();
            rightBox.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.3))));
        }
    }

    reset() {
        if(this.playerItemArr.length == 0) {
            return;
        }
        for(let i = 0; i < this.answerNum; i ++) {
            this.itemArr[this.playerItemArr[i]].getChildByName("box").active = false;
            this.itemArr[this.playerItemArr[i]].zIndex = 0;
        }
        this.playerItemArr = [];
        this.cueNum = 0;
    }

    nextCheckPoints() {
       for(let i = 0; i < this.itemArr.length; i++) {
            this.itemArr[i].destroy();
       }
       for(let j = 0; j < this.answerItemArr.length; j++) {
           this.answerItemArr[j].destroy();
       }
       this.answerPosNumArr = [];
       this.answerSFNumArr = [];
       this.answerItemArr = [];
       this.itemArr = [];
       this.dirSFNumArr = [];
       this.playerItemArr = [];
       this.playerErroArr = [];
       this.playerItemSFArr = [];
       this.cueNum = 0;
       this.loadDirSFArr();
       this.creatPicBoard();
       this.creatAnswerBoard();
       this.label1.string = String(this.checkpoints + 1);
       this.sure.interactable = false;
    }

    isAllRight():boolean {
        if(this.playerItemArr.length == 0) {
            return;
        }
        var rightNum = 0;
        for(let i = 0; i < this.playerItemArr.length; i++) {
                if(this.answerPosNumArr.indexOf(this.playerItemArr[i]) != -1) {
                rightNum++;
            }
        }
        if(rightNum == this.rightNum && this.playerItemArr.length == this.rightNum) {
            return true;
        }else {
            return false;
        }
    }

    submisson() {
        this.sure.interactable = false;
        if(this.playerItemArr.length == 0) {
            return;
        }
        var rightNum = 0;
        for(let i = 0; i < this.playerItemArr.length; i++) {
                if(this.answerPosNumArr.indexOf(this.playerItemArr[i]) != -1) {
                rightNum++;
            }
        }
        if(this.answerNum == 1 && !ConstValue.IS_TEACHER) {
           this.rightNum = DaAnData.getInstance().answerOneNum[this.checkpoints];
        }
        if(rightNum == this.rightNum && this.playerItemArr.length == this.rightNum) {
            this.checkpoints++;
            if(this.checkpoints < this.checkpointsNum || this.checkpointsNum == 1) {
                if(this.cueNum >= 3) {
                    this.eventvalue.levelData[this.checkpoints-1].answer = this.playerItemArr;
                    this.eventvalue.levelData[this.checkpoints-1].subject = this.answerPosNumArr;
                    this.eventvalue.levelData[this.checkpoints-1].result = 1;
                    this.isOver = 2;
                    this.eventvalue.result = 2;
                    if(this.checkpointsNum == 1) {
                        this.eventvalue.result = 1; 
                        this.isOver = 1; 
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        });
                    }
                    if(ConstValue.IS_TEACHER&&this.checkpointsNum == 1) {
                        DaAnData.getInstance().submitEnable = true;
                     }   
                    UIHelp.showOverTips(1, '你真棒~',function(){
                        AudioManager.getInstance().stopAll();
                        AudioManager.getInstance().playSound("point1", false);
                    }.bind(this),
                    function(){
                        if(this.checkpointsNum == 1) {
                            this.addMask();
                        }else {
                            this.sure.interactable = true;
                            this.nextCheckPoints();
                        }
                    }.bind(this));
                }else {
                    this.eventvalue.levelData[this.checkpoints-1].answer = this.playerItemArr;
                    this.eventvalue.levelData[this.checkpoints-1].subject = this.answerPosNumArr;
                    this.eventvalue.levelData[this.checkpoints-1].result = 1;
                    this.isOver = 2;
                    this.eventvalue.result = 2;
                    if(this.checkpointsNum == 1) {
                        this.eventvalue.result = 1;
                        this.isOver = 1;
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        });
                    }
                    if(ConstValue.IS_TEACHER&&this.checkpointsNum == 1) {
                        DaAnData.getInstance().submitEnable = true;
                     }   
                    UIHelp.showOverTips(1, '答对啦！你真棒~',function(){
                        AudioManager.getInstance().stopAll();
                        AudioManager.getInstance().playSound("point2", false);
                    }.bind(this), 
                    function(){
                        if(this.checkpointsNum == 1) {
                            this.addMask();
                        }else {
                            this.sure.interactable = true;
                            this.nextCheckPoints();
                        }
                    }.bind(this));
                }
            }else {
                this.eventvalue.levelData[this.checkpoints-1].answer = this.playerItemArr;
                this.eventvalue.levelData[this.checkpoints-1].subject = this.answerPosNumArr;
                this.eventvalue.levelData[this.checkpoints-1].result = 1;
                this.eventvalue.result = 1;
                this.isOver = 1;
                DataReporting.getInstance().dispatchEvent('addLog', {
                    eventType: 'clickSubmit',
                    eventValue: JSON.stringify(this.eventvalue)
                });
                if(ConstValue.IS_TEACHER) {
                    DaAnData.getInstance().submitEnable = true;
                 }   
                UIHelp.showOverTips(2, '太棒啦，闯关结束！', function(){
                    AudioManager.getInstance().stopAll();
                    AudioManager.getInstance().playSound("point3", false);
                }.bind(this),
                function(){
                    this.addMask();
                }.bind(this));
            }
        }else {
            this.cueNum++;
            if(this.cueNum >= 3) {   
                this.sure.interactable = false;
                this.cueAnswer();
                // UIHelp.showOverTips(0, '啊哦，再试一试吧。',function(){
                //     AudioManager.getInstance().stopAll();
                //     AudioManager.getInstance().playSound("point4", false);
                // }.bind(this),
                // function(){
                //     this.sure.interactable = false;
                //     this.cueAnswer();
                // }.bind(this));
            }else {
                this.eventvalue.levelData[this.checkpoints].answer = this.playerItemArr;
                this.eventvalue.levelData[this.checkpoints].subject = this.answerPosNumArr;
                this.eventvalue.levelData[this.checkpoints].result = 2;
                this.eventvalue.result = 2;
                this.isOver = 2;
                UIHelp.showOverTips(0, '啊哦，再试一试吧。', function(){
                    AudioManager.getInstance().stopAll();
                    AudioManager.getInstance().playSound("point4", false);
                }.bind(this),
                function(){this.sure.interactable = true; }.bind(this));
            }
        }
    }

    addMask() {
        this.layout.node.on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
    }

    removeMask() {
        this.layout.node.off(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
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
                        DaAnData.getInstance().types = content.types;
                   }       
                   if(content.checkpointsNum) {
                        DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                   }
                    if(content.range) {
                        DaAnData.getInstance().range = content.range;
                    }
                    if(content.picArr) {
                        DaAnData.getInstance().picArr = content.picArr;
                    }
                    if(content.dirSFArr) {
                        DaAnData.getInstance().dirSFArr = content.dirSFArr;
                    }
                    if(content.answerSFArr) {
                        DaAnData.getInstance().answerSFArr = content.answerSFArr;
                    }
                    if(content.answerPosArr) {
                        DaAnData.getInstance().answerPosArr = content.answerPosArr;
                    }
                    if(content.answerOneNum) {
                        DaAnData.getInstance().answerOneNum = content.answerOneNum;
                    }
                    this.initData();
                    this.loadSourcePFArr(); 
                    this.creatPicBoard();
                    this.creatAnswerBoard();
                }
            } else {
                
            }
        }.bind(this), null);
    }
    backButton(){
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
    }
    submitButton(){
        UIManager.getInstance().openUI(SubmissionPanel,201);
    }

}
