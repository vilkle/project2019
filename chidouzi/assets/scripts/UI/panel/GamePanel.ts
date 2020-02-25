import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { DaAnData } from "../../Data/DaAnData";

const { ccclass, property } = cc._decorator;

class Chain {
    public bean: cc.Node = null
    public bone: any = null
}

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Node)
    private bg:cc.Node = null;
    @property(cc.Node)
    private mask:cc.Node = null
    @property(cc.Node)
    private title: cc.Node = null
    @property(sp.Skeleton)
    private actor: sp.Skeleton = null
    @property(cc.Node)
    private a: cc.Node = null
    @property(cc.Node)
    private b: cc.Node = null
    @property(cc.Node)
    private c: cc.Node = null
    @property(cc.Prefab)
    private beanPrefab: cc.Prefab = null
    @property(cc.SpriteFrame)
    private greenBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private yellowBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private redBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private number2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong2: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right2: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong3: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right3: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong4: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right4: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong5: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right5: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong6: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right6: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number7: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong7: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private right7: cc.SpriteFrame = null 
    private rootPos: cc.Vec2 = null
    private chainArr: Chain[] = []
    private beanArr: cc.Node[] = []
    private isUpdat: boolean = true
    private idArr: number[] = []
    private optionArr: cc.Node[] = []
    private numberArr: number[] = [3, 4, 5, 4, 6, 6]
    private answerArr: number[] = [1, 2, 3, 3, 2, 3]
    private levelNum: number = 0
    private isOver : number = 0
    private buttonEnable: boolean = false
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
        }
        this.addData(6)
        this.eventvalue.levelData[0].answer = 1
        this.eventvalue.levelData[1].answer = 2
        this.eventvalue.levelData[2].answer = 3
        this.eventvalue.levelData[3].answer = 3
        this.eventvalue.levelData[4].answer = 2
        this.eventvalue.levelData[5].answer = 3
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null)
        cc.loader.loadRes("audio/lib_1426_4273.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/lib_3335_4296.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/抛.mp3", cc.AudioClip, (err, audioClip)=> { })
        cc.loader.loadRes("audio/吃.mp3", cc.AudioClip, (err, audioClip)=> { })
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.levelNum].result = 2
            }
        })
        this.title.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.mask.active = true
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('lib_1426_4273', false, 1, null, ()=>{
                this.mask.active = false
            })
        })
        this.optionArr = [this.a, this.b, this.c]
        this.rootPos = this.actor.node.position
    }

    start() {
        this.mask.active = true
        let id = setTimeout(() => {
            this.mask.active = true
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('lib_1426_4273', false, 1, null, ()=>{
                this.mask.active = false
            })
            clearTimeout(id)
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
        }, 500);
        this.idArr.push(id)
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.actor.setAnimation(0, 'idle_01', true)
        this.roundBegan(this.levelNum)
        this.addListenerOnOptoin()
    }

    addListenerOnOptoin() {
        for(let i = 0; i < this.optionArr.length; ++i) {
            this.optionArr[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(!this.buttonEnable) {
                    return
                }
                this.a.getChildByName('wrong').active = false
                this.b.getChildByName('wrong').active = false
                this.c.getChildByName('wrong').active = false
                this.a.getChildByName('right').active = false
                this.b.getChildByName('right').active = false
                this.c.getChildByName('right').active = false
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.levelNum].result = 2
                this.eventvalue.levelData[this.levelNum].subject = i + 1
                if(this.answerArr[this.levelNum] == i+1) {
                    this.eventvalue.levelData[this.levelNum].result = 1
                    if(this.levelNum == 5) {
                        this.isOver = 1
                        this.eventvalue.result = 1
                        DataReporting.isRepeatReport = false
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        })
                    }
                    this.buttonEnable = false
                    this.eatBean()
                    this.optionArr[i].getChildByName('right').active = true
                }else {
                    this.optionArr[i].getChildByName('wrong').active = true
                    AudioManager.getInstance().stopAll()
                    AudioManager.getInstance().playSound('lib_3335_4296', false)
                    this.actor.setAnimation(0, 'false_01', false)
                    this.actor.setCompleteListener(trackEntry=>{
                        if(trackEntry.animation.name == 'false_01') {
                            this.actor.setAnimation(0, 'plate_02', true)
                            this.a.getChildByName('wrong').active = false
                            this.b.getChildByName('wrong').active = false
                            this.c.getChildByName('wrong').active = false
                            this.a.getChildByName('right').active = false
                            this.b.getChildByName('right').active = false
                            this.c.getChildByName('right').active = false
                        }
                    })
                }
                console.log(this.eventvalue)
            })
        }   
    }

    roundBegan(levelNum: number) {
        this.isUpdat = true
        if(levelNum == 0) {
            this.round1()
        }else if(levelNum == 1) {
            this.round2()
        }else if(levelNum == 2) {
            this.round3() 
        }else if(levelNum == 3) {
            this.round4()
        }else if(levelNum == 4) {
            this.round5()
        }else if(levelNum == 5) {
            this.round6()
        }
        this.actor.setAnimation(0, 'plate_01', false)
        this.actor.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'plate_01') {
                this.actor.setAnimation(0, 'plate_02', true)
            }
        })
    }

    eatBean() {
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('抛', false)
        this.actor.setAnimation(0, 'right_01', false)
        this.actor.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'right_01') {
                this.isUpdat = false
                this.actor.setAnimation(0, 'right_02', false)
                for(let i = 0; i < this.beanArr.length; ++i) {
                    this.beanArr[i].position = cc.v2(0, 650)
                    let mouthPos: cc.Vec2 = cc.v2(this.actor.findBone('mouth_01').worldX, this.actor.findBone('mouth_01').worldY).add(this.rootPos)
                    let move = cc.moveTo(0.3, mouthPos)
                    let func = cc.callFunc(()=>{
                        this.beanArr[i].opacity = 0
                        if(i == this.beanArr.length-1) {
                            AudioManager.getInstance().stopAll()
                            AudioManager.getInstance().playSound('吃', false)
                            this.actor.setAnimation(0, 'right_03', false)
                            this.actor.setCompleteListener(trackEntry=>{
                                if(trackEntry.animation.name == 'right_03') {
                                    this.actor.setAnimation(0, 'idle_01', true)
                                }
                            })
                        }

                    })
                    let time = 0.5/(this.beanArr.length - 1) * i
                    let delay = cc.delayTime(time)
                    this.beanArr[i].runAction(cc.sequence(delay, move, func))
                }
        
                let id = setTimeout(() => {
                    for(let i = 0; i < this.chainArr.length; ++i) {
                        this.chainArr[i] = null
                    }
                    for(let i = 0; i < this.beanArr.length; ++i) {
                        this.beanArr[i].destroy()
                    }
                    this.chainArr = []
                    this.beanArr = []
                    this.a.getChildByName('wrong').active = false
                    this.b.getChildByName('wrong').active = false
                    this.c.getChildByName('wrong').active = false
                    this.a.getChildByName('right').active = false
                    this.b.getChildByName('right').active = false
                    this.c.getChildByName('right').active = false
                    this.levelNum++
                    if(this.levelNum == 6) {
                        UIHelp.showOverTip(2, '你真棒！等等还没做完的同学吧~', '', null, null, '闯关成功')
                    }else {
                        UIHelp.showOverTip(1, '', '下一关', ()=>{this.roundBegan(this.levelNum)}, null, '')
                    }
                    clearTimeout(id)
                    let index = this.idArr.indexOf(id)
                    this.idArr.splice(index, 1)
                }, 2000);
                this.idArr.push(id)
            }
        })
    }

    round1() {
        this.buttonEnable = true
        for(let i = 0; i < 3; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.greenBean
            this.node.addChild(node)
            this.beanArr[2-i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_01_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_l_02_01')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_l_02_02')
        chain3.bean = this.beanArr[2]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
       
        this.a.getComponent(cc.Sprite).spriteFrame = this.number3
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong3
        this.b.getComponent(cc.Sprite).spriteFrame = this.number4;
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.c.getComponent(cc.Sprite).spriteFrame = this.number5
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right3
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right4
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right5
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    round2() {
        this.mask.active = false
        this.buttonEnable = true
        for(let i = 0; i < 4; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.greenBean
            this.node.addChild(node)
            this.beanArr[3-i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()
        let chain4 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_02_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_r_02_02')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_l_02_01')
        chain3.bean = this.beanArr[2]
        chain4.bone = this.actor.findBone('bean_l_02_02')
        chain4.bean = this.beanArr[3]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        this.chainArr.push(chain4)
       
        this.a.getComponent(cc.Sprite).spriteFrame = this.number3
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong3
        this.b.getComponent(cc.Sprite).spriteFrame = this.number4;
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.c.getComponent(cc.Sprite).spriteFrame = this.number5
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right3
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right4
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right5
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    round3() {
        this.mask.active = false
        this.buttonEnable = true
        for(let i = 0; i < 5; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.yellowBean
            this.node.addChild(node)
            this.beanArr[4-i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()
        let chain4 = new Chain()
        let chain5 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_04_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_r_04_02')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_r_04_03')
        chain3.bean = this.beanArr[2]
        chain4.bone = this.actor.findBone('bean_r_04_04')
        chain4.bean = this.beanArr[3]
        chain5.bone = this.actor.findBone('bean_l_01_01')
        chain5.bean = this.beanArr[4]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        this.chainArr.push(chain4)
        this.chainArr.push(chain5)
       

        this.a.getComponent(cc.Sprite).spriteFrame = this.number3
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong3
        this.b.getComponent(cc.Sprite).spriteFrame = this.number4;
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.c.getComponent(cc.Sprite).spriteFrame = this.number5
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right3
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right4
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right5
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    round4() {
        this.mask.active = false
        this.buttonEnable = true
        for(let i = 0; i < 4; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.yellowBean
            this.node.addChild(node)
            this.beanArr[i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()
        let chain4 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_03_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_r_03_02')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_r_03_03')
        chain3.bean = this.beanArr[2]
        chain4.bone = this.actor.findBone('bean_l_01_01')
        chain4.bean = this.beanArr[3]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        this.chainArr.push(chain4)
       
        this.a.getComponent(cc.Sprite).spriteFrame = this.number2
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong2
        this.b.getComponent(cc.Sprite).spriteFrame = this.number3
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong3
        this.c.getComponent(cc.Sprite).spriteFrame = this.number4
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right2
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right3
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right4
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    round5() {
        this.mask.active = false
        this.buttonEnable = true
        for(let i = 0; i < 6; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.redBean
            this.node.addChild(node)
            this.beanArr[i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()
        let chain4 = new Chain()
        let chain5 = new Chain()
        let chain6 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_03_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_r_03_02')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_r_03_03')
        chain3.bean = this.beanArr[2]
        chain4.bone = this.actor.findBone('bean_l_03_01')
        chain4.bean = this.beanArr[3]
        chain5.bone = this.actor.findBone('bean_l_03_02')
        chain5.bean = this.beanArr[4]
        chain6.bone = this.actor.findBone('bean_l_03_03')
        chain6.bean = this.beanArr[5]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        this.chainArr.push(chain4)
        this.chainArr.push(chain5)
        this.chainArr.push(chain6)
       
        this.a.getComponent(cc.Sprite).spriteFrame = this.number5
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5
        this.b.getComponent(cc.Sprite).spriteFrame = this.number6
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong6
        this.c.getComponent(cc.Sprite).spriteFrame = this.number7
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong7
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right5
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right6
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right7
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    round6() {
        this.mask.active = false
        this.buttonEnable = true
        for(let i = 0; i < 6; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.redBean
            this.node.addChild(node)
            this.beanArr[5-i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()
        let chain4 = new Chain()
        let chain5 = new Chain()
        let chain6 = new Chain()

        chain1.bone = this.actor.findBone('bean_r_04_01')
        chain1.bean = this.beanArr[0]
        chain2.bone = this.actor.findBone('bean_r_04_02')
        chain2.bean = this.beanArr[1]
        chain3.bone = this.actor.findBone('bean_r_04_03')
        chain3.bean = this.beanArr[2]
        chain4.bone = this.actor.findBone('bean_r_04_04')
        chain4.bean = this.beanArr[3]
        chain5.bone = this.actor.findBone('bean_l_02_01')
        chain5.bean = this.beanArr[4]
        chain6.bone = this.actor.findBone('bean_l_02_02')
        chain6.bean = this.beanArr[5]
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        this.chainArr.push(chain4)
        this.chainArr.push(chain5)
        this.chainArr.push(chain6)
        this.a.getComponent(cc.Sprite).spriteFrame = this.number4
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.b.getComponent(cc.Sprite).spriteFrame = this.number5
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5
        this.c.getComponent(cc.Sprite).spriteFrame = this.number6
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong6
        this.a.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right4
        this.b.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right5
        this.c.getChildByName('right').getComponent(cc.Sprite).spriteFrame = this.right6
        let id =setTimeout(() => {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
            let index = this.idArr.indexOf(id)
            this.idArr.splice(index, 1)
            clearTimeout(id)
        }, 1);
        this.idArr.push(id)
    }

    updatePos() {
        if(this.chainArr.length == 0) {
            return
        }
        for(let i = 0; i < this.chainArr.length; ++i) {
            this.chainArr[i].bean.position = this.chainArr[i].bone.position
        }
    }

    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: 0,
                subject: 0,
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

    update() {
        if(this.chainArr.length && this.isUpdat) {
            for(let i = 0; i < this.chainArr.length; ++i) {
                this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY).add(this.rootPos)
            }
        }
    }

    onDestroy() {
        for(let i = 0; i < this.idArr.length; ++i) {
            clearTimeout(this.idArr[i])
        }
    }

    onShow() {
    }

    setPanel() {
        
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
