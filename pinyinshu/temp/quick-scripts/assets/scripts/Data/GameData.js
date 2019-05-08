(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/GameData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '65c35Ym/oRKD6h93ZiyEFOw', 'GameData', __filename);
// scripts/Data/GameData.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**游戏数据类 */
var GameData = /** @class */ (function () {
    function GameData() {
    }
    GameData.getInstance = function () {
        if (this.instance == null) {
            this.instance = new GameData();
        }
        return this.instance;
    };
    return GameData;
}());
exports.GameData = GameData;

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
        //# sourceMappingURL=GameData.js.map
        