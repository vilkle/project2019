const {ccclass, property} = cc._decorator;

@ccclass
export default class Egg extends cc.Component {

    @property(cc.Label)
    labelDisplay: cc.Label = null;

    // 阴影节点，保证其 scaleY 始终为 1
    @property(cc.Node)
    shadowDisplay: cc.Node = null;

    @property(sp.Skeleton)
    eggSp: sp.Skeleton = null;

    @property(cc.Node)
    eggSelected: cc.Node = null;

    @property(cc.Node)
    eggBgAction: cc.Node = null;

    // @property(cc.audioEngine)


    // 蛋壳上的文字
    text: string = ''
    // 是否选中
    selected: boolean = false;
    // 是否正确答案
    bingo: boolean = false;
    // 是否回合结束
    end: boolean = false;

    handleClick(event) {
        // 派发 select 事件
        let eventSelect = new cc.Event.EventCustom('select', true);
        this.node.dispatchEvent(eventSelect);
    }

    handleClickCallback() {
        //执行相关动画
        this.eggSelected.runAction(this.setBgSection(this.selected));
        this.labelDisplay.node.runAction(this.setShakeAction());
        if (this.selected) {
            this.eggBgAction.active = true;
            this.eggBgAction.runAction(this.setSelectBgAction());
        }
    }

    handleGameOver(bingo: boolean) {
        //回合结束
        if (bingo) {
            //答对时重置
            this.selected = false;
            this.eggSelected.opacity = 0;
        }
        let str = bingo ? 'Correct' : 'Error';
        this[`set${str}AnswerSpine`]();
    }

    setSelectBgAction() {
        //设置背景被选中时候的动画
        let big = cc.scaleTo(0.3, 1.3, 1.3).easing(cc.easeCubicActionOut());
        let fade = cc.fadeOut(0.3);
        let callback = cc.callFunc(() => {
            this.eggBgAction.active = false;
            this.eggBgAction.opacity = 150;
            this.eggBgAction.scale = 1;
        }, 100)
        return cc.sequence(big, fade, callback);
    }

    setBgSection(selected: boolean) {
        //选中状态
        let fade = selected ? 'fadeIn' : 'fadeOut';
        return cc[fade](0.2);
    }

    setShakeAction() {
        // 设置摇晃动画
        let turnLeft = cc.rotateTo(0.1, 7);
        let turnRight = cc.rotateTo(0.2, -7);
        let trunBack = cc.rotateTo(0.1, 0);
        return cc.sequence(turnLeft, turnRight, trunBack)
    }

    setCorrectAnswerSpine() {
        // 回答正确的动画
        this.eggSp.timeScale = 1;
        this.eggSp.setSkin('niao');
        this.eggSp.setAnimation(0, 'in', false);
        // 随机选择一个动画
        let index = (Math.random() * 4) >> 0;
        switch (index) {
            case 0:
                this.eggSp.addAnimation(0, 'guodu_B', false);
                this.eggSp.addAnimation(0, 'guodu_B_standby_loop', true);
                break;
            case 1:
                this.eggSp.addAnimation(0, 'guodu_A', false);
                this.eggSp.addAnimation(0, 'guodu_A_yaobai_loop', true);
                break;
            case 2:
                this.eggSp.addAnimation(0, 'standby3_loop', true);
                break;
            default:
                this.eggSp.addAnimation(0, 'standby4_loop', true);
                break;
        }
    }

    setErrorAnswerSpine() {
        //回答错误的动画
        this.labelDisplay.node.runAction(this.setShakeAction());
        this.eggSp.node.runAction(this.setShakeAction());
        this.eggSelected.runAction(this.setShakeAction());
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.labelDisplay.string = this.text;
        //注册点击事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleClick, this);
    }

    // update (dt) {}

    onDestroy() {
        // 取消监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.handleClick, this);
    }
}
