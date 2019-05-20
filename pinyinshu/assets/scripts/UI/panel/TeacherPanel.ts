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
    checkpointsEditBox : cc.EditBox = null;
    @property(cc.Node)
    editBoxNode : cc.Node = null;
    @property(cc.Button)
    submissonButton : cc.Button = null;
    @property(cc.Node)
    tipNode : cc.Node = null;
    @property(cc.Prefab)
    editbox2 : cc.Prefab = null;
    editboxArr : Array<cc.Node> = Array<cc.Node>();
    onLoad () {
        this.getNet();
        this.initData();
    }

    start() {
        
    }

    update() {

    }

    initData() {
        this.checkpointsEditBox.string = String(DaAnData.getInstance().checkpointsNum);
        this.checkpointEditingEnd(null);
        cc.log('checkpointsnum is =',DaAnData.getInstance().checkpointsNum);
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
        cc.log("checkpoint num", DaAnData.getInstance().checkpointsNum, DaAnData.getInstance().numberArr);
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
        for(let i = 0; i < this.editboxArr.length; i++) {
            this.editboxArr[i].destroy();
        }
        for(let i = 0; i < parseInt(this.checkpointsEditBox.string); i++) {
            let editbox = cc.instantiate(this.editbox2);
            editbox.x = 0;
            this.editboxArr.push(editbox);
            editbox.parent = this.editBoxNode;
            editbox.getChildByName('label').getComponent(cc.Label).string = (i + 1).toString();
            editbox.on('editing-did-ended', function(sender){
                DaAnData.getInstance().numberArr[i] = parseInt(editbox.getComponent(cc.EditBox).string);
                cc.log(DaAnData.getInstance().numberArr);
            }.bind(this));
            if(DaAnData.getInstance().numberArr[i]) {
                editbox.getComponent(cc.EditBox).string = DaAnData.getInstance().numberArr[i].toString();
            }
        }
    }

    errorChecking():boolean {
        if(DaAnData.getInstance().checkpointsNum == 0) {
            this.ShowTips("关卡数不能为空，请输入关卡数。");
            return false;
        }else if(DaAnData.getInstance().numberArr.length <  DaAnData.getInstance().checkpointsNum) {
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
                cc.log('response_data is ',response_data);
                if (response_data.data.courseware_content == null) {
                } else {
                   let data = JSON.parse(response_data.data.courseware_content);
                   DaAnData.getInstance().numberArr = data.numberArr;
                   DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                   cc.log('data is ',data);
                   cc.log("---------number is", DaAnData.getInstance().numberArr);
                   cc.log("---------checkpointsNum is ", DaAnData.getInstance().checkpointsNum);
                   this.initData();
                }
            } 
        }.bind(this), null);
    }
}
