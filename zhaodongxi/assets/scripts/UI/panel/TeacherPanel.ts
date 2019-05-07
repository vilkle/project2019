import { BaseUI, UIClass } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { LogWrap } from "../../Utils/LogWrap";
import {picType, scopeRange, DaAnData} from "../../Data/DaAnData";
import { ConstValue } from "../../Data/ConstValue";
import GamePanel from "./GamePanel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property([cc.Toggle])
    toggleContainer : cc.Toggle[] = [];
    @property(cc.EditBox)
    checkpointEditbox : cc.EditBox;
    @property(cc.Toggle)
    animalToggle : cc.Toggle;
    @property(cc.Toggle)
    foodToggle : cc.Toggle;
    @property(cc.Toggle)
    figureToggle : cc.Toggle;
    @property(cc.Toggle)
    dailyuseToggle : cc.Toggle;
    @property(cc.Toggle)
    numberToggle : cc.Toggle;
    @property(cc.Toggle)
    stationeryToggle : cc.Toggle;
    @property(cc.Toggle)
    clothesToggle : cc.Toggle;
    @property(cc.Toggle)
    letterToggle : cc.Toggle;
    @property(cc.Button)
    choicescopeButton : cc.Button;
    @property(cc.Button)
    submissionButton : cc.Button;
    @property(cc.Node)
    tipNode : cc.Node;
    
  
    onLoad () {
    }

    start() {
        cc.log("2222222", this.checkpointEditbox.string);
        this.getNet();
    }

    initData() {
        if(DaAnData.getInstance().types == 1) {
            this.toggleContainer[0].isChecked = true;
        }else if(DaAnData.getInstance().types == 2) {
            this.toggleContainer[1].isChecked = true;
        }
        this.checkpointEditbox.string = String(DaAnData.getInstance().checkpointsNum);
        this.animalToggle.isChecked = false;
        for(let i = 0; i < DaAnData.getInstance().picArr.length; i++) {
            if(DaAnData.getInstance().picArr[i] == picType.animal) {
                 this.animalToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.clothes) {
                this.clothesToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.food) {
                this.foodToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.dailyuse) {
                this.dailyuseToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.figure) {
                this.figureToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.letter) {
                this.letterToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.number) {
                this.numberToggle.isChecked = true;
            }else if(DaAnData.getInstance().picArr[i] == picType.stationery) {
                this.stationeryToggle.isChecked = true;
            }
        }
        cc.log("iiiii", DaAnData.getInstance().range);
        cc.log("rang", scopeRange[DaAnData.getInstance().range]);
        this.choicescopeButton.node.getChildByName("Label").getComponent(cc.Label).string = scopeRange[DaAnData.getInstance().range]; 
    }
    
    

    //上传课件按钮
    onBtnSaveClicked() {
        // let openPanel: UIClass<BaseUI> = GamePanel;
        // UIManager.getInstance().openUI(openPanel);

        // if(this.errorChecking()){
        //     UIManager.getInstance().showUI(SubmissionPanel); 
        // }
        if(this.errorChecking()) {
                UIManager.getInstance().showUI(GamePanel, () => {
                cc.log("test game panel");
            });
        }
       
    }

    tips() {
        cc.log(DaAnData.getInstance().picArr);
        this.tipNode.active = true;
        this.tipNode.getChildByName("layout").on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
    }

    onBtnSureClicked() {
        this.tipNode.active = false;
    }

    onBtnChoicescopeClicked() {
        this.choicescopeButton.interactable = false;
        this.choicescopeButton.node.getChildByName("layout").on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
        var layout = this.choicescopeButton.node.getChildByName("mask").getChildByName("layout");
        var move = cc.moveBy(0.3, 0, -300);
        layout.runAction(move);
    }    

    ChoicescopeOverClicked() {
        this.choicescopeButton.interactable = true;
        this.choicescopeButton.node.getChildByName("layout").off(cc.Node.EventType.TOUCH_START);
        var layout = this.choicescopeButton.node.getChildByName("mask").getChildByName("layout");
        var move = cc.moveBy(0.3, 0, 300);
        layout.runAction(move);
        var label = this.choicescopeButton.node.getChildByName("Label").getComponent(cc.Label);
        var range = DaAnData.getInstance().range; 
        label.string = scopeRange[range];
        cc.log("range is :", DaAnData.getInstance().range);
    }    

    FOUR_FOUR(){
        DaAnData.getInstance().range = 1;
        this.ChoicescopeOverClicked();
    }
    FOUR_FIVE(){
        DaAnData.getInstance().range = 2;
        this.ChoicescopeOverClicked();
    }
    FOUR_SIX(){
        DaAnData.getInstance().range = 3;
        this.ChoicescopeOverClicked();
    }
    FOUR_SEVEN(){
        DaAnData.getInstance().range = 4;
        this.ChoicescopeOverClicked();
    }
    FOUR_EIGHT(){
        DaAnData.getInstance().range = 5;
        this.ChoicescopeOverClicked();
    }
    FIVE_FOUR(){
        DaAnData.getInstance().range = 6;
        this.ChoicescopeOverClicked();
    }
    FIVE_FIVE(){
        DaAnData.getInstance().range = 7;
        this.ChoicescopeOverClicked();
    }
    FIVE_SIX(){
        DaAnData.getInstance().range = 8;
        this.ChoicescopeOverClicked();
    }
    FIVE_SEVEN(){
        DaAnData.getInstance().range = 9;
        this.ChoicescopeOverClicked();
    }
    FIVE_EIGHT(){
        DaAnData.getInstance().range = 10;
        this.ChoicescopeOverClicked();
    }

    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index){
            case 0:
                DaAnData.getInstance().types = 1;
                break;
            case 1:
                DaAnData.getInstance().types = 2;
                break;
            default:
                break
        }
        cc.log("type is :", DaAnData.getInstance().types);
    }
    
    editBoxEndEditing(sender) {
        var text = this.checkpointEditbox.string;
        switch(text){
            case "1":
                DaAnData.getInstance().checkpointsNum = 1;
                break;
            case "2":
                DaAnData.getInstance().checkpointsNum = 2;
                break;
            case "3":
                DaAnData.getInstance().checkpointsNum = 3;
                break;
            case "4":
                DaAnData.getInstance().checkpointsNum = 4;
                break;
            default:
               text = "";
               this.checkpointEditbox.string = '';
               DaAnData.getInstance().checkpointsNum = 0;
               cc.log("checkpoints nu is =======");
            break
        }
    }

    animal(toggle) {
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.animal);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.animal);
        }
    }
    food(toggle) {
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.food);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.food);
        }
    }

    figure(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.figure);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.figure);
        }
    }
    dailyuse(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.dailyuse);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.dailyuse);
        }
    }
    number(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.number);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.number);
        }
    }
    stationery(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.stationery);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.stationery);
        }
    }
    clothes(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.clothes);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.clothes);
        }
    }
    letter(toggle){
        if(toggle.isChecked) {
            DaAnData.getInstance().picArr.push(picType.letter);
        }
        else{
            DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.letter);
        }
    }
    errorChecking():Boolean {
        // var whatever;
        // this.editBoxEndEditing(whatever);
        cc.log("------checkpoint num is ", DaAnData.getInstance().checkpointsNum);
        if(DaAnData.getInstance().checkpointsNum == 0) {
            this.tipNode.getChildByName("tipLabel").getComponent(cc.Label).string = "请填写关卡数量，不能为空。";
            this.tips();
            return false;
        }else if(DaAnData.getInstance().picArr.length == 0) {
            this.tipNode.getChildByName("tipLabel").getComponent(cc.Label).string = "请选择区域种类，不能为空。";
            this.tips();
            return false;
        }else if(DaAnData.getInstance().range == 0) {
            this.tipNode.getChildByName("tipLabel").getComponent(cc.Label).string = "请选择区域范围，不能为空。";
            this.tips();
            return false;
        }else{
            return true;
        }
    }
    
    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                    cc.log("no last=========");
                } else {
                   cc.log("respoinse---------",response_data);
                   let data = JSON.parse(response_data.data.courseware_content);
                    cc.log("data ", data);
                    cc.log("data types", data.types);

                   if(data.types) {
                        DaAnData.getInstance().types = data.types;
                        cc.log("data types", DaAnData.getInstance().types);
                   }
                   if(data.checkpointsNum) {
                        DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                        cc.log("data checkpointsNum", DaAnData.getInstance().checkpointsNum);
                   }
                    if(data.range) {
                        DaAnData.getInstance().range = data.range;
                        cc.log("data range", DaAnData.getInstance().range);
                    }
                    if(data.picArr) {
                        DaAnData.getInstance().picArr = data.picArr;
                        cc.log("data picarr", DaAnData.getInstance().picArr);
                    }
                    this.initData();
                }
            } 
        }.bind(this), null);
    }
}
