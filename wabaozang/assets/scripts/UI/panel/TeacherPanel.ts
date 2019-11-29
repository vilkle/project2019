import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null
    @property([cc.Toggle])
    private toggleContainer: cc.Toggle[] = []
    @property(cc.Node)
    private gridNode: cc.Node = null 
    @property(cc.Node)
    private node1: cc.Node = null
    @property(cc.Node)
    private node2: cc.Node = null
    @property(cc.Node)
    private materialNode: cc.Node = null
    @property(cc.Node)
    private pointNode: cc.Node = null
    @property(cc.Node)
    private layout: cc.Node = null
    @property(cc.Label)
    private label: cc.Label = null
    @property(cc.SpriteFrame)
    private frame1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame7: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame8: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame9: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private frame10: cc.SpriteFrame = null
    @property(cc.ScrollView)
    private scrollview: cc.ScrollView = null
    private boxWidth: number = 0
    private boxHeight: number = 0
    private num: number = 0
    private type: number = 0
    private itemArr: number[] = []
    private posArr: cc.Vec2[] = []
    private xArr: number[] = []
    private yArr: number[] = []
    private rotationArr: number[] = []
    private groupNumArr: number[] =[]
    private itemNodeArr: cc.Node[] = []
    private selectArr: cc.Node[] = []
    private groupArr: cc.Node[] = []
    private groupInfoArr: cc.Node[] = []
    private touchTarget: any = null
    private isReset: boolean = false

    // onLoad () {}

    start() {                                   
        this.type = 3
        this.getNet();
    }

    setPanel() {//设置教师端界面
        switch(this.type) {
            case 1:
                this.toggleContainer[0].isChecked = true
                this.setNode(4, this.isReset)
                break
            case 2:
                this.toggleContainer[1].isChecked = true
                this.setNode(5, this.isReset)
                break
            case 3:
                this.toggleContainer[2].isChecked = true
                this.setNode(6, this.isReset)
                break
            default:
                console.error('there is a erro on toggle setting.')
                break
        }
        this.materialNode.children[5].getComponent(cc.Button).interactable = false
        this.materialNode.children[5].getChildByName('Background').color = cc.color(200, 200, 200)
        this.initGame()
        this.addMaterialCallback()
    }

    initGame() {
        let itemArr = [...this.itemArr]
        let arr: number[] = []
        for(let i = 0; i < itemArr.length; ++i) {
            this.itemNodeArr[i].getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(itemArr[i])
        }
        for(let i = 0; i < itemArr.length; ++i) {
            if(itemArr[i] != 5) {
                let index = itemArr[i]
                arr = this.getPartner(i)
                let groupNode = this.createGroup(arr, this.getSpriteframe(index))
                groupNode.setPosition(cc.v2(this.xArr[i], this.yArr[i]))
                groupNode.angle = this.rotationArr[i]
                for(let i = 0; i < groupNode.children.length; ++i) {
                    groupNode.children[i].angle = - groupNode.angle
                }
                this.groupArr.push(groupNode)
                this.addListenerOnGroupNode(groupNode)
                for(let j = 0; j < arr.length; ++j) {
                    this.groupInfoArr[arr[j]] = groupNode
                    itemArr[arr[j]] = 5
                }
            }
        }
        console.log(this.itemArr)
    }

    setNode(num: number, isReset: boolean) {
        this.num = num
        if(isReset) {
            this.itemArr = []
        }
        this.selectArr = []
        this.posArr = []
        this.groupArr = []
        this.groupInfoArr = []
        this.itemNodeArr = []
        this.node1.removeAllChildren()
        this.node2.getChildByName('group').removeAllChildren()
        let lenth = num * 105 + (num + 1) * 3 + num - 1
        this.node1.width = lenth
        this.boxWidth = 570
        this.boxHeight = 850
        
        this.gridNode.height = lenth
        for(let i = 0; i < num * num; ++i) {
            let node = cc.instantiate(this.itemPrefab)
            this.node1.addChild(node)
            this.itemNodeArr[i] = node
            this.addListenerOnItem(node)
            this.addMouseListener(node)
            this.groupInfoArr[i] = null
            if(isReset) {
                this.itemArr[i] = 5
            }
            this.groupNumArr[i] = 0
            this.posArr[i] = cc.v2(0,0)
        }
    }

    addMouseListener(item: cc.Node) {
        let node = item.getChildByName('wb')
        item.on(cc.Node.EventType.MOUSE_MOVE, (e)=>{
            if(node.color.equals(cc.Color.WHITE)) {
                node.color = cc.color(220, 220, 220, 255)
                if(item.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame) {
                    item.getChildByName('mask').active = true
                }
            }else if(node.color.equals(cc.Color.GRAY)) {
                item.getChildByName('mask').active = true
            }
        })
        item.on(cc.Node.EventType.MOUSE_LEAVE, (e)=>{
            if(node.color.equals(cc.color(220, 220, 220, 255))) {
                node.color = cc.Color.WHITE
                if(item.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame) {
                    item.getChildByName('mask').active = false
                }
            }
            item.getChildByName('mask').active = false
            
        })
    }

    getPartner(index: number): number[] {
        let partnerArr: number[] = []
        partnerArr.push(index)
        let len: number = partnerArr.length
        let over = false
        while(!over) {
            len = partnerArr.length
            for (const key in this.itemArr) {
                for (const _key in partnerArr) {
                    let nKey = parseInt(key) 
                    if (this.itemArr[key] == this.itemArr[index] && partnerArr.indexOf(nKey) == -1 && this.groupNumArr[nKey] == this.groupNumArr[index]) {
                        let _nKey = partnerArr[_key]
                        let arr: number[] = [_nKey - 1, _nKey + 1, _nKey + this.num, _nKey - this.num]
                        if(arr.indexOf(nKey) != -1) {
                            partnerArr.push(nKey)
                        } 
                    }
                }
            }
            if(len == partnerArr.length) {
                over = true
            }
        }
        return partnerArr
        
    }

    correctPos(pos: cc.Vec2, node: cc.Node): cc.Vec2 {
        let width: number = 0
        let height: number = 0



        if(node.angle%180 == 0) {
            width = node.width
            height = node.height
            if(width > this.boxWidth) {
                node.angle = 90
                width = node.height
                height = node.width
            }
        }else {
            width = node.height
            height = node.width
            if(width > this.boxWidth) {
                node.angle = 0
                width = node.width
                height = node.height
            }
        }
        for(let i = 0; i < node.children.length; ++i) {
            node.children[i].angle = - node.angle
        }
        if(pos.x + width / 2 > this.boxWidth) {
            pos.x = this.boxWidth - width / 2
        }else if(pos.x - width / 2 < 3) {
            pos.x = width / 2 + 3
        }
        if(pos.y + height /2 > - 3) {
            pos.y = - 3 - height / 2
        }else if(pos.y - height / 2 < - this.boxHeight) {
            pos.y = height / 2 - this.boxHeight
        }
        return pos
    }

    addListenerOnGroupNode(node: cc.Node) {
        let firstPos: cc.Vec2 = cc.v2(0, 0)
        let lastPos: cc.Vec2 = cc.v2(0, 0)
        node.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.touchTarget) {
                return
            }
            this.touchTarget = e.target
            node.zIndex = 100
            this.scrollview.enabled = false
            firstPos = this.node2.getChildByName('group').convertToNodeSpaceAR(e.currentTouch._point)
            
        })
        node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            let pos = this.node2.getChildByName('group').convertToNodeSpaceAR(e.currentTouch._point)
            pos = this.correctPos(pos, node)
            node.setPosition(pos)
        })
        node.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            this.touchTarget = null
            this.scrollview.enabled = true
            node.zIndex = 10
            lastPos = this.node2.getChildByName('group').convertToNodeSpaceAR(e.currentTouch._point)
            if(firstPos.equals(lastPos)) {
                node.angle -= 90 
                if(node.angle <= -360 ) {
                    node.angle = 0
                }
                for(let i = 0; i < node.children.length; ++i) {
                    node.children[i].angle = - node.angle
                }
                lastPos = this.correctPos(lastPos, node)
                node.setPosition(lastPos)
            }
        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            this.touchTarget = null
            this.scrollview.enabled = true
            node.zIndex = 10
        })
    }

    removeListenerOnGroupNode(node: cc.Node) {
        node.off(cc.Node.EventType.TOUCH_START)
        node.off(cc.Node.EventType.TOUCH_MOVE)
        node.off(cc.Node.EventType.TOUCH_END)
        node.off(cc.Node.EventType.TOUCH_CANCEL)
    }

    addListenerOnItem(item: cc.Node) {
        let node = item.getChildByName('wb')
        item.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.touchTarget) {
                return
            }
            this.touchTarget = e.target
            let index = this.itemNodeArr.indexOf(item)
            if(item.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame) {
                let partnerArr = this.getPartner(index)
                if(this.adjacent(partnerArr)) {
                    for (const key in partnerArr) {
                        let selectNode = this.itemNodeArr[partnerArr[key]]
                        if(!selectNode.getChildByName('shadow').active) {
                            this.selectArr.push(selectNode)
                            selectNode.getChildByName('shadow').active = true
                        }else {
                            selectNode.getChildByName('shadow').active = false
                            let index = this.selectArr.indexOf(selectNode)
                            this.selectArr.splice(index, 1)
                        }
                    }
                }else {
                    UIHelp.showTip('与已选中方格边边相邻的方格才可以被选择。')
                    return
                }
              
            }else {
                let arr: number[] = []
                arr.push(this.itemNodeArr.indexOf(item))
                if(this.adjacent(arr)||this.selectArr.indexOf(item) != -1) {
                    if(!node.color.equals(cc.Color.GRAY)) {
                        node.color = cc.Color.GRAY
                        this.selectArr.push(item)
                    }else {
                        node.color = cc.Color.WHITE
                        this.selectArr.splice(this.selectArr.indexOf(item), 1) 
                    }
                }else {
                    UIHelp.showTip('与已选中方格边边相邻的方格才可以被选择。')
                    return
                }  
            }
            if(this.selectArr.length == 0) {
                this.materialNode.children[5].getComponent(cc.Button).interactable = false
                this.materialNode.children[5].getChildByName('Background').color = cc.color(200, 200, 200)
            }else {
                this.materialNode.children[5].getComponent(cc.Button).interactable = true
                this.materialNode.children[5].getChildByName('Background').color = cc.color(255, 255, 255)
            }
           
        })
        item.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            
          
        })
        item.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(e.target != this.touchTarget) {
                return
            }
            this.touchTarget = null
        })
        item.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(e.target != this.touchTarget) {
                return
            }
            this.touchTarget = null
        })
    }

    sortNumber(a:number, b:number) {
        return b - a
    }

    addMaterialCallback() {
        let arr = this.materialNode.children
        for (const key in arr) {
            arr[key].on('click', (e)=>{
                //检测选中组是否相连
                let isComplete: boolean = this.isComplete()
                if(!isComplete) {
                    UIHelp.showTip('请保证已选中的方格边边相邻。')
                    return
                }
                //筛选出选择的组
                let selectGroupArr: cc.Node[] = []
                for (const index in this.selectArr) {
                    let selectNode = this.selectArr[index]
                    let itemIndex = this.itemNodeArr.indexOf(selectNode)
                    let groupInfo = this.groupInfoArr[itemIndex]
                    if(groupInfo != null && selectGroupArr.indexOf(groupInfo) == -1) {
                        selectGroupArr.push(groupInfo)
                    }
                    //this.groupInfoArr[itemIndex] = null
                }
                //删除选择的组节点
                for(let i = 0; i < selectGroupArr.length; ++i) {
                    let index = this.groupArr.indexOf(selectGroupArr[i])
                    this.groupArr[index].removeFromParent()
                    this.groupArr.splice(index, 1)
                }
                selectGroupArr = []
                //创建新的组
                let selectNumArr: number[] = []
                let materialIndex = arr.indexOf(arr[key])
                let spriteframe = this.getSpriteframe(materialIndex)
                for (const index in this.selectArr) {
                    let selectNode = this.selectArr[index]
                    let itemIndex = this.itemNodeArr.indexOf(selectNode)
                    selectNumArr[parseInt(index)] = itemIndex
                    selectNode.getChildByName('shadow').active = false
                    let sp = selectNode.getChildByName('sprite').getComponent(cc.Sprite)
                    sp.spriteFrame = spriteframe
                    selectNode.getChildByName('wb').color = cc.Color.WHITE
                    this.itemArr[itemIndex] = materialIndex
                    this.groupNumArr[itemIndex] = this.selectArr.length
                }
                //创建组节点
                if(materialIndex != 5) {
                    let groupNode = this.createGroup(selectNumArr, spriteframe)
                    this.addListenerOnGroupNode(groupNode)
                    this.groupArr.push(groupNode)
                }else { 
                    for (const key in selectNumArr) {
                        this.groupInfoArr[selectNumArr[key]] = null
                    }
                }
                selectNumArr = []
                this.selectArr = []
                this.materialNode.children[5].getComponent(cc.Button)
                this.materialNode.children[5].getComponent(cc.Button).interactable = false
                this.materialNode.children[5].getChildByName('Background').color = cc.color(200, 200, 200)
            })
        }
    
    }

    createGroup(selectArr: number[], spriteframe: cc.SpriteFrame): cc.Node {
        let rowArr: number[] = []
        let colArr: number[] = []
        for (const key in selectArr) {
            let row = Math.floor(selectArr[key] / this.num) 
            let col = selectArr[key] % this.num
            let index: number = parseInt(key)
            rowArr[index] = row
            colArr[index] = col
        }
        let maxRow = Math.max.apply(Math, rowArr)
        let minRow = Math.min.apply(Math, rowArr)
        let maxCol = Math.max.apply(Math, colArr)
        let minCol = Math.min.apply(Math, colArr)
        let height = maxRow - minRow + 1
        let width = maxCol - minCol + 1
        let node = new cc.Node()
        node.width = width * 109
        node.height = height * 109
        for(let i = 0; i < selectArr.length; ++i) {
            let y = - (rowArr[i] - minRow - height / 2 + 0.5) * 109
            let x =  (colArr[i] - minCol - width / 2 + 0.5) * 109
            let itemNode = cc.instantiate(this.itemPrefab)
            itemNode.getChildByName('bg').active = false
            itemNode.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteframe
            node.addChild(itemNode)
            itemNode.setPosition(cc.v2(x, y))
        }
        let nodeX = (minCol + width / 2) * 110
        let nodeY = -(minRow + height / 2) * 110
        let nodePos: cc.Vec2 = this.correctPos(cc.v2(nodeX, nodeY), node)
        this.node2.getChildByName('group').addChild(node)
        if(this.groupInfoArr[selectArr[0]]) {
            nodePos = this.groupInfoArr[selectArr[0]].position
            node.angle = this.groupInfoArr[selectArr[0]].angle 
        }
        node.setPosition(nodePos)
        for (const key in selectArr) {
            this.posArr[selectArr[key]] = cc.v2(nodeX, nodeY)
            this.groupInfoArr[selectArr[key]] = node
        }
        return node                      
    }


    getSpriteframe(index: number):cc.SpriteFrame {
        switch(index) {
            case 0:
                return this.frame1
                break
            case 1:
                return this.frame2
                break
            case 2:
                return this.frame3
                break
            case 3:
                return this.frame4
                break
            case 4:
                return this.frame5
                break
            case 5:
                return null
                break
            case 6:
                return this.frame6
                break
            case 7:
                return this.frame7
                break
            case 8:
                return this.frame8
                break
            case 9:
                return this.frame9
                break
            case 10:
                return this.frame10
                break
            default:
                console.error('获取宝藏纹理失败')
                break
        }
    }

    adjacent(index: number[]): boolean {
        let arr: number[] = []
        
        if(this.selectArr.length) {
            for (const key in this.selectArr) {
                let selectIndex = this.itemNodeArr.indexOf(this.selectArr[key])
                arr = []
                arr = [selectIndex - 1, selectIndex + 1, selectIndex + this.num, selectIndex - this.num]
                for (const key in index) {
                    if (arr.indexOf(index[key]) != -1) {
                        return true
                    }
                }
              }
              return false
        }else {
            return true
        }
    }
   
    isComplete(): boolean {
        let selectArr: number[] = []
        for (const key in this.selectArr) {
            let index = this.itemNodeArr.indexOf(this.selectArr[key])
            selectArr[parseInt(key)] = index 
        }
        let completeNum: number = 0
        for (const key in selectArr) {
            let chooseIndex = selectArr[key]
            let remainderArr: number[] = []
            let cloneSelectArr = [...selectArr]
            cloneSelectArr.splice(parseInt(key), 1)
            remainderArr = [...cloneSelectArr]
            let adjacentNum: number = 0
            for (const _key in remainderArr) {
                let index = remainderArr[_key]
                let arr: number[] = [index - 1, index + 1, index + this.num, index - this.num]
                if(arr.indexOf(chooseIndex) != -1) {
                    adjacentNum++
                }
            }
            if(adjacentNum > 0) {
                completeNum++
            }
        }
        if(completeNum == this.selectArr.length) {
            return true
        }else {
            return false
        }
    }

    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                this.type = 1;
                this.setNode(4, true)
                break
            case 1:
                this.type = 2;
                this.setNode(5, true)
                break
            case 2:
                this.type = 3;
                this.setNode(6, true)
                break
        }
    }

    pointOn(str: string) {
        this.pointNode.active = true
        this.layout.on(cc.Node.EventType.TOUCH_START, null)
        this.label.string = str
    }

    pointOff() {
        this.layout.off(cc.Node.EventType.TOUCH_START, null)
        this.pointNode.active = false
    }

    //上传课件按钮
    onBtnSaveClicked() {
        let num: number = 0
        for (const key in this.itemArr) {
            if (this.itemArr[key] != 5) {
                num++
            }
        }
        if(num == 0) {
            UIHelp.showTip('请生成宝藏。')
            return
        }
        DaAnData.getInstance().type = this.type
        DaAnData.getInstance().itemArr = [...this.itemArr]
        for (const key in this.groupInfoArr) {
           let index = parseInt(key)
           if(this.groupInfoArr[key]) {
                this.xArr[index] = this.groupInfoArr[key].x
                this.yArr[index] = this.groupInfoArr[key].y
                this.rotationArr[index] = this.groupInfoArr[key].angle
           }else {
                this.xArr[index] = 0
                this.yArr[index] = 0
                this.rotationArr[index] = 0
           }
        }
        DaAnData.getInstance().xArr = [...this.xArr]
        DaAnData.getInstance().yArr = [...this.yArr]
        DaAnData.getInstance().rotationArr = [...this.rotationArr]

        UIManager.getInstance().showUI(GamePanel, () => {
            ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
        });
    
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    this.isReset = true
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
                            this.type = content.type
                        }else {
                            console.error('网络请求数据type为空。')
                        }
                        if(content.itemArr) {
                            this.itemArr = content.itemArr
                        }else {
                            console.error('网络请求数据itemArr为空。')
                        }
                        if(content.xArr) {
                            this.xArr = content.xArr
                        }else {
                            console.error('网络请求数据xArr为空。')
                        }  
                        if(content.yArr) {
                            this.yArr = content.yArr
                        }else {
                            console.error('网络请求数据yArr为空。')
                        }  
                        if(content.rotationArr) {
                            this.rotationArr = content.rotationArr
                        }else {
                            console.error('网络请求数据rotationAarr为空。')
                        }    
                        
                        this.setPanel();
                    } else {
                        this.setPanel();
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
