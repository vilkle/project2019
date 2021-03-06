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

    @property([cc.Toggle])
    private toggleContainer : cc.Toggle[] = [];
    @property(cc.Button)
    private button : cc.Button = null;
    private touchEnable: boolean = true;
    // onLoad () {}

    start() {
        DaAnData.getInstance().types = 1;
        this.getNet();
    }

    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                DaAnData.getInstance().types = 1;
                break;
            case 1:
                DaAnData.getInstance().types = 2;
                break;
            case 2:
                DaAnData.getInstance().types = 3;
                break;
        }
    }

    setPanel() {//设置教师端界面
        this.toggleContainer[DaAnData.getInstance().types-1].isChecked = true
    }

    //上传课件按钮
    onBtnSaveClicked() {
        UIManager.getInstance().showUI(GamePanel, null,() => {
            ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
            cc.log('------')
        });
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
                        if(content.types) {
                            DaAnData.getInstance().types = content.types
                        }else {
                            console.error('网络请求content.types的值为空')
                        }
                        this.setPanel();
                    } else {
                        console.error('网络请求数据出错')
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
