(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/FadeUIPlugin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2fe78Vyt/NInb1oC42+tpUk', 'FadeUIPlugin', __filename);
// scripts/Utils/FadeUIPlugin.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var FadeUIPlugin = /** @class */ (function (_super) {
    __extends(FadeUIPlugin, _super);
    function FadeUIPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delay = 0;
        return _this;
    }
    FadeUIPlugin.prototype.onLoad = function () {
        var action0 = cc.delayTime(this.delay);
        var action1 = cc.scaleTo(0.5, 2, 2); // - 72 * index);
        var action2 = cc.scaleTo(0.5, 0, 0); // - 72 * index);
        var action3 = cc.scaleTo(0.5, 1, 1); // - 72 * index);
        //let action4 = cc.fadeOut(0.5);
        var action = cc.sequence(action0, action1, action2, action3);
        this.node.runAction(action);
    };
    __decorate([
        property
    ], FadeUIPlugin.prototype, "delay", void 0);
    FadeUIPlugin = __decorate([
        ccclass
    ], FadeUIPlugin);
    return FadeUIPlugin;
}(cc.Component));
exports.FadeUIPlugin = FadeUIPlugin;

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
        //# sourceMappingURL=FadeUIPlugin.js.map
        