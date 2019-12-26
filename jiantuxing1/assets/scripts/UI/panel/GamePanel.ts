import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { OverTips } from "../Item/OverTips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Sprite)
    private figure: cc.Sprite = null
    @property(cc.SpriteFrame)
    private quadrangle: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sexangle: cc.SpriteFrame = null
    private figureType: number = null
    private figureLevel: number[] = null
    private levelNum: number = 0
    private isOver: number = 4
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [
           
        ],
        result: 4
    }

    protected static className = "GamePanel";

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            this.figureType = DaAnData.getInstance().figureType
            this.figureLevel = DaAnData.getInstance().figureLevel
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
        }else {
            this.getNet()
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.levelNum].result = 2;
            }
        })
       
        this.addData(6)
    }

    start() {

    }

    setPanel() {
        if(this.figureType == 0) {
            this.figure.spriteFrame = this.quadrangle
        }else if(this.figureType == 1) {
            this.figure.spriteFrame = this.sexangle
        }

    }

    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: null,
                subject: null,
                result: 4
            })
        }
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
                    if(content.figureType) {
                        this.figureType = content.figureType
                   }else {
                       console.error('figureType wrong at getNet')
                   }
                   if(content.figureLevel) {
                        this.figureLevel = content.figureLevel
                    }else {
                        console.error('figureLevel wrong at getNet')
                    }
              
                    this.setPanel()
                }
            } else {
                
            }
        }.bind(this), null);
    }
}
