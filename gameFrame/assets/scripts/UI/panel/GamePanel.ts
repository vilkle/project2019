import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager"
import { AudioManager} from "../../Manager/AudioManager"
import {UIHelp} from "../../Utils/UIHelp";
import { NetWork } from "../../Http/NetWork";
import { ConstValue } from "../../Data/ConstValue";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";
import { Tools } from "../../UIComm/Tools";
import Set from "../../collections/Set";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    private audioArr : Array<number> = new Array<number>();
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }


    onLoad() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }else {

        }
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
       
        let a : string = 'bob';
        let b : number = 20;
        let str : string = `${a} is ${b} years old!`;
        cc.log(str);
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    stopAudioOnArr(audioID : number) {
        for(let i = 0; i < this.audioArr.length; i ++) {
            AudioManager.getInstance().stopAudio(this.audioArr[i]);
        }
        this.audioArr = [];
    }

    onDestroy() {
        AudioManager.getInstance().stopAll();
        
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
