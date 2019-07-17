import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";

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
    @property(cc.Node)
    private triangleNode : cc.Node = null;
    private answerNodeArr : cc.Node[] = [];
    private checkpoint : number = 1;
    private questionIndex : number = 0;
    private answerIndex : number = 0;

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.answerNodeArr.push(this.ASprite.node);
        this.answerNodeArr.push(this.BSprite.node);
        this.answerNodeArr.push(this.CSprite.node);
        this.answerNodeArr.push(this.DSprite.node);
        this.stockOfFish();
        this.initGame();
    }

    initGame() {
        this.question1();
        for(let i = 0; i < this.answerNodeArr.length; i++) {
            this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_START, ()=>{
                this.answerNodeArr[i].setScale(0.95);
                this.answerIndex = i + 1;
            });
            this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_END, ()=>{
                this.answerNodeArr[i].setScale(1);
               
            });
            this.answerNodeArr[i].on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.answerNodeArr[i].setScale(1);
                
            });
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
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数字组成了什么图形？'
        this.ALabel.string = 'A  三角形'
        this.BLabel.string = 'B  圆形'
        this.CLabel.string = 'C  平行四边形'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }

    }

    question2() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这个三角形有多大？'
        this.ALabel.string = 'A  大约7cm'
        this.BLabel.string = 'B  无限大'
        this.CLabel.string = 'C  依屏幕大小而定'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    question3() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '这些数是有规律的，你最愿意怎样观察呢？'
        this.ALabel.string = 'A  横着看'
        this.BLabel.string = 'B  斜着看'
        this.CLabel.string = 'C  竖着看'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    question4_1() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.questionLabel.string = '仔细观察你发现了什么？'
        this.ALabel.string = 'A  每一行左右两侧数字对称'
        this.BLabel.string = 'B  每一行左右两侧数字不对称'
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    question4_2() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.DSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，以下哪项不是图中的规律？'
        this.ALabel.string = 'A  左右两侧最外层都是1'
        this.BLabel.string = 'B  第2行起，每一行第2个数从上到下可以组成一个等差数组'
        this.CLabel.string = 'C  第2行起，每一行第2个数从上到下可以组成一个等差数组'
        this.DLabel.string = 'D  第5行第2个数是4，则第20行第2个数是19'
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    question4_3() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察图形，发现了什么？'
        this.ALabel.string = 'A  每个数等于肩上两个数的和'
        this.BLabel.string = 'B  每个数等于上一行数的和'
        this.CLabel.string = 'C  奇数行中间的数可组成等差数串'
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    question5_1() {
        this.ASprite.node.active = true;
        this.BSprite.node.active = true;
        this.CSprite.node.active = true;
        this.questionLabel.string = '仔细观察有什么规律呢？'
        this.ALabel.string = 'A  第n行有n个数'
        this.BLabel.string = 'B  第n行有n+1个数'
        this.CSprite.node.active = false;
        this.DSprite.node.active = false;
        for(let i = 0; i < this.triangleNode.children.length; i ++){
            for(let j = 0; j < this.triangleNode.children[i].children.length; j ++) {
                this.triangleNode.children[i].children[j].getComponent(sp.Skeleton).setAnimation(0, 'yellow',true);
            }
        }
    }

    right1() {

    }

    wrong1() {

    }

    right2() {

    }

    wrong2() {

    }

    right4_1() {

    }

    isRight(questionIndex : number) {
        if(questionIndex == 1) {
            if(this.answerIndex == 1) {
                this.right1();
            }else {
                this.wrong1();
            }
        }else if(questionIndex == 2) {
            if(this.answerIndex == 2) {
                this.right2();
            }else {
                this.wrong2();
            }
        }else if(questionIndex == 3) {
            if(this.answerIndex == 1) {

            }else if(this.answerIndex == 2) {

            }else if(this.answerIndex == 3) {

            }
        }else if(questionIndex == 4) {
            if(this.answerIndex == 1) {

            }else {

            }
        }else if(questionIndex == 5) {
            if(this.answerIndex == 3) {

            }else {

            }
        }else if(questionIndex == 6) {
            if(this.answerIndex == 1) {

            }else {

            }
        }else if(questionIndex == 7) {
            if(this.answerIndex == 1) {

            }else {

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
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
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
