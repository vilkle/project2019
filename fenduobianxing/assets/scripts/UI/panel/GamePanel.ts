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
import { isString } from "../../collections/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private dish1: cc.Node = null
    @property(cc.Node)
    private dish2: cc.Node = null
    @property(cc.Node)
    private figure1: cc.Node = null
    @property(cc.Node)
    private figure2: cc.Node = null
    @property(cc.Node)
    private figure3: cc.Node = null
    @property(cc.Node)
    private bubble: cc.Node = null
    @property(cc.Sprite)
    private title: cc.Sprite = null
    @property(cc.Button)
    private button: cc.Button = null
    @property(cc.Node)
    private touchNode: cc.Node = null
    @property(cc.SpriteFrame)
    private title1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title3: cc.SpriteFrame = null
    @property(cc.Node)
    private mask: cc.Node = null
    @property(cc.Node)
    private spine: cc.Node = null
    private altas: cc.SpriteAtlas = null
    private loadResOver: boolean = false
    private audioOver: boolean = false
    private audioId: number[] = []
    private answerArr1: number[][] = [[0,2,4,5,6],[1,3,7,8]]
    private answerArr2: number[][] = [[0,2,4,6,7],[1,3,5,8,9]]
    private answerArr3: number[][] = [[0,1,4],[2,6,7,8],[3,5,9]]
    private timeoutArr: number [] = []
    private runningArr: cc.Node[] =[]
    private figureArr: cc.Node[] = []
    private figurePoint: cc.Node = null
    private dishPoint: cc.Node = null
    private touchTarget: any = null
    private rightNum: number = 0
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
            DaAnData.getInstance().submitEnable = true
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.setPanel()
        }else {
            this.getNet()
        }
        this.addData(3)
        this.eventvalue.levelData[0].answer = this.answerArr1
        this.eventvalue.levelData[1].answer = this.answerArr2
        this.eventvalue.levelData[2].answer = this.answerArr3
        this.eventvalue.levelData[0].subject = [[],[]]
        this.eventvalue.levelData[1].subject = [[],[]]
        this.eventvalue.levelData[2].subject = [[],[],[]]
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null)
        cc.loader.loadRes("audio/bgm.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/success.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/1.把所有的多边形分在红框，不是多边形的分在蓝框.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/2.把所有正多边形分在红框，不是正多边形的分在蓝框.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/3.按图形的边数分一分.mp3", cc.AudioClip, (err, audioClip)=> { })
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.levelNum].result = 2;
            }
        })
        this.bubble.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(!this.audioOver) {
                return
            }
            for (const key in this.audioId) {
                AudioManager.getInstance().stopAudio(this.audioId[key])
            }
            if(this.levelNum == 0) {
                AudioManager.getInstance().playSound('仔细观察动手分一分', false, 1, (id)=>{this.audioId.push(id)}, ()=>{
                    AudioManager.getInstance().playSound('1.把所有的多边形分在红框，不是多边形的分在蓝框', false, 1, (id)=>{this.audioId.push(id)}, ()=>{})
                })
            }else if(this.levelNum == 1) {
                AudioManager.getInstance().playSound('2.把所有正多边形分在红框，不是正多边形的分在蓝框', false, 1, (id)=>{this.audioId.push(id), ()=>{}})
            }else if(this.levelNum == 2) {
                AudioManager.getInstance().playSound('3.按图形的边数分一分', false, 1, (id)=>{this.audioId.push(id), ()=>{}})
            }
        })
        this.button.enabled = false
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    start() {
        
    }

    setPanel() {
        cc.loader.loadRes("images/gameUI/figure",cc.SpriteAtlas,function(err,Altas)
        {
            this.round1()
            this.altas = Altas
            this.loadResOver = true
        }.bind(this))
    }

    addListener(arr: cc.Node[]) {
        for(let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget||e.target.opacity==0) {
                    return
                }
                e.target.opacity = 0
                this.touchTarget = e.target
                this.touchNode.active = true
                let frame = e.target.getComponent(cc.Sprite).spriteFrame
                this.touchNode.getComponent(cc.Sprite).spriteFrame = this.getFrame(1, frame)
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(point)

            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(point)
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(e.target != this.touchTarget) {
                    return
                }
                e.target.opacity = 255
                this.touchNode.active = false
                this.touchTarget = null
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(e.target != this.touchTarget) {
                    return
                }
                let num = 0
                let isJudge: boolean = false
                for(let k = 0; k < this.dishPoint.children.length; k++) {
                    if(this.dishPoint.children[k].getBoundingBox().contains(this.dishPoint.convertToNodeSpaceAR(e.currentTouch._point))) {
                        isJudge = true
                        if(this.isRight(i, k)) {
                            let figureArr = this.dishPoint.children[k].getChildByName('figureArr').children
                           for (const key in figureArr) {
                               let frame = figureArr[key].getComponent(cc.Sprite).spriteFrame
                               if(frame == null) {
                                    this.isOver = 2
                                    this.eventvalue.result = 2
                                    this.eventvalue.levelData[this.levelNum].subject[k].push(i)
                                    this.eventvalue.levelData[this.levelNum].result = 2
                                    AudioManager.getInstance().playSound('right', false)
                                    let oriFrame = e.target.getComponent(cc.Sprite).spriteFrame
                                    figureArr[key].getComponent(cc.Sprite).spriteFrame = this.getFrame(2, oriFrame)
                                    num++
                                    this.rightNum ++
                                    break
                               }
                           }
                        }
                        
                    }
                }
                if(num == 0) {
                    if(isJudge) {
                        AudioManager.getInstance().playSound('wrong', false)
                    }
                    e.target.opacity = 255
                }
                this.touchNode.active = false
                this.touchTarget = null
                if(this.isSuccess()) {
                    this.eventvalue.levelData[this.levelNum].result = 1
                    if(this.levelNum < 2) {
                        AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('success', false)
                        this.spine.active = true
                        this.spine.getComponent(sp.Skeleton).setAnimation(0, 'animation', false)
                        this.spine.getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                            if(trackEntry.animation.name == 'animation') {
                                this.spine.active = false
                            }
                        })
                        let id = setTimeout(() => {
                            this.nextRound()
                            clearTimeout(id)
                            let index = this.timeoutArr.indexOf(id)
                            this.timeoutArr.splice(index, 1)
                        }, 5000)
                        this.timeoutArr.push(id)
                    }else {
                        this.isOver = 1
                        this.eventvalue.result =1
                        DataReporting.isRepeatReport = false
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        })
                        AudioManager.getInstance().stopAll()
                        UIHelp.showOverTip(2,'闯关成功，棒棒哒~', '', null,null,'闯关成功')
                    }
                }
                console.log(this.eventvalue)
            })
        }
    }

    removeLister(arr: cc.Node[]) {
        for(let i = 0; i < arr.length; ++i) {
            let node = arr[i]
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    nextRound() {
        this.button.enabled = false
        this.removeLister(this.figureArr)
        if(this.levelNum == 0) {
            this.round2()
        }else if(this.levelNum == 1) {
            this.round3()
        }
        this.levelNum++
    }

    isSuccess(): boolean {
        if(this.levelNum == 0 && this.rightNum == 9) {
            return true
        }else if(this.levelNum == 1 && this.rightNum == 10) {
            return true
        }else if(this.levelNum == 2 && this.rightNum == 10) {
            return true
        }
        return false
    }

    isRight(figureId: number, dishId: number) {
        if(this.levelNum == 0) {
            if(dishId == 0) {
                if(this.answerArr1[0].indexOf(figureId) != -1) {
                    return true
                }
            }else if(dishId == 1) {
                if(this.answerArr1[1].indexOf(figureId) != -1) {
                    return true
                }
            }
        }else if(this.levelNum == 1) {
            if(dishId == 0) {
                if(this.answerArr2[0].indexOf(figureId) != -1) {
                    return true
                }
            }else if(dishId == 1) {
                if(this.answerArr2[1].indexOf(figureId) != -1) {
                    return true
                }
            }
        }else if(this.levelNum == 2) {
            if(dishId == 0) {
                if(this.answerArr3[0].indexOf(figureId) != -1) {
                    return true
                }
            }else if(dishId == 1) {
                if(this.answerArr3[1].indexOf(figureId) != -1) {
                    return true
                }
            }else if(dishId == 2) {
                if(this.answerArr3[2].indexOf(figureId) != -1) {
                    return true
                }
            }
        }
        return false
    }

    round1() {
        this.mask.active = true
        AudioManager.getInstance().stopAll()
        this.audioOver = false
        AudioManager.getInstance().playSound('仔细观察动手分一分', false, 1, (id)=>{this.audioId.push(id)}, ()=>{
            AudioManager.getInstance().playSound('1.把所有的多边形分在红框，不是多边形的分在蓝框', false, 1, (id)=>{this.audioId.push(id)}, ()=>{
                this.button.enabled = true
                this.audioOver = true
            })
        })
        this.title.spriteFrame = this.title1
        this.rightNum = 0
        this.button.node.active = true
        this.dish1.active = true
        this.figure2.active = false
        this.figure3.active = false
        this.figure1.active = true
        this.figurePoint = this.figure1
        let dishArr = []
        this.figureArr = []
        this.dishPoint = this.dish1
        dishArr = this.dish1.children
        this.figureArr = this.figure1.children
        for (const key in dishArr) {
            let arr = dishArr[key].getChildByName('figureArr').children
           for (const index in arr) {
                arr[index].getComponent(cc.Sprite).spriteFrame = null
           }
        }
    }
  
    round2() {
        this.mask.active = true
        AudioManager.getInstance().stopAll()
        this.audioOver = false
        AudioManager.getInstance().playSound('2.把所有正多边形分在红框，不是正多边形的分在蓝框', false, 1, (id)=>{this.audioId.push(id)}, ()=>{
            this.button.enabled = true
            this.audioOver = true
        })
        this.title.spriteFrame = this.title2
        this.rightNum = 0
        this.button.node.active = true
        this.dish1.active = true
        this.figure1.active = false
        this.figure3.active = false
        this.figure2.active = true
        this.figurePoint = this.figure2
        let dishArr = []
        this.figureArr = []
        this.dishPoint = this.dish1
        dishArr = this.dish1.children
        this.figureArr = this.figure2.children
        for (const key in dishArr) {
            let arr = dishArr[key].getChildByName('figureArr').children
           for (const index in arr) {
                arr[index].getComponent(cc.Sprite).spriteFrame = null
           }
        }
    }

    round3() {
        this.mask.active = true
        AudioManager.getInstance().stopAll()
        this.audioOver = false
        AudioManager.getInstance().playSound('3.按图形的边数分一分', false, 1, (id)=>{this.audioId.push(id)}, ()=>{
            this.button.enabled = true
            this.audioOver = true
        })
        this.title.spriteFrame = this.title3
        this.rightNum = 0
        this.button.node.active = true
        this.dish1.active = false
        this.dish2.active = true
        this.figure1.active = false
        this.figure2.active = false
        this.figure3.active = true
        this.figurePoint = this.figure3
        let dishArr = []
        this.figureArr = []
        this.dishPoint = this.dish2
        dishArr = this.dish2.children
        this.figureArr = this.figure3.children
        for (const key in dishArr) {
            let arr = dishArr[key].getChildByName('figureArr').children
           for (const index in arr) {
                arr[index].getComponent(cc.Sprite).spriteFrame = null
           }
        }
    }

    startRun(node: cc.Node) {
        this.mask.active = false
        this.button.node.active = false
        let divisor = [0,4.5,2.4,5.3,0,3.7,3,4.1,1.1,1.6]
        let arr = this.figureArr
        for(let i = 0; i < arr.length; ++i) {
            arr[i].opacity = 0
            let pos = arr[i].position
            let id = setTimeout(() => {
                arr[i].opacity = 255
                arr[i].setPosition(cc.v2(pos.x, 300))
                this.runningArr.push(arr[i])
                clearTimeout(id)
                let index = this.timeoutArr.indexOf(id)
                this.timeoutArr.splice(index, 1)
            }, divisor[i] * 1300);
            this.timeoutArr.push(id)
        }
        this.addListener(arr)
        AudioManager.getInstance().playSound('bgm', true)
    }

    getFrame(state: number, frame: cc.SpriteFrame): cc.SpriteFrame {//1选中的纹理2缩小的纹理
        let name = frame.name
        let chooseName = name+'3'
        let smallName = name+'2'
        let spriteframe = null
        if(state == 1) {
            spriteframe = this.altas.getSpriteFrame(chooseName)
        }else if(state == 2) {
            spriteframe = this.altas.getSpriteFrame(smallName)
        }
        return spriteframe
    }


    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: [],
                subject: [],
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
        for (const key in this.timeoutArr) {
           clearTimeout(this.timeoutArr[key])
        }
    }

    update() {
        if(this.runningArr.length) {
            for(let i = 0; i < this.runningArr.length; ++i) {
                let node = this.runningArr[i]
                let pos = node.position
                node.setPosition(cc.v2(pos.x, pos.y - 2))
                if(node.position.y < -150) {
                    node.setPosition(cc.v2(pos.x, 300))
                }
            }
        }
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    this.setPanel()
                    console.error('there is a error on getNet.')
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                  
                    this.setPanel()
                }
            } else {
                
            }
        }.bind(this), null);
    }
}
