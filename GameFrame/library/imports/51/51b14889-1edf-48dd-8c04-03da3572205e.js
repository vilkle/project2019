"use strict";
cc._RF.push(module, '51b14iJHt9I3YwEA9o1ciBe', 'DaAnData');
// scripts/Data/DaAnData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.checkpointsNum = 0; //关卡数目
        this.countsArr = [];
        this.goodsArr = [];
        this.submitEnable = false;
    }
    DaAnData.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    };
    return DaAnData;
}());
exports.DaAnData = DaAnData;

cc._RF.pop();