/*
 * @Author: 马超
 * @Date: 2020-11-03 11:43:52
 * @LastEditTime: 2020-11-03 15:50:34
 * @Description: 游戏脚本
 * @FilePath: \cases\assets\Script\q2.ts
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    private label: cc.Label = null
    @property(cc.EditBox)
    private edit: cc.EditBox = null
    private value:number = 0
    private arr1: number[] = [10, 40, 5, 280]
    private arr2: number[] = [234, 5, 2, 148, 23]
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    buttonCallback() {
        this.value = parseInt(this.edit.string)
        this.isTrue(this.value)

    }

    isTrue(value: number) {
        for(let i = 0; i < this.arr1.length; ++i) {
            if(this.arr2.indexOf(value - this.arr1[i]) != -1) {
                this.label.string = 'true'
                return true
            }
        }
        this.label.string = 'false'
        return false
    }


    // update (dt) {}
}
