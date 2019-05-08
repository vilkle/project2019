"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var DaAnData_1 = require("../../Data/DaAnData");
var NetWork_1 = require("../../Http/NetWork");
var ConstValue_1 = require("../../Data/ConstValue");
var UIManager_1 = require("../../Manager/UIManager");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePanel_1 = GamePanel;
    GamePanel.prototype.onLoad = function () {
        this.isTecher();
        this.initData();
    };
    GamePanel.prototype.start = function () {
        //    this.creatPicBoard();
        //    this.creatAnswerBoard();
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.update = function (dt) {
        if (this.isStart) {
            this.timer += dt;
            cc.log(dt);
        }
    };
    GamePanel.prototype.isTecher = function () {
        if (ConstValue_1.ConstValue.IS_TEACHER) {
        }
        else {
        }
    };
    GamePanel.prototype.initData = function () {
        this.timer = 0;
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = JSON.parse(response);
                if (response_data.data.courseware_content == null) {
                }
                else {
                    var data = JSON.parse(response_data.data.courseware_content);
                    if (data.number) {
                        DaAnData_1.DaAnData.getInstance().number = data.number;
                    }
                    if (data.checkpointsNum) {
                        DaAnData_1.DaAnData.getInstance().checkpointsNum = data.checkpointsNum;
                    }
                }
            }
        }.bind(this), null);
    };
    GamePanel.prototype.backButton = function () {
        UIManager_1.UIManager.getInstance().closeUI(GamePanel_1);
        ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 0 });
    };
    GamePanel.prototype.submitButton = function () {
        this.isStart = true;
        //UIManager.getInstance().openUI(SubmissionPanel);
    };
    var GamePanel_1;
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "back", void 0);
    __decorate([
        property(cc.Button)
    ], GamePanel.prototype, "submit", void 0);
    GamePanel = GamePanel_1 = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();