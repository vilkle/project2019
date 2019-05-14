import { BaseUI } from "../BaseUI";
import { ListenerType } from "../../Data/ListenerType";
import { ListenerManager } from "../../Manager/ListenerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnswerItem extends BaseUI {
    protected static className = "AnswerItem";

    @property(cc.EditBox)
    label: cc.EditBox = null;

    @property(cc.Button)
    jiaBtn: cc.Button = null;

    @property(cc.Button)
    jieBtn: cc.Button = null;


    @property(cc.Node)
    btnNode: cc.Node = null;

    textString: string = "";

    lastString: string = "";

    index: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    public onJiaBtnClick() {
        ListenerManager.getInstance().trigger(ListenerType.OnDaAnZengJia, { index: this.index });

    }

    public onJieBtnClick() {
        ListenerManager.getInstance().trigger(ListenerType.OnDaAnShanChu, { index: this.index, node: this.node });

    }

    /**
     *  
     * @param type 
     *  0= 全部按钮隐藏
     *  1= 添加按钮不可用
     *  2= 删除按钮不可用
     */
    public setBtn(type) {
        this.jiaBtn.interactable = true;
        this.jieBtn.interactable = true;
        this.btnNode.active = true;
        if (type == 1) {
            this.jiaBtn.interactable = false;
        } else if (type == 2) {
            this.jieBtn.interactable = false;
        } else if (type == 0) {
            this.btnNode.active = false;
        }
    }

    public editingEnded(event) {
        this.textString = this.label.string;
        ListenerManager.getInstance().trigger(ListenerType.OnEndOfInput, { text: this.textString, index: this.index });
    }

    public setText(str) {
        this.label.string = str;
    }

    onDestroy() {

    }

    // update (dt) {}
}
