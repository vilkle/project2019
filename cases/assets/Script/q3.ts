/*
 * @Author: 马超
 * @Date: 2020-11-03 11:44:27
 * @LastEditTime: 2020-11-03 16:49:54
 * @Description: 游戏脚本
 * @FilePath: \cases\assets\Script\q3.ts
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    buttonNode: cc.Node = null;

    onLoad () {
        this.buttonNode.setScale(cc.v2(0.1,0.1))
    }

    start () {
        let rep = cc.repeatForever(cc.sequence(cc.scaleBy(0.5, 105/100, 97/100), cc.scaleBy(0.5, 95/105, 103/97), cc.scaleBy(0.5, 100/95, 100/103)))
        let seq = cc.sequence(cc.scaleTo(0.5, 1,1), cc.callFunc(()=>{
            this.buttonNode.runAction(rep)
        }))
        this.buttonNode.runAction(seq)
        this.buttonNode.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.buttonNode.stopAllActions()
            this.buttonNode.runAction(cc.sequence(cc.scaleTo(0.1, 0.8, 0.8),cc.scaleTo(0.1, 0.95, 0.95),cc.scaleTo(0.1, 0.8, 0.8),cc.scaleTo(0.1, 0.9, 0.9),cc.scaleTo(0.1, 0.85, 0.85),cc.scaleTo(0.1, 0.8, 0.8), cc.callFunc(()=>{
                console.log('----', this.buttonNode.scaleX, this.buttonNode.scaleY)
                this.buttonNode.setScale(cc.v2(0.8, 0.8))
                this.buttonNode.runAction(rep)
            })))
        })
        this.buttonNode.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.buttonNode.stopAllActions()
            this.buttonNode.runAction(cc.sequence(cc.scaleTo(0.1, 1.2, 1.2),cc.scaleTo(0.1, 1, 1),cc.scaleTo(0.1, 1.15, 1.15),cc.scaleTo(0.1, 1, 1),cc.scaleTo(0.1, 1.1, 1.1), cc.scaleTo(0.1, 1, 1), cc.callFunc(()=>{
                this.buttonNode.setScale(cc.v2(1, 1))
                this.buttonNode.runAction(rep)
            })))
        })
        this.buttonNode.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            this.buttonNode.stopAllActions()
            this.buttonNode.setScale(cc.v2(1, 1))
            this.buttonNode.runAction(rep)
        })

    }

    onDestroy() {
        this.buttonNode.off(cc.Node.EventType.TOUCH_START)
        this.buttonNode.off(cc.Node.EventType.TOUCH_END)
        this.buttonNode.off(cc.Node.EventType.TOUCH_CANCEL)
       
    }
    // update (dt) {}
}
