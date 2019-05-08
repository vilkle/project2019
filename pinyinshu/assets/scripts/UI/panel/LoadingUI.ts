import { BaseUI, UIClass } from "../BaseUI";
import { ConstValue } from "../../Data/ConstValue";
import TeacherPanel from "./TeacherPanel";
import GamePanel from "./GamePanel";
import { UIManager } from "../../Manager/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingUI extends BaseUI {

    protected static className = "LoadingUI";

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;
    @property(cc.Node)
    private dragonNode: cc.Node = null;

    onLoad() {
        cc.log("enterLoadingUI========");
        let onProgress = (completedCount: number, totalCount: number, item: any) => {
            this.progressBar.progress = completedCount / totalCount;
            let value = Math.round(completedCount / totalCount * 100);
            if (ConstValue.IS_EDITIONS) {
                cc.log("is editions======");
                courseware.page.sendToParent('loading', value);
            }
            this.progressLabel.string = value.toString() + '%';
            let posX = completedCount / totalCount * 609 - 304;
            this.dragonNode.x = posX;
        };
        if (ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('load start');
        }
        let openPanel: UIClass<BaseUI> = ConstValue.IS_TEACHER ? TeacherPanel : GamePanel;
        UIManager.getInstance().openUI(openPanel, 0, () => {

            if (ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('load end');
                courseware.page.sendToParent('start');
            }
            cc.log("enter techerpanel=====");
            this.node.active = false;
        }, onProgress);
    }
}