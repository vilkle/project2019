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
    private figureType: number = null
    private figureLevel: number[] = null
    private pointArr: cc.Vec2[] = []
    private startPos: cc.Vec2 = null
    private levelNum: number = 0
    private isOver: number = 4
    private eventvalue = {
        isResult: 1,
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
       
        this.addData(6)
    }

    start() {
        this.addListener()
    }

    addListener() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.startPos) {
                return
            }
            this.startPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
        })
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            let pos: cc.Vec2 = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            this.drawLine(this.startPos, pos)
            //this.drawDotLine(this.startPos, pos)
        })
        this.bg.on(cc.Node.EventType.TOUCH_END, (e)=>{
            let endPos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            this.getPoint(this.startPos, endPos)
            let angle =this.getAngle(this.startPos, endPos)
            if(this.pointArr.length == 2) {
                let pos = this.getMidPoint(this.pointArr[0], this.pointArr[1])
                console.log('pos is', pos)
                this.m1.angle = -angle
                let figure1 = this.m1.getChildByName('figure')
                figure1.angle = angle
                this.m1.setPosition(pos)
                figure1.setPosition(cc.v2(-(pos.x + 20) / Math.cos(angle) , -(pos.y - 20) / Math.cos(angle)))
                console.log('figure pos is ', cc.v2(-(pos.x + 20) , -(pos.y - 20)))
                
                this.m2.angle = -180 - angle
                let figure2 = this.m2.getChildByName('figure')
                figure2.angle = angle + 180
                this.m2.setPosition(pos)
                figure2.setPosition(cc.v2((pos.x + 20) / Math.cos(angle) , (pos.y - 20) / Math.cos(angle)))
                setTimeout(() => {
                    let pos1 = this.m1.getPosition()
                    let pos2 = this.m2.getPosition()
                    this.m1.setPosition(cc.v2(pos1.x - 50, pos1.y))
                    this.m2.setPosition(cc.v2(pos2.x + 50, pos2.y))
                }, 2000);
            }
            
            this.startPos = null
        })
        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            this.startPos = null
        })
    }

    setPanel() {
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
        console.log('angle is',result)
        return result
    }

    getPoint(p1:cc.Vec2, p2:cc.Vec2) {
        this.pointArr = []
        if(this.figureType == 0) {
            let a = this.segmentsIntr(p1, p2, cc.v2(-109, 20), cc.v2(349, 20))
            let b = this.segmentsIntr(p1, p2, cc.v2(349, 20), cc.v2(70, -288))
            let c = this.segmentsIntr(p1, p2, cc.v2(70, -288), cc.v2(-389, -288))
            let d = this.segmentsIntr(p1, p2, cc.v2(-389, -288), cc.v2(-109, 20))
            console.log('-------------------------',this.pointArr)
        }else if(this.figureType == 1) {
            let a = this.segmentsIntr(p1, p2, cc.v2(-20, 80), cc.v2(206, -84))
            let b = this.segmentsIntr(p1, p2, cc.v2(206, -84), cc.v2(120, -350))
            let c = this.segmentsIntr(p1, p2, cc.v2(120, -350), cc.v2(-160, -350))
            let d = this.segmentsIntr(p1, p2, cc.v2(-160, -350), cc.v2(-247, -84))
            let e = this.segmentsIntr(p1, p2, cc.v2(-247, -84), cc.v2(-20, 80))
            console.log('-------------------------',this.pointArr)
        }
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
       
    }

    onShow() {
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
