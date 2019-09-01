(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Data/ListenerType.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8ea11Tcb4BI7ojchoTKxYZm', 'ListenerType', __filename);
// scripts/Data/ListenerType.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListenerType = /** @class */ (function () {
    function ListenerType() {
    }
    ListenerType.Test = "Test";
    ListenerType.GameStart = "GameStart";
    ListenerType.UpdateMainUI = "UpdateMainUI";
    ListenerType.LoopUpdate = "LoopUpdate";
    ListenerType.OnEndOfInput = "OnEndOfInput";
    ListenerType.OnDaAnShanChu = "OnDaAnShanChu";
    ListenerType.OnDaAnZengJia = "OnDaAnZengJia";
    ListenerType.OnEditStateSwitching = "OnEditStateSwitching";
    return ListenerType;
}());
exports.ListenerType = ListenerType;

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
        //# sourceMappingURL=ListenerType.js.map
        