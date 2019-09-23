import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
import GamePanel from "./GamePanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";
    @property([cc.Toggle])
    private toggleContainer: cc.Toggle[] = []
    @property(cc.EditBox)
    private judgeEditBox: cc.EditBox = null
    @property(cc.EditBox)
    private numEditBox: cc.EditBox = null
    @property(cc.Node)
    private eiditBoxNode: cc.Node = null
    @property(cc.Prefab)
    private editBoxPrefab: cc.Prefab = null
    private type: number = 1
    private judgeNum: number = null
    private num: number = 8
    private numArr: number[] = []
    private editBoxArr: cc.EditBox[] = []

    onLoad() {
        this.type = 1
        DaAnData.getInstance().type = 1
        this.num = 8
        DaAnData.getInstance().num = 8
        this.initEditBoxArr(8)
    }

    start() {
        this.getNet();
    }

    setPanel() {//设置教师端界面
        switch(this.type){
            case 1:
                this.toggleContainer[0].isChecked = true
                break
            case 2:
                this.toggleContainer[1].isChecked = true
                break
            case 3:
                this.toggleContainer[2].isChecked = true
                break
            case 4:
                this.toggleContainer[3].isChecked = true
                break
        }
        this.judgeEditBox.string = this.judgeNum.toString()
        this.numEditBox.string = this.num.toString()
       this.initEditBoxArr(this.num)
    }

    initEditBoxArr(num: number) {
        this.eiditBoxNode.removeAllChildren()
        this.editBoxArr = []
        for(let i = 0; i < num; ++i) {
            let node = cc.instantiate(this.editBoxPrefab)
            this.eiditBoxNode.addChild(node)
            this.editBoxArr[i] = node.getComponent(cc.EditBox)
            node.on('editing-did-ended', function(editbox){
                let str = editbox.string
                const rex = /^[0-9]{1,2}$/
                if(!rex.test(str)){
                    editbox.string = ''
                }
            }.bind(this))
        }
    }

    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle)
        switch(index){
            case 0:
                this.type = 1
                DaAnData.getInstance().type = 1
                break
            case 1:
                this.type = 2
                DaAnData.getInstance().type = 2
                break
            case 2:
                this.type = 3
                DaAnData.getInstance().type = 3
                break
            case 3:
                this.type = 4
                DaAnData.getInstance().type = 4
                break
        }
    }

    judgeEditBoxCallback(sender) {
        let str = this.judgeEditBox.string
        let num = parseInt(str)
        let rex = /^[0-9]{1,2}$/
        if(!rex.test(str)) {
            if(str = '') {
                num = null
                this.judgeEditBox.string = ''
                this.judgeEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = true
            }else {
                if(this.judgeNum != null) {
                    num = this.judgeNum
                    this.judgeEditBox.string = this.judgeNum.toString()
                    this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = false
                }
            }
        }
        this.judgeNum = num
        DaAnData.getInstance().judgeNum = this.judgeNum
    }

    numEditBoxCallback(sender) {
        let str = this.numEditBox.string
        let num = parseInt(str)
        let rex = /^[0-9]{1,2}$/
        if(!rex.test(str)) {
            if(str == '') {
                num = null
                this.numEditBox.string = ''
                this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = true
            }else {
                num = this.num
                this.numEditBox.string = this.num.toString()
                this.numEditBox.node.getChildByName('PLACEHOLDER_LABEL').active = false
            }
        }
        if(this.num != num) {
            this.initEditBoxArr(num)
        }
        this.num = num
        DaAnData.getInstance().num = this.num
    }

    check():boolean {
        if(this.judgeNum == null) {
            UIHelp.showTip('题干标准为空，请输入题干标准。')
            return false
        }
        if(this.num == null) {
            UIHelp.showTip('选数区域的数量为空，请输入选数区域数量。')
            return false
        }
       if(this.judgeNum > 30 || this.judgeNum < 0) {
            UIHelp.showTip('题干标准不是不大于30的整数，请重新输入题干标准')
            return false
       }
       if(this.num < 8 || this.num > 15) {
            UIHelp.showTip('选数区域数量不是8～15的整数，请重新输入选数区域数量')
            return false
       }
       this.numArr = []
       for(let i = 0; i < this.editBoxArr.length; ++i) {
           if(this.editBoxArr[i].string=='') {
                this.numArr[i] = null
           }else {
                this.numArr[i] = parseInt(this.editBoxArr[i].string)
           }
       }
       for(let i = 0; i < this.editBoxArr.length; ++i) {
            if(this.numArr[i] == null) {
                UIHelp.showTip(`请输入第一题第${i+1}个可选数。`)
                return false
            }
            if(this.numArr[i] < 0 || this.numArr[i] > 50) {
                UIHelp.showTip(`第一题第${i+1}个可选数不符合0～50的规则，请重新输入。`)
                return false
            }
       }
       DaAnData.getInstance().numArr = [...this.numArr]
       console.log(this.type)
       console.log(this.judgeNum)
       console.log(this.num)
       console.log(this.numArr)
       return true 
    }

    //上传课件按钮
    onBtnSaveClicked() {
        if(this.check()) {
            UIManager.getInstance().showUI(GamePanel);
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
                        if(content.type) {
                            this.type = content.type
                            DaAnData.getInstance().type = content.type
                        }else {
                            console.error('content.type is null')
                            return
                        }
                        if(content.judgeNum) {
                            this.judgeNum = content.judgeNum
                            DaAnData.getInstance().judgeNum = content.judgeNum
                        }else {
                            console.error('content.judgeNum is null')
                            return
                        }
                        if(content.num) {
                            this.num = content.num
                            DaAnData.getInstance().num = content.num
                        }else {
                            console.error('content.num is null')
                            return
                        }
                        if(content.numArr) {
                            this.numArr = content.numArr
                            DaAnData.getInstance().numArr = content.numArr
                        }else {
                            console.error('content.numArr is null')
                            return
                        }
                        this.setPanel();
                    } else {
                        return
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
