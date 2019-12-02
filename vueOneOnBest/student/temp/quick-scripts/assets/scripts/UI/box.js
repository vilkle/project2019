(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/box.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3f6a6tpYMFJmJIQngIRBAN+', 'box', __filename);
// scripts/UI/box.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.main = null;
        _this.falseSP = null;
        _this.endSP = null;
        _this.text = '';
        _this.right = 0;
        _this.disabled = true;
        _this.buXuGuanBi = false;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.handleClose = function () {
        if (this.disabled)
            return;
        if (this.buXuGuanBi)
            return;
        this.node.destroy();
        // 派发close事件
        var eventClose = new cc.Event.EventCustom('close', true);
        this.node.dispatchEvent(eventClose);
    };
    NewClass.prototype.setRihgtAction = function () {
        this.main.node.active = true;
        this.falseSP.node.active = false;
        this.endSP.node.active = false;
        this.main.setAnimation(0, 'true', false);
    };
    NewClass.prototype.setFaultAction = function () {
        this.main.node.active = false;
        this.falseSP.node.active = true;
        this.endSP.node.active = false;
        this.falseSP.setAnimation(0, 'false', false);
    };
    NewClass.prototype.setEndAction = function () {
        this.main.node.active = false;
        this.falseSP.node.active = false;
        this.endSP.node.active = true;
        this.endSP.setAnimation(0, 'in', false);
        this.endSP.addAnimation(0, 'stand', true);
    };
    NewClass.prototype.setLabelAction = function () {
        this.label.node.opacity = 0;
        this.label.string = this.text;
        this.label.node.runAction(cc.fadeIn(0.3));
        //文字显示后，启用按钮
        this.disabled = false;
    };
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onLoad = function () { };
    NewClass.prototype.start = function () {
        var _this = this;
        //动画开始时禁用按钮
        this.disabled = true;
        if (this.right == 0) {
            this.setRihgtAction();
        }
        else if (this.right == 2) {
            this.setFaultAction();
        }
        else if (this.right == 1) {
            this.setEndAction();
        }
        setTimeout(function () {
            _this.setLabelAction();
        }, 1300);
    };
    __decorate([
        property(cc.Label)
    ], NewClass.prototype, "label", void 0);
    __decorate([
        property(sp.Skeleton)
    ], NewClass.prototype, "main", void 0);
    __decorate([
        property(sp.Skeleton)
    ], NewClass.prototype, "falseSP", void 0);
    __decorate([
        property(sp.Skeleton)
    ], NewClass.prototype, "endSP", void 0);
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
        //# sourceMappingURL=box.js.map
        