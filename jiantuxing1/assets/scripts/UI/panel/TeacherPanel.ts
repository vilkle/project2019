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
    private toggleArr1: cc.Toggle[] = []
    @property([cc.Toggle])
    private toggleArr2: cc.Toggle[] = []
   private figureType: number = 0
   private figureLevel: number[] = []

    onLoad () {
        
    }

    start() {
        this.getNet();
    }

    setPanel() {//设置教师端界面
        if(this.figureType == 0) {
            this.toggleArr1[0].isChecked = true
        }else if(this.figureType == 1) {
            this.toggleArr1[1].isChecked = true
        }

        for(let i = 0; i < this.figureLevel.length; ++i) {
            this.toggleArr2[this.figureLevel[i]].isChecked = true
        }

    }

    onToggleCallback1(toggle) {
        let index = this.toggleArr1.indexOf(toggle)
        switch(index){
            case 0:
                this.figureType = 0
                this.toggleArr2[2].isChecked = false
                this.toggleArr2[3].isChecked = false
                this.toggleArr2[4].isChecked = false
                if(this.figureLevel.indexOf(2) != -1) {
                    this.figureLevel.splice(this.figureLevel.indexOf(2), 1)
                }
                if(this.figureLevel.indexOf(3) != -1) {
                    this.figureLevel.splice(this.figureLevel.indexOf(3), 1)
                }
                if(this.figureLevel.indexOf(4) != -1) {
                    this.figureLevel.splice(this.figureLevel.indexOf(4), 1)
                }
                break
            case 1:
                this.figureType = 1
                this.toggleArr2[0].isChecked = false
                this.toggleArr2[1].isChecked = false
                if(this.figureLevel.indexOf(0) != -1) {
                    this.figureLevel.splice(this.figureLevel.indexOf(0), 1)
                }
                if(this.figureLevel.indexOf(1) != -1) {
                    this.figureLevel.splice(this.figureLevel.indexOf(1), 1)
                }
                break
            default:
                break
        } 
    }

    toggleCallback(toggle) {
        let index = this.toggleArr2.indexOf(toggle)
        if(index == 0) {
            if(this.figureType == 1) {
                toggle.isChecked = false
                return
            }
            if(toggle.isChecked) {
                if(this.figureLevel.indexOf(0) == -1) {
                    this.figureLevel.push(0)
                }
            }else {
                if(this.figureLevel.indexOf(0) != -1) {
                    let pos = this.figureLevel.indexOf(0)
                    this.figureLevel.splice(pos, 1)
                }
            }
        }else if(index == 1) {
            if(this.figureType == 1) {
                toggle.isChecked = false
                return
            }
            if(toggle.isChecked) {
                if(this.figureLevel.indexOf(1) == -1) {
                    this.figureLevel.push(1)
                }
            }else {
                if(this.figureLevel.indexOf(1) != -1) {
                    let pos = this.figureLevel.indexOf(1)
                    this.figureLevel.splice(pos, 1)
                }
            }
        }else if(index == 2) {
            if(this.figureType == 0) {
                toggle.isChecked = false
                return
            }
            if(toggle.isChecked) {
                if(this.figureLevel.indexOf(2) == -1) {
                    this.figureLevel.push(2)
                }
            }else {
                if(this.figureLevel.indexOf(2) != -1) {
                    let pos = this.figureLevel.indexOf(2)
                    this.figureLevel.splice(pos, 1)
                }
            }
        }else if(index == 3) {
            if(this.figureType == 0) {
                toggle.isChecked = false
                return
            }
            if(toggle.isChecked) {
                if(this.figureLevel.indexOf(3) == -1) {
                    this.figureLevel.push(3)
                }
            }else {
                if(this.figureLevel.indexOf(3) != -1) {
                    let pos = this.figureLevel.indexOf(3)
                    this.figureLevel.splice(pos, 1)
                }
            }
        }else if(index == 4) {
            if(this.figureType == 0) {
                toggle.isChecked = false
                return
            }
            if(toggle.isChecked) {
                if(this.figureLevel.indexOf(4) == -1) {
                    this.figureLevel.push(4)
                }
            }else {
                if(this.figureLevel.indexOf(4) != -1) {
                    let pos = this.figureLevel.indexOf(4)
                    this.figureLevel.splice(pos, 1)
                }
            }
        }
    }

    sortNumber(a,b)
    {
        return a - b
    }

  
    //上传课件按钮
    onBtnSaveClicked() {
       
        if(this.figureLevel.length == 0) {
            UIHelp.showTip('未编辑完题目，请勾选完提交')
            return
        }
        this.figureLevel.sort(this.sortNumber)
        DaAnData.getInstance().figureLevel = this.figureLevel
        DaAnData.getInstance().figureType = this.figureType
        console.log(DaAnData.getInstance().figureType)
        console.log(DaAnData.getInstance().figureLevel)

        UIManager.getInstance().showUI(GamePanel, null,() => {
            ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
        });
    }


    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    //console.error('There is a error on getNet.')
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null) {
                        this.figureType = null
                        this.figureType = content.figureType
                        if(this.figureType != null) {
                            
                       }else {
                           console.error('figureType wrong at getNet')
                       }
                       if(content.figureLevel) {
                            this.figureLevel = content.figureLevel
                        }else {
                            console.error('figureLevel wrong at getNet')
                        }
                  
                        this.setPanel()
                    } else {
                        
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
