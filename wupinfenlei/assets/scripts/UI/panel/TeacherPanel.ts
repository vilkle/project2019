import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData} from "../../Data/DaAnData";
import Set from "../../collections/Set";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.Prefab)
    private autoOptionNode : cc.Prefab = null;
    @property(cc.Prefab)
    private manualOptionNode : cc.Prefab = null;
    @property(cc.Prefab)
    private cookieNode : cc.Prefab = null;
    @property(cc.Prefab)
    private figureNode : cc.Prefab = null;
    @property(cc.Node)
    private content : cc.Node = null;
    @property(cc.Node)
    private buttonNode : cc.Node = null;
    @property(cc.Node)
    private pullNode : cc.Node = null;
    @property(cc.Button)
    private checkpointButton : cc.Button = null;
    @property([cc.Toggle])
    private toggleContainer : cc.Toggle[] = [];
    @property(cc.Label)
    private tipLabel : cc.Label = null;
    @property(cc.Node)
    private tipNode : cc.Node = null;
    private typeArr : cc.Node[] = [];
    private typeDataArr : boolean[] = [];
    private typetype : number[] = [];
    private toggleArr : cc.Toggle[] = [];
    private imageArr : cc.Sprite[] = [];
    private answer : number[] = [];
    // onLoad () {}

    start() {
        this.getNet();
    }
    
    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) { 
            case 0:
                DaAnData.getInstance().types = 1;
                DaAnData.getInstance().checkpointsNum = 0;
                this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '选择关卡数';
                this.content.getChildByName('label1').active = true;
                this.checkpointButton.node.active = true;
                this.updateTypes();
                break;
            case 1:
                this.typetype = [1];
                DaAnData.getInstance().typetype = this.typetype;
                DaAnData.getInstance().types = 2;
                DaAnData.getInstance().checkpointsNum = 1;
                this.content.getChildByName('label1').active = false;
                this.checkpointButton.node.active = false;
                this.updateTypes();
                break;
            default:
                break;
        }
    }

    onToggleCallBack(e) {
        let toggle = e;
        let index = this.typeArr.indexOf(toggle.node.parent.parent);
        let typeNum = DaAnData.getInstance().checkpointsNum;
        if(toggle.node.parent.children[0].getComponent(cc.Toggle).isChecked) {
            if(this.typetype[index] == 2) {
                this.typetype[index] = 1;
                this.typeArr[index].getChildByName('imageNode').getChildByName('Node').destroy();
                this.typeArr[index].getChildByName('imageNode').removeAllChildren();
                let optionNode = cc.instantiate(this.cookieNode);
                this.typeArr[index].getChildByName('imageNode').addChild(optionNode);  
            } 
        }else if(toggle.node.parent.children[1].getComponent(cc.Toggle).isChecked) {
            if(this.typetype[index] == 1) {
                this.typetype[index] = 2;
                this.typeArr[index].getChildByName('imageNode').getChildByName('Node').destroy();
                this.typeArr[index].getChildByName('imageNode').removeAllChildren();
                let optionNode = cc.instantiate(this.figureNode);
                this.typeArr[index].getChildByName('imageNode').addChild(optionNode);
            } 
        }
        DaAnData.getInstance().typetype = this.typetype;
        this.toggleArr = [];
        this.imageArr = [];
        for(let i = 0; i < typeNum; i ++) {
            for(let j = 0;  j < 27; j++) {
                this.toggleArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle);
                
            }
        }
        this.addToggleCallBack();
    }

    one() {
        DaAnData.getInstance().checkpointsNum = 1;
        this.typetype = [1];
        DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '1   关';
        this.pullUp();
        this.updateTypes();
    }

    two() {
        DaAnData.getInstance().checkpointsNum = 2;
        this.typetype = [1,1];
        DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '2   关';
        this.pullUp();
        this.updateTypes();
    }

    three() {
        DaAnData.getInstance().checkpointsNum = 3;
        this.typetype = [1,1,1];
        DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '3   关';
        this.pullUp();
        this.updateTypes();
    }

    four() {
        DaAnData.getInstance().checkpointsNum = 4;
        this.typetype = [1,1,1,1];
        DaAnData.getInstance().typetype = this.typetype;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '4   关';
        this.pullUp();
        this.updateTypes();
    }

    five() {
        DaAnData.getInstance().checkpointsNum = 5;
        this.typetype = [1,1,1,1,1];
        DaAnData.getInstance().typetype = this.typetype;
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
                    this.imageArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getComponent(cc.Sprite);
                    this.imageArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getComponent(cc.Sprite);
                }
            }
            this.addToggleCallBack();
        }else if(DaAnData.getInstance().types == 2) {
            for(let i = 0; i < typeNum; i++) {
                let optionNode = cc.instantiate(this.manualOptionNode);
                let cookieNode = cc.instantiate(this.cookieNode);
                optionNode.getChildByName('imageNode').addChild(cookieNode);
                optionNode.getChildByName('Types').getChildByName('toggle1').on('toggle', this.onToggleCallBack, this);
                optionNode.getChildByName('Types').getChildByName('toggle2').on('toggle', this.onToggleCallBack, this);
                //optionNode.getChildByName('title').getComponent(cc.Label).string = this.titleChange(i + 1);
                this.content.addChild(optionNode);
                this.typeArr.push(optionNode);
            }
            //获取所有的sprite
            this.toggleArr = [];
            for(let i = 0; i < typeNum; i ++) {
                for(let j = 0;  j < 27; j++) {
                    this.toggleArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle);
                    this.imageArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getComponent(cc.Sprite);
                }
            }
            this.addToggleCallBack();
        }
        this.buttonNode.zIndex = 100;
    }

    addToggleCallBack() {
        for(let i = 0; i < this.toggleArr.length; i++) {
            this.toggleArr[i].node.off('toggle');
        }
       
        for(let i = 0; i < this.toggleArr.length; i++) {
           
            this.toggleArr[i].node.on('toggle', (e)=>{
                var checkPointNum :number = 0;
                if(DaAnData.getInstance().types == 1) {
                    checkPointNum = Math.floor(i/20);
                }else if(DaAnData.getInstance().types == 2) {
                    checkPointNum = Math.floor(i/27);
                }
                let alreadyCheck = 0;
                let typeNum = 0;
                this.answer = [];
                if(DaAnData.getInstance().types == 1) {
                    for(let j = 20 * checkPointNum; j < 20 * (checkPointNum + 1); j++){
                        if(this.toggleArr[j].isChecked) {
                            alreadyCheck++;
                        }
                    }
                    typeNum = 20;
                }else if(DaAnData.getInstance().types == 2) {
                    for(let j = 27 * checkPointNum; j < 27 * (checkPointNum + 1); j++){
                        if(this.toggleArr[j].isChecked) {
                            alreadyCheck++;
                            this.answer.push(j);
                        }
                    }
                    typeNum = 27;
                }
                if(DaAnData.getInstance().types == 2) {
                    if(this.checkColor(checkPointNum+1)) {
                        this.toggleArr[i].isChecked = false;
                    }
                    if(this.checkFigure(checkPointNum+1)) {
                        this.toggleArr[i].isChecked = false;
                    }
                    if(this.checkSize(checkPointNum+1)) {
                        this.toggleArr[i].isChecked = false;
                    }
                }

                if(alreadyCheck > 10) {
                    this.toggleArr[i].isChecked = false;
                }
                console.log('-------', this.imageArr);
                if(alreadyCheck >= 10) {
                    for(let i = typeNum * checkPointNum; i < typeNum * (checkPointNum + 1); i++) {
                        if(this.toggleArr[i].isChecked == false) {
                            this.imageArr[i].setState(1);
                        }
                    }
                }else {
                    for(let i = typeNum * checkPointNum; i < typeNum * (checkPointNum + 1); i++) {
                        this.imageArr[i].setState(0);
                    }
                }
            });
        }
    }

    checkColor(checkpoint:number): boolean{
        let answer1 = 0;
        let answer2 = 0;
        let answer3 = 0;
        for(let i = 0; i < this.answer.length; i++) {
            if(this.answer[i] < (checkpoint - 1) * 27 + 9) {
                answer1++;
            }else if(this.answer[i] < (checkpoint -1)* 27 + 18 && this.answer[i] >= (checkpoint - 1) * 27 + 9) {
                answer2++;
            }else if(this.answer[i] < (checkpoint -1)* 27 + 27 && this.answer[i] >= (checkpoint -1)* 27 + 18) {
                answer3++;
            }
        }
        if(answer1>6) {
            this.tipLabel.string = '蓝色的物品选择超过6个，每种颜色的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer2>6) {
            this.tipLabel.string = '红色的物品选择超过6个，每种颜色的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer3>6) {
            this.tipLabel.string = '黄色的物品选择超过6个，每种颜色的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }
        return false;
    }

    checkFigure(checkpoint:number):boolean {
        let answer1 = 0;
        let answer2 = 0;
        let answer3 = 0;
        let standard1 = [0,1,2,9,10,11,18,19,20];
        let standard2 = [3,4,5,12,13,14,21,22,23];
        let standard3 = [6,7,8,15,16,17,24,25,26];
        for(let i = 0; i < this.answer.length; i++) {
           let index = this.answer[i] - (checkpoint - 1)*27;
            if(standard1.indexOf(index)!=-1) {
                answer1++;
            }else if(standard2.indexOf(index)!=-1) {
                answer2++;
            }else if(standard3.indexOf(index)!=-1) {
                answer3++;
            }
        }
        if(answer1>6) {
            this.tipLabel.string = '正方形的物品选择超过6个，每种形状的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer2>6) {
            this.tipLabel.string = '三角形的物品选择超过6个，每种形状的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer3>6) {
            this.tipLabel.string = '圆形的物品选择超过6个，每种形状的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }
        return false;
    }

    checkSize(checkpoint:number):boolean {
        let answer1 = 0;
        let answer2 = 0;
        let answer3 = 0;
        for(let i = 0; i < this.answer.length; i++) {
            if(this.answer[i]%3==0) {
                answer1++;
            }else if(this.answer[i]%3 == 1) {
                answer2++;
            }else if(this.answer[i]%3 == 2) {
                answer3++;
            }
        }
        if(answer1>6) {
            this.tipLabel.string = '大号的物品选择超过6个，每种大小的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer2>6) {
            this.tipLabel.string = '中号的物品选择超过6个，每种大小的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }else if(answer3>6) {
            this.tipLabel.string = '小号的物品选择超过6个，每种大小的物品选择数量不能超过6个，请重新选择。';
            this.tip();
            return true;
        }
        return false;
    }

    updateTypesData() {
        this.typeDataArr = [];
        if(DaAnData.getInstance().types == 1) {
            for(let i = 0 ; i < this.typeArr.length; i++) {
                for(let j = 0; j < 5; j++) {
                    this.typeDataArr[i * 20 + j] = this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 5 + j] = this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 10 + j] = this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                    this.typeDataArr[i * 20 + 15 + j] = this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked;
                }
            }
        }else if(DaAnData.getInstance().types == 2) {
            for(let i = 0; i < this.typeArr.length; i++) {
                for(let j = 0; j < 27; j++) {
                    this.typeDataArr[i * 27 + j] = this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle).isChecked;
                }
            }
        }
        DaAnData.getInstance().typeDataArr = [...this.typeDataArr];
    }

    titleChange(index:number): string {
        let str : string;
        if(index == 1) {
            str = '第一关：';
        }else if(index == 2) {
            str = '第二关：';
        }else if(index == 3) {
            str = '第三关：';
        }else if(index == 4) {
            str = '第四关：';
        }else if(index == 5) {
            str = '第五关：';
        }
        return str;
    }

    setPanel() {//设置教师端界面
        this.updateTypes();
        if(DaAnData.getInstance().types == 1) {
            this.toggleContainer[0].isChecked = true;
            this.typeDataArr = [...DaAnData.getInstance().typeDataArr]
            for(let i = 0; i < this.typeArr.length; i++) {
                for(let j = 0; j < 5; j ++) {
                    for(let j = 0; j < 5; j++) {
                        this.typeArr[i].getChildByName('label1').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + j];
                        this.typeArr[i].getChildByName('label2').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 5 + j];
                        this.typeArr[i].getChildByName('label3').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 10 + j];
                        this.typeArr[i].getChildByName('label4').children[j].getChildByName('New Toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 20 + 15 + j];
                    }
                }
            }
        }else if(DaAnData.getInstance().types == 2){
            this.toggleContainer[1].isChecked = true;
            this.typetype = DaAnData.getInstance().typetype;
            for(let i = 0; i < this.typeArr.length; i++) {
                if(this.typetype[i] == 1) {
                    this.typeArr[i].getChildByName('Types').getChildByName('toggle1').getComponent(cc.Toggle).isChecked = true;
                }else if(this.typetype[i] == 2) {
                    this.typeArr[i].getChildByName('Types').getChildByName('toggle2').getComponent(cc.Toggle).isChecked = true;
                }
            }
            this.typeDataArr = [...DaAnData.getInstance().typeDataArr]
            for(let i = 0; i < this.typeArr.length; i++) {
                for(let j = 0; j < 27; j++) {
                    this.typeArr[i].getChildByName('imageNode').getChildByName('Node').children[j].getChildByName('toggle').getComponent(cc.Toggle).isChecked = this.typeDataArr[i * 27 + j];
                }
            }
        }
        this.addToggleCallBack();
        if(DaAnData.getInstance().checkpointsNum != 0) {
            this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = DaAnData.getInstance().checkpointsNum.toString() +'   关';
        }
    }

    //上传课件按钮
    onBtnSaveClicked() {
        this.updateTypesData();
        if(this.errorChecking()) {
            UIManager.getInstance().showUI(GamePanel, () => {
                ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
            });
        }
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
        if(DaAnData.getInstance().types == 1) {
            let typeSet = new Set();
            for(let i = 0; i < DaAnData.getInstance().checkpointsNum; i ++) {
                for(let j = 20 * i; j < 20 * (i + 1); j ++) {
                    if(this.toggleArr[j].isChecked) {
                        alreadyCheck++;
                        typeSet.add(Math.floor(j/5));
                    }
                }
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
        }else if(DaAnData.getInstance().types == 2) {
            for(let i = 0; i < DaAnData.getInstance().checkpointsNum; i++) {
                for(let j = 27 * i; j < 27 * (i + 1); j ++) {
                    if(this.toggleArr[j].isChecked) {
                        alreadyCheck++;
                    }
                }
                if(alreadyCheck < 4) {
                    this.tipLabel.string = this.titleChange(i + 1) + '选择物品不足四个，每关选择物品数至少四个，请继续选择物品。';
                    this.tip();
                    return false;
                }
                if(alreadyCheck > 10) {
                    let num = alreadyCheck - 10;
                    this.tipLabel.string = this.titleChange(i + 1) + `选择${alreadyCheck}个物品超过十个，每关选择物品数最多十个，请删除${num}个物品。`;
                    this.tip();
                    return false;
                }
                alreadyCheck = 0;
            }
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
                    if(content != null) {
                        if(content.types) {
                            DaAnData.getInstance().types = content.types;
                        }else{
                            console.log('getNet中返回的types的值为空');
                        }
                        if(content.typetype) {
                            DaAnData.getInstance().typetype = content.typetype;
                            cc.log(DaAnData.getInstance().typetype);
                        }else{
                            console.log('getNet中返回的typetype的值为空');
                        }
                        if(content.checkpointsNum){
                            DaAnData.getInstance().checkpointsNum = content.checkpointsNum;
                            cc.log(content.checkpointsNum);
                        }else{
                            console.log('getNet中返回的checkpointsNum的值为空');
                        }
                        if(content.typeDataArr) {
                            DaAnData.getInstance().typeDataArr = content.typeDataArr;
                        }else{
                            console.log('getNet中返回的typeDataArr的值为空');
                        }
                        this.setPanel();
                    }else {
                        console.log('getNet中返回的content是null');
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
