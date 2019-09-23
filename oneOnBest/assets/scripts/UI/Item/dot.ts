const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    dot_1: cc.Node = null;

    duration: number = 5;


    setDotAction_1() {
        let up = cc.moveBy(this.duration, 20, 100).easing(cc.easeQuinticActionIn());
        // 不断重复
        return cc.repeatForever(up);
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // this.dot_1.runAction(this.setDotAction_1());
    }

    // update (dt) {}
}
