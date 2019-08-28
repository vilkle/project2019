"use strict";
cc._RF.push(module, '65c35Ym/oRKD6h93ZiyEFOw', 'GameData');
// scripts/Data/GameData.ts

"use strict";
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