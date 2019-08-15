(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/GamePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '246c2OOkGlKHoa6ZJOVEHI+', 'GamePanel', __filename);
// scripts/UI/panel/GamePanel.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var ConstValue_1 = require("../../Data/ConstValue");
var DaAnData_1 = require("../../Data/DaAnData");
var UIManager_1 = require("../../Manager/UIManager");
var UploadAndReturnPanel_1 = require("./UploadAndReturnPanel");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GamePanel = /** @class */ (function (_super) {
    __extends(GamePanel, _super);
    function GamePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 0;
        _this.figure = 0;
        _this.overState = 0;
        _this.eventvalue = {
            isResult: 1,
            isLevel: 0,
            levelData: [],
            result: 4
        };
        return _this;
    }
    GamePanel.prototype.start = function () {
        DataReporting_1.default.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        if (ConstValue_1.ConstValue.IS_TEACHER) {
            this.type = DaAnData_1.DaAnData.getInstance().type;
            this.figure = DaAnData_1.DaAnData.getInstance().figure;
            UIManager_1.UIManager.getInstance().openUI(UploadAndReturnPanel_1.default);
        }
        else {
            this.getNet();
        }
    };
    GamePanel.prototype.initGame = function () {
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
        DataReporting_1.default.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.overState });
    };
    GamePanel.prototype.onDestroy = function () {
    };
    GamePanel.prototype.onShow = function () {
    };
    GamePanel.prototype.setPanel = function () {
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
                    if (content.type) {
                        DaAnData_1.DaAnData.getInstance().type = content.type;
                        this.type = content.type;
                    }
                    else {
                        console.error('网络请求数据content.type为空');
                        return;
                    }
                    if (content.figure) {
                        DaAnData_1.DaAnData.getInstance().figure = content.figure;
                        this.figure = content.figure;
                    }
                    else {
                        console.error('网络请求数据content.figure为空');
                        return;
                    }
                    this.setPanel();
                }
            }
            else {
                console.error('网络请求数据失败');
            }
        }.bind(this), null);
    };
    GamePanel.className = "GamePanel";
    GamePanel = __decorate([
        ccclass
    ], GamePanel);
    return GamePanel;
}(BaseUI_1.BaseUI));
exports.default = GamePanel;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GamePanel.js.map
        