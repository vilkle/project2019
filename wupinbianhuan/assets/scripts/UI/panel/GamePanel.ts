import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { AudioManager } from "../../Manager/AudioManager";
import {ItemType} from "../../Data/ItemType"
import { indexOf } from "../../collections/arrays";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    protected static className = "GamePanel";
    @property(cc.Node)
    private ruleNode: cc.Node = null
    @property(cc.Node)
    private subjectNode: cc.Node = null
    @property(cc.Node)
    private answerNode: cc.Node = null
    @property(cc.Prefab)
    private singlePrefab: cc.Prefab = null
    @property(cc.Prefab)
    private treePrefab: cc.Prefab = null
    @property(cc.SpriteFrame)
    private squareBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private circleYellow: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private triangleGreen: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexangleBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexangleOrange: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexanglePurple: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private octagonBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private octagonGreen: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private octagonYellow: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private arrowBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private arrowBlue: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private arrowOrange: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private handGreen: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private lineBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private lineCurve: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private lineDotted: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private squareLight: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexangleLight: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private octagonLight: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private lineLight: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private arrowLight: cc.SpriteFrame = null
    @property(cc.Node)
    private touchNode: cc.Node = null
    @property(cc.Node)
    private bg: cc.Node = null
    private ruleItemArr: cc.Node[][] = []
    private subjectItemArr: cc.Node[][] = []
    private answerItemArr: cc.Node[] = []
    private type: number = 0
    private figure: number = 0
    private sameType: ItemType = null
    private diffType: ItemType = null
    private type1: ItemType = null
    private type2: ItemType = null
    private arrow1: ItemType = null
    private arrow2: ItemType = null
    private typeNull: ItemType = null
    private arrowNull: ItemType = null
    private typeLight: cc.SpriteFrame = null
    private handLight: cc.SpriteFrame = null
    private ruleDataArr: ItemType[][] = []
    private subjectDataArr: ItemType[][] = []
    private answerDataArr: ItemType[][] = []
    private intervalArr: number[] = []
    private audioId: number = null
    private touchTarget: any = null
    private touchEnable: boolean = true
    private overNum: number = 0
    private isOver: number = 0
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
                subject: null,
                answer: null,
                result: 4
            }
        ],
        result: 4
    }
    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[0].result = 2;
            }
        });
        if(ConstValue.IS_TEACHER) {
            this.type = DaAnData.getInstance().type
            this.figure = DaAnData.getInstance().figure
            this.ruleDataArr = DaAnData.getInstance().ruleDataArr
            this.subjectDataArr = DaAnData.getInstance().subjectDataArr
            this.initGame()
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
        }else {
            this.getNet()
        }
    }

    intervalPoint() {
        for(let i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i])
        }
        this.intervalArr = []
        let index = setTimeout(() => {
            this.point()
            this.intervalPoint()
        }, 15000);
        this.intervalArr.push(index)
       
    }

    stopIntervalPoint() {
        for(let i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i])
        }
        for(let i = 0; i < this.answerDataArr.length; ++i) {
            for(let j = 0; j < this.answerDataArr[i].length; ++j) {
                let node = this.subjectItemArr[i][j].getChildByName('light')
                node.active = false
                node.opacity = 255
                node.scale = 1
                node.stopAllActions()
            }
        }
    }

    point() {
        for(let i = 0; i < this.answerDataArr.length; ++i) {
            for(let j = 0; j < this.answerDataArr[i].length; ++j) {
                if(this.answerDataArr[i][j] == null) {
                    let node = this.subjectItemArr[i][j].getChildByName('light')
                    node.active = true
                    node.opacity = 1
                    node.scale = 0.5
                    let func = cc.callFunc(()=>{
                        node.active = false
                        node.opacity = 255
                        node.scale = 1
                        cc.log('------point')
                    })
                    let func1 = cc.callFunc(()=>{
                        node.opacity = 1
                        node.scale = 0.5
                    })
                    let spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1))
                    let spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2))
                    let seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func)
                    node.stopAllActions()
                    node.runAction(seq)
                }
            }
        }
    }

    initGame() {
        this.eventvalue.levelData[0].answer = DaAnData.getInstance().answerDataArr
        AudioManager.getInstance().playSound('sfx_itchopn')
        AudioManager.getInstance().playSound('请按规则把图形放在正确的位置上吧！', false, 1, (id)=>{this.audioId = id}, null)
        this.initData()
        this.intervalPoint()
        this.initType()
        this.initRule()
        this.initAnswer()
    }

    initData() {
        if(DaAnData.getInstance().figure == 1) {
            this.type1 = ItemType.triangle_green
            this.type2 = ItemType.circle_yellow
            this.arrow1 = ItemType.line_curve
            this.arrow2 = ItemType.line_dotted
            this.typeNull = ItemType.square_black
            this.arrowNull = ItemType.line_black
            this.typeLight = this.squareLight
            this.handLight = this.lineLight
        }else if(DaAnData.getInstance().figure == 2) {
            this.type1 = ItemType.sexangle_orange
            this.type2 = ItemType.sexangle_purple
            this.arrow1 = ItemType.hand_blue
            this.arrow2 = ItemType.hand_green
            this.typeNull = ItemType.sexangle_black
            this.arrowNull = ItemType.hand_black
            this.typeLight = this.sexangleLight
            this.handLight = this.arrowLight
        }else if(DaAnData.getInstance().figure == 3) {
            this.type1 = ItemType.octagon_yellow
            this.type2 = ItemType.octagon_green
            this.arrow1 = ItemType.arrow_blue
            this.arrow2 = ItemType.arrow_orange
            this.typeNull = ItemType.octagon_black
            this.arrowNull = ItemType.arrow_black
            this.typeLight = this.octagonLight
            this.handLight = this.arrowLight
        }
        for(let i = 0; i < this.subjectDataArr.length; i++) {
            this.answerDataArr[i] = []
            for(let j = 0; j < this.subjectDataArr[i].length; j++) {
                if(this.subjectDataArr[i][j]==this.typeNull||this.subjectDataArr[i][j]==this.arrowNull) {
                    this.answerDataArr[i][j] = null
                }else {
                    this.answerDataArr[i][j] = this.subjectDataArr[i][j]
                }
            }
        }
    }

    initType() {
        if(this.subjectNode.children[0]) {
            this.subjectNode.children[0].destroy()
        }
        this.subjectNode.removeAllChildren()
        let node :cc.Node = null
        if(this.type == 1) {
            node = cc.instantiate(this.treePrefab)
            node.setScale(0.9)
            node.setPosition(cc.v2(-300, 0))
        }else if(this.type == 2) { 
            node = cc.instantiate(this.singlePrefab)
            node.setScale(1)
            node.setPosition(cc.v2(-500, 0))
        }
        this.subjectNode.addChild(node)
        for(let i = 0; i < node.children.length; i++) {
            this.subjectItemArr[i] = []
            for(let j = 0; j < node.children[i].children.length; j++) {
                this.subjectItemArr[i][j] = node.children[i].children[j]
                this.setState(this.subjectItemArr[i][j], this.subjectDataArr[i][j])
                if(this.type == 1) {
                    if(i%2 == 1) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.handLight
                    }else if(i%2 == 0) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.typeLight
                    }
                }else if(this.type ==2) {
                    if(j%2 == 1) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.handLight
                    }else if(j%2 == 0) {
                        this.subjectItemArr[i][j].getChildByName('light').getComponent(cc.Sprite).spriteFrame = this.typeLight
                    }
                }
            }
        }
    }

    initRule() {
        for(let i = 0; i< this.ruleNode.children.length; i++) {
            this.ruleItemArr[i] = []
            for(let j = 0; j < this.ruleNode.children[i].children.length; j++) {
                this.ruleItemArr[i][j] = this.ruleNode.children[i].children[j]
            }
        }
       
        for(let i = 0; i < this.ruleItemArr.length; i++) {
            for(let j = 0; j < this.ruleItemArr[i].length; j++) {
                this.ruleItemArr[i][j].getChildByName('blank').opacity = 255
                this.ruleItemArr[i][j].getChildByName('sprite').active = false
                this.setState(this.ruleItemArr[i][j], this.ruleDataArr[i][j])
            }
        }
      
        if(this.figure == 1) {
            this.sameType = this.ruleDataArr[0][1]
            this.diffType = this.ruleDataArr[2][1]
        }else {
            this.sameType = this.ruleDataArr[2][1]
            this.diffType = this.ruleDataArr[0][1]
        }
    }

    initAnswer() {
        if(this.type == 1) {
            let totalNum:number = 0
            let arrowNum:number = 0
            for(let i = 0 ; i < this.subjectDataArr.length; i++) {
                for(let j = 0; j < this.subjectDataArr[i].length; j++) {
                    if(i%2==1) {
                        totalNum++
                        if(this.subjectDataArr[i][j] != this.arrowNull) {
                            arrowNum++
                        }
                    }
                }
            }
            if(totalNum == arrowNum) {
                this.answerNode.getChildByName('arrow1').removeFromParent()
                this.answerNode.getChildByName('arrow2').removeFromParent()
            }else {
                this.setState(this.answerNode.getChildByName('arrow1'), this.arrow1)
                this.setState(this.answerNode.getChildByName('arrow2'), this.arrow2)
                this.answerItemArr[2] = this.answerNode.getChildByName('arrow1')
                this.answerItemArr[3] = this.answerNode.getChildByName('arrow2')
            }
        }else if(this.type == 2) {
            let totalNum:number = 0
            let arrowNum:number = 0
            for(let i = 0 ; i < this.subjectDataArr.length; i++) {
                for(let j = 0; j < this.subjectDataArr[i].length; j++) {
                    if(j%2==1) {
                        totalNum++
                        if(this.subjectDataArr[i][j] != this.arrowNull) {
                            arrowNum++
                        }
                    }
                }
            }
            if(totalNum == arrowNum) {
                this.answerNode.getChildByName('arrow1').removeFromParent()
                this.answerNode.getChildByName('arrow2').removeFromParent()
            }else {
                this.setState(this.answerNode.getChildByName('arrow1'), this.arrow1)
                this.setState(this.answerNode.getChildByName('arrow2'), this.arrow2)
                this.answerItemArr[2] = this.answerNode.getChildByName('arrow1')
                this.answerItemArr[3] = this.answerNode.getChildByName('arrow2')
            }
        }
        this.setState(this.answerNode.getChildByName('figure1'), this.type1)
        this.setState(this.answerNode.getChildByName('figure2'), this.type2)
        this.answerItemArr[0] = this.answerNode.getChildByName('figure1')
        this.answerItemArr[1] = this.answerNode.getChildByName('figure2')
        this.addListenerOnAnswer()
    }

    getRandomNum(min : number, max : number):number {
        var range = max - min;
        var rand = Math.random();
        return(min + Math.round(rand * range));
    }

    addListenerOnAnswer() {
        for(let i = 0; i < this.answerItemArr.length; i++) {
            let node = this.answerItemArr[i].getChildByName('blank')
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget || !this.touchEnable) {
                    return
                }
                this.stopIntervalPoint()
                let rn = this.getRandomNum(1, 4);
                AudioManager.getInstance().stopAll();
                if(rn == 1) {
                    AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }else if(rn == 2) {
                    AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }else if(rn == 3) {
                    AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }else if(rn == 4) {
                    AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                this.touchTarget = e.target
                let type : ItemType = this.answerType(i)
                this.touchNode.active = true
                this.touchNode.zIndex = 100
                this.setState(this.touchNode, type)
                let point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(point)
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target || !this.touchEnable) {
                    return
                }
                let point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(point)
                let totalNum = 0
                for(let n = 0; n < this.subjectItemArr.length; n++) {
                    for(let m = 0; m < this.subjectItemArr[n].length; m++) {
                        let node = this.subjectItemArr[n][m]
                        if(!node.getChildByName('sprite').active) {
                            totalNum++
                            if(node.getChildByName('blank').getBoundingBox().contains(node.convertToNodeSpaceAR(e.currentTouch._point)) && this.isSame(n,m,i)) {
                                node.getChildByName('light').active = true
                                for(let p = 0; p < this.subjectItemArr.length; p++) {
                                    for(let q = 0; q < this.subjectItemArr[p].length; q++) {
                                        if(p != n || q != m) {
                                            this.subjectItemArr[p][q].getChildByName('light').active = false
                                        }
                                    }
                                }
                            }else {
                                this.overNum ++
                            }
                        }
                        if(n == this.subjectItemArr.length-1 && m == this.subjectItemArr[n].length-1) {
                            if(totalNum == this.overNum) {
                                for(let p = 0; p < this.subjectItemArr.length; p++) {
                                    for(let q = 0; q < this.subjectItemArr[p].length; q++) {
                                        this.subjectItemArr[p][q].getChildByName('light').active = false
                                    }
                                }
                            }
                            this.overNum = 0
                        }
                    }
                }

            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(e.target != this.touchTarget || !this.touchEnable) {
                    return
                }
                this.intervalPoint()
                let rn = this.getRandomNum(1, 4);
                AudioManager.getInstance().stopAll();
                if(rn == 1) {
                    AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }else if(rn == 2) {
                    AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }else if(rn == 3) {
                    AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }else if(rn == 4) {
                    AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                this.touchTarget = null
                this.touchNode.active = false
                for(let p = 0; p < this.subjectItemArr.length; p++) {
                    for(let q = 0; q < this.subjectItemArr[p].length; q++) {
                        this.subjectItemArr[p][q].getChildByName('light').active = false
                    }
                }
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(e.target != this.touchTarget || !this.touchEnable) {
                    return
                }
                this.intervalPoint()
                let rn = this.getRandomNum(1, 4);
                AudioManager.getInstance().stopAll();
                if(rn == 1) {
                    AudioManager.getInstance().playSound("sfx_tunedtch1", false);
                }else if(rn == 2) {
                    AudioManager.getInstance().playSound("sfx_tunedtch2", false);
                }else if(rn == 3) {
                    AudioManager.getInstance().playSound("sfx_tunedtch3", false);
                }else if(rn == 4) {
                    AudioManager.getInstance().playSound("sfx_tunedtch4", false);
                }
                for(let n = 0; n < this.subjectItemArr.length; n ++) {
                    for(let m = 0; m < this.subjectItemArr[n].length; m++) {
                        let node: cc.Node = this.subjectItemArr[n][m]
                        if(node.getChildByName('blank').getBoundingBox().contains(node.convertToNodeSpaceAR(e.currentTouch._point))&&!this.subjectItemArr[n][m].getChildByName('sprite').active) {
                            if(this.isSame(n, m, i)) {
                                let result = this.judge(n, m, i)
                                if(result == 1) {
                                    this.answerDataArr[n][m] = this.answerType(i)
                                    this.setState(node, this.answerType(i))
                                    this.adsorbAction(node)
                                    this.eventvalue.levelData[0].result = 2
                                    this.isOver = 2
                                    this.eventvalue.levelData[0].subject = this.answerDataArr
                                    if(this.success()) {
                                        DaAnData.getInstance().submitEnable = true
                                        this.eventvalue.levelData[0].result = 1
                                        this.isOver = 1
                                        this.eventvalue.levelData[0].subject = this.answerDataArr
                                        console.log(this.eventvalue)
                                        DataReporting.getInstance().dispatchEvent('addLog', {
                                            eventType: 'clickSubmit',
                                            eventValue: JSON.stringify(this.eventvalue)
                                        });
                                        UIHelp.showOverTip(2,'你真棒！等等还没做完的同学吧～', null, '挑战成功')
                                    }
                                }else if(result == 2) {
                                    this.answerDataArr[n][m] = this.answerType(i)
                                    this.setState(node, this.answerType(i))
                                    this.adsorbAction(node)
                                    this.eventvalue.levelData[0].result = 2
                                    this.isOver = 2
                                    this.eventvalue.levelData[0].answer = this.answerDataArr
                                    this.touchEnable = false
                                    AudioManager.getInstance().stopAudio(this.audioId)
                                    AudioManager.getInstance().playSound('再仔细看看规则哦~',false, 1,null, ()=>{
                                        this.touchEnable = true
                                        this.setState(node, this.defaultType(i))
                                        this.answerDataArr[n][m] = null
                                    })
                                    this.touchTarget = null
                                    this.touchNode.active = false
                                }else if(result == 3) { 
                                    this.answerDataArr[n][m] = this.answerType(i)
                                    this.setState(node, this.answerType(i))
                                    this.adsorbAction(node)
                                    this.eventvalue.levelData[0].result = 2
                                    this.isOver = 2
                                    this.eventvalue.levelData[0].answer = this.answerDataArr
                                    this.touchEnable = false
                                    AudioManager.getInstance().stopAudio(this.audioId)
                                    AudioManager.getInstance().playSound('目前无法判断这个位置哦~~', false, 1, null, ()=>{
                                        this.touchEnable = true
                                        this.setState(node, this.defaultType(i))
                                        this.answerDataArr[n][m] = null
                                    })
                                    this.touchTarget = null
                                    this.touchNode.active = false
                                }
                            }
                        }
                    }
                }
                for(let p = 0; p < this.subjectItemArr.length; p++) {
                    for(let q = 0; q < this.subjectItemArr[p].length; q++) {
                        if(this.subjectItemArr[p][q].getChildByName('light').opacity == 255) {
                            this.subjectItemArr[p][q].getChildByName('light').active = false
                        }
                    }
                }
                this.touchTarget = null
                this.touchNode.active = false
                this.intervalPoint()
            })
        }
    }

    adsorbAction(node:cc.Node) {
        node = node.getChildByName('sprite')
        let seq = cc.sequence(cc.scaleTo(0.2, 0.8), cc.scaleTo(0.1, 1))
        node.runAction(seq)
    }

    success(): boolean {
        let rightNum:number = 0
        let totalNum:number = 0
        for(let i = 0; i < this.answerDataArr.length; i++) {
            for(let j = 0; j < this.answerDataArr[i].length; j++) {
                totalNum++
                if(this.answerDataArr[i][j]) {
                    rightNum++
                }
            }
        }
        if(totalNum == rightNum){
            return true
        }else {
            return false
        }
    }

    isSame(i: number, j: number, indexOfAnswer: number): boolean {
        if(this.type == 1) {
            if(indexOfAnswer== 0||indexOfAnswer == 1) {
                if(i%2==0) {
                    return true
                }else {
                    return false
                }
            }else if(indexOfAnswer == 2||indexOfAnswer == 3) {
                if(i%2==1) {
                    return true
                }else {
                    return false
                }
            }
        }else if(this.type ==2) {
            if(indexOfAnswer== 0||indexOfAnswer == 1) {
                if(j%2==0) {
                    return true
                }else {
                    return false
                }
            }else if(indexOfAnswer == 2||indexOfAnswer == 3) {
                if(j%2==1) {
                    return true
                }else {
                    return false
                }
            }
        }
    }

    answerType(index: number):ItemType {
        let type:ItemType = null 
        switch(index){
            case 0:
                type = this.type1
                break
            case 1:
                type = this.type2
                break
            case 2:
                type = this.arrow1
                break
            case 3:
                type = this.arrow2
                break
        }
        return type
    }

    defaultType(index: number):ItemType {
        let type:ItemType = null 
        switch(index){
            case 0:
                type = this.typeNull
                break
            case 1:
                type = this.typeNull
                break
            case 2:
                type = this.arrowNull
                break
            case 3:
                type = this.arrowNull
                break
        }
        return type
    }

    judge(i:number, j:number, indexOfAnswer:number):number { //1正确2错误3不能确认   
        let type:ItemType = this.answerType(indexOfAnswer) 
        if(this.type == 1) {
            if(indexOfAnswer== 0||indexOfAnswer == 1) {
                if(i > 4) {
                    if(this.answerDataArr[i-1][j] && this.answerDataArr[i-2][Math.floor(j/2)]) {
                        return this.correct(this.answerDataArr[i-2][Math.floor(j/2)],type,this.answerDataArr[i-1][j], 3)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i-1][j], this.subjectItemArr[i-2][Math.floor(j/2)])
                        return 3
                    }
                }else if(i < 2) {
                    if(this.answerDataArr[i+1][j*2] && this.answerDataArr[i+2][j*2]) {
                        return this.correct(type, this.answerDataArr[i+2][j*2], this.answerDataArr[i+1][j*2], 1)
                    }else if(this.answerDataArr[i+1][j*2+1] && this.answerDataArr[i+2][j*2+1]) {
                        return this.correct(type,this.answerDataArr[i+2][j*2+1], this.answerDataArr[i+1][j*2+1], 1)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i+1][j*2], this.subjectItemArr[i+2][j*2])
                        this.noAnswerPoint(this.subjectItemArr[i+1][j*2+1], this.subjectItemArr[i+2][j*2+1])
                        return 3
                    }
                }else if(i<=4&&i>=2) {
                    if(this.answerDataArr[i-1][j] && this.answerDataArr[i-2][Math.floor(j/2)]) {
                        return this.correct(this.answerDataArr[i-2][Math.floor(j/2)],type,this.answerDataArr[i-1][j], 3)
                    }else  if(this.answerDataArr[i+1][j*2] && this.answerDataArr[i+2][j*2]) {
                        return this.correct(type, this.answerDataArr[i+2][j*2], this.answerDataArr[i+1][j*2], 1)
                    }else if(this.answerDataArr[i+1][j*2+1] && this.answerDataArr[i+2][j*2+1]) {
                        return this.correct(type,this.answerDataArr[i+2][j*2+1], this.answerDataArr[i+1][j*2+1], 1)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i+1][j*2], this.subjectItemArr[i+2][j*2])
                        this.noAnswerPoint(this.subjectItemArr[i+1][j*2+1], this.subjectItemArr[i+2][j*2+1])
                        this.noAnswerPoint(this.subjectItemArr[i-1][j], this.subjectItemArr[i-2][Math.floor(j/2)])
                        return 3
                    }
                }
                
            }else if(indexOfAnswer == 2||indexOfAnswer == 3) {
                if(this.answerDataArr[i-1][Math.floor(j/2)] && this.answerDataArr[i+1][j]) {
                    return this.correct(this.answerDataArr[i-1][Math.floor(j/2)], this.answerDataArr[i+1][j], type, 2)
                }else {
                    this.noAnswerPoint(this.subjectItemArr[i-1][Math.floor(j/2)], this.subjectItemArr[i+1][j])
                    return 3
                }
            }
        }else if(this.type == 2) {
            if(indexOfAnswer== 0||indexOfAnswer == 1) {
                if(j > 6) {
                    if(this.answerDataArr[i][j-1] && this.answerDataArr[i][j-2]) {
                        return this.correct(this.answerDataArr[i][j-2], type, this.answerDataArr[i][j-1], 3)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i][j-1], this.subjectItemArr[i][j-2])
                        return 3
                    }
                }else if(j < 2) {
                    if(this.answerDataArr[i][j+1] && this.answerDataArr[i][j+2]) {
                        return this.correct(type, this.answerDataArr[i][j+2], this.answerDataArr[i][j+1], 1)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i][j+1], this.subjectItemArr[i][j+2])
                        return 3
                    }
                }else if(j>=2&&j<=6) {
                    if(this.answerDataArr[i][j+1] && this.answerDataArr[i][j+2]) {
                        return this.correct(type, this.answerDataArr[i][j+2], this.answerDataArr[i][j+1], 1)
                    }else if(this.answerDataArr[i][j-1] && this.answerDataArr[i][j-2]) {
                        return this.correct(this.answerDataArr[i][j-2], type, this.answerDataArr[i][j-1], 3)
                    }else {
                        this.noAnswerPoint(this.subjectItemArr[i][j-1], this.subjectItemArr[i][j-2])
                        this.noAnswerPoint(this.subjectItemArr[i][j+1], this.subjectItemArr[i][j+2])
                        return 3
                    }
                }
            }else if(indexOfAnswer == 2||indexOfAnswer == 3) {
                if(this.answerDataArr[i][j-1] && this.answerDataArr[i][j+1]) {
                    return this.correct(this.answerDataArr[i][j-1], this.answerDataArr[i][j+1], type, 2)
                }else {
                    this.noAnswerPoint(this.subjectItemArr[i][j-1], this.subjectItemArr[i][j+1])
                    return 3
                }
            }
        }
    }

    correct(type1: ItemType, type2:ItemType, arrow: ItemType, answerType: number): number {
        if(arrow == this.sameType) {
            if(type1 == type2) {
                return 1
            }else {
                this.rulePoint(type1, type2, arrow, answerType)
                return 2
            }
        }else if(arrow == this.diffType) {
            if(type1 != type2) {
                return 1
            }else {
                this.rulePoint(type1, type2, arrow, answerType)
                return 2
            }
        }
    }

    noAnswerPoint(item1:cc.Node, item2:cc.Node) {
        cc.log(item1, item2)
        if(!item1.getChildByName('sprite').active) {
            let node1 = item1.getChildByName('light')
            node1.active = true
            node1.opacity = 1
            node1.scale = 0.5
            let func = cc.callFunc(()=>{
                node1.active = false
                node1.opacity = 255
                node1.scale = 1
                cc.log('-------noAnswerPoint')
            })
            let func1 = cc.callFunc(()=>{
                node1.opacity = 1
                node1.scale = 0.5
            })
            let spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1))
            let spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2))
            let seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func)
            node1.stopAllActions()
            node1.runAction(seq)
        }
        if(!item2.getChildByName('sprite').active) {
            let node = item2.getChildByName('light')
            node.active = true
            node.opacity = 1
            node.scale = 0.5
            let func = cc.callFunc(()=>{
                node.active = false
                node.opacity = 255
                node.scale = 1
            })
            let func1 = cc.callFunc(()=>{
                node.opacity = 1
                node.scale = 0.5
            })
            let spawn1 = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1))
            let spawn2 = cc.spawn(cc.fadeOut(0.5), cc.scaleBy(0.5, 1.2))
            let seq = cc.sequence(spawn1, spawn2, func1, spawn1, spawn2, func)
            node.stopAllActions()
            node.runAction(seq)
        }
    }

    rulePoint(type1:ItemType, type2:ItemType, arrow:ItemType, answerType:number) {
       for(let i = 0; i < this.ruleItemArr.length; ++i) {
           for(let j = 0; j < this.ruleItemArr[i].length; ++j) {
                if(answerType==1) {
                    if(this.ruleDataArr[i][j] == arrow && this.ruleDataArr[i][j+1] == type2) {
                            this.ruleItemArr[i][j-1].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j+1].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                    }
                }else if(answerType==2) {
                    if(this.ruleDataArr[i][j] == type1 && this.ruleDataArr[i][j+2] == type2) {
                            this.ruleItemArr[i][j+2].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j+1].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                    }
                }else if(answerType==3) {
                    if(this.ruleDataArr[i][j+1] == arrow && this.ruleDataArr[i][j] == type1) {
                        this.ruleItemArr[i][j+2].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                            this.ruleItemArr[i][j+1].runAction(cc.sequence(cc.moveBy(0.2, 20,0), cc.moveBy(0.2, -40,0),cc.moveBy(0.2, 40,0), cc.moveBy(0.2, -20,0)))
                    }
                }
           }
       }
    }
    

    setRuleDefault(i: number, j:number, type: ItemType) {
        this.setState(this.ruleItemArr[i][j], type) 
    }

    setState(node: cc.Node, state: ItemType) {
        if(state == 1||state == 4||state == 7|| state == 10||state == 13||state == 16) {
            node.getChildByName('sprite').active = false
            node.getChildByName('blank').opacity = 255
            node.getChildByName('blank').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(state)
        }else {
            node.getChildByName('sprite').active = true
            node.getChildByName('blank').opacity = 0
            node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(state)
        }
    }

    getSpriteframe(state: ItemType): cc.SpriteFrame {
        switch(state) {
             case 1:
             return this.arrowBlack
             break
             case 2:
             return this.arrowBlue
             break
             case 3:
             return this.arrowOrange
             break
             case 4:
             return this.lineBlack
             break
             case 5:
             return this.lineCurve
             break
             case 6:
             return this.lineDotted
             break
             case 7:
             return this.arrowBlack
             break
             case 8:
             return this.arrowBlue
             break
             case 9:
             return this.handGreen
             break
             case 10:
             return this.squareBlack
             break
             case 11:
             return this.triangleGreen
             break
             case 12:
             return this.circleYellow
             break
             case 13:
             return this.sexangleBlack
             break
             case 14:
             return this.sexangleOrange
             break
             case 15:
             return this.sexanglePurple
             break
             case 16:
             return this.octagonBlack
             break 
             case 17:
             return this.octagonGreen
             break
             case 18:
             return this.octagonYellow
             break
             default:
             console.error('get wrong spriteframe')
             break
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
        for(let i = 0; i < this.intervalArr.length; i++) {
            clearTimeout(this.intervalArr[i])
        }
        this.intervalArr = []
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
                    if(content.type) {
                        DaAnData.getInstance().type = content.type
                        this.type = content.type
                    }else {
                        console.error('网络请求数据content.type为空')
                        return
                    }
                    if(content.figure) {
                        DaAnData.getInstance().figure = content.figure
                        this.figure = content.figure
                    }else {
                        console.error('网络请求数据content.figure为空')
                        return
                    }
                    if(content.ruleDataArr) {
                        DaAnData.getInstance().ruleDataArr = content.ruleDataArr
                        this.ruleDataArr = content.ruleDataArr
                    }else {
                        console.error('网络请求数据content.ruleDataArr为空')
                        return
                    }
                    if(content.subjectDataArr) {
                        DaAnData.getInstance().subjectDataArr = content.subjectDataArr
                        this.subjectDataArr = content.subjectDataArr
                    }else {
                        console.error('网络请求数据content.subjectDataArr为空')
                        return
                    }
                    if(content.answerDataArr) {
                        DaAnData.getInstance().answerDataArr = content.answerDataArr
                    }else {
                        console.error('网络请求数据content.answerDataArr为空')
                        return
                    }
                    this.initGame()
                }
            } else {
               console.error('网络请求数据失败')
            }
        }.bind(this), null);
    }
}
