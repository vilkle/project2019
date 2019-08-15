(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/TitleNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b276fOW8MRNTqj/bpy0hngz', 'TitleNode', __filename);
// scripts/UI/panel/TitleNode.ts

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
var ListenerManager_1 = require("../../Manager/ListenerManager");
var ListenerType_1 = require("../../Data/ListenerType");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bianJiLabel = null;
        _this.jianYanLabel = null;
        _this.tiaoNode = null;
        _this.heiSe = cc.color(0, 0, 0);
        _this.huiSe = cc.color(127, 127, 127);
        return _this;
    }
    NewClass.prototype.start = function () {
        this.bianJiLabel.node.color = this.heiSe;
        this.jianYanLabel.node.color = this.huiSe;
        this.tiaoNode.color = this.huiSe;
        ListenerManager_1.ListenerManager.getInstance().add(ListenerType_1.ListenerType.OnEditStateSwitching, this, this.onStateSwitching);
    };
    NewClass.prototype.onStateSwitching = function (event) {
        if (event.state == 0) {
            this.jianYanLabel.node.color = this.huiSe;
            this.tiaoNode.color = this.huiSe;
        }
        else {
            this.jianYanLabel.node.color = this.heiSe;
            this.tiaoNode.color = this.heiSe;
        }
    };
    __decorate([
        property(cc.Label)
    ], NewClass.prototype, "bianJiLabel", void 0);
    __decorate([
        property(cc.Label)
    ], NewClass.prototype, "jianYanLabel", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "tiaoNode", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=TitleNode.js.map
        