import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export class AffirmTips extends BaseUI {

    protected static className = "AffirmTips";

    @property(cc.Node)
    private NodeDes: cc.Node = null; //描述节点
    @property(cc.Label)
    private title: cc.Label = null;
    @property(cc.Label)
    private des: cc.Label = null;
    @property(cc.Button)
    private close: cc.Button = null;
    @property(cc.Button)
    private ok: cc.Button = null;
    @property(cc.Label)
    private btnCloseLabel: cc.Label = null;
    @property(cc.Label)
    private btnOkLabel: cc.Label = null;
    @property(cc.Node)
    private win: cc.Node = null; //描述节点
    @property(cc.Node)
    private fail: cc.Node = null; //描述节点

    private callbackClose = null;
    private callbackOk = null;

    private type: number;
    start() {

    }

    //type 成功 1 失败 2
    init(type: number, des: string, time ?: number,btnCloselDes?: string, btnOkDes?: string, callbackClose ?: any,callbackOk ?: any) {
        this.title.node.active = true;
        this.des.node.active = false;
        cc.log(type, des, time, btnCloselDes, btnOkDes, callbackClose, callbackOk);
        if(time >= 0){
            this.des.node.active = true;
            let minutes = 0;
            let second = 0;
            minutes = time / 60 >> 0;
            second = time % 60;
            let minStr = String(minutes);
            let secStr = String(second);
            if(minutes < 10) {
                minStr = "0" + minStr;
            }
            if(second < 10) {
                secStr = "0" + secStr;
            }
            let timeStr = minStr + ' : ' + secStr;
            this.des.string = timeStr;
        }
        this.win.active = type == 1;
        this.fail.active = type == 2;
        this.type = type;
        this.callbackClose = callbackClose;
        //console.log("到了初始化");
        //Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.title.string = des;
        this.callbackOk = callbackOk;
       
        if (btnCloselDes) {
            btnCloselDes == "" ? "取消" : btnCloselDes;
            this.btnCloseLabel.string = btnCloselDes;
        }
        if (btnOkDes) {
            btnOkDes == "" ? "确定" : btnOkDes;
            this.btnOkLabel.string = btnOkDes;
        }

    }

    setOnlyOneBtnType(btnOkDes?: string) {
        this.close.node.active = false;
        this.ok.node.active = true;
        this.ok.node.position = cc.v2(0, this.ok.node.position.y);
        if (btnOkDes) {
            btnOkDes == "" ? "确定" : btnOkDes;
            this.btnOkLabel.string = btnOkDes;
            if (btnOkDes.length > 4) this.btnOkLabel.fontSize = 40;
        }
    }


    OnClickClose() {

        //console.log("关闭");
    }

    //通用动画
    TipsAnimatorScale(nodeObj: cc.Node) {
        nodeObj.stopAllActions();
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.2, 1, 1),
        );
        nodeObj.runAction(seq);
        // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));
    }



    //ok 1 确认 0 取消
    OnClickOk() {
        console.log("确认");
        UIManager.getInstance().closeUI(AffirmTips);
        if(this.callbackOk) {
            this.callbackOk();
        }
    }

    OnClickCancel() {
        console.log("取消");
        UIManager.getInstance().closeUI(AffirmTips);
        if(this.callbackClose) {
            this.callbackClose();
        }
    }

    // update (dt) {}
}
