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
    private triangleBlack: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private triangleYellow: cc.SpriteFrame = null
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

    private ruleItemArr: cc.Node[][] = []
    private subjectItemArr: cc.Node[][] = []
    private ruleDataArr: ItemType[][] = []
    private subjectDataArr: ItemType[][] = []
    private currentType = 1
    private currentFigure = 2
    // onLoad () {}

    start() {
        DaAnData.getInstance().type = 1
        DaAnData.getInstance().figure = 1
        this.getNet();
    }

    setPanel() {//设置教师端界面
        this.typeToggleContainer[DaAnData.getInstance().type-1].isChecked = true
        this.figureToggleContainer[DaAnData.getInstance().figure-1].isChecked = true
        this.initType()
        this.initFigure()
        this.getItem()
    }
     /**
     * 获取itemtype值 
     * @param i 
     * @param j
     * @param type 1、rule下节点 2、subject下节点
     * @param isClick 是否被点击 
     */
    getItemData(i: number, j :number, type: number, isClick: boolean) : ItemType { 
        if(type == 1) {
            if(DaAnData.getInstance().figure == 1) {
                if(j%2==0) {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.triangle_black
                    } 
                }else {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.arrow_black
                    } 
                }
            }else if(DaAnData.getInstance().figure == 2) {
                if(j%2==0) {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.sexangle_black
                    } 
                }else {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.arrow_black
                    } 
                }
            }else if(DaAnData.getInstance().figure == 3) {
                if(j%2==0) {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.octagon_black
                    } 
                }else {
                    if(this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType.arrow_black
                    } 
                }
            }
        }else if(type == 2) {

        }
        return this.nextType(this.ruleDataArr[i][j], isClick)
    }

    nextType(type: ItemType, isClick: boolean): ItemType {
        
        if(isClick) {
            let highNum = Math.floor(type/3) * 3 + 3
            let lowNum = highNum - 2
            let next = type + 1
            if(next > highNum) {
                next = lowNum
            }
            return next
        }else {
            return type
        }
    }
    
    getItem() {
        this.ruleItemArr = []
        this.subjectItemArr = []
        if(this.ruleNode.children[0]) {
            let nodeArr = this.ruleNode.children[0].children
            for(let i = 0; i < nodeArr.length; ++i) {
                this.ruleItemArr[i] = []
                this.ruleDataArr[i] = []
                for(let j = 0; j < nodeArr[i].children.length; ++j) {
                    this.ruleItemArr[i][j] = nodeArr[i].children[j]
                    //this.ruleDataArr[i][j] = 
                }
            }
        }
        if(this.subjectNode.children[0]) {
            let nodeArr = this.subjectNode.children[0].children
            for(let i = 0; i < nodeArr.length; ++i) {
                this.subjectItemArr[i] = []
                this.subjectDataArr[i] = []
                for(let j = 0; j < nodeArr[i].children.length; ++j) {
                    this.subjectItemArr[i][j] = nodeArr[i].children[j]
                }
            }
        }
        console.log(this.ruleItemArr)
        console.log(this.subjectItemArr)
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
                this.currentType = 1
            }else if(DaAnData.getInstance().type == 2) {
                node = cc.instantiate(this.singlePrefab)
                this.currentType = 2
            }
            this.subjectNode.addChild(node)
            this.getItem()
            this.currentFigure = 2
        }
    }

    initFigure() {
        if(this.currentFigure != DaAnData.getInstance().figure) {
            if(DaAnData.getInstance().figure == 1) {
                this.changeFigure(this.triangleBlack)
                this.currentFigure = 1
            }else if(DaAnData.getInstance().figure == 2) {
                this.changeFigure(this.sexangleBlack)
                this.currentFigure = 2
            }else if(DaAnData.getInstance().figure == 3) {
                this.changeFigure(this.octagonBlack)
                this.currentFigure = 3
            }
        }
    }
    changeFigure(frame: cc.SpriteFrame) {
        if(this.ruleNode.children[0]) {
            let nodeArr = this.ruleNode.children[0].children
            for(let i = 0; i < nodeArr.length; i++) {
                for(let j = 0; j < nodeArr[i].children.length; j++) {
                    if(j%2==0) {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame
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
                    }
                }
            }else if(DaAnData.getInstance().type == 2) {
                for(let i = 0; i < nodeArr.length; i++) {
                    for(let j = 0; j < nodeArr[i].children.length; j++) {
                        if(j%2==0) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame
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
                this.initFigure()
                break
            case 1:
                DaAnData.getInstance().figure = 2
                this.initFigure()
                break
            case 2:
                DaAnData.getInstance().figure = 3
                this.initFigure()
                break
            default:
                console.error(`the ${index} figure toggle have error.`)
                break
        }
    }

    //上传课件按钮
    onBtnSaveClicked() {
        UIManager.getInstance().showUI(GamePanel, ()=>{
            ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1});    
        });
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
                        this.setPanel();
                    } else {
                        this.setPanel()
                        console.error('网络请求数据失败')
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
