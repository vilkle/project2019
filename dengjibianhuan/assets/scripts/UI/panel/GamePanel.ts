import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";

const { ccclass, property } = cc._decorator;
class Path {
    public startPos: cc.Vec2 = cc.v2(0, 0)
    public endPos: cc.Vec2 = cc.v2(0, 0)
}

@ccclass
export default class GamePanel extends BaseUI {

    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private labaBoundingBox: cc.Node = null
    @property(sp.Skeleton)
    private laba: sp.Skeleton = null
    @property(cc.Prefab)
    private q1: cc.Prefab = null
    @property(cc.Prefab)
    private q2: cc.Prefab = null
    @property(cc.Prefab)
    private q3: cc.Prefab = null
    @property(cc.Prefab)
    private q4: cc.Prefab = null
    @property(cc.Prefab)
    private q5: cc.Prefab = null
    @property(cc.Prefab)
    private q6: cc.Prefab = null
    @property(cc.Node)
    private twoStep: cc.Node = null
    @property(cc.Node)
    private multiStep: cc.Node = null
    @property(cc.Node)
    private right: cc.Node = null 
    @property(cc.Node)
    private wrong: cc.Node = null
    @property(cc.Node)
    private mask: cc.Node = null
    @property(sp.Skeleton)
    private spine: sp.Skeleton = null
    private gF: cc.Graphics = null
    private gL: cc.Graphics = null
    private stepNum: number = 1
    private questionNode: cc.Node = null
    private type: number = 0
    private qTtype: number = 0
    private nodeArr: cc.Vec2[][] = []
    private pathArr: Path[] =[]
    private terminalPointArr: cc.Node[] = []
    private operateNodeArr: cc.Node[][] = []
    private startPoint: cc.Node = null
    private intervalIndex: number = null
    private timeoutIndexArr: number[] = []
    private isOver: number = 0
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [
           
        ],
        result: 4
    }
    

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[0].result = 2
            }
        })
        // this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, (e)=>{
        //     this.laba.setAnimation(0, 'click', false)
        //     this.laba.addAnimation(0, 'speak', true)
        //     AudioManager.getInstance().stopAll()
        //     AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
        //         this.laba.setAnimation(0, 'null', true)
        //     })
        // })
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.type = DaAnData.getInstance().type
            this.qTtype = DaAnData.getInstance().qType
            this.setPanel()
        }else {
            this.getNet()
        }
    }

    start() {
        this.spine.setAnimation(0, 'idle', false)
        this.spine.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'idle' || trackEntry.animation.name == 'idle1') {
                let num = Math.floor(Math.random() * 10) 
                if(num > 7) {
                    this.spine.setAnimation(0, 'idle1', false)
                }else {
                    this.spine.setAnimation(0, 'idle', false)
                }
            }
        })
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.addListener()
    }

    setPanel() {
        let len: number = 0
        if(this.type == 1) {
            len = 1
        }else if(this.type == 2){
            len = 2
        }else if(this.type == 3) {
            len = 4
        }
        for(let i = 0; i < len; i++) {
            this.eventvalue.levelData.push({
                subject: null,
                answer: null,
                result: 4
            });
        }
        this.initQuestion()
    }

    blingbling(node: cc.Node) {
        let prompt = node.getChildByName('prompt')
        prompt.active = true
        prompt.opacity = 0
        let fadein = cc.fadeIn(0.5)
        let fadeout = cc.fadeOut(0.5)
        let scale1 = cc.scaleTo(0.5, 1.5)
        let scale2 = cc.scaleTo(0.5, 1)
        let spawn1 = cc.spawn(fadein, scale1)
        let spawn2 = cc.spawn(fadeout, scale2)
        let fun = cc.callFunc(()=>{
            prompt.active = false
        })
        let seq = cc.sequence(spawn1, spawn2, spawn1, spawn2, spawn1, spawn2, fun)
        prompt.stopAllActions()
        prompt.runAction(seq)
    }

    prompt(stepNum: number) {
        if(this.intervalIndex != null) {
            clearInterval(this.intervalIndex)
        }
        this.intervalIndex = setInterval(() => {
            let node: cc.Node = null
            if(stepNum == 1) {
                node = this.startPoint.getChildByName('prompt')
            }else {
                node = this.terminalPointArr[stepNum - 2].getChildByName('prompt')
            }
            node.active = true
            node.opacity = 0
            let fadein = cc.fadeIn(0.5)
            let fadeout = cc.fadeOut(0.5)
            let scale1 = cc.scaleTo(0.5, 1.5)
            let scale2 = cc.scaleTo(0.5, 1)
            let spawn1 = cc.spawn(fadein, scale1)
            let spawn2 = cc.spawn(fadeout, scale2)
            let fun = cc.callFunc(()=>{
                node.active = false
            })
            let seq = cc.sequence(spawn1, spawn2, spawn1, spawn2, spawn1, spawn2, fun)
            node.stopAllActions()
            node.runAction(seq)
        }, 10000);
    }

    addListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isComplete(this.stepNum, this.type)) {
                return
            }
            clearInterval(this.intervalIndex)
            for (const key in this.timeoutIndexArr) {
                clearTimeout(this.timeoutIndexArr[key])
            }
            for (const key in this.operateNodeArr[this.stepNum - 1]) {
                this.operateNodeArr[this.stepNum - 1][key].stopAllActions()
            }
          
            for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                let x = this.nodeArr[this.stepNum - 1][i].x - 25
                let y = this.nodeArr[this.stepNum - 1][i].y - 25
                let rect: cc.Rect = cc.rect(x, y, 50, 50)
                if(rect.contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(!this.nodeArr[this.stepNum - 1][i].equals(this.pathArr[this.stepNum-1].startPos)) {
                        this.wrong.active = true
                        this.wrong.zIndex = 100
                        this.wrong.setPosition(this.nodeArr[this.stepNum - 1][i])
                        let fadeout = cc.fadeOut(0.5)
                        let fadein = cc.fadeIn(0.5)
                        let fun = cc.callFunc(()=>{
                            this.wrong.active = false
                        })
                        let seq = cc.sequence(fadeout, fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                        this.wrong.stopAllActions()
                        this.wrong.runAction(seq)
                        UIHelp.showTip('选错点咯')
                        return
                    }
                }
            }
            let x = this.pathArr[this.stepNum - 1].startPos.x - 25
            let y = this.pathArr[this.stepNum - 1].startPos.y - 25
            let rect: cc.Rect = cc.rect(x, y, 50, 50)
            this.right.zIndex = 100
            if(rect.contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.right.active = true
                this.right.setPosition(this.pathArr[this.stepNum - 1].startPos)
                  //设置层级
                if(this.stepNum == 1) {
                    if(this.type != 3) {
                        this.startPoint.zIndex = 51
                    }
                }else {
                    this.terminalPointArr[this.stepNum - 2].zIndex = 51
                }
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            if(!this.right.active || this.isComplete(this.stepNum, this.type)) {
                return
            }
            if(this.stepNum == 1) {
                if(this.type != 3) {
                    this.startPoint.zIndex = 51
                }
            }else {
                this.terminalPointArr[this.stepNum - 2].zIndex = 51
            }
            this.gL.clear()
            this.gF.clear()
            let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            if(pos.x > 997 - 50) {
                pos.x = 997 - 50
            }else if(pos.x < 50 - 997) {
                pos.x = 50 - 997
            }
            if(pos.y > 480 - 50) {
                pos.y = 480 - 50
            }else if(pos.y < 50 - 480) {
                pos.y = 50 - 480
            }
            this.right.setPosition(pos)
            let canvas = cc.director.getScene().getChildByName('Canvas')
            let width = canvas.width / 2
            let height = canvas.height / 2
            this.gL.lineWidth = 10
            this.gL.strokeColor.fromHEX('#f2268b')
            this.gL.moveTo(this.pathArr[this.stepNum - 1].startPos.x + width, this.pathArr[this.stepNum - 1].startPos.y + height)
            this.gL.lineTo(pos.x + width, pos.y + height)
            this.gL.close()
            this.gL.stroke()

            this.gF.lineWidth = 0
            this.gF.fillColor.fromHEX('#57d4fa')
            this.gF.fillColor.setA(200)
            this.gF.moveTo(pos.x + width, pos.y + height)
            this.gF.lineTo(this.nodeArr[this.stepNum - 1][0].x + width, this.nodeArr[this.stepNum - 1][0].y + height)
            this.gF.lineTo(this.nodeArr[this.stepNum - 1][this.nodeArr[this.stepNum - 1].length-1].x + width, this.nodeArr[this.stepNum - 1][this.nodeArr[this.stepNum - 1].length-1].y + height)
            this.gF.moveTo(this.nodeArr[this.stepNum - 1][0].x + width, this.nodeArr[this.stepNum - 1][0].y + height)
            for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                this.gF.lineTo(this.nodeArr[this.stepNum - 1][i].x + width, this.nodeArr[this.stepNum - 1][i].y + height)
            }
            this.gF.lineTo(this.nodeArr[this.stepNum - 1][0].x + width, this.nodeArr[this.stepNum - 1][0].y + height)
            this.gF.close()
            this.gF.fill()
            let x = this.pathArr[this.stepNum-1].endPos.x - 70
            let y = this.pathArr[this.stepNum-1].endPos.y - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.terminalPointArr[this.stepNum - 1].getChildByName('point')
            if(rect.contains(pos)) {
                point.active = true
            }else {
                point.active = false
            }
            //特殊情况
            this.exceptionalMove(pos)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(!this.right.active || this.isComplete(this.stepNum, this.type)) {
                return
            }
            let point = this.terminalPointArr[this.stepNum - 1].getChildByName('point')
            point.active = false
            this.right.active = false
            this.wrong.active = false
            let x = this.pathArr[this.stepNum-1].endPos.x - 70
            let y = this.pathArr[this.stepNum-1].endPos.y - 70
            let rect: cc.Rect = cc.rect(x, y , 140, 140)
            let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            if(rect.contains(pos) || this.exceptionalEnd(pos)) {
                this.gL.clear()
                this.gF.clear()
                let canvas = cc.director.getScene().getChildByName('Canvas')
                let width = canvas.width / 2
                let height = canvas.height / 2
                this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
                this.gF.lineWidth = 0
                this.gL.lineWidth = 10
                this.gF.fillColor.fromHEX('#8b5efb') 
                this.gF.fillColor.setA(150)
                this.gL.moveTo(this.pathArr[this.stepNum - 1].startPos.x + width, this.pathArr[this.stepNum - 1].startPos.y + height)
                if(this.exceptionalEnd(pos)) {
                    if(rect.contains(pos)) {
                        this.terminalPointArr[this.stepNum - 1].zIndex = 54
                        this.gF.moveTo(this.pathArr[this.stepNum - 1].endPos.x + width, this.pathArr[this.stepNum - 1].endPos.y + height)
                        this.gL.lineTo(this.pathArr[this.stepNum - 1].endPos.x + width, this.pathArr[this.stepNum - 1].endPos.y + height)
                    }else {
                        this.gF.moveTo(this.exceptionalPos(pos).x + width, this.exceptionalPos(pos).y + height)
                        this.gL.lineTo(this.exceptionalPos(pos).x + width, this.exceptionalPos(pos).y + height)
                    }
                }else {
                    this.terminalPointArr[this.stepNum - 1].zIndex = 54
                    this.gF.moveTo(this.pathArr[this.stepNum - 1].endPos.x + width, this.pathArr[this.stepNum - 1].endPos.y + height)
                    this.gL.lineTo(this.pathArr[this.stepNum - 1].endPos.x + width, this.pathArr[this.stepNum - 1].endPos.y + height)
                }
                
                
                for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                    this.gF.lineTo(this.nodeArr[this.stepNum - 1][i].x + width, this.nodeArr[this.stepNum - 1][i].y + height)
                }
                this.gF.close()
                this.gF.fill()
                this.gL.strokeColor.fromHEX('#8b5efb')
                this.gL.close()
                this.gL.stroke()
                this.startPoint = this.terminalPointArr[this.stepNum - 2]
                UIHelp.showTip('答对了')
                this.maskOn()
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.stepNum - 1].result = 1
                this.stepNum++
                if(this.isComplete(this.stepNum, this.type)) {
                    this.isOver = 1
                    this.eventvalue.result = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    })
                    let id = setTimeout(() => {
                        this.maskOff()
                        DaAnData.getInstance().submitEnable = true
                        UIHelp.showOverTip(2, '你真棒，等等还没做完的同学吧。', null, '挑战成功')
                        clearTimeout(id)
                        let index = this.timeoutIndexArr.indexOf(id)
                        this.timeoutIndexArr.splice(index, 1)
                    }, 2000);
                    this.timeoutIndexArr.push(id)
                }else {
                    let id = setTimeout(() => {
                        this.adjustmentZindex(this.operateNodeArr[this.stepNum - 1])
                        this.prompt(this.stepNum)
                        this.setProgress(this.stepNum)
                        UIHelp.showTip(`第 ${this.stepNum} 步`)
                        let inid = setTimeout(() => {
                            for (const key in this.operateNodeArr[this.stepNum - 1]) {
                                this.blingbling(this.operateNodeArr[this.stepNum - 1][key])
                            }
                            clearTimeout(inid)
                            let index = this.timeoutIndexArr.indexOf(inid)
                            this.timeoutIndexArr.splice(index, 1)
                        }, 2000);
                        this.timeoutIndexArr.push(inid)
                        this.maskOff()
                        this.gL.clear()
                        this.gF.clear()
                        let canvas = cc.director.getScene().getChildByName('Canvas')
                        let width = canvas.width / 2
                        let height = canvas.height / 2
                        this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
                        this.gF.lineWidth = 0
                        this.gF.fillColor.fromHEX('#57d4fa')
                        this.gF.fillColor.setA(200)
                        this.gF.moveTo(this.pathArr[this.stepNum - 1].startPos.x + width, this.pathArr[this.stepNum - 1].startPos.y + height)
                        for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                            this.gF.lineTo(this.nodeArr[this.stepNum - 1][i].x + width, this.nodeArr[this.stepNum - 1][i].y + height)
                        }
                        this.gF.close()
                        this.gF.fill()
                        clearTimeout(id)
                        let index = this.timeoutIndexArr.indexOf(id)
                        this.timeoutIndexArr.splice(index, 1)
                    }, 2000);
                    this.timeoutIndexArr.push(id)
                }
            }else {
                if(this.stepNum == 1) {
                    this.startPoint.zIndex = 54
                }else {
                    this.terminalPointArr[this.stepNum - 2].zIndex = 54
                }
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.stepNum - 1].result = 2
                this.prompt(this.stepNum)
                let p1 = this.pathArr[this.stepNum-1].startPos
                let p2 = this.pathArr[this.stepNum-1].endPos
                let p3 = this.right.getPosition()
                let angle = this.getAngle(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y)
                if(angle < 5) {
                    UIHelp.showTip('方向正确 继续前进')
                }else {
                    UIHelp.showTip('方向不对 请注意 ')
                }
                this.gL.clear()
                this.gF.clear()
                let width = cc.director.getScene().getChildByName('Canvas').width / 2
                let height = cc.director.getScene().getChildByName('Canvas').height / 2
                this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
                this.gF.lineWidth = 0
                this.gF.fillColor.fromHEX('#57d4fa')
                this.gF.fillColor.setA(200)
                this.gF.moveTo(this.pathArr[this.stepNum - 1].startPos.x + width, this.pathArr[this.stepNum - 1].startPos.y + height)
                for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                    this.gF.lineTo(this.nodeArr[this.stepNum - 1][i].x + width, this.nodeArr[this.stepNum - 1][i].y + height)
                }
                this.gF.close()
                this.gF.fill()
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(!this.right.active || this.isComplete(this.stepNum, this.type)) {
                return
            }
            if(this.stepNum == 1) {
                this.startPoint.zIndex = 54
            }else {
                this.terminalPointArr[this.stepNum - 2].zIndex = 54
            }
            let point = this.terminalPointArr[this.stepNum - 1].getChildByName('point')
            point.active = false
            this.right.active = false
            this.wrong.active = false
            this.prompt(this.stepNum)
            let p1 = this.pathArr[this.stepNum-1].startPos
            let p2 = this.pathArr[this.stepNum-1].endPos
            let p3 = this.right.getPosition()
            let angle = this.getAngle(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y)
            if(angle < 5) {
                UIHelp.showTip('方向正确 继续前进')
            }else {
                UIHelp.showTip('方向不对 请注意 ')
            }
            this.gL.clear()
            this.gF.clear()
            let width = cc.director.getScene().getChildByName('Canvas').width / 2
            let height = cc.director.getScene().getChildByName('Canvas').height / 2
            this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
            this.gF.lineWidth = 0
            this.gF.fillColor.fromHEX('#57d4fa')
            this.gF.fillColor.setA(200)
            this.gF.moveTo(this.pathArr[this.stepNum - 1].startPos.x + width, this.pathArr[this.stepNum - 1].startPos.y + height)
            for(let i = 0; i < this.nodeArr[this.stepNum - 1].length; ++i) {
                this.gF.lineTo(this.nodeArr[this.stepNum - 1][i].x + width, this.nodeArr[this.stepNum - 1][i].y + height)
            }
            this.gF.close()
            this.gF.fill()
        })
    }

    adjustmentZindex(operateNodeArr: cc.Node[]) {
        let totalArr = this.questionNode.children
        let gF = this.questionNode.getChildByName('gFill')
        let gL = this.questionNode.getChildByName('gLine')
        for(let i = 0; i < totalArr.length; ++i) {
            totalArr[i].zIndex = i
        }
        gL.zIndex = 50
        gF.zIndex = 52
        for(let i = 0; i < operateNodeArr.length; ++i) {
            operateNodeArr[i].zIndex = 54
        }
    }

    getAngle(x1: number, y1: number, x2: number, y2: number) {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        const result = (angle + 360) % 360
        if(result > 180) {
            return 360 - result
        }else {
            return result
        } 
    }

    exceptionalMove(pos: cc.Vec2) {  
        if(this.type == 2 && this.qTtype == 4 && this.stepNum == 2) {
            let x = -399 - 70
            let y = 74 - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.questionNode.getChildByName('point10').getChildByName('point')
            if(rect.contains(pos)) {
                point.active = true
            }else {
                point.active = false
            }
        }else if(this.type == 3 && this.qTtype == 1 && this.stepNum == 4) {
            let x = -475 - 70
            let y = 74 - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.questionNode.getChildByName('point10').getChildByName('point')
            if(rect.contains(pos)) {
                point.active = true
            }else {
                point.active = false
            }
        }
    }

    exceptionalPos(pos: cc.Vec2): cc.Vec2 {
        let p1 = this.pathArr[this.stepNum-1].startPos
        let p2 = this.pathArr[this.stepNum-1].endPos
        let angle = this.getAngle(p2.x - p1.x, p2.y - p1.y, pos.x - p1.x, pos.y - p1.y)
        if(this.type == 2 && this.qTtype == 4 && this.stepNum == 2) {
             //靠近中点
             let x = -399 - 70
             let y = 74 - 70
             let rect: cc.Rect = cc.rect(x, y, 140, 140)
             let point = this.questionNode.getChildByName('point10')
             if(rect.contains(pos)) {
                point.zIndex = 54
                return cc.v2(-399, 74)
             }
            //靠近短线
            if(angle < 5 && pos.y > 74 && pos.y < 270) {
                return cc.v2(-399, pos.y)
            }
        }else if(this.type == 3 && this.qTtype == 1 && this.stepNum == 4) {
            //靠近中点
            let x = -475 - 70
            let y = 74 - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.questionNode.getChildByName('point10')
            if(rect.contains(pos)) {
                point.zIndex = 54
                return cc.v2(-475, 74)
            }
            //靠近短线
            if(angle < 5 && pos.y > 74 && pos.y < 330) {
                return cc.v2(-475, pos.y)
            }
        }
    }

    exceptionalEnd(p3: cc.Vec2): boolean {
        let p1 = this.pathArr[this.stepNum-1].startPos
        let p2 = this.pathArr[this.stepNum-1].endPos
        let angle = this.getAngle(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y)
        if(this.type == 2 && this.qTtype == 4 && this.stepNum == 2) {
            //靠近短线
            if(angle < 5 && p3.y > 74 && p3.y < 270) {
                return true
            }
            //靠近中点
            let x = -399 - 70
            let y = 74 - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.questionNode.getChildByName('point10').getChildByName('point')
            if(rect.contains(p3)) {
                point.active = false
                return true
            }
        }else if(this.type == 3 && this.qTtype == 1 && this.stepNum == 4) {
            //靠近短线
            if(angle < 5 && p3.y > 74 && p3.y < 330) {
                return true
            }
            //靠近中点
            let x = -475 - 70
            let y = 74 - 70
            let rect: cc.Rect = cc.rect(x, y, 140, 140)
            let point = this.questionNode.getChildByName('point10').getChildByName('point')
            if(rect.contains(p3)) {
                point.active = false
                return true
            }
        }
        return false
    }
   

    maskOn() {
        this.mask.active = true
    }

    maskOff() {
        this.mask.active = false
    }

    isComplete(stepNum: number, type: number): boolean {
        if(type == 1) {
            if(stepNum > 1) {
                return true
            }else {
                return false
            }
        }else if(type == 2) {
            if(stepNum > 2) {
                return true
            }else {
                return false
            }
        }else if(type == 3) {
            if(stepNum > 4) {
                return true
            }else {
                return false
            }
        }
        return true
    }

    initQuestion() {    
        //初始化游戏数据
        this.nodeArr = []
        this.pathArr = []
        if(this.type == 1) {
            this.questionNode = cc.instantiate(this.q1)
            let node1 = this.questionNode.getChildByName('point1')
            let node2 = this.questionNode.getChildByName('point2')
            let node3 = this.questionNode.getChildByName('point3')
            let node4 = this.questionNode.getChildByName('point4')
            let node5 = this.questionNode.getChildByName('point5')
            let node6 = this.questionNode.getChildByName('point6')
            let node7 = this.questionNode.getChildByName('point7')
            let path = new Path()
            if(this.qTtype == 1) {
                path.startPos = cc.v2(584, 125)
                path.endPos = cc.v2(181, -272)
                this.nodeArr[0] = [cc.v2(-470,-272), cc.v2(181, 371)]
                this.operateNodeArr[0] = [node2, node6, node3]
                this.terminalPointArr.push(node1)
                this.startPoint = node3
            }else if(this.qTtype == 2) {
                path.startPos = cc.v2(-470, 371)
                path.endPos = cc.v2(181, 371)
                this.nodeArr[0] = [cc.v2(584, 125), cc.v2(181, 125)]
                this.operateNodeArr[0] = [node3, node4, node7]
                this.terminalPointArr.push(node2)
                this.startPoint = node4
            }else if(this.qTtype == 3) {
                path.startPos = cc.v2(-470, 371)
                path.endPos = cc.v2(181, -272)
                this.nodeArr[0] = [cc.v2(181, 125), cc.v2(583, -272)]
                this.operateNodeArr[0] = [node4, node5, node7]
                this.terminalPointArr.push(node1)
                this.startPoint = node4
            }else if(this.qTtype == 4) {
                path.startPos = cc.v2(583, -272)
                path.endPos = cc.v2(181, -272)
                this.nodeArr[0] = [cc.v2(-470, 371), cc.v2(181, 371)]
                this.operateNodeArr[0] = [node2, node4, node5]
                this.terminalPointArr.push(node1)
                this.startPoint = node5
            }
            this.pathArr.push(path)
        }else if(this.type == 2) {
            let path1 = new Path()
            let path2 = new Path()
            if(this.qTtype == 1) {
                this.questionNode = cc.instantiate(this.q6)
                let node1 = this.questionNode.getChildByName('point1')
                let node3 = this.questionNode.getChildByName('point3')
                let node4 = this.questionNode.getChildByName('point4')
                let node5 = this.questionNode.getChildByName('point5')
                let node6 = this.questionNode.getChildByName('point6')
                path1.startPos = cc.v2(-470, -273)
                path1.endPos = cc.v2(-470, 371)
                path2.startPos = cc.v2(-470, 371)
                path2.endPos = cc.v2(181, -273)
                this.nodeArr[0] = [cc.v2(181, 125), cc.v2(583, -273), cc.v2(181, -27)]
                this.nodeArr[1] = [cc.v2(181, 125), cc.v2(583, -273)]
                this.operateNodeArr[0] = [node3, node4, node5, node6]
                this.operateNodeArr[1] = [node1, node4, node6]
            }else if(this.qTtype == 2) {
                this.questionNode = cc.instantiate(this.q2)
                let node1 = this.questionNode.getChildByName('point1')
                let node3 = this.questionNode.getChildByName('point3')
                let node4 = this.questionNode.getChildByName('point4')
                let node5 = this.questionNode.getChildByName('point5')
                let node6 = this.questionNode.getChildByName('point6')
                path1.startPos = cc.v2(445, -280)
                path1.endPos = cc.v2(285, 300)
                path2.startPos = cc.v2(285, 300)
                path2.endPos = cc.v2(-245, 300)
                this.nodeArr[0] = [cc.v2(-145, -64), cc.v2(-410, -278), cc.v2(-90, -278)]
                this.nodeArr[1] = [cc.v2(-410, -278), cc.v2(-90, -278)]
                this.operateNodeArr[0] = [node3, node4, node5, node6]
                this.operateNodeArr[1] = [node1, node5, node6]
            }else if(this.qTtype == 3) {
                this.questionNode = cc.instantiate(this.q3)
                let node1 = this.questionNode.getChildByName('point1')
                let node3 = this.questionNode.getChildByName('point3')
                let node4 = this.questionNode.getChildByName('point4')
                let node5 = this.questionNode.getChildByName('point5')
                let node6 = this.questionNode.getChildByName('point6')
                path1.startPos = cc.v2(583, -273)
                path1.endPos = cc.v2(583, 125)
                path2.startPos = cc.v2(583, 125)
                path2.endPos = cc.v2(181, -273)
                this.nodeArr[0] = [cc.v2(181, -26), cc.v2(-470, -273), cc.v2(181, 371)]
                this.nodeArr[1] = [cc.v2(181, 371), cc.v2(-470, -273)]
                this.operateNodeArr[0] = [node3, node4, node5, node6]
                this.operateNodeArr[1] = [node1, node4, node5]
            }else if(this.qTtype == 4) {
                this.questionNode = cc.instantiate(this.q4)
                let node1 = this.questionNode.getChildByName('point1')
                let node3 = this.questionNode.getChildByName('point3')
                let node4 = this.questionNode.getChildByName('point4')
                let node5 = this.questionNode.getChildByName('point5')
                let node6 = this.questionNode.getChildByName('point6')
                path1.startPos = cc.v2(696, -277)
                path1.endPos = cc.v2(-400, -277)
                path2.startPos = cc.v2(-400, -277)
                path2.endPos = cc.v2(-400, 270)
                this.nodeArr[0] = [cc.v2(-181, 74), cc.v2(-58, 272), cc.v2(-58, 74)]
                this.nodeArr[1] = [cc.v2(-58, 272), cc.v2(-58, 74)]
                this.operateNodeArr[0] = [node3, node4, node5, node6]
                this.operateNodeArr[1] = [node1, node4, node6]
            }
            let point1 = this.questionNode.getChildByName('point1')
            let point2 = this.questionNode.getChildByName('point2')
            this.terminalPointArr.push(point1)
            this.terminalPointArr.push(point2)
            this.startPoint = this.questionNode.getChildByName('point3')
            this.pathArr.push(path1)
            this.pathArr.push(path2)
        }else if(this.type == 3) {
            this.questionNode = cc.instantiate(this.q5)
            let path1 = new Path()
            let path2 = new Path()
            let path3 = new Path()
            let path4 = new Path()
            path1.startPos = cc.v2(-64, 327)
            path1.endPos = cc.v2(618, 327)
            path2.startPos = cc.v2(618, 327)
            path2.endPos = cc.v2(618, -274)
            path3.startPos = cc.v2(618, -274)
            path3.endPos = cc.v2(-476, -274)
            path4.startPos = cc.v2(-476, -274)
            path4.endPos = cc.v2(-476, 327)
            this.pathArr.push(path1)
            this.pathArr.push(path2)
            this.pathArr.push(path3)
            this.pathArr.push(path4)
            this.nodeArr[0] = [cc.v2(-64, 74), cc.v2(-64, 327), cc.v2(-236, 74), cc.v2(-64, 4), cc.v2(87, 74)]
            this.nodeArr[1] = [cc.v2(-64, 74), cc.v2(-64, 327), cc.v2(-236, 74), cc.v2(-64, 4)]
            this.nodeArr[2] = [cc.v2(-64, 74), cc.v2(-64, 327), cc.v2(-236, 74)]
            this.nodeArr[3] = [cc.v2(-64, 74), cc.v2(-64, 327)]
            let node1 = this.questionNode.getChildByName('point1')
            let node2 = this.questionNode.getChildByName('point2')
            let node3 = this.questionNode.getChildByName('point3')
            let node4 = this.questionNode.getChildByName('point4')
            let node5 = this.questionNode.getChildByName('point5')
            let node6 = this.questionNode.getChildByName('point6')
            let node7 = this.questionNode.getChildByName('point7')
            let node8 = this.questionNode.getChildByName('point8')
            let node9 = this.questionNode.getChildByName('point9')
            this.terminalPointArr.push(node1)
            this.terminalPointArr.push(node2)
            this.terminalPointArr.push(node3)
            this.terminalPointArr.push(node4)
            this.startPoint = this.questionNode.getChildByName('point5')
            this.operateNodeArr[0] = [node5, node6, node7, node8, node9]
            this.operateNodeArr[1] = [node1, node5, node6, node7, node9]
            this.operateNodeArr[2] = [node2, node5, node6, node9]
            this.operateNodeArr[3] = [node3, node5, node9]
        }
        this.questionNode.setPosition(cc.v2(0, 0))
        this.node.addChild(this.questionNode)
        this.adjustmentZindex(this.operateNodeArr[this.stepNum - 1])
        //初始化
        let canvas = cc.director.getScene().getChildByName('Canvas')
        let width = canvas.width / 2
        let height = canvas.height / 2
        this.gL = this.questionNode.getChildByName('gLine').getComponent(cc.Graphics)
        this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
        this.gF.lineWidth = 0
        this.gF.fillColor.fromHEX('#57d4fa')
        this.gF.fillColor.setA(200)

        this.gF.moveTo(this.pathArr[0].startPos.x + width, this.pathArr[0].startPos.y + height)
        for(let i = 0; i < this.nodeArr[0].length; ++i) {
            this.gF.lineTo(this.nodeArr[0][i].x + width, this.nodeArr[0][i].y + height)
        }
        this.gF.close()
        this.gF.fill()
        this.setProgress(this.stepNum)
        this.prompt(this.stepNum)
        let id = setTimeout(() => {
            for (const key in this.operateNodeArr[0]) {
                this.blingbling(this.operateNodeArr[0][key])
            }
            clearTimeout(id)
            let index = this.timeoutIndexArr.indexOf(id)
            this.timeoutIndexArr.splice(index, 1)
        }, 2000);
        this.timeoutIndexArr.push(id)
        if(this.type != 1) {
            UIHelp.showTip('第 1 步')
        }
    }

    setProgress(stepNum: number) {
        let node: cc.Node = null
        if(this.type == 2) {
            node = this.twoStep
        }else if(this.type == 3) {
            node = this.multiStep
        }else {
            return
        }
        node.active = true
       for(let i = 0; i < node.children.length; ++i) {
            if(i == stepNum - 1) {
                node.children[i].getChildByName('now').active = true
                node.children[i].getChildByName('lc').active = true
                node.children[i].getChildByName('yestoday').active = false
                node.children[i].getChildByName('tomorrow').active = false
                node.children[i].getChildByName('dc').active = false
            }else if(i < stepNum - 1 ) {
                node.children[i].getChildByName('now').active = false
                node.children[i].getChildByName('lc').active = false
                node.children[i].getChildByName('yestoday').active = true
                node.children[i].getChildByName('tomorrow').active = false
                node.children[i].getChildByName('dc').active = true
            }else if(i > stepNum - 1) {
                node.children[i].getChildByName('now').active = false
                node.children[i].getChildByName('lc').active = false
                node.children[i].getChildByName('yestoday').active = false
                node.children[i].getChildByName('tomorrow').active = true
                node.children[i].getChildByName('dc').active = true
            }
       }
    }


    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    onDestroy() {
        for (const key in this.timeoutIndexArr) {
            clearTimeout(this.timeoutIndexArr[key])
        }
        clearInterval(this.intervalIndex)
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
                    if(content.type) {
                        this.type = content.type
                    }else {
                        console.error('网络请求数据type为空。') 
                    }
                    if(content.qType) {
                        this.qType = content.qType
                    }else {
                        console.error('网络请求数据qType为空。') 
                    }
                    this.setPanel();
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
