"use strict";
cc._RF.push(module, 'dbe38Eu9bZCbJeHFtq3EVSq', 'ShaderComponent');
// scripts/shader/ShaderComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ShaderManager_1 = require("./ShaderManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode;
var NeedUpdate = [ShaderManager_1.ShaderType.Fluxay, ShaderManager_1.ShaderType.FluxaySuper];
var ShaderComponent = /** @class */ (function (_super) {
    __extends(ShaderComponent, _super);
    function ShaderComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._shader = ShaderManager_1.ShaderType.Default;
        _this._color = cc.color();
        _this._start = 0;
        return _this;
    }
    Object.defineProperty(ShaderComponent.prototype, "shader", {
        get: function () { return this._shader; },
        set: function (type) {
            this._shader = type;
            this._applyShader();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderComponent.prototype, "material", {
        get: function () { return this._material; },
        enumerable: true,
        configurable: true
    });
    ShaderComponent.prototype.start = function () {
        this.getComponent(cc.Sprite).setState(0);
        this._applyShader();
    };
    ShaderComponent.prototype.update = function (dt) {
        if (!this._material)
            return;
        this._setShaderColor();
        this._setShaderTime(dt);
    };
    ShaderComponent.prototype._applyShader = function () {
        var shader = this._shader;
        var sprite = this.getComponent(cc.Sprite);
        var material = ShaderManager_1.default.useShader(sprite, shader);
        this._material = material;
        this._start = 0;
        var clr = this._color;
        clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        if (!material)
            return;
        switch (shader) {
            case ShaderManager_1.ShaderType.Blur:
            case ShaderManager_1.ShaderType.GaussBlur:
                material.setNum(0.03); //0-0.1
                break;
            default:
                break;
        }
        this._setShaderColor();
    };
    ShaderComponent.prototype._setShaderColor = function () {
        var node = this.node;
        var c0 = node.color;
        var c1 = this._color;
        var r = c0.getR(), g = c0.getG(), b = c0.getB(), a = node.opacity;
        var f = !1;
        if (c1.getR() !== r) {
            c1.setR(r);
            f = !0;
        }
        if (c1.getG() !== g) {
            c1.setG(g);
            f = !0;
        }
        if (c1.getB() !== b) {
            c1.setB(b);
            f = !0;
        }
        if (c1.getA() !== a) {
            c1.setA(a);
            f = !0;
        }
        f && this._material.setColor(r / 255, g / 255, b / 255, a / 255);
    };
    ShaderComponent.prototype._setShaderTime = function (dt) {
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            var start = this._start;
            if (start > 65535)
                start = 0;
            start += dt;
            this._material.setTime(start);
            this._start = start;
        }
    };
    __decorate([
        property({ type: cc.Enum(ShaderManager_1.ShaderType), visible: false })
    ], ShaderComponent.prototype, "_shader", void 0);
    __decorate([
        property({ type: cc.Enum(ShaderManager_1.ShaderType) })
    ], ShaderComponent.prototype, "shader", null);
    ShaderComponent = __decorate([
        ccclass,
        executeInEditMode,
        requireComponent(cc.Sprite)
    ], ShaderComponent);
    return ShaderComponent;
}(cc.Component));
exports.default = ShaderComponent;

cc._RF.pop();