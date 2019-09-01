"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel');
// scripts/UI/panel/TeacherPanel.ts

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
var UIManager_1 = require("../../Manager/UIManager");
var SubmissionPanel_1 = require("./SubmissionPanel");
var NetWork_1 = require("../../Http/NetWork");
var UIHelp_1 = require("../../Utils/UIHelp");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // onLoad () {}
    TeacherPanel.prototype.start = function () {
        this.getNet();
    };
    TeacherPanel.prototype.setPanel = function () {
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        UIManager_1.UIManager.getInstance().showUI(SubmissionPanel_1.default);
    };
    TeacherPanel.prototype.getNet = function () {
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.GET_TITLE + "?title_id=" + NetWork_1.NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                var res = response;
                if (Array.isArray(res.data)) {
                    this.setPanel();
                    return;
                }
                var content = JSON.parse(res.data.courseware_content);
                NetWork_1.NetWork.courseware_id = res.data.courseware_id;
                if (NetWork_1.NetWork.empty) { //如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                }
                else {
                    if (content != null) {
                        this.setPanel();
                    }
                    else {
                        this.setPanel();
                    }
                }
            }
        }.bind(this), null);
    };
    //删除课件数据  一般为脏数据清理
    TeacherPanel.prototype.ClearNet = function () {
        var jsonData = { courseware_id: NetWork_1.NetWork.courseware_id };
        NetWork_1.NetWork.getInstance().httpRequest(NetWork_1.NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp_1.UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
    };
    TeacherPanel.className = "TeacherPanel";
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

cc._RF.pop();