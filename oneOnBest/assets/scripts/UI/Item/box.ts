const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(sp.Skeleton)
    main: sp.Skeleton = null;

    @property(sp.Skeleton)
    falseSP: sp.Skeleton = null;

    @property(sp.Skeleton)
    endSP: sp.Skeleton = null;

    text: string = '';
    right: number = 0;
    disabled: boolean = true;

    buXuGuanBi: boolean = false;

    handleClose() {
        if (this.disabled) return;
        if (this.buXuGuanBi) return;
        this.node.destroy();
        // 派发close事件
        let eventClose = new cc.Event.EventCustom('close', true);
        this.node.dispatchEvent(eventClose);
    }

    setRihgtAction() {
        this.main.node.active = true;
        this.falseSP.node.active = false;
        this.endSP.node.active = false;
        this.main.setAnimation(0, 'true', false);
    }

    setFaultAction() {
        this.main.node.active = false;
        this.falseSP.node.active = true;
        this.endSP.node.active = false;
        this.falseSP.setAnimation(0, 'false', false);
    }

    setEndAction() {
        this.main.node.active = false;
        this.falseSP.node.active = false;
        this.endSP.node.active = true;
        this.endSP.setAnimation(0, 'in', false);
        this.endSP.addAnimation(0, 'stand', true);
    }

    setLabelAction() {
        this.label.node.opacity = 0;
        this.label.string = this.text;
        this.label.node.runAction(cc.fadeIn(0.3));
        //文字显示后，启用按钮
        this.disabled = false;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    start() {
        //动画开始时禁用按钮
        this.disabled = true;
        if (this.right == 0) {
            this.setRihgtAction();
        } else if(this.right == 2) {
            this.setFaultAction();
        } else if(this.right == 1){
            this.setEndAction();
        }

        setTimeout(() => {
            this.setLabelAction()
        }, 1300);
    }

    // update (dt) {}
}
