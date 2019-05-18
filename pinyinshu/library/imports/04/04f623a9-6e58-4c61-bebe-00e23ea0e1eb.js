"use strict";
cc._RF.push(module, '04f62OpblhMYb6+AOI+oOHr', 'TipUI');
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