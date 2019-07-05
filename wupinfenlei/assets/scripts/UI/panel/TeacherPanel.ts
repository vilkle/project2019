import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData} from "../../Data/DaAnData"
import Set from "../../collections/Set";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.Prefab)
    private autoOptionNode : cc.Prefab = null;
    @property(cc.Prefab)
    private manualOptionNode : cc.Prefab = null;
    @property(cc.Node)
    private content : cc.Node = null;
    @property(cc.Node)
    private buttonNode : cc.Node = null;
    @property(cc.Node)
    private pullNode : cc.Node = null;
    @property(cc.Node)
    private typeNode : cc.Node = null;
    @property(cc.Button)
    private checkpointButton : cc.Button = null;
    @property([cc.Toggle])
    private toggleContainer : cc.Toggle[] = [];
    @property([cc.Toggle])
    private typeToggleContainer : cc.Toggle[] = [];
    @property(cc.Label)
    private tipLabel : cc.Label = null;
    @property(cc.Node)
    private imageBoardNode : cc.Node = null;
    private tipNode : cc.Node = null;
    private typeArr : cc.Node[] = [];
    private typeDataArr : boolean[] = [];
    private toggleArr : cc.Toggle[] = [];
    private spriteArr : cc.Sprite[] = [];
    // onLoad () {}

    start() {
        this.getNet();
     
    }
    
    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                DaAnData.getInstance().types = 1;
                this.typeNode.active = false;
                this.updateTypes();
                break;
            case 1:
                DaAnData.getInstance().types = 2;
                this.typeNode.active = true;
                this.updateTypes();
                break;
            default:
                break;
        }
    }

    onTypeToggleContainer(toggle) {
        var index = this.typeToggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                DaAnData.getInstance().typetype = 1;
                this.updateTypes();
                break;
            case 1:
                DaAnData.getInstance().typetype = 2;
                this.updateTypes();
                break;
            default:
                break;
        }
    }
    

    one() {
        DaAnData.getInstance().checkpointsNum = 1;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '1   关';
        this.pullUp();
        this.updateTypes();
    }

    two() {
        DaAnData.getInstance().checkpointsNum = 2;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '2   关';
        this.pullUp();
        this.updateTypes();
    }

    three() {
        DaAnData.getInstance().checkpointsNum = 3;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '3   关';
        this.pullUp();
        this.updateTypes();
    }

    four() {
        DaAnData.getInstance().checkpointsNum = 4;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '4   关';
        this.pullUp();
        this.updateTypes();
    }

    five() {
        DaAnData.getInstance().checkpointsNum = 5;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '5   关';
        this.pullUp();
        this.updateTypes();
    }

    pullUp() {
        this.pullNode.runAction(cc.moveTo(0.1, cc.v2(0, 150)));
        this.checkpointButton.interactable = true;
        this.checkpointButton.node.getChildByName('layout').off(cc.Node.EventType.TOUCH_START);
    }

    pullDown() {
        this.pullNode.runAction(cc.moveBy(0.1, cc.v2(0, -150)));
        this.checkpointButton.interactable = false;
        this.checkpointButton.node.getChildByName('layout').on(cc.Node.EventType.TOUCH_START, (e)=>{
            e.stopPropagation();
            if(this.pullNode.getPosition() != cc.v2(0,150)) {
                this.pullNode.runAction(cc.moveTo(0.1, cc.v2(0, 150)));
                this.checkpointButton.interactable = true;
                this.checkpointButton.node.getChildByName('layout').off(cc.Node.EventType.TOUCH_START);
            }
        });
    }

    addImageBoard() {
        this.imageBoardNode = cc.instantiate(this.imageBoard);
        this.imageBoardNode.getChildByName('button').on('click', ()=>{
            this.removeImageBoard();
        });
        let imageArr = [...this.imageBoardNode.getChildByName('ScrollView').getChildByName('view').getChildByName('content').getChildByName('layout').children]
        let imageLenth = imageArr.length;
        for(let i = 0; i < imageLenth; i++) {
            imageArr[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(imageArr[i].scale == 1) {
                    imageArr
                }
            });
        }


        cc.director.getScene().getChildByName('Canvas').getChildByName('TeacherPanel').addChild(this.imageBoardNode);
        cc.log(cc.director.getScene());
        
    }

    removeImageBoard() {
        this.imageBoardNode.removeFromParent();
        this.imageBoardNode.destroy();
    }

    updateTypes() {
        for(let i = 0; i < this.typeArr.length; i++) {
            this.typeArr[i].destroy();
        }
        this.typeArr = [];
        let typeNum = DaAnData.getInstance().checkpointsNum;
        if(DaAnData.getInstance().types == 1) {
            for(let i = 0; i < typeNum; i++) {
                let optionNode = cc.instantiate(this.autoOptionNode);
                optionNode.getChildByName('title').getComponent(cc.Label).string = this.titleChange(i + 1);
                this.content.addChild(optionNode);
                this.typeArr.push(optionNode);
            } 
            //获取所有toggle
            this.toggleArr = [];
            for(let i = 0; i < typeNum; i++) {
                for(let j = 0; j < 5; j++) {
                    this.toggleArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                    this.toggleArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle);
                }
            }
            this.addToggleCallBack();
        }else if(DaAnData.getInstance().types == 2) {
            for(let i = 0; i < typeNum; i++) {
                let optionNode = cc.instantiate(this.manualOptionNode);
                optionNode.getChildByName('title').getComponent(cc.Label).string = this.titleChange(i + 1);
                optionNode.getChildByName('button').getComponent(cc.Button).node.on('click', ()=>{
                    cc.log(i);
                    this.addImageBoard();
                });
                this.content.addChild(optionNode);
                this.typeArr.push(optionNode);
            }
            //获取所有的sprite
            this.spriteArr = [];
            for(let i = 0; i < typeNum; i ++) {
                for(let j = 0;  j < 10; j++) {
                    this.spriteArr[i * 10 + j] = this.typeArr[i].children[j].getComponent(cc.Sprite);
                }
            }
            cc.log('---------spriteArr', this.spriteArr);
        }
        this.buttonNode.zIndex = 100;
    }

    addToggleCallBack() {
        for(let i = 0; i < this.toggleArr.length; i++) {
            this.toggleArr[i].node.on('toggle', ()=>{
                let checkPointNum = Math.floor(i/20);
                cc.log('checkpointN is ', checkPointNum);
                let alreadyCheck = 0;
                for(let j = 20 * checkPointNum; j < 20 * (checkPointNum + 1); j++){
                    if(this.toggleArr[j].isChecked) {
                        alreadyCheck++;
                    }
                }
                cc.log('alreadycheck is ', alreadyCheck);
                if(alreadyCheck > 10) {
                    this.toggleArr[i].isChecked = false;
                }
            });
        }
    }

    updateTypesData() {
        this.typeDataArr = [];
        for(let i = 0 ; i < this.typeArr.length; i++) {
            for(let j = 0; j < 5; j++) {
                this.typeDataArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                this.typeDataArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                this.typeDataArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                this.typeDataArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
            }
        }
        DaAnData.getInstance().typeDataArr = [...this.typeDataArr];
    }

    titleChange(index:number): string {
        let str : string;
        if(index == 1) {
            str = '第一关';
        }else if(index == 2) {
            str = '第二关';
        }else if(index == 3) {
            str = '第三关';
        }else if(index == 4) {
            str = '第四关';
        }else if(index == 5) {
            str = '第五关';
        }
        return str;
    }

    setPanel() {//设置教师端界面

    }

    //上传课件按钮
    onBtnSaveClicked() {
        this.updateTypesData();
        this.errorChecking();
        //UIManager.getInstance().showUI(SubmissionPanel);
    }

    tipButtonCallBack() {
        this.tipNode.active = false;
    }

    tip() {
        this.tipNode.active = true;
        this.tipNode.getChildByName('layout').on(cc.Node.EventType.TOUCH_START, (e)=>{
            e.stopPropagation();
        });
    }

    errorChecking():boolean {
        if(DaAnData.getInstance().checkpointsNum == 0) {
            this.tipLabel.string = '请填写关卡数量，不能为空。';
            this.tip();
            return false;
        }else if(DaAnData.getInstance().typeDataArr.length == 0) {
            this.tipLabel.string = '物品种类不能为空，请选择物品种类。';
            this.tip();
            return false;
        }
        let alreadyCheck = 0;
        let typeNum = 0;
        let typeSet = new Set();
        for(let i = 0; i < DaAnData.getInstance().checkpointsNum; i ++) {
            for(let j = 20 * i; j < 20 * (i + 1); j ++) {
                if(this.toggleArr[j].isChecked) {
                    alreadyCheck++;
                    typeSet.add(Math.floor(j/5));
                }
            }
            cc.log('type num is ', typeSet.size());
            if(alreadyCheck < 4) {
                this.tipLabel.string = this.titleChange(i + 1) + '选择物品不足四个，每关选择物品数至少四个，请继续选择物品。';
                this.tip();
                return false;
            }
            if(typeSet.size() <2) {
                this.tipLabel.string = this.titleChange(i + 1) + '选择物品种类不足两个，每关选择物品种类至少两个，请继续选择物品。';
                this.tip();
                return false;
            }
            alreadyCheck = 0;
            typeSet.clear();
        }
      
        return true;
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
