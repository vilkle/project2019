"use strict";
cc._RF.push(module, 'df13ad6CdtFhp9uucAXsIC/', 'GameMain');
// scripts/Main/GameMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var NetWork_1 = require("../Http/NetWork");
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
        var Request = new Object();
        Request = NetWork_1.NetWork.getInstance().GetRequest();
        NetWork_1.NetWork.courseware_id = Request["id"];
        NetWork_1.NetWork.title_id = Request["title_id"];
        NetWork_1.NetWork.user_id = Request["user_id"];
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