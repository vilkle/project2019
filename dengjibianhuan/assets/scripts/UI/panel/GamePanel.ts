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
    //@property(cc.Graphics)
    private g: cc.Graphics = null
    private gF: cc.Graphics = null

    private questionNode: cc.Node = null
    private type: number = 0
    private qTtype: number = 0
    private nodeArr: cc.Vec2[][] = []
    private pathArr: Path[] =[]
    private isOver: number = 0
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
               
                subject: [],
                answer: [],
                result: 4
            }
        ],
        result: 4
    }
    

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
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
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    setPanel() {
        this.initQuestion()
    }

    initQuestion() {    
        this.nodeArr = []
        this.pathArr = []
        if(this.type == 1) {
            this.questionNode = cc.instantiate(this.q1)
            let path = new Path()
            if(this.qTtype == 1) {
                path.startPos = cc.v2(584, 125)
                path.endPos = cc.v2(181, -272)
                this.nodeArr[0] = [cc.v2(-470,-272), cc.v2(181, 371)]
            }else if(this.qTtype == 2) {
                path.startPos = cc.v2(-470, 371)
                path.endPos = cc.v2(181, 371)
                this.nodeArr[0] = [cc.v2(584, 125), cc.v2(181, 125)]
            }else if(this.qTtype == 3) {
                path.startPos = cc.v2(-470, 371)
                path.endPos = cc.v2(181, -272)
                this.nodeArr[0] = [cc.v2(181, 125), cc.v2(583, -272)]
            }else if(this.qTtype == 4) {
                path.startPos = cc.v2(181, -272)
                path.endPos = cc.v2(583, -272)
                this.nodeArr[0] = [cc.v2(-470, 371), cc.v2(181, 371)]
            }
            this.pathArr.push(path)
        }else if(this.type == 2) {
            let path1 = new Path()
            let path2 = new Path()
            if(this.qTtype == 1) {
                this.questionNode = cc.instantiate(this.q6)
                path1.startPos = cc.v2(-470, -273)
                path1.endPos = cc.v2(-470, 371)
                path2.startPos = cc.v2(-470, 371)
                path2.endPos = cc.v2(181, -273)
                this.nodeArr[0] = [cc.v2(181, 125), cc.v2(583, -273), cc.v2(181, -27)]
                this.nodeArr[1] = [cc.v2(181, 125), cc.v2(583, -273), cc.v2(181, -27)]
            }else if(this.qTtype == 2) {
                this.questionNode = cc.instantiate(this.q2)
                path1.startPos = cc.v2(445, -280)
                path1.endPos = cc.v2(285, 300)
                path2.startPos = cc.v2(285, 300)
                path2.endPos = cc.v2(-245, 300)
                this.nodeArr[0] = [cc.v2(-145, -64), cc.v2(-410, -278)]
                this.nodeArr[1] = [cc.v2(-410, -278), cc.v2(-90, -278)]
            }else if(this.qTtype == 3) {
                this.questionNode = cc.instantiate(this.q3)
                path1.startPos = cc.v2(583, -273)
                path1.endPos = cc.v2(583, 125)
                path2.startPos = cc.v2(583, 125)
                path2.endPos = cc.v2(181, -273)
                this.nodeArr[0] = [cc.v2(181, -26), cc.v2(-470, -273), cc.v2(181, 371)]
                this.nodeArr[1] = [cc.v2(181, 371), cc.v2(-470, -273)]
            }else if(this.qTtype == 4) {
                this.questionNode = cc.instantiate(this.q4)
                path1.startPos = cc.v2(696, -277)
                path1.endPos = cc.v2(-400, -277)
                path2.startPos = cc.v2(-400, -277)
                path2.endPos = cc.v2(-400, -270)
                this.nodeArr[0] = [cc.v2(-181, 74), cc.v2(-58, 272), cc.v2(-58, 74)]
                this.nodeArr[1] = [cc.v2(-58, 272), cc.v2(-58, 74)]
            }
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
        }
        this.questionNode.setPosition(cc.v2(0, 0))
        this.node.addChild(this.questionNode)
        let width = cc.director.getScene().getChildByName('Canvas').width / 2
        let height = cc.director.getScene().getChildByName('Canvas').height / 2
        //this.g = this.questionNode.getChildByName('gLine').getComponent(cc.Graphics)
        this.gF = this.questionNode.getChildByName('gFill').getComponent(cc.Graphics)
        //this.g.lineWidth = 10
        this.gF.lineWidth = 0
        this.gF.fillColor.fromHEX('#57d4fa')
        //this.g.moveTo(this.pathArr[0].startPos.x + width, this.pathArr[0].startPos.y + height)
        this.gF.moveTo(this.pathArr[0].startPos.x + width, this.pathArr[0].startPos.y + height)
        for(let i = 0; i < this.nodeArr[0].length; ++i) {
            this.gF.lineTo(this.nodeArr[0][i].x + width, this.nodeArr[0][i].y + height)
            //this.g.lineTo(this.nodeArr[0][i].x + width, this.nodeArr[0][i].y + height)
        }
        //this.g.strokeColor.fromHEX('#ff3399')
        this.gF.strokeColor.fromHEX('#ff3399')
        //this.g.close()
        this.gF.close()
        //this.g.stroke()
        this.gF.stroke()
        this.gF.fill()
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
