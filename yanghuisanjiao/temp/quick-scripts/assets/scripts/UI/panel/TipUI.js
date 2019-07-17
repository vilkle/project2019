(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/panel/TipUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '04f62OpblhMYb6+AOI+oOHr', 'TipUI', __filename);
// scripts/UI/panel/TipUI.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseUI_1 = require("../BaseUI");
var Tip_1 = require("../Item/Tip");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TipUI = /** @class */ (function (_super) {
    __extends(TipUI, _super);
    function TipUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tipPrefab = null;
        _this.tipPool = [];
        return _this;
    }
    TipUI.prototype.showTip = function (message) {
        for (var j = 0; j < this.tipPool.length; j++) {
            if (!this.tipPool[j].isReady()) {
                this.tipPool[j].reset();
                this.tipPool[j].playTip(message);
                return;
            }
        }
        for (var i = 0; i < this.tipPool.length; ++i) {
            if (this.tipPool[i] != null && this.tipPool[i].isReady()) {
                this.tipPool[i].node.setSiblingIndex(200);
                this.tipPool[i].playTip(message);
                return;
            }
        }
        cc.log("create tip");
        var TipNode = cc.instantiate(this.tipPrefab);
        TipNode.parent = this.node;
        var tip = TipNode.getComponent(Tip_1.Tip);
        this.tipPool.push(tip);
        tip.playTip(message);
    };
    TipUI.className = "TipUI";
    __decorate([
        property(cc.Prefab)
    ], TipUI.prototype, "tipPrefab", void 0);
    TipUI = __decorate([
        ccclass
    ], TipUI);
    return TipUI;
}(BaseUI_1.BaseUI));
exports.TipUI = TipUI;

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
        //# sourceMappingURL=TipUI.js.map
        