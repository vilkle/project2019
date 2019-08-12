(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/SubmissionPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bdbeagD9lJH1p1yPQBbNwPK', 'SubmissionPanel', __filename);
// scripts/UI/panel/SubmissionPanel.ts

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
var UIManager_1 = require("../../Manager/UIManager");
var NetWork_1 = require("../../Http/NetWork");
var UIHelp_1 = require("../../Utils/UIHelp");
var ConstValue_1 = require("../../Data/ConstValue");
var ErrorPanel_1 = require("./ErrorPanel");
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
        if (!NetWork_1.NetWork.title_id) {
            UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, 1000, null, function () {
                UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("titleId为空,请联系技术老师解决！\ntitleId=" + NetWork_1.NetWork.title_id, "", "", "确定");
            });
            return;
        }
        var data = JSON.stringify({ CoursewareKey: ConstValue_1.ConstValue.CoursewareKey,
            types: DaAnData_1.DaAnData.getInstance().types,
            typetype: DaAnData_1.DaAnData.getInstance().typetype,
            checkpointsNum: DaAnData_1.DaAnData.getInstance().checkpointsNum,
            typeDataArr: DaAnData_1.DaAnData.getInstance().typeDataArr
        });
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                if (response.data.courseware_content == null || response.data.courseware_content == "") {
                    this.AddNet(data);
                }
                else {
                    NetWork_1.NetWork.courseware_id = response.data.courseware_id;
                    var res = JSON.parse(response.data.courseware_content);
                    if (!NetWork_1.NetWork.empty) {
                        if (res.CoursewareKey == ConstValue_1.ConstValue.CoursewareKey) {
                            this.ModifyNet(data);
                        }
                        else {
                            UIManager_1.UIManager.getInstance().openUI(ErrorPanel_1.default, 1000, null, function () {
                                UIManager_1.UIManager.getInstance().getUI(ErrorPanel_1.default).setPanel("该titleId已被使用,请联系技术老师解决！\ntitleId=" + NetWork_1.NetWork.title_id, "", "", "确定");
                            });
                        }
                    }
                }
            }
        }.bind(this), null);
    };
    //添加答案信息
    SubmissionPanel.prototype.AddNet = function (gameDataJson) {
        var data = { title_id: NetWork_1.NetWork.title_id, courseware_content: gameDataJson, is_result: 1, is_lavel: 1 };
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.ADD, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp_1.UIHelp.showTip("答案提交成功");
                UIManager_1.UIManager.getInstance().closeUI(SubmissionPanel_1);
            }
        }.bind(this), JSON.stringify(data));
    };
    //修改课件
    SubmissionPanel.prototype.ModifyNet = function (gameDataJson) {
        var jsonData = { courseware_id: NetWork_1.NetWork.courseware_id, courseware_content: gameDataJson, is_result: 1, is_lavel: 0 };
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.MODIFY, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
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
        