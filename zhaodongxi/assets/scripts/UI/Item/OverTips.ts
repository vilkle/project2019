
import { BaseUI } from "../BaseUI";
import { Tools } from "../../UIComm/Tools";
import { UIManager } from "../../Manager/UIManager";
import { GameMain } from "../../Main/GameMain";

const {ccclass, property} = cc._decorator;
@ccclass
export  class OverTips extends BaseUI {

    protected static className = "OverTips";
    
    @property(cc.Node)
    private NodeDes: cc.Node = null; //描述节点
    @property(cc.Label)
    private des: cc.Label= null;
    @property(cc.Layout)
    private layout :cc.Layout = null;
    @property(cc.Button)
    private close: cc.Button= null;
    @property(sp.Skeleton)
    private sp_BgAnimator: sp.Skeleton= null; // 背景动画
    @property(sp.Skeleton)
    private sp_lightAnimator: sp.Skeleton= null; // 光动画

    private callback = null;
    private type:number;
    start () {

    }

    //type 成功 1 失败 2
    init(type:number, str:string, callback:any) {
        this.type = type;
        //this.callback = callback;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);
        
        this.NodeDes.setScale(0.001, 0.001);
        this.callback = callback;
        if (type == 1) {
            this.Successful(str);
            this.close.node.active = true;
        } else if (type == 2) {
           this.failure(str);
           this.close.node.active = true;
        }

        this.TipsAnimatorScale(this.NodeDes);
        this.layout.node.on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });

    }

     //成功
     Successful(str:string) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = true;
        // Tools.playSpine(this.sp_BgAnimator, "fault", false);
        Tools.playSpine(this.sp_BgAnimator, "right", false, function () {
            // console.log("播发完成");
        });
        Tools.playSpine(this.sp_lightAnimator, "light", false, function () {
        }.bind(this));
        this.des.string = str;
        this.des.node.color = new cc.Color(39, 178, 187);
    }

    //失败
    failure(str:string) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = false;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string = str;
        // this.des.node.color = new cc.Color(39, 178, 187);
    }

    OnClickClose() {
        
        this.callback();
        UIManager.getInstance().closeUI(OverTips);
        
       // this.node.active = false;
    }

     //通用动画
     TipsAnimatorScale(nodeObj:cc.Node){
        nodeObj.stopAllActions();
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.2, 1, 1),
            );
           nodeObj.runAction(seq);
         // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));

    }

    // update (dt) {}
}
