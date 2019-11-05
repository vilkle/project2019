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
    private num: number = 0
    private type: number = 0
    private itemArr: number[] = []
    private posArr: cc.Vec2[] = []

    private itemNodeArr: cc.Node[] = []
    private selectArr: cc.Node[] = []
    private groupArr: cc.Node[] = []
    private groupInfoArr: number[] = []
    private touchTarget: any = null

    // onLoad () {}

    start() {                                   
        this.type = 3
        this.getNet();
    }

    setPanel() {//设置教师端界面
        switch(this.type) {
            case 1:
                this.toggleContainer[0].isChecked = true
                this.num = 4
                this.setNode(4)
                break
            case 2:
                this.toggleContainer[1].isChecked = true
                this.num = 5
                this.setNode(5)
                break
            case 3:
                this.toggleContainer[2].isChecked = true
                this.num = 6
                this.setNode(6)
                break
            default:
                console.error('there is a erro on toggle setting.')
                break
        }
        this.addMaterialCallback()
    }

    setNode(num: number) {
        this.selectArr = []
        this.posArr = []
        this.node1.removeAllChildren()
        let lenth = num * 105 + (num + 1) * 3 + num - 1
        this.node1.width = lenth
        let black = this.node2.getChildByName('item')
        let white = black.getChildByName('bg')
        black.width = lenth + 6
        black.height = lenth + 6
        white.width = lenth
        white.height = lenth
        white.x = 3
        white.y = -3
        this.gridNode.height = lenth
        for(let i = 0; i < num * num; ++i) {
            let node = cc.instantiate(this.itemPrefab)
            this.node1.addChild(node)
            this.itemNodeArr[i] = node
            this.addListenerOnItem(node)
            this.addMouseListener(node)
            this.itemArr[i] = 5
            this.posArr[i] = cc.v2(0,0)
        }
    }

    addMouseListener(item: cc.Node) {
        let node = item.getChildByName('wb')
        item.on(cc.Node.EventType.MOUSE_MOVE, (e)=>{
            if(node.color.equals(cc.Color.WHITE)) {
                node.color = cc.color(220, 220, 220, 255)
            }
        })
        item.on(cc.Node.EventType.MOUSE_LEAVE, (e)=>{
            if(node.color.equals(cc.color(220, 220, 220, 255))) {
                node.color = cc.Color.WHITE
            }
            
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
                    if (this.itemArr[key] == this.itemArr[index] && partnerArr.indexOf(nKey) == -1) {
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

    addListenerOnItem(item: cc.Node) {
        let node = item.getChildByName('wb')
        item.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.touchTarget) {
                return
            }
            this.touchTarget = e.target
            let index = this.itemNodeArr.indexOf(item)
            //如果点击格子已经分组，寻找同组格子设置为选中效果
            if(item.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame) {
                let partnerArr = this.getPartner(index)
                // for (const key in partnerArr) {
                //     let selectNode = this.itemNodeArr[partnerArr[key]]
                //     if(selectNode.getChildByName('shadow').active) {
                //         selectNode.getChildByName('shadow').active = false
                //         let index = this.selectArr.indexOf(selectNode)
                //         this.selectArr.splice(index, 1)
                //     }else {
                //         this.selectArr.push(selectNode)
                //         selectNode.getChildByName('shadow').active = true
                //     }
                // }
                if(this.adjacent(partnerArr)) {
                    for (const key in partnerArr) {
                        let selectNode = this.itemNodeArr[partnerArr[key]]
                        if(!selectNode.getChildByName('shadow').active) {
                            this.selectArr.push(selectNode)
                            selectNode.getChildByName('shadow').active = true
                        }
                    }
                }else {
                    UIHelp.showTip('与已选中方格边边相邻的方格才可以被选择。')
                    return
                }
                return
            }else {
                let arr: number[] = []
                arr.push(this.itemNodeArr.indexOf(item))
                 //判断点击格子是否与以选择格子相邻
                if(this.adjacent(arr)) {
                    node.color = cc.Color.GRAY
                    this.selectArr.push(item)
                }else {
                    UIHelp.showTip('与已选中方格边边相邻的方格才可以被选择。')
                    return
                }
                return
            }
            //如果点击格子为以选择的格子，格子取消选中效果
            if(this.selectArr.indexOf(item) != -1) {
                if(node.color.equals(cc.Color.GRAY)) {
                    node.color = cc.Color.WHITE
                    this.selectArr.splice(this.selectArr.indexOf(item), 1)
                    return
                }
            }
           
            console.log(this.selectArr)
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

    addMaterialCallback() {
        let arr = this.materialNode.children
        for (const key in arr) {
            arr[key].on('click', (e)=>{
                for (const index in this.selectArr) {
                    let materialIndex = arr.indexOf(arr[key])
                    let selectNode = this.selectArr[index]
                    let itemIndex = this.itemNodeArr.indexOf(selectNode)
                    selectNode.getChildByName('shadow').active = false
                    let sp = selectNode.getChildByName('sprite').getComponent(cc.Sprite)
                    sp.spriteFrame = this.getSpriteframe(materialIndex)
                    selectNode.getChildByName('wb').color = cc.Color.WHITE
                    this.itemArr[itemIndex] = materialIndex
                    let pos = selectNode.getPosition()
                    this.posArr[itemIndex] = pos
                    this.groupInfoArr[index] = this.groupArr.length
                    //创建摆放样式
                   
                }
                this.selectArr = []
            })
        }
    
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
                    if (arr.indexOf(index[key])) {
                        return true
                    }
                }
              }
              return false
        }else {
            return true
        }
    }
   
    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                this.type = 1;
                this.setNode(4)
                break
            case 1:
                this.type = 2;
                this.setNode(5)
                break
            case 2:
                this.type = 3;
                this.setNode(6)
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
        
        DaAnData.getInstance().type = this.type
        DaAnData.getInstance().itemArr = [...this.itemArr]
     
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
