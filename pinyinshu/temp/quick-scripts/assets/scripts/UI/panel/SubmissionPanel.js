(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/SubmissionPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bdbeagD9lJH1p1yPQBbNwPK', 'SubmissionPanel', __filename);
// scripts/UI/panel/SubmissionPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var LogWrap_1 = require("../../Utils/LogWrap");
var UIHelp_1 = require("../../Utils/UIHelp");
var DaAnData_1 = require("../../Data/DaAnData");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SubmissionPanel = /** @class */ (function (_super) {
    __extends(SubmissionPanel, _super);
    function SubmissionPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubmissionPanel_1 = SubmissionPanel;
    SubmissionPanel.prototype.start = function () {
    };
    SubmissionPanel.prototype.onQueDingBtnClick = function (event) {
        this.DetectionNet();
    };
    SubmissionPanel.prototype.onQuXiaoBtnClick = function (event) {
        UIManager_1.UIManager.getInstance().closeUI(SubmissionPanel_1);
    };
    //提交或者修改答案
    SubmissionPanel.prototype.DetectionNet = function () {
        var data = JSON.stringify({ numberArr: DaAnData_1.DaAnData.getInstance().numberArr, checkpointsNum: DaAnData_1.DaAnData.getInstance().checkpointsNum });
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                response = JSON.parse(response);
                if (response.data.courseware_content == null) {
                    LogWrap_1.LogWrap.log(response.data);
                    this.AddNet(data);
                }
                else {
                    NetWork_1.NetWork.courseware_id = response.data.courseware_id;
                    this.ModifyNet(data);
                    LogWrap_1.LogWrap.log("data modify===", data);
                }
            }
            else {
                UIManager_1.UIManager.getInstance().closeUI(SubmissionPanel_1);
            }
        }.bind(this), null);
    };
    //添加答案信息
    SubmissionPanel.prototype.AddNet = function (gameDataJson) {
        var data = { title_id: NetWork_1.NetWork.title_id, courseware_content: gameDataJson };
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.ADD, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                // LogWrap.log(response);
                UIHelp_1.UIHelp.showTip("答案提交成功");
                UIManager_1.UIManager.getInstance().closeUI(SubmissionPanel_1);
            }
        }.bind(this), JSON.stringify(data));
    };
    //修改课件
    SubmissionPanel.prototype.ModifyNet = function (gameDataJson) {
        var jsonData = { courseware_id: NetWork_1.NetWork.courseware_id, courseware_content: gameDataJson };
        cc.log("-------------------////");
        cc.log(jsonData);
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.MODIFY, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                // LogWrap.log(response);
                UIHelp_1.UIHelp.showTip("答案修改成功");
                UIManager_1.UIManager.getInstance().closeUI(SubmissionPanel_1);
            }
        }.bind(this), JSON.stringify(jsonData));
    };
    var SubmissionPanel_1;
    SubmissionPanel.className = "SubmissionPanel";
    SubmissionPanel = SubmissionPanel_1 = __decorate([
        ccclass
    ], SubmissionPanel);
    return SubmissionPanel;
}(BaseUI_1.BaseUI));
exports.default = SubmissionPanel;

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
        //# sourceMappingURL=SubmissionPanel.js.map
        