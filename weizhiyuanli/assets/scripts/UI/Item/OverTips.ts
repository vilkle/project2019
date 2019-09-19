import { BaseUI } from "../BaseUI";
import { Tools } from "../../UIComm/Tools";
import { UIManager } from "../../Manager/UIManager";
import { AudioManager } from "../../Manager/AudioManager";


export enum Type_Tile {
    ZuoDaJieShu,
    ChuangGuanChengGong,
    TiaoZhanJieShu,
    TiaoZhanChengGong,
    ChuangGuanJieShu
}

export const DefalutTitle = ["作答结束", "闯关成功", "挑战结束", "挑战成功", "闯关结束"];

let FontMap = {
    "作": "img_zuo",
    "答": "img_da",
    "结": "img_jie",
    "束": "img_shu",
    "成": "img_cheng",
    "功": "img_gong",
    "挑": "img_tiao",
    "战": "img_zhan",
    "闯": "img_chuang",
    "关": "img_guan",
};


const { ccclass, property } = cc._decorator;
@ccclass
export class OverTips extends BaseUI {

    protected static className = "OverTips";

    @property(cc.Label)
    private label_tip: cc.Label = null;

    @property(sp.Skeleton)
    private spine_false: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_true: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_complete: sp.Skeleton = null;
    @property(cc.Label)
    private buttonLabel: cc.Label = null;
    @property(cc.Node)
    private button: cc.Node = null
    private callback = null;
    private btnCallback = null;
    private endInAnimationOver: boolean = false;
    private img_titles: cc.Node[] = [];

    constructor() {
        super();
    }

    onLoad() {
        cc.loader.loadRes("images/OverTips/word", cc.SpriteAtlas, function (err, atlas) { });
    }

    start() {
       
    }

    onDisable() {
        
    }

    /**
     设置显示内容
     @param {number} type          0: 错误  1：答对了  2：闯关成功(一直显示不会关闭)
     @param {string} str           提示内容
     */
    init(type: number, str: string = "", isButton: boolean = false, btnStr:string = '', callback: Function, btnCallback: Function,endTitle?: string): void {
        this.callback = callback;
        this.spine_false.node.active = type == 0;
        this.spine_true.node.active = type == 1;
        this.spine_complete.node.active = type == 2;
        this.label_tip.string = str; 
        this.label_tip.node.active = true
       
        if(isButton) {
            this.button.active = true;
        }else {
            this.button.active = false;
        }
        this.buttonLabel.string = btnStr
        this.btnCallback = btnCallback;
        switch (type) {
            case 0:
                Tools.playSpine(this.spine_false, "false", false, this.delayClose.bind(this));
                AudioManager.getInstance().playSound("sfx_genneg", false, 1);
                break;
            case 1:
                Tools.playSpine(this.spine_true, "true", false, this.delayClose.bind(this));
                AudioManager.getInstance().playSound("sfx_genpos", false, 1);
                break;
            case 2:
                this.spine_complete.node.active = false;
                if (!endTitle) endTitle = DefalutTitle[0];
                if (endTitle.length != 4) return;
                for (let index = 0; index < 4; index++) {
                    this.createTitleImage(endTitle[index]);
                }
                break;
        }
        let endPos = this.label_tip.node.position;
        let framePos_1 = cc.v2(endPos.x, endPos.y - 72.8);
        let framePos_2 = cc.v2(endPos.x, endPos.y + 12);
        let framePos_3 = cc.v2(endPos.x, endPos.y - 8);
        let framePos_4 = cc.v2(endPos.x, endPos.y + 7.3);
        this.label_tip.node.position = framePos_1;
        this.label_tip.node.runAction(cc.sequence(cc.moveTo(0.08, framePos_2), cc.moveTo(0.08, framePos_3), cc.moveTo(0.08, framePos_4), cc.moveTo(0.06, endPos)));
    }

    delayClose(): void {
        this.scheduleOnce(function () { this.onClickClose() }.bind(this), 0);
    }

    onButtonCallback() {
        AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        this.btnCallback();
        UIManager.getInstance().closeUI(OverTips)
    }

    onClickClose(event?, customEventData?): void {
        if (event) AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        if (this.callback) this.callback();
        UIManager.getInstance().closeUI(OverTips);
    }

    createTitleImage(titleName: string) {
        cc.loader.loadRes("images/OverTips/word", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                console.log(err.message || err);
                return;
            }
            let spriteFrame = atlas.getSpriteFrame(FontMap[titleName]);
            let imageNode = new cc.Node();
            let image = imageNode.addComponent(cc.Sprite);
            image.spriteFrame = spriteFrame;
            imageNode.parent = this.node;
            this.img_titles.push(imageNode);
            if (this.img_titles.length == 4) {
                this.endInAnimationOver = true;
                this.spine_complete.node.active = true;
                Tools.playSpine(this.spine_complete, "in", false, () => {
                    Tools.playSpine(this.spine_complete, "stand", true);
                    this.endInAnimationOver = false;
                });
                AudioManager.getInstance().playSound("sfx_geupgrd", false, 1);
            }
        }.bind(this));
    }

    update() {
        if (!this.endInAnimationOver) return;

        let bone = this.spine_complete.findBone("paipai");
        let bone1 = this.spine_complete.findBone("xiaoU");
        let bone2 = this.spine_complete.findBone("mimiya");
        let bone3 = this.spine_complete.findBone("doudou");

        this.img_titles[0].position = cc.v2(bone.worldX - 139, bone.worldY - 135);
        this.img_titles[1].position = cc.v2(bone1.worldX - 139, bone1.worldY - 135);
        this.img_titles[2].position = cc.v2(bone2.worldX - 139, bone2.worldY - 135);
        this.img_titles[3].position = cc.v2(bone3.worldX - 139, bone3.worldY - 135);
    }
}
