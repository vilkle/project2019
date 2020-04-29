(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/BaseUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c6da4j3MGhPfIxwls9tY6iS', 'BaseUI', __filename);
// scripts/UI/BaseUI.ts

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
var ConstValue_1 = require("../Data/ConstValue");
var ListenerManager_1 = require("../Manager/ListenerManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BaseUI = /** @class */ (function (_super) {
    __extends(BaseUI, _super);
    function BaseUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BaseUI.prototype, "data", {
        get: function () {
            return this.mData;
        },
        set: function (value) {
            this.mData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseUI.prototype, "tag", {
        get: function () {
            return this.mTag;
        },
        set: function (value) {
            this.mTag = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseUI.getUrl = function () {
        cc.log(this.className);
        return ConstValue_1.ConstValue.PREFAB_UI_DIR + this.className;
    };
    BaseUI.prototype.onDestroy = function () {
        ListenerManager_1.ListenerManager.getInstance().removeAll(this);
    };
    BaseUI.prototype.onShow = function () {
        cc.log("BaseUI onShow");
    };
    BaseUI.className = "BaseUI";
    BaseUI = __decorate([
        ccclass
    ], BaseUI);
    return BaseUI;
}(cc.Component));
exports.BaseUI = BaseUI;

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
        //# sourceMappingURL=BaseUI.js.map
        