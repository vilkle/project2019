(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/shader/ShaderManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd1e19w9UihLPqSppbSLUBq8', 'ShaderManager', __filename);
// scripts/shader/ShaderManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShaderLab_1 = require("./ShaderLab");
var ShaderMaterial_1 = require("./ShaderMaterial");
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["Default"] = 0] = "Default";
    ShaderType[ShaderType["Gray"] = 1] = "Gray";
    ShaderType[ShaderType["GrayScaling"] = 100] = "GrayScaling";
    ShaderType[ShaderType["Stone"] = 101] = "Stone";
    ShaderType[ShaderType["Ice"] = 102] = "Ice";
    ShaderType[ShaderType["Frozen"] = 103] = "Frozen";
    ShaderType[ShaderType["Mirror"] = 104] = "Mirror";
    ShaderType[ShaderType["Poison"] = 105] = "Poison";
    ShaderType[ShaderType["Banish"] = 106] = "Banish";
    ShaderType[ShaderType["Vanish"] = 107] = "Vanish";
    ShaderType[ShaderType["Invisible"] = 108] = "Invisible";
    ShaderType[ShaderType["Blur"] = 109] = "Blur";
    ShaderType[ShaderType["GaussBlur"] = 110] = "GaussBlur";
    ShaderType[ShaderType["Dissolve"] = 111] = "Dissolve";
    ShaderType[ShaderType["Fluxay"] = 112] = "Fluxay";
    ShaderType[ShaderType["FluxaySuper"] = 113] = "FluxaySuper";
    ShaderType[ShaderType["Pure"] = 114] = "Pure";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
var ShaderManager = /** @class */ (function () {
    function ShaderManager() {
    }
    ShaderManager.useShader = function (sprite, shader) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            console.warn('Shader not surpport for canvas');
            return;
        }
        // 隐藏后重新显示错误修正
        //if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
        if (!sprite || !sprite.spriteFrame) {
            return;
        }
        if (shader > ShaderType.Gray) {
            var name = ShaderType[shader];
            var lab = ShaderLab_1.default[name];
            if (!lab) {
                console.warn('Shader not defined', name);
                return;
            }
            cc.dynamicAtlasManager.enabled = false;
            var material = new ShaderMaterial_1.default(name, lab.vert, lab.frag, lab.defines || []);
            var texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            var sp = sprite;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            sprite.setState(shader);
        }
    };
    return ShaderManager;
}());
exports.default = ShaderManager;

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
        //# sourceMappingURL=ShaderManager.js.map
        