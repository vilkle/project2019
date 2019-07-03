import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData} from "../../Data/DaAnData"

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.Prefab)
    private autoOptionNode : cc.Prefab;
    @property(cc.Prefab)
    private manualOptionNode : cc.Prefab;
    @property(cc.Node)
    private content : cc.Node;
    @property(cc.Node)
    private buttonNode : cc.Node;
    @property(cc.Node)
    private pullNode : cc.Node;
    @property(cc.Button)
    private checkpointButton : cc.Button;

    // onLoad () {}

    start() {
        this.getNet();
        for(let i = 0; i < 3; i++) {
            let optionNode = cc.instantiate(this.autoOptionNode);
            this.content.addChild(optionNode);
        }
       
       this.buttonNode.zIndex = 100;
    }
    
    one() {
        DaAnData.getInstance().checkpointsNum = 1;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '1   关';
        this.pullUp();
    }

    two() {
        DaAnData.getInstance().checkpointsNum = 2;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '2   关';
        this.pullUp();
    }

    three() {
        DaAnData.getInstance().checkpointsNum = 3;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '3   关';
        this.pullUp();
    }

    four() {
        DaAnData.getInstance().checkpointsNum = 4;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '4   关';
        this.pullUp();
    }

    five() {
        DaAnData.getInstance().checkpointsNum = 5;
        this.checkpointButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = '5   关';
        this.pullUp();
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

    }

    setPanel() {//设置教师端界面

    }

    //上传课件按钮
    onBtnSaveClicked() {
        UIManager.getInstance().showUI(SubmissionPanel);
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
