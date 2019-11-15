import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property(cc.Node)
    private node_test:cc.Node = null;
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private labaBoundingBox: cc.Node = null
    @property(sp.Skeleton)
    private laba: sp.Skeleton = null

    private type: number = 0
    private qTtype: number = 0
    private isOver: number = 0
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
               
                subject: [],
                answer: [],
                result: 4
            }
        ],
        result: 4
    }

    protected static className = "GamePanel";

    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[0].result = 2
            }
        })
        this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.laba.setAnimation(0, 'click', false)
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
        })
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
            this.type = DaAnData.getInstance().type
            this.qTtype = DaAnData.getInstance().qType
            this.setPanel()
        }else {
            this.getNet()
        }
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    setPanel() {

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

    onDestroy() {

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
                        this.type = content.type
                    }else {
                        console.error('网络请求数据type为空。') 
                    }
                    if(content.qType) {
                        this.qType = content.qType
                    }else {
                        console.error('网络请求数据qType为空。') 
                    }
                    this.setPanel();
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
