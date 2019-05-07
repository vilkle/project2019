(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Config/BaseConfigContainer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a9280QRTmRIUqfgpuhZqA92', 'BaseConfigContainer', __filename);
// scripts/Config/BaseConfigContainer.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseConfigContainer = /** @class */ (function () {
    function BaseConfigContainer() {
    }
    Object.defineProperty(BaseConfigContainer.prototype, "tag", {
        get: function () {
            return this.mTag;
        },
        set: function (value) {
            this.mTag = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseConfigContainer;
}());
exports.BaseConfigContainer = BaseConfigContainer;

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
        //# sourceMappingURL=BaseConfigContainer.js.map
        