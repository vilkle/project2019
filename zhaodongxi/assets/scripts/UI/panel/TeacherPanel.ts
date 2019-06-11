import { BaseUI, UIClass } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { LogWrap } from "../../Utils/LogWrap";
import {picType, scopeRange, DaAnData} from "../../Data/DaAnData";
import { ConstValue } from "../../Data/ConstValue";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
import { UIHelp } from "../../Utils/UIHelp";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property([cc.Toggle])
    private toggleContainer : cc.Toggle[] = [];
    @property(cc.EditBox)
    private checkpointEditbox : cc.EditBox = null;
    @property(cc.Toggle)
    private animalToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private foodToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private figureToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private dailyuseToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private numberToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private stationeryToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private clothesToggle : cc.Toggle = null;
    @property(cc.Toggle)
    private letterToggle : cc.Toggle = null;
    @property(cc.Button)
    private choicescopeButton : cc.Button = null;
    @property(cc.Button)
    private submissionButton : cc.Button = null;
    @property(cc.Node)
    private tipNode : cc.Node = null;
    private sourceSFLenth : number = 0;  
  
    onLoad () {
    }

    start() {
        this.getNet();
        cc.log('------picArr', DaAnData.getInstance().picArr);
    }

    initData() {
        if(DaAnData.getInstance().types == 1) {
            this.toggleContainer[0].isChecked = true;
        }else if(DaAnData.getInstance().types == 2) {
            this.toggleContainer[1].isChecked = true;
        }
        if(DaAnData.getInstance().checkpointsNum) {
            this.checkpointEditbox.string = String(DaAnData.getInstance().checkpointsNum);
        }
        this.animalToggle.isChecked = false;
        for(let i = 0; i < DaAnData.getInstance().picArr.length; i++) {
            if(DaAnData.getInstance().picArr[i] == picType.animal) {
                 this.animalToggle.isChecked = true;
                 this.sourceSFLenth += 8;
            }else if(DaAnData.getInstance().picArr[i] == picType.clothes) {
                this.clothesToggle.isChecked = true;
                this.sourceSFLenth += 8;
            }else if(DaAnData.getInstance().picArr[i] == picType.food) {
                this.foodToggle.isChecked = true;
                this.sourceSFLenth += 8;
            }else if(DaAnData.getInstance().picArr[i] == picType.dailyuse) {
                this.dailyuseToggle.isChecked = true;
                this.sourceSFLenth += 8;
            }else if(DaAnData.getInstance().picArr[i] == picType.figure) {
                this.figureToggle.isChecked = true;
                this.sourceSFLenth += 8;
            }else if(DaAnData.getInstance().picArr[i] == picType.letter) {
                this.letterToggle.isChecked = true;
                this.sourceSFLenth += 26;
            }else if(DaAnData.getInstance().picArr[i] == picType.number) {
                this.numberToggle.isChecked = true;
                this.sourceSFLenth += 10;
            }else if(DaAnData.getInstance().picArr[i] == picType.stationery) {
                this.stationeryToggle.isChecked = true;
                this.sourceSFLenth += 8;
            }
        }
        if(DaAnData.getInstance().range) {
            this.choicescopeButton.node.getChildByName("Label").getComponent(cc.Label).string = scopeRange[DaAnData.getInstance().range]; 
        }
       
    }
    
   

    //上传课件按钮
    onBtnSaveClicked() {
        // let openPanel: UIClass<BaseUI> = GamePanel;
        // UIManager.getInstance().openUI(openPanel);

        // if(this.errorChecking()){
        //     UIManager.getInstance().showUI(SubmissionPanel); 
        // }
        cc.log('------picArr', DaAnData.getInstance().picArr);
        if(this.errorChecking()) {
                UIManager.getInstance().showUI(GamePanel, () => {
                    ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
            });
        }
       
    }

    tips() {
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
            break
        }
    }

    animal(toggle) {
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.animal) == -1) {
                DaAnData.getInstance().picArr.push(picType.animal);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.animal) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.animal);
                this.sourceSFLenth -= 8;
            }  
        }
    }
    food(toggle) {
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.food) == -1) {
                DaAnData.getInstance().picArr.push(picType.food);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.food) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.food);
                this.sourceSFLenth -= 8;
            }  
        }
    }

    figure(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.figure) == -1) {
                DaAnData.getInstance().picArr.push(picType.figure);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.figure) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.figure);
                this.sourceSFLenth -= 8;
            }  
        }
    }
    dailyuse(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.dailyuse) == -1) {
                DaAnData.getInstance().picArr.push(picType.dailyuse);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.dailyuse) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.dailyuse);
                this.sourceSFLenth -= 8;
            }  
        }
    }
    number(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.number) == -1) {
                DaAnData.getInstance().picArr.push(picType.number);
                this.sourceSFLenth += 10;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.number) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.number);
                this.sourceSFLenth -= 10;
            }  
        }
    }
    stationery(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.stationery) == -1) {
                DaAnData.getInstance().picArr.push(picType.stationery);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.stationery) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.stationery);
                this.sourceSFLenth -= 8;
            }  
        }
    }
    clothes(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.clothes) == -1) {
                DaAnData.getInstance().picArr.push(picType.clothes);
                this.sourceSFLenth += 8;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.clothes) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.clothes);
                this.sourceSFLenth -= 8;
            }  
        }
    }
    letter(toggle){
        if(toggle.isChecked) {
            if(DaAnData.getInstance().picArr.indexOf(picType.letter) == -1) {
                DaAnData.getInstance().picArr.push(picType.letter);
                this.sourceSFLenth += 26;
            }  
        }
        else{
            if(DaAnData.getInstance().picArr.indexOf(picType.letter) != -1) {
                DaAnData.getInstance().picArr = DaAnData.getInstance().picArr.filter(item => item !== picType.letter);
                this.sourceSFLenth -= 26;
            }  
        }
    }
    errorChecking():Boolean {
        // var whatever;
        // this.editBoxEndEditing(whatever);
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
            cc.log('err----------', err);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                   
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
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
                        this.initData();
                    } else {
                        
                    }
                }
            }
        }.bind(this), null);
    }
      //删除课件数据  一般为脏数据清理
      ClearNet() {
        let jsonData = { courseware_id: NetWork.courseware_id };
        NetWork.getInstance().httpRequest(NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
    }
}
