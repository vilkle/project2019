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

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private mask: cc.Node = null
    @property(cc.Node)
    private bg:cc.Node = null;
    @property(cc.Node)
    private labaBoundingBox: cc.Node = null
    @property(sp.Skeleton)
    private laba: sp.Skeleton = null
    @property(cc.Node)
    private wave1: cc.Node = null
    @property(cc.Node)
    private wave2: cc.Node = null
    @property(cc.Node)
    private material: cc.Node = null
    @property(cc.Node)
    private board: cc.Node = null
    @property(cc.Button)
    private refreshBtn: cc.Button = null
    @property(cc.Button)
    private submitBtn: cc.Button = null
    @property(cc.Button)
    private pointBtn: cc.Button = null
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
    @property(cc.SpriteFrame)
    private Bframe1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe7: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe8: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe9: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private Bframe10: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private grayFrame: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private blueFrame: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private greenFrame: cc.SpriteFrame = null
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null
    @property(cc.Prefab)
    private bigItemPrefab: cc.Prefab = null
    @property(cc.Prefab)
    private titlePrefab: cc.Prefab = null
    @property(cc.Prefab)
    private littleTitlePrefab: cc.Prefab = null
    @property(cc.Prefab)
    private boxPrefab: cc.Prefab = null
    private num: number = 0
    private type: number = 0
    private itemArr: number[] = []
    private xArr: number[] = []
    private yArr: number[] = []
    private rotationArr: number[] = []
    private groupNumArr: number[] = []
    private itemNodeArr: cc.Node[] = []
    private horizonTitleArr: cc.Node[] = []
    private VerticalTitleArr: cc.Node[] = []
    private horArr: number[] = []
    private verArr: number[] = []
    private answer: number[] = []
    private subject: number[] = []
    private groupArr: number[][] = []
    private groupNodeArr: cc.Node[] = []
    private timeoutArr: number[] = []
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
    private sizeInfo = {
        title:{
            width: 0,
            height: 0,
        },
        square:{
            width: 0,
            height: 0,
        },
        spaceLong: 0,
        spaceShort: 0,
        fontSize: 60,
        deepBlue: cc.color(29, 111, 158),
        lightGray: cc.color(217, 217, 217)
    }

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        //this.refreshBtn.interactable = false
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[0].result = 2
            }
        })
        this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.laba.setAnimation(0, 'click', false)
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('找出宝藏的位置吧', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
        })
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.type = DaAnData.getInstance().type
            this.itemArr = DaAnData.getInstance().itemArr
            this.xArr = DaAnData.getInstance().xArr
            this.yArr = DaAnData.getInstance().yArr
            this.rotationArr = DaAnData.getInstance().rotationArr
            this.setPanel()
        }else {
            this.getNet()
        }
    }

    start() {
        AudioManager.getInstance().playSound('sfx_12opne')
        this.oceanWave(this.wave1, this.wave2)
        let id = setTimeout(() => {
            AudioManager.getInstance().playSound('找出宝藏的位置吧')
            clearTimeout(id)
            let index = this.timeoutArr.indexOf(id)
            this.timeoutArr.splice(index, 1)
        }, 500);
        this.timeoutArr.push(id)
        this.pointBtn.node.on(cc.Node.EventType.TOUCH_START, ()=>{
            AudioManager.getInstance().playSound('sfx_buttn', false)
            for(let i = 0; i < this.timeoutArr.length; ++i) {
                clearTimeout(this.timeoutArr[i])
            }
            for(let i = 0; i < this.num; ++i) {
                if(this.horArr[i] == 1) {
                    // this.horizonTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.greenFrame
                    // this.horizonTitleArr[i].getChildByName('label').color = cc.Color.WHITE
                    for(let j = 0; j < this.itemNodeArr.length; j++) {
                        if(j % this.num == i) {
                            this.itemNodeArr[j].getChildByName('point').active = true
                        }
                    }
                }
                if(this.verArr[i] == 1) {
                    // this.VerticalTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.greenFrame
                    // this.VerticalTitleArr [i].getChildByName('label').color = cc.Color.WHITE
                    for(let j = 0; j < this.itemNodeArr.length; j++) {
                        if(i == Math.floor(j / this.num)) {
                            this.itemNodeArr[j].getChildByName('point').active = true
                        }
                    }
                }
            }
        })
        this.pointBtn.node.on(cc.Node.EventType.TOUCH_END, (e)=>{
            let id = setTimeout(() => {
                for(let j = 0; j < this.itemNodeArr.length; j++) {
                    this.itemNodeArr[j].getChildByName('point').active = false
                }
                //this.checkTitle()
                clearTimeout(id)
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
            }, 2000)
            this.timeoutArr.push(id)
        })
        this.pointBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            let id = setTimeout(() => {
                for(let j = 0; j < this.itemNodeArr.length; j++) {
                    this.itemNodeArr[j].getChildByName('point').active = false
                }
                //this.checkTitle()
                clearTimeout(id)
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
            }, 2000)
            this.timeoutArr.push(id)
        })
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
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
       for (const key in this.timeoutArr) {
           clearTimeout(this.timeoutArr[key])
       }
    }

    onShow() {
    }

    setPanel() {
        switch (this.type) {
            case 1:
                this.initSizeInfo(4)
                break;
            case 2:
                this.initSizeInfo(5)
                break;
            case 3:
                this.initSizeInfo(6)
                break;
            default:
                break;
        }
        this.setMaterial(this.material)
        this.setBoard(this.board)
    }

    initSizeInfo(num: number) {
        this.num = num
        let totalLen: number = 900
        this.sizeInfo.title.width = this.sizeInfo.square.width = this.sizeInfo.square.height = totalLen / (num + 1 / 2) - 4
        this.sizeInfo.title.height = this.sizeInfo.title.width / 2 - 4
        this.sizeInfo.spaceLong = totalLen / (num + 1 / 2)
        this.sizeInfo.spaceShort = this.sizeInfo.spaceLong / 2
    }

    addListenerOnItem(nodeArr: cc.Node[]) {
        for(let i = 0; i < nodeArr.length; ++i) {
            let node = nodeArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                for(let j = 0; j < this.itemNodeArr.length; j++) {
                    this.itemNodeArr[j].getChildByName('point').active = false
                }
                AudioManager.getInstance().playSound('sfx_buttn')
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[0].result = 2
                this.eventvalue.levelData[0].subject = this.subject
                this.changeState(node, i)
                
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                
            })

        }
    }
    removeListenerOnItem(nodeArr: cc.Node[]) {
        for(let i = 0; i < nodeArr.length; ++i) {
            let node = nodeArr[i]
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    setState(node: cc.Node, state: string) {
        let normal = node.getChildByName('normal')
        let right = node.getChildByName('right')
        let wrong = node.getChildByName('wrong')
        if(state == 'normal') {
            normal.active = true
            right.active = false
            wrong.active = false
        }else if(state == 'right') {
            normal.active = false
            right.active = true
            wrong.active = false
        }else if(state == 'wrong') {
            normal.active = false
            right.active = false
            wrong.active = true
        }
    }

    changeState(node: cc.Node, index: number) {
        let normal = node.getChildByName('normal')
        let right = node.getChildByName('right')
        let wrong = node.getChildByName('wrong')
        if(normal.active) {
            this.subject.push(index)
            this.change(right, normal)
        }else if(right.active) {
            let key = this.subject.indexOf(index)
            this.subject.splice(key, 1)
            this.change(wrong, right)
        }else if(wrong.active) {
            this.change(normal, wrong)
        }
        this.checkTitle()
    }

    change(appearNode: cc.Node, disappearNode: cc.Node) {
        appearNode.opacity = 0
        appearNode.setScale(0)
        appearNode.active = true
        let fadein = cc.fadeIn(0.1)
        let scale = cc.scaleTo(0.1, 1)
        let spawn = cc.spawn(fadein, scale)
        let func = cc.callFunc(()=>{
            disappearNode.active = false
        })
        let seq = cc.sequence(spawn, func)
        appearNode.runAction(seq.clone())
    }

    checkTitle(): boolean {
        let horiArr = []
        let verArr = []
        let totalNum = 0
        let correctNum = 0
        let selectNum = 0
        for(let i = 0; i < this.num; ++i) {
            horiArr.push(0)
            verArr.push(0)
        }
        for(let i = 0; i < this.num; ++i) {
            for(let j = 0; j < this.num; ++j) {
                let index = i * this.num + j
                if(this.itemNodeArr[index].getChildByName('right').active) {
                    if(!this.itemNodeArr[index].getChildByName('wrong').active) {
                        horiArr[j]++
                        verArr[i]++
                    }
                    selectNum++
                }
            }
        }
        // if(selectNum) {
        //     this.refreshBtn.interactable = true
        // }else {
        //     this.refreshBtn.interactable = false
        // }
        for(let i = 0; i < this.num; ++i) {
            if(this.horArr[i] == horiArr[i] && this.horArr[i] != 0) {
                this.horizonTitleArr[i].getChildByName('label').color = this.sizeInfo.lightGray
                this.horizonTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.grayFrame
                correctNum++
            }else {
                this.horizonTitleArr[i].getChildByName('label').color = this.sizeInfo.deepBlue
                this.horizonTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.blueFrame
            }
            if(this.verArr[i] == verArr[i] && this.verArr[i] != 0) {
                this.VerticalTitleArr[i].getChildByName('label').color = this.sizeInfo.lightGray
                this.VerticalTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.grayFrame
                correctNum++
            }else {
                this.VerticalTitleArr[i].getChildByName('label').color = this.sizeInfo.deepBlue
                this.VerticalTitleArr[i].getComponent(cc.Sprite).spriteFrame = this.blueFrame
            }
            if(this.horArr[i] != 0) {
                totalNum++
            }
            if(this.verArr[i] != 0) {
                totalNum++
            }
        }
        for(let i = 0; i < this.num; ++i) {
            if(this.horizonTitleArr[i]) {

            }
        }
       if(totalNum == correctNum) {
            return true
            //this.submitBtn.interactable = true
       }else {
            return false
            //this.submitBtn.interactable = false
       }
    }

    setTitle() {
        let horiArr = []
        let verArr = []
        for(let i = 0; i < this.num; ++i) {
            horiArr.push(0)
            verArr.push(0)
        }
       
        for(let i = 0; i < this.num; ++i) {
            for(let j = 0; j < this.num; ++j) {
                let index = i * this.num + j
                if(this.itemArr[index] != 5) {
                    horiArr[j]++
                    verArr[i]++
                    this.answer.push(index)
                }

            }
        }
        this.eventvalue.levelData[0].answer = [...this.answer]
        this.horArr = [...horiArr]
        this.verArr = [...verArr]
        for(let i = 0; i < this.num; ++i) {
            if(horiArr[i] == 0 || verArr[i] == 0 || horiArr[i] == this.num || verArr[i] == this.num) {
                this.pointBtn.node.active = false
            } 
            this.horizonTitleArr[i].getChildByName('label').getComponent(cc.Label).string = horiArr[i]
            this.VerticalTitleArr[i].getChildByName('label').getComponent(cc.Label).string = verArr[i]
        }
    }

    setBoard(rootNode: cc.Node) {
        this.horizonTitleArr = []
        this.VerticalTitleArr = []
        this.itemNodeArr = []
        let size = this.num + 1
        for(let i = 0; i < size; ++i) {
            for(let j = 0; j < size; ++j) {
                if(i == 0 && j != size - 1) {
                    let node = cc.instantiate(this.titlePrefab)
                    node.width = this.sizeInfo.title.width
                    node.height = this.sizeInfo.title.height
                    let x = (j + 1 / 2) * this.sizeInfo.spaceLong
                    let y = -this.sizeInfo.spaceShort * 1 / 2
                    node.setPosition(cc.v2(x, y))
                    this.board.addChild(node)
                    this.horizonTitleArr[j] = node
                }else if(j == size - 1 && i != 0) {
                    let node = cc.instantiate(this.titlePrefab)
                    node.width = this.sizeInfo.title.width
                    node.height = this.sizeInfo.title.height
                    node.angle = 90
                    node.getChildByName('label').angle = -90
                    let x = this.num * this.sizeInfo.spaceLong + this.sizeInfo.spaceShort / 2
                    let y = -(i - 1 / 2) * this.sizeInfo.spaceLong - this.sizeInfo.spaceShort
                    node.setPosition(cc.v2(x, y))
                    this.board.addChild(node)
                    this.VerticalTitleArr[i - 1] = node
                }else if(i == 0 && j == size - 1) {
                    let node = cc.instantiate(this.littleTitlePrefab)
                    node.width = this.sizeInfo.title.height
                    node.height = this.sizeInfo.title.height
                    let x = this.num * this.sizeInfo.spaceLong + this.sizeInfo.spaceShort / 2
                    let y = -this.sizeInfo.spaceShort / 2
                    node.setPosition(cc.v2(x, y))
                    this.board.addChild(node)
                }else {
                    let node = cc.instantiate(this.bigItemPrefab)
                    node.setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('normal').setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('point').setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('wrong').setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('right').setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('sprite').setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    node.getChildByName('box').setContentSize(cc.size(this.sizeInfo.square.width + 5, this.sizeInfo.square.height + 5))
                    let x = (j + 1 / 2) * this.sizeInfo.spaceLong
                    let y = -(i - 1 / 2) * this.sizeInfo.spaceLong - this.sizeInfo.spaceShort
                    node.setPosition(cc.v2(x, y))
                    rootNode.addChild(node)
                    this.itemNodeArr.push(node)
                }
            }
        }
        this.setTitle()
        this.addListenerOnItem(this.itemNodeArr)
    }

    getPartner(index: number, arr: number[]): number[] {
        let partnerArr: number[] = []
        partnerArr.push(index)
        let len: number = partnerArr.length
        let over = false
        while(!over) {
            len = partnerArr.length
            for (const key in arr) {
                for (const _key in partnerArr) {
                    let nKey = parseInt(key) 
                    if (arr[key] == arr[index] && partnerArr.indexOf(nKey) == -1 && this.groupNumArr[nKey] == this.groupNumArr[index]) {
                        let _nKey = partnerArr[_key]
                        let _arr: number[] = [_nKey - 1, _nKey + 1, _nKey + this.num, _nKey - this.num]
                        if(_arr.indexOf(nKey) != -1) {
                            partnerArr.push(nKey)
                        } 
                    }
                }
            }
            if(len == partnerArr.length) {
                over = true
            }
        }
        for (const key in partnerArr) {
            arr[partnerArr[key]] = 5
        }
        return partnerArr
    }

    setMaterial(rootNode: cc.Node) {
        let arr: number[] = [...this.itemArr]
        this.groupArr = []
        for (const key in arr) {
           if(arr[key] != 5) {
                let group: number[] = this.getPartner(parseInt(key), arr)
                this.groupArr.push(group)
           }
        }
        for (const key in this.groupArr) {
            let index: number = parseInt(key)
            let frame: cc.SpriteFrame = this.getSpriteframe(this.itemArr[this.groupArr[key][0]], 1)
            let node = this.createGroup(this.groupArr[key], frame)
            this.groupNodeArr[index] = node
            let _index: number = this.groupArr[index][0]
            let x: number = this.xArr[_index]
            let y: number = this.yArr[_index]
            let rotation = this.rotationArr[_index]
            node.angle = rotation
            for(let i = 0; i < node.children.length; ++i) {
                node.children[i].angle = - rotation
            }
            node.setPosition(cc.v2(x, y))
            rootNode.addChild(node)
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
        node.width = width * 105
        node.height = height * 105
        for(let i = 0; i < selectArr.length; ++i) {
            let y = - (rowArr[i] - minRow - height / 2 + 0.5) * 109
            let x =  (colArr[i] - minCol - width / 2 + 0.5) * 109
            let itemNode = cc.instantiate(this.itemPrefab)
            itemNode.getChildByName('bg').active = false
            itemNode.getChildByName('wb').active = false
            itemNode.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteframe
            node.addChild(itemNode)
            itemNode.setPosition(cc.v2(x, y))
        }
      
        return node                      
    }

    
    getSpriteframe(index: number, size: number):cc.SpriteFrame {
        switch(index) {
            case 0:
                if(size == 1) {
                    return this.frame1
                }else if(size == 2) {
                    return this.Bframe1
                }
                break
            case 1:
                if(size == 1) {
                    return this.frame2
                }else if(size == 2) {
                    return this.Bframe2
                }
                break
            case 2:
                if(size == 1) {
                    return this.frame3
                }else if(size == 2) {
                    return this.Bframe3
                }
                break
            case 3:
                if(size == 1) {
                    return this.frame4
                }else if(size == 2) {
                    return this.Bframe4
                }
                break
            case 4:
                if(size == 1) {
                    return this.frame5
                }else if(size == 2) {
                    return this.Bframe5
                }
                break
            case 5:
                return null
                break
            case 6:
                if(size == 1) {
                    return this.frame6
                }else if(size == 2) {
                    return this.Bframe6
                }
                break
            case 7:
                if(size == 1) {
                    return this.frame7
                }else if(size == 2) {
                    return this.Bframe7
                }
                break
            case 8:
                if(size == 1) {
                    return this.frame8
                }else if(size == 2) {
                    return this.Bframe8
                }
                break
            case 9:
                if(size == 1) {
                    return this.frame9
                }else if(size == 2) {
                    return this.Bframe9
                }
                break
            case 10:
                if(size == 1) {
                    return this.frame10
                }else if(size == 2) {
                    return this.Bframe10
                }
                break
            default:
                console.error('获取宝藏纹理失败')
                break
        }
    }

    oceanWave(wave1: cc.Node, wave2: cc.Node) {
        wave2.opacity = 0
        let up = cc.moveBy(1, cc.v2(50,0))
        let down = cc.moveBy(2, cc.v2(-50,0))
        let fadein = cc.fadeIn(1)
        let fadeout = cc.fadeOut(2)
        let spawn1 = cc.spawn(up, fadein)
        let spawn2 = cc.spawn(down, fadeout)
        let seq = cc.sequence(spawn1, spawn2)
        let rep = cc.repeatForever(seq)
        let id = setTimeout(() => {
            wave2.runAction(rep.clone())
            let index = this.timeoutArr.indexOf(id)
            this.timeoutArr.splice(index, 1)
            clearTimeout(id)
        }, 1000);
        this.timeoutArr.push(id)
        wave1.runAction(rep)
    }

    onBtnSubmitClick() {
        AudioManager.getInstance().playSound('sfx_buttn', false)
        //行列个数检测
        if(!this.checkTitle()) {
            this.mask.on(cc.Node.EventType.TOUCH_START, ()=>{})
            this.laba.setAnimation(0, 'null', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('啊哦，宝藏数量不正确哦')
            let horiArr = []
            let verArr = []
            for(let i = 0; i < this.num; ++i) {
                horiArr.push(0)
                verArr.push(0)
            }
            for(let i = 0; i < this.num; ++i) {
                for(let j = 0; j < this.num; ++j) {
                    let index = i * this.num + j
                    if(this.itemNodeArr[index].getChildByName('right').active) {
                        if(!this.itemNodeArr[index].getChildByName('wrong').active) {
                            horiArr[j]++
                            verArr[i]++
                        }
                    }
                }
            }
            for(let i = 0; i < this.num; ++i) {
                if(this.horArr[i] != horiArr[i]) {
                    let node = cc.instantiate(this.boxPrefab)
                    node.width = this.sizeInfo.spaceLong
                    node.height = this.sizeInfo.spaceLong * this.num + this.sizeInfo.spaceShort
                    let x = (i + 1 / 2) * this.sizeInfo.spaceLong
                    let y = -node.height / 2
                    node.setPosition(cc.v2(x, y))
                    this.board.addChild(node)
                    let fadein = cc.fadeIn(0.5)
                    let fadeout = cc.fadeOut(0.5)
                    let fun = cc.callFunc(()=>{
                       node.removeFromParent()
                    })
                    let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                    node.stopAllActions()
                    node.runAction(seq)
                    // for(let n = 0; n < this.num; ++n) {
                    //     for(let m = 0; m < this.num; ++m) {
                    //         let index = n * this.num + m
                    //         if(m == i) {
                    //             let box = this.itemNodeArr[index].getChildByName('box')
                    //             box.active = true
                    //             let fadein = cc.fadeIn(0.5)
                    //             let fadeout = cc.fadeOut(0.5)
                    //             let fun = cc.callFunc(()=>{
                    //                 box.active = false
                    //             })
                    //             let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                    //             box.stopAllActions()
                    //             box.runAction(seq)
                    //         }
                    //     }
                    // }
                }
                if(this.verArr[i] != verArr[i]) {
                    let node = cc.instantiate(this.boxPrefab)
                    node.width = this.sizeInfo.spaceLong * this.num + this.sizeInfo.spaceShort
                    node.height = this.sizeInfo.spaceLong
                    let x = node.width / 2
                    let y = - this.sizeInfo.spaceShort - (i + 1 / 2) * this.sizeInfo.spaceLong
                    node.setPosition(cc.v2(x, y))
                    this.board.addChild(node)
                    let fadein = cc.fadeIn(0.5)
                    let fadeout = cc.fadeOut(0.5)
                    let fun = cc.callFunc(()=>{
                       node.removeFromParent()
                    })
                    let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                    node.stopAllActions()
                    node.runAction(seq)
                    // for(let n = 0; n < this.num; ++n) {
                    //     for(let m = 0; m < this.num; ++m) {
                    //         let index = n * this.num + m
                    //         if(n == i) {
                    //             let box = this.itemNodeArr[index].getChildByName('box')
                    //             box.active = true
                    //             let fadein = cc.fadeIn(0.5)
                    //             let fadeout = cc.fadeOut(0.5)
                    //             let fun = cc.callFunc(()=>{
                    //                 box.active = false
                    //             })
                    //             let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                    //             box.stopAllActions()
                    //             box.runAction(seq)
                    //         }
                    //     }
                    // }
                }
            }
            let id = setTimeout(() => {
                this.mask.off(cc.Node.EventType.TOUCH_START)
                clearTimeout(id)
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
            }, 3500)
            this.timeoutArr.push(id)
            return 
        }
        let correctNum: number = 0
        for(let i = 0; i < this.subject.length; ++i) {
            if(this.answer.indexOf(this.subject[i]) != -1) {
                correctNum++
            }
        }
        //形状检测
        if(correctNum == this.answer.length) {
            this.isOver = 1
            this.eventvalue.result = 1
            this.eventvalue.levelData[0].result = 1
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            })
            DaAnData.getInstance().submitEnable = true
            this.mask.on(cc.Node.EventType.TOUCH_START, ()=>{})
            this.pointBtn.interactable = false
            this.refreshBtn.interactable = false
            //this.submitBtn.interactable = false
            this.removeListenerOnItem(this.itemNodeArr)
            for(let i = 0; i < this.itemNodeArr.length; ++i) {
                if(this.itemArr[i] != 5) {
                    let sprite = this.itemNodeArr[i].getChildByName('sprite')
                    sprite.getComponent(cc.Sprite).spriteFrame = this.getSpriteframe(this.itemArr[i], 2)
                    sprite.setContentSize(cc.size(this.sizeInfo.square.width, this.sizeInfo.square.height))
                    sprite.active = true
                    sprite.setScale(0)
                    sprite.opacity = 0
                    let fadein = cc.fadeIn(0.1)
                    let scale = cc.scaleTo(0.1, 1)
                    let spawn = cc.spawn(fadein, scale)
                    let delay = cc.delayTime(0.5)
                    let seq = cc.sequence(delay, spawn)
                    sprite.runAction(seq)
                    let spine = this.itemNodeArr[i].getChildByName('spine')
                    spine.active = true
                    spine.getComponent(sp.Skeleton).setAnimation(0, 'animation', false)
                    AudioManager.getInstance().playSound('sfx_shvdimt')
                }
            }

            let id = setTimeout(() => {
                UIHelp.showOverTip(2,'你真棒，等等还没做完的同学吧。', null, '挑战成功')
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
                clearTimeout(id)
            }, 2000);
            this.timeoutArr.push(id)
        }else {
            this.laba.setAnimation(0, 'null', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('啊哦~和目标图案形状不一样哟', false)
            this.mask.on(cc.Node.EventType.TOUCH_START, ()=>{})
            let pointArr: cc.Node[] = []
            let wrongGroup: number[][] = []
            for(let i = 0; i < this.itemNodeArr.length; ++i) {
                if(this.itemNodeArr[i].getChildByName('right').active) {
                    if(this.answer.indexOf(i) == - 1) {
                        pointArr.push(this.itemNodeArr[i])
                    }
                }
               
            }

            for(let i = 0; i < this.answer.length; ++i) {
                if(this.subject.indexOf(this.answer[i]) == -1) {
                    for(let j = 0; j < this.groupArr.length; ++j) {
                        if(this.groupArr[j].indexOf(this.answer[i]) != -1) {
                            if(wrongGroup.indexOf(this.groupArr[j]) == -1) {
                                wrongGroup.push(this.groupArr[j])
                            }
                        }
                    }
                }
            }
            for(let i = 0; i < wrongGroup.length; ++i) {
                for(let j = 0; j < wrongGroup[i].length; ++j) {
                    if(this.itemNodeArr[wrongGroup[i][j]].getChildByName('right').active) {
                        pointArr.push(this.itemNodeArr[wrongGroup[i][j]])
                    }
                }
            }
            let overNum = 0
            for(let i = 0; i < pointArr.length; ++i) {
                let box = pointArr[i].getChildByName('box')
                let spine = pointArr[i].getChildByName('spine')
                //spine.active = true
                //AudioManager.getInstance().playSound('sfx_gnthng')
                //spine.getComponent(sp.Skeleton).setAnimation(0, 'animation', false)
                box.active = true
                box.opacity = 0
                let delay = cc.delayTime(0.5)
                let fadein = cc.fadeIn(0.5)
                let fadeout = cc.fadeOut(0.5)
                let fun = cc.callFunc(()=>{
                    box.active = false
                })
                let seq = cc.sequence(delay, fadein, fadeout, fadein, fadeout, fadein, fadeout, fun)
                box.stopAllActions()
                box.runAction(seq)
            }
            let id = setTimeout(() => {
                this.mask.off(cc.Node.EventType.TOUCH_START)
                clearTimeout(id)
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
            }, 3500)
            this.timeoutArr.push(id)

            for(let i = 0; i < this.answer.length; ++i) {
                if(this.subject.indexOf(this.answer[i]) == -1) {
                    for(let j = 0; j < this.groupArr.length; j++) {
                        if(this.groupArr[j].indexOf(this.answer[i]) != - 1) {
                            let delay = cc.delayTime(0.5)
                            let fadein = cc.fadeIn(0.5)
                            let fadeout = cc.fadeOut(0.5)
                            let seq = cc.sequence(delay, fadeout, fadein, fadeout, fadein, fadeout, fadein)
                            this.groupNodeArr[j].stopAllActions()
                            this.groupNodeArr[j].runAction(seq)
                        }
                    }
                }
            }
        }
       

    }

    onBtnRefreshClick() {
        AudioManager.getInstance().playSound('sfx_buttn', false)
        UIHelp.AffirmTip(1, '你确定要清楚所有操作么？', ()=>{
            for(let i = 0; i < this.itemNodeArr.length; ++i) {
                this.setState(this.itemNodeArr[i], 'normal')
            }
            this.subject = []
            this.checkTitle()
           
        })
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    this.setPanel()
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
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
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
