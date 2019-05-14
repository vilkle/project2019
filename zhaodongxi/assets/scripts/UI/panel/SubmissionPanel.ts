import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import { NetWork } from "../../Http/NetWork";
import { LogWrap } from "../../Utils/LogWrap";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
 
const { ccclass, property } = cc._decorator;

@ccclass
export default class SubmissionPanel extends BaseUI {

    protected static className = "SubmissionPanel";
    start() {

    }

    onQueDingBtnClick(event) {
        this.DetectionNet();
    }

    onQuXiaoBtnClick(event){
        UIManager.getInstance().closeUI(SubmissionPanel);
    }

    //提交或者修改答案
    DetectionNet() {
       let data = JSON.stringify({ types: DaAnData.getInstance().types, checkpointsNum: DaAnData.getInstance().checkpointsNum, picArr: DaAnData.getInstance().picArr, range : DaAnData.getInstance().range});
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                response = JSON.parse(response);
                if (response.data.courseware_content == null) {
                    LogWrap.log(response.data);
                   this.AddNet(data);
                } else {
                    NetWork.courseware_id = response.data.courseware_id;
                    this.ModifyNet(data);
                    LogWrap.log("data modify===", data);
                }
            } else {
                UIManager.getInstance().closeUI(SubmissionPanel);
            }
        }.bind(this), null);
    }

    //添加答案信息
    AddNet(gameDataJson) {
        let data = { title_id: NetWork.title_id, courseware_content: gameDataJson };
        NetWork.getInstance().httpRequest(NetWork.ADD, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                // LogWrap.log(response);
                UIHelp.showTip("答案提交成功");
                UIManager.getInstance().closeUI(SubmissionPanel);
            }
        }.bind(this), JSON.stringify(data));
    }

    //修改课件
    ModifyNet(gameDataJson) {
        let jsonData = { courseware_id: NetWork.courseware_id, courseware_content: gameDataJson };
        cc.log("-------------------////");
        cc.log(jsonData);
        NetWork.getInstance().httpRequest(NetWork.MODIFY, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                // LogWrap.log(response);
                UIHelp.showTip("答案修改成功");
                UIManager.getInstance().closeUI(SubmissionPanel);
            }
        }.bind(this), JSON.stringify(jsonData));
    }
}
