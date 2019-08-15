import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import {UIHelp} from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { AudioManager } from "../../Manager/AudioManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    private type: number = 0;
    private figure: number = 0;
    private overState: number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [

        ],
        result: 4
    }
    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        if(ConstValue.IS_TEACHER) {
            this.type = DaAnData.getInstance().type
            this.figure = DaAnData.getInstance().figure
            this.initGame()
            UIManager.getInstance().openUI(UploadAndReturnPanel)
        }else {
            this.getNet()
        }
    }

    initGame() {

    }

    initType() {

    }

    initFigure() {
        
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
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.overState });
    }

    onDestroy() {

    }

    onShow() {
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
                    if(content.type) {
                        DaAnData.getInstance().type = content.type
                        this.type = content.type
                    }else {
                        console.error('网络请求数据content.type为空')
                        return
                    }
                    if(content.figure) {
                        DaAnData.getInstance().figure = content.figure
                        this.figure = content.figure
                    }else {
                        console.error('网络请求数据content.figure为空')
                        return
                    }
                    this.initGame()
                }
            } else {
               console.error('网络请求数据失败')
            }
        }.bind(this), null);
    }
}
