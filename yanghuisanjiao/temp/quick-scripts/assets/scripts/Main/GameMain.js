(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Main/GameMain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df13ad6CdtFhp9uucAXsIC/', 'GameMain', __filename);
// scripts/Main/GameMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameMain = /** @class */ (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameMain.prototype.onLoad = function () {
        var loading = document.getElementById("loading-full");
        if (loading) {
            loading.style.display = "none";
        }
    };
    GameMain.prototype.start = function () {
    };
    GameMain.prototype.update = function (dt) {
    };
    GameMain = __decorate([
        ccclass
    ], GameMain);
    return GameMain;
}(cc.Component));
exports.GameMain = GameMain;

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
        //# sourceMappingURL=GameMain.js.map
        