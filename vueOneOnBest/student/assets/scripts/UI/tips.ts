const { ccclass, property } = cc._decorator;

@ccclass
export default class Toast extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    text: string = '';
    close: boolean = true;

    setAction() {
        // 设置显隐动画
        let big = cc.scaleTo(0.2, 1.8, 1.8).easing(cc.easeCubicActionOut());
        let small = cc.scaleTo(0.2, 1.5, 1.5).easing(cc.easeCubicActionOut());
        let delay = cc.delayTime(1.2);
        let fade = cc.fadeOut(0.6);
        let callback = cc.callFunc(() => {
            let t = setTimeout(() => {
                // 销毁节点
                this.node.destroy();
                clearTimeout(t);
            }, 200)
        })
        return this.close ?
            cc.sequence(big, small, delay, fade, callback) :
            cc.sequence(big, small)
    }

    start() {
        this.label.string = this.text;
        this.node.setPosition(cc.v2(0, 0));
        this.node.runAction(this.setAction());
    }

    onDestroy() {
        // 通知 game.ts 提示将关闭
        let eventSelect = new cc.Event.EventCustom('close_tips', true);
        this.node.dispatchEvent(eventSelect);
    }
}
