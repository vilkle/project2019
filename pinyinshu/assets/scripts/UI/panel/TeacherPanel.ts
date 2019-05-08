import { BaseUI, UIClass } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { LogWrap } from "../../Utils/LogWrap";
import {DaAnData} from "../../Data/DaAnData";
import { ConstValue } from "../../Data/ConstValue";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.EditBox)
    checkpointsEditBox : cc.EditBox;
    @property(cc.EditBox)
    NumEditBox : cc.EditBox;
    @property(cc.Button)
    submissonButton : cc.Button;
    @property(cc.Node)
    tipNode : cc.Node;
  
    onLoad () {
        this.getNet();
    }

    start() {
        
    }

    update() {

    }

    initData() {
        this.checkpointsEditBox.string = String(DaAnData.getInstance().checkpointsNum);
        this.NumEditBox.string = String(DaAnData.getInstance().number);
    }

    ShowTips(tipString : string) {
        this.tipNode.active = true;
        this.tipNode.getChildByName("label").getComponent(cc.Label).string = tipString;
        this.tipNode.getChildByName("layout").on(cc.Node.EventType.TOUCH_START, function(e) {
            e.stopPropagation();
        });
    }

    closeTip() {
        this.tipNode.active = false;
    }

    button() {
        cc.log("checkpoint num", DaAnData.getInstance().checkpointsNum, DaAnData.getInstance().number);
        if(this.errorChecking()) {
            UIManager.getInstance().showUI(GamePanel, () => {
                ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
        });
    }
    }

    checkpointEditingEnd(sender) {
        var text = this.checkpointsEditBox.string;
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
               this.checkpointsEditBox.string = '';
               DaAnData.getInstance().checkpointsNum = 0;
            break
        }
    }

    numberEditingEnd(sender) {
        DaAnData.getInstance().number = 0;
        var text = this.NumEditBox.string;
        var num = Number(text);
        if(num > 0) {
            DaAnData.getInstance().number = num;
        }else {
            this.NumEditBox.string = '';
            DaAnData.getInstance().number = 0;

        }
    }

    errorChecking():boolean {
        if(DaAnData.getInstance().checkpointsNum == 0) {
            this.ShowTips("关卡数不能为空，请输入关卡数。");
            return false;
        }else if(DaAnData.getInstance().number == 0) {
            this.ShowTips("被分解质因数的数不能为空。");
            return false;
        }else {
            return true;
        }

    }
    
    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                } else {
                   let data = JSON.parse(response_data.data.courseware_content);
                   DaAnData.getInstance().number = data.number;
                   DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                   cc.log("number is", DaAnData.getInstance().number);
                   cc.log("checkpointsNum is ", DaAnData.getInstance().checkpointsNum);
                   this.initData();
                }
            } 
        }.bind(this), null);
    }
}
