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

    @property(cc.Label)
    label1 : cc.Label;
    @property(cc.Label)
    label2 : cc.Label;
    @property(cc.Button)
    back : cc.Button;
    @property(cc.Button)
    submit : cc.Button;
    @property(cc.Node)
    bg : cc.Node;
    @property(cc.Node)
    picBoard : cc.Node;
    @property(cc.Node)
    answerBoard : cc.Node;
    @property(cc.Node)
    board : cc.Node;
    @property(cc.Button)
    sure : cc.Button;
    @property([cc.SpriteFrame])
    sourceSFArr : cc.SpriteFrame[] = [];
    @property([cc.Node])
    itemArr : cc.Node[] = [];
    @property([cc.Node])
    answerItemArr : cc.Node[] = [];
    dirSFNumArr : Array<number> = new Array<number>();
    answerSFNumArr : Array<number> = new Array<number>();
    answerPosNumArr : Array<number> = new Array<number>();
    playerItemArr : Array<number> = new Array<number>();
    playerItemSFArr : Array<number> = new Array<number>();
    playerErroArr : Array<number> = new Array<number>();//位选中的正确答案
    answerNum : number;
    checkpointsNum : number;
    checkpoints : number;
    horizonNum : number;
    verticalNum : number;
    cueNum : number;
    creatItemNum : number;
    
     onLoad () {
        this.isTecher();
    }

    start() {
    //    this.creatPicBoard();
    //    this.creatAnswerBoard();
    }
   

    onDestroy() {
       
    }

    onShow() {
    }
    // update (dt) {}

    isTecher() {
        if(ConstValue.IS_TEACHER) {
            this.back.node.active = true;
            this.submit.node.active = false
            //this.submit.interactable = false;
            this.initData();
            this.loadSourcePFArr(); 
        }else {
            this.getNet();
            this.back.node.active = false;
            this.submit.node.active = false;
        }
    }

    action(loadItemNum : number) {
        if(loadItemNum == this.horizonNum * this.verticalNum + this.answerNum) {
            this.picBoard.runAction(cc.moveTo(1, cc.v2(-250, 0)));
            this.board.runAction(cc.moveTo(1, cc.v2(0, 0)));
            this.sure.node.runAction(cc.moveTo(1, cc.v2(720, -310)));
            AudioManager.getInstance().playSound("begin", false);
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

    loadDirSFArr() {
        var totalNum = this.horizonNum * this.verticalNum;
        for(let i = 0; i < totalNum; i ++) {
            let randomNum = this.getRandomNum(0, this.sourceSFArr.length - 1);
            this.dirSFNumArr[i] = randomNum;
           
        }
        for(let j = 0; j < this.answerNum; j ++) {
            let num = this.getRandomNum(0, totalNum - 1);;
            let randomNum = this.dirSFNumArr[num];
            while(this.answerSFNumArr.indexOf(randomNum) != -1) {
                 num = this.getRandomNum(0, totalNum - 1);
                 randomNum = this.dirSFNumArr[num];
            }
            this.answerPosNumArr[j] = num;
            this.answerSFNumArr[j] = randomNum 
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
                    item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.sourceSFArr[this.answerSFNumArr[num]];
                }else{
                    this.itemArr[num] = item;
                    this.creatItemNum++;
                    this.action(this.creatItemNum);
                    item.getChildByName("bg").on(cc.Node.EventType.TOUCH_START, function(t){
                            if (item.getChildByName("box").active == false) {
                                if(this.playerItemArr.length < this.answerNum) {
                                    if(this.playerItemSFArr.indexOf(this.dirSFNumArr[num]) == -1) {
                                        if(item.getChildByName("bg").getComponent(cc.Sprite).getState() != 1) {
                                            AudioManager.getInstance().playSound("click", false);
                                            item.getChildByName("box").active = true;
                                            item.zIndex = 10;
                                            this.playerItemArr.push(num);
                                            this.playerItemSFArr.push(this.dirSFNumArr[num]);
                                        }
                                    }
                                }
                            }else {
                                if(this.playerItemArr.length > 0) {
                                    AudioManager.getInstance().playSound("click", false);
                                    item.getChildByName("box").active = false;
                                    item.zIndex = 0;
                                    this.playerItemArr = this.playerItemArr.filter(item => item !== num);
                                    this.playerItemSFArr = this.playerItemSFArr.filter(item => item != this.dirSFNumArr[num]);
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
        for(let i = 0; i < this.playerItemArr.length; i++) {
            if(this.answerSFNumArr.indexOf(this.dirSFNumArr[this.playerItemArr[i]]) == -1) {
                this.itemArr[this.playerItemArr[i]].getChildByName("bg").getComponent(cc.Sprite).setState(1);
                this.itemArr[this.playerItemArr[i]].getChildByName("pic").getComponent(cc.Sprite).setState(1);
            }
        }
        this.playerErroArr = this.answerSFNumArr;
    
        for(let i = 0;i < this.playerItemArr.length; i++) {
            this.playerErroArr =  this.playerErroArr.filter(item => item != this.dirSFNumArr[this.playerItemArr[i]]);
        }
        for(let i = 0; i < this.playerErroArr.length; i++) {
            var index = this.answerSFNumArr.indexOf(this.playerErroArr[i]);
            var seq = cc.sequence(cc.fadeOut(0.2),cc.fadeIn(0.2),cc.fadeOut(0.2), cc.fadeIn(0.2));
            this.itemArr[this.answerPosNumArr[index]].runAction(seq);
            AudioManager.getInstance().playSound("erro", false);
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
    }

    submisson() {
        if(this.playerItemArr.length == 0) {
            return;
        }
        var rightNum = 0;
        for(let i = 0; i < this.playerItemArr.length; i++) {
                if(this.answerSFNumArr.indexOf(this.dirSFNumArr[this.playerItemArr[i]]) != -1) {
                rightNum++;
            }
        }
        if(rightNum == this.answerNum) {
            this.checkpoints++;
            if(this.checkpoints < this.checkpointsNum) {
                UIHelp.showTip("答对了，你真棒！");
                this.nextCheckPoints();
            }else {
                UIHelp.showTip("闯关成功！");
                if(ConstValue.IS_TEACHER) {
                    this.submit.node.active = true;
                }
                //this.submit.interactable = true;
            }
        }else {
            if(this.cueNum == 100){
                return;
            }
            this.cueNum++;
            if(this.cueNum == 3) {
                this.cueNum = 100;
                //UIHelp.showTip("----------啊哦，请再试试吧。");
                this.cueAnswer();
            }else {
                UIHelp.showTip("啊哦，请再试试吧。");
            }
        }
        
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                } else {
                   let data = JSON.parse(response_data.data.courseware_content);

                   if(data.types) {
                        DaAnData.getInstance().types = data.types;
                   }
                   if(data.checkpointsNum) {
                        DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                   }
                    if(data.range) {
                        DaAnData.getInstance().range = data.range;
                    }
                    if(data.picArr) {
                        DaAnData.getInstance().picArr = data.picArr;
                    }
                    this.initData();
                    this.loadSourcePFArr(); 
                    this.creatPicBoard();
                    this.creatAnswerBoard();
                }
            } 
        }.bind(this), null);
    }
    backButton(){
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
    }
    submitButton(){
        UIManager.getInstance().openUI(SubmissionPanel);
    }

}
