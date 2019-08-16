(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/shader/ShaderMaterial.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '70d0bHxjchOgLl9oySm1PPr', 'ShaderMaterial', __filename);
// scripts/shader/ShaderMaterial.ts

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
Object.defineProperty(exports, "__esModule", { value: true });
var renderEngine = cc.renderer.renderEngine;
var Material = renderEngine.Material;
var ShaderMaterial = /** @class */ (function (_super) {
    __extends(ShaderMaterial, _super);
    function ShaderMaterial(name, vert, frag, defines) {
        var _this = _super.call(this, false) || this;
        var renderer = cc.renderer;
        var lib = renderer._forward._programLib;
        !lib._templates[name] && lib.define(name, vert, frag, defines);
        _this._init(name);
        return _this;
    }
    ShaderMaterial.prototype._init = function (name) {
        var renderer = renderEngine.renderer;
        var gfx = renderEngine.gfx;
        var pass = new renderer.Pass(name);
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique(['transparent'], [
            { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
            { name: 'color', type: renderer.PARAM_COLOR4 },
            { name: 'pos', type: renderer.PARAM_FLOAT3 },
            { name: 'size', type: renderer.PARAM_FLOAT2 },
            { name: 'time', type: renderer.PARAM_FLOAT },
            { name: 'num', type: renderer.PARAM_FLOAT }
        ], [pass]);
        this._texture = null;
        this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        this._pos = { x: 0.0, y: 0.0, z: 0.0 };
        this._size = { x: 0.0, y: 0.0 };
        this._time = 0.0;
        this._num = 0.0;
        this._effect = this.effect = new renderer.Effect([mainTech], {
            'color': this._color,
            'pos': this._pos,
            'size': this._size,
            'time': this._time,
            'num': this._num
        }, []);
        this._mainTech = mainTech;
    };
    ShaderMaterial.prototype.setTexture = function (texture) {
        this._texture = texture;
        this._texture.update({ flipY: false, mipmap: false });
        this._effect.setProperty('texture', texture.getImpl());
        this._texIds['texture'] = texture.getId();
    };
    ShaderMaterial.prototype.setColor = function (r, g, b, a) {
        this._color.r = r;
        this._color.g = g;
        this._color.b = b;
        this._color.a = a;
        this._effect.setProperty('color', this._color);
    };
    ShaderMaterial.prototype.setPos = function (x, y, z) {
        this._pos.x = x;
        this._pos.y = y;
        this._pos.z = z;
        this._effect.setProperty('pos', this._pos);
    };
    ShaderMaterial.prototype.setSize = function (x, y) {
        this._size.x = x;
        this._size.y = y;
        this._effect.setProperty('size', this._size);
    };
    ShaderMaterial.prototype.setTime = function (time) {
        this._time = time;
        this._effect.setProperty('time', this._time);
    };
    ShaderMaterial.prototype.setNum = function (num) {
        this._num = num;
        this._effect.setProperty('num', this._num);
    };
    return ShaderMaterial;
}(Material));
exports.default = ShaderMaterial;

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
        //# sourceMappingURL=ShaderMaterial.js.map
        