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
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null
    @property(cc.Prefab)
    private bigItemPrefab: cc.Prefab = null
    @property(cc.Prefab)
    private titlePrefab: cc.Prefab = null
    @property(cc.Prefab)
    private littleTitlePrefab: cc.Prefab = null
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
    private answer: number[] = []
    private subject: number[] = []
    private isOver: number = 0
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
               
                subject: [6,6,6,6,6,6,6,6,6],
                answer: [1,2,3,6,1,2,6,6,1],
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
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
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
        this.oceanWave(this.wave1, this.wave2)
        let id = setTimeout(() => {
            //AudioManager.getInstance().playSound('title')
            clearTimeout(id)
        }, 500);
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
                cc.log('======')
                this.changeState(node)
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

    changeState(node: cc.Node) {
      let normal = node.getChildByName('normal')
      let right = node.getChildByName('right')
      let wrong = node.getChildByName('wrong')
      if(normal.active) {
        right.active = true
        normal.active = false
      }else if(right.active) {
        wrong.active = true
        right.active = false
      }else if(wrong.active) {
        normal.active = true
        wrong.active = false
      }
    }

    setTitle(itemArr: number[]) {
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
        for(let i = 0; i < this.num; ++i) {
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
                    this.board.addChild(node)
                    this.itemNodeArr.push(node)
                }
            }
        }
        this.setTitle(this.itemArr)
        this.addListenerOnItem(this.itemNodeArr)
        console.log(this.itemNodeArr.length)
        console.log(this.VerticalTitleArr.length)
        console.log(this.horizonTitleArr.length)
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
        let groupArr: number[][] = []
        for (const key in arr) {
           if(arr[key] != 5) {
                let group: number[] = this.getPartner(parseInt(key), arr)
                groupArr.push(group)
           }
        }
        for (const key in groupArr) {
            let index: number = parseInt(key)
            let frame: cc.SpriteFrame = this.getSpriteframe(this.itemArr[groupArr[key][0]])
            let node = this.createGroup(groupArr[key], frame)
            let _index: number = groupArr[index][0]
            let x: number = this.xArr[_index]
            let y: number = this.yArr[_index]
            let rotation = this.rotationArr[_index]
            node.rotation = rotation
            node.setPosition(cc.v2(x, y))
            this.material.addChild(node)
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
        }, 1000);
        wave1.runAction(rep)
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
                    this.setPanel();
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
