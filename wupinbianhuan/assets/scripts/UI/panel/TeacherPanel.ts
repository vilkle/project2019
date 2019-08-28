import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";
import {ItemType} from "../../Data/ItemType"
import { DefalutTitle } from "../Item/OverTips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property([cc.Toggle])
    private typeToggleContainer: cc.Toggle[] =[]
    @property([cc.Toggle])
    private figureToggleContainer: cc.Toggle[] = []
    @property(cc.Node)
    private ruleNode: cc.Node = null
    @property(cc.Node)
    private subjectNode: cc.Node = null
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
    @property(cc.Label)
    private tipLabel: cc.Label = null
    @property(cc.Node)
    private tipNode: cc.Node = null
    private ruleItemArr: cc.Node[][] = []
    private subjectItemArr: cc.Node[][] = []
    private ruleDataArr: ItemType[][] = []
    private subjectDataArr: ItemType[][] = []
    private answerDataArr: ItemType[][] = []
    private currentType = 1 //当前的题目类型
    private currentFigure = 2
    private sameType: ItemType = null  //相同类型之间变换的规则
    private diffType: ItemType = null
    private type1: ItemType = null
    private type2: ItemType = null
    private arrow1: ItemType = null
    private arrow2: ItemType = null
    private arrowNull: ItemType = null
    // onLoad () {}

    start() {
        this.getNet()
    }

    setPanel() {//设置教师端界面
        if(DaAnData.getInstance().type == 0) {
            DaAnData.getInstance().type = 1
        }
        if(DaAnData.getInstance().figure == 0) {
            DaAnData.getInstance().figure = 2
            this.sameType = ItemType.arrow_orange
            this.diffType = ItemType.arrow_blue
            this.type1 = ItemType.sexangle_orange
            this.type2 = ItemType.sexangle_purple
        }
        this.typeToggleContainer[DaAnData.getInstance().type-1].isChecked = true
        this.figureToggleContainer[DaAnData.getInstance().figure-1].isChecked = true
        this.initType()
        this.initFigure()
        this.getItem()
        if(DaAnData.getInstance().ruleDataArr) {
            this.setRule()
        }else {
            this.defaultRule()
        }
        if(DaAnData.getInstance().subjectDataArr) {
            this.setSubject()
        }else {
            this.defaultSubject(DaAnData.getInstance().type == 1)
        }
    }

    setRule() {
        for(let i = 0; i < this.ruleItemArr.length; i++) {
            for(let j = 0; j < this.ruleItemArr[i].length; j++) {
                this.setState(this.ruleItemArr[i][j], DaAnData.getInstance().ruleDataArr[i][j])
                this.ruleDataArr[i][j] = DaAnData.getInstance().ruleDataArr[i][j]
            }
        }
    }

    setSubject() {
        for(let i = 0; i < this.subjectItemArr.length; i++) {
            for(let j = 0; j < this.subjectItemArr[i].length; j++) {
                this.setState(this.subjectItemArr[i][j], DaAnData.getInstance().subjectDataArr[i][j])
                this.subjectDataArr[i][j] = DaAnData.getInstance().subjectDataArr[i][j]
            }
        }
    }

    defaultRule() {
        let type1: ItemType = null
        let type2: ItemType = null
        let arrow1: ItemType = null
        let arrow2: ItemType = null
        if(DaAnData.getInstance().figure == 1) {
            type1 = ItemType.triangle_green
            type2 = ItemType.circle_yellow
            arrow1 = ItemType.line_curve
            arrow2 = ItemType.line_dotted
        }else if(DaAnData.getInstance().figure == 2) {
            type1 = ItemType.sexangle_orange
            type2 = ItemType.sexangle_purple
            arrow1 = ItemType.hand_blue
            arrow2 = ItemType.hand_green
        }else if(DaAnData.getInstance().figure == 3) {
            type1 = ItemType.octagon_green
            type2 = ItemType.octagon_yellow
            arrow1 = ItemType.arrow_blue
            arrow2 = ItemType.arrow_orange
        }
        for(let i = 0; i < this.ruleItemArr.length; i++) {
            for(let j = 0; j < this.ruleItemArr[i].length; j++) {
                this.ruleItemArr[i][j].getChildByName('blank').opacity = 255
                this.ruleItemArr[i][j].getChildByName('sprite').active = false
            }
        }
        this.setRuleDefault(0,0, type1)
        this.setRuleDefault(1,2, type1) 
        this.setRuleDefault(2,0, type1)
        this.setRuleDefault(2,2, type1)
        this.setRuleDefault(0,2, type2)
        this.setRuleDefault(1,0, type2) 
        this.setRuleDefault(3,0, type2)
        this.setRuleDefault(3,2, type2)
        this.setRuleDefault(0,1, arrow1)
        this.setRuleDefault(1,1, arrow1) 
        this.setRuleDefault(2,1, arrow2)
        this.setRuleDefault(3,1, arrow2)
        this.sameType = arrow1
        this.diffType = arrow2
    }

    defaultSubject( isTree: boolean) {
        let type1: ItemType = null
        let type2: ItemType = null
        let arrow1: ItemType = null
        let arrow2: ItemType = null
        if(DaAnData.getInstance().figure == 1) {
            type1 = ItemType.triangle_green
            type2 = ItemType.circle_yellow
            arrow1 = ItemType.line_curve
            arrow2 = ItemType.line_dotted
        }else if(DaAnData.getInstance().figure == 2) {
            type1 = ItemType.sexangle_orange
            type2 = ItemType.sexangle_purple
            arrow1 = ItemType.hand_blue
            arrow2 = ItemType.hand_green
        }else if(DaAnData.getInstance().figure == 3) {
            type1 = ItemType.octagon_green
            type2 = ItemType.octagon_yellow
            arrow1 = ItemType.arrow_blue
            arrow2 = ItemType.arrow_orange
        }
        for(let i = 0; i < this.subjectItemArr.length; i++) {
            for(let j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').opacity = 255
                this.subjectItemArr[i][j].getChildByName('sprite').active = false
            }
        }
        if(isTree) {
            this.setState(this.subjectItemArr[0][0], type2)
            this.subjectDataArr[0][0] = type2
            this.answerDataArr[0][0] = type2
            for(let i = 0; i < this.subjectItemArr.length; i++) {
                for(let j = 0; j < this.subjectItemArr[i].length; j++) {
                    if(i%2 == 1) {
                        if(j%2 == 1) {
                            this.setState(this.subjectItemArr[i][j], arrow1)
                            this.subjectDataArr[i][j] = arrow1
                            this.answerDataArr[i][j] = arrow1
                        }else { 
                            this.setState(this.subjectItemArr[i][j], arrow2)
                            this.subjectDataArr[i][j] = arrow2
                            this.answerDataArr[i][j] = arrow2
                        }
                    }
                }
            }
        }else {
            this.setSubjectDefault(0,0, type1)
            this.setSubjectDefault(0,2, type1)
            this.setSubjectDefault(1,2, type1)
            this.setSubjectDefault(3,0, type1)
            this.setSubjectDefault(3,8, type1)
            this.setSubjectDefault(0,8, type2)
            this.setSubjectDefault(1,0, type2)
            this.setSubjectDefault(1,6, type2)
            this.setSubjectDefault(2,2, type2)
            this.setSubjectDefault(2,4, type2)
            this.setSubjectDefault(0,1, arrow1)
            this.setSubjectDefault(0,3, arrow1)
            this.setSubjectDefault(2,5, arrow1)
            this.setSubjectDefault(2,7, arrow1)
            this.setSubjectDefault(3,1, arrow1)
            this.setSubjectDefault(3,5, arrow1)
            this.setSubjectDefault(0,5, arrow2)
            this.setSubjectDefault(1,3, arrow2)
            this.setSubjectDefault(1,7, arrow2)
            this.setSubjectDefault(2,1, arrow2)
            this.setSubjectDefault(3,7, arrow2)
        }
    }

    setRuleDefault(i: number, j:number, type: ItemType) {
        this.setState(this.ruleItemArr[i][j], type) 
        this.ruleDataArr[i][j] = type
    }

    setSubjectDefault(i: number, j:number, type: ItemType) {
        this.setState(this.subjectItemArr[i][j], type) 
        this.subjectDataArr[i][j] = type
        this.answerDataArr[i][j] = type
    }
  
     /**
     * 获取itemtype值 
     * @param i 
     * @param j
     * @param type 1、rule下节点 2、subject下节点
     * @param typetype 1、tree 2、single
     */
    getItemData(i: number, j :number, type: number, typetype?: number) : ItemType { 
        let state: number = 1
        if(type == 1) {
            state = j
        }else if(type == 2) {
            if(typetype == 1) {
                state = i
            }else if(typetype == 2) {
                state = j
            }
        }

        if(DaAnData.getInstance().figure == 1) {
            if(state%2==0) {
                return ItemType.square_black
            }else {
                return ItemType.line_black
            }
        }else if(DaAnData.getInstance().figure == 2) {
            if(state%2==0) {
                return ItemType.sexangle_black
            }else {
                return ItemType.hand_black
            }
        }else if(DaAnData.getInstance().figure == 3) {
            if(state%2==0) {
                return ItemType.octagon_black
            }else {
                return ItemType.arrow_black
            }
        }

    }

    nextType(type: ItemType): ItemType {
        let highNum = Math.floor(type/3) * 3 + 3
        if(type%3 == 0) {
            highNum -= 3
        }
        let lowNum = highNum - 2
        let next = type + 1
        if(next > highNum) {
            next = lowNum
        }
        return next
    }
    
    getItem() {
        this.ruleItemArr = []
        this.subjectItemArr = []
        this.ruleDataArr = []
        this.subjectDataArr = []
        this.answerDataArr = []
        if(this.ruleNode.children[0]) {
            let nodeArr = this.ruleNode.children[0].children
            for(let i = 0; i < nodeArr.length; ++i) {
                this.ruleItemArr[i] = []
                this.ruleDataArr[i] = []
                for(let j = 0; j < nodeArr[i].children.length; ++j) {
                    this.ruleItemArr[i][j] = nodeArr[i].children[j]
                    this.ruleDataArr[i][j] = this.getItemData(i,j,1)
                }
            }
        }
        if(this.subjectNode.children[0]) {
            let nodeArr = this.subjectNode.children[0].children
            for(let i = 0; i < nodeArr.length; ++i) {
                this.subjectItemArr[i] = []
                this.subjectDataArr[i] = []
                this.answerDataArr[i] = []
                for(let j = 0; j < nodeArr[i].children.length; ++j) {
                    this.subjectItemArr[i][j] = nodeArr[i].children[j]
                    this.subjectDataArr[i][j] = this.getItemData(i,j,2,DaAnData.getInstance().type)
                }
            }
        }
        this.addListenerOnItem()
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

    addListenerOnItem() {
        for(let i = 0; i < this.ruleItemArr.length; i++) {
                this.ruleItemArr[i][1].getChildByName('blank').off(cc.Node.EventType.TOUCH_START)
        }
        for(let i = 0; i < this.subjectItemArr.length; i++) {
            for(let j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').off(cc.Node.EventType.TOUCH_START)
            }
        }
        for(let i = 0; i < this.ruleItemArr.length; i++) {
            this.ruleItemArr[i][1].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, ()=>{
                this.ruleDataArr[i][1] = this.nextType(this.ruleDataArr[i][1])
                this.setState(this.ruleItemArr[i][1], this.ruleDataArr[i][1])
                //相同排的同步变化
                if(i==0) {
                    this.diffType = this.ruleDataArr[0][1]
                    this.ruleDataArr[1][1] = this.ruleDataArr[0][1]
                    this.setState(this.ruleItemArr[1][1], this.ruleDataArr[1][1])    
                }else if(i==1) {
                    this.diffType = this.ruleDataArr[1][1]
                    this.ruleDataArr[0][1] = this.ruleDataArr[1][1]
                    this.setState(this.ruleItemArr[0][1], this.ruleDataArr[0][1])
                }else if(i==2) {
                    this.sameType = this.ruleDataArr[2][1]
                    this.ruleDataArr[3][1] = this.ruleDataArr[2][1]
                    this.setState(this.ruleItemArr[3][1], this.ruleDataArr[3][1])
                }else if(i==3) {
                    this.sameType = this.ruleDataArr[3][1]
                    this.ruleDataArr[2][1] = this.ruleDataArr[3][1]
                    this.setState(this.ruleItemArr[2][1], this.ruleDataArr[2][1])
                }
            })
        }
        for(let i = 0; i < this.subjectItemArr.length; i++) {
            for(let j = 0; j < this.subjectItemArr[i].length; j++) {
                this.subjectItemArr[i][j].getChildByName('blank').on(cc.Node.EventType.TOUCH_START, ()=>{
                    this.subjectDataArr[i][j] = this.nextType(this.subjectDataArr[i][j])
                    this.setState(this.subjectItemArr[i][j], this.subjectDataArr[i][j]) 
                })
            }
        }
    }

    initType() {
        if(DaAnData.getInstance().type != this.currentType) {
            if(this.subjectNode.children[0]) {
                this.subjectNode.children[0].destroy()
                this.subjectNode.removeAllChildren()
            }
            let node: cc.Node = null
            if(DaAnData.getInstance().type == 1) {
                node = cc.instantiate(this.treePrefab)
                node.setPosition(cc.v2(-513, 0))
                this.currentType = 1
            }else if(DaAnData.getInstance().type == 2) {
                node = cc.instantiate(this.singlePrefab)
                node.setPosition(cc.v2(-545, 0))
                this.currentType = 2
            }
            this.subjectNode.addChild(node)
            this.currentFigure = 2
            this.getItem()
            this.defaultRule()
            this.defaultSubject(DaAnData.getInstance().type == 1)
        }
    }

    initFigure() {
        if(this.currentFigure != DaAnData.getInstance().figure) {
            if(DaAnData.getInstance().figure == 1) {
                this.changeFigure(this.squareBlack, this.arrowBlack)
                this.currentFigure = 1
            }else if(DaAnData.getInstance().figure == 2) {
                this.changeFigure(this.sexangleBlack, this.arrowBlack)
                this.currentFigure = 2
            }else if(DaAnData.getInstance().figure == 3) {
                this.changeFigure(this.octagonBlack, this.lineBlack)
                this.currentFigure = 3
            }
        }
        this.getItem()
        this.defaultRule()
        this.defaultSubject(DaAnData.getInstance().type == 1)
    }
    changeFigure(frame: cc.SpriteFrame, signFrame: cc.SpriteFrame) {
        if(this.ruleNode.children[0]) {
            let nodeArr = this.ruleNode.children[0].children
            for(let i = 0; i < nodeArr.length; i++) {
                for(let j = 0; j < nodeArr[i].children.length; j++) {
                    if(j%2==0) {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame
                    }else {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame
                    }
                }
            }
        }  
        if(this.subjectNode.children[0]) {
            let nodeArr = this.subjectNode.children[0].children
            if(DaAnData.getInstance().type == 1) {
                for(let i = 0; i < nodeArr.length; i++) {
                    if(i%2==0) {
                        for(let j = 0; j < nodeArr[i].children.length; j++) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame
                        }
                    }else {
                        for(let j = 0; j < nodeArr[i].children.length; j++) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame  
                        }
                    }
                }
            }else if(DaAnData.getInstance().type == 2) {
                for(let i = 0; i < nodeArr.length; i++) {
                    for(let j = 0; j < nodeArr[i].children.length; j++) {
                        if(j%2==0) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame
                        }else {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = signFrame  
                        }
                    }
                }
            }   
        }
    }



    onTypeToggle(toggle) {
        let index = this.typeToggleContainer.indexOf(toggle)
        switch(index) {
            case 0:
                DaAnData.getInstance().type = 1
                this.initType()
                this.initFigure()
                break
            case 1:
                DaAnData.getInstance().type = 2
                this.initType()
                this.initFigure()
                break
            default:
                console.error(`the ${index} type toggle have error.`)
                break    
        }
    }

    onFigureToggle(toggle) {
        let index = this.figureToggleContainer.indexOf(toggle)
        switch(index) {
            case 0:
                DaAnData.getInstance().figure = 1
                this.type1 = ItemType.triangle_green
                this.type2 = ItemType.circle_yellow
                this.arrow1 = ItemType.line_curve
                this.arrow2 = ItemType.line_dotted
                this.arrowNull = ItemType.line_black
                this.initFigure()
                break
            case 1:
                DaAnData.getInstance().figure = 2
                this.type1 = ItemType.sexangle_orange
                this.type2 = ItemType.sexangle_purple
                this.arrow1 = ItemType.hand_blue
                this.arrow2 = ItemType.hand_green
                this.arrowNull = ItemType.hand_black
                this.initFigure()
                break
            case 2:
                DaAnData.getInstance().figure = 3
                this.type1 = ItemType.octagon_green
                this.type2 = ItemType.octagon_yellow
                this.arrow1 = ItemType.arrow_blue
                this.arrow2 = ItemType.arrow_orange
                this.arrowNull = ItemType.arrow_black
                this.initFigure()
                break
            default:
                console.error(`the ${index} figure toggle have error.`)
                break
        }
    }

    checking():boolean {
        if(this.ruleDataArr[0][1] == this.arrowNull) {
            this.showTip('相同颜色的变换规则不能为空，请重新选择。')
            return false 
        }
        if(this.ruleDataArr[2][1] == this.arrowNull) {
            this.showTip('不同颜色的变换规则不能为空，请重新选择。')
            return false 
        }
        if(this.ruleDataArr[0][1] == this.ruleDataArr[2][1]) {
            this.showTip('相同颜色之间变换与不同颜色相互变换规则一样，相同颜色之间变换和不同颜色相互变换之间规则不能相同。')
            return false
        }
        if(DaAnData.getInstance().type == 1) {
            if(!this.checkTree(this.subjectDataArr)) {
                this.showTip('题目已知条件不能导出所有答案，请重新配题。')
                return false
            }
        }else if(DaAnData.getInstance().type == 2) {
            if(!this.checkSingle(this.subjectDataArr)) {
                this.showTip('题目已知条件不能导出所有答案，请重新配题。')
                return false
            }  
        }

        return true
    }

    checkTree(arr: ItemType[][]): boolean {
        for(let i = 0; i < this.answerDataArr.length; i++) {
            for(let j = 0; j < this.answerDataArr[i].length; j++) {
                if(i%2 == 1) {
                    if(this.answerDataArr[i][j]==this.sameType) {
                        if(this.answerDataArr[i-1][Math.floor(j/2)]) {
                            this.answerDataArr[i+1][j] = this.answerDataArr[i-1][Math.floor(j/2)]
                        }
                        if(this.answerDataArr[i+1][j]) {
                            this.answerDataArr[i-1][Math.floor(j/2)] = this.answerDataArr[i+1][j]
                        }
                    }else if(this.answerDataArr[i][j]==this.diffType) {
                        if(this.answerDataArr[i-1][Math.floor(j/2)] == this.type1) {
                            this.answerDataArr[i+1][j] = this.type2
                        }else if(this.answerDataArr[i-1][Math.floor(j/2)] == this.type2) {
                            this.answerDataArr[i+1][j] = this.type1
                        }
                        if(this.answerDataArr[i+1][j] == this.type1) {
                            this.answerDataArr[i-1][Math.floor(j/2)] = this.type2
                        }else if(this.answerDataArr[i+1][j] == this.type2) {
                            this.answerDataArr[i-1][Math.floor(j/2)] = this.type1
                        }
                    }
                }
            }
        }
        for(let i = 0; i < this.answerDataArr.length; i++) {
            for(let j = 0; j < this.answerDataArr[i].length; j++) {
                if(i%2 == 0) {
                    if(this.answerDataArr[i+2]) {
                        if(this.answerDataArr[i][j] && this.answerDataArr[i+2][j*2]) {
                            if(this.answerDataArr[i][j] == this.answerDataArr[i+2][j*2]) {
                                this.answerDataArr[i+1][j*2] = this.sameType
                            }else if(this.answerDataArr[i][j] != this.answerDataArr[i+2][j*2]) {
                                this.answerDataArr[i+1][j*2] = this.diffType
                            }
                        }
                        if(this.answerDataArr[i][j] && this.answerDataArr[i+2][j*2+1]) {
                            if(this.answerDataArr[i][j] == this.answerDataArr[i+2][j*2+1]) {
                                this.answerDataArr[i+1][j*2+1] = this.sameType
                            }else if(this.answerDataArr[i][j] != this.answerDataArr[i+2][j*2+1]) {
                                this.answerDataArr[i+1][j*2+1] = this.diffType
                            }
                        }
                    }
                }
            }
        }
        let answerNum: number = 0
        let totalNum: number = 0
        for(let i = 0; i < this.subjectDataArr.length; i++) {
            for(let j = 0; j < this.subjectDataArr[i].length; j++) {
                totalNum++
                if(this.answerDataArr[i][j]) {
                    answerNum++
                }
            }
        }
        if(answerNum != totalNum) {
            return false
        }
        return true
    }

    checkSingle(arr: ItemType[][]):boolean {
        for(let i = 0; i < this.answerDataArr.length; i++) {
            for(let j = 0; j < this.answerDataArr[i].length; j++) {
                if(j%2 == 1) {
                    if(this.answerDataArr[i][j]==this.sameType) {
                        if(this.answerDataArr[i][j-1]) {
                            this.answerDataArr[i][j+1] = this.answerDataArr[i][j-1]
                        }
                        if(this.answerDataArr[i][j+1]) {
                            this.answerDataArr[i][j-1] = this.answerDataArr[i][j+1]
                        }
                    }else if(this.answerDataArr[i][j]==this.diffType) {
                        if(this.answerDataArr[i][j-1] == this.type1) {
                            this.answerDataArr[i][j+1] = this.type2
                        }else if(this.answerDataArr[i][j-1] == this.type2) {
                            this.answerDataArr[i][j+1] = this.type1
                        }
                        if(this.answerDataArr[i][j+1] == this.type1) {
                            this.answerDataArr[i][j-1] = this.type2
                        }else if(this.answerDataArr[i][j+1] == this.type2) {
                            this.answerDataArr[i][j-1] = this.type1
                        }
                    }
                }
            }
        }
        for(let i = 0; i < this.answerDataArr.length; i++) {
            for(let j = 0; j < this.answerDataArr[i].length; j++) {
                if(j%2==0) {
                    if(this.answerDataArr[i][j]&&this.answerDataArr[i][j+2]) {
                        if(this.answerDataArr[i][j]==this.answerDataArr[i][j+2]) {
                            this.answerDataArr[i][j+1] = this.sameType
                        }else {
                            this.answerDataArr[i][j+1] = this.diffType
                        }
                    }
                }
            }
        }
        let answerNum:number = 0 
        let totalNum:number = 0
        for(let i = 0; i < this.subjectDataArr.length; i++) {
            for(let j = 0; j < this.subjectDataArr[i].length; j++) {
                totalNum++
                if(this.answerDataArr[i][j]) {
                    answerNum++
                }
            }
        }
        if(answerNum != totalNum) {
            return false
        }
        return true
    }


    //上传课件按钮
    onBtnSaveClicked() {
        DaAnData.getInstance().ruleDataArr = this.ruleDataArr
        DaAnData.getInstance().subjectDataArr = this.subjectDataArr

        if(this.checking()) {
            //UIManager.getInstance().showUI(SubmissionPanel)
            UIManager.getInstance().showUI(GamePanel, ()=>{
                ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1});    
            });
        }
        
    }

    showTip(str:string) {
        this.tipLabel.string = str
        this.tipNode.active = true
    }

    tipButtonCallback() {
        this.tipNode.active = false
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    this.setPanel();
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null) {
                        if(content.type) {
                            DaAnData.getInstance().type = content.type
                        }else {
                            console.error('网络请求数据content.type为空')
                        }
                        if(content.figure) {
                            DaAnData.getInstance().figure = content.figure
                        }else {
                            console.error('网络请求数据content.figure为空')
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
                        this.setPanel();
                    } else {
                        this.setPanel()
                        console.error('网络请求数据为空')
                    }
                }
            }
        }.bind(this), null);
    }


    //删除课件数据  一般为脏数据清理
    ClearNet() {
        let jsonData = { courseware_id: NetWork.courseware_id };
        NetWork.getInstance().httpRequest(NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
    }
}
