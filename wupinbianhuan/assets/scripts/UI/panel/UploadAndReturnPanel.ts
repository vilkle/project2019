import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import GamePanel from "./GamePanel";
import SubmissionPanel from "./SubmissionPanel";
import { OverTips } from "../Item/OverTips";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
import { DaAnData } from "../../Data/DaAnData";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UploadAndReturnPanel extends BaseUI {

    protected static className = "UploadAndReturnPanel";

    start() {

    }

    onFanHui() {
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0}); 
        UIManager.getInstance().closeUI(GamePanel);
        UIManager.getInstance().closeUI(UploadAndReturnPanel);
        UIManager.getInstance().closeUI(SubmissionPanel)
        UIManager.getInstance().closeUI(OverTips);
        AudioManager.getInstance().stopAll();
    }

    onTiJiao() {
        if(DaAnData.getInstance().submitEnable) {
            UIManager.getInstance().openUI(SubmissionPanel,null,210);
        }else {
            UIHelp.showTip('请通关后进行保存。');
        }  
    }
}