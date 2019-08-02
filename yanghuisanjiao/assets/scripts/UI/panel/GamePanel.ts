import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import ShaderMaterial from "../../shader/ShaderMaterial";
import {AudioManager} from "../../Manager/AudioManager"
import {UIHelp} from "../../Utils/UIHelp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    @property(cc.Node)
    private Fish1 : cc.Node = null
    @property(cc.Node)
    private Fish2 : cc.Node = null;
    @property(cc.Label)
    private questionLabel : cc.Label = null;
    @property(cc.Label)
    private ALabel : cc.Label = null;
    @property(cc.Label)
    private BLabel : cc.Label = null;
    @property(cc.Label)
    private CLabel : cc.Label = null;
    @property(cc.Label)
    private DLabel : cc.Label = null;
    @property(cc.Sprite)
    private ASprite : cc.Sprite = null;
    @property(cc.Sprite)
    private BSprite : cc.Sprite = null;
    @property(cc.Sprite)
    private CSprite : cc.Sprite = null;
    @property(cc.Sprite)
    private DSprite : cc.Sprite = null;
    @property(cc.SpriteFrame)
    private yellowFrame : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private blueFrame : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private redFrame : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private yellowDotFrame : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private greenDotFrame : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private redDotFrame : cc.SpriteFrame = null;
    @property(cc.Node)
    private triangleNode : cc.Node = null;
    @property(cc.Node)
    private bottomNode : cc.Node = null;
    @property(cc.Node)
    private questionNode : cc.Node = null;
    @property(cc.Node)
    private bg : cc.Node = null;
    @property(cc.Node)
    private u_boat : cc.Node = null;

    private answerNodeArr : cc.Node[] = [];
    private checkpoint : number = 1;
    private questionIndex : number = 0;
    private answerIndex : number = 0;
    private isOver : number = 2;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    start() {
        this.bg.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.isOver = 2;
        });
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.answerNodeArr.push(this.ASprite.node);
        this.answerNodeArr.push(this.BSprite.node);
        this.answerNodeArr.push(this.CSprite.node);
        this.answerNodeArr.push(this.DSprite.node);
        this.stockOfFish();
        AudioManager.getInstance().playSound('bgm_underwater', true);
        this.initGame();
    }

    initGame() {
        this.eventvalue.levelData.push({
            subject: null,
            answer: null,
            result: null
        });
        this.u_boat.runAction(cc.moveTo(1, cc.v2(764, -236)));
        this.triangleNode.runAction(cc.fadeIn(0.5));
        this.bottomNode.runAction(cc.fadeIn(0.5));
        this.question1();
    }

    startAction() {
        this.questionNode.opacity = 255;
        let callback = cc.callFunc(()=>{
            this.ASprite.node.runAction(cc.fadeIn(0.3));
            this.BSprite.node.runAction(cc.fadeIn(0.3));
            this.CSprite.node.runAction(cc.fadeIn(0.3));
            this.DSprite.node.runAction(cc.fadeIn(0.3));
            this.touchEnable(true);
        });
        let seq = cc.sequence(cc.scaleTo(0.5,1,1).easing(cc.easeSineOut()), callback);    
        this.questionNode.runAction(seq);
    }   
    
    finishAction(func : Function) {
        let callback = cc.callFunc(()=>{
            this.ASprite.node.opacity = 0;
            this.BSprite.node.opacity = 0;
            this.CSprite.node.opacity = 0;
            this.DSprite.node.opacity = 0;
            this.questionNode.scaleY = 0;
            func();
        });
        let seq = cc.sequence(cc.fadeOut(0.5), callback);
        this.questionNode.runAction(seq);
    }

    touchEnable(enable : boolean) {
        if(enable) {
            for(let i = 0; i < this.answerNodeArr.length; i++) {
                this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_START, ()=>{
                    this.answerNodeArr[i].setScale(0.95);
                    this.answerIndex = i + 1;
                    this.isOver = 2;
                });
                this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_END, ()=>{
                    this.answerNodeArr[i].setScale(1);
                    this.eventvalue.levelData[this.checkpoint-1].answer = this.answerIndex;
                    this.isRight(this.questionIndex);
                    console.log('--', this.eventvalue);
                });
                this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                    this.answerNodeArr[i].setScale(1);   
                });
            }
        }else {
            for(let i = 0; i < this.answerNodeArr.length; i++) {
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_START);
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_END);
                this.answerNodeArr[i].off(cc.Node.EventType.TOUCH_CANCEL);
            }
        }
    }

    stockOfFish() {
        for(let i = 0; i < this.Fish1.children.length; i ++) {
            setTimeout(() => {
                this.Fish1.children[i].getComponent(sp.Skeleton).setAnimation(0, 'fish_swim_01', true);
            }, 300*i);
        }
        for(let i = 0; i < this.Fish2.children.length; i ++) {
            setTimeout(() => {
                this.Fish2.children[i].getComponent(sp.Skeleton).setAnimation(0, 'fish_swim_02',true);
            }, 300*i);
        }
    }

    
    

    question1() {
        this.checkpoint = 1;
        this.questionIndex = 1;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数字组成了什么图形？'
        this.ALabel.string = '三角形'
        this.BLabel.string = '圆形'
        this.CLabel.string = '平行四边形'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question2() {
        this.questionIndex = 2;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这个三角形有多大？'
        this.ALabel.string = '大约7cm'
        this.BLabel.string = '无限大'
        this.CLabel.string = '依屏幕大小而定'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }   
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question3() {
        this.questionIndex = 3;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数是有规律的，你最愿意怎样观察呢？'
        this.ALabel.string = '横着看'
        this.BLabel.string = '斜着看'
        this.CLabel.string = '竖着看'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question4_1() {
        this.questionIndex = 4;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.questionLabel.string = '仔细观察你发现了什么？'
        this.ALabel.string = '每一行左右两侧数字对称'
        this.BLabel.string = '每一行左右两侧数字不对称'
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question4_2() {
        this.questionIndex = 5;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.DSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，以下哪项不是图中的规律？'
        this.ALabel.string = '左右两侧最外层都是1'
        this.BLabel.string = '第2行起，每一行第2个数从上到下可以组成一个等差数组'
        this.CLabel.string = '第2行起，每一行第2个数从上到下可以组成一个等差数组'
        this.DLabel.string = '第5行第2个数是4，则第20行第2个数是19'
        this.ALabel.fontSize = 30;
        this.BLabel.fontSize = 30;
        this.CLabel.fontSize = 30;
        this.DLabel.fontSize = 30;
        this.ALabel.lineHeight = 40;
        this.BLabel.lineHeight = 40;
        this.CLabel.lineHeight = 40;
        this.DLabel.lineHeight = 40;
        this.ALabel.node.y = -35;
        this.DLabel.node.y = -35;
        this.ASprite.node.height = 100;
        this.BSprite.node.height = 100;
        this.CSprite.node.height = 100;
        this.DSprite.node.height = 100;
        this.ASprite.node.getChildByName('a').y = -55;
        this.BSprite.node.getChildByName('b').y = -55;
        this.CSprite.node.getChildByName('c').y = -55;
        this.DSprite.node.getChildByName('d').y = -55;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question4_3() {
        this.questionIndex = 6;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，发现了什么？'
        this.ALabel.string = '每个数等于肩上两个数的和'
        this.BLabel.string = '每个数等于上一行数的和'
        this.CLabel.string = '奇数行中间的数可组成等差数串'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    question5_1() {
        this.questionIndex = 7;
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察有什么规律呢？'
        this.ALabel.string = '第n行有n个数'
        this.BLabel.string = '第n行有n+1个数'
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i ++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.yellowDotFrame;
            }
        }
        this.startAction();
    }

    right1() {
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: null,
                answer: null,
                result: null
        });
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        for(let i = 0; i < this.triangleNode.children.length; i++) {
            for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                if(j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                }
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.greenDotFrame;
            }
        }
        setTimeout(()=>{
            this.ASprite.spriteFrame = this.blueFrame;
            this.finishAction(this.question2.bind(this));
        }, 2000);
    }

    wrong1() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if(this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.redFrame;
        }else if(this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.redFrame;
        }
        for(let i = 0; i < this.triangleNode.children.length; i++) {
            for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                if(j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        for(let i = 0; i < this.bottomNode.children.length; i++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.redDotFrame;
            }
        }
        setTimeout(()=>{
            if(this.answerIndex == 2) {
                this.BSprite.spriteFrame = this.blueFrame;
            }else if(this.answerIndex == 3) {
                this.CSprite.spriteFrame = this.blueFrame;
            }
            this.finishAction(this.question1.bind(this));
        }, 2000);
    }

    right2() {
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: null,
                answer: null,
                result: null
        });
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.yellowFrame;
        for(let i = 0; i < this.bottomNode.children.length; i++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.greenDotFrame;
            }
        }
        setTimeout(() => {
            this.BSprite.spriteFrame = this.blueFrame;
            this.finishAction(this.question3.bind(this));
        }, 2000);
    }

    wrong2() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if(this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.redFrame;
        }else if(this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.redFrame;
        }
        for(let i = 0; i < this.bottomNode.children.length; i++) {
            for(let j = 0; j < this.bottomNode.children[i].children.length; j++) {
                this.bottomNode.children[i].children[j].getComponent(cc.Sprite).spriteFrame = this.redDotFrame;
            }
        }
        setTimeout(() => {
            if(this.answerIndex == 1) {
                this.ASprite.spriteFrame = this.blueFrame;
            }else if(this.answerIndex == 3) {
                this.CSprite.spriteFrame = this.blueFrame;
            }
            this.finishAction(this.question2.bind(this));
        }, 2000);
    }

    right3() {
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: null,
                answer: null,
                result: null
        });
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        if(this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.yellowFrame;
            for(let i = 0; i < this.triangleNode.children.length; i++) {
                if(i == 4) {
                    for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                    }
                }
            }
        }else if(this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.yellowFrame;
            for(let i = 0; i < this.triangleNode.children.length; i++) {
                for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if(j == 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
                    }
                } 
            }
        }else if(this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.yellowFrame;
            this.triangleNode.children[2].children[0].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[2].children[1].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[3].children[1].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[5].children[3].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[5].children[4].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
            this.triangleNode.children[6].children[4].getComponent(sp.Skeleton).setAnimation(0, 'green', true);
        }
        setTimeout(() => {
            if(this.answerIndex == 1) {
                this.ASprite.spriteFrame = this.blueFrame;
                this.finishAction(this.question4_1.bind(this));
            }else if(this.answerIndex == 2) {
                this.BSprite.spriteFrame = this.blueFrame;
                this.finishAction(this.question4_2.bind(this));
            }else if(this.answerIndex == 3) {
                this.CSprite.spriteFrame = this.blueFrame;
                this.finishAction(this.question4_3.bind(this));
            }
        }, 2000);
    }

    right4_1() {
        this.checkpoint++;
        this.eventvalue.levelData.push({
            subject: null,
                answer: null,
                result: null
        });
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(() => {
            this.ASprite.spriteFrame = this.blueFrame;
            this.finishAction(this.question5_1.bind(this));
        }, 1000);
    } 

    wrong4_1() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.redFrame;
        for(let i = 0; i < this.triangleNode.children.length; i++) {
            if(i == 4) {
                for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        setTimeout(() => {
            this.BSprite.spriteFrame = this.blueFrame;
            this.finishAction(this.question4_1.bind(this));
        }, 2000);
    }

    right4_2() {
        this.checkpoint++;
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.CSprite.spriteFrame = this.yellowFrame;
        setTimeout(() => {
            this.success();
        }, 2000);
    }

    wrong4_2() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if(this.answerIndex == 1) {
            this.ASprite.spriteFrame = this.redFrame;
        }else if(this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.redFrame;
        }else if(this.answerIndex == 4) {
            this.DSprite.spriteFrame = this.redFrame;
        }
        if(this.answerIndex == 1) {
            for(let i = 0; i < this.triangleNode.children.length; i++) {
                for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if(j == 0 || j == this.triangleNode.children[i].children.length - 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                    }
                }
            }
        }else if(this.answerIndex == 2 || this.answerIndex == 4) {
            for(let i = 0; i < this.triangleNode.children.length; i++) {
                for(let j = 0; j < this.triangleNode.children[i].children.length; j++) {
                    if(j == 1) {
                        this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                    }
                }
            }
        }
       
        setTimeout(()=>{
            if(this.answerIndex == 1) {
                this.ASprite.spriteFrame = this.blueFrame;
            }else if(this.answerIndex == 2) {
                this.BSprite.spriteFrame = this.blueFrame;
            }else if(this.answerIndex == 4) {
                this.DSprite.spriteFrame = this.blueFrame;
            }
            this.finishAction(this.question4_2.bind(this));
        }, 2000);
    }

    right4_3() {
        this.checkpoint++;
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(() => {
            this.success();
        }, 2000);
    }

    wrong4_3() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        if(this.answerIndex == 2) {
            this.BSprite.spriteFrame = this.yellowFrame;
        }else if(this.answerIndex == 3) {
            this.CSprite.spriteFrame = this.yellowFrame;
        }
        this.triangleNode.children[2].children[0].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[2].children[1].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[3].children[1].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[5].children[3].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[5].children[4].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        this.triangleNode.children[6].children[4].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
        setTimeout(()=>{
            if(this.answerIndex == 2) {
                this.BSprite.spriteFrame = this.blueFrame;
            }else if(this.answerIndex == 3) {
                this.CSprite.spriteFrame = this.blueFrame;
            }
            this.finishAction(this.question4_3.bind(this));
        }, 2000);
    }

    right5_1() {
        this.checkpoint++;
        AudioManager.getInstance().playSound('sfx_yhrght', false);
        this.touchEnable(false);
        this.ASprite.spriteFrame = this.yellowFrame;
        setTimeout(() => {
            this.success();
        }, 2000);
    }

    wrong5_1() {
        AudioManager.getInstance().playSound('sfx_yhwrng', false);
        this.touchEnable(false);
        this.BSprite.spriteFrame = this.yellowFrame;
        for(let i = 0; i < this.triangleNode.children.length; i++) {
            if(i == 4) {
                for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                    this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'red', true);
                }
            }
        }
        setTimeout(()=>{
            this.BSprite.spriteFrame = this.blueFrame;
            this.finishAction(this.question5_1.bind(this));
        }, 2000);
    }

    success() {
        this.eventvalue.result = 1;
        this.isOver = 1;
        console.log('--', this.eventvalue);
        DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        AudioManager.getInstance().stopAll();
        UIHelp.showOverTip(2,'原来这就是杨辉三角呀～');
    }

    isRight(questionIndex : number) {
        if(questionIndex == 1) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 1;
            this.eventvalue.result = 2;
            if(this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right1();
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong1();
            }
        }else if(questionIndex == 2) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 2;
            if(this.answerIndex == 2) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right2();
               
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong2();
                
            }
        }else if(questionIndex == 3) {
            this.eventvalue.levelData[this.checkpoint -1].subject = [1,2,3];
            this.eventvalue.levelData[this.checkpoint-1].result = 1;
            this.right3();
        }else if(questionIndex == 4) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 1;
            if(this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right4_1();
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong4_1();
            }
        }else if(questionIndex == 5) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 3;
            if(this.answerIndex == 3) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right4_2();
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong4_2();
            }
        }else if(questionIndex == 6) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 1;
            if(this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right4_3();
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong4_3();
            }
        }else if(questionIndex == 7) {
            this.eventvalue.levelData[this.checkpoint -1].subject = 1;
            if(this.answerIndex == 1) {
                this.eventvalue.levelData[this.checkpoint-1].result = 1;
                this.right5_1();
            }else {
                this.eventvalue.levelData[this.checkpoint-1].result = 2;
                this.wrong5_1();
            }
        }
    }


    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {

    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    this.setPanel();
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
