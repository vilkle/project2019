(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/TeacherPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '70c27EBmWdPJYtgMQ9dyPZS', 'TeacherPanel', __filename);
// scripts/UI/panel/TeacherPanel.ts

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
var DaAnData_1 = require("../../Data/DaAnData");
var GamePanel_1 = require("./GamePanel");
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var ItemType_1 = require("../../Data/ItemType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TeacherPanel = /** @class */ (function (_super) {
    __extends(TeacherPanel, _super);
    function TeacherPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeToggleContainer = [];
        _this.figureToggleContainer = [];
        _this.ruleNode = null;
        _this.subjectNode = null;
        _this.singlePrefab = null;
        _this.treePrefab = null;
        _this.triangleBlack = null;
        _this.triangleYellow = null;
        _this.triangleGreen = null;
        _this.sexangleBlack = null;
        _this.sexangleOrange = null;
        _this.sexanglePurple = null;
        _this.octagonBlack = null;
        _this.octagonGreen = null;
        _this.octagonYellow = null;
        _this.ruleItemArr = [];
        _this.subjectItemArr = [];
        _this.ruleDataArr = [];
        _this.subjectDataArr = [];
        _this.currentType = 1;
        _this.currentFigure = 2;
        return _this;
    }
    // onLoad () {}
    TeacherPanel.prototype.start = function () {
        DaAnData_1.DaAnData.getInstance().type = 1;
        DaAnData_1.DaAnData.getInstance().figure = 1;
        this.getNet();
    };
    TeacherPanel.prototype.setPanel = function () {
        this.typeToggleContainer[DaAnData_1.DaAnData.getInstance().type - 1].isChecked = true;
        this.figureToggleContainer[DaAnData_1.DaAnData.getInstance().figure - 1].isChecked = true;
        this.initType();
        this.initFigure();
        this.getItem();
    };
    /**
    * 获取itemtype值
    * @param i
    * @param j
    * @param type 1、rule下节点 2、subject下节点
    * @param isClick 是否被点击
    */
    TeacherPanel.prototype.getItemData = function (i, j, type, isClick) {
        if (type == 1) {
            if (DaAnData_1.DaAnData.getInstance().figure == 1) {
                if (j % 2 == 0) {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.triangle_black;
                    }
                }
                else {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.arrow_black;
                    }
                }
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
                if (j % 2 == 0) {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.sexangle_black;
                    }
                }
                else {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.arrow_black;
                    }
                }
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
                if (j % 2 == 0) {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.octagon_black;
                    }
                }
                else {
                    if (this.ruleDataArr[i][j] = null) {
                        this.ruleDataArr[i][j] = ItemType_1.ItemType.arrow_black;
                    }
                }
            }
        }
        else if (type == 2) {
        }
        return this.nextType(this.ruleDataArr[i][j], isClick);
    };
    TeacherPanel.prototype.nextType = function (type, isClick) {
        if (isClick) {
            var highNum = Math.floor(type / 3) * 3 + 3;
            var lowNum = highNum - 2;
            var next = type + 1;
            if (next > highNum) {
                next = lowNum;
            }
            return next;
        }
        else {
            return type;
        }
    };
    TeacherPanel.prototype.getItem = function () {
        this.ruleItemArr = [];
        this.subjectItemArr = [];
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.ruleItemArr[i] = [];
                this.ruleDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.ruleItemArr[i][j] = nodeArr[i].children[j];
                    this.ruleDataArr[i][j] =
                    ;
                }
            }
        }
        if (this.subjectNode.children[0]) {
            var nodeArr = this.subjectNode.children[0].children;
            for (var i = 0; i < nodeArr.length; ++i) {
                this.subjectItemArr[i] = [];
                this.subjectDataArr[i] = [];
                for (var j = 0; j < nodeArr[i].children.length; ++j) {
                    this.subjectItemArr[i][j] = nodeArr[i].children[j];
                }
            }
        }
        console.log(this.ruleItemArr);
        console.log(this.subjectItemArr);
    };
    TeacherPanel.prototype.initType = function () {
        if (DaAnData_1.DaAnData.getInstance().type != this.currentType) {
            if (this.subjectNode.children[0]) {
                this.subjectNode.children[0].destroy();
                this.subjectNode.removeAllChildren();
            }
            var node = null;
            if (DaAnData_1.DaAnData.getInstance().type == 1) {
                node = cc.instantiate(this.treePrefab);
                this.currentType = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().type == 2) {
                node = cc.instantiate(this.singlePrefab);
                this.currentType = 2;
            }
            this.subjectNode.addChild(node);
            this.getItem();
            this.currentFigure = 2;
        }
    };
    TeacherPanel.prototype.initFigure = function () {
        if (this.currentFigure != DaAnData_1.DaAnData.getInstance().figure) {
            if (DaAnData_1.DaAnData.getInstance().figure == 1) {
                this.changeFigure(this.triangleBlack);
                this.currentFigure = 1;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 2) {
                this.changeFigure(this.sexangleBlack);
                this.currentFigure = 2;
            }
            else if (DaAnData_1.DaAnData.getInstance().figure == 3) {
                this.changeFigure(this.octagonBlack);
                this.currentFigure = 3;
            }
        }
    };
    TeacherPanel.prototype.changeFigure = function (frame) {
        if (this.ruleNode.children[0]) {
            var nodeArr = this.ruleNode.children[0].children;
            for (var i = 0; i < nodeArr.length; i++) {
                for (var j = 0; j < nodeArr[i].children.length; j++) {
                    if (j % 2 == 0) {
                        nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                    }
                }
            }
        }
        if (this.subjectNode.children[0]) {
            var nodeArr = this.subjectNode.children[0].children;
            if (DaAnData_1.DaAnData.getInstance().type == 1) {
                for (var i = 0; i < nodeArr.length; i++) {
                    if (i % 2 == 0) {
                        for (var j = 0; j < nodeArr[i].children.length; j++) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                        }
                    }
                }
            }
            else if (DaAnData_1.DaAnData.getInstance().type == 2) {
                for (var i = 0; i < nodeArr.length; i++) {
                    for (var j = 0; j < nodeArr[i].children.length; j++) {
                        if (j % 2 == 0) {
                            nodeArr[i].children[j].getChildByName('blank').getComponent(cc.Sprite).spriteFrame = frame;
                        }
                    }
                }
            }
        }
    };
    TeacherPanel.prototype.onTypeToggle = function (toggle) {
        var index = this.typeToggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                DaAnData_1.DaAnData.getInstance().type = 1;
                this.initType();
                this.initFigure();
                break;
            case 1:
                DaAnData_1.DaAnData.getInstance().type = 2;
                this.initType();
                this.initFigure();
                break;
            default:
                console.error("the " + index + " type toggle have error.");
                break;
        }
    };
    TeacherPanel.prototype.onFigureToggle = function (toggle) {
        var index = this.figureToggleContainer.indexOf(toggle);
        switch (index) {
            case 0:
                DaAnData_1.DaAnData.getInstance().figure = 1;
                this.initFigure();
                break;
            case 1:
                DaAnData_1.DaAnData.getInstance().figure = 2;
                this.initFigure();
                break;
            case 2:
                DaAnData_1.DaAnData.getInstance().figure = 3;
                this.initFigure();
                break;
            default:
                console.error("the " + index + " figure toggle have error.");
                break;
        }
    };
    //上传课件按钮
    TeacherPanel.prototype.onBtnSaveClicked = function () {
        UIManager_1.UIManager.getInstance().showUI(GamePanel_1.default, function () {
            ListenerManager_1.ListenerManager.getInstance().trigger(ListenerType_1.ListenerType.OnEditStateSwitching, { state: 1 });
        });
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
                        if (content.type) {
                            DaAnData_1.DaAnData.getInstance().type = content.type;
                        }
                        else {
                            console.error('网络请求数据content.type为空');
                        }
                        if (content.figure) {
                            DaAnData_1.DaAnData.getInstance().figure = content.figure;
                        }
                        else {
                            console.error('网络请求数据content.figure为空');
                        }
                        this.setPanel();
                    }
                    else {
                        this.setPanel();
                        console.error('网络请求数据失败');
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
    __decorate([
        property([cc.Toggle])
    ], TeacherPanel.prototype, "typeToggleContainer", void 0);
    __decorate([
        property([cc.Toggle])
    ], TeacherPanel.prototype, "figureToggleContainer", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "ruleNode", void 0);
    __decorate([
        property(cc.Node)
    ], TeacherPanel.prototype, "subjectNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "singlePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], TeacherPanel.prototype, "treePrefab", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleYellow", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "triangleGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexangleBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexangleOrange", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "sexanglePurple", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonBlack", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonGreen", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], TeacherPanel.prototype, "octagonYellow", void 0);
    TeacherPanel = __decorate([
        ccclass
    ], TeacherPanel);
    return TeacherPanel;
}(BaseUI_1.BaseUI));
exports.default = TeacherPanel;

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
        //# sourceMappingURL=TeacherPanel.js.map
        