/*
 * @Author: 马超
 * @Date: 2020-11-03 11:43:49
 * @LastEditTime: 2020-11-03 15:26:36
 * @Description: 游戏脚本
 * @FilePath: \cases\assets\Script\q1.ts
 */

const {ccclass, property} = cc._decorator;
//生成可调整概率的随机数
class GL {
    private min = null  //最小的值
    private max = null  //最大的值
    private fenpei = null //map[数字，概率]
    constructor({ min, max, fenpei = new Map() }) {
        this.min = min;
        this.max = max;
        this.fenpei = fenpei;
    }

    get baifenbi() {
        return (1 - this.peizhi) / (this.max - this.min - this.fenpei.size + 1);
    }

    get peizhi() {
        let result = 0;
        for (let i of this.fenpei.values()) {
            if (0 < i && i < 1) result += i;
        }
        return result;
    }

    random() {
        let t = 0, r = Math.random();
        for (let i = this.min; i <= this.max; i++) {
            this.fenpei.has(i) ? t += this.fenpei.get(i) : t += this.baifenbi;
            if (t > r) return i;
        }
        return null;
    }
}
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.EditBox)
    chanceX: cc.EditBox = null
    @property(cc.EditBox)
    chanceY: cc.EditBox = null
    @property(cc.Node)
    panelNode: cc.Node = null
    @property(cc.Prefab)
    nodePrefab: cc.Prefab = null
    private X: number = null //x概率
    private Y:number = null //y概率
    private gl: GL = null   //概率计算对象
    private arr: number[][] = []    //数字数组
    private nodeArr: cc.Node[][] = []   //方格节点数组

    onLoad () {
        
    }

    start () {
        this.initNode()
    }
    //添加方格节点
    initNode() {
        for(let i = 0; i < 10; ++i) {
            this.nodeArr[i] = []
            for(let j = 0; j < 10; ++j) {
                let node = cc.instantiate(this.nodePrefab)
                node.setPosition(cc.v2(j*83 + 40, -i*83 - 40))
                this.panelNode.addChild(node)
                node.getChildByName('label').getComponent(cc.Label).string = ''
                this.nodeArr[i][j] = node
            }
        }
    }
    //生成新数组
    initArr() {
       for(let i = 0; i < 10; ++i) {
           this.arr[i] = []
            for(let j = 0; j < 10; ++j) {
                if(i == 0 && j == 0) {
                    this.arr[0][0] = Math.ceil(Math.random()*5)
                    this.nodeArr[0][0].getChildByName('label').getComponent(cc.Label).string = this.arr[0][0].toString()
                    this.nodeArr[0][0].getChildByName('bg').color = this.getColor(this.arr[0][0])
                    continue
                }
                let left = 0
                let up = 0
                if(j >= 1) {
                    left = this.arr[i][j-1]
                }
                if(i >= 1) {
                    up = this.arr[i-1][j]
                }
                this.arr[i][j] = this.createNum(left, up)
                this.nodeArr[i][j].getChildByName('label').getComponent(cc.Label).string = this.arr[i][j].toString()
                this.nodeArr[i][j].getChildByName('bg').color = this.getColor(this.arr[i][j])
            }
       }
       let str = ''
       for(let i = 0; i < 10; ++i){
           if(i > 0) {
                str += '\n'
           }
            for(let j = 0; j < 10; ++j) {
                str += this.arr[i][j]
            }
       }
       console.log(str)
    }
    //根据规则生成随机数
    //left(n-1, m)的数字   up(n, m-1)的数字
    createNum(left:number, up:number):number {
        let arr = []
        if(left == up) {
            arr = [[left, 0.2+this.Y]]
        }else {
            if(left) {
                arr.push([left, 0.2 + this.X])
            }
            if(up) {
                arr.push([up, 0.2 + this.X])
            }
        }

        this.gl =  new GL({
            min: 1, 
            max: 5,
            fenpei: new Map(arr)
        })
        
        return this.gl.random()
    }
    
    getColor(num: number) {
        switch(num) {
            case 1:
               return cc.color(255,0,0,255)
               break;
            case 2:
               return cc.color(0,255,0,255)
               break;
            case 3:
                return cc.color(0,0,255,255)
                break;
            case 4:
                return cc.color(255,255,0,255)
                break;
            case 5:
                return cc.color(255,0,255,255)
                break;
            default:
                return cc.color(255,255,255,255)
                break;
       } 
    }

    buttonCallback() {
        console.log('-click button-')
        this.X = parseInt(this.chanceX.string) / 100
        this.Y = parseInt(this.chanceY.string) / 100 
        this.initArr()
    }
    // update (dt) {}
}
