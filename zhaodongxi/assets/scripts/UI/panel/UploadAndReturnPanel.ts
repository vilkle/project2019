import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import GamePanel from "./GamePanel";
import SubmissionPanel from "./SubmissionPanel";
import { DaAnData } from "../../Data/DaAnData";
import { UIHelp } from "../../Utils/UIHelp";
import {ListenerManager} from "../../Manager/ListenerManager"
import {ListenerType} from "../../Data/ListenerType"
import { AudioManager } from "../../Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UploadAndReturnPanel extends BaseUI {

    protected static className = "UploadAndReturnPanel";

    start() {

    }

    onFanHui() {
        DaAnData.getInstance().submitEnable = false;
        UIManager.getInstance().closeUI(GamePanel);
        UIManager.getInstance().closeUI(UploadAndReturnPanel);
        AudioManager.getInstance().stopAll();
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0})
    }

    onTiJiao() {
        if(DaAnData.getInstance().submitEnable) {
            UIManager.getInstance().openUI(SubmissionPanel,201);
        }else {
            UIHelp.showTip('请通关后进行保存');
        }
       
    }
}
