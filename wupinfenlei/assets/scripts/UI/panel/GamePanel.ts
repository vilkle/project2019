import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager"
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import {DaAnData} from "../../Data/DaAnData";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Node)
    private progressNode : cc.Node = null;


    private types : number = 0;
    private typetype : number[] = [];
    private checkpointsNum : number = 0;
    private typeDataArr : boolean[] = [];
    private sourceSFArr : cc.SpriteFrame[] = [];
    private ItemNodeArr : cc.Node[] = [];

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
        this.createItem(1);
        this.progressBar(1, this.checkpointsNum);
    }

    createAnswerBoard() {
        
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
        this.postItem();
    }

    postItem() {
        let num = this.ItemNodeArr.length;
        let upNum = Math.ceil(num/2);
        let downNum = Math.floor(num/2);
        let upY = 350;
        let downY = 190;
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
