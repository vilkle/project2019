import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
import ShaderMaterial from "../../shader/ShaderMaterial";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel"
    @property(cc.Prefab)
    private itemNodePrefab: cc.Prefab = null
    @property(cc.Node)
    private itemNode: cc.Node = null
    @property(cc.Node)
    private checkpointLayout: cc.Node = null
    @property(cc.Label)
    private checkpointLabel: cc.Label = null
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private checkpointMask: cc.Node = null
    @property(cc.Node)
    private popNode: cc.Node = null
    @property(cc.Node)
    private errorNode: cc.Node = null

    private checkpointEnable: boolean = true
    private itemNodeArr: cc.Node[] = []
    private checkpointUp: boolean = true
   
    // onLoad () {}

    start() {
        this.getNet()
        this.checkpointMask.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(!this.checkpointUp) {
                this.checkpointUp = true
                this.checkpointLayout.runAction(cc.moveTo(0.2, cc.v2(0, 0)))
            }
        })
        this.initItemNode()
    }

    initItemNode() {
        DaAnData.getInstance().checkpointsNum = 1
        let item = cc.instantiate(this.itemNodePrefab)
        this.itemNode.addChild(item);
        this.itemNodeArr.push(item)
        this.addEditListener()
        this.addPlusListener()
        this.addReduceListener()
    }

    updateItemNode() {
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            this.itemNodeArr[i].destroy();
        }
        this.itemNodeArr = [];
        for(let i = 0; i < DaAnData.getInstance().checkpointsNum; i++) {
            let item = cc.instantiate(this.itemNodePrefab)
            this.itemNode.addChild(item)
            this.itemNodeArr.push(item)
        }
    }

    onCheckpointBtnClick() {
        if(this.checkpointUp) {
            this.checkpointUp = false
            this.checkpointLayout.runAction(cc.moveTo(0.2, cc.v2(0, -120)))
        }else {
            this.checkpointUp = true
            this.checkpointLayout.runAction(cc.moveTo(0.2, cc.v2(0, 0)))
        }
    }

    onCheckpointClick1() {
        if(this.checkpointEnable) {
            this.checkpointEnable = false
            this.checkpointUp = true
            DaAnData.getInstance().checkpointsNum = 1
            this.checkpointLabel.string = '1 关'
            this.checkpointLayout.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(0, 0)), cc.callFunc(()=>{this.checkpointEnable=true})) )
            this.updateItemNode()
            this.addEditListener()
            this.addPlusListener()
            this.addReduceListener()
        }
    }

    onCheckpointClick2() {
        if(this.checkpointEnable) {
            this.checkpointEnable = false
            this.checkpointUp = true
            DaAnData.getInstance().checkpointsNum = 2
            this.checkpointLabel.string = '2 关'
            this.checkpointLayout.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(0, 0)), cc.callFunc(()=>{this.checkpointEnable=true})) )
            this.updateItemNode()
            this.addEditListener()
            this.addPlusListener()
            this.addReduceListener()
        }
    }

    onCheckpointClick3() {
        if(this.checkpointEnable) {
            this.checkpointEnable = false
            this.checkpointUp = true
            DaAnData.getInstance().checkpointsNum = 3
            this.checkpointLabel.string = '3 关'
            this.checkpointLayout.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(0, 0)), cc.callFunc(()=>{this.checkpointEnable=true})) )
            this.updateItemNode()
            this.addEditListener()
            this.addPlusListener()
            this.addReduceListener()
        }
    }

    addEditListener() {
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            let editbox = this.itemNodeArr[i].getChildByName('New EditBox')
            editbox.on('editing-did-ended', (editbox)=>{
                const rex = /^[0-9]{1,4}$/
                let num = parseInt(editbox.string)
                let sum = this.getSum(num)
                if(rex.test(editbox.string)) {
                    if(sum<=14) {
                        DaAnData.getInstance().countsArr[i] = num
                        let node = this.itemNodeArr[i].getChildByName('rightAnswerNode')
                        let ge = num % 10
                        let shi = Math.floor(num/10) % 10
                        let bai = Math.floor(num/100) % 10
                        let qian = Math.floor(num/1000) % 10
                        node.getChildByName('qian').getComponent(cc.Label).string = qian.toString()
                        node.getChildByName('bai').getComponent(cc.Label).string = bai.toString()
                        node.getChildByName('shi').getComponent(cc.Label).string = shi.toString()
                        node.getChildByName('ge').getComponent(cc.Label).string = ge.toString()
                    }else {
                        editbox.string = ''
                        editbox.node.getChildByName('PLACEHOLDER_LABEL').active = true
                    }
                }else {
                    editbox.string = ''
                    editbox.node.getChildByName('PLACEHOLDER_LABEL').active = true
                }
            })
        }
    }

    addPlusListener() {
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            let button = this.itemNodeArr[i].getChildByName('addButton')
            button.on('click', ()=>{
                if(!this.popNode.active) {
                    this.popNode.active = true
                    this.addListenerOnPop(this.itemNodeArr[i])
                }
            })
        }
    }

    addReduceListener() {
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            let button = this.itemNodeArr[i].getChildByName('removeButton')
            button.on('click', ()=>{
                if(!this.itemNodeArr[i].getChildByName('addButton').active) {
                    this.itemNodeArr[i].getChildByName('goodsSprite').getComponent(cc.Sprite).spriteFrame = null
                    this.itemNodeArr[i].getChildByName('addButton').active = true
                }
            })
        }
    }

    addListenerOnPop(node:cc.Node) {
        let thing = this.popNode.getChildByName('thing')
        for(let i = 0; i < thing.children.length; i ++) {
            thing.children[i].on(cc.Node.EventType.TOUCH_START, ()=>{
                let sprite = node.getChildByName('goodsSprite').getComponent(cc.Sprite)
                sprite.spriteFrame = thing.children[i].getComponent(cc.Sprite).spriteFrame
                thing.children[i].getComponent(cc.Sprite).setState(0)
                node.getChildByName('addButton').active = false
                let index = this.itemNodeArr.indexOf(node)
                DaAnData.getInstance().goodsArr[index] = i
                for(let j = 0; j < thing.children.length; j ++) {
                    if(i != j) {
                        thing.children[j].getComponent(cc.Sprite).setState(1)
                    }
                }   
            })
        }
    }

    popBtnCallback() {
        let thing = this.popNode.getChildByName('thing')
        for(let i = 0; i < thing.children.length; i ++) {
            thing.children[i].getComponent(cc.Sprite).setState(0)
            thing.children[i].off(cc.Node.EventType.TOUCH_START)
        }
        this.popNode.active = false
    }
    
    getSum(num: number):number {
        var temp = num
        var count = 1
        var result =  temp / 10
        var sum = temp % 10
        while(result >= 1.0){
            temp = Math.floor(temp / 10) 
            result = temp / 10
            sum += temp % 10
            count += 1}
        return sum
    
    }

    errorCheck():boolean {
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            if(this.itemNodeArr[i].getChildByName('goodsSprite').getComponent(cc.Sprite).spriteFrame == null) {
                this.errorNode.active = true
                this.errorNode.getChildByName('New Label').getComponent(cc.Label).string = `第${i+1}关没有选择物品，请先选择物品。`
                return false
            }
        }
        for(let i = 0; i < this.itemNodeArr.length; i++) {
            if(this.itemNodeArr[i].getChildByName('New EditBox').getComponent(cc.EditBox).string == '') {
                this.errorNode.active = true
                this.errorNode.getChildByName('New Label').getComponent(cc.Label).string = `第${i+1}关没有填写物品价值，请先填写物品价值 。`
                return false
            }
        }
       
        return true
    }

    onErrorBtnCallback() {
        this.errorNode.active = false
    }

    //上传课件按钮
    onBtnSaveClicked() {
        console.log(DaAnData.getInstance());
        if(this.errorCheck()) {
            UIManager.getInstance().showUI(GamePanel, () => {
                ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
            });
        }
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null) {
                        
                    } else {
                        
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
