
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
    @property(cc.Label)
    private time: cc.Label= null;
    @property(cc.Button)
    private close: cc.Button= null;
    @property(sp.Skeleton)
    private sp_BgAnimator: sp.Skeleton= null; // 背景动画
    @property(sp.Skeleton)
    private sp_lightAnimator: sp.Skeleton= null; // 光动画
    @property(cc.Button)
    private rightButton: cc.Button= null;
    @property(cc.Button)
    private leftButton: cc.Button= null;
    @property(cc.Button)
    private closeButton: cc.Button= null;
    @property(cc.Layout)
    private layout: cc.Layout= null;

    private callback1 = null;
    private callback2 = null;
    private type:number;
    start () {

    }

    //type 通关1 成功 2 失败 3
    init(type:number, time : number, str:string, callback1?:any, callback2?:any) {
        this.type = type;
        //this.callback = callback;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);
        let minutes = time / 60 >> 0;
        let second = time % 60;
        var timestr = '用时 ' + minutes.toString() + ':'+ second.toString();
        this.time.string = timestr;
        this.NodeDes.setScale(0.001, 0.001);
        //this.callback = callback;
        this.layout.node.on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
        this.leftButton.node.active = false;
        this.closeButton.node.active = false;
        this.rightButton.node.active = false;
        if (type == 1) {
            this.Successful(str,1);
            this.close.node.active = false;
            this.callback1 = callback1;
            this.callback2 = callback2;
        } else if (type == 2) {
            this.Successful(str,2);
           this.close.node.active = false; 
           this.callback1 = callback1;
           this.callback2 = callback2;
        }else if(type == 3) {
            this.failure(str);
            this.time.node.active = false;
            this.time.node.active = false;
            this.callback1 = callback1;
            this.close.node.active = true;
        }
        this.TipsAnimatorScale(this.NodeDes);

    }

     //成功
     Successful(str:string, type:number) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = true;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);
        Tools.playSpine(this.sp_BgAnimator, "right_1", false, function () {
           if(type == 1) {
                this.leftButton.node.active = true;
                this.closeButton.node.active = true;
                this.leftButton.node.on('click', this.callback1, this);
                this.closeButton.node.on('click', this.callback2, this);
           }else if(type == 2) {
                this.leftButton.node.active = true;
                this.rightButton.node.active = true;
                this.leftButton.node.on('click', this.callback1, this);
                this.rightButton.node.on('click', this.callback2, this);
           }
        }.bind(this));
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
        this.callback1();
        UIManager.getInstance().closeUI(OverTips);
    
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
