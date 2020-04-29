"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel');
// scripts/UI/panel/GamePanel.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var NetWork_1 = require("../../Http/NetWork");
var DataReporting_1 = require("../../Data/DataReporting");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.node_test = null;
        _this.isOver = 0;
        _this.checkpointNum = 0;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 1,
            levelData: [],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.onLoad = function () {
    };
    GamePanel.prototype.start = function () {
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    };
    GamePanel.prototype.setPanel = function () {
    };
    GamePanel.prototype.addData = function () {
        for (var i = 0; i < this.checkpointNum; i++) {
            this.eventvalue.levelData.push({
                answer: null,
                subject: null,
                result: 4
            });
        }
    };
    GamePanel.prototype.onEndGame = function () {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting_1.default.isRepeatReport) {
            DataReporting_1.default.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting_1.default.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.onShow = function () {
    };
    GamePanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + NetWork_1.NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                var response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                var content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    this.setPanel();
                }
            }
            else {
                this.setPanel();
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    __decorate([
        property(cc.Node)
    ], GamePanel.prototype, "node_test", void 0);
    GamePanel = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();