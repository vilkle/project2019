import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { OverTips } from "../Item/OverTips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property(sp.Skeleton)
    private spine: sp.Skeleton = null
    @property(cc.Node)
    private m1: cc.Node = null
    @property(cc.Node)
    private m2: cc.Node = null
    @property(cc.Node)
    private bubble: cc.Node = null
    @property(cc.SpriteFrame)
    private quadrangle: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexangle: cc.SpriteFrame = null
    @property(cc.Graphics)
    private gc: cc.Graphics = null
    @property(cc.Node)
    private progressNode: cc.Node = null
    @property(cc.Node)
    private mask: cc.Node = null
    @property(cc.Node)
    private scissor: cc.Node = null
    private figureType: number = null
    private figureLevel: number[] = null
    private pointArr: cc.Vec2[] = []
    private figurePointArr1: cc.Vec2[] = [cc.v2(-109, 20), cc.v2(349, 20), cc.v2(70, -288), cc.v2(-389, -288)]
    private figurePointArr2: cc.Vec2[] = [cc.v2(-20, 80), cc.v2(206, -84), cc.v2(120, -350), cc.v2(-160, -350), cc.v2(-247, -84)]
    private startPos: cc.Vec2 = null
    private rememberPos: cc.Vec2 = null
    private idArr:number[] = []
    private levelNum: number = 0
    private isOver: number = 4
    private eventvalue = {
        isResult: 0,
        isLevel: 1,
        levelData: [
           
        ],
        result: 4
    }

    protected static className = "GamePanel";

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            this.figureType = DaAnData.getInstance().figureType
            this.figureLevel = DaAnData.getInstance().figureLevel
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.setPanel()
        }else {
            this.getNet()
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.levelNum].result = 2;
            }
        })
       
        
    }

    start() {
        this.addListener()
    }

    setPanel() {
        this.addData(this.figureLevel.length)
        if(this.figureType == 0) {
            this.m1.getChildByName('figure').getComponent(cc.Sprite).spriteFrame = this.quadrangle
            this.m2.getChildByName('figure').getComponent(cc.Sprite).spriteFrame = this.quadrangle
        }else if(this.figureType == 1) {
            this.m1.getChildByName('figure').getComponent(cc.Sprite).spriteFrame = this.sexangle
            this.m2.getChildByName('figure').getComponent(cc.Sprite).spriteFrame = this.sexangle
            this.m1.setPosition(cc.v2(this.m1.x, this.m1.y + 60))
            this.m2.setPosition(cc.v2(this.m2.x, this.m2.y + 60))
        }
        let totalNum = this.figureLevel.length
        this.initProgress(totalNum)
        this.progress(1)
        this.bubbleAction()
        this.figureAction()
    }

    addListener() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.startPos) {
                return
            }
            this.gc.node.opacity = 255
            this.startPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
        })
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            let pos: cc.Vec2 = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            this.drawLine(this.startPos, pos)
            this.rememberPos = pos
        })
        this.bg.on(cc.Node.EventType.TOUCH_END, (e)=>{
            let endPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            let isClose: boolean = this.getPoint(this.startPos, endPos)
            if(this.pointArr.length >= 2) {
                let num = this.NumberOfCrossingPoint()
                let angle =this.getAngle(this.pointArr[0], this.pointArr[1])
                this.mask.active = true
                let world: cc.Vec2 = cc.v2(0, 0)
                if(this.figureType == 0) {
                    world = this.node.convertToWorldSpaceAR(cc.v2(-20, 20))
                }else if(this.figureType == 1) {
                    world = this.node.convertToWorldSpaceAR(cc.v2(-20, 80))
                }
                let pos = this.getMidPoint(this.pointArr[0], this.pointArr[1])
                let figure1 = this.m1.getChildByName('figure')
                this.m1.setPosition(pos)
                this.m1.angle = -angle
                figure1.angle = angle
                let lastPos1 = this.m1.convertToNodeSpaceAR(world)
                figure1.setPosition(lastPos1)
                
                let figure2 = this.m2.getChildByName('figure')
                this.m2.setPosition(pos)
                this.m2.angle = -180 - angle
                figure2.angle = angle + 180
                let lastPos2 = this.m2.convertToNodeSpaceAR(world)
                figure2.setPosition(lastPos2)
                let id = setTimeout(() => {
                    this.scissorAction(this.pointArr[0], this.pointArr[1], angle)
                    let id1 = setTimeout(() => {
                        if(this.isSuccess(num, isClose)) {
                            AudioManager.getInstance().playSound('sfx_right', false)
                            this.spine.setAnimation(0, 'right', false)
                            this.spine.setCompleteListener(trackEntry=>{
                                if(trackEntry.animation.name == 'right') {
                                    this.spine.setAnimation(0, 'idle', true)
                                }
                            })
                            this.isOver = 2
                            this.eventvalue.result = 2
                            this.eventvalue.levelData[this.levelNum].result = 1
                            let id2 = setTimeout(() => {
                                if(this.levelNum == this.figureLevel.length - 1) {
                                    DaAnData.getInstance().submitEnable = true
                                    this.isOver = 1
                                    this.eventvalue.result = 1
                                    DataReporting.isRepeatReport = false
                                    DataReporting.getInstance().dispatchEvent('addLog', {
                                        eventType: 'clickSubmit',
                                        eventValue: JSON.stringify(this.eventvalue)
                                    })
                                    this.progress(this.levelNum+2)
                                    if(this.figureLevel.length == 1) {
                                        UIHelp.showOverTip(2, '', '', ()=>{}, null, '挑战成功')
                                    }else {
                                        UIHelp.showOverTip(2, '', '', ()=>{}, null, '闯关成功')
                                    }
                                }else {
                                    UIHelp.showOverTip(1, '答对了', '下一关', ()=>{ this.levelNum++;this.nextLevel();})
                                }
                                clearTimeout(id2)
                                let index2 = this.idArr.indexOf(id2)
                                this.idArr.splice(index2, 1)
                            }, 1000);
                            this.idArr.push(id2)
                            
                        }else {
                            this.isOver = 2
                            this.eventvalue.result = 2
                            this.eventvalue.levelData[this.levelNum].result = 2
                            AudioManager.getInstance().playSound('sfx_wrong', false)
                            this.spine.setAnimation(0, 'wrong', false)
                            this.spine.setCompleteListener(trackEntry=>{
                                if(trackEntry.animation.name == 'wrong') {
                                    this.spine.setAnimation(0, 'idle', true)
                                }
                            })
                            this.mask.active = false
                            UIHelp.showTip('再仔细观察一下，加油～')
                            this.reset()
                        }

                        clearTimeout(id1)
                        let index1 = this.idArr.indexOf(id1)
                        this.idArr.splice(index1, 1)
                    }, 3800);
                    this.idArr.push(id1)
                 
                    clearTimeout(id)
                    let index = this.idArr.indexOf(id)
                    this.idArr.splice(index, 1)
                }, 200);
                this.idArr.push(id)
            }else {
                this.gc.clear()
            }
            this.rememberPos = null
            this.startPos = null
        })
        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            let endPos = this.rememberPos
            let isClose: boolean = this.getPoint(this.startPos, endPos)
            if(this.pointArr.length >= 2) {
                let num = this.NumberOfCrossingPoint()
                let angle =this.getAngle(this.pointArr[0], this.pointArr[1])
                this.mask.active = true
                let world: cc.Vec2 = cc.v2(0, 0)
                if(this.figureType == 0) {
                    world = this.node.convertToWorldSpaceAR(cc.v2(-20, 20))
                }else if(this.figureType == 1) {
                    world = this.node.convertToWorldSpaceAR(cc.v2(-20, 80))
                }
                let pos = this.getMidPoint(this.pointArr[0], this.pointArr[1])
                let figure1 = this.m1.getChildByName('figure')
                this.m1.setPosition(pos)
                this.m1.angle = -angle
                figure1.angle = angle
                let lastPos1 = this.m1.convertToNodeSpaceAR(world)
                figure1.setPosition(lastPos1)
                
                let figure2 = this.m2.getChildByName('figure')
                this.m2.setPosition(pos)
                this.m2.angle = -180 - angle
                figure2.angle = angle + 180
                let lastPos2 = this.m2.convertToNodeSpaceAR(world)
                figure2.setPosition(lastPos2)
                let id = setTimeout(() => {
                    this.scissorAction(this.pointArr[0], this.pointArr[1], angle)
                    let id1 = setTimeout(() => {
                        if(this.isSuccess(num, isClose)) {
                            AudioManager.getInstance().playSound('sfx_right', false)
                            this.spine.setAnimation(0, 'right', false)
                            this.spine.setCompleteListener(trackEntry=>{
                                if(trackEntry.animation.name == 'right') {
                                    this.spine.setAnimation(0, 'idle', true)
                                }
                            })
                            this.isOver = 2
                            this.eventvalue.result = 2
                            this.eventvalue.levelData[this.levelNum].result = 1
                            let id2 = setTimeout(() => {
                                if(this.levelNum == this.figureLevel.length - 1) {
                                    this.progress(this.levelNum+2)
                                    DaAnData.getInstance().submitEnable = true
                                    this.isOver = 1
                                    this.eventvalue.result = 1
                                    DataReporting.isRepeatReport = false
                                    DataReporting.getInstance().dispatchEvent('addLog', {
                                        eventType: 'clickSubmit',
                                        eventValue: JSON.stringify(this.eventvalue)
                                    })
                                    if(this.figureLevel.length == 1) {
                                        UIHelp.showOverTip(2, '', '', ()=>{}, null, '挑战成功')
                                    }else {
                                        UIHelp.showOverTip(2, '', '', ()=>{}, null, '闯关成功')
                                    }
                                }else {
                                    UIHelp.showOverTip(1, '答对了', '下一关', ()=>{ this.levelNum++;this.nextLevel();})
                                }
                                clearTimeout(id2)
                                let index2 = this.idArr.indexOf(id2)
                                this.idArr.splice(index2, 1)
                            }, 1000);
                            this.idArr.push(id2)
                            
                        }else {
                            this.isOver = 2
                            this.eventvalue.result = 2
                            this.eventvalue.levelData[this.levelNum].result = 2
                            AudioManager.getInstance().playSound('sfx_wrong')
                            this.spine.setAnimation(0, 'wrong', false)
                            this.spine.setCompleteListener(trackEntry=>{
                                if(trackEntry.animation.name == 'wrong') {
                                    this.spine.setAnimation(0, 'idle', true)
                                }
                            })
                            this.mask.active = false
                            UIHelp.showTip('再仔细观察一下，加油～')
                            this.reset()
                        }

                        clearTimeout(id1)
                        let index1 = this.idArr.indexOf(id1)
                        this.idArr.splice(index1, 1)
                    }, 3800);
                    this.idArr.push(id1)
                 
                    clearTimeout(id)
                    let index = this.idArr.indexOf(id)
                    this.idArr.splice(index, 1)
                }, 200);
                this.idArr.push(id)
            }else {
                this.gc.clear()
            }
            this.rememberPos = null
            this.startPos = null
        })
    }

    figureAction(){
        AudioManager.getInstance().playSound('sfx_move', false)
        this.m1.opacity = 0
        this.m2.opacity = 0
        this.m1.runAction(cc.fadeIn(1))
        this.m2.runAction(cc.fadeIn(1))
    }

    bubbleAction() {
        this.bubble.getChildByName('label').getComponent(cc.Label).string = this.getTitle(this.figureLevel[this.levelNum])
        this.bubble.scale = 0
        this.bubble.runAction(cc.scaleTo(0.3, 1,1))
    }

    scissorAction(p1: cc.Vec2, p2: cc.Vec2, angle: number) {
        let start: cc.Vec2 = cc.v2(0, 0)
        let end: cc.Vec2 = cc.v2(0, 0)
        let began: cc.Vec2 = cc.v2(0, 0)
        if(p1.y >= p2.y) {
            start = p1
            end = p2
            if(p1.x >= p2.x) {
                began = cc.v2(start.x + 200, start.y + 200)
            }else {
                began = cc.v2(start.x - 200, start.y + 200)
            }
        }else {
            start = p2
            end = p1
            if(p1.x > p2.x) {
                began = cc.v2(start.x - 200, start.y + 200)
            }else {
                began = cc.v2(start.x + 200, start.y + 200)
            }
        }
        this.scissor.angle = angle
        let audioId: number = null
        let rotate1 = cc.rotateTo(1, 90+angle)
        let rotate2 = cc.rotateTo(1, 30)
        let move1 = cc.moveTo(1, began)
        let move2 = cc.moveTo(0.3, start)
        let move3 = cc.moveTo(1, end)
        let move4 = cc.moveTo(1, cc.v2(794, -71))
        let fade = cc.fadeOut(0.5)
        let fun0 = cc.callFunc(()=>{
            this.gc.clear()
        })
        let seq1 = cc.sequence(fade, fun0)
        let fun1 = cc.callFunc(()=>{ 
            this.gc.node.runAction(seq1)
            AudioManager.getInstance().playSound('sfx_cut', true, 1, (id)=>{audioId = id})
            this.scissor.getComponent(sp.Skeleton).setAnimation(1, 'jian', true)
        })
        let fun2 = cc.callFunc(()=>{
            AudioManager.getInstance().stopAudio(audioId)
            this.scissor.getComponent(sp.Skeleton).setAnimation(1, 'idle', true)
        })
        let fun3 = cc.callFunc(()=>{
            let pos1 = this.m1.getPosition()
            let pos2 = this.m2.getPosition()
            if(angle < 45 || angle > 135) {
                if(angle< 45) {
                    this.m1.runAction(cc.moveTo(1, cc.v2(pos1.x, pos1.y - 50)))
                    this.m2.runAction(cc.moveTo(1, cc.v2(pos2.x, pos2.y + 50)))
                }else if(angle > 135) {
                    this.m1.runAction(cc.moveTo(1, cc.v2(pos2.x, pos2.y + 50)))
                    this.m2.runAction(cc.moveTo(1, cc.v2(pos1.x, pos1.y - 50)))
                }
            }else {
                this.m1.runAction(cc.moveTo(1, cc.v2(pos1.x - 50, pos1.y)))
                this.m2.runAction(cc.moveTo(1, cc.v2(pos2.x + 50, pos2.y)))
            }
        })


        let spawn1 = cc.spawn(rotate1, move1)
        let spawn2 = cc.spawn(rotate2, move4)
        let seq = cc.sequence(spawn1, fun1, move2, fun3, move3, fun2, spawn2,)
        this.scissor.runAction(seq)
    }

    isSuccess(pointNum: number, isClose: boolean): boolean {
        let index = this.figureLevel[this.levelNum]
        if(index == 0 && pointNum == 1) {
            return true
        }else if(index == 1 && pointNum == 0 && !isClose) {
            return true
        }else if(index == 2 && pointNum == 2) {
            return true
        }else if(index == 3 && pointNum == 0 && !isClose) {
            return true
        }else if(index == 4 && pointNum == 1) {
            return true
        }
        return false
    }

    reset() {
        let pos: cc.Vec2 = cc.v2(0, 0)
        if(this.figureType == 0) {
            pos = cc.v2(-20, 20)
        }else if(this.figureType == 1) {
            pos = cc.v2(-20, 80)
        }
        this.gc.clear()
        this.m1.setPosition(pos)
        this.m2.setPosition(pos)
        this.m1.angle = 0
        this.m2.angle = 0
        let figure1 = this.m1.getChildByName('figure')
        let figure2 = this.m2.getChildByName('figure')
        figure1.setPosition(cc.v2(0, 0))
        figure2.setPosition(cc.v2(0, 0))
        figure1.angle = 0
        figure2.angle = 0
    }

    nextLevel() {
        this.m1.opacity = 0
        this.m2.opacity = 0
        this.reset()
        this.progress(this.levelNum + 1)
        this.bubbleAction()
        this.figureAction()
        this.mask.active = false
    }

    getTitle(index: number): string {
        let str: string = ''
        switch(index){
            case 0:
                str = '试试用一刀剪成一个四边形和一个三角形'
                break
            case 1:
                str = '试试用一刀剪成两个四边形'
                break
            case 2:
                str = '试试用一刀剪成一个四边形和一个三角形'
                break
            case 3:
                str = '试试用一刀剪成一个四边形和一个五边形'
                break
            case 4:
                str = '试试用一刀剪成两个四边形'
                break
            default:
                break
        }
        return str
    }

    segmentsIntr(a:cc.Vec2,b:cc.Vec2,c:cc.Vec2,d:cc.Vec2): any{
        /**1解线性方程组,求线段交点.**/
        //如果分母为0则平行或共线,不相交
        var denominator=(b.y-a.y)*(d.x-c.x)-(a.x-b.x)*(c.y-d.y);
        if(denominator==0){
        return false;
        }
        //线段所在直线的交点坐标(x,y)
        var x=((b.x-a.x)*(d.x-c.x)*(c.y-a.y)
        +(b.y-a.y)*(d.x-c.x)*a.x
        -(d.y-c.y)*(b.x-a.x)*c.x)/denominator;
        var y=-((b.y-a.y)*(d.y-c.y)*(c.x-a.x)
        +(b.x-a.x)*(d.y-c.y)*a.y
        -(d.x-c.x)*(b.y-a.y)*c.y)/denominator;
        /**2判断交点是否在两条线段上**/
        if(
        //交点在线段1上
        (x-a.x)*(x-b.x)<=0&&(y-a.y)*(y-b.y)<=0
        //且交点也在线段2上
        &&(x-c.x)*(x-d.x)<=0&&(y-c.y)*(y-d.y)<=0
        ){
        //返回交点p
        this.pointArr.push(cc.v2(x, y))
        return cc.v2(x, y)
        
        }
        //否则不相交
        return false
    }

    getMidPoint(p1: cc.Vec2, p2: cc.Vec2): cc.Vec2 {
        let midX = Math.abs(p1.x - p2.x) / 2
        let midY = Math.abs(p1.y - p2.y) / 2
        let x: number = 0
        let y: number = 0
        if(p1.x > p2.x) {
            x = p2.x + midX
        }else {
            x = p1.x + midX
        }
        if(p1.y > p2.y) {
            y = p2.y + midY
        }else {
            y = p1.y + midY
        }
        return cc.v2(x, y)
    }

    getAngle(p1: cc.Vec2, p2: cc.Vec2): number {
        let x = Math.abs(p1.x - p2.x)
        let y = Math.abs(p1.y - p2.y)
        let tan = y / x
        let result = Math.atan(tan) / (Math.PI / 180)
        result = Math.round(result)
        if(p1.x > p2.x) {
            if(p1.y < p2.y) {
                return result
            }else {
                return 180 - result
            }
        }else {
            if(p1.y < p2.y) {
                return 180 - result
            }else {
                return result
            }
        }
    }

    NumberOfCrossingPoint(): number {
        let num: number = 0
        if(this.figureType == 0) {
            for (const key in this.pointArr) {
               for (const index in this.figurePointArr1) {
                    let space = Math.sqrt(Math.pow((this.pointArr[key].x - this.figurePointArr1[index].x), 2) + Math.pow((this.pointArr[key].y - this.figurePointArr1[index].y), 2))
                    if(space < 20) {
                        this.pointArr[key] = this.figurePointArr1[index]
                        num++
                    }
               }
            }
        }else {
            for (const key in this.pointArr) {
                for (const index in this.figurePointArr2) {
                     let space = Math.sqrt(Math.pow((this.pointArr[key].x - this.figurePointArr2[index].x), 2) + Math.pow((this.pointArr[key].y - this.figurePointArr2[index].y), 2))
                     if(space < 20) {
                        this.pointArr[key] = this.figurePointArr2[index]
                        num++
                     }
                }
             }
        }

        return num
    }

    getPoint(p1:cc.Vec2, p2:cc.Vec2): boolean {
        this.pointArr = []
        if(this.figureType == 0) {
            let a = this.segmentsIntr(p1, p2, cc.v2(-109, 20), cc.v2(349, 20))
            let b = this.segmentsIntr(p1, p2, cc.v2(349, 20), cc.v2(70, -288))
            let c = this.segmentsIntr(p1, p2, cc.v2(70, -288), cc.v2(-389, -288))
            let d = this.segmentsIntr(p1, p2, cc.v2(-389, -288), cc.v2(-109, 20))
            if(a&&b) {
                return true
            }
            if(b&&c) {
                return true
            }
            if(c&&d) {
                return true
            }
            if(d&&a) {
                return true
            }
        }else if(this.figureType == 1) {
            let a = this.segmentsIntr(p1, p2, cc.v2(-20, 80), cc.v2(206, -84))
            let b = this.segmentsIntr(p1, p2, cc.v2(206, -84), cc.v2(120, -350))
            let c = this.segmentsIntr(p1, p2, cc.v2(120, -350), cc.v2(-160, -350))
            let d = this.segmentsIntr(p1, p2, cc.v2(-160, -350), cc.v2(-247, -84))
            let e = this.segmentsIntr(p1, p2, cc.v2(-247, -84), cc.v2(-20, 80))
            if(a&&b) {
                return true
            }
            if(b&&c) {
                return true
            }
            if(c&&d) {
                return true
            }
            if(d&&e) {
                return true
            }
            if(e&&a) {
                return true
            }
        }
        return false
    }

    drawLine(start:cc.Vec2, end: cc.Vec2){
        //获得组件
        var com = this.gc
        com.clear()
        if(this.figureType == 0) {
            com.strokeColor.fromHEX('#ff6a5b')
        }else if(this.figureType == 1) {
            com.strokeColor.fromHEX('#3dd7ff')
        }
        com.lineWidth = 10
        //获得从start到end的向量
        var line=end.sub(start)
        //获得这个向量的长度
        var lineLength=line.mag()
        //设置虚线中每条线段的长度
        var length=20
        //根据每条线段的长度获得一个增量向量
        var increment=line.normalize().mul(length)
        //确定现在是画线还是留空的bool
        var drawingLine=true
        //
        let canvas = cc.director.getScene().getChildByName('Canvas')
        let width = canvas.width / 2
        let height = canvas.height / 2
        start = cc.v2(start.x + width, start.y + height)
        end = cc.v2(end.x + width, end.y + height)
        //临时变量
        var pos=start.clone()
        //com.strokeColor=cc.color(255,255,255)
        //只要线段长度还大于每条线段的长度
        for(;lineLength>length;lineLength-=length)
        {
            //画线
            if(drawingLine)
            {
                com.moveTo(pos.x,pos.y)
                pos.addSelf(increment)
                com.lineTo(pos.x,pos.y)
                com.stroke()
            }
            //留空
            else
            {
                pos.addSelf(increment)
            }
            //取反
            drawingLine=!drawingLine
        }
        //最后一段
        if(drawingLine)
        {
            com.moveTo(pos.x,pos.y)
            com.lineTo(end.x,end.y)
            com.stroke()
        }
    }

    initProgress(total: number) {
        switch(total) {
            case 1:
                this.progressNode.getChildByName('circle1').active = true
                this.progressNode.getChildByName('circle2').active = false
                this.progressNode.getChildByName('circle3').active = false
                this.progressNode.getChildByName('line1').active = false
                this.progressNode.getChildByName('line2').active = false
                this.progressNode.setPosition(cc.v2(-890, 155))
                this.progressNode.active = false
                break
            case 2:
                this.progressNode.getChildByName('circle1').active = true
                this.progressNode.getChildByName('circle2').active = true
                this.progressNode.getChildByName('circle3').active = false
                this.progressNode.getChildByName('line1').active = true
                this.progressNode.getChildByName('line2').active = false
                this.progressNode.setPosition(cc.v2(-890, 50))
                break
            case 3:
                this.progressNode.getChildByName('circle1').active = true
                this.progressNode.getChildByName('circle2').active = true
                this.progressNode.getChildByName('circle3').active = true
                this.progressNode.getChildByName('line1').active = true
                this.progressNode.getChildByName('line2').active = true
                this.progressNode.setPosition(cc.v2(-890, -55))
                break
            default: 
                break
        }
    }

    progress(num: number) {
        switch(num) {
            case 1:
                this.changeState(this.progressNode.getChildByName('circle1'), 2, true)
                this.changeState(this.progressNode.getChildByName('circle2'), 1, true)
                this.changeState(this.progressNode.getChildByName('circle3'), 1, true)
                this.changeState(this.progressNode.getChildByName('line1'), 1, false)
                this.changeState(this.progressNode.getChildByName('line2'), 1, false)
                break
            case 2: 
                this.changeState(this.progressNode.getChildByName('circle1'), 3, true)
                this.changeState(this.progressNode.getChildByName('circle2'), 2, true)
                this.changeState(this.progressNode.getChildByName('circle3'), 1, true)
                this.changeState(this.progressNode.getChildByName('line1'), 3, false)
                this.changeState(this.progressNode.getChildByName('line2'), 1, false)
                break
            case 3:
                this.changeState(this.progressNode.getChildByName('circle1'), 3, true)
                this.changeState(this.progressNode.getChildByName('circle2'), 3, true)
                this.changeState(this.progressNode.getChildByName('circle3'), 2, true)
                this.changeState(this.progressNode.getChildByName('line1'), 3, false)
                this.changeState(this.progressNode.getChildByName('line2'), 3, false)
                break
            case 4: 
                this.changeState(this.progressNode.getChildByName('circle1'), 3, true)
                this.changeState(this.progressNode.getChildByName('circle2'), 3, true)
                this.changeState(this.progressNode.getChildByName('circle3'), 3, true)
                this.changeState(this.progressNode.getChildByName('line1'), 3, false)
                this.changeState(this.progressNode.getChildByName('line2'), 3, false)
                break
            default:
                break
        }
    }

    changeState(node: cc.Node ,state: number, isCircle: boolean) {

        switch(state) {
            case 1:
                node.getChildByName('gray').active = true
                node.getChildByName('blue').active = false
                if(isCircle) {
                    node.getChildByName('white').active = false
                    node.getChildByName('label').color = cc.color(255, 255, 255)
                }
                break
            case 2:
                node.getChildByName('gray').active = false
                node.getChildByName('blue').active = false
                if(isCircle) {
                    node.getChildByName('white').active = true
                    node.getChildByName('label').color = cc.color(243, 175, 100)
                }
                break
            case 3:
                node.getChildByName('gray').active = false
                node.getChildByName('blue').active = true
                if(isCircle) {
                    node.getChildByName('white').active = false
                    node.getChildByName('label').color = cc.color(255, 255, 255)
                }
                break
            default:
                break
        }
    }

    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: null,
                subject: null,
                result: 4
            })
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
       for (const key in this.idArr) {
           clearTimeout(this.idArr[key])
       }
    }

    onShow() {
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    console.error('there is a error on getNet.')
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if(content.figureType) {
                        this.figureType = content.figureType
                   }else {
                       console.error('figureType wrong at getNet')
                   }
                   if(content.figureLevel) {
                        this.figureLevel = content.figureLevel
                    }else {
                        console.error('figureLevel wrong at getNet')
                    }
              
                    this.setPanel()
                }
            } else {
                
            }
        }.bind(this), null);
    }
}
