const {ccclass, property} = cc._decorator;

@ccclass
export default class Count extends cc.Component {

    @property(cc.Label)
    countLabel: cc.Label = null;

    // 摆动角度
    turnRotate: number = 10;
    // 摆动持续时间
    turnDuration: number = 2;

    setRepeatAction() {
        // 设置摇摆动画
        let turnLeft = cc.rotateTo(this.turnDuration, this.turnRotate);
        let turnRight = cc.rotateTo(this.turnDuration, -this.turnRotate);
        // 不断重复
        this.node.runAction(cc.repeatForever(cc.sequence(turnLeft, turnRight)));
    }

    setDownAction() {
        // 入场动画
        let itemIn = cc.moveBy(.3, 0, -10).easing(cc.easeCubicActionOut());
        let itemUp = cc.moveBy(.4, 0, 15).easing(cc.easeCubicActionOut());
        let itemDown = cc.moveBy(.6, 0, -10).easing(cc.easeCubicActionOut());
        // 入场之后开始摆动
        let callback = cc.callFunc(this.setRepeatAction, this);
        return cc.sequence(itemIn, itemUp, itemDown, callback);

    }

    start() {
        this.node.runAction(this.setDownAction())
    }
}
