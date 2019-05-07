(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/BaseUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c6da4j3MGhPfIxwls9tY6iS', 'BaseUI', __filename);
// scripts/UI/BaseUI.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue_1 = require("../Data/ConstValue");
var ListenerManager_1 = require("../Manager/ListenerManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BaseUI = /** @class */ (function (_super) {
    __extends(BaseUI, _super);
    function BaseUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
        